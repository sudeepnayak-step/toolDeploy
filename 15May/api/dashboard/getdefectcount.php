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
$activityId = (isset($_POST['activityId'])  && !empty($_POST['activityId'])? implode(",", $_POST['activityId']) : "");
$defectstatusId = (isset($_POST['defectstatusId'])  && !empty($_POST['defectstatusId'])? implode(",", $_POST['defectstatusId']) : "");
$defectdate = (isset($_POST['defectdate']) && !empty($_POST['defectdate']) ?  date('Y-m-d 23:59:59', strtotime(str_replace('/', '-', $_POST['defectdate']))) : date('Y-m-d 23:59:59'));


$where = "";
if($projectId !=""){
		$where = $where." and projectId in ($projectId) ";
}

if($releaseId !=""){
		$where = $where." and releaseId in ($releaseId) ";
}


if($defectstatusId !=""){
		$where = $where." and defectstatusId in ($defectstatusId) ";
}

$aExtra = "";
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$aExtra = " and projectId in (select projectId from s_project_members where employeeId = '".$userempid."' ) ";
}

$total_defects = 0;$open_defects = 0;$closed_defects = 0;$critical_defects = 0;

$defectsql = "SELECT
    COUNT(*) AS total_defects,
   IFNULL(SUM(ds.s_ds_name LIKE 'Open%'), 0) AS open_defects,
    IFNULL(SUM(ds.s_ds_name LIKE 'Closed%'), 0) AS closed_defects,
       IFNULL(SUM(s_d_severity IN ('High')),0) AS critical_defects
	FROM s_defect d left JOIN s_defectstatusmaster ds ON ds.s_ds_id = d.defectstatusId where d.accountId = ? and d.s_d_createdtime <= ? ".$where." $aExtra";

$stmt = mysqli_prepare($conn,$defectsql);

mysqli_stmt_bind_param($stmt, 'ss', $accountId,$defectdate);
mysqli_stmt_execute($stmt);
$defectdata = mysqli_stmt_get_result($stmt);


while($ddata = mysqli_fetch_assoc($defectdata)){
	$total_defects = $ddata['total_defects'];
	$open_defects = $ddata['open_defects'];
	$closed_defects = $ddata['closed_defects'];
	$critical_defects = $ddata['critical_defects'];
}



$projcount['total_defects'] = $total_defects;
$projcount['open_defects'] = $open_defects;
$projcount['closed_defects'] = $closed_defects;
$projcount['critical_defects'] = $critical_defects;
echo json_encode($projcount);
?>
