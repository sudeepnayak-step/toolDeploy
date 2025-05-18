<?php
include('config.php');
session_start();
 
$userempid = 0;$accountId = 0;$enteredby =0;
/** This PHP script retrieves and filters RTM (Requirement Traceability Matrix) 
 * data from a database based on user inputs and session information. 
 * It formats the data and returns it in JSON format. */ 
if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
}

if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Employee"){
	if(isset($_SESSION["userempid"])){
    $userempid = $_SESSION["userempid"];
}
}

$defectwhere = "";

$projectId = (isset($_POST['projectId']) && !empty($_POST['projectId'])?  $_POST['projectId'] : "");
$releaseId = (isset($_POST['releaseId'])  && !empty($_POST['releaseId'])? $_POST['releaseId'] : "");
$rtmId = (isset($_POST['rtmId'])  && !empty($_POST['rtmId'])? $_POST['rtmId'] : "");
$status = (isset($_POST['status'])  && !empty($_POST['status'])? $_POST['status'] : "");


if($projectId !=""){
		$defectwhere = $defectwhere." and rtm.projectId in ($projectId) ";
}

if($releaseId !=""){
		$defectwhere = $defectwhere." and rtm.releaseId in ($releaseId) ";
}

if($rtmId !=""){
		$defectwhere = $defectwhere." and rtm.s_rtm_id in ($rtmId) ";
}

if($status !=""){
	$statusarr = explode(",", $status);
	$status = "'" . implode ( "', '", $statusarr ) . "'";
	$defectwhere .= " and rtm.s_rtm_status in ($status) ";
}

if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$defectwhere .= " and rtm.projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."'  and accountId = '".$accountId."') or s_p_enteredby = '".$enteredby."' and accountId = '".$accountId."')";
}
$sql = "SELECT rtm.*,
	IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_name,'') as releaseNum,
	concat(IFNULL(a2.s_e_fname,''),' ',IFNULL(a2.s_e_mname,''),' ',IFNULL(a2.s_e_lname,'')) as author,
	concat(IFNULL(a3.s_e_fname,''),' ',IFNULL(a3.s_e_mname,''),' ',IFNULL(a3.s_e_lname,'')) as reviewer 
	from s_rtm rtm 
	left join s_project p on p.s_p_id = rtm.projectId 
	left join s_release r on r.s_r_id = rtm.releaseId 
 	left JOIN s_employees a2 on a2.userId = rtm.s_rtm_author and rtm.s_rtm_author != '0'
 	left JOIN s_employees a3 on a3.s_e_id = rtm.s_rtm_reviewer and rtm.s_rtm_reviewer !='0'
	where rtm.accountId = ?  $defectwhere
	order by rtm.s_rtm_id asc";
	
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $accountId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$projarr['data'] = array();
while($data = mysqli_fetch_assoc($result)){

	$author = "Admin";
	if(trim($data['author']) !=""){
		$author = $data['author'];
	}
	$projarr['data'][] = array($data['s_rtm_id'],$data['s_rtm_reqnum'],$data['projectname'],$data['releaseNum'],$data['s_rtm_module'],html_entity_decode(strip_tags($data['s_rtm_summary'])),$data['s_rtm_description'],$data['s_rtm_status'],
		$author,
		(!empty(trim($data['reviewer'])) ? $data['reviewer'] : "-"),
		(isset($data['s_rtm_createddate']) && ($data['s_rtm_createddate'] != "0000-00-00") ? date("d/m/Y H:m a",strtotime($data['s_rtm_createddate'])) : "-"),
		$data['s_rtm_id']);
}

echo json_encode($projarr);
?>
