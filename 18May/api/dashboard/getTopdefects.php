<?php
include('../config.php');
session_start();
 
$enteredby = 0;$accountId=0;$userempid = 0;
/** this script return the top defect data */ 

if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
    $userempid = $_SESSION["userempid"];
}
$projarr['data'] = array();


$projectId = (isset($_POST['projectId']) && !empty($_POST['projectId'])?  $_POST['projectId'] : "");
$releaseId = (isset($_POST['releaseId'])  && !empty($_POST['releaseId'])? $_POST['releaseId'] : "");
$activityId = (isset($_POST['activityId'])  && !empty($_POST['activityId'])? $_POST['activityId'] : "");
$defectstatusId = (isset($_POST['defectstatusId'])  && !empty($_POST['defectstatusId'])? $_POST['defectstatusId'] : "");
$defectdate = (isset($_POST['defectdate']) && !empty($_POST['defectdate']) ? date('Y-m-d 23:59:59', strtotime(str_replace('/', '-', $_POST['defectdate']))) : date('Y-m-d 23:59:59'));

$where = "";
if($projectId !=""){
		$where = $where." and projectId in ($projectId) ";
}else{

echo json_encode($projarr);
exit;
}
if($releaseId !=""){
		$where = $where." and releaseId in ($releaseId) ";
}


if($defectstatusId !=""){
		$where = $where." and defectstatusId in ($defectstatusId) ";
}


$projectExtra = "";
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$projectExtra .= " and bugs.projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."' )";
}

$defectsql = "SELECT bugs.*,
	concat(IFNULL(assignTBl.s_e_fname,''),' ',IFNULL(assignTBl.s_e_mname,''),' ',IFNULL(assignTBl.s_e_lname,'')) as assigned_to,
	concat(IFNULL(reporterTBl.s_e_fname,''),' ',IFNULL(reporterTBl.s_e_mname,''),' ',IFNULL(reporterTBl.s_e_lname,'')) as reported_by ,
	IFNULL(dstatus.s_ds_name,'') as defectstatus ,
	(case when dstatus.s_ds_name LIKE 'Open%' then IFNULL(DATEDIFF('".$defectdate."',s_d_createdtime),0) else '-' end)as ageingdays 
	 from s_defect AS bugs
								LEFT JOIN s_employees as assignTBl on assignTBl.s_e_id = bugs.s_d_assignto
							 	LEFT JOIN s_employees as reporterTBl on (reporterTBl.userId = bugs.s_d_enteredby and  reporterTBl.accountId =  ? )
							 	LEFT JOIN s_defectstatusmaster as dstatus on dstatus.s_ds_id = bugs.defectstatusId
							  	where  bugs.accountId = ? and s_d_createdtime <= ? ".$where." ".$projectExtra ." order by s_d_id desc ";

$stmt = mysqli_prepare($conn,$defectsql);

mysqli_stmt_bind_param($stmt, 'sss',$accountId, $accountId,$defectdate);
mysqli_stmt_execute($stmt);
$sqldata = mysqli_stmt_get_result($stmt);

while($mdata = mysqli_fetch_assoc($sqldata)){
	$reported_by = (trim($mdata['reported_by'])  == "" ? "Admin" : $mdata['reported_by'] );
	$projarr['data'][] = array($mdata['s_d_id'],$mdata['s_d_defectnum'],$mdata['s_d_shortdesc'],$mdata['defectstatus'],$mdata['s_d_severity'],$mdata['s_d_priority'],
	$reported_by,$mdata['assigned_to'],1,$mdata['ageingdays']);
}
mysqli_stmt_close($stmt);

echo json_encode($projarr);
?>
