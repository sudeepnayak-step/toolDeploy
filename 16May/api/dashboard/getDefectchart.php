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


$projectId = (isset($_GET['projectId']) && !empty($_GET['projectId'])? $_GET['projectId'] : "0");
$releaseId = (isset($_GET['releaseId'])  && !empty($_GET['releaseId'])? $_GET['releaseId'] : "0");
$activityId = (isset($_GET['activityId'])  && !empty($_GET['activityId'])? $_GET['activityId'] : "0");
$defectstatusId = (isset($_GET['defectstatusId'])  && !empty($_GET['defectstatusId'])? $_GET['defectstatusId'] : "0");
$defectdate = (isset($_GET['defectdate']) && !empty($_GET['defectdate']) ?  "'".date('Y-m-d 23:59:59', strtotime(str_replace('/', '-', $_GET['defectdate'])))."'" : 'NULL');

$where = "";
if($projectId !="0"){
	if($where == ""){
			$where = " and  projectId = '$projectId' ";

		}else{
		$where = $where." and projectId = '$projectId' ";
	}
}

if($releaseId !="0"){
		if($where == ""){
			$where = " and  releaseId = '$releaseId' ";

		}else{			
		$where = $where." and releaseId = '$releaseId' ";
		}
}

if($activityId !="0"){
	if($where == ""){
			$where = " and  activityId = '$activityId' ";

		}else{
		$where = $where." and activityId = '$activityId' ";
	}
}

if($defectstatusId !="0"){
	if($where == ""){
			$where = " and  defectstatusId = '$defectstatusId' ";

		}else{
		$where = $where." and defectstatusId = '$defectstatusId' ";
	}
}

if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	if($where == ""){
		$where = " and projectId in (select projectId from s_project_members where employeeId = '".$userempid."' )";

	}else{
		$where = $where . " and projectId in (select projectId from s_project_members where employeeId = '".$userempid."' )";
	}
}
////// defect report
$mainarr = array();

$stmt = mysqli_prepare($conn,"SELECT s_d_module as module
	FROM s_defect where  accountId = ?  ".$where." group by s_d_module ");

mysqli_stmt_bind_param($stmt, 's', $accountId);
mysqli_stmt_execute($stmt);
$sqlDefectmodule = mysqli_stmt_get_result($stmt);

$defectSeverityarr  = array();
			 	
$category = array();$higharr = array();$lowarr = array();$mediumarr = array();
$openarr = array(); $deferredarr = array(); $closearr = array();
$openclosearr = array();
$openCount = 0;$deferredCount = 0;$closeCount =0;$newCount = 0;
$ageingarr = array();
while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
	$Modulename = $moddata['module'];
	$newwhere = $where;
	if($newwhere == ""){
			$newwhere = " and  s_d_module = '".$Modulename."' ";

		}else{
		$newwhere = $newwhere." and s_d_module = '".$Modulename."' ";
	}
	$newwhere = $newwhere." and defectstatusId in (select s_ds_id from s_defectstatusmaster where s_ds_name LIKE 'Open%') ";
	$nDayscount  = 0;
	$category[] = $Modulename;//$dsdata['Module'];
	$sqlDefect = "SELECT  SUM(IFNULL(DATEDIFF(".$defectdate.",s_d_createdtime),0) ) as ddays  FROM s_defect  where  accountId = '".$accountId."' ".$newwhere;

	$sqlDefectData = mysqli_query($conn,$sqlDefect);
	while($dsdata = mysqli_fetch_assoc($sqlDefectData)){
		$nDayscount =  $dsdata['ddays'];
	}
	$ageingarr[] = $nDayscount;
}

// Close the statement
mysqli_stmt_close($stmt);
$mainarr = array("categories"=>$category,"Ageing"=>$ageingarr);
echo json_encode($mainarr,JSON_NUMERIC_CHECK);

?>
