<?php
include('config.php');
session_start();
 
   /** This PHP script retrieves the data based on id from a database. 
 * It formats the data and returns it in JSON format. */

$enteredby = 0;$accountId=0;$userempid = 0;
 

if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
    $userempid = $_SESSION["userempid"];
}

$id = (isset($_POST['id']) ? intval($_POST['id']) : 0);
$formtype = isset($_POST['formtype']) ? $_POST['formtype'] :"";


if($formtype == "ProjectActivity"){


	$editPermission = 0;
	if((isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin") || (isset($_SESSION["ruleIds"]) && in_array("11", explode(",", $_SESSION["ruleIds"])))){ 
		$editPermission = 1;
	}
	$sql = "SELECT pa.*,
	IFNULL(a.s_a_type,'') as activitytype,
	IFNULL(p.clientId,'0') as projectclient
	from s_project_activity pa
	join s_activitymaster a on a.s_a_id = pa.activityId 
	join s_project p on p.s_p_id = pa.projectId 
	where s_pa_id = ?  and pa.accountId = ?  ";
	 
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ii",$id,$accountId);
	mysqli_stmt_execute($stmt);
	$result = mysqli_stmt_get_result($stmt);

	$projarr = array();
	while($data = mysqli_fetch_assoc($result)){


			$membersarr = array();
			$membersnamearr = array();

			$chksql = "select mem.*, concat(IFNULL(s_e_fname,''),' ',IFNULL(s_e_mname,''),' ',IFNULL(s_e_lname,'')) as membersname from s_activity_members mem join s_employees emp on emp.s_e_id = mem.employeeId where mem.projactivityId = ? and mem.accountId =?  ";
			
			$chkstmt = mysqli_prepare($conn, $chksql);
			mysqli_stmt_bind_param($chkstmt, "ii",$data['s_pa_id'],$accountId);
			mysqli_stmt_execute($chkstmt);
			$chkresult = mysqli_stmt_get_result($chkstmt);

			while($mdata = mysqli_fetch_assoc($chkresult)){
				if(!in_array($mdata['employeeId'], $membersarr)){
					array_push($membersnamearr, $mdata['membersname']);
					array_push($membersarr, $mdata['employeeId']);
				}

			}


		$editable = 0; // editable allow
		$editabledata = mysqli_query($conn,"SELECT 1 from s_testcase where accountId = '".$accountId."' and projectId = '".$data['projectId']."'  and releaseId = '".$data['releaseId']."' and
		 find_in_set('".$data['activityId']."',s_t_activityIds)");
		$editable = mysqli_num_rows($editabledata);

		$projarr = array("id"=>$data['s_pa_id'],
			"projectId"=>$data['projectId'],
			"projectclient"=>$data['projectclient'],
			"releaseId"=>$data['releaseId'],
			"activityId"=>$data['activityId'],
			"status"=>$data['s_pa_status'],
			"activestatus"=>$data['s_pa_activestatus'],
			"activitytype"=>$data['activitytype'],
			"percompletion"=>$data['s_pa_completion'],
			"assignto"=>implode(",", $membersarr),
			"planstartdate"=>(isset($data['s_pa_planstartdate']) && ($data['s_pa_planstartdate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_pa_planstartdate'])) : ""),
			"planenddate"=>(isset($data['s_pa_planenddate']) && ($data['s_pa_planenddate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_pa_planenddate'])) : ""),
			"revisedstartdate"=>(isset($data['s_pa_revisedstartdate']) && ($data['s_pa_revisedstartdate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_pa_revisedstartdate'])) : ""),
			"revisedenddate"=>(isset($data['s_pa_revisedenddate']) && ($data['s_pa_revisedenddate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_pa_revisedenddate'])) : ""),
			"actualstartdate"=>(isset($data['s_pa_actualstartdate']) && ($data['s_pa_actualstartdate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_pa_actualstartdate'])) : ""),
			"actualenddate"=>(isset($data['s_pa_actualenddate']) && ($data['s_pa_actualenddate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_pa_actualenddate'])) : ""),
			"projactivitydesc"=>$data['s_pa_desc'],
			"editable"=>$editable,
			"editPermission"=>$editPermission,
		);
	}
}else if($formtype == "Defect"){
	$sql = "SELECT * from s_defect where s_d_id = ? and accountId = ? ";
	
	$stmt = mysqli_prepare($conn, $sql);
	mysqli_stmt_bind_param($stmt, "ii",$id,$accountId);
	mysqli_stmt_execute($stmt);
	$result = mysqli_stmt_get_result($stmt);

	$projarr = array();
	while($data = mysqli_fetch_assoc($result)){


		$attachmentsarr = array();

		$dir = STEP_dir."defectdata/".$accountId."/".$data['s_d_id']."/";
		// echo $dir;
		if(is_dir($dir)) {

			$files = array_diff(scandir($dir), array('..', '.'));
			if(count($files) >0){
				foreach($files as $file){
					// echo $file;
					$ext = pathinfo($file, PATHINFO_EXTENSION);
					$attachmentsarr[] = array("filenamestr"=>$file,"extension"=>$ext,"filename"=>STEP_root.'defectdata/'.$accountId.'/'.$data['s_d_id']."/".$file,"filepath"=>'defectdata/'.$accountId.'/'.$data['s_d_id']."/".$file);
				}
			}
		}
		$projarr = array("id"=>$data['s_d_id'],
			"projectId"=>$data['projectId'],
			"releaseId"=>$data['releaseId'],
			"testcaseId"=>$data['testcaseId'],
			"defecttypeId"=>$data['defecttypeId'],
			"defectstatusId"=>$data['defectstatusId'],
			"module"=>$data['s_d_module'],
			"submodule"=>$data['s_d_submodule'],
			"severity"=>$data['s_d_severity'],
			"priority"=>$data['s_d_priority'],
			"shortdesc"=>$data['s_d_shortdesc'],
			"longdesc"=>$data['s_d_longdesc'],
			"testdata"=>$data['s_d_testdata'],
			"steps"=>$data['s_d_steps'],
			"expectedresult"=>$data['s_d_expectedresult'],
			"actualresult"=>$data['s_d_actualresult'],
			"comment"=>$data['s_d_comment'],
			"assignto"=>$data['s_d_assignto'],
			"attachments"=>$attachmentsarr
		);
	}
}else if($formtype == "RTM"){

	$editPermission = 0;
	if((isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin") || (isset($_SESSION["ruleIds"]) && in_array("23", explode(",", $_SESSION["ruleIds"])))){ 
		$editPermission = 1;
		}
	$where = "";
	if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
		$where .= " and projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."' and accountId = '".$accountId."')";

	}
	$stmt = mysqli_prepare($conn,"SELECT rtm.*,
	IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_name,'') as releaseNum,concat(IFNULL(a3.s_e_fname,''),' ',IFNULL(a3.s_e_mname,''),' ',IFNULL(a3.s_e_lname,'')) as reviewer from s_rtm rtm
	join s_project p on p.s_p_id = rtm.projectId 
	join s_release r on r.s_r_id = rtm.releaseId
	
 	left JOIN s_employees a3 on a3.s_e_id = rtm.s_rtm_reviewer 
	where rtm.s_rtm_id = ? and rtm.accountId = ? ");
	mysqli_stmt_bind_param($stmt, "ii",$id,$accountId);
	mysqli_stmt_execute($stmt);
	$result = mysqli_stmt_get_result($stmt);


	$projarr = array();
	while($data = mysqli_fetch_assoc($result)){
		$attachmentsarr = array();
		$assignmentarr = array();

		$assigndata = mysqli_query($conn,"SELECT d.*,concat(IFNULL(s_e_fname,''),' ',IFNULL(s_e_mname,''),' ',IFNULL(s_e_lname,'')) as assignee	
			from s_rtmassignmenthistory d 
			left JOIN s_employees o1 on o1.s_e_id = d.s_dh_assignto and d.s_dh_assignto !='0' 
			where d.rtmId = '".$data['s_rtm_id']."' and d.accountId = '".$accountId."' ");
		while($adata = mysqli_fetch_assoc($assigndata)){
			$assignmentarr[] = $adata['assignee'];
		}

		$dir = STEP_dir."rtmdata/".$accountId."/".$data['s_rtm_id']."/";
		// echo $dir;
		if(is_dir($dir)) {

			$files = array_diff(scandir($dir), array('..', '.'));
			if(count($files) >0){
				foreach($files as $file){
					// echo $file;
					$ext = pathinfo($file, PATHINFO_EXTENSION);
					$attachmentsarr[] = array("filenamestr"=>$file,"extension"=>$ext,"filename"=>STEP_root.'rtmdata/'.$accountId.'/'.$data['s_rtm_id']."/".$file,"filepath"=>'rtmdata/'.$accountId.'/'.$data['s_rtm_id']."/".$file);
				}
			}
		}
		$nextId = 0;
		$nextsqldata = mysqli_query($conn,"SELECT s_rtm_id as nextId from s_rtm where accountId = '".$accountId."' and s_rtm_id = (select min(s_rtm_id) from  s_rtm where s_rtm_id > '".$id."' $where)");
		while($nextdata = mysqli_fetch_assoc($nextsqldata)){
			$nextId = $nextdata['nextId'];
		}
		$prvId = 0;
		$prvsqldata = mysqli_query($conn,"SELECT s_rtm_id as prvId from s_rtm where accountId = '".$accountId."' and s_rtm_id = (select max(s_rtm_id) from  s_rtm where s_rtm_id < '".$id."' $where)");
		while($prvdata = mysqli_fetch_assoc($prvsqldata)){
			$prvId = $prvdata['prvId'];
		}
		$editable = 0; // editable allword
                $settingstmt = mysqli_prepare($conn,"SELECT *  from settings where accountId = ? order by id desc limit 1");
	        mysqli_stmt_bind_param($settingstmt, "i",$accountId);
	        mysqli_stmt_execute($settingstmt);
	        $settingsqldata = mysqli_stmt_get_result($settingstmt);
	        
	        while($settingdata = mysqli_fetch_assoc($settingsqldata)){
	                $editable = $data['s_rtm_status'] == "Approved" && $settingdata['isreadonly'] =="1" ? 1 : 0;
	        }
		//if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin"){}else{
		//$editabledata = mysqli_query($conn,"SELECT 1 from s_rtm_testcase where accountId = '".$accountId."' and rtmId = '".$id."' ");
		//$editable = mysqli_num_rows($editabledata);
		//$editable = (isset($data['s_rtm_editmode']) && $data['s_rtm_editmode']=="1"? 0 : 1);
		//}
		

		$projarr = array("id"=>$data['s_rtm_id'],
			"projectname"=>$data['projectname'],
			"releaseNum"=>$data['releaseNum'],
			"projectId"=>$data['projectId'],
			"releaseId"=>$data['releaseId'],
			"reqnum"=>$data['s_rtm_reqnum'],
			"rtmdesc"=>$data['s_rtm_description'],
                        "rtmcomment"=>$data['s_rtm_comment'],
			"rtmstatus"=>$data['s_rtm_status'],
			"reviewer"=>$data['reviewer'],
			"rtmreviewer"=>$data['s_rtm_reviewer'],
			"assignto"=>$data['s_rtm_assignto'],
			"priority"=>$data['s_rtm_priority'],
			"editmode"=>$data['s_rtm_editmode'],
			"summary"=>$data['s_rtm_summary'],
			"nextId"=>$nextId,
			"prvId"=>$prvId,
			"editable"=>$editable,
			"editPermission"=>$editPermission,
			"attachments"=>$attachmentsarr,
			"assignee"=>$assignmentarr
		);
	}
}else if($formtype == "Testcase"){
	$stmt = mysqli_prepare($conn,"SELECT * from s_testcase where s_t_id = ? and accountId = ? ");
	mysqli_stmt_bind_param($stmt, "ii",$id,$accountId);
	mysqli_stmt_execute($stmt);
	$result = mysqli_stmt_get_result($stmt);
	$projarr = array();
	while($data = mysqli_fetch_assoc($result)){

		$editable = 0; // editable allow
		$editabledata = mysqli_query($conn,"SELECT 1 from s_testexecution where accountId = '".$accountId."' and testcaseId = '".$data['s_t_id']."' ");
		$editable = mysqli_num_rows($editabledata);

		if($editable == 0){
			$editabledata = mysqli_query($conn,"SELECT 1 from s_rtm_testcase where accountId = '".$accountId."' and testcaseId = '".$data['s_t_id']."' ");
			$editable = mysqli_num_rows($editabledata);			
		}

		$projarr = array("id"=>$data['s_t_id'],
			"projectId"=>$data['projectId'],
			"releaseId"=>$data['releaseId'],
			"activityId"=>$data['s_t_activityIds'],
			"scenarioId"=>$data['s_d_tempscenarioId'],
			"scenarioIdstr"=>$data['s_t_testscenarionum'],
			"module"=>$data['s_t_module'],
			"submodule"=>$data['s_t_submodule'],
			"testscenariodesc"=>$data['s_t_testscenariodesc'],
			"testcasedesc"=>$data['s_t_testcasedesc'],
			"steps"=>$data['s_t_steps'],
			"expectedresult"=>$data['s_t_expectedresult'],
			"precondition"=>$data['s_t_precondition'],
			"testdata"=>$data['s_t_testdata'],
			"assignto"=>$data['s_t_assignto'],
			"author"=>$data['s_t_author'],
			"reviewer"=>$data['s_t_reviewer'],
			"category"=>$data['s_t_category'],
			"testmode"=>$data['s_t_testmode'],
			"comment"=>$data['s_t_comment'],
			"editable"=>$editable
		);
	}
}else if($formtype == "Testsuite"){

	$editPermission = 0;
	if((isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin") || (isset($_SESSION["ruleIds"]) && in_array("19", explode(",", $_SESSION["ruleIds"])))){ 
		$editPermission = 1;
		}
	$where = "";
	if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
		$where = " AND projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."' )";
		
	}

	$stmt = mysqli_prepare($conn,"SELECT ts.*,
	IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_name,'') as releaseNum,
	IFNULL(a.s_a_name,'') as activityname,
	IFNULL(a.s_a_code,'') as activitycode from s_testsuite ts
	join s_project p on p.s_p_id = ts.projectId 
	join s_activitymaster a on a.s_a_id = ts.activityId 
	join s_release r on r.s_r_id = ts.releaseId 
	   where ts.s_ts_id = ? and ts.accountId = ? ");
	mysqli_stmt_bind_param($stmt, "ii",$id,$accountId);
	mysqli_stmt_execute($stmt);
	$sqldata = mysqli_stmt_get_result($stmt);

	$projarr = array();
	while($data = mysqli_fetch_assoc($sqldata)){

		$nextId = 0;
		$nextsqldata = mysqli_query($conn,"SELECT s_ts_id as nextId from s_testsuite where accountId = '".$accountId."' and s_ts_id = (select min(s_ts_id) from  s_testsuite where s_ts_id > '".$id."' $where)");
		while($nextdata = mysqli_fetch_assoc($nextsqldata)){
			$nextId = $nextdata['nextId'];
		}
		$prvId = 0;
		$prvsqldata = mysqli_query($conn,"SELECT s_ts_id as prvId from s_testsuite where accountId = '".$accountId."' and s_ts_id = (select max(s_ts_id) from  s_testsuite where s_ts_id < '".$id."' $where)");
		while($prvdata = mysqli_fetch_assoc($prvsqldata)){
			$prvId = $prvdata['prvId'];
		}

		$editable = 0; // editable allow
		$editabledata = mysqli_query($conn,"SELECT 1 from s_testexecution where accountId = '".$accountId."' and testsuiteId = '".$data['s_ts_id']."' ");
		$editable = mysqli_num_rows($editabledata);
		
		$projarr = array("id"=>$data['s_ts_id'],
			"projectId"=>$data['projectId'],
			"releaseId"=>$data['releaseId'],
			"activityId"=>$data['activityId'],
			"testsuitenum"=>$data['s_ts_testsuitenum'],
			"testsuitename"=>$data['s_ts_name'],
			"assignto"=>$data['s_ts_assignto'],
			"testsuitedesc"=>$data['s_ts_description'],
			"projectname"=>$data['projectname'],
			"releaseNum"=>$data['releaseNum'],
			"activityname"=>$data['activityname'],
			"activitycode"=>$data['activitycode'],
			"type"=>$data['s_ts_type'],
			"artifactschk"=>$data['s_ts_artifacts'],
			"schedchk"=>$data['s_ts_schedchk'],
			"schedularevery"=>$data['s_ts_schedevery'],
			"schedulartype"=>$data['s_ts_schedtype'],
			"schedularstart"=>($data['s_ts_schedstarttime'] !="00:00:00" ? $data['s_ts_schedstarttime'] : ""),
			"schedularend"=>($data['s_ts_schedendtime'] !="0000-00-00 00:00:00" ? $data['s_ts_schedendtime'] : ""),
			"machinId"=>$data['s_ts_machinid'],
			"command"=>$data['s_ts_cmd'],
			"nextId"=>$nextId,
			"prvId"=>$prvId,
			"editable"=>$editable,
			"editPermission"=>$editPermission,

		);
	}
}else if($formtype == "User"){
	$stmt = mysqli_prepare($conn,"SELECT *  from s_employees where s_e_id = ? and accountId = ? ");
	mysqli_stmt_bind_param($stmt, "ii",$id,$accountId);
	mysqli_stmt_execute($stmt);
	$sqldata = mysqli_stmt_get_result($stmt);
	$projarr = array();
	while($data = mysqli_fetch_assoc($sqldata)){
		$editable = 0; // editable allow
		$editable = ($data['userId'] !="0" && $data['userId'] !="" ? 1:0); // editable allow
		
		$projarr = array("id"=>$data['s_e_id'],
			"firstname"=>$data['s_e_fname'],
			"middlename"=>$data['s_e_mname'],
			"lastname"=>$data['s_e_lname'],
			"emailid"=>$data['s_e_emailid'],
			"phoneno"=>$data['s_e_phoneno'],
			"userId"=>$data['userId'],
			"activestatus"=>$data['s_e_activestatus'],
			"roleId"=>$data['roleId'],
			"editable"=>$editable
		);
	}
}else if($formtype == "EmailSetting"){
	$stmt = mysqli_prepare($conn,"SELECT *  from s_emailsetting where accountId = ? order by s_es_id desc limit 1");
	mysqli_stmt_bind_param($stmt, "i",$accountId);
	mysqli_stmt_execute($stmt);
	$sqldata = mysqli_stmt_get_result($stmt);
	$projarr = array();
	while($data = mysqli_fetch_assoc($sqldata)){
		$projarr = array("id"=>$data['s_es_id'],
			"hostname"=>$data['s_es_host'],
			"portno"=>$data['s_es_port'],
			"fromname"=>$data['s_es_fromname'],
			"username"=>$data['s_es_username'],
			"password"=>$data['s_es_password']
		);
	}
}else if($formtype == "RAG"){
	$stmt = mysqli_prepare($conn,"SELECT *  from s_ragthreshold where accountId = ? order by s_rt_id desc limit 1");
	mysqli_stmt_bind_param($stmt, "i",$accountId);
	mysqli_stmt_execute($stmt);
	$sqldata = mysqli_stmt_get_result($stmt);
	$projarr = array();
	while($data = mysqli_fetch_assoc($sqldata)){
		$projarr = array("id"=>$data['s_rt_id'],
			"amber"=>$data['s_rt_amber'],
			"red"=>$data['s_rt_red']
		);
	}
}else if($formtype == "QualityStatus"){
	$stmt = mysqli_prepare($conn,"SELECT *  from s_qualitystatus where accountId = ? order by s_q_id desc limit 1");
	mysqli_stmt_bind_param($stmt, "i",$accountId);
	mysqli_stmt_execute($stmt);
	$sqldata = mysqli_stmt_get_result($stmt);
	$projarr = array();
	while($data = mysqli_fetch_assoc($sqldata)){
		$projarr = array("id"=>$data['s_q_id'],
			"excellent"=>$data['s_q_excellent'],
			"good"=>$data['s_q_good'],
			"normal"=>$data['s_q_normal']
		);
	}
}else if($formtype == "Requirement Setting"){
        $stmt = mysqli_prepare($conn,"SELECT *  from settings where accountId = ? order by id desc limit 1");
        mysqli_stmt_bind_param($stmt, "i",$accountId);
        mysqli_stmt_execute($stmt);
        $sqldata = mysqli_stmt_get_result($stmt);
        $projarr = array();
        while($data = mysqli_fetch_assoc($sqldata)){
                $projarr = array("id"=>$data['id'],
                        "isreadonly"=>$data['isreadonly']
                );
        }
}else if($formtype == "TestcaseDetails"){

	$editPermission = 0;
	if((isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin") || (isset($_SESSION["ruleIds"]) && in_array("15", explode(",", $_SESSION["ruleIds"])))){ 
	$editPermission = 1;
	}
	$stmt = mysqli_prepare($conn,"SELECT tc.*,
	concat(IFNULL(a1.s_e_fname,''),' ',IFNULL(a1.s_e_mname,''),' ',IFNULL(a1.s_e_lname,'')) as assignto,
	concat(IFNULL(a2.s_e_fname,''),' ',IFNULL(a2.s_e_mname,''),' ',IFNULL(a2.s_e_lname,'')) as author,
	concat(IFNULL(a3.s_e_fname,''),' ',IFNULL(a3.s_e_mname,''),' ',IFNULL(a3.s_e_lname,'')) as reviewer,
	IFNULL(cat.s_cat_name,'') as category,
	IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_name,'') as releaseNum 
	from s_testcase tc 
	join s_project p on p.s_p_id = tc.projectId 
	join s_release r on r.s_r_id = tc.releaseId  
	left join s_tccategorymaster cat on cat.s_cat_id = tc.s_t_category and tc.s_t_category !='0' 
 	left JOIN s_employees a1 on a1.s_e_id = tc.s_t_assignto and tc.s_t_assignto !='0'
 	left JOIN s_employees a2 on a2.userId = tc.s_t_author and tc.s_t_author !='0'
 	left JOIN s_employees a3 on a3.s_e_id = tc.s_t_reviewer and tc.s_t_author !='0'

	where s_t_id = ? and  tc.accountId = ?
	order by tc.s_t_id desc");
	mysqli_stmt_bind_param($stmt, "ii",$id,$accountId);
	mysqli_stmt_execute($stmt);
	$sqldata = mysqli_stmt_get_result($stmt);
	$projarr = array();
	while($data = mysqli_fetch_assoc($sqldata)){


		$nextId = 0;
		$nextsqldata = mysqli_query($conn,"SELECT s_t_id as nextId from s_testcase where accountId = '".$accountId."' and s_t_id = (select min(s_t_id) from  s_testcase where s_t_id > '".$id."' and  accountId = '".$accountId."')");
		while($nextdata = mysqli_fetch_assoc($nextsqldata)){
			$nextId = $nextdata['nextId'];
		}
		$prvId = 0;
		$prvsqldata = mysqli_query($conn,"SELECT s_t_id as prvId from s_testcase where accountId = '".$accountId."' and s_t_id = (select max(s_t_id) from  s_testcase where s_t_id < '".$id."' and  accountId = '".$accountId."' )");
		while($prvdata = mysqli_fetch_assoc($prvsqldata)){
			$prvId = $prvdata['prvId'];
		}

		$activityname = "";
		if($data['s_t_activityIds'] !=""){
			$chksql = "select IFNULL(GROUP_CONCAT(s_a_name),'') as activityname from s_activitymaster where s_a_id in  (".$data['s_t_activityIds'].") and accountId = '".$accountId."' ";
			$chkstmt = mysqli_query( $conn, $chksql);

			while($actdata = mysqli_fetch_assoc($chkstmt)){
				$activityname = $actdata['activityname'];
			}
		}
		$author = "Admin";
		if(trim($data['author']) !=""){
			$author = $data['author'];
		}
		$projarr = array("id"=>$data['s_t_id'],
			"projectId"=>$data['projectname'],
			"releaseId"=>$data['releaseNum'],
			"activityId"=>$activityname,
			"scenarioId"=>$data['s_d_tempscenarioId'],
			"scenarioIdstr"=>$data['s_t_testscenarionum'],
			"testcasenum"=>$data['s_t_testcasenum'],
			"module"=>$data['s_t_module'],
			"submodule"=>$data['s_t_submodule'],
			"testscenariodesc"=>$data['s_t_testscenariodesc'],
			"testcasedesc"=>$data['s_t_testcasedesc'],
			"steps"=>$data['s_t_steps'],
			"expectedresult"=>$data['s_t_expectedresult'],
			"precondition"=>$data['s_t_precondition'],
			"testdata"=>$data['s_t_testdata'],
			"assignto"=>$data['assignto'],
			"author"=>$author,
			"reviewer"=>$data['reviewer'],
			"category"=>$data['category'],
			"testmode"=>$data['s_t_testmode'],
			"comment"=>$data['s_t_comment'],
			"nextId"=>$nextId,
			"prvId"=>$prvId,
			"editPermission"=>$editPermission,
		);
	}
}else if($formtype == "Defectdetails"){

	$editPermission = 0;
	if((isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin") || (isset($_SESSION["ruleIds"]) && in_array("27", explode(",", $_SESSION["ruleIds"])))){ 
		$editPermission = 1;
		}
	$where = "";
	if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
		$where = " AND projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."' )";
		
	}
	$stmt = mysqli_prepare($conn,"SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_name,'') as releaseNum,
	IFNULL(t.s_t_testcasenum,'') as testcasenum,
	IFNULL(ds.s_ds_name,'') as defectstatus,
	IFNULL(dt.s_dt_name,'') as defecttype

	from s_defect d 
	left join s_project p on p.s_p_id = d.projectId 
	left join s_release r on r.s_r_id = d.releaseId 
	left join s_testcase t on t.s_t_id = d.testcaseId 
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId 
	where d.s_d_id = ? and d.accountId = ? ");
	

	mysqli_stmt_bind_param($stmt, "ii",$id,$accountId);
	mysqli_stmt_execute($stmt);
	$sqldata = mysqli_stmt_get_result($stmt);

	$projarr = array();
	while($data = mysqli_fetch_assoc($sqldata)){
		$nextId = 0;
		$nextsqldata = mysqli_query($conn,"SELECT s_d_id as nextId from s_defect where accountId = '".$accountId."' and s_d_id = (select min(s_d_id) from  s_defect where s_d_id > '".$id."' $where)");
		while($nextdata = mysqli_fetch_assoc($nextsqldata)){
			$nextId = $nextdata['nextId'];
		}
		$prvId = 0;
		$prvsqldata = mysqli_query($conn,"SELECT s_d_id as prvId from s_defect where accountId = '".$accountId."' and s_d_id = (select max(s_d_id) from  s_defect where s_d_id < '".$id."' $where)");
		while($prvdata = mysqli_fetch_assoc($prvsqldata)){
			$prvId = $prvdata['prvId'];
		}
		$attachmentsarr = array();
		$assignmentarr = array();

		$assigndata = mysqli_query($conn,"SELECT d.*,concat(IFNULL(s_e_fname,''),' ',IFNULL(s_e_mname,''),' ',IFNULL(s_e_lname,'')) as assignee	
			from s_defectassignmenthistory d 
			left JOIN s_employees o1 on o1.s_e_id = d.s_dh_assignto and d.s_dh_assignto !='0' 
			where d.defectId = '".$data['s_d_id']."' and d.accountId = '".$accountId."' ");
		while($adata = mysqli_fetch_assoc($assigndata)){
			$assignmentarr[] = $adata['assignee'];
		}
		$dir = STEP_dir."defectdata/".$accountId."/".$data['s_d_id']."/";
		if(is_dir($dir)) {

			$files = array_diff(scandir($dir), array('..', '.'));
			if(count($files) >0){
				foreach($files as $file){
					// echo $file;
					$ext = pathinfo($file, PATHINFO_EXTENSION);
					$attachmentsarr[] = array("filenamestr"=>$file,"extension"=>$ext,"filename"=>STEP_root.'defectdata/'.$accountId.'/'.$data['s_d_id']."/".$file,"filepath"=>'defectdata/'.$accountId.'/'.$data['s_d_id']."/".$file);;
				}
			}
		}
		$projarr = array("id"=>$data['s_d_id'],
			"defectnum"=>$data['s_d_defectnum'],
			"projectId"=>$data['projectname'],
			"releaseId"=>$data['releaseNum'],
			"testcaseId"=>$data['testcasenum'],
			"defecttypeId"=>$data['defecttype'],
			"defectstatusId"=>$data['defectstatus'],
			"module"=>$data['s_d_module'],
			"submodule"=>$data['s_d_submodule'],
			"severity"=>$data['s_d_severity'],
			"priority"=>$data['s_d_priority'],
			"shortdesc"=>$data['s_d_shortdesc'],
			"longdesc"=>$data['s_d_longdesc'],
			"testdata"=>$data['s_d_testdata'],
			"steps"=>$data['s_d_steps'],
			"expectedresult"=>$data['s_d_expectedresult'],
			"actualresult"=>$data['s_d_actualresult'],
			"comment"=>$data['s_d_comment'],
			"assignto"=>$data['s_d_assignto'],
			"attachments"=>$attachmentsarr,
			"assignee"=>$assignmentarr,
			"nextId"=>$nextId,
			"prvId"=>$prvId,
			"editPermission"=>$editPermission,
		);
	}
}else if($formtype == "Testcase_repository"){


	$editPermission = 0;
	if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "StepAdmin"){ 
		$editPermission = 1;
	}
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
	$stmt = mysqli_prepare($conn,"SELECT * from ".$table." where s_t_id = ? "); //and accountId = '".$accountId."' 
	
	mysqli_stmt_bind_param($stmt, "i",$id);
	mysqli_stmt_execute($stmt);
	$sqldata = mysqli_stmt_get_result($stmt);
	$projarr = array();
	while($data = mysqli_fetch_assoc($sqldata)){

		$editable = 0; // editable allow
		

		$projarr = array("id"=>$data['s_t_id'],
			"application"=>$data['s_t_application'],
			"activityId"=>$data['s_t_activityIds'],
			"scenarioId"=>$data['s_d_tempscenarioId'],
			"testcasenum"=>$data['s_t_testcasenum'],
			"scenarioIdstr"=>$data['s_t_testscenarionum'],
			"module"=>$data['s_t_module'],
			"submodule"=>$data['s_t_submodule'],
			"testscenariodesc"=>$data['s_t_testscenariodesc'],
			"testcasedesc"=>$data['s_t_testcasedesc'],
			"steps"=>$data['s_t_steps'],
			"expectedresult"=>$data['s_t_expectedresult'],
			"precondition"=>$data['s_t_precondition'],
			"testdata"=>$data['s_t_testdata'],
			"assignto"=>$data['s_t_assignto'],
			"author"=>$data['s_t_author'],
			"reviewer"=>$data['s_t_reviewer'],
			"testmode"=>$data['s_t_testmode'],
			"comment"=>$data['s_t_comment'],
			"editable"=>$editable,
			"editPermission"=>$editPermission,
		);
	}
}else if($formtype == "TestcaseSteps"){
	$stmt = mysqli_prepare($conn,"SELECT *  from s_testcase_steps where accountId = ? and s_tss_id = ?");
	
	mysqli_stmt_bind_param($stmt, "ii",$accountId,$id);
	mysqli_stmt_execute($stmt);
	$sqldata = mysqli_stmt_get_result($stmt);	
	$projarr = array();
	while($data = mysqli_fetch_assoc($sqldata)){
		$projarr = array("id"=>$data['s_tss_id'],
			"steps"=>$data['s_tss_steps'],
			"expectedresult"=>$data['s_tss_expectedresult']
		);
	}
}
echo json_encode($projarr);
?>
