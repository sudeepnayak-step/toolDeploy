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
 
$where = "";$tcwhere = "";
if($projectId !="0"){
	if($where == ""){
			$where = " and  d.projectId = '$projectId' ";
			$tcwhere = " and  t.projectId = '$projectId' ";
 
		}else{
		$where = $where." and d.projectId = '$projectId' ";
		$tcwhere = $tcwhere." and t.projectId = '$projectId' ";
	}
}
 
if($releaseId !="0"){
		if($where == ""){
			$where = " and  d.releaseId = '$releaseId' ";
			$tcwhere = " and  t.releaseId = '$releaseId' ";
 
		}else{			
		$where = $where." and d.releaseId = '$releaseId' ";
		$tcwhere = $tcwhere." and t.releaseId = '$releaseId' ";
		}
}
 
// if($activityId !="0"){
// 	if($where == ""){
// 			$where = " and  d.activityId = '$activityId' ";
 
// 		}else{
// 		$where = $where." and d.activityId = '$activityId' ";
// 	}
// }
 
// if($defectstatusId !="0"){
// 	if($where == ""){
// 			$where = " and  d.defectstatusId = '$defectstatusId' ";
 
// 		}else{
// 		$where = $where." and d.defectstatusId = '$defectstatusId' ";
// 	}
// }
 
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	if($where == ""){
		$where = " and d.projectId in (select projectId from s_project_members where employeeId = '".$userempid."' )";
		$tcwhere = " and t.tcwhere in (select projectId from s_project_members where employeeId = '".$userempid."' )";
 
	}else{
		$where = $where . " and d.projectId in (select projectId from s_project_members where employeeId = '".$userempid."' )";
		$tcwhere = $tcwhere . " and t.projectId in (select projectId from s_project_members where employeeId = '".$userempid."' )";
	}
}
////// defect report
$mainarr = array();
 
// $stmt = mysqli_prepare($conn,"SELECT 
//     d.s_d_module AS module,
//     COUNT(DISTINCT d.testcaseId) AS test_case_count,
//     COUNT(d.s_d_id) AS defect_count,
//     ROUND(
//         COUNT(d.s_d_id) / COUNT(DISTINCT d.testcaseId),
//         2
//     ) AS defect_density
// 	FROM s_defect d
// 	where  d.accountId = ?  ".$where."  group by d.s_d_module   ");
$stmt = mysqli_prepare($conn,"SELECT 
    d.s_d_module AS module,
    ( SELECT COUNT(*) 
        FROM s_testcase t 
        WHERE t.s_t_module = d.s_d_module 
          AND t.accountId = '".$accountId."' $tcwhere 
    ) AS test_case_count,
    COUNT(d.s_d_id) AS defect_count,
    ROUND(
        COUNT(d.s_d_id) / IFNULL(( SELECT COUNT(*) 
        FROM s_testcase t 
        WHERE t.s_t_module = d.s_d_module 
          AND t.accountId = '".$accountId."' $tcwhere
    ),0),
        2
    ) AS defect_density
	FROM s_defect d
	where  d.accountId = ?  ".$where."  group by d.s_d_module   ");
mysqli_stmt_bind_param($stmt, 's', $accountId);
mysqli_stmt_execute($stmt);
$sqlDefectmodule = mysqli_stmt_get_result($stmt);
 
 
$categories = array();
$tcarr = array(); $defectarr = array(); $densityarr = array();
 
while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
	$test_case_count = $moddata['test_case_count'];
	$defect_count = $moddata['defect_count'];
	$defect_density = $moddata['defect_density'];
	$Modulename = $moddata['module'] !=null && $moddata['module'] !="" ? $moddata['module'] : "Not Specified";
	$categories[] = $Modulename;
	$tcarr[] = $test_case_count;
	$defectarr[] = $defect_count;
	$densityarr[] = $defect_density;
 
    
}
 
$seriesdata[] = array("name"=>"Total Testcases","data"=>$tcarr);
$seriesdata[] = array("name"=>"Total Defect","data"=>$defectarr);
$seriesdata[] = array("name"=>"Defect Density","data"=>$densityarr);
// Close the statement
mysqli_stmt_close($stmt);
$mainarr = array("seriesdata"=>$seriesdata,"categories"=>$categories);
echo json_encode($mainarr,JSON_NUMERIC_CHECK);
 
?>