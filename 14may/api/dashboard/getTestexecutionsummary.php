<?php
include('../config.php');
session_start();
 
$enteredby = 0;$accountId = 0;$userempid = 0;
 
/** this script return the test execution summary data */
if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $userempid = $_SESSION["userempid"];
    $accountId = $_SESSION["accountId"];
}
$projarr['data'] = array();


$projectId = (isset($_GET['projectId']) && !empty($_GET['projectId'])? $_GET['projectId'] : "");
$releaseId = (isset($_GET['releaseId'])  && !empty($_GET['releaseId'])? $_GET['releaseId'] : "");
$activityId = (isset($_GET['activityId'])  && !empty($_GET['activityId'])? $_GET['activityId'] : "");
$testsuiteId = (isset($_GET['testsuiteId'])  && !empty($_GET['testsuiteId'])? $_GET['testsuiteId'] : "");
$testcasedate = (isset($_GET['testcasedate']) && !empty($_GET['testcasedate']) ?  date('Y-m-d 23:59:59', strtotime(str_replace('/', '-', $_GET['testcasedate']))) : date('Y-m-d 23:59:59'));

$where = "";
if($projectId !=""){
	$where = $where." and projectId in ($projectId) ";
}else{

echo json_encode($projarr);
exit();
}

if($releaseId !=""){
	$where = $where." and releaseId in ($releaseId) ";
}

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
		$iterationwhere = $iterationwhere." and testsuiteId in ($testsuiteId) ";
}
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$where .= " and projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."' and accountId = '".$accountId."')";
	
}
$stmt = mysqli_prepare($conn,"SELECT distinct(s_t_module) as module from s_testcase where accountId = ? and  s_t_createdtime <= ? ".$where);

mysqli_stmt_bind_param($stmt, 'ss', $accountId,$testcasedate);
mysqli_stmt_execute($stmt);
$sqldata = mysqli_stmt_get_result($stmt);

while($mdata = mysqli_fetch_assoc($sqldata)){
	$totalexecution = 0;
	$totaltestcase = 0;
	$passCount = 0;
	$failCount = 0;
	$NACount = 0;
	$BlockedCount = 0;
	$No_RunCount = 0;
	$onholdCount = 0;
	$inprogressCount = 0;
	$deferredCount = 0;
	
	$sqlexecutiondataarray = array();
	$module = $mdata['module'];
	$tcstmt = mysqli_prepare($conn,"SELECT IFNULL(count(*),0) as cnt from s_testcase where accountId = ? and   s_t_createdtime <= ? and s_t_module = '".$module."' ".$where);
	mysqli_stmt_bind_param($tcstmt, 'ss',$accountId, $testcasedate);
	mysqli_stmt_execute($tcstmt);
	$sqlalltc = mysqli_stmt_get_result($tcstmt);

	while($tcdata = mysqli_fetch_assoc($sqlalltc)){		
		$totaltestcase = $tcdata['cnt'];
	}
	mysqli_stmt_close($tcstmt);

	$tcstmt = mysqli_prepare($conn,"SELECT DISTINCT(s_t_id) as tId from s_testcase where  accountId = ? and s_t_createdtime <= ? and s_t_module = '".$module."' ".$where);
	mysqli_stmt_bind_param($tcstmt, 'ss',$accountId, $testcasedate);
	mysqli_stmt_execute($tcstmt);
	$sql2 = mysqli_stmt_get_result($tcstmt);
	$idstring = "";
	while($tdata = mysqli_fetch_assoc($sql2)){		
 		array_push($sqlexecutiondataarray, $tdata['tId']);
 		if($idstring == ""){
 			$idstring = "'".$tdata['tId']."'";
 		}else{
 			$idstring = $idstring.",'".$tdata['tId']."'";
 		}
	}
	mysqli_stmt_close($tcstmt);

	$iterationcount = 0;
	$iterationsqldata = mysqli_query($conn,"SELECT IFNULL(max(s_st_iteration),0) as iteration from s_testcaserun where testcaseId in(".$idstring.") and accountId = '".$accountId."'  $iterationwhere order by s_st_id desc ");
	while($itdata = mysqli_fetch_assoc($iterationsqldata)){
		$iterationcount = $itdata['iteration'];
	}
	$sql3 = mysqli_query($conn,"SELECT  * from s_testcasefinal where  accountId = '".$accountId."' and s_f_id in (select max(s_f_id) from s_testcasefinal where  accountId = '".$accountId."' and testcaseId in(".$idstring.") group by testcaseId)");
 	while($tedata = mysqli_fetch_assoc($sql3)){		
 		$totalexecution++;
		if($tedata['s_f_testresult'] == "Pass"){
		 	$passCount++;
		}else if($tedata['s_f_testresult'] == "Fail"){
			$failCount++;
		}else if(in_array($tedata['s_f_testresult'], array("NA","CE_NA"))){
			$NACount++;
		}else if(in_array($tedata['s_f_testresult'], array("Block","Blocked","CE_Bug"))){
			$BlockedCount++;
		}else if(in_array($tedata['s_f_testresult'], array("Pending","No Run","Yet to Begin","Not Executed"))){
			$No_RunCount++;
		}else if($tedata['s_f_testresult'] == "On Hold"){
			$onholdCount++;
		}else if($tedata['s_f_testresult'] == "In Progress"){
			$inprogressCount++;
		}else if(in_array($tedata['s_f_testresult'], array("Deferred","CE_FR"))){
			$deferredCount++;
		}
	}
	$totalexecuted = $passCount + $failCount;
	$Scoped_Test_cases = $totaltestcase-$NACount;

	$executedpercent = ($Scoped_Test_cases > 0 ? (round(($totalexecuted/$Scoped_Test_cases ) *100,2) ) : 0);
	$passedpercent = ($totalexecuted > 0 ? (round(($passCount/$totalexecuted ) *100,2) ) : 0);
	$failedpercent = ($totalexecuted > 0 ? (round(($failCount/$totalexecuted ) *100,2) ) : 0);
	$cebugpercent = ($Scoped_Test_cases > 0 ? (round((($BlockedCount)/$Scoped_Test_cases ) *100,2) ) : 0);
	$norunpercent = ($Scoped_Test_cases > 0 ? (round(($No_RunCount/$Scoped_Test_cases ) *100,2) ) : 0);
	$napercent = ($Scoped_Test_cases > 0 ? (round(($NACount/$totaltestcase ) *100,2) ) : 0);
	$deferredpercent = ($Scoped_Test_cases > 0 ? (round(($deferredCount/$Scoped_Test_cases ) *100,2) ) : 0);
	$block_percent = ($Scoped_Test_cases > 0 ? (round(($BlockedCount/$Scoped_Test_cases ) *100,2) ) : 0);
	$onhold_percent = ($Scoped_Test_cases > 0 ? (round(($onholdCount/$Scoped_Test_cases ) *100,2) ) : 0);
	$inprogress_percent = ($Scoped_Test_cases > 0 ? (round(($inprogressCount/$Scoped_Test_cases ) *100,2) ) : 0);

	$projarr['data'][] = array($module,$totaltestcase,$Scoped_Test_cases,$totalexecuted,$iterationcount,$passCount,$failCount,$inprogressCount,$No_RunCount,$BlockedCount,$deferredCount,$NACount,$onholdCount,$executedpercent,$passedpercent,$failedpercent,$inprogress_percent,$norunpercent,$block_percent,$onhold_percent,$deferredpercent,$napercent);
}
mysqli_stmt_close($stmt);

echo json_encode($projarr);
?>
