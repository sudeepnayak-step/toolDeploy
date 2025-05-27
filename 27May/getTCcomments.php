<?php
include('config.php');
session_start();
 
$enteredby = 0;$accountId=0;$userempid = 0;
 
   /** This PHP script retrieves the comments for defects from a database. 
 * It formats the data and returns it in JSON format. */


if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
    $userempid = $_SESSION["userempid"];
}


$testcaseId = (isset($_POST['testcaseId']) ? intval($_POST['testcaseId']) : 0);

$projarr['data'] = array();
$sql = "SELECT dc.*,
	concat(IFNULL(a1.s_e_fname,''),' ',IFNULL(a1.s_e_mname,''),' ',IFNULL(a1.s_e_lname,'')) as empname 
	from s_tc_comments dc 
 	left JOIN s_employees a1 on a1.userId = dc.s_dc_enteredby
	where dc.accountId = ? and dc.s_dc_key = '0' and testcaseId = ?
	order by dc.s_dc_id desc";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "ii",$accountId,$testcaseId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

while($data = mysqli_fetch_assoc($result)){

	$reply = array();
	$chksql = "SELECT dc.*,
	concat(IFNULL(a1.s_e_fname,''),' ',IFNULL(a1.s_e_mname,''),' ',IFNULL(a1.s_e_lname,'')) as empname 
	from s_tc_comments dc 
	left JOIN s_employees a1 on a1.userId = dc.s_dc_enteredby
	where dc.accountId = ? and dc.s_dc_key = ? and testcaseId = ?
	order by dc.s_dc_id asc ";
	
	$chkstmt = mysqli_prepare($conn, $chksql);
	mysqli_stmt_bind_param($chkstmt, "iii",$accountId,$data['s_dc_id'],$testcaseId);
	mysqli_stmt_execute($chkstmt);
	$chkresult = mysqli_stmt_get_result($chkstmt);

	while($actdata = mysqli_fetch_assoc($chkresult)){

		$replytime  ="";
		if(isset($actdata['s_dc_updatetime'])){
			// Create a DateTime object for the UTC time
			$dateTime = new DateTime($actdata['s_dc_updatetime'], new DateTimeZone('UTC'));

			// Convert to Indian Standard Time (IST)
			$dateTime->setTimezone(new DateTimeZone('Asia/Kolkata'));
			$replytime = $dateTime->format('Y-m-d H:i:s');
		}
		$reply[] = array("id"=>$actdata['s_dc_id'],
		"comment"=>$actdata['s_dc_comment'],
		"commenttime"=>$replytime,
		"empname"=>(!empty(str_replace(' ', '', $actdata['empname'])) ? $actdata['empname'] : "Admin")
		);
	}
	$commenttime  ="";
	if(isset($data['s_dc_updatetime'])){
		// Create a DateTime object for the UTC time
		$dateTime = new DateTime($data['s_dc_updatetime'], new DateTimeZone('UTC'));

		// Convert to Indian Standard Time (IST)
		$dateTime->setTimezone(new DateTimeZone('Asia/Kolkata'));
		$commenttime = $dateTime->format('Y-m-d H:i:s');
	}
	$projarr['data'][] = array("id"=>$data['s_dc_id'],
			"comment"=>$data['s_dc_comment'],
			"commenttime"=>$commenttime,
			"empname"=>(!empty(str_replace(' ', '', $data['empname'])) ? $data['empname'] : "Admin"),
			"reply"=>$reply);
}

echo json_encode($projarr);
?>
