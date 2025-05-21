<?php
include('../config.php');
session_start();
 
$enteredby = 0;$accountId=0;$userempid = 0;
 
/** script to get defect chart data */
if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
    $userempid = $_SESSION["userempid"];
}
$projarr['data'] = array();



$projectId = (isset($_GET['projectId']) && !empty($_GET['projectId'])? $_GET['projectId'] : "");
$releaseId = (isset($_GET['releaseId'])  && !empty($_GET['releaseId'])?  $_GET['releaseId'] : "");
$testsuiteId = (isset($_GET['testsuiteId'])  && !empty($_GET['testsuiteId'])? $_GET['testsuiteId'] : "");


$where = "";$fwhere="";
if($projectId !=""){
	$where = $where." and find_in_set(s_rtm.projectId,$projectId) ";
	
}

if($releaseId !=""){
	$where = $where." and find_in_set(s_rtm.releaseId,$releaseId) ";
}

if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$where .= " and s_rtm.projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."' and accountId = '".$accountId."')";

}

////// defect report
$mainarr = array();
$sql = "SELECT  s_rtm_module as module,
	count(DISTINCT covered.rtmId) tccount, COUNT(DISTINCT s_rtm.s_rtm_id) rtmcount,
  ROUND(
    (COUNT(DISTINCT covered.rtmId) / COUNT(DISTINCT s_rtm.s_rtm_id)) * 100, 
    2
  ) AS test_coverage_percentage
FROM 
  s_rtm
LEFT JOIN (
    SELECT DISTINCT rtmId 
    FROM s_rtm_testcase
    WHERE rtmId IS NOT NULL   and testcaseId IS NOT NULL and testcaseId !='' and testcaseId !='0'
) AS covered ON (covered.rtmId = s_rtm.s_rtm_id  ) where s_rtm.accountId = ? $where group by s_rtm.s_rtm_module";
//echo $sql;   
$stmt = mysqli_prepare($conn,$sql);
mysqli_stmt_bind_param($stmt, 's', $accountId);
mysqli_stmt_execute($stmt);
$sqlDefectmodule = mysqli_stmt_get_result($stmt);


$seriesdata = array();
$categories = array();
$rtmarr = array();
$tcarr = array();
$coveragearr = array();
while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
        $rtmcount = isset($moddata['rtmcount']) ? ($moddata['rtmcount']) : 0 ;
	$tccount = isset($moddata['tccount']) ? ($moddata['tccount']) : 0 ;
	$test_coverage_percentage = isset($moddata['test_coverage_percentage']) ? ($moddata['test_coverage_percentage']) : 0 ;
	$Modulename = $moddata['module'] !=null && $moddata['module'] !="" ? $moddata['module'] : "Not Specified";
	
	$categories[] = $Modulename;
//	$seriesdata[] = $test_coverage_percentage;
	$rtmarr[] = $rtmcount;
	$tcarr[] = $tccount;
	$coveragearr[] = $test_coverage_percentage;

    
}


$seriesdata[] = array("name"=>"Total Testcase","data"=>$tcarr);
$seriesdata[] = array("name"=>"Total RTM","data"=>$rtmarr);
$seriesdata[] = array("name"=>"Testcase Coverage","data"=>$coveragearr);

// Close the statement
mysqli_stmt_close($stmt);
$mainarr = array("seriesdata"=>$seriesdata,"categories"=>$categories);
echo json_encode($mainarr,JSON_NUMERIC_CHECK);

?>
