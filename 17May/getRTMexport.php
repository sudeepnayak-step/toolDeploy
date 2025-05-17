<?php
error_reporting(E_ALL); // Report all errors
ini_set('display_errors', 1); // Display errors on the screen
ini_set('display_startup_errors', 1); // Display startup errors

include('config.php');
//include_once("excel/xlsxwriter.class.php");

include_once("xlsxwriter.class.php");
 /** This PHP script retrieves the data from testcase and export it in excel. 
 * It formats the data and returns it in JSON format. */

session_start();
 
$enteredby = 0;$accountId=0;$userempid = 0; 

if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
    $userempid = $_SESSION["userempid"];
}


$styleitem = array('font-style'=>'bold','color'=>'#ffffff','fill'=>"#1b55e2",'border'=>'top,bottom', 'halign'=>'center');
$rtmwhere = "";
$projectId = (isset($_POST['projectId']) && !empty($_POST['projectId']) ? $_POST['projectId'] : "");
$releaseId = (isset($_POST['releaseId'])  && !empty($_POST['releaseId'])? $_POST['releaseId'] : "");
$ids = (isset($_POST['ids'])  && !empty($_POST['ids'])? $_POST['ids'] : "");
$status = (isset($_POST['status'])  && !empty($_POST['status'])? $_POST['status'] : "");

if($projectId !=""){
        $rtmwhere = $rtmwhere." and rtm.projectId in ($projectId) ";
}

if($releaseId !=""){
        $rtmwhere = $rtmwhere." and rtm.releaseId in ($releaseId) ";
}


if($rtmId !=""){
    $rtmwhere = $rtmwhere." and rtm.s_rtm_id in ($rtmId) ";
}

if($status !=""){
$statusarr = explode(",", $status);
$status = "'" . implode ( "', '", $statusarr ) . "'";
$rtmwhere .= " and rtm.s_rtm_status in ($status) ";
}

if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
$rtmwhere .= " and rtm.projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."'  and accountId = '".$accountId."') or s_p_enteredby = '".$enteredby."' and accountId = '".$accountId."')";
}
$sql = "SELECT rtm.*,
IFNULL(p.s_p_name,'') as projectname,
IFNULL(r.s_r_name,'') as releaseNum,
concat(IFNULL(a2.s_e_fname,''),' ',IFNULL(a2.s_e_mname,''),' ',IFNULL(a2.s_e_lname,'')) as author,
concat(IFNULL(a3.s_e_fname,''),' ',IFNULL(a3.s_e_mname,''),' ',IFNULL(a3.s_e_lname,'')) as reviewer 
from s_rtm rtm 
left join s_project p on p.s_p_id = rtm.projectId 
left join s_release r on r.s_r_id = rtm.releaseId 
 left JOIN s_employees a2 on a2.userId = rtm.s_rtm_author and rtm.s_rtm_author != '0'
 left JOIN s_employees a3 on a3.s_e_id = rtm.s_rtm_reviewer and rtm.s_rtm_reviewer !='0'
where rtm.accountId = ?  $rtmwhere
order by rtm.s_rtm_id asc";

$stmt = mysqli_prepare($conn,$sql);    
mysqli_stmt_bind_param($stmt, "i",$accountId);
mysqli_stmt_execute($stmt);
$sqldata = mysqli_stmt_get_result($stmt);

$rtmarr = array();
$rtmidsarr = array();
while($data = mysqli_fetch_assoc($sqldata)){


    $author = "Admin";
    if(trim($data['author']) !=""){
        $author = $data['author'];
    }
    $rtmidsarr[] = $data['s_rtm_id'];
    $rtmarr[] = array($data['s_rtm_reqnum'],$data['projectname'],$data['releaseNum'],$data['s_rtm_summary'],$data['s_rtm_description'],$data['s_rtm_status'],
    $author,
    (!empty(trim($data['reviewer'])) ? $data['reviewer'] : "-"),
    (isset($data['s_rtm_createddate']) && ($data['s_rtm_createddate'] != "0000-00-00") ? date("d/m/Y H:m a",strtotime($data['s_rtm_createddate'])) : "-"));
}

$rtmheader = array(
    'Requirement ID'=>'string',
    'Project'=>'string',
    'Release'=>'string',
    'Summary'=>'string',
    'Description'=>'string',
    'Status'=>'string',
    'Author'=>'string',
    'Reviewer'=>'string',
    'Created At'=>'string',
    'Testcase'=>'string',
    'Defect'=>'string',
);
$rtmtcids = array(); $rtmdefectids = array();

$writer = new XLSXWriter();
$writer->writeSheetHeader('Requirement', $rtmheader,$styleitem );
// foreach($rtmarr as $row)
// 	$writer->writeSheetRow('Requirement', $row);



$testcaseheader = array(
    'Requirement ID'=>'string',
    'Test Case ID'=>'string',
    'Test Scenario ID'=>'string',
    'Project'=>'string',
    'Release'=>'string',
    'Test Type'=>'string',
    'Test Mode'=>'string',
    'Module'=>'string',
    'Sub Module'=>'string',
    'Author'=>'string',
    'Reviewer'=>'string',
    'TC Description'=>'string',
    'TS Description'=>'string',
    'Steps'=>'string',
    'Expected Result'=>'string',
    'Pre-Condition'=>'string',
    'Test Data'=>'string',
    'Comment'=>'string',
    'Testcase Category'=>'string',
    'Test Result'=>'string',
    'Iteration Count'=>'string'
);
$tcsql = "SELECT rtc.*,
IFNULL(rtm.s_rtm_reqnum,'0') as reqnum,
IFNULL(tc.s_t_id,'0') as s_t_id,
concat(IFNULL(a1.s_e_fname,''),' ',IFNULL(a1.s_e_mname,''),' ',IFNULL(a1.s_e_lname,'')) as assignto,
concat(IFNULL(a2.s_e_fname,''),' ',IFNULL(a2.s_e_mname,''),' ',IFNULL(a2.s_e_lname,'')) as author,
concat(IFNULL(a3.s_e_fname,''),' ',IFNULL(a3.s_e_mname,''),' ',IFNULL(a3.s_e_lname,'')) as reviewer,
IFNULL(p.s_p_name,'') as projectname,
IFNULL(r.s_r_name,'') as releaseNum,
IFNULL(c.s_cat_name,'') as categoryname ,
-- IFNULL(tc.s_t_testtype,'') as testtype,
IFNULL(tc.s_t_testmode,'') as testtype,
IFNULL(tc.s_t_testmode,'') as testmode,
IFNULL(tc.s_t_precondition,'') as precond,
IFNULL(tc.s_t_steps,'') as steps,
IFNULL(tc.s_t_testdata,'') as testdata,
IFNULL(tc.s_t_comment,'') as comment,
IFNULL(tc.s_t_expectedresult,'') as expectedresult,

IFNULL(tc.s_t_testscenarionum,'') as testscenarioId,
IFNULL(tc.s_t_testcasenum,'') as testcaseId,
IFNULL(tc.s_t_id,'') as testcaseautoId,
IFNULL(tc.s_t_module,'') as module,
IFNULL(tc.s_t_submodule,'') as submodule,
IFNULL(tc.s_t_testcasedesc,'') as testcasedesc,
IFNULL(tc.s_t_testscenariodesc,'') as testscenariodesc,
IFNULL(result_max.s_f_testresult,'') as testresult,
IFNULL(result_max.s_f_actualresult,'') as actualresult
 from s_rtm_testcase rtc
	left join s_rtm rtm on rtm.s_rtm_id = rtc.rtmId
 join s_testcase tc on tc.s_t_id = rtc.testcaseId
 
join s_project p on p.s_p_id = tc.projectId 
join s_release r on r.s_r_id = tc.releaseId  
left join s_tccategorymaster c on c.s_cat_id = tc.s_t_category 
left JOIN s_employees a1 on a1.s_e_id = tc.s_t_assignto and tc.s_t_assignto !='0'
left JOIN s_employees a2 on a2.userId = tc.s_t_author and tc.s_t_author !='0'
left JOIN s_employees a3 on a3.s_e_id = tc.s_t_reviewer and tc.s_t_author !='0' 

left join (SELECT t1.* FROM s_testcasefinal t1 WHERE t1. s_f_id  = (SELECT t2.s_f_id  FROM s_testcasefinal t2  WHERE t2.testcaseId = t1.testcaseId and t2. s_f_updatetime <= now() order by s_f_id desc limit 1  )
) result_max on result_max.testcaseId = rtc.testcaseId
	where rtc.accountId = ? and rtc.rtmId in (".implode(",",$rtmidsarr).") and rtc.testcaseId !='0' order by rtc.s_rt_id asc";
    // echo $tcsql;
$tcstmt = mysqli_prepare($conn,$tcsql);

mysqli_stmt_bind_param($tcstmt, "s",$accountId);
mysqli_stmt_execute($tcstmt);
$rtmtcdata = mysqli_stmt_get_result($tcstmt);

$rtmtcarr = array();
$rtmtcarr = array();
while($sdata = mysqli_fetch_assoc($rtmtcdata)){
    $activityname = "";
    if ($sdata['s_t_activityIds'] != "") {
        $activityIds = mysqli_real_escape_string($conn, $data['s_t_activityIds']);
        $chksql = "SELECT IFNULL(GROUP_CONCAT(s_a_name),'') AS activityname FROM s_activitymaster WHERE s_a_id IN ($activityIds) AND accountId = ?";
        $chkstmt = mysqli_prepare($conn, $chksql);
        mysqli_stmt_bind_param($chkstmt, "i", $accountId);
        mysqli_stmt_execute($chkstmt);
        $chkresult = mysqli_stmt_get_result($chkstmt);

        while ($actdata = mysqli_fetch_assoc($chkresult)) {
            $activityname = $actdata['activityname'];
        }
        mysqli_stmt_close($chkstmt);
    }
    
    $author = "Admin";
    if(trim($sdata['author']) !=""){
        $author = $sdata['author'];
    }
    $iterationsqldata = mysqli_query($conn,"SELECT 1 from s_testcaserun where testcaseId = '".$data['testcaseautoId']."' and accountId = '".$accountId."'  order by s_st_id desc ");
	$iterationcount = mysqli_num_rows($iterationsqldata);
    
    $rtmId = $sdata['reqnum'];
    if (!isset($rtmtcids[$rtmId])) {
        $rtmtcids[$rtmId] = []; // create the array if it doesn't exist
    }
    if (!in_array($sdata['testcaseId'], $rtmtcids[$rtmId])) {
        $rtmtcids[$rtmId][] = $sdata['testcaseId'];
    }
	$rtmtcarr[] = array($sdata['reqnum'],$sdata['testcaseId'],
    $sdata['testscenarioId'],
    $sdata['projectname'],
    $sdata['releaseNum'],
    $activityname,
    $sdata['testmode'],
    $sdata['module'],
    $sdata['submodule'],       
    $author,
    $sdata['reviewer'],
    $sdata['testcasedesc'],
    $sdata['testscenariodesc'],
    $sdata['steps'],
    $sdata['expectedresult'],
    $sdata['precond'],
    $sdata['testdata'],
    $sdata['comment'],
    $sdata['categoryname'],
    $sdata['testresult'],
    $iterationcount
);
}

$writer->writeSheetHeader('Testcase', $testcaseheader,$styleitem);
foreach($rtmtcarr as $row)
	$writer->writeSheetRow('Testcase', $row);

/*** defect */   


$defectheader = array(
    'Requirement ID'=>'string',
    'Defect ID'=>'string',
    'Testcase ID'=>'string',
    'Project'=>'string',
    'Release'=>'string',
    'Module'=>'string',
    'Sub Module'=>'string',
    'Defetc Type'=>'string',
    'Severity'=>'string',
    'Priority'=>'string',
    'Defect Status'=>'string',
    'Short Description'=>'string',
    'Detailed Description'=>'string',
    'Test Data'=>'string',
    'Steps'=>'string',
    'Expected Result'=>'string',
    'Actual Result'=>'string'
);
$defectsql = "SELECT rtc.*,
IFNULL(rtm.s_rtm_reqnum,'0') as reqnum, 
IFNULL(d.s_d_id,'0') as defectautoId,
IFNULL(p.s_p_name,'') as projectname,
IFNULL(r.s_r_name,'') as releaseNum,
	IFNULL(d.s_d_shortdesc,'') as shortdesc,
	IFNULL(d.s_d_longdesc,'') as longdesc,
	IFNULL(d.s_d_severity,'') as severity,
	IFNULL(d.s_d_priority,'') as priority,
	IFNULL(d.s_d_defectnum,'') as defectId,
	IFNULL(d.s_d_module,'') as module,
	IFNULL(d.s_d_submodule,'') as submodule,
	IFNULL(d.s_d_testdata,'') as testdata,
	IFNULL(d.s_d_steps,'') as steps,
	IFNULL(d.s_d_expectedresult,'') as expectedresult,
	IFNULL(d.s_d_actualresult,'') as actualresult,
	IFNULL(d.s_d_submodule,'') as submodule,
	IFNULL(tc.s_t_testcasenum,'') as testcasenum,
	IFNULL(ds.s_ds_name,'') as defectstatus,
	IFNULL(dt.s_dt_name,'') as defecttype
	 from s_rtm_testcase rtc
	left join s_rtm rtm on rtm.s_rtm_id = rtc.rtmId
	 join s_defect d on d.s_d_id = rtc.defectId
 join s_testcase tc on tc.s_t_id = d.testcaseId
 
join s_project p on p.s_p_id = tc.projectId 
join s_release r on r.s_r_id = tc.releaseId 
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId 

	where rtc.accountId = ? and rtc.rtmId in (".implode(",",$rtmidsarr).") and rtc.defectId !='0'

	order by rtc.s_rt_id asc
";
// echo $defectsql; exit;
$defectstmt = mysqli_prepare($conn, $defectsql);
mysqli_stmt_bind_param($defectstmt,  "s",$accountId);
mysqli_stmt_execute($defectstmt);
$defectresult = mysqli_stmt_get_result($defectstmt);


$rtmdefetarr = array();
while($sdata = mysqli_fetch_assoc($defectresult)){
    

	$rtmdefetarr[] = array($sdata['reqnum'],$sdata['defectId'],$sdata['testcasenum'],
    $sdata['projectname'],$sdata['releaseNum'],$sdata['module'],$sdata['submodule'],
    $sdata['defecttype'],$sdata['severity'],$sdata['priority'],$sdata['defectstatus'],
    $sdata['shortdesc'],$sdata['longdesc'],
    $sdata['testdata'],$sdata['steps'],
    $sdata['expectedresult'],$sdata['actualresult']);
    
    $rtmId = $sdata['reqnum'];
    if (!isset($rtmdefectids[$rtmId])) {
        $rtmdefectids[$rtmId] = []; // create the array if it doesn't exist
    }
    if (!in_array($sdata['defectId'], $rtmdefectids[$rtmId])) {
        $rtmdefectids[$rtmId][] = $sdata['defectId'];
    }
}

$writer->writeSheetHeader('Defect', $defectheader,$styleitem);
foreach($rtmdefetarr as $row)
	$writer->writeSheetRow('Defect', $row);



foreach($rtmarr as $row){
    $temptestcaseIds = ($row && $row[0] && $rtmtcids[$row[0]]) ? $rtmtcids[$row[0]] : "";
    $tempdefectIds = ($row && $row[0] && $rtmdefectids[$row[0]]) ? $rtmdefectids[$row[0]] : "";
    
    // Convert array to comma-separated string if needed
    if (is_array($temptestcaseIds)) {
        $temptestcaseIds = implode(",", $temptestcaseIds);
    }
    // Convert array to comma-separated string if needed
    if (is_array($tempdefectIds)) {
        $tempdefectIds = implode(",", $tempdefectIds);
    }
    // Append to row
    $row[] = $temptestcaseIds;
    $row[] = $tempdefectIds;
    $writer->writeSheetRow('Requirement', $row);}

    
$filename = "Requirement Traceability Matrix.xlsx";

// Specify the directory where the file should be saved
$directory =  '/var/www/html/export';

// Ensure the directory exists and is writable
if (!is_dir($directory)) {
    mkdir($directory, 0777, true); // Create the directory if it doesn't exist
}

// Construct the full file path
$filename = $directory . "/Requirement Traceability Matrix Export.xlsx";

// Ensure the directory exists and is writable
if (!is_dir($directory)) {
    mkdir($directory, 0777, true);
}
if (!is_writable($directory)) {
    die("Error: Directory is not writable: $directory");
}

// Check if a previous file exists
if (file_exists($filename)) {
    unlink($filename); // Remove the old file
}

// Generate the file
try {
    $writer->writeToFile($filename);
    if (!file_exists($filename)) {
        die("Error: File was not created.");
    }
} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}

//echo "File successfully created at: $filename";
//$writer->writeToFile($filename);

// Check if the file exists
if (file_exists($filename)) {
    // Force download
    header('Content-Description: File Transfer');
    header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    header("Content-Disposition: attachment; filename=" . basename($filename));
    header("Content-Transfer-Encoding: binary");
    header("Expires: 0");
    header("Pragma: public");
    header("Cache-Control: must-revalidate, post-check=0, pre-check=0");

    // Optional: Set Content-Length only if filesize is successful
    $fileSize = filesize($filename);
    if ($fileSize !== false) {
        header('Content-Length: ' . $fileSize);
    }

    ob_clean();
    flush();
    readfile($filename);

    // Delete the file after download
    unlink($filename);
} else {
    // Handle error gracefully
    http_response_code(404);
    echo "File not found.";
}
exit(0);
//force download
header('Content-Description: File Transfer');
header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
header("Content-Disposition: attachment; filename=".basename($filename));
header("Content-Transfer-Encoding: binary");
header("Expires: 0");
header("Pragma: public");
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
//header('Content-Length: ' . filesize($filename)); //Remove

ob_clean();
flush();

readfile($filename);
unlink($filename);
exit(0);



?>
