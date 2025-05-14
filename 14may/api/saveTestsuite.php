
<?php

include('config.php');
session_start();

/** this script saves the testsuite data */
$msgarr = array();
 
$enteredby = 0;
$accountId = 0;
 
$msgarr = array();

if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
}
$updateRecords = "";$auditlogDesc = "";
if($_SERVER['REQUEST_METHOD'] === 'POST'){

$id = (isset($_POST['testsuiteDBId']) && !empty($_POST['testsuiteDBId'])? $_POST['testsuiteDBId'] : "0");
$projectId = (isset($_POST['projectId']) && !empty($_POST['projectId']) ? $_POST['projectId'] : "0");
$projectId_change = (isset($_POST['projectId_change']) && !empty($_POST['projectId_change']) ? $_POST['projectId_change'] : "0");
if($projectId_change == "1"){
	if($auditlogDesc == ""){
		$auditlogDesc = "Project";
	}else{
		$auditlogDesc .= ", Project";
	}
	if($updateRecords == ""){
		$updateRecords = "projectId = '".$projectId."'";
	}else{
		$updateRecords .= ", projectId = '".$projectId."'";
	}
}

$releaseId = (isset($_POST['releaseId']) && !empty($_POST['releaseId'])? $_POST['releaseId'] : "0");
$releaseId_change = (isset($_POST['releaseId_change']) && !empty($_POST['releaseId_change']) ? $_POST['releaseId_change'] : "0");
if($releaseId_change == "1"){
	if($auditlogDesc == ""){
		$auditlogDesc = "Release";
	}else{
		$auditlogDesc .= ", Release";
	}
	if($updateRecords == ""){
		$updateRecords = "releaseId = '".$releaseId."'";
	}else{
		$updateRecords .= ", releaseId = '".$releaseId."'";
	}
}

$activityId = (isset($_POST['activityId']) && !empty($_POST['activityId'])? $_POST['activityId'] : "0");
$activityId_change = (isset($_POST['activityId_change']) && !empty($_POST['activityId_change']) ? $_POST['activityId_change'] : "0");
if($activityId_change == "1"){
	if($auditlogDesc == ""){
		$auditlogDesc = "Activity";
	}else{
		$auditlogDesc .= ", Activity";
	}
	if($updateRecords == ""){
		$updateRecords = "activityId = '".$activityId."'";
	}else{
		$updateRecords .= ", activityId = '".$activityId."'";
	}
}

$testsuitename = (isset($_POST['testsuitename']) ? mysqli_real_escape_string($conn,$_POST['testsuitename']) : "");
$testsuitename_change = (isset($_POST['testsuitename_change']) && !empty($_POST['testsuitename_change']) ? $_POST['testsuitename_change'] : "0");
if($testsuitename_change == "1"){
	if($auditlogDesc == ""){
		$auditlogDesc = "Name";
	}else{
		$auditlogDesc .= ", Name";
	}
	if($updateRecords == ""){
		$updateRecords = "s_ts_name = '".$testsuitename."'";
	}else{
		$updateRecords .= ", s_ts_name = '".$testsuitename."'";
	}
}

$testsuitedesc = (isset($_POST['testsuitedesc']) ? mysqli_real_escape_string($conn,$_POST['testsuitedesc']) : "");
$testsuitedesc_change = (isset($_POST['testsuitedesc_change']) && !empty($_POST['testsuitedesc_change']) ? $_POST['testsuitedesc_change'] : "0");
if($testsuitedesc_change == "1"){
	if($auditlogDesc == ""){
		$auditlogDesc = "Description";
	}else{
		$auditlogDesc .= ", Description";
	}
	if($updateRecords == ""){
		$updateRecords = "s_ts_description = '".$testsuitedesc."'";
	}else{
		$updateRecords .= ", s_ts_description = '".$testsuitedesc."'";
	}
}

$assignto = (isset($_POST['assignto']) && !empty($_POST['assignto']) ? $_POST['assignto'] : "0");
$assignto_change = (isset($_POST['assignto_change']) && !empty($_POST['assignto_change']) ? $_POST['assignto_change'] : "0");
if($assignto_change == "1"){
	if($auditlogDesc == ""){
		$auditlogDesc = "Assignment";
	}else{
		$auditlogDesc .= ", Assignment";
	}
	if($updateRecords == ""){
		$updateRecords = "s_ts_assignto = '".$assignto."'";
	}else{
		$updateRecords .= ", s_ts_assignto = '".$assignto."'";
	}
}



$type = (isset($_POST['type']) && !empty($_POST['type']) ? $_POST['type'] : "");
$type_change = (isset($_POST['type_change']) && !empty($_POST['type_change']) ? $_POST['type_change'] : "0");
if($type_change == "1"){
	if($auditlogDesc == ""){
		$auditlogDesc = "Execution type";
	}else{
		$auditlogDesc .= ",Execution type";
	}
	if($updateRecords == ""){
		$updateRecords = "s_ts_type = '".$type."'";
	}else{
		$updateRecords .= ", s_ts_type = '".$type."'";
	}
}


$artifactschk = (isset($_POST['artifactschk']) && !empty($_POST['artifactschk']) ? mysqli_real_escape_string($conn,$_POST['artifactschk']) : "0");
$artifactschk = $artifactschk == "on" ? "1": "0";
$artifactschk_change = (isset($_POST['artifactschk_change']) && !empty($_POST['artifactschk_change']) ? $_POST['artifactschk_change'] : "0");
if($artifactschk_change == "1"){
	if($auditlogDesc == ""){
		$auditlogDesc = "Test artifacts";
	}else{
		$auditlogDesc .= ",Test artifacts";
	}
	if($updateRecords == ""){
		$updateRecords = "s_ts_artifacts = '".$artifactschk."'";
	}else{
		$updateRecords .= ", s_ts_artifacts = '".$artifactschk."'";
	}
}
$machinId = "";$command = "";$schedularevery = 0;$schedulartype = "";$schedularstart = NULL;$schedularend = NULL;$schedchk = "";
if($type == "Manual"){

	if($updateRecords == ""){
		$updateRecords = "s_ts_machinid = '".$machinId."'";
		$updateRecords .= ", s_ts_cmd = '".$command."'";
		$updateRecords .= ", s_ts_schedevery = '".$schedularevery."'";
		$updateRecords .= ", s_ts_schedtype = '".$schedulartype."'";
		$updateRecords .= (isset($schedularstart) ? ", s_ts_schedstarttime = ".$schedularstart.""  :  ", s_ts_schedstarttime = NULL");
		$updateRecords .= (isset($schedularend) ? ", s_ts_schedendtime = ".$schedularend.""  :  ", s_ts_schedendtime = NULL");
		$updateRecords .= ", s_ts_schedchk = '".$schedchk."'";
	}else{
		$updateRecords .= ", s_ts_machinid = ''";
		$updateRecords .= ", s_ts_cmd = '".$command."'";
		$updateRecords .= ", s_ts_schedevery = '".$schedularevery."'";
		$updateRecords .= ", s_ts_schedtype = '".$schedulartype."'";
		$updateRecords .= (isset($schedularstart) ? ", s_ts_schedstarttime = ".$schedularstart.""  :  ", s_ts_schedstarttime = NULL");
		$updateRecords .= (isset($schedularend) ? ", s_ts_schedendtime = ".$schedularend.""  :  ", s_ts_schedendtime = NULL");
		$updateRecords .= ", s_ts_schedchk = '".$schedchk."'";
	}

}else{

	$schedchk = (isset($_POST['schedchk']) && !empty($_POST['schedchk'])  ? mysqli_real_escape_string($conn,$_POST['schedchk']) : "");
	$schedchk_change = (isset($_POST['schedchk_change']) && !empty($_POST['schedchk_change']) ? $_POST['schedchk_change'] : "0");
	if($schedchk_change == "1"){
		if($auditlogDesc == ""){
			$auditlogDesc = "Schedule Check";
		}else{
			$auditlogDesc .= ", Schedule Check";
		}
		if($updateRecords == ""){
			$updateRecords = "s_ts_schedchk = '".$schedchk."'";
		}else{
			$updateRecords .= ", s_ts_schedchk = '".$schedchk."'";
		}
	}


	$machinId = (isset($_POST['machinId']) && !empty($_POST['machinId'])  ? mysqli_real_escape_string($conn,$_POST['machinId']) : "");
	$machinId_change = (isset($_POST['machinId_change']) && !empty($_POST['machinId_change']) ? $_POST['machinId_change'] : "0");
	if($machinId_change == "1"){
		if($auditlogDesc == ""){
			$auditlogDesc = "Machin Id";
		}else{
			$auditlogDesc .= ", Machin Id";
		}
		if($updateRecords == ""){
			$updateRecords = "s_ts_machinid = '".$machinId."'";
		}else{
			$updateRecords .= ", s_ts_machinid = '".$machinId."'";
		}
	}

	$command = (isset($_POST['command']) && !empty($_POST['command'])  ? mysqli_real_escape_string($conn,$_POST['command']) : "");
	$command_change = (isset($_POST['command_change']) && !empty($_POST['command_change']) ? $_POST['command_change'] : "0");
	if($command_change == "1"){
		if($auditlogDesc == ""){
			$auditlogDesc = "Command";
		}else{
			$auditlogDesc .= ", Command";
		}
		if($updateRecords == ""){
			$updateRecords = "s_ts_cmd = '".$command."'";
		}else{
			$updateRecords .= ", s_ts_cmd = '".$command."'";
		}
	}

	if($schedchk == "on"){


		$schedularevery = (isset($_POST['schedularevery']) && !empty($_POST['schedularevery'])  ? $_POST['schedularevery'] : "0");
		$schedularevery_change = (isset($_POST['schedularevery_change']) && !empty($_POST['schedularevery_change']) ? $_POST['schedularevery_change'] : "0");
		if($schedularevery_change == "1"){
			if($auditlogDesc == ""){
				$auditlogDesc = "Execution frequency";
			}else{
				$auditlogDesc .= ", Execution frequency";
			}
			if($updateRecords == ""){
				$updateRecords = "s_ts_schedevery = '".$schedularevery."'";
			}else{
				$updateRecords .= ", s_ts_schedevery = '".$schedularevery."'";
			}
		}


		$schedulartype = (isset($_POST['schedulartype']) && !empty($_POST['schedulartype'])  ? $_POST['schedulartype'] : "");
		$schedulartype_change = (isset($_POST['schedulartype_change']) && !empty($_POST['schedulartype_change']) ? $_POST['schedulartype_change'] : "0");
		if($schedulartype_change == "1"){
			if($auditlogDesc == ""){
				$auditlogDesc = "Execution frequency type";
			}else{
				$auditlogDesc .= ", Execution frequency type";
			}
			if($updateRecords == ""){
				$updateRecords = "s_ts_schedtype = '".$schedulartype."'";
			}else{
				$updateRecords .= ", s_ts_schedtype = '".$schedulartype."'";
			}
		}

		$schedularstart = (isset($_POST['schedularstart']) && !empty($_POST['schedularstart'])  ? "'". $_POST['schedularstart']."'" : NULL);
		$schedularstart_change = (isset($_POST['schedularstart_change']) && !empty($_POST['schedularstart_change']) ? $_POST['schedularstart_change'] : "0");
		if($schedularstart_change == "1"){
			if($auditlogDesc == ""){
				$auditlogDesc = "Schedular start time";
			}else{
				$auditlogDesc .= ", Schedular start time";
			}
			if($updateRecords == ""){
				$updateRecords = "s_ts_schedstarttime = ".$schedularstart."";
			}else{
				$updateRecords .= (isset($schedularstart) ? ", s_ts_schedstarttime = ".$schedularstart.""  :  ", s_ts_schedstarttime = NULL");
			}
		}

		$schedularend = (isset($_POST['schedularend']) && !empty($_POST['schedularend'])  ? "'". $_POST['schedularend']."'" : NULL);
		$schedularend_change = (isset($_POST['schedularend_change']) && !empty($_POST['schedularend_change']) ? $_POST['schedularend_change'] : "0");
		if($schedularend_change == "1"){
			if($auditlogDesc == ""){
				$auditlogDesc = "Schedular end time";
			}else{
				$auditlogDesc .= ", Schedular end time";
			}
			if($updateRecords == ""){
				$updateRecords = (isset($schedularend) ? "s_ts_schedendtime = ".$schedularend."" :  ", s_ts_schedendtime = NULL");
			}else{
				$updateRecords .= (isset($schedularend) ? ", s_ts_schedendtime = ".$schedularend."" :  ", s_ts_schedendtime = NULL");
			}
		}
	}else{
		if($updateRecords == ""){
			// $updateRecords = "s_ts_machinid = '".$machinId."'";
			// $updateRecords .= ", s_ts_cmd = '".$command."'";
			$updateRecords .= " s_ts_schedevery = '".$schedularevery."'";
			$updateRecords .= ", s_ts_schedtype = '".$schedulartype."'";
			$updateRecords .= (isset($schedularstart) ? ", s_ts_schedstarttime = ".$schedularstart.""  :  ", s_ts_schedstarttime = NULL");
			$updateRecords .= (isset($schedularend) ? ", s_ts_schedendtime = ".$schedularend.""  :  ", s_ts_schedendtime = NULL");
			$updateRecords .= ", s_ts_schedchk = '".$schedchk."'";
		}else{
			// $updateRecords .= ", s_ts_machinid = ''";
			// $updateRecords .= ", s_ts_cmd = '".$command."'";
			$updateRecords .= ", s_ts_schedevery = '".$schedularevery."'";
			$updateRecords .= ", s_ts_schedtype = '".$schedulartype."'";
			$updateRecords .= (isset($schedularstart) ? ", s_ts_schedstarttime = ".$schedularstart."" :  ", s_ts_schedstarttime = NULL");
			$updateRecords .= (isset($schedularend) ? ", s_ts_schedendtime = ".$schedularend.""  :  ", s_ts_schedendtime = NULL");
			$updateRecords .= ", s_ts_schedchk = '".$schedchk."'";
		}
	}
}

$testsuiteNum = 0;
$testsuiteIdstr = "";
$projcode = "";


if($projectId_change == "1"){
$projsqldata = mysqli_query($conn,"SELECT * from s_project where s_p_id = '".$projectId."' and accountId='".$accountId."' order by s_p_id desc limit 1");
if(mysqli_num_rows($projsqldata)>0){

	while($pdata = mysqli_fetch_assoc($projsqldata)){
		$projcode = $pdata['s_p_code'];
	}

		$scenariosqldata = mysqli_query($conn,"SELECT * from s_testsuite where projectId = '".$projectId."' and accountId='".$accountId."'  order by s_ts_tempid desc limit 1");
		if(mysqli_num_rows($scenariosqldata)>0){

			while($rdata = mysqli_fetch_assoc($scenariosqldata)){
				$testsuiteNum = (int)$rdata['s_ts_tempid'] +1;
			}
		}else{
			$testsuiteNum = 1;
		}
		$testsuiteIdstr = "$projcode-TP-$testsuiteNum";

}
}

if(!empty($id) && $id !="0") {
	if($updateRecords !=""  ){
		// Use prepared statements for UPDATE query
		$sql = "UPDATE s_testsuite SET $updateRecords WHERE s_ts_id = ?";
		$stmt = mysqli_prepare($conn, $sql);
		mysqli_stmt_bind_param($stmt, "s", $id);
		$stmt_executed = mysqli_stmt_execute($stmt);

		if((isset($stmt_executed) && $stmt_executed)){
			$newFlag = 0;
			$msgarr["status"] = "Success";
			$msgarr["message"] = "Testsuite updated successfully.";
			if($auditlogDesc != ""){
				// Use prepared statements for INSERT query
 				$auditmodule = 'Testsuite';
				$auditlogSql = "INSERT INTO s_auditlogs (s_a_desc, s_a_module, s_a_enteredby, accountId, s_a_recordId, s_a_recordnum) VALUES (?, ?, ?, ?, ?, '')";
				$stmt_audit = mysqli_prepare($conn, $auditlogSql);
				mysqli_stmt_bind_param($stmt_audit, "ssiis", $auditlogDesc, $auditmodule, $enteredby, $accountId, $id);
				mysqli_stmt_execute($stmt_audit);


			}
		}else{
			$msgarr["status"] = "Error";
			$msgarr["message"] = "Something went wrong. Please try again.";
		}
		mysqli_stmt_close($stmt);

	}else{

			$msgarr["status"] = "Success";
			$msgarr["message"] = "Testsuite updated successfully.";
	}

}else{

	// Use prepared statements for INSERT query
	$sql = "INSERT INTO s_testsuite (projectId, releaseId, activityId, s_ts_tempid, s_ts_testsuitenum, s_ts_name, s_ts_description, s_ts_enteredby, accountId, s_ts_assignto, s_ts_type, s_ts_machinid, s_ts_cmd, s_ts_schedevery, s_ts_schedtype, s_ts_schedstarttime, s_ts_schedendtime, s_ts_schedchk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '')";
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "iiiisssiissssssss", $projectId, $releaseId, $activityId, $testsuiteNum, $testsuiteIdstr, $testsuitename, $testsuitedesc, $enteredby, $accountId, $assignto, $type, $machinId, $command, $schedularevery, $schedulartype, $schedularstart, $schedularend);
	$result = mysqli_stmt_execute($stmt);

	if($result)
	{
		$projectId = mysqli_insert_id($conn);
		$msgarr["status"] = "Success";
		$msgarr["message"] = "Testsuite added successfully.";

		$suiteId = mysqli_insert_id($conn);

		// $testcasesql = "insert into s_testexecution(testsuiteId,testcaseId,s_st_testresult,s_st_actualresult,s_st_executiontime,s_st_exectionstart,s_st_executionend,s_st_filename,s_st_filepath,userid,accountId)  select '".$suiteId."', s_t_id,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'".$enteredby."','".$accountId."' from s_testcase where projectId = '".$projectId."' AND releaseId = '".$releaseId."' AND activityId = '".$activityId."' and accountId='".$accountId."' and s_t_testmode = '".$type."'   ";
		
	}
	else
	{
		$msgarr["status"] = "Error";
		$msgarr["message"] = "Something went wrong. Please try again.";
	}
	mysqli_stmt_close($stmt);
}
}
echo json_encode($msgarr);
