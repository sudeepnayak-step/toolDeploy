<?php
include('../config.php');
session_start();
 
$enteredby = 0;$accountId=0;$userempid = 0;
 
/** get the dynamic defect chart data to show on the dashboard */
if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
    $userempid = $_SESSION["userempid"];
}

$projectId = (isset($_GET['projectId']) && !empty($_GET['projectId'])? $_GET['projectId'] : "");
$releaseId = (isset($_GET['releaseId'])  && !empty($_GET['releaseId'])?  $_GET['releaseId'] : "");
$activityId = (isset($_GET['activityId'])  && !empty($_GET['activityId'])? $_GET['activityId'] : "");
$defectstatusId = (isset($_GET['defectstatusId'])  && !empty($_GET['defectstatusId'])?  $_GET['defectstatusId'] : "");
$defectdate = (isset($_GET['defectdate']) && !empty($_GET['defectdate']) ?  "'".date('Y-m-d 23:59:59', strtotime(str_replace('/', '-', $_GET['defectdate'])))."'" :  "'".date('Y-m-d 23:59:59')."'");

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
	$where .= " and d.projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."'  and accountId = '".$accountId."')";
}

$stmt = mysqli_prepare($conn,"SELECT d.*,IFNULL(p.s_p_name,'') as projectname,
	IFNULL(r.s_r_releaseId,'') as releaseNum,
	IFNULL(t.s_t_testcasenum,'') as testcasenum,
	IFNULL(ds.s_ds_name,'') as defectstatus,
	IFNULL(dt.s_dt_name,'') as defecttype,
	concat(IFNULL(s_e_fname,''),' ',IFNULL(s_e_mname,''),' ',IFNULL(s_e_lname,'')) as assignto

	from s_defect d 
	left join s_project p on p.s_p_id = d.projectId 
	left join s_release r on r.s_r_id = d.releaseId 
	left join s_testcase t on t.s_t_id = d.testcaseId 
	left join s_defectstatusmaster ds on ds.s_ds_id = d.defectstatusId 
	left join s_defecttypemaster dt on dt.s_dt_id = d.defecttypeId 
 	left JOIN s_employees o1 on o1.s_e_id = d.s_d_assignto
	where d.accountId = ?  $where 
	order by d.s_d_id desc");
	mysqli_stmt_bind_param($stmt, 's', $accountId);
	mysqli_stmt_execute($stmt);
	$sqldata = mysqli_stmt_get_result($stmt);

	$uniqueArr = array();								
	$uniqueIDArr = array();								
	$allProjArr = array();	
	$totprojCount = 0;					

	while($data = mysqli_fetch_assoc($sqldata)){
		$totprojCount++;

		$allProjArr['projectId'][] = $data['projectId'];
		$allProjArr['s_d_defectnum'][] = $data['s_d_defectnum'];
		$allProjArr['releaseId'][] = $data['releaseId'];
		$allProjArr['testcaseId'][] = $data['testcaseId'];
		$allProjArr['s_d_module'][] = $data['s_d_module'];
		$allProjArr['s_d_submodule'][] = $data['s_d_submodule'];
		$allProjArr['defecttypeId'][] = $data['defecttypeId'];
		$allProjArr['defectstatusId'][] = $data['defectstatusId'];
		$allProjArr['s_d_severity'][] = $data['s_d_severity'];
		$allProjArr['s_d_priority'][] = $data['s_d_priority'];
		$allProjArr['s_d_assignto'][] = $data['s_d_assignto'];
		if(!(isset($uniqueIDArr['s_d_defectnum']) && in_array($data['s_d_defectnum'], $uniqueIDArr['s_d_defectnum']))){
			$uniqueArr['s_d_defectnum'][] = $data['s_d_defectnum'];
			$uniqueIDArr['s_d_defectnum'][] = $data['s_d_defectnum'];
		}
		if(!(isset($uniqueIDArr['projectId']) && in_array($data['projectId'], $uniqueIDArr['projectId']))){
			$uniqueArr['projectId'][] = $data['projectname'];
			$uniqueIDArr['projectId'][] = $data['projectId'];
		}
		if(!(isset($uniqueIDArr['releaseId']) && in_array($data['releaseId'], $uniqueIDArr['releaseId']))){
			$uniqueArr['releaseId'][] = $data['releaseNum'];
			$uniqueIDArr['releaseId'][] = $data['releaseId'];
		}

		if(!(isset($uniqueIDArr['testcaseId']) && in_array($data['testcaseId'], $uniqueIDArr['testcaseId']))){
			$uniqueArr['testcaseId'][] = $data['testcasenum'];
			$uniqueIDArr['testcaseId'][] = $data['testcaseId'];
		}

		if(!(isset($uniqueIDArr['s_d_module']) && in_array($data['s_d_module'], $uniqueIDArr['s_d_module']))){
			$uniqueArr['s_d_module'][] = $data['s_d_module'];
			$uniqueIDArr['s_d_module'][] = $data['s_d_module'];
		}

		if(!(isset($uniqueIDArr['s_d_submodule']) && in_array($data['s_d_submodule'], $uniqueIDArr['s_d_submodule']))){
			$uniqueArr['s_d_submodule'][] = $data['s_d_submodule'];
			$uniqueIDArr['s_d_submodule'][] = $data['s_d_submodule'];
		}

		if(!(isset($uniqueIDArr['defecttypeId']) && in_array($data['defecttypeId'], $uniqueIDArr['defecttypeId']))){
			$uniqueArr['defecttypeId'][] = $data['defecttype'];
			$uniqueIDArr['defecttypeId'][] = $data['defecttypeId'];
		}

		if(!(isset($uniqueIDArr['defectstatusId']) && in_array($data['defectstatusId'], $uniqueIDArr['defectstatusId']))){
			$uniqueArr['defectstatusId'][] = $data['defectstatus'];
			$uniqueIDArr['defectstatusId'][] = $data['defectstatusId'];
		}

		if(!(isset($uniqueIDArr['s_d_severity']) && in_array($data['s_d_severity'], $uniqueIDArr['s_d_severity']))){
			$uniqueArr['s_d_severity'][] = $data['s_d_severity'];
			$uniqueIDArr['s_d_severity'][] = $data['s_d_severity'];
		}

		if(!(isset($uniqueIDArr['s_d_priority']) && in_array($data['s_d_priority'], $uniqueIDArr['s_d_priority']))){
			$uniqueArr['s_d_priority'][] = $data['s_d_priority'];
			$uniqueIDArr['s_d_priority'][] = $data['s_d_priority'];
		}

		if(!(isset($uniqueIDArr['s_d_assignto']) && in_array($data['s_d_assignto'], $uniqueIDArr['s_d_assignto']))){
			$uniqueArr['s_d_assignto'][] = $data['assignto'];
			$uniqueIDArr['s_d_assignto'][] = $data['s_d_assignto'];
		}
	}
	// Close the statement
	mysqli_stmt_close($stmt);

	$colarr = array();
	$chartsql = "select * from s_chartsetting where s_c_tablename='Defect'  and s_c_activestatus = 'Active' and accountId = ? order by s_c_id asc "; // get all chart w.r.t. project activity phase

	$chartstmt = mysqli_prepare($conn,$chartsql);
	mysqli_stmt_bind_param($chartstmt, 's', $accountId);
	mysqli_stmt_execute($chartstmt);
	$sqlCustomData = mysqli_stmt_get_result($chartstmt);
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

			$nArr = array();
			
			if(isset($uniqueIDArr[$yAxis])){
				foreach ($uniqueIDArr[$yAxis] as $ykey => $Modulename) {
					$cname = $uniqueArr[$yAxis][$ykey];
					foreach ($allProjArr[$yAxis] as $akey => $avalue) {
						if(strval($avalue) == strval($Modulename)){
							$nArr[strval($Modulename)] = (isset($nArr[strval($Modulename)]) ? $nArr[strval($Modulename)]  : 0) + 1;
						}else{
							$nArr[strval($Modulename)] = (isset($nArr[strval($Modulename)]) ? $nArr[strval($Modulename)]  : 0) +0;
						}
					}			 				
				}
			}

			foreach ($nArr as $akey => $seriesname) {
				$index = array_search($akey, $uniqueIDArr[$yAxis]);
				$cname = $uniqueArr[$yAxis][$index];

				$name = ($cname == "" ? "Not Specified" : $cname);
				
				if($cal_type == "Percentage"){
					$seriesdata[] = array("name"=>$name,"y"=>($totprojCount >0 ? round($seriesname/$totprojCount *100,2) : 0),"id"=>$akey);
				}else{
					$seriesdata[] = array("name"=>$name,"y"=>$seriesname,"id"=>$akey);
				}
			}
		}
		else if($chart_type == "Column" || $chart_type == "Line"){

			if(isset($uniqueIDArr[$xAxis])){
				foreach ($uniqueIDArr[$xAxis] as $xkey => $xname) {

					$name = ($uniqueArr[$xAxis][$xkey] == "" ? "Not Specified" : $uniqueArr[$xAxis][$xkey]);
					$category[] = $name;
				}
			}

			if(in_array($xAxis, array('s_d_defectnum'))){
				if(isset($uniqueArr[$yAxis])){
					foreach ($uniqueArr[$yAxis] as $ykey => $Modulename) {

					$name = ($Modulename == "" ? "Not Specified" : $Modulename);

						$seriesname = array();
							foreach ($uniqueArr[$xAxis] as $akey => $avalue) {
								if($Modulename == $allProjArr[$yAxis][$akey]){
									$seriesname[] = 1;
								}else{
									$seriesname[] = 0;
								}
							}
							
							$seriesdata[] = array("name"=>$name,"data"=>$seriesname);
						
					}
				}
			}else {
				if(isset($uniqueIDArr[$yAxis])){
					foreach ($uniqueIDArr[$yAxis] as $ykey => $Modulename) {
						$nArr = array();
								$cname = $uniqueArr[$yAxis][$ykey];
					$name = ($cname == "" ? "Not Specified" : $cname);

						foreach ($allProjArr[$xAxis] as $akey => $avalue) {
							if($Modulename == $allProjArr[$yAxis][$akey]){
								$nArr[strval($avalue)] = (isset($nArr[$avalue]) ? $nArr[$avalue]  : 0) + 1;
							}else{
								$nArr[strval($avalue)] = (isset($nArr[$avalue]) ? $nArr[$avalue]  : 0) +0;
							}
						}
						$seriesname = array();
						foreach ($uniqueIDArr[$xAxis] as $akey => $avalue) {
							$seriesname[]=($nArr[strval($avalue)]);
						}
						$seriesdata[] = array("name"=>$name,"data"=>$seriesname,"id"=>$Modulename);
						
					}
				}
			}
		}

		$rowarr['seriesdata'] = $seriesdata;
		$rowarr['xaxis'] = $category;
		array_push($colarr, $rowarr);
	}
	// Close the statement
	mysqli_stmt_close($chartstmt);
	echo json_encode($colarr,JSON_NUMERIC_CHECK);


										?>
