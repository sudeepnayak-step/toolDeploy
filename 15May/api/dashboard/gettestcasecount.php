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

$projectId = (isset($_POST['projectId']) && !empty($_POST['projectId'])? implode(",", $_POST['projectId']) : "");
$releaseId = (isset($_POST['releaseId'])  && !empty($_POST['releaseId'])? implode(",", $_POST['releaseId']) : "");


$where = "";$fwhere="";
if($projectId !=""){
	$where = $where." and projectId in ($projectId) ";
	
}

if($releaseId !=""){
	$where = $where." and releaseId in ($releaseId) ";
}
$fwhere = $where;
if($activityId !=""){

	$actarr = explode(",", $activityId);
	if(isset($actarr) && !empty($actarr)){
		$actlen = count($actarr);
		for($i =0; $i<$actlen; $i++){
			$where = " AND find_in_set('".$actarr[$i]."',s_t_activityIds)  ";
		}
	}
}
$iterationwhere = "";
if($testsuiteId !=""){		
		$where = $where." and s_t_id in (select testcaseId from s_testexecution where testsuiteId in ($testsuiteId) and accountId = '".$accountId."') ";
	        $fwhere = $fwhere." and testcaseId in  (select testcaseId from s_testexecution where testsuiteId in ($testsuiteId) and accountId = '".$accountId."') ";
		$iterationwhere = $iterationwhere." and testsuiteId in ($testsuiteId) ";
}
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$where .= " and projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."' and accountId = '".$accountId."')";
	$fwhere .= " and projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."' and accountId = '".$accountId."')";
}
$total_testcase = 0;$passtc = 0;$failedtc = 0;$inprogresstc = 0;
$testcasesql = "SELECT COUNT(*) AS total_testcases FROM s_testcase where accountId = ? ".$where." ";
 // where accountId = ? and s_d_createdtime <= ? ".$where." $aExtra";

$stmt = mysqli_prepare($conn,$testcasesql);

mysqli_stmt_bind_param($stmt, 's', $accountId,);
mysqli_stmt_execute($stmt);
$defectdata = mysqli_stmt_get_result($stmt);

while($ddata = mysqli_fetch_assoc($defectdata)){
	$total_testcase = $ddata['total_testcases'];
}

$resulttestcasesql = "SELECT ".
"  SUM(CASE WHEN s_f_testresult = 'Pass' THEN 1 ELSE 0 END) AS total_passed, ".
"  SUM(CASE WHEN s_f_testresult = 'Fail' THEN 1 ELSE 0 END) AS total_failed, ".
"  SUM(CASE WHEN s_f_testresult = 'Block' THEN 1 ELSE 0 END) AS total_block ".
"FROM ( ".
"  SELECT tf1.testcaseId, tf1.s_f_testresult ".
"  FROM s_testcasefinal tf1 ".
"  JOIN ( ".
"      SELECT testcaseId, MAX(s_f_id) AS max_id ".
"      FROM s_testcasefinal ".
"      WHERE s_f_testresult IS NOT NULL AND s_f_testresult != '' AND accountId = ? $fwhere ".
"      GROUP BY testcaseId ".
"  ) tf2 ON tf1.testcaseId = tf2.testcaseId AND tf1.s_f_id = tf2.max_id ".
" WHERE tf1.accountId = ? ".
") AS latest";
 // where accountId = ? and s_d_createdtime <= ? ".$where." $aExtra";

$resultstmt = mysqli_prepare($conn,$resulttestcasesql);

mysqli_stmt_bind_param($resultstmt, 'ss', $accountId,$accountId);
mysqli_stmt_execute($resultstmt);
$resultdata = mysqli_stmt_get_result($resultstmt);

while($ddata = mysqli_fetch_assoc($resultdata)){
	$passtc = $ddata['total_passed'];
	$failedtc = $ddata['total_failed'];
	$blocktc = $ddata['total_block'];
}

$projcount['total_testcase'] = $total_testcase;
$projcount['passtc'] = $passtc;
$projcount['failedtc'] = $failedtc;
$projcount['blocktc'] = $blocktc;
echo json_encode($projcount);
?>
