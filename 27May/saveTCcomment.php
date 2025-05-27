<?php
include('config.php');
//require_once('../PHPMailer/class.phpmailer.php');
session_start();
 /** this script saves the comment for RTM */
$enteredby = 0;$accountId = 0;
 
if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
}
if($_SERVER['REQUEST_METHOD'] === 'POST'){


	$testcaseId = (isset($_POST['testcaseId']) ? $_POST['testcaseId'] : "0");
	$commentId = (isset($_POST['commentId']) ? $_POST['commentId'] : "0");
	$comment = "";
	if(isset($_POST['newcomment'])){
		$comment = mysqli_real_escape_string($conn,$_POST['newcomment']);
	}
	if(isset($_POST['newcomment'.$commentId])){
		$comment = mysqli_real_escape_string($conn,$_POST['newcomment'.$commentId ]);
	}

	$auditlogDesc = "added the comment for ";$emailids = "";$empids = "";
	$projectId = 0;
	$defectdata = mysqli_query($conn,"SELECT * from s_testcase where s_t_id = '".$testcaseId."' and accountId ='".$accountId."'  ");

	while($ddata = mysqli_fetch_assoc($defectdata)){
		$projectId = $ddata['projectId'];
		$testcaseIdstr = $ddata['s_t_testcasenum'];
	}
	$empdata = mysqli_query($conn,"SELECT IFNULL(group_concat(s_e_emailid),'') as emailids, IFNULL(group_concat(s_e_id),'') as empids from  s_employees where s_e_activestatus = 'Active' and s_e_id in(select employeeId from s_project_members where projectId ='".$projectId."' and accountId ='".$accountId."' ) and accountId ='".$accountId."'   Order by s_e_id desc");

	while($edata = mysqli_fetch_assoc($empdata)){
		$emailids = $edata['emailids'];
		$empids = $edata['empids'];
	}
	$auditlogDesc = "added the comment for $testcaseIdstr";
	// Prepare the SQL statement
	$sql = "INSERT INTO s_tc_comments (testcaseId, s_dc_key, s_dc_comment, accountId, s_dc_enteredby) VALUES (?, ?, ?, ?, ?)";
	$stmt = mysqli_prepare($conn, $sql);

	// Bind the parameters
	mysqli_stmt_bind_param($stmt, "sssss", $testcaseId, $commentId, $comment, $accountId, $enteredby);

	// Execute the statement
	mysqli_stmt_execute($stmt);

	// Close the statement
	mysqli_stmt_close($stmt);

	if($emailids !=""){
		$notificationSql = "insert into s_notifications (`s_n_viewer`, `s_n_employees`,`s_n_recordid`,`s_n_recordnum`,`s_n_desc`,`accountId`,`s_n_enteredby`,s_n_emailflag,s_n_module   ) values ('','".$empids."','".$testcaseId."','".$testcaseIdstr."','".$auditlogDesc."','".$accountId."','".$enteredby."','0','TC') ";
		
		mysqli_query( $conn, $notificationSql);

	}
}

