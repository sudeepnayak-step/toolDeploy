<?php
include('config.php');
session_start();
 
$enteredby = 0;$accountId = 0;
/** delete the record based on id */ 

if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
}


$msgarr = array();
if($_SERVER['REQUEST_METHOD'] === 'POST'){

$id = (isset($_POST['id']) ? $_POST['id'] : "0");
$formtype = isset($_POST['formtype']) ? $_POST['formtype'] :"";

if(!empty($id) && $id !="0") {


if($formtype == "ProjectActivity"){

	$sql = "DELETE FROM s_project_activity WHERE s_pa_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);
	if($stmt)
	{
		$sql1 = "DELETE FROM s_activity_members  where projactivityId = '".$id."' and accountId = '".$accountId."' ";
		mysqli_query( $conn, $sql1);

		$sql4 = "DELETE FROM s_testcaserun  where testcaseId in (select s_t_id from s_testcase  where find_in_set('".$id."',s_t_activityIds) and accountId = '".$accountId."') and accountId = '".$accountId."' ";
		$stmt4 = mysqli_query( $conn, $sql4);


		$sql4 = "DELETE FROM s_testexecution  where testcaseId in (select s_t_id from s_testcase  where find_in_set('".$id."',s_t_activityIds) and accountId = '".$accountId."') and accountId = '".$accountId."' ";
		$stmt4 = mysqli_query( $conn, $sql4);
		
		$sql5 = "DELETE FROM s_testsuite  where activityId = '".$id."' and accountId = '".$accountId."' ";
		$stmt5 = mysqli_query( $conn, $sql5);

		$sql6 = "DELETE FROM s_testcasefinal  where activityId = '".$id."' and accountId = '".$accountId."' ";
		$stmt6 = mysqli_query( $conn, $sql6);

		$sql7 = "DELETE FROM s_testcase  where find_in_set('".$id."',s_t_activityIds) and accountId = '".$accountId."' ";
		$stmt7 = mysqli_query( $conn, $sql7);

		$msgarr["status"] = "Success";
		$msgarr["message"] = "Project activity deleted successfully.";
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}

}else if($formtype == "Defect"){

	$sql = "DELETE FROM s_defect WHERE s_d_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);
	if($stmt)
	{

		$sql1 = "DELETE FROM s_rtm_testcase  where defectId = '".$id."' and accountId = '".$accountId."' ";
		$stmt1 = mysqli_query( $conn, $sql1);

		$msgarr["status"] = "Success";
		$msgarr["message"] = "Defect deleted successfully.";
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}
	
}else if($formtype == "RTM"){

	$sql = "DELETE FROM s_rtm WHERE s_rtm_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);
	if($stmt)
	{
		$sql1 = "DELETE FROM s_rtm_testcase  where rtmId = '".$id."' and accountId = '".$accountId."' ";
		$stmt1 = mysqli_query( $conn, $sql1);

		$msgarr["status"] = "Success";
		$msgarr["message"] = "RTM deleted successfully.";
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}
}else if($formtype == "Testcase"){

	$sql = "DELETE FROM s_testcase WHERE s_t_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);
	if($stmt)
	{

		$sql = "DELETE FROM s_testcase_steps  where testcaseId = '".$id."' and accountId = '".$accountId."' ";
		$stmt = mysqli_query( $conn, $sql);

		$msgarr["status"] = "Success";
		$msgarr["message"] = "Testcase deleted successfully.";
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}
}else if($formtype == "Testsuite"){

	$sql = "DELETE FROM s_testsuite WHERE s_ts_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);
	if($stmt)
	{
		$sql1 = "DELETE FROM s_tcstep_execution  where s_se_executionId in (select s_st_id from s_testexecution where testsuiteId = '".$id."' and accountId = '".$accountId."' ) and accountId = '".$accountId."' ";
		$stmt3 = mysqli_query( $conn, $sql1);
 
		$sql = "DELETE FROM s_testexecution  where testsuiteId = '".$id."' and accountId = '".$accountId."' ";
		$stmt1 = mysqli_query( $conn, $sql);

		$sql = "DELETE FROM s_testcaserun  where testsuiteId = '".$id."' and accountId = '".$accountId."' ";
		$stmt2 = mysqli_query( $conn, $sql);
		

		$msgarr["status"] = "Success";
		$msgarr["message"] = "Testsuite deleted successfully.";
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}

	
}else if($formtype == "ExecutionTestcase"){

	$sql = "DELETE FROM s_testexecution WHERE s_st_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);
	if($stmt)
	{

		$sql = "DELETE FROM s_tcstep_execution  where s_se_executionId = '".$id."' and accountId = '".$accountId."' ";
		$stmt2 = mysqli_query( $conn, $sql);
		

		$sql = "DELETE FROM s_testcaserun  where testexecutionId = '".$id."' and accountId = '".$accountId."' ";
		$stmt2 = mysqli_query( $conn, $sql);

		$sql = "DELETE FROM s_tcstep_iteration  where stepexecutionId = '".$id."' and accountId = '".$accountId."' ";
		$stmt2 = mysqli_query( $conn, $sql);
		
		$msgarr["status"] = "Success";
		$msgarr["message"] = "Testcase removed successfully.";
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}
}else if($formtype == "RTMTestcase"){


	$rtmId = (isset($_POST['rtmId']) ? $_POST['rtmId'] : "0");
	
	$sql = "DELETE FROM s_rtm_testcase WHERE s_rt_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);
	if($stmt)
	{
		$msgarr["status"] = "Success";
		$msgarr["message"] = "Selected record removed successfully.";
		$rtmtcsql = "SELECT 
						`s_f_testresult`  as result,
						COUNT(*) as count
					FROM
						s_testcasefinal where `testcaseId` in (select testcaseId from s_rtm_testcase where rtmId = '".$rtmId."') 
						and s_f_testresult !='' and s_f_testresult IS NOT NULL 
					GROUP BY s_f_testresult

					ORDER BY COUNT(*) asc ";
					// echo $rtmtcsql."<br/>";
		$rtmtcsqldata = mysqli_query($conn,$rtmtcsql);
					$passCount = 0;$failCount = 0;$inprogressCount = 0;$pendingCOunt = 0;$blockCount = 0;$naCount= 0 ;
		while($tdata = mysqli_fetch_assoc($rtmtcsqldata)){

			if($tdata['result'] == "Pass"){ $passCount = $tdata['count'];}
			else if($tdata['result'] == "Fail") {$failCount = $tdata['count'];}
			else if($tdata['result'] == "In Progress") {$inprogressCount = $tdata['count'];}
			else if($tdata['result'] == "Pending"){ $pendingCOunt = $tdata['count'];}
			else if($tdata['result'] == "Block"){ $blockCount = $tdata['count'];}
			else if($tdata['result'] == "NA"){ $naCount = $tdata['count'];}

		}
				
		if($failCount > 0){
			$rtmupdatesql = "UPDATE s_rtm SET s_rtm_status = 'Fail'  where s_rtm_id =  '".$rtmId."' ";
			mysqli_query( $conn, $rtmupdatesql);
		}else if($naCount >0 && ($blockCount == 0 && $inprogressCount == 0 && $pendingCOunt ==0 && $passCount ==0)){
			$rtmupdatesql = "UPDATE s_rtm SET s_rtm_status = 'Out of scope'  where s_rtm_id =  '".$rtmId."' ";
			mysqli_query( $conn, $rtmupdatesql);
		}else if($blockCount > 0 || $naCount >0 || $inprogressCount>0 || $pendingCOunt >0){
			$rtmupdatesql = "UPDATE s_rtm SET s_rtm_status = 'In Progress'  where s_rtm_id =  '".$rtmId."' ";
			mysqli_query( $conn, $rtmupdatesql);
		}else if($passCount >= 0){
			$rtmupdatesql = "UPDATE s_rtm SET s_rtm_status = 'Pass'  where s_rtm_id =  '".$rtmId."' ";
			mysqli_query( $conn, $rtmupdatesql);
		}
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}
}else if($formtype == "User"){

	$sql = "DELETE FROM s_employees WHERE s_e_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);
	if($stmt)
	{
		$msgarr["status"] = "Success";
		$msgarr["message"] = "User deleted successfully.";
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}
}else if($formtype == "RiskIssue"){

	$sql = "DELETE FROM s_riskissue WHERE s_r_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);
	if($stmt)
	{
		$msgarr["status"] = "Success";
		$msgarr["message"] = "RiskIssue deleted successfully.";
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}
}else if($formtype == "Testrepository"){


	$table = "s_tcrepository";
	$tctype = (isset($_POST['type']) ? mysqli_real_escape_string($conn,$_POST['type']) : "Banking");
	switch ($tctype) {
	    case 'Banking':
	        $table = "s_tcrepository";
	        break;
	    case 'Automative':
	        $table = "s_tcrepository1";
	        break;
	    case 'HR':
	        $table = "s_tcrepository2";
	        break;
	    case 'Insurance':
	        $table = "s_tcrepository3";
	        break;
	    
	    default:
	        $table = "s_tcrepository";
	        break;
	}
	$sql = "DELETE FROM ".$table." WHERE s_t_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);

	if($stmt)
	{
		$msgarr["status"] = "Success";
		$msgarr["message"] = "Testrepository deleted successfully.";
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}
}else if($formtype == "Testcasesteps"){

	$tcsql = "SELECT testcaseId FROM s_testcase_steps where s_tss_id = '".$id."' and accountId = '".$accountId."' ";

	$tcsqldata = mysqli_query($conn,$tcsql);
	$testcaseId=0;
	while($tdata = mysqli_fetch_assoc($tcsqldata)){
			$testcaseId = $tdata['testcaseId'];
	}
	$sql = "DELETE FROM s_testcase_steps WHERE s_tss_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);

	if($stmt)
	{
		$stepsql = "SELECT s_tss_id FROM s_testcase_steps where testcaseId = '".$testcaseId."' and accountId = '".$accountId."' order by s_tss_num asc, s_tss_id asc ";

		$stepsqldata = mysqli_query($conn,$stepsql);
		$step_num=0;
		while($sdata = mysqli_fetch_assoc($stepsqldata)){
			$sid = $sdata['s_tss_id'];
			$step_num++;

			$updatesql = "UPDATE s_testcase_steps set s_tss_num = '".$step_num."'  where s_tss_id = '".$sid."' and accountId = '".$accountId."' ";
			$updatestmt = mysqli_query( $conn, $updatesql);
		}

		$msgarr["status"] = "Success";
		$msgarr["message"] = "Step deleted successfully.";
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}
}else if($formtype == "Testrepositorysteps"){

	$table = "s_tcrepository_steps";
	$tctype = (isset($_POST['type']) ? mysqli_real_escape_string($conn,$_POST['type']) : "Banking");
	switch ($tctype) {
	    case 'Banking':
	        $table = "s_tcrepository_steps";
	        break;
	    case 'Automative':
	        $table = "s_tcrepository_steps1";
	        break;
	    case 'HR':
	        $table = "s_tcrepository_steps2";
	        break;
	    case 'Insurance':
	        $table = "s_tcrepository_steps3";
	        break;
	    
	    default:
	        $table = "s_tcrepository_steps";
	        break;
	}
	$sql = "DELETE FROM ".$table." WHERE s_tss_id = ? AND accountId = ?";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ss", $id, $accountId);
	mysqli_stmt_execute($stmt);
	if($stmt)
	{
		$msgarr["status"] = "Success";
		$msgarr["message"] = "Step deleted successfully.";
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}
}


}
}
echo json_encode($msgarr);
