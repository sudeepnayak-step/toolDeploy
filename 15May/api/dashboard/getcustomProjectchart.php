<?php
include('../config.php');
session_start();
 
$enteredby = 0;$accountId = 0;$userempid = 0;
 

/** get dynamic project chart setting to show on dashboard */
if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
    $userempid = $_SESSION["userempid"];
}


$projectExtra = "";
if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin"){
	$projectExtra = " and p.s_p_id in (select projectId from s_project_members where employeeId = '".$userempid."' )";
}

$stmt = mysqli_prepare($conn,"SELECT p.*,concat(IFNULL(s_e_fname,''),' ',IFNULL(s_e_mname,''),' ',IFNULL(s_e_lname,'')) as owner,
IFNULL(s_c_name,'') as client  from s_project p
 left JOIN s_employees o1 on o1.s_e_id = p.s_p_owner
 left JOIN s_client c1 on c1.s_c_id = p.clientId  where p.s_p_activestatus = 'Active' and p.accountId = ? $projectExtra");
		
mysqli_stmt_bind_param($stmt, 's', $accountId);
mysqli_stmt_execute($stmt);
$sqldata = mysqli_stmt_get_result($stmt);

$uniqueArr = array();								
$allProjArr = array();	
$totprojCount = 0;						

while($data = mysqli_fetch_assoc($sqldata)){
	$totprojCount++;
	$planstartdate = (isset($data['s_p_planstartdate']) && ($data['s_p_planstartdate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_p_planstartdate'])) : "");

	$planenddate = (isset($data['s_p_planenddate']) && ($data['s_p_planenddate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_p_planenddate'])) : "");

	$revisedstartdate = (isset($data['s_p_revisedstartdate']) && ($data['s_p_revisedstartdate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_p_revisedstartdate'])) : "");

	$revisedenddate = (isset($data['s_p_revisedenddate']) && ($data['s_p_revisedenddate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_p_revisedenddate'])) : "");
	
	$actualstartdate = (isset($data['s_p_actualstartdate']) && ($data['s_p_actualstartdate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_p_actualstartdate'])) : "");

	$actualenddate = (isset($data['s_p_actualenddate']) && ($data['s_p_actualenddate'] != "0000-00-00") ? date("d/m/Y",strtotime($data['s_p_actualenddate'])) : "");
	
	$membersarr = array();
	$membersnamearr = array();

	$chksql = "select mem.*, concat(IFNULL(s_e_fname,''),' ',IFNULL(s_e_mname,''),' ',IFNULL(s_e_lname,'')) as membersname from s_project_members mem join s_employees emp on emp.s_e_id = mem.employeeId where projectId = '".$data['s_p_id']."' and mem.accountId = '".$accountId."' ";

	$chkstmt = mysqli_query( $conn, $chksql);

	while($mdata = mysqli_fetch_assoc($chkstmt)){
		if(!in_array($mdata['employeeId'], $membersarr)){
			array_push($membersnamearr, $mdata['membersname']);
			array_push($membersarr, $mdata['employeeId']);
		}

	}

	$projectclient = $mdata['clientId'];
	$planthreshold = 0;$actualthreshold = 0;$schedule = "G";$tempPlanDenomentor = 0;$tempActualNumerator = 0;
	$Tempstartdate = ($revisedenddate == "" ? $planenddate : $revisedenddate);
	
	$planFormatenddate =  ($revisedenddate == "" ? $planenddate : $revisedenddate);
	$Tempenddate = date('d/m/Y');
	$tempPlanNumerator = ($Tempstartdate !="" && $Tempenddate != "") ? GetDateDuration($projectclient,$Tempstartdate,$Tempenddate) : 0;
	
	if($actualenddate !="" && $actualstartdate != ""){
		$Tempstartdate = $actualstartdate;//date('Y-m-d',strtotime($actualstartdate));
		$Tempenddate = $actualenddate;//date('Y-m-d',strtotime($actualenddate));
		$tempPlanDenomentor = ($Tempstartdate !="" && $Tempenddate != "") ? GetDateDuration($projectclient,$Tempstartdate,$Tempenddate): 0;			
	}

	if($actualenddate !=""){
		$Tempstartdate = $actualenddate; //date('Y-m-d',strtotime($actualenddate));
		$Tempenddate = date('d/m/Y');
		$tempActualNumerator = ($Tempstartdate !="" && $Tempenddate != "") ? GetDateDuration($projectclient,$Tempstartdate,$Tempenddate): 0;
	}
	$planthreshold = ($tempPlanDenomentor >0 ) ? $tempPlanNumerator/$tempPlanDenomentor *100 : 0;

	$actualthreshold = ($tempPlanDenomentor >0 ) ? $tempActualNumerator/$tempPlanDenomentor *100 : 0;

	$threshold = ($planthreshold > $actualthreshold ? ($planthreshold - $actualthreshold) : 0);

	// calculate threshold
	$ragthresholdsql = "SELECT * FROM s_ragthreshold where accountId='".$accountId."' order by s_rt_id desc limit 1";
	$ragthresholdquery = mysqli_query($conn,$ragthresholdsql);
	while($ragTdata =mysqli_fetch_assoc($ragthresholdquery)){
	
		$amber = $ragTdata['s_rt_amber'];
		$red = $ragTdata['s_rt_red'];
		if($threshold > $red){
			$schedule = "R";// Red
		}else if($threshold > $amber){
			$schedule = "A";// Red
		}else{
			$schedule = "G";// Red
		}
	}

	$allProjArr['s_p_code'][] = $data['s_p_code'];
	$allProjArr['s_p_name'][] = $data['s_p_name'];
	$allProjArr['s_p_status'][] = $data['s_p_status'];
	$allProjArr['s_p_ragstatus'][] = $schedule;
	$allProjArr['s_p_owner'][] = $data['owner'];
	$allProjArr['clientId'][] = $data['client'];

	
 	if(!(isset($uniqueArr['s_p_code']) && in_array($data['s_p_code'], $uniqueArr['s_p_code']))){
 		$uniqueArr['s_p_code'][] = $data['s_p_code'];
 	}
	

 	if(!(isset($uniqueArr['s_p_name']) && in_array($data['s_p_name'], $uniqueArr['s_p_name']))){
 		$uniqueArr['s_p_name'][] = $data['s_p_name'];
 	}
 	if(!(isset($uniqueArr['s_p_status']) && in_array($data['s_p_status'], $uniqueArr['s_p_status']))){
 		$uniqueArr['s_p_status'][] = $data['s_p_status'];
 	}

 	if(!(isset($uniqueArr['s_p_ragstatus']) && in_array($schedule, $uniqueArr['s_p_ragstatus']))){
 		$uniqueArr['s_p_ragstatus'][] = $schedule;
 	}

 	if(!(isset($uniqueArr['s_p_owner']) && in_array($data['owner'], $uniqueArr['s_p_owner']))){
 		$uniqueArr['s_p_owner'][] = $data['owner'];
 	}

 	if(!(isset($uniqueArr['clientId']) && in_array($data['client'], $uniqueArr['clientId']))){
 		$uniqueArr['clientId'][] = $data['client'];
 	}
}
// Close the statement
mysqli_stmt_close($stmt);

$colarr = array();
$chartsql = "select * from s_chartsetting where s_c_tablename='Project'  and s_c_activestatus = 'Active' and accountId = ? order by s_c_id asc "; // get all chart w.r.t. project activity phase;
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
		if(isset($uniqueArr[$yAxis])){
			foreach ($uniqueArr[$yAxis] as $ykey => $Modulename) {
				foreach ($allProjArr[$yAxis] as $akey => $avalue) {
					if(strval($avalue) == strval($Modulename)){
						$nArr[strval($avalue)] = (isset($nArr[strval($avalue)]) ? $nArr[strval($avalue)]  : 0) + 1;
					}else{
						$nArr[strval($avalue)] = (isset($nArr[strval($avalue)]) ? $nArr[strval($avalue)]  : 0) +0;
					}
				}			 				
			}
		}

		foreach ($nArr as $akey => $seriesname) {
			$name = ($akey == "" ? "Not Specified" : $akey);

			if($yAxis == "s_p_status"){				 				
				$bgcolor = "#ffc107";
				switch ($akey) {
					case "In Progress":
						$bgcolor = "#0062cc";
						break;
					case "Complete":
						$bgcolor = "#28a745";
						break;
					case "Pending":
						$bgcolor = "#ffc107";
						break;
					default:
						$bgcolor = "#ffc107";
				}
				if($cal_type == "Percentage"){
					$seriesdata[] = array("name"=>$name,"y"=>($totprojCount >0 ? round($seriesname/$totprojCount *100,2) : 0),"color"=>$bgcolor);
				}else{
					$seriesdata[] = array("name"=>$name,"y"=>$seriesname,"color"=>$bgcolor);
				}
				
			}else if(in_array($yAxis, array("s_p_ragstatus","budget","scope_of_work"))){				 				
				$bgcolor = "#dc3545";
				switch ($akey) {
					case "G":
						$bgcolor = "#28a745";
						break;
					case "A":
						$bgcolor = "#ffc107";
						break;
					case "R":
						$bgcolor = "#dc3545";
						break;
					}
				if($cal_type == "Percentage"){
					$seriesdata[] = array("name"=>$name,"y"=>($totprojCount >0 ? round($seriesname/$totprojCount *100,2) : 0),"color"=>$bgcolor);
				}else{
					$seriesdata[] = array("name"=>$name,"y"=>$seriesname,"color"=>$bgcolor);
				}
				
			}else{
				if($cal_type == "Percentage"){
					$seriesdata[] = array("name"=>$name,"y"=>($totprojCount >0 ? round($seriesname/$totprojCount *100,2) : 0));
				}else{
					$seriesdata[] = array("name"=>$name,"y"=>$seriesname);
				}
			}
		}
	}
	else if($chart_type == "Column" || $chart_type == "Line"){
		if(isset($uniqueArr[$xAxis])){
			foreach ($uniqueArr[$xAxis] as $xkey => $xname) {
				$name = ($xname == "" ? "Not Specified" : $xname);
				$category[] = $name;
			}
		}

		if(in_array($xAxis, array('s_p_ragstatus','s_p_status','reusability','automatable_tests','failed_raised_total','planned_complete','actual_complete','scope_of_work','budget','clientId','s_p_owner'))){
			if(isset($uniqueArr[$yAxis])){
				foreach ($uniqueArr[$yAxis] as $ykey => $Modulename) {

					$name = ($Modulename == "" ? "Not Specified" : $Modulename);
					$nArr = array();
					foreach ($allProjArr[$xAxis] as $akey => $avalue) {
						if($Modulename == $allProjArr[$yAxis][$akey]){
							$nArr[strval($avalue)] = (isset($nArr[$avalue]) ? $nArr[$avalue]  : 0) + 1;
						}else{
							$nArr[strval($avalue)] = (isset($nArr[$avalue]) ? $nArr[$avalue]  : 0) +0;
						}
					}
					$seriesname = array();
					foreach ($uniqueArr[$xAxis] as $akey => $avalue) {
						$seriesname[]=($nArr[strval($avalue)]);
					}
					if($yAxis == "s_p_status"){	
						$bgcolor = "#ffc107";
						switch ($Modulename) {
							case "In Progress":
								$bgcolor = "#0062cc";
								break;
							case "Complete":
								$bgcolor = "#28a745";
								break;
							case "Pending":
								$bgcolor = "#ffc107";
								break;
							default:
								$bgcolor = "#ffc107";
						}
						$seriesdata[] = array("name"=>$name,"data"=>$seriesname,"color"=>$bgcolor);
						
					}else if(in_array($yAxis, array("s_p_ragstatus","budget","scope_of_work"))){				 				
						$bgcolor = "#dc3545";
							switch ($Modulename) {
								case "G":
									$bgcolor = "#28a745";
									break;
								case "A":
									$bgcolor = "#ffc107";
									break;
								case "R":
									$bgcolor = "#dc3545";
									break;
								}
						$seriesdata[] = array("name"=>$name,"data"=>$seriesname,"color"=>$bgcolor);
						
					}else{
						$seriesdata[] = array("name"=>$name,"data"=>$seriesname);
					}
				}
			}
		}
		else if(in_array($xAxis, array('s_p_name','s_p_code'))){
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
					if($yAxis == "s_p_status"){				 				
						$bgcolor = "#ffc107";
						switch ($Modulename) {
							case "In Progress":
								$bgcolor = "#007bff";
								break;
							case "Complete":
								$bgcolor = "#28a745";
								break;
							case "Pending":
								$bgcolor = "#ffc107";
								break;
							default:
								$bgcolor = "#ffc107";
						}
						$seriesdata[] = array("name"=>$name,"data"=>$seriesname,"color"=>$bgcolor);
						
					}else if(in_array($yAxis, array("s_p_ragstatus","budget","scope_of_work"))){				 				
						$bgcolor = "#dc3545";
							switch ($Modulename) {
								case "G":
									$bgcolor = "#28a745";
									break;
								case "A":
									$bgcolor = "#ffc107";
									break;
								case "R":
									$bgcolor = "#dc3545";
									break;
								}
						$seriesdata[] = array("name"=>$name,"data"=>$seriesname,"color"=>$bgcolor);
						
					}else{
						
						$seriesdata[] = array("name"=>$name,"data"=>$seriesname);
					}
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
