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
    $rtmarr[] = array($data['s_rtm_reqnum'],$data['projectname'],$data['releaseNum'],$data['s_rtm_module'],$data['s_rtm_submodule'],html_entity_decode(strip_tags($data['s_rtm_summary'])),html_entity_decode(strip_tags($data['s_rtm_description'])),$data['s_rtm_status'],
    $author,
    (!empty(trim($data['reviewer'])) ? $data['reviewer'] : "-"),
    (isset($data['s_rtm_createddate']) && ($data['s_rtm_createddate'] != "0000-00-00") ? date("d/m/Y H:m a",strtotime($data['s_rtm_createddate'])) : "-"));
}

$rtmheader = array(
    'Requirement ID'=>'string',
    'Project'=>'string',
    'Release'=>'string',
    'Module'=>'string',
    'Sub Module'=>'string',
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



$tcsql = "SELECT 
IFNULL(rtm.s_rtm_reqnum,'0') as reqnum,
IFNULL(tc.s_t_testcasenum,'') as testcaseId
 from s_rtm_testcase rtc
	left join s_rtm rtm on rtm.s_rtm_id = rtc.rtmId
 join s_testcase tc on tc.s_t_id = rtc.testcaseId
	where rtc.accountId = ? and rtc.rtmId in (".implode(",",$rtmidsarr).") and rtc.testcaseId !='0' order by rtc.s_rt_id asc";
    // echo $tcsql;
$tcstmt = mysqli_prepare($conn,$tcsql);

mysqli_stmt_bind_param($tcstmt, "s",$accountId);
mysqli_stmt_execute($tcstmt);
$rtmtcdata = mysqli_stmt_get_result($tcstmt);

$rtmtcarr = array();
$rtmtcarr = array();
while($sdata = mysqli_fetch_assoc($rtmtcdata)){

    $rtmId = $sdata['reqnum'];
    if (!isset($rtmtcids[$rtmId])) {
        $rtmtcids[$rtmId] = []; // create the array if it doesn't exist
    }
    if (!in_array($sdata['testcaseId'], $rtmtcids[$rtmId])) {
        $rtmtcids[$rtmId][] = $sdata['testcaseId'];
    }

}

// $writer->writeSheetHeader('Testcase', $testcaseheader,$styleitem);
// foreach($rtmtcarr as $row)
// 	$writer->writeSheetRow('Testcase', $row);

/*** defect */   


$defectsql = "SELECT 
IFNULL(rtm.s_rtm_reqnum,'0') as reqnum,
	IFNULL(d.s_d_defectnum,'') as defectId
	 from s_rtm_testcase rtc
	left join s_rtm rtm on rtm.s_rtm_id = rtc.rtmId
	 join s_defect d on d.s_d_id = rtc.defectId
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
    
    $rtmId = $sdata['reqnum'];
    if (!isset($rtmdefectids[$rtmId])) {
        $rtmdefectids[$rtmId] = []; // create the array if it doesn't exist
    }
    if (!in_array($sdata['defectId'], $rtmdefectids[$rtmId])) {
        $rtmdefectids[$rtmId][] = $sdata['defectId'];
    }
}

// $writer->writeSheetHeader('Defect', $defectheader,$styleitem);
// foreach($rtmdefetarr as $row)
// 	$writer->writeSheetRow('Defect', $row);



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
