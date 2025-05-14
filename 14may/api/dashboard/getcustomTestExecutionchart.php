<?php
include('../config.php');
session_start();
 
$enteredby = 0;$accountId=0;$userempid = 0;
 

/** get dynamic testexecution chart setting to show on dashboard */
if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
    $userempid = $_SESSION["userempid"];
}

$projectId = (isset($_GET['projectId']) && !empty($_GET['projectId'])? $_GET['projectId'] : "");
$releaseId = (isset($_GET['releaseId'])  && !empty($_GET['releaseId'])?  $_GET['releaseId'] : "");
$activityId = (isset($_GET['activityId'])  && !empty($_GET['activityId'])? $_GET['activityId'] : "");
$testsuiteId = (isset($_GET['testsuiteId'])  && !empty($_GET['testsuiteId'])? $_GET['testsuiteId'] : "");
$testcasedate = (isset($_GET['testcasedate']) && !empty($_GET['testcasedate']) ?  date('Y-m-d 23:59:59', strtotime(str_replace('/', '-', $_GET['testcasedate']))) : date('Y-m-d 23:59:59'));

$where = "";
if($projectId !=""){
	$where = $where." and t.projectId in ($projectId) ";
}

if($releaseId !=""){		
	$where = $where." and t.releaseId in ($releaseId) ";
}

if($activityId !=""){

	$actarr = explode(",", $activityId);
	if(isset($actarr) && !empty($actarr)){
		$actlen = count($actarr);
		for($i =0; $i<$actlen; $i++){
			$where = " AND find_in_set('".$actarr[$i]."',t.s_t_activityIds)  ";
		}
	}
}
$iterationwhere = "";
if($testsuiteId !=""){		
	$where = $where." and t.s_t_id in (select testcaseId from s_testexecution where testsuiteId in ($testsuiteId) and accountId = '".$accountId."') ";
	$iterationwhere = $iterationwhere." and testsuiteId in ($testsuiteId) ";
}

if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$where .= " and t.projectId in (select s_p_id from s_project where s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' ) or s_p_enteredby = '".$enteredby."' and accountId = '".$accountId."')";
}

$stmt = mysqli_prepare($conn,"SELECT t.*,IFNULL(p.s_p_name,'') as 'Project Name',
	IFNULL(r.s_r_releaseId,'') as 'Release Name',
	IFNULL(t.s_t_testscenarionum,'') as 'Test Scenario ID',
	IFNULL(t.s_t_testcasenum,'') as 'Testcase ID',
	IFNULL(t.s_t_module,'') as 'Module',
	IFNULL(t.s_t_submodule,'') as 'Sub Module',
	IFNULL(t.s_t_testmode,'') as 'Test Mode'
	from s_testcase t 
	left join s_project p on p.s_p_id = t.projectId 
	left join s_release r on r.s_r_id = t.releaseId
	where  t.s_t_createdtime <= ? and t.accountId = ?  $where 
	order by t.s_t_id desc");
mysqli_stmt_bind_param($stmt, 'ss',$testcasedate, $accountId);
mysqli_stmt_execute($stmt);
$sqldata = mysqli_stmt_get_result($stmt);

	$uniqueArr = array();								
	$uniqueIDArr = array();									
	$allProjArr = array();	
	$totprojCount = 0;				

while($data = mysqli_fetch_assoc($sqldata)){
	$totprojCount++;

	$iterationsqldata = mysqli_query($conn,"SELECT * from s_testcaserun where testcaseId = '".$data['s_t_id']."' and accountId = '".$accountId."' $iterationwhere order by s_st_id desc ");
	$iterationcount = mysqli_num_rows($iterationsqldata);


	$testresult = "Not Executed";
	$testresultsqldata = mysqli_query($conn,"SELECT s_f_testresult from s_testcasefinal where testcaseId = '".$data['s_t_id']."' and accountId = '".$accountId."' and s_f_testresult != ''  order by s_f_id desc, s_f_updatetime desc limit 1  ");
	while($resultdata = mysqli_fetch_assoc($testresultsqldata)){
			$testresult = $resultdata['s_f_testresult'];
	}
	$activityname = "";
	if($data['s_t_activityIds'] !=""){
		$chksql = "select IFNULL(GROUP_CONCAT(s_a_name),'') as activityname from s_activitymaster where s_a_id in  (".$data['s_t_activityIds'].")  and accountId = '".$accountId."'  ";
		$chkstmt = mysqli_query( $conn, $chksql);

		while($actdata = mysqli_fetch_assoc($chkstmt)){
			$activityname = $actdata['activityname'];
		}
	}

	$allProjArr['Project Name'][] = $data['projectId'];
	$allProjArr['Activity Name'][] = $data['s_t_activityIds'];
	$allProjArr['Release Name'][] = $data['releaseId'];
	$allProjArr['Test Scenario ID'][] = $data['s_t_id'];
	$allProjArr['Testcase ID'][] = $data['s_t_id'];
	$allProjArr['Module'][] = $data['Module'];
	$allProjArr['Sub Module'][] = $data['Sub Module'];
	$allProjArr['Test Mode'][] = $data['Test Mode'];
	$allProjArr['Testcase Result'][] = $testresult;
	$allProjArr['Iteration'][] = $iterationcount;

 	if(!(isset($uniqueIDArr['Project Name']) && in_array($data['projectId'], $uniqueIDArr['Project Name']))){
 		$uniqueArr['Project Name'][] = $data['Project Name'];
 		$uniqueIDArr['Project Name'][] = $data['projectId'];
 	}
 	if(!(isset($uniqueIDArr['Release Name']) && in_array($data['releaseId'], $uniqueIDArr['Release Name']))){
 		$uniqueArr['Release Name'][] = $data['Release Name'];
 		$uniqueIDArr['Release Name'][] = $data['releaseId'];
 	}
 	if(!(isset($uniqueIDArr['Activity Name']) && in_array($data['s_t_activityIds'], $uniqueIDArr['Activity Name']))){
 		$uniqueArr['Activity Name'][] = $activityname;
 		$uniqueIDArr['Activity Name'][] = $data['s_t_activityIds'];
 	}
 	if(!(isset($uniqueIDArr['Test Scenario ID']) && in_array($data['s_t_id'], $uniqueIDArr['Project Name']))){
 		$uniqueArr['Test Scenario ID'][] = $data['Test Scenario ID'];
 		$uniqueIDArr['Test Scenario ID'][] = $data['s_t_id'];
 	}
 	if(!(isset($uniqueIDArr['Testcase Name']) && in_array($data['s_t_id'], $uniqueIDArr['Testcase Name']))){
 		$uniqueArr['Testcase ID'][] = $data['Testcase ID'];
 		$uniqueIDArr['Testcase ID'][] = $data['s_t_id'];
 	}
 	if(!(isset($uniqueIDArr['Module']) && in_array($data['Module'], $uniqueIDArr['Module']))){
 		$uniqueArr['Module'][] = $data['Module'];
 		$uniqueIDArr['Module'][] = $data['Module'];
 	}
 	if(!(isset($uniqueIDArr['Sub Module']) && in_array($data['Sub Module'], $uniqueIDArr['Sub Module']))){
 		$uniqueArr['Sub Module'][] = $data['Sub Module'];
 		$uniqueIDArr['Sub Module'][] = $data['Sub Module'];
 	}
 	if(!(isset($uniqueIDArr['Test Mode']) && in_array($data['Test Mode'], $uniqueIDArr['Test Mode']))){
 		$uniqueArr['Test Mode'][] = $data['Test Mode'];
 		$uniqueIDArr['Test Mode'][] = $data['Test Mode'];
 	}
 	if(!(isset($uniqueIDArr['Testcase Result']) && in_array($testresult, $uniqueIDArr['Testcase Result']))){
 		$uniqueArr['Testcase Result'][] = $testresult;
 		$uniqueIDArr['Testcase Result'][] = $testresult;
 	}
	if(!(isset($uniqueIDArr['Iteration']) && in_array($iterationcount, $uniqueIDArr['Iteration']))){
 		$uniqueArr['Iteration'][] = $iterationcount;
 		$uniqueIDArr['Iteration'][] = $iterationcount;
 	}
}
// Close the statement
mysqli_stmt_close($stmt);

$colarr = array();
$chartsql = "select * from s_chartsetting where s_c_tablename='Test Execution'  and s_c_enteredby = ? and accountId = ? order by s_c_id asc "; // get all chart w.r.t. project activity phase
$chartstmt = mysqli_prepare($conn,$chartsql);

mysqli_stmt_bind_param($chartstmt, 'ss',$enteredby, $accountId);
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
	}else if($chart_type == "Column" || $chart_type == "Line"){
		
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
