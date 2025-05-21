<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
include('config.php');
session_start();
 
$enteredby = 0;$accountId = 0;
 
$msgarr = array();
$msgarr["status"] = "Error";
$msgarr["message"] = "Something went wrong. Please try again.";

if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
}
$updateRecords = "";$auditlogDesc = "";$emailids = "";$empids = "";$attachmentsLogs =array();$attachfilename = array();$newFlag = 0;
if($_SERVER['REQUEST_METHOD'] === 'POST'){

	$id = (isset($_POST['rtmId']) ? $_POST['rtmId'] : "0");
	$projectId = (isset($_POST['projectId']) ? $_POST['projectId'] : "0");
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
	$empdata = mysqli_query($conn,"SELECT IFNULL(group_concat(s_e_emailid),'') as emailids, IFNULL(group_concat(s_e_id),'') as empids from  s_employees where s_e_activestatus = 'Active' and s_e_id in(select employeeId from s_project_members where projectId = '".$projectId."' and accountId ='".$accountId."' ) and accountId ='".$accountId."'   Order by s_e_id desc");

	while($edata = mysqli_fetch_assoc($empdata)){
		$emailids = $edata['emailids'];
		$empids = $edata['empids'];
	}		

	$releaseId = (isset($_POST['releaseId']) ? $_POST['releaseId'] : "0");
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

	
	$module = (isset($_POST['module']) ? mysqli_real_escape_string($conn,$_POST['module']) : "");
	$module_change = (isset($_POST['module_change']) && !empty($_POST['module_change']) ? $_POST['module_change'] : "0");
	if($module_change == "1"){
		if($auditlogDesc == ""){
			$auditlogDesc = "Module";
		}else{
			$auditlogDesc .= ", Module";
		}
		if($updateRecords == ""){
			$updateRecords = "s_rtm_module = '".$module."'";
		}else{
			$updateRecords .= ", s_rtm_module = '".$module."'";
		}
	}

	$submodule = (isset($_POST['submodule']) ? mysqli_real_escape_string($conn,$_POST['submodule']) : "");
	$submodule_change = (isset($_POST['submodule_change']) && !empty($_POST['submodule_change']) ? $_POST['submodule_change'] : "0");
	if($submodule_change == "1"){
		if($auditlogDesc == ""){
			$auditlogDesc = "Submodule";
		}else{
			$auditlogDesc .= ", Submodule";
		}
		if($updateRecords == ""){
			$updateRecords = "s_rtm_submodule = '".$submodule."'";
		}else{
			$updateRecords .= ", s_rtm_submodule = '".$submodule."'";
		}
	}


	$reviewer = (isset($_POST['reviewer']) ? $_POST['reviewer'] : "0");
	$reviewer_change = (isset($_POST['reviewer_change']) && !empty($_POST['reviewer_change']) ? $_POST['reviewer_change'] : "0");
	if($reviewer_change == "1"){
		if($auditlogDesc == ""){
			$auditlogDesc = "Reviewer";
		}else{
			$auditlogDesc .= ", Reviewer";
		}
		if($updateRecords == ""){
			$updateRecords = "s_rtm_reviewer = '".$reviewer."'";
		}else{
			$updateRecords .= ", s_rtm_reviewer = '".$reviewer."'";
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
			$updateRecords = "s_rtm_assignto = '".$assignto."'";
		}else{
			$updateRecords .= ", s_rtm_assignto = '".$assignto."'";
		}
	}
	$rtmstatus = (isset($_POST['rtmstatus']) ? $_POST['rtmstatus'] : "");
	$rtmstatus_change = (isset($_POST['rtmstatus_change']) && !empty($_POST['rtmstatus_change']) ? $_POST['rtmstatus_change'] : "0");
	if($rtmstatus_change == "1"){
		if($auditlogDesc == ""){
			$auditlogDesc = "Status";
		}else{
			$auditlogDesc .= ", Status";
		}
		if($updateRecords == ""){
			$updateRecords = "s_rtm_status = '".$rtmstatus."'";
		}else{
			$updateRecords .= ", s_rtm_status = '".$rtmstatus."'";
		}
	}
	$description = (isset($_POST['rtmdesc']) ? mysqli_real_escape_string($conn,$_POST['rtmdesc']) : "");
	$rtmdesc_change = (isset($_POST['rtmdesc_change']) && !empty($_POST['rtmdesc_change'])  ? $_POST['rtmdesc_change'] : "0");
	if($rtmdesc_change == "1"){
		if($auditlogDesc == ""){
			$auditlogDesc = "Description";
		}else{
			$auditlogDesc .= ", Description";
		}
		if($updateRecords == ""){
			$updateRecords = "s_rtm_description = '".$description."'";
		}else{
			$updateRecords .= ", s_rtm_description = '".$description."'";
		}
	}

	$summary = (isset($_POST['rtmsummary']) ? mysqli_real_escape_string($conn,$_POST['rtmsummary']) : "");
	$rtmsummary_change = (isset($_POST['rtmsummary_change']) && !empty($_POST['rtmsummary_change'])  ? $_POST['rtmsummary_change'] : "0");
	if($rtmsummary_change == "1"){
		if($auditlogDesc == ""){
			$auditlogDesc = "Summary";
		}else{
			$auditlogDesc .= ", Summary";
		}
		if($updateRecords == ""){
			$updateRecords = "s_rtm_summary = '".$summary."'";
		}else{
			$updateRecords .= ", s_rtm_summary = '".$summary."'";
		}
	}


        $comment = (isset($_POST['rtmcomment']) ? mysqli_real_escape_string($conn,$_POST['rtmcomment']) : "");
        $rtmcomment_change = (isset($_POST['rtmcomment_change']) && !empty($_POST['rtmcomment_change'])  ? $_POST['rtmcomment_change'] : "0");
        if($rtmcomment_change == "1"){
                if($auditlogDesc == ""){
                        $auditlogDesc = "Comment";
                }else{
                        $auditlogDesc .= ", Comment";
                }
                if($updateRecords == ""){
                        $updateRecords = "s_rtm_comment = '".$comment."'";
                }else{
                        $updateRecords .= ", s_rtm_comment = '".$comment."'";
                }
        }

	$priority = (isset($_POST['priority']) ? $_POST['priority'] : "");
	$priority_change = (isset($_POST['priority_change']) && !empty($_POST['priority_change']) ? $_POST['priority_change'] : "0");
	if($priority_change == "1"){
		if($auditlogDesc == ""){
			$auditlogDesc = "Priority";
		}else{
			$auditlogDesc .= ", Priority";
		}
		if($updateRecords == ""){
			$updateRecords = "s_rtm_priority = '".$priority."'";
		}else{
			$updateRecords .= ", s_rtm_priority = '".$priority."'";
		}
	}

	$editmode = (isset($_POST['editmode']) ? $_POST['editmode'] : "");
        $editmode_change = (isset($_POST['editmode_change']) && !empty($_POST['editmode_change']) ? $_POST['editmode_change'] : "0");
        if($editmode_change == "1"){
                if($auditlogDesc == ""){
                        $auditlogDesc = "Edit Mode";
                }else{
                        $auditlogDesc .= ", Edit Mode";
                }
                if($updateRecords == ""){
                        $updateRecords = "s_rtm_editmode = '".$editmode."'";
                }else{
                        $updateRecords .= ", s_rtm_editmode = '".$editmode."'";
                }
        }
	// generate release ID

	$rtmId = 0;
	$rtmstr = "";
	$projcode = "";
	$rtmdata = mysqli_query($conn,"SELECT * from s_rtm where s_rtm_id = '".$id."' and accountId = '".$accountId."'  order by s_rtm_id desc limit 1");
	if(mysqli_num_rows($rtmdata)>0){

		while($rdata = mysqli_fetch_assoc($rtmdata)){
			$rtmstr = $rdata['s_rtm_reqnum'] ;
		}
	}
	if($projectId_change == "1"){
		$projsqldata = mysqli_query($conn,"SELECT * from s_project where s_p_id = '".$projectId."' and accountId='".$accountId."' order by s_p_id desc limit 1");
		if(mysqli_num_rows($projsqldata)>0){

			while($pdata = mysqli_fetch_assoc($projsqldata)){
				$projcode = $pdata['s_p_code'];
			}


			$rtmsqldata = mysqli_query($conn,"SELECT * from s_rtm where projectId = '".$projectId."' and accountId='".$accountId."' order by s_rtm_tempid desc limit 1");
			if(mysqli_num_rows($rtmsqldata)>0){

				while($rdata = mysqli_fetch_assoc($rtmsqldata)){
					$rtmId = (int)$rdata['s_rtm_tempid'] +1;
				}
			}else{
				$rtmId = 1;
			}
			$rtmstr = "$projcode-REQ$rtmId";
			if($auditlogDesc == ""){
				$auditlogDesc = "REQ ID";
			}else{
				$auditlogDesc .= ", REQ ID";
			}

			if($updateRecords == ""){
				$updateRecords = "s_rtm_tempid = '".$rtmId."', s_rtm_reqnum = '".$rtmstr."'";
			}else{
				$updateRecords .= ", s_rtm_tempid = '".$rtmId."', s_rtm_reqnum = '".$rtmstr."'";
			}
		}
	}

	if(!empty($id) && $id !="0") {

               if(isset($_FILES['fileToUpload']['name'])){
			
		if (!file_exists($CFG['dirroot'].'rtmdata/'.$accountId.'/'.$id)) {

			mkdir($CFG['dirroot'].'rtmdata/'.$accountId.'/'.$id, 0777, true);

		}
						
		// Count # of uploaded files in array
		$total = count($_FILES['fileToUpload']['name']);

		// Loop through each file
		for( $i=0 ; $i < $total ; $i++ ) {

			//Get the temp file path
			$tmpFilePath = $_FILES['fileToUpload']['tmp_name'][$i];

			//Make sure we have a file path
			if ($tmpFilePath != ""){
				//Setup our new file path
				$newFilePath = $CFG['dirroot'].'rtmdata/'.$accountId.'/'.$id."/" . $_FILES['fileToUpload']['name'][$i];

				//Upload the file into the temp dir
				if(move_uploaded_file($tmpFilePath, $newFilePath)) {
			
					$attachmentsLogs[] = STEP_dir.'rtmdata/'.$accountId.'/'.$id."/" . $_FILES['fileToUpload']['name'][$i];
					$attachfilename[] = $_FILES['fileToUpload']['name'][$i];
					//Handle other code here

				}
			}
		}

		if(isset($attachmentsLogs) && !empty($attachmentsLogs)){

			if($auditlogDesc == ""){
				$auditlogDesc = "Attachments";
			}else{
				$auditlogDesc .= ", Attachments";
			}
		}
	}
	
	if($updateRecords !="" || (isset($attachmentsLogs) && !empty($attachmentsLogs)) ){
		//if($updateRecords !=""  ){
			if($updateRecords !=""){
				$sql = "UPDATE s_rtm SET  $updateRecords where s_rtm_id = ? ";
				$stmt = mysqli_prepare($conn, $sql);
				mysqli_stmt_bind_param($stmt, "s", $id);
				$result = mysqli_stmt_execute($stmt);
			}
			if((isset($result) && $result)  || (isset($attachmentsLogs) && !empty($attachmentsLogs))){
				$newFlag = 0;
				$msgarr["status"] = "Success";
				$msgarr["message"] = "Requirement updated successfully.";
				
                                if($emailids !=""){
				$notificationSql = "insert into s_notifications (`s_n_viewer`, `s_n_employees`,`s_n_assignto`, `s_n_recordid`,`s_n_recordnum`,`s_n_desc`,`s_n_attachments`,`s_n_filename`,`accountId`,`s_n_enteredby`,s_n_newflag ,s_n_emailflag ,s_n_module) values (NULL,'".$empids."','0','".$id."','".$rtmstr."','".$auditlogDesc."','".(implode(",", $attachmentsLogs))."','".(implode(",", $attachfilename))."','".$accountId."','".$enteredby."','".$newFlag."','0','RTM') ";
				
				mysqli_query( $conn, $notificationSql);
				}

				if($assignto_change == "1"  && $assignto !="0"){
					$history = "insert into s_rtmassignmenthistory (`rtmId`, `s_dh_assignto`, `s_dh_enteredby` ,`accountId`) values ('".$id."','".$assignto."','".$enteredby."','".$accountId."') ";
					
					mysqli_query( $conn, $history);

				}

				if($auditlogDesc != ""){
					$auditlogSql = "insert into s_auditlogs (`s_a_desc`, `s_a_module`, `s_a_enteredby`,`accountId`,`s_a_recordId`,`s_a_recordnum` ) values ('".$auditlogDesc."','Requirement','".$enteredby."','".$accountId."','".$id."','".$rtmstr."') ";
                                        mysqli_query( $conn, $auditlogSql);
				}
				
				// Close the prepared statement
				//mysqli_stmt_close($stmt);
			}else{
				$msgarr["status"] = "Error";
				$msgarr["message"] = "Something went wrong. Please try again.";
			}
		

		}else{

				$msgarr["status"] = "Success";
				$msgarr["message"] = "Requirement updated successfully.";
		}
	}else{

		// Insert new record
		$sql = "INSERT INTO s_rtm (s_rtm_reqnum, s_rtm_tempid, projectId, releaseId, s_rtm_status, s_rtm_description, s_rtm_author, s_rtm_reviewer, s_rtm_enteredby, accountId,s_rtm_assignto,s_rtm_summary,s_rtm_priority,s_rtm_comment,s_rtm_editmode,s_rtm_module,s_rtm_submodule) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?,?,?,?,?,?,?)";
		$stmt = mysqli_prepare($conn, $sql);
		if ($stmt) {
			mysqli_stmt_bind_param($stmt, 'siissssiiiissssss', $rtmstr, $rtmId, $projectId, $releaseId, $rtmstatus, $description, $enteredby, $reviewer, $enteredby, $accountId,$assignto,$summary,$priority,$comment,$editmode,$module,$submodule);
			if (mysqli_stmt_execute($stmt)) {
				
				$newFlag = 1;
				$msgarr["status"] = "Success";
				$msgarr["message"] = "Requirement added successfully.";

		                $insertid = mysqli_insert_id($conn);

       				if($assignto_change == "1" && $assignto !="0"){
					$history = "insert into s_rtmassignmenthistory (`rtmId`, `s_dh_assignto`, `s_dh_enteredby`,`accountId` ) values ('".$insertid."','".$assignto."','".$enteredby."','".$accountId."') ";
					
					mysqli_query( $conn, $history);

				}
				$auditlogDesc = "New requirement created.";
				// if($auditlogDesc != ""){
					$auditlogSql = "insert into s_auditlogs (`s_a_desc`, `s_a_module`, `s_a_enteredby`,`accountId`,`s_a_recordId`,`s_a_recordnum`  ) values ('".$auditlogDesc."','Requirement','".$enteredby."','".$accountId."','".$insertid."','".$rtmstr."') ";
					
					mysqli_query( $conn, $auditlogSql);

				// }
                                if(isset($_FILES['fileToUpload']['name'])){
					//echo "aditya";exit;
					if (!file_exists($CFG['dirroot'].'rtmdata/'.$accountId.'/'.$insertid)) {
						mkdir($CFG['dirroot'].'rtmdata/'.$accountId.'/'.$insertid, 0777, true);
					}
						
					// Count # of uploaded files in array
					$total = count($_FILES['fileToUpload']['name']);

					// Loop through each file
					for( $i=0 ; $i < $total ; $i++ ) {

						//Get the temp file path
						$tmpFilePath = $_FILES['fileToUpload']['tmp_name'][$i];

						//Make sure we have a file path
						if ($tmpFilePath != ""){
							//Setup our new file path
							$newFilePath = $CFG['dirroot'].'rtmdata/'.$accountId.'/'.$insertid."/" . $_FILES['fileToUpload']['name'][$i];

							//Upload the file into the temp dir
							if(move_uploaded_file($tmpFilePath, $newFilePath)) {
									$attachmentsLogs[] = STEP_dir.'rtmdata/'.$accountId.'/'.$insertid."/" . $_FILES['fileToUpload']['name'][$i];
									$attachfilename[] = $_FILES['fileToUpload']['name'][$i];

							//Handle other code here

							}
						}
					}
				}


                if($emailids !=""){
					$notificationSql = "insert into s_notifications (`s_n_viewer`, `s_n_employees`,`s_n_assignto`, `s_n_recordid`,`s_n_recordnum`,`s_n_desc`,`s_n_attachments`,`s_n_filename`,`accountId`,`s_n_enteredby`,s_n_newflag ,s_n_emailflag ,s_n_module) values (NULL,'".$empids."','0','".$insertid."','".$rtmstr."','".$auditlogDesc."','".(implode(",", $attachmentsLogs))."','".(implode(",", $attachfilename))."','".$accountId."','".$enteredby."','".$newFlag."','0','RTM') ";
					
					mysqli_query( $conn, $notificationSql);
				}
				//if(isset($stmt))mysqli_stmt_close($stmt);
			} else {
				$msgarr["status"] = "Error";
				$msgarr["message"] = "Something went wrong. Please try again.";
			}
	
		} else {
			$msgarr["status"] = "Error";
			$msgarr["message"] = "Database error. Please try again.";
		}
	}
}

echo json_encode($msgarr);
