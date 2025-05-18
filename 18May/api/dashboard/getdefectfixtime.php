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
$sql = "SELECT 
  s_d_module AS module,
  COUNT(*) AS total_defects,
  ROUND(SUM(TIMESTAMPDIFF(HOUR, s_d_createdtime, s_d_updatetime)) / 24, 2) AS total_resolution_time_days
FROM 
  s_defect
WHERE  accountId = ?  ".$where." 
 
  AND defectstatusId in (select s_ds_id from s_defectstatusmaster where s_ds_name LIKE 'Close%')
  AND s_d_updatetime > s_d_createdtime
GROUP BY 
  s_d_module
ORDER BY 
  total_resolution_time_days DESC;";
$stmt = mysqli_prepare($conn,$sql);
mysqli_stmt_bind_param($stmt, 's', $accountId);
mysqli_stmt_execute($stmt);
$sqlDefectmodule = mysqli_stmt_get_result($stmt);


$seriesdata = array();

while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
	$Modulename = $moddata['module'];
	$category[] = $Modulename;
	
	$seriesdata[] = $moddata['total_resolution_time_days'] !=null ? $moddata['total_resolution_time_days'] : 0;
}

// Close the statement
mysqli_stmt_close($stmt);
$mainarr = array("categories"=>$category,"seriesdata"=>$seriesdata);
echo json_encode($mainarr,JSON_NUMERIC_CHECK);

?>
