<?php
include('config.php');
session_start();
  /**This PHP script retrieves defect data from a database based on user-provided filters (e.g., project, release, defect ID, status, etc.). 
  * It dynamically constructs a SQL query, executes it, and returns the results in JSON format. */

$userempid = 0;$accountId = 0;$enteredby =0;
 
if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
}

if(isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Employee"){
	if(isset($_SESSION["userempid"])){
		$userempid = $_SESSION["userempid"];
	}
}

$defectwhere = "";

$projectId = (isset($_POST['projectId']) && !empty($_POST['projectId'])? $_POST['projectId'] : "");
$releaseId = (isset($_POST['releaseId'])  && !empty($_POST['releaseId'])? $_POST['releaseId'] : "");
$defectId = (isset($_POST['defectId'])  && !empty($_POST['defectId'])? $_POST['defectId'] : "");
$statusId = (isset($_POST['statusId'])  && !empty($_POST['statusId'])? $_POST['statusId'] : "");

$rtmId = (isset($_POST['rtmId']) ? $_POST['rtmId'] : "0");
$module = (isset($_POST['module']) ? $_POST['module'] : "");


// Build the WHERE clause dynamically
$params = [];
$types = "";

if ($projectId != "") {
    $defectwhere .= " AND find_in_set(d.projectId,?) ";
    $params[] = $projectId;
    $types .= "s";
}

if ($releaseId != "") {
    $defectwhere .= " AND find_in_set(d.releaseId,?) ";
    $params[] = $releaseId;
    $types .= "s";
}

if ($defectId != "") {
    $defectwhere .= " AND find_in_set(d.s_d_id,?) ";
    $params[] = $defectId;
    $types .= "s";
}

if ($statusId != "") {
    $defectwhere .= " AND find_in_set(d.defectstatusId,?) ";
    $params[] = $statusId;
    $types .= "s";
}

if ($module != "") {
    $defectwhere .= " AND d.s_d_module = ? ";
    $params[] = $module;
    $types .= "s";
}

if ($rtmId != "0" && $rtmId != "") {
    $defectwhere .= " AND d.s_d_id NOT IN (SELECT defectId FROM s_rtm_testcase WHERE rtmId = ? AND accountId = ?)";
    $params[] = $rtmId;
    $params[] = $accountId;
    $types .= "ss";
}

if (isset($_SESSION["usertype"]) && $_SESSION["usertype"] != "Admin") {
    $defectwhere .= " AND d.projectId IN (SELECT s_p_id FROM s_project WHERE s_p_id IN (SELECT projectId FROM s_project_members WHERE employeeId = ? AND accountId = ?) OR s_p_enteredby = ? AND accountId = ?)";
    $params[] = $userempid;
    $params[] = $accountId;
    $params[] = $enteredby;
    $params[] = $accountId;
    $types .= "ssss";
}

// Prepare the SQL query
$sql = "SELECT d.*, IFNULL(p.s_p_name,'') as projectname,
        IFNULL(r.s_r_releaseId,'') as releaseNum,
        IFNULL(t.s_t_testcasenum,'') as testcasenum,
        IFNULL(ds.s_ds_name,'') as defectstatus,
        IFNULL(dt.s_dt_name,'') as defecttype
        FROM s_defect d 
        LEFT JOIN s_project p ON p.s_p_id = d.projectId 
        LEFT JOIN s_release r ON r.s_r_id = d.releaseId 
        LEFT JOIN s_testcase t ON t.s_t_id = d.testcaseId 
        LEFT JOIN s_defectstatusmaster ds ON ds.s_ds_id = d.defectstatusId 
        LEFT JOIN s_defecttypemaster dt ON dt.s_dt_id = d.defecttypeId 
        WHERE d.accountId = ? $defectwhere 
        ORDER BY d.s_d_id ASC";

// Prepare statement
$stmt = mysqli_prepare($conn, $sql);
	
mysqli_stmt_bind_param($stmt, "i" . $types, $accountId, ...$params);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$projarr['data'] = array();
while($data = mysqli_fetch_assoc($result)){
	$attachemnts = 0;

	$dir = $CFG['dirroot']."defectdata/".$accountId."/".$data['s_d_id']."/";

	if(is_dir($dir)) {
		$files = array_diff(scandir($dir), array('..', '.'));
		if(count($files) >0){
			$attachemnts = 1;
		}
	}
    $updatedtime  ="";
	if(isset($data['s_dc_updatetime'])){
		// Create a DateTime object for the UTC time
		$dateTime = new DateTime($data['s_dc_updatetime'], new DateTimeZone('UTC'));

		// Convert to Indian Standard Time (IST)
		$dateTime->setTimezone(new DateTimeZone('Asia/Kolkata'));
		$updatedtime = $dateTime->format('Y-m-d h:i a');
	}
	$createdtime  ="";
	if(isset($data['s_d_createdtime'])){
		// Create a DateTime object for the UTC time
		$dateTime = new DateTime($data['s_d_createdtime'], new DateTimeZone('UTC'));

		// Convert to Indian Standard Time (IST)
		$dateTime->setTimezone(new DateTimeZone('Asia/Kolkata'));
		$createdtime = $dateTime->format('Y-m-d h:i a');
	}
	$projarr['data'][] = array($data['s_d_id'], //0
		$data['projectname'], //1
		$data['releaseNum'], //2
		$data['s_d_module'], //3
		$data['s_d_submodule'], //4 
		$data['s_d_defectnum'], //5
		$data['testcasenum'], //6
		$data['s_d_shortdesc'], //7
		$data['s_d_longdesc'], //8
		$data['s_d_testdata'], //9
		$data['s_d_steps'], //10
		$data['s_d_expectedresult'], //11
		$data['s_d_actualresult'], //12
		(!empty($data['defecttype']) ? $data['defecttype'] : "-"),//8 13
		$data['defectstatus'],//9 14
		(!empty($data['s_d_severity']) ? $data['s_d_severity'] : "-"),//10 15
		(!empty($data['s_d_priority']) ? $data['s_d_priority'] : "-"),//11 16
		$createdtime,$updatedtime,		
		$attachemnts,//14 19
		$data['s_d_id']//15 20
		);
}

echo json_encode($projarr);
?>
