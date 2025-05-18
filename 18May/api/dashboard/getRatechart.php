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
			$where = " and  d.projectId = '$projectId' ";

		}else{
		$where = $where." and d.projectId = '$projectId' ";
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
			$where = " and  d.activityId = '$activityId' ";

		}else{
		$where = $where." and d.activityId = '$activityId' ";
	}
}

if($defectstatusId !="0"){
	if($where == ""){
			$where = " and  d.defectstatusId = '$defectstatusId' ";

		}else{
		$where = $where." and d.defectstatusId = '$defectstatusId' ";
	}
}

if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	if($where == ""){
		$where = " and d.projectId in (select projectId from s_project_members where employeeId = '".$userempid."' )";

	}else{
		$where = $where . " and d.projectId in (select projectId from s_project_members where employeeId = '".$userempid."' )";
	}
}
////// defect report
$mainarr = array();

$stmt = mysqli_prepare($conn,"SELECT sum(1) as totaldefect, 
	SUM(CASE WHEN ds.s_ds_name LIKE '%decline%'  THEN 1 ELSE 0 END) as rejectioncount,
	SUM(CASE WHEN ds.s_ds_name LIKE '%reopen%'  THEN 1 ELSE 0 END) as reopencount,
	SUM(CASE WHEN ds.s_ds_name LIKE '%close%'  THEN 1 ELSE 0 END) as closecount
	FROM s_defect d
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	where  d.accountId = ?  ".$where."    ");
mysqli_stmt_bind_param($stmt, 's', $accountId);
mysqli_stmt_execute($stmt);
$sqlDefectmodule = mysqli_stmt_get_result($stmt);


$rejectionseriesdata = array();
$reopenseriesdata = array();
$categories = array();

while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
	$totaldefect = $moddata['totaldefect'];
	$rejectioncount = $moddata['rejectioncount'];
	$reopencount = $moddata['reopencount'];
	$closecount = $moddata['closecount'];
	
	$rejectionseriesdata[] = array("name"=>"Total Defects","y"=>$totaldefect);
	$rejectionseriesdata[] = array("name"=>"Rejected Defects","y"=>$rejectioncount);
	$reopenseriesdata[] = array("name"=>"Total Defect Closed","y"=>$closecount);
	$reopenseriesdata[] = array("name"=>"Reopened Defects","y"=>$reopencount);

    
}
// Close the statement
mysqli_stmt_close($stmt);
$mainarr = array("rejectionseriesdata"=>$rejectionseriesdata,"reopenseriesdata"=>$reopenseriesdata);
echo json_encode($mainarr,JSON_NUMERIC_CHECK);

?>
