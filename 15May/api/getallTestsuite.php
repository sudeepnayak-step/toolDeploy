<?php
include('config.php');
session_start();
 
$enteredby = 0;$accountId=0;$userempid = 0;
    /** This PHP script retrieves the test suite data from a database. 
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

$where = "";

$projectId = (isset($_POST['projectId']) && !empty($_POST['projectId'])? $_POST['projectId'] : "");
$releaseId = (isset($_POST['releaseId'])  && !empty($_POST['releaseId'])? $_POST['releaseId'] : "");
$activityId = (isset($_POST['activityId'])  && !empty($_POST['activityId'])? $_POST['activityId'] : "");

if($projectId !=""){
		$where = $where." and ts.projectId in ($projectId) ";
}

if($releaseId !=""){
		$where = $where." and ts.releaseId in ($releaseId) ";
}
if($activityId !=""){
		$where = $where." and ts.activityId in ($activityId) ";
}

if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
$where .= " and ts.projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."'  and accountId = '".$accountId."') or s_p_enteredby = '".$enteredby."' and accountId = '".$accountId."')";
//	$where .=" and ( ts.s_ts_assignto = '".$userempid."' or ts.s_ts_enteredby  = '".$enteredby."' )  ";
}
$sql = "SELECT ts.*,
	concat(IFNULL(a1.s_e_fname,''),' ',IFNULL(a1.s_e_mname,''),' ',IFNULL(a1.s_e_lname,'')) as assignto,
	IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_name,'') as releaseNum,
	IFNULL(a.s_a_name,'') as activityname,
	IFNULL(a.s_a_code,'') as activitycode from s_testsuite ts 
	join s_project p on p.s_p_id = ts.projectId 
	join s_activitymaster a on a.s_a_id = ts.activityId 
	join s_release r on r.s_r_id = ts.releaseId 
 	left JOIN s_employees a1 on a1.s_e_id = ts.s_ts_assignto and ts.s_ts_assignto !='0' 
	WHERE ts.accountId = ? $where order by ts.s_ts_id asc";


$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i",$accountId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$projarr['data'] = array();
while($data = mysqli_fetch_assoc($result)){
	$projarr['data'][] = array($data['s_ts_id'],$data['s_ts_name'],
		$data['s_ts_testsuitenum'],$data['projectname'],$data['releaseNum'],$data['activityname'],	
		(!empty(trim($data['assignto'])) ? $data['assignto'] : "-"),
		(!empty($data['s_ts_type']) ? $data['s_ts_type'] : "-"),
		(!empty($data['s_ts_description']) ? $data['s_ts_description'] : "-"),
		$data['s_ts_id']);
}

echo json_encode($projarr);
?>
