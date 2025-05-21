<?php
include('../config.php');
session_start();
 
$enteredby = 0;$accountId=0;$userempid = 0;
/** this script retunr the execution data for particular chart */ 

if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
    $userempid = $_SESSION["userempid"];
}

$projectId = (isset($_POST['projectId']) && !empty($_POST['projectId'])? implode(",", $_POST['projectId']) : "");
$releaseId = (isset($_POST['releaseId'])  && !empty($_POST['releaseId'])? implode(",", $_POST['releaseId']) : "");
$activityId = (isset($_POST['activityId'])  && !empty($_POST['activityId'])? implode(",", $_POST['activityId']) : "");
$testsuiteId = (isset($_POST['testsuiteId'])  && !empty($_POST['testsuiteId'])? implode(",", $_POST['testsuiteId']) : "");
$defectdate = (isset($_POST['defectdate']) && !empty($_POST['defectdate']) ?  "'".date('Y-m-d 23:59:59', strtotime(str_replace('/', '-', $_POST['defectdate'])))."'" : 'NULL');

$xVal = isset($_POST['xVal']) && !empty($_POST['xVal'])  && $_POST['xVal'] !="Not Specified" ? $_POST['xVal']: "";
$type = isset($_POST['type']) && !empty($_POST['type']) ? $_POST['type']: "";
$chart_id = isset($_POST['chart_id']) && !empty($_POST['chart_id']) ? $_POST['chart_id']: "0";
$xId = isset($_POST['xId']) && !empty($_POST['xId']) ? $_POST['xId']: "";

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

echo '  
	<table id="testcaseinfotbl"class="table compact " style="width:100%;">
							<thead  class="bg-step text-white">
					<tr>
						<th>Testcase ID</th>
						<th>Project</th>
						<th>Release ID</th>
						<th>Test Type</th> 
						<th>Test Mode</th> 
						<th>Module</th>
						<th>Sub Module</th> 
						<th>Test Result</th>
					</tr>
					</thead>
					<tbody>';

if($type == "Effectiveness"){
	$sqltestexecdata = mysqli_query($conn,"SELECT t.*,IFNULL(p.s_p_name,'') as 'Project Name',
		IFNULL(r.s_r_releaseId,'') as 'Release Name',
		IFNULL(t.s_t_testscenarionum,'') as 'Test Scenario ID',
		IFNULL(t.s_t_testcasenum,'') as 'Testcase ID',
		IFNULL(t.s_t_module,'') as 'Module',
		IFNULL(t.s_t_submodule,'') as 'Sub Module',
		IFNULL(t.s_t_testmode,'') as 'Test Mode'
		from s_testcase t 
		left join s_project p on p.s_p_id = t.projectId 
		left join s_release r on r.s_r_id = t.releaseId
		where t.accountId = '".$accountId."'   $where ".
		(($xVal == "Not Specified" || $xVal == "0" || $xVal == "") ? " and (t.s_t_module is null or t.s_t_module = '')": " and t.s_t_module = '".$xVal."' ").
		" and t.s_t_id in ( select testcaseId from s_testcasefinal where s_f_id in  (select max(s_f_id) from s_testcasefinal where s_f_testresult in ('Pass','Fail') and accountId = '".$accountId."' group by testcaseId))
		order by t.s_t_id desc");
		
		
		$dSrno = 0;
		while($tcdata = mysqli_fetch_assoc($sqltestexecdata)){
			$iterationsqldata = mysqli_query($conn,"SELECT * from s_testcaserun where testcaseId = '".$tcdata['s_t_id']."' and accountId = '".$accountId."' $iterationwhere order by s_st_id desc ");
			$iterationcount = mysqli_num_rows($iterationsqldata);


			$testresult = "";
			$testresultsqldata = mysqli_query($conn,"SELECT s_f_testresult from s_testcasefinal where testcaseId = '".$tcdata['s_t_id']."' and accountId = '".$accountId."' and s_f_testresult != ''  order by s_f_id desc,s_f_updatetime desc limit 1  ");
			while($resultdata = mysqli_fetch_assoc($testresultsqldata)){
					$testresult = $resultdata['s_f_testresult'];
			}
			$activityname = "";
			if($tcdata['s_t_activityIds'] !=""){
				$chksql = "select IFNULL(GROUP_CONCAT(s_a_name),'') as activityname from s_activitymaster where s_a_id in  (".$tcdata['s_t_activityIds'].")  and accountId = '".$accountId."'  ";
				$chkstmt = mysqli_query( $conn, $chksql);

				while($actdata = mysqli_fetch_assoc($chkstmt)){
					$activityname = $actdata['activityname'];
				}
			}
			echo '<tr>
						<td>'.$tcdata['Testcase ID'].'</td>
						<td>'.$tcdata['Project Name'].'</td>
						<td>'.$tcdata['Release Name'].'</td>
						<td>'.$activityname.'</td>
						<td>'.$tcdata['Test Mode'].'</td>
						<td>'.$tcdata['Module'].'</td>
						<td>'.$tcdata['Sub Module'].'</td>
						<td>'.$testresult.'</td>
					</tr>';
		}
}else if($type == "TCcoverage"){
	$sqltestexecdata = mysqli_query($conn,"SELECT t.*,IFNULL(p.s_p_name,'') as 'Project Name',
		IFNULL(r.s_r_releaseId,'') as 'Release Name',
		IFNULL(t.s_t_testscenarionum,'') as 'Test Scenario ID',
		IFNULL(t.s_t_testcasenum,'') as 'Testcase ID',
		IFNULL(t.s_t_module,'') as 'Module',
		IFNULL(t.s_t_submodule,'') as 'Sub Module',
		IFNULL(t.s_t_testmode,'') as 'Test Mode'
		from s_testcase t 
		left join s_project p on p.s_p_id = t.projectId 
		left join s_release r on r.s_r_id = t.releaseId
		where t.accountId = '".$accountId."'   $where ".
		
		" and t.s_t_id in ( select testcaseId from s_rtm_testcase rt left join s_rtm r on r.s_rtm_id = rt.rtmId where rt.testcaseId is not null && rt.testcaseId !=0 and  r.accountId = '".$accountId."' ".
		(($xVal == "Not Specified" || $xVal == "0" || $xVal == "") ? " and (r.s_rtm_module is null or r.s_rtm_module = '')": " and r.s_rtm_module = '".$xVal."' ").
		")order by t.s_t_id desc");
		
		
		$dSrno = 0;
		while($tcdata = mysqli_fetch_assoc($sqltestexecdata)){
			$iterationsqldata = mysqli_query($conn,"SELECT * from s_testcaserun where testcaseId = '".$tcdata['s_t_id']."' and accountId = '".$accountId."' $iterationwhere order by s_st_id desc ");
			$iterationcount = mysqli_num_rows($iterationsqldata);


			$testresult = "";
			$testresultsqldata = mysqli_query($conn,"SELECT s_f_testresult from s_testcasefinal where testcaseId = '".$tcdata['s_t_id']."' and accountId = '".$accountId."' and s_f_testresult != ''  order by s_f_id desc,s_f_updatetime desc limit 1  ");
			while($resultdata = mysqli_fetch_assoc($testresultsqldata)){
					$testresult = $resultdata['s_f_testresult'];
			}
			$activityname = "";
			if($tcdata['s_t_activityIds'] !=""){
				$chksql = "select IFNULL(GROUP_CONCAT(s_a_name),'') as activityname from s_activitymaster where s_a_id in  (".$tcdata['s_t_activityIds'].")  and accountId = '".$accountId."'  ";
				$chkstmt = mysqli_query( $conn, $chksql);

				while($actdata = mysqli_fetch_assoc($chkstmt)){
					$activityname = $actdata['activityname'];
				}
			}
			echo '<tr>
						<td>'.$tcdata['Testcase ID'].'</td>
						<td>'.$tcdata['Project Name'].'</td>
						<td>'.$tcdata['Release Name'].'</td>
						<td>'.$activityname.'</td>
						<td>'.$tcdata['Test Mode'].'</td>
						<td>'.$tcdata['Module'].'</td>
						<td>'.$tcdata['Sub Module'].'</td>
                                                <td>'.$testresult.'</td>
					</tr>';
		}
}else{
$sql = "select * from s_chartsetting where s_c_tablename='Test Execution' and s_c_id = ? "; // get all chart w.r.t. project activity phase

$stmt = mysqli_prepare($conn,$sql);
mysqli_stmt_bind_param($stmt, 's', $chart_id);
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

		if(in_array($yAxis, array("Iteration","Testcase Result"))){
			$where .= " AND t.s_t_id in (select testcaseId from s_testcasefinal where accountId = '".$accountId."' and s_f_id in (select max(s_f_id) from s_testcasefinal where accountId = '".$accountId."' group by testcaseId) and " .($xId == "Not Specified" || $xId == "" || $xId == "0" ? " (s_f_testresult is null or s_f_testresult = '') " : "  s_f_testresult = '".$xId."'" ).") ";
		}else{
			switch ($yAxis) {
				case 'Project Name':
					$where .= " and t.projectId  = '".$xId."' ";
					break;
				case 'Release Name':
					$where .= " and t.releaseId  = '".$xId."' ";
					break;
				case 'Activity Name':
					$where .= " and t.s_t_activityIds  = '".$xId."' ";
					break;
				case 'Test Scenario ID':
					$where .= " and t.s_t_id  = '".$xId."' ";
					break;
				case 'Testcase ID':
					$where .= " and t.s_t_id  = '".$xId."' ";
					break;
				case 'Module':
					$where .= " and t.s_t_module  = '".$xId."' ";
					break;
				case 'Sub Module':
					$where .= " and t.s_t_submodule  = '".$xId."' ";
					break;
				case 'Test Mode':
					$where .= " and t.s_t_testmode  = '".$xId."' ";
					break;
			}
		}

		$sqltestexecdata = mysqli_query($conn,"SELECT t.*,IFNULL(p.s_p_name,'') as 'Project Name',
		IFNULL(r.s_r_releaseId,'') as 'Release Name',
		IFNULL(t.s_t_testscenarionum,'') as 'Test Scenario ID',
		IFNULL(t.s_t_testcasenum,'') as 'Testcase ID',
		IFNULL(t.s_t_module,'') as 'Module',
		IFNULL(t.s_t_submodule,'') as 'Sub Module',
		IFNULL(t.s_t_testmode,'') as 'Test Mode'
		from s_testcase t 
		left join s_project p on p.s_p_id = t.projectId 
		left join s_release r on r.s_r_id = t.releaseId
		where t.accountId = '".$accountId."'  $where 
		order by t.s_t_id desc");
		$dSrno = 0;
		while($tcdata = mysqli_fetch_assoc($sqltestexecdata)){
			$iterationsqldata = mysqli_query($conn,"SELECT * from s_testcaserun where testcaseId = '".$tcdata['s_t_id']."' and accountId = '".$accountId."' $iterationwhere order by s_st_id desc ");
			$iterationcount = mysqli_num_rows($iterationsqldata);


			$testresult = "";
			$testresultsqldata = mysqli_query($conn,"SELECT s_f_testresult from s_testcasefinal where testcaseId = '".$tcdata['s_t_id']."' and accountId = '".$accountId."' and s_f_testresult != ''  order by s_f_id desc, s_f_updatetime desc limit 1  ");
			while($resultdata = mysqli_fetch_assoc($testresultsqldata)){
					$testresult = $resultdata['s_f_testresult'];
			}
			$activityname = "";
			if($tcdata['s_t_activityIds'] !=""){
				$chksql = "select IFNULL(GROUP_CONCAT(s_a_name),'') as activityname from s_activitymaster where s_a_id in  (".$tcdata['s_t_activityIds'].")  and accountId = '".$accountId."'  ";
				$chkstmt = mysqli_query( $conn, $chksql);

				while($actdata = mysqli_fetch_assoc($chkstmt)){
					$activityname = $actdata['activityname'];
				}
			}
			echo '<tr>
						<td>'.$tcdata['Testcase ID'].'</td>
						<td>'.$tcdata['Project Name'].'</td>
						<td>'.$tcdata['Release Name'].'</td>
						<td>'.$activityname.'</td>
						<td>'.$tcdata['Test Mode'].'</td>
						<td>'.$tcdata['Module'].'</td>
						<td>'.$tcdata['Sub Module'].'</td>
                                                <td>'.$testresult.'</td>
					</tr>';
		}

	}else{
		if(in_array($xAxis, array("Iteration"))){
			$where .= " AND t.s_t_id in (select testcaseId from s_testcasefinal where accountId = '".$accountId."' and s_f_id in (select max(s_f_id) from s_testcasefinal where accountId = '".$accountId."' group by testcaseId) and s_f_testresult = '".$xVal."') ";
		}else if(in_array($xAxis, array("Testcase Result"))){
			$where .= " AND t.s_t_id in (select testcaseId from s_testcasefinal where accountId = '".$accountId."' and s_f_id in (select max(s_f_id) from s_testcasefinal where accountId = '".$accountId."' group by testcaseId) and ".($xVal == "Not Specified" || $xVal == "" || $xVal == "0" ? "(s_f_testresult is null or s_f_testresult = '')" : "s_f_testresult = '".$xVal."'").") ";
		}else{
			switch ($xAxis) {
				case 'Project Name':
					$where .= " and t.projectId in (select s_p_id from s_project where s_p_name = '".$xVal."' and accountId = '".$accountId."')  ";
					break;
				case 'Release Name':
					$where .= " and t.releaseId  in (select s_p_id from s_project where s_p_name = '".$xVal."' and accountId = '".$accountId."')  ";
					break;
				case 'Activity Name':
					$where .= " and t.s_t_activityIds  = '".$xVal."' ";
					break;
				case 'Test Scenario ID':
					$where .= " and t.s_t_testscenarionum  = '".$xVal."' ";
					break;
				case 'Testcase ID':
					$where .= " and t.s_t_testcasenum  = '".$xVal."' ";
					break;
				case 'Module':
					$where .= " and t.s_t_module  = '".$xVal."' ";
					break;
				case 'Sub Module':
					$where .= " and t.s_t_submodule  = '".$xVal."' ";
					break;
				case 'Test Mode':
					$where .= " and t.s_t_testmode  = '".$xVal."' ";
					break;
			}
		}

		$sqltestexecdata = mysqli_query($conn,"SELECT t.*,IFNULL(p.s_p_name,'') as 'Project Name',
		IFNULL(r.s_r_releaseId,'') as 'Release Name',
		IFNULL(t.s_t_testscenarionum,'') as 'Test Scenario ID',
		IFNULL(t.s_t_testcasenum,'') as 'Testcase ID',
		IFNULL(t.s_t_module,'') as 'Module',
		IFNULL(t.s_t_submodule,'') as 'Sub Module',
		IFNULL(t.s_t_testmode,'') as 'Test Mode'
		from s_testcase t 
		left join s_project p on p.s_p_id = t.projectId 
		left join s_release r on r.s_r_id = t.releaseId
		where t.accountId = '".$accountId."'  $where 
		order by t.s_t_id desc");
		
		
		$dSrno = 0;
		while($tcdata = mysqli_fetch_assoc($sqltestexecdata)){
			$iterationsqldata = mysqli_query($conn,"SELECT * from s_testcaserun where testcaseId = '".$tcdata['s_t_id']."' and accountId = '".$accountId."' $iterationwhere order by s_st_id desc ");
			$iterationcount = mysqli_num_rows($iterationsqldata);


			$testresult = "";
			$testresultsqldata = mysqli_query($conn,"SELECT s_f_testresult from s_testcasefinal where testcaseId = '".$tcdata['s_t_id']."' and accountId = '".$accountId."' and s_f_testresult != ''  order by s_f_id desc,s_f_updatetime desc limit 1  ");
			while($resultdata = mysqli_fetch_assoc($testresultsqldata)){
					$testresult = $resultdata['s_f_testresult'];
			}
			$activityname = "";
			if($tcdata['s_t_activityIds'] !=""){
				$chksql = "select IFNULL(GROUP_CONCAT(s_a_name),'') as activityname from s_activitymaster where s_a_id in  (".$tcdata['s_t_activityIds'].")  and accountId = '".$accountId."'  ";
				$chkstmt = mysqli_query( $conn, $chksql);

				while($actdata = mysqli_fetch_assoc($chkstmt)){
					$activityname = $actdata['activityname'];
				}
			}
			echo '<tr>
						<td>'.$tcdata['Testcase ID'].'</td>
						<td>'.$tcdata['Project Name'].'</td>
						<td>'.$tcdata['Release Name'].'</td>
						<td>'.$activityname.'</td>
						<td>'.$tcdata['Test Mode'].'</td>
						<td>'.$tcdata['Module'].'</td>
						<td>'.$tcdata['Sub Module'].'</td>
                                                <td>'.$testresult.'</td>
					</tr>';
		}
	}
}
mysqli_stmt_close($stmt);
}	
echo '</tbody></table>';
