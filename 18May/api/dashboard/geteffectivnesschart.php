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



$projectId = (isset($_POST['projectId']) && !empty($_POST['projectId'])? implode(",", $_POST['projectId']) : "");
$releaseId = (isset($_POST['releaseId'])  && !empty($_POST['releaseId'])? implode(",", $_POST['releaseId']) : "");


$where = "";$fwhere="";
if($projectId !=""){
	$where = $where." and tc.projectId in ($projectId) ";
	
}

if($releaseId !=""){
	$where = $where." and tc.releaseId in ($releaseId) ";
}
$fwhere = $where;
if($activityId !=""){

	$actarr = explode(",", $activityId);
	if(isset($actarr) && !empty($actarr)){
		$actlen = count($actarr);
		for($i =0; $i<$actlen; $i++){
			$where = " AND find_in_set('".$actarr[$i]."',tc.s_t_activityIds)  ";
		}
	}
}
$iterationwhere = "";
if($testsuiteId !=""){		
		$where = $where." and exec.testsuiteId in ($testsuiteId) ";

}
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$where .= " and tc.projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."' and accountId = '".$accountId."')";

}

////// defect report
$mainarr = array();
$sql = "SELECT 
    tc.s_t_module AS module,
    SUM(CASE WHEN exec.defectId > 0 THEN 1 ELSE 0 END) AS totaldefects,
    COUNT(1) AS executedcount
FROM 
    s_testexecution exec
JOIN 
    s_testcase tc ON tc.s_t_id = exec.testcaseId
WHERE 
    exec.accountId = ? 
    AND exec.s_st_id IN (
        SELECT MAX(s_st_id) 
        FROM s_testexecution 
        WHERE accountId = '".$accountId."' 
        $where 
        GROUP BY testcaseId
    )
    AND exec.s_st_testresult IN ('Pass','Fail') $where
GROUP BY 
    tc.s_t_module
ORDER BY 
    executedcount DESC  ";
//    echo $sql;
$stmt = mysqli_prepare($conn,$sql);
mysqli_stmt_bind_param($stmt, 's', $accountId);
mysqli_stmt_execute($stmt);
$sqlDefectmodule = mysqli_stmt_get_result($stmt);


$seriesdata = array();
$categories = array();

while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
	$totaldefects = isset($moddata['totaldefects']) ? (int)($moddata['totaldefects']) : 0 ;
	$executedcount = isset($moddata['executedcount']) ? (int)($moddata['executedcount']) : 0 ;
	$Modulename = $moddata['module'] !=null && $moddata['module'] !="" ? $moddata['module'] : "Not Specified";
	
	$categories[] = $Modulename;
	$percentage = round((($totaldefects/$executedcount) *100),2);
	$seriesdata[] = $percentage;

    
}
// Close the statement
mysqli_stmt_close($stmt);
$mainarr = array("seriesdata"=>$seriesdata,"categories"=>$categories);
echo json_encode($mainarr,JSON_NUMERIC_CHECK);

?>
