<?php
include('../config.php');
session_start();
 
$enteredby = 0;$accountId=0;$userempid = 0;
 
/** this script get the chart data in tabular format */
if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
    $userempid = $_SESSION["userempid"];
}

$projectId = (isset($_POST['projectId']) && !empty($_POST['projectId'])? implode(",", $_POST['projectId']) : "");
$releaseId = (isset($_POST['releaseId'])  && !empty($_POST['releaseId'])? implode(",", $_POST['releaseId']) : "");
$activityId = (isset($_POST['activityId'])  && !empty($_POST['activityId'])? implode(",", $_POST['activityId']) : "");
$defectstatusId = (isset($_POST['defectstatusId'])  && !empty($_POST['defectstatusId'])? implode(",", $_POST['defectstatusId']) : "");
$defectdate = (isset($_POST['defectdate']) && !empty($_POST['defectdate']) ?  "'".date('Y-m-d 23:59:59', strtotime(str_replace('/', '-', $_POST['defectdate'])))."'" : 'NULL');

$xVal = isset($_POST['xVal']) && !empty($_POST['xVal']) && $_POST['xVal'] !="Not Specified" ? $_POST['xVal']: "";
$type = isset($_POST['type']) && !empty($_POST['type']) ? $_POST['type']: "";
$chart_id = isset($_POST['chart_id']) && !empty($_POST['chart_id']) ? $_POST['chart_id']: "0";
$xId = isset($_POST['xId']) && !empty($_POST['xId']) ? $_POST['xId']: "0";


$where = "";
if($projectId !=""){
	$where = $where." and d.projectId in ($projectId) ";
}

if($releaseId !=""){			
	$where = $where." and d.releaseId in ($releaseId) ";
}

if($activityId !=""){
	$where = $where." and d.activityId in ($activityId) ";
}

if($defectstatusId !=""){
	$where = $where." and d.defectstatusId in ($defectstatusId) ";
}


if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$where .= " and d.projectId in (select s_p_id from s_project where (s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."' ) and accountId = '".$accountId."')";
}


echo '  
<table id="defectinfotbl"class="table compact " style="width:100%;">
			<thead  class="bg-step text-white">
	<tr>
		<th>Project</th>
		<th>Release ID</th>
		<th>Module</th>
		<th>Sub Module</th>
		<th>Defect ID</th>'.
		(($type == "Ageing") ? '<th>Ageing in Days</th><th>Created at</th>' : '<th>Testcase ID</th>').
		'<th>Description</th>
		<th>Type</th> 
		<th>Status</th> 
		<th>Severity</th> 
		<th>Priority</th> '.
		(($type == "Ageing") ? '' : '<th>Created at</th> ').
'	</tr>
	</thead>
	<tbody>';
if($type == "TestcaseDensity"){
	$ageingsql = "SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_releaseId,'') as releaseNum,
	IFNULL(t.s_t_testcasenum,'') as testcasenum,
	IFNULL(ds.s_ds_name,'') as defectstatus,
	IFNULL(dt.s_dt_name,'') as defecttype

	from s_defect d 
	left join s_project p on p.s_p_id = d.projectId 
	left join s_release r on r.s_r_id = d.releaseId 
	left join s_testcase t on t.s_t_id = d.testcaseId 
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId where d.accountId = ?   $where  ".
	($xVal == "Not Specified" || $xVal == "0" || $xVal == "" ? " AND (d.s_d_module is null or d.s_d_module = '' )" : " and d.s_d_module = '".$xVal."' ");
//echo $ageingsql;		
	$stmt = mysqli_prepare($conn, $ageingsql);
	mysqli_stmt_bind_param($stmt, "s",$accountId);
	mysqli_stmt_execute($stmt);
	$sqlDefectmodule = mysqli_stmt_get_result($stmt);
				
	$dSrno = 0;
	while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
		echo '<tr>
					<td>'.$moddata['projectname'].'</td>
					<td>'.$moddata['releaseNum'].'</td>
					<td>'.$moddata['s_d_module'].'</td>
					<td>'.$moddata['s_d_submodule'].'</td>
					<td>'.$moddata['s_d_defectnum'].'</td>
					<td>'.$moddata['testcasenum'].'</td>
					<td>'.$moddata['s_d_shortdesc'].'</td>
					<td>'.$moddata['defecttype'].'</td>
					<td>'.$moddata['defectstatus'].'</td>
					<td>'.$moddata['s_d_severity'].'</td>
					<td>'.$moddata['s_d_priority'].'</td>
					<td>'.(isset($moddata['s_d_createdtime']) && ($moddata['s_d_createdtime'] != "0000-00-00 00:00:00") ? date("d/m/Y h:i a",strtotime($moddata['s_d_createdtime'])) : "").'</td>
				</tr>';
	}
		 
	mysqli_stmt_close($stmt);		
}else if($type == "RTMDensity"){
	$ageingsql = "SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_releaseId,'') as releaseNum,
	IFNULL(t.s_t_testcasenum,'') as testcasenum,
	IFNULL(ds.s_ds_name,'') as defectstatus,
	IFNULL(dt.s_dt_name,'') as defecttype

	from s_defect d 
	
	left join s_project p on p.s_p_id = d.projectId 
	left join s_release r on r.s_r_id = d.releaseId 
	left join s_testcase t on t.s_t_id = d.testcaseId 
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId where d.accountId = ?   $where  ".
	($xVal == "Not Specified" || $xVal == "0" || $xVal == "" ? " AND (d.s_d_module is null or d.s_d_module = '' )" : " and d.s_d_module = '".$xVal."' ");
//echo $ageingsql;		
	$stmt = mysqli_prepare($conn, $ageingsql);
	mysqli_stmt_bind_param($stmt, "s",$accountId);
	mysqli_stmt_execute($stmt);
	$sqlDefectmodule = mysqli_stmt_get_result($stmt);
				
	$dSrno = 0;
	while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
		echo '<tr>
					<td>'.$moddata['projectname'].'</td>
					<td>'.$moddata['releaseNum'].'</td>
					<td>'.$moddata['s_d_module'].'</td>
					<td>'.$moddata['s_d_submodule'].'</td>
					<td>'.$moddata['s_d_defectnum'].'</td>
					<td>'.$moddata['testcasenum'].'</td>
					<td>'.$moddata['s_d_shortdesc'].'</td>
					<td>'.$moddata['defecttype'].'</td>
					<td>'.$moddata['defectstatus'].'</td>
					<td>'.$moddata['s_d_severity'].'</td>
					<td>'.$moddata['s_d_priority'].'</td>
					<td>'.(isset($moddata['s_d_createdtime']) && ($moddata['s_d_createdtime'] != "0000-00-00 00:00:00") ? date("d/m/Y h:i a",strtotime($moddata['s_d_createdtime'])) : "").'</td>
				</tr>';
	}
		 
	mysqli_stmt_close($stmt);		
}else if($type == "Rejected"){
	$ageingsql = "SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_releaseId,'') as releaseNum,
	IFNULL(t.s_t_testcasenum,'') as testcasenum,
	IFNULL(ds.s_ds_name,'') as defectstatus,
	IFNULL(dt.s_dt_name,'') as defecttype

	from s_defect d 
	left join s_project p on p.s_p_id = d.projectId 
	left join s_release r on r.s_r_id = d.releaseId 
	left join s_testcase t on t.s_t_id = d.testcaseId 
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId where d.accountId = ?   $where ".
	($xVal == "Rejected Defects" ? "AND defectstatusId in (select s_ds_id from s_defectstatusmaster where s_ds_name LIKE '%decline%')" : 
		"");
		
	$stmt = mysqli_prepare($conn, $ageingsql);
	mysqli_stmt_bind_param($stmt, "s",$accountId);
	mysqli_stmt_execute($stmt);
	$sqlDefectmodule = mysqli_stmt_get_result($stmt);
				
	$dSrno = 0;
	while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
		echo '<tr>
					<td>'.$moddata['projectname'].'</td>
					<td>'.$moddata['releaseNum'].'</td>
					<td>'.$moddata['s_d_module'].'</td>
					<td>'.$moddata['s_d_submodule'].'</td>
					<td>'.$moddata['s_d_defectnum'].'</td>
					<td>'.$moddata['testcasenum'].'</td>
					<td>'.$moddata['s_d_shortdesc'].'</td>
					<td>'.$moddata['defecttype'].'</td>
					<td>'.$moddata['defectstatus'].'</td>
					<td>'.$moddata['s_d_severity'].'</td>
					<td>'.$moddata['s_d_priority'].'</td>
					<td>'.(isset($moddata['s_d_createdtime']) && ($moddata['s_d_createdtime'] != "0000-00-00 00:00:00") ? date("d/m/Y h:i a",strtotime($moddata['s_d_createdtime'])) : "").'</td>
				</tr>';
	}
		 
	mysqli_stmt_close($stmt);		
}else if($type == "Reopened"){
	$ageingsql = "SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_releaseId,'') as releaseNum,
	IFNULL(t.s_t_testcasenum,'') as testcasenum,
	IFNULL(ds.s_ds_name,'') as defectstatus,
	IFNULL(dt.s_dt_name,'') as defecttype

	from s_defect d 
	left join s_project p on p.s_p_id = d.projectId 
	left join s_release r on r.s_r_id = d.releaseId 
	left join s_testcase t on t.s_t_id = d.testcaseId 
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId where d.accountId = ?   $where ".
	($xVal == "Reopened Defects" ? " AND defectstatusId in (select s_ds_id from s_defectstatusmaster where s_ds_name LIKE '%reopen%')" : 
		($xVal == "Total Defect Closed" ? " AND defectstatusId in (select s_ds_id from s_defectstatusmaster where s_ds_name LIKE '%close%')" : 
		""));
		
	$stmt = mysqli_prepare($conn, $ageingsql);
	mysqli_stmt_bind_param($stmt, "s",$accountId);
	mysqli_stmt_execute($stmt);
	$sqlDefectmodule = mysqli_stmt_get_result($stmt);
				
	$dSrno = 0;
	while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
		echo '<tr>
					<td>'.$moddata['projectname'].'</td>
					<td>'.$moddata['releaseNum'].'</td>
					<td>'.$moddata['s_d_module'].'</td>
					<td>'.$moddata['s_d_submodule'].'</td>
					<td>'.$moddata['s_d_defectnum'].'</td>
					<td>'.$moddata['testcasenum'].'</td>
					<td>'.$moddata['s_d_shortdesc'].'</td>
					<td>'.$moddata['defecttype'].'</td>
					<td>'.$moddata['defectstatus'].'</td>
					<td>'.$moddata['s_d_severity'].'</td>
					<td>'.$moddata['s_d_priority'].'</td>
					<td>'.(isset($moddata['s_d_createdtime']) && ($moddata['s_d_createdtime'] != "0000-00-00 00:00:00") ? date("d/m/Y h:i a",strtotime($moddata['s_d_createdtime'])) : "").'</td>
				</tr>';
	}
		 
	mysqli_stmt_close($stmt);		
}else if($type == "Resolution"){
	$ageingsql = "SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_releaseId,'') as releaseNum,
	IFNULL(t.s_t_testcasenum,'') as testcasenum,
	IFNULL(ds.s_ds_name,'') as defectstatus,
	IFNULL(dt.s_dt_name,'') as defecttype

	from s_defect d 
	left join s_project p on p.s_p_id = d.projectId 
	left join s_release r on r.s_r_id = d.releaseId 
	left join s_testcase t on t.s_t_id = d.testcaseId 
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId where d.accountId = ? and d.s_d_module = ?  $where 
	AND defectstatusId in (select s_ds_id from s_defectstatusmaster where s_ds_name LIKE 'Close%')
  	AND s_d_updatetime > s_d_createdtime";
		
	$stmt = mysqli_prepare($conn, $ageingsql);
	mysqli_stmt_bind_param($stmt, "ss",$accountId, $xVal);
	mysqli_stmt_execute($stmt);
	$sqlDefectmodule = mysqli_stmt_get_result($stmt);
				
	$dSrno = 0;
	while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
		echo '<tr>
					<td>'.$moddata['projectname'].'</td>
					<td>'.$moddata['releaseNum'].'</td>
					<td>'.$moddata['s_d_module'].'</td>
					<td>'.$moddata['s_d_submodule'].'</td>
					<td>'.$moddata['s_d_defectnum'].'</td>
					<td>'.$moddata['testcasenum'].'</td>
					<td>'.$moddata['s_d_shortdesc'].'</td>
					<td>'.$moddata['defecttype'].'</td>
					<td>'.$moddata['defectstatus'].'</td>
					<td>'.$moddata['s_d_severity'].'</td>
					<td>'.$moddata['s_d_priority'].'</td>
					<td>'.(isset($moddata['s_d_createdtime']) && ($moddata['s_d_createdtime'] != "0000-00-00 00:00:00") ? date("d/m/Y h:i a",strtotime($moddata['s_d_createdtime'])) : "").'</td>
				</tr>';
	}
		 
	mysqli_stmt_close($stmt);		
}else if($type == "TestingLeakage" || $type == "ProductionLeakage"){


	$ageingsql = "SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_releaseId,'') as releaseNum,
	IFNULL(t.s_t_testcasenum,'') as testcasenum,
	IFNULL(ds.s_ds_name,'') as defectstatus,
	IFNULL(dt.s_dt_name,'') as defecttype

	from s_defect d 
	left join s_project p on p.s_p_id = d.projectId 
	left join s_release r on r.s_r_id = d.releaseId 
	left join s_testcase t on t.s_t_id = d.testcaseId 
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId where d.accountId = ?  ".
	 ($type == "TestingLeakage" ? " and d.s_d_environment in('UAT','QA') " : ($type == "ProductionLeakage" ? " and d.s_d_environment in ('Production','UAT','QA')" : "")).
	($xVal == "Not Specified" || $xVal == "0" || $xVal == "" ? " AND (d.s_d_module is null or d.s_d_module = '' )" : " and d.s_d_module = '".$xVal."' ").
	" $where";
//	echo $ageingsql; exit;	
	$stmt = mysqli_prepare($conn, $ageingsql);
	mysqli_stmt_bind_param($stmt, "s",$accountId);
	mysqli_stmt_execute($stmt);
	$sqlDefectmodule = mysqli_stmt_get_result($stmt);
				
	$dSrno = 0;
	while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
		echo '<tr>
					<td>'.$moddata['projectname'].'</td>
					<td>'.$moddata['releaseNum'].'</td>
					<td>'.$moddata['s_d_module'].'</td>
					<td>'.$moddata['s_d_submodule'].'</td>
					<td>'.$moddata['s_d_defectnum'].'</td>
					<td>'.$moddata['testcasenum'].'</td>
					<td>'.$moddata['s_d_shortdesc'].'</td>
					<td>'.$moddata['defecttype'].'</td>
					<td>'.$moddata['defectstatus'].'</td>
					<td>'.$moddata['s_d_severity'].'</td>
					<td>'.$moddata['s_d_priority'].'</td>
					<td>'.(isset($moddata['s_d_createdtime']) && ($moddata['s_d_createdtime'] != "0000-00-00 00:00:00") ? date("d/m/Y h:i a",strtotime($moddata['s_d_createdtime'])) : "").'</td>
				</tr>';
	}
		 
	mysqli_stmt_close($stmt);		
}else if($type == "ProductionLeakage"){
	$ageingsql = "SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_releaseId,'') as releaseNum,
	IFNULL(t.s_t_testcasenum,'') as testcasenum,
	IFNULL(ds.s_ds_name,'') as defectstatus,
	IFNULL(dt.s_dt_name,'') as defecttype

	from s_defect d 
	left join s_project p on p.s_p_id = d.projectId 
	left join s_release r on r.s_r_id = d.releaseId 
	left join s_testcase t on t.s_t_id = d.testcaseId 
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId where d.accountId = ? and ".
	($xVal == "Not Specified" || $xVal == "0" || $xVal == "" ? " AND (d.s_d_module is null or d.s_d_module = '' )" : " and d.s_d_module = '".$xVal."' ").
	" $where";
		
	$stmt = mysqli_prepare($conn, $ageingsql);
	mysqli_stmt_bind_param($stmt, "s",$accountId);
	mysqli_stmt_execute($stmt);
	$sqlDefectmodule = mysqli_stmt_get_result($stmt);
				
	$dSrno = 0;
	while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
		echo '<tr>
					<td>'.$moddata['projectname'].'</td>
					<td>'.$moddata['releaseNum'].'</td>
					<td>'.$moddata['s_d_module'].'</td>
					<td>'.$moddata['s_d_submodule'].'</td>
					<td>'.$moddata['s_d_defectnum'].'</td>
					<td>'.$moddata['testcasenum'].'</td>
					<td>'.$moddata['s_d_shortdesc'].'</td>
					<td>'.$moddata['defecttype'].'</td>
					<td>'.$moddata['defectstatus'].'</td>
					<td>'.$moddata['s_d_severity'].'</td>
					<td>'.$moddata['s_d_priority'].'</td>
					<td>'.(isset($data['s_d_createdtime']) && ($data['s_d_createdtime'] != "0000-00-00 00:00:00") ? date("d/m/Y h:i a",strtotime($data['s_d_createdtime'])) : "").'</td>
				</tr>';
	}
		 
	mysqli_stmt_close($stmt);		
}else if($type == "Ageing"){
	$ageingsql = "SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_releaseId,'') as releaseNum,
	IFNULL(ds.s_ds_name,'') as defectstatus,
	IFNULL(dt.s_dt_name,'') as defecttype,
	(IFNULL(DATEDIFF(".$defectdate.",s_d_createdtime),0) ) as ddays
	from s_defect d 
	left join s_project p on p.s_p_id = d.projectId 
	left join s_release r on r.s_r_id = d.releaseId 
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId where d.accountId = ? and d.s_d_module = ?  $where and defectstatusId in (select s_ds_id from s_defectstatusmaster where s_ds_name LIKE 'Open%') ";
	
	$stmt = mysqli_prepare($conn, $ageingsql);
	mysqli_stmt_bind_param($stmt, "ss",$accountId, $xVal);
	mysqli_stmt_execute($stmt);
	$sqlDefectmodule = mysqli_stmt_get_result($stmt);
				
	$dSrno = 0;
	while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
		echo '<tr>
					<td>'.$moddata['projectname'].'</td>
					<td>'.$moddata['releaseNum'].'</td>
					<td>'.$moddata['s_d_module'].'</td>
					<td>'.$moddata['s_d_submodule'].'</td>
					<td>'.$moddata['s_d_defectnum'].'</td>
					<td>'.$moddata['ddays'].'</td>
					<td>'.(isset($moddata['s_d_createdtime']) && ($moddata['s_d_createdtime'] != "0000-00-00 00:00:00") ? date("d/m/Y h:i a",strtotime($moddata['s_d_createdtime'])) : "").'</td>
					<td>'.$moddata['s_d_shortdesc'].'</td>
					<td>'.$moddata['defecttype'].'</td>
					<td>'.$moddata['defectstatus'].'</td>
					<td>'.$moddata['s_d_severity'].'</td>
					<td>'.$moddata['s_d_priority'].'</td>
				</tr>';
	}
		 
	mysqli_stmt_close($stmt);		
}else {
	$tbl = "Defect";
	$sqlCustom = "select * from s_chartsetting where s_c_tablename=? and s_c_id = ? "; // get all chart w.r.t. project activity phase
	$stmt = mysqli_prepare($conn, $sqlCustom);
	mysqli_stmt_bind_param($stmt, "si", $tbl, $chart_id);
	mysqli_stmt_execute($stmt);
	$sqlCustomData = mysqli_stmt_get_result($stmt);
	while($cdsdata = mysqli_fetch_assoc($sqlCustomData)){
		$xAxis = $cdsdata['s_c_xaxis'];


		$category = array();
		$chart_type = $cdsdata['s_c_charttype'];
		$subtitle = $cdsdata['s_c_subtitle'];
		$yAxis = $cdsdata['s_c_yaxis'];
		$title = $cdsdata['s_c_title'];
		$cal_type = $cdsdata['s_c_type'];
		$rowarr = array();
		$colvaluearr = array();
		$seriesdata = array();
		$rowarr['id'] = $cdsdata['s_c_id'];
		$rowarr['title'] = $title;
		$rowarr['subtitle'] = $subtitle;
		$rowarr['charttype'] = $chart_type;
		$rowarr['type'] = $cal_type;
		$rowarr['data'] = $cdsdata['s_c_yaxis'];
		
		if($chart_type == "Pie"){
			//$where .= " AND d.".$yAxis." = '".$xId."' ";
   			if($xId == "Not Specified" || $xId =="0" || $xId == "") {$where .= " AND (d.".$yAxis." is null or d.".$yAxis." = '' )";}
			else {$where .= " AND d.".$yAxis." = '".$xId."' ";}

			$sqlDefectmodule = mysqli_query($conn,"SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
			IFNULL(r.s_r_releaseId,'') as releaseNum,
			IFNULL(t.s_t_testcasenum,'') as testcasenum,
			IFNULL(ds.s_ds_name,'') as defectstatus,
			IFNULL(dt.s_dt_name,'') as defecttype

			from s_defect d 
			left join s_project p on p.s_p_id = d.projectId 
			left join s_release r on r.s_r_id = d.releaseId 
			left join s_testcase t on t.s_t_id = d.testcaseId 
			left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
			left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId  where d.accountId = '".$accountId."'  $where");
						
						
			$dSrno = 0;
			while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
				echo '<tr>
							<td>'.$moddata['projectname'].'</td>
							<td>'.$moddata['releaseNum'].'</td>
							<td>'.$moddata['s_d_module'].'</td>
							<td>'.$moddata['s_d_submodule'].'</td>
							<td>'.$moddata['s_d_defectnum'].'</td>
							<td>'.$moddata['testcasenum'].'</td>
							<td>'.$moddata['s_d_shortdesc'].'</td>
							<td>'.$moddata['defecttype'].'</td>
							<td>'.$moddata['defectstatus'].'</td>
							<td>'.$moddata['s_d_severity'].'</td>
							<td>'.$moddata['s_d_priority'].'</td>
							<td>'.(isset($moddata['s_d_createdtime']) && ($moddata['s_d_createdtime'] != "0000-00-00 00:00:00") ? date("d/m/Y h:i a",strtotime($moddata['s_d_createdtime'])) : "").'</td>
						</tr>';
			}

		}else{

			if(in_array($xAxis, array("s_d_defectnum","s_d_module","s_d_submodule","s_d_severity","s_d_priority"))){
//				$where .= " AND d.".$yAxis." = '".$xVal."' ";
				if($xVal == "Not Specified" || $xVal == "0" || $xVal == "") {$where .= " AND (d.".$xAxis." is null or d.".$xAxis." = '' )";}
				else {$where .= " AND d.".$xAxis." = '".$xVal."' ";}
			}else{
				switch ($xAxis) {
					case 'projectId':
						$where .= " and d.projectId in (select s_p_id from s_project where s_p_name = '".$xVal."' and accountId = '".$accountId."') ";
						break;
					case 'releaseId':
						$where .= " and d.releaseId in (select s_p_id from s_project where s_p_name = '".$xVal."' and accountId = '".$accountId."') ";
						break;
					case 'testcaseId':
						$where .= " and d.testcaseId in (select s_t_id from s_testcase where s_t_testcasenum = '".$xVal."' and accountId = '".$accountId."') ";
						break;
					case 'defecttypeId':
						if($xVal == "Not Specified" || $xVal == "0" || $xVal == "") {$where .= " AND (d.defecttypeId is null or d.defecttypeId = '' )";}
                                		else {
						$where .= " and d.defecttypeId in (select s_dt_id from s_defecttypemaster where s_dt_name = '".$xVal."' and accountId = '".$accountId."') ";
						}
						break;	
					case 'defectstatusId':
						if($xVal == "Not Specified" || $xVal == "0" || $xVal == "") {$where .= " AND (d.defectstatusId is null or d.defectstatusId = '' )";}
                                                else {
						$where .= " and d.defectstatusId in (select s_ds_id from s_defectstatusmaster where s_ds_name = '".$xVal."' and accountId = '".$accountId."') ";
						}
						break;	
					case 's_d_assignto':
						$where .= " and d.s_d_assignto in (select s_e_id from s_employees where concat(IFNULL(s_e_fname,''),' ',IFNULL(s_e_mname,''),' ',IFNULL(s_e_lname,'')) = '".$xVal."' and accountId = '".$accountId."') ";
						break;	
					case 's_d_reportedby':
						$where .= " and d.s_d_reportedby in (select userId from s_employees where concat(IFNULL(s_e_fname,''),' ',IFNULL(s_e_mname,''),' ',IFNULL(s_e_lname,'')) = '".$xVal."' and accountId = '".$accountId."') ";
						break;		
				}
			}
//echo $where; exit;		
			$sqlDefectmodule = mysqli_query($conn,"SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
			IFNULL(r.s_r_releaseId,'') as releaseNum,
			IFNULL(t.s_t_testcasenum,'') as testcasenum,
			IFNULL(ds.s_ds_name,'') as defectstatus,
			IFNULL(dt.s_dt_name,'') as defecttype

			from s_defect d 
			left join s_project p on p.s_p_id = d.projectId 
			left join s_release r on r.s_r_id = d.releaseId 
			left join s_testcase t on t.s_t_id = d.testcaseId 
			left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
			left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId  where d.accountId = '".$accountId."' $where");
			
			$dSrno = 0;
			while($moddata = mysqli_fetch_assoc($sqlDefectmodule)){
				echo '<tr>
							<td>'.$moddata['projectname'].'</td>
							<td>'.$moddata['releaseNum'].'</td>
							<td>'.$moddata['s_d_module'].'</td>
							<td>'.$moddata['s_d_submodule'].'</td>
							<td>'.$moddata['s_d_defectnum'].'</td>
							<td>'.$moddata['testcasenum'].'</td>
							<td>'.$moddata['s_d_shortdesc'].'</td>
							<td>'.$moddata['defecttype'].'</td>
							<td>'.$moddata['defectstatus'].'</td>
							<td>'.$moddata['s_d_severity'].'</td>
							<td>'.$moddata['s_d_priority'].'</td>
							<td>'.(isset($moddata['s_d_createdtime']) && ($moddata['s_d_createdtime'] != "0000-00-00 00:00:00") ? date("d/m/Y h:i a",strtotime($moddata['s_d_createdtime'])) : "").'</td>
						</tr>';
			}
		}
	}
	
	mysqli_stmt_close($stmt);
}
	echo '</tbody></table>';
