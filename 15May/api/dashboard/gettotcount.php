<?php
include('../config.php');
session_start();
 
$enteredby = 0;$accountId = 0;$userempid = 0;
/** this script return the project count, defect count, total test execution count for dashboard */ 

if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $userempid = $_SESSION["userempid"];
    $accountId = $_SESSION["accountId"];
}
$projcount = array();

$tottestexecute = 0;
$raiseddefectcount = 0;
$totalprojcount = 0;
$totmilestone = 0;

$projectExtra = "";
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$projectExtra = " and s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' )";
}
$sqldata = mysqli_query($conn,"SELECT IFNULL(count(1),0) as totproj from s_project where s_p_activestatus = 'Active' and accountId = '".$accountId."' $projectExtra ");
while($data = mysqli_fetch_assoc($sqldata)){
	$totalprojcount = $data['totproj'];
}


$aExtra = "";
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$aExtra = " and projectId in (select projectId from s_project_members where employeeId = '".$userempid."' )";
}
$sqldata = mysqli_query($conn,"SELECT IFNULL(count(1),0) as totmilestone from s_project_activity where s_pa_status = 'Complete' and accountId = '".$accountId."'  $aExtra");

while($data = mysqli_fetch_assoc($sqldata)){
	$totmilestone = $data['totmilestone'];
}




$aExtra = "";
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$aExtra = " and projectId in (select projectId from s_project_members where employeeId = '".$userempid."' ) ";
}
$sqldata = mysqli_query($conn,"SELECT IFNULL(count(1),0) as raiseddefectcount from s_defect where accountId = '".$accountId."' $aExtra");

while($data = mysqli_fetch_assoc($sqldata)){
	$raiseddefectcount = $data['raiseddefectcount'];
}


//$aExtra = "";
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
//	$aExtra = " and testsuiteId in (select s_ts_id from s_testsuite where s_ts_assignto = '".$userempid."') ";
//        $aExtra = " and testsuiteId in (select s_ts_id from s_testsuite where accountId = '".$accountId."'  and projectId in (select projectId from s_project_members where employeeId = '".$userempid."' ) )";
}
//$sqldata = mysqli_query($conn,"SELECT IFNULL(sum(CASE WHEN s_st_testresult = 'Pass' || s_st_testresult = 'Fail' THEN 1 ELSE 0 END),0) as tottestexecute from s_testexecution where accountId = '".$accountId."' $aExtra");
$sqldata = mysqli_query($conn,"SELECT  IFNULL(sum(CASE WHEN s_f_testresult = 'Pass' || s_f_testresult = 'Fail' THEN 1 ELSE 0 END),0) as tottestexecute from s_testcasefinal where  accountId = '206' and s_f_id in (select max(s_f_id) from s_testcasefinal where  accountId = '206' $aExtra  group by testcaseId) $aExtra");
while($data = mysqli_fetch_assoc($sqldata)){
	$tottestexecute = $data['tottestexecute'];
}

$projcount['tottestexecute'] = $tottestexecute;
$projcount['totalprojcount'] = $totalprojcount;
$projcount['raiseddefectcount'] = $raiseddefectcount;
$projcount['totmilestone'] = $totmilestone;
echo json_encode($projcount);
?>
