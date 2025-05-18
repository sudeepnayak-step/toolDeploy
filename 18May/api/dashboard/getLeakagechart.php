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

$stmt = mysqli_prepare($conn,"SELECT s_d_module as module, SUM(CASE WHEN s_d_environment = 'Production' THEN 1 ELSE 0 END) as productioncount,
SUM(CASE WHEN s_d_environment in( 'QA','UAT') THEN 1 ELSE 0 END) as testingcount
	FROM s_defect where  accountId = ?  ".$where."  group by s_d_module  ");
mysqli_stmt_bind_param($stmt, 's', $accountId);
mysqli_stmt_execute($stmt);
$sqlDefectmodule = mysqli_stmt_get_result($stmt);


$seriesdata = array();
$categories = array();
$testarr = array(); $prodarr = array();
while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
	$productioncount = $moddata['productioncount'];
	$testingcount = $moddata['testingcount'];
	$Modulename = $moddata['module'] !=null && $moddata['module'] !="" ? $moddata['module'] : "Not Specified";
	
	$categories[] = $Modulename;
	$testarr[] = $testingcount;
	$prodarr[] = $productioncount;

    
}
$seriesdata[] = array("name"=>"Testing","data"=>$testarr);
$seriesdata[] = array("name"=>"Production","data"=>$prodarr);
// Close the statement
mysqli_stmt_close($stmt);
$mainarr = array("seriesdata"=>$seriesdata,"categories"=>$categories);
echo json_encode($mainarr,JSON_NUMERIC_CHECK);

?>
