<?php
include('config.php');
session_start();
 
$enteredby = 0;$accountId = 0;
 

if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
}
if($_SERVER['REQUEST_METHOD'] === 'POST'){

$ids = (isset($_POST['ids']) ? $_POST['ids'] : "0");
$type = (isset($_POST['type']) ? $_POST['type'] : "");
$formtype = (isset($_POST['formtype']) ? $_POST['formtype'] : "");

if(in_array($type, array("Active","Inactive"))){

	if($formtype == "Activity"){
		$sql = "UPDATE s_activitymaster SET s_a_activestatus = ? WHERE s_a_id IN (?) AND accountId = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else if($formtype == "Client"){
		$sql = "UPDATE s_client SET s_c_activestatus = ? where s_c_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else if($formtype == "DefectStatus"){
		$sql = "UPDATE s_defectstatusmaster SET s_ds_activestatus = ? where s_ds_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else if($formtype == "DefectType"){
		$sql = "UPDATE s_defecttypemaster SET s_dt_activestatus = ? where s_dt_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else if($formtype == "Project"){
		$sql = "UPDATE s_project SET s_p_activestatus = ? where s_p_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);
	}else if($formtype == "Release"){
		$sql = "UPDATE s_release SET s_r_activestatus = ? where s_r_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);
	}else if($formtype == "ProjectActivity"){
		$sql = "UPDATE s_project_activity SET s_pa_activestatus = ? where s_pa_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);
	}else if($formtype == "RuleModule"){
		$sql = "UPDATE s_rule_module SET s_rm_activestatus = ? where s_rm_id in (?) ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else if($formtype == "BasicRules"){
		$sql = "UPDATE s_basic_rules SET s_br_activestatus = ? where s_br_id in (?)  ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else if($formtype == "Role"){
		$sql = "UPDATE s_role SET s_role_activestatus = ? where s_role_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else if($formtype == "User"){
		$sql = "UPDATE s_employees SET s_e_activestatus = ? where s_e_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else if($formtype == "Holiday"){
		$sql = "UPDATE s_holiday_master SET s_h_activestatus = ? where s_h_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sss", $type, $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}
}else if(in_array($type, array("Delete"))){


	if($formtype == "Activity"){
		$sql = "DELETE FROM s_activitymaster WHERE s_a_id IN (?) AND accountId = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);
	}else if($formtype == "Client"){
		$sql = "DELETE FROM s_client  where s_c_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);
	}else if($formtype == "DefectType"){
		$sql = "DELETE FROM s_defecttypemaster  where s_dt_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);
	}else if($formtype == "DefectStatus"){
		$sql = "DELETE FROM s_defectstatusmaster  where s_ds_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);
	}else  if($formtype == "Project"){
		$sql = "DELETE FROM s_project  where s_p_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "Release"){
		$sql = "DELETE FROM s_release  where s_r_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "ProjectActivity"){
		$sql = "DELETE FROM s_project_activity  where s_pa_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "Defect"){
		$sql = "DELETE FROM s_defect  where s_d_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "RTM"){
		$sql = "DELETE FROM s_rtm  where s_rtm_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "Testcase"){
		$sql = "DELETE FROM s_testcase  where FIND_IN_SET(s_t_id,?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "Testsuite"){
		$sql = "DELETE FROM s_testsuite  where s_ts_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "RuleModule"){
		$sql = "DELETE FROM s_rule_module  where s_rm_id in (?)  ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $ids);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "BasicRules"){
		$sql = "DELETE FROM s_basic_rules  where s_br_id in (?)  ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $ids);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "Role"){
		$sql = "DELETE FROM s_role  where s_role_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "User"){
		$sql = "DELETE FROM s_employees  where s_e_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "Holiday"){
		$sql = "DELETE FROM s_holiday_master  where s_h_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}else  if($formtype == "Testrepository"){

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
		$sql = "DELETE FROM ".$table."  where s_t_id in (?) and accountId = ? ";
		$stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $ids, $accountId);
        mysqli_stmt_execute($stmt);

	}

}else if(in_array($type, array("Execute"))){


	if($formtype == "Testexecution"){

		$executiontype =(isset($_POST['executiontype']) ? $_POST['executiontype'] : "");
		$schedchk =(isset($_POST['schedchk']) ? $_POST['schedchk'] : "");
	        $artifactschk =(isset($_POST['artifactschk']) && $_POST['artifactschk'] !="" ? $_POST['artifactschk'] : "0");
		$testsuiteId =(isset($_POST['testsuiteId']) ? $_POST['testsuiteId'] : "0");
		$iArr = explode(",", $ids);
		// var_dump($iArr);
		$len = count($iArr);
		for ($i=0; $i < $len ; $i++) { 
			# code...
			$testexecutionId = $iArr[$i];
		
			$iterationVal - 0;
			$iterationsqldata = mysqli_query($conn,"SELECT * from s_testcaserun where testexecutionId = '".$testexecutionId."' and accountId = '".$accountId."'  order by s_st_id desc limit 1");
				if(mysqli_num_rows($iterationsqldata)>0){

					while($rdata = mysqli_fetch_assoc($iterationsqldata)){
						$iterationVal = (int)$rdata['s_st_iteration'] +1;
					}
				}else{
					$iterationVal = 1;
				}
			$sql = "insert into s_testcaserun(testexecutionId,testsuiteId,testcaseId,s_st_iteration,s_st_testresult,s_st_actualresult,s_st_executiontime,s_st_exectionstart,s_st_executionend,s_st_filename,s_st_filepath,defectId,s_st_executionstatus,s_st_enteredby,accountId)  select s_st_id,testsuiteId,testcaseId,'".$iterationVal."','',NULL,NULL,NULL,NULL,'',NULL,'0','1','".$enteredby."','".$accountId."' from s_testexecution where s_st_id ='".$testexecutionId."' and accountId = '".$accountId."'";

			$result = mysqli_query( $conn, $sql);
			if ($result) {

				$testrunId = mysqli_insert_id($conn);

				if($testrunId >0){
					$stepsql = "insert into s_tcstep_iteration(stepexecutionId,s_se_runid,s_se_executionId,stepId,s_se_iteration,s_se_enteredby,accountId)  select s_se_id,'".$testrunId."','".$testexecutionId."',stepId,'".$iterationVal."','".$enteredby."','".$accountId."' from s_tcstep_execution where s_se_executionId ='".$testexecutionId."' and accountId = '".$accountId."'";

					mysqli_query( $conn, $stepsql);


					$updatestepsql = "update s_tcstep_execution set s_se_iteration = '".$iterationVal."' where s_se_executionId = '".$testexecutionId."' ";

					mysqli_query( $conn, $updatestepsql);
				}
				
				if($artifactschk == "1" || $artifactschk == "on"){
					$updateSql = "update s_testexecution set s_st_executionstatus = '1',s_st_testresult = 'In Progress' where s_st_id = '".$testexecutionId."'  and accountId = '".$accountId."'";
					mysqli_query( $conn, $updateSql);
				}
			}

		}

		if($executiontype == "Automation"){
			if($schedchk != "on"){

				$sql = "SELECT * FROM s_bot_run WHERE testsuiteId = ? AND accountId = ? ORDER BY s_br_id DESC LIMIT 1";
				$stmt = mysqli_prepare($conn, $sql);

				// Bind the parameters to the placeholders
				mysqli_stmt_bind_param($stmt, "ii", $testsuiteId, $accountId);

				// Execute the prepared statement
				mysqli_stmt_execute($stmt);

				// Get the result
				$rundata = mysqli_stmt_get_result($stmt);
				if(mysqli_num_rows($rundata) > 0){
					$updateSql = "UPDATE s_bot_run SET s_br_flag = '1' WHERE testsuiteId = ? AND accountId = ?";
					$stmt = mysqli_prepare($conn, $updateSql);
					mysqli_stmt_bind_param($stmt, "ii", $testsuiteId, $accountId);
					mysqli_stmt_execute($stmt);
				} else {
					$insertSql = "INSERT INTO s_bot_run (testsuiteId, s_br_flag, s_br_runtime, s_br_enteredby, accountId) VALUES (?, '1', ?, ?, ?)";
					$stmt = mysqli_prepare($conn, $insertSql);
					$currentTime = date("Y-m-d H:i:s");
					mysqli_stmt_bind_param($stmt, "issi", $testsuiteId, $currentTime, $enteredby, $accountId);
					mysqli_stmt_execute($stmt);
				}
			}
		}

	}
}
}
