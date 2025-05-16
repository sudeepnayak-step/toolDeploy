<?php
include('config.php');
//require_once('../PHPMailer/class.phpmailer.php');
session_start();
 /** this script saves the comment for RTM */
$enteredby = 0;$accountId = 0;
 
if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
}
if($_SERVER['REQUEST_METHOD'] === 'POST'){


	$rtmId = (isset($_POST['rtmId']) ? $_POST['rtmId'] : "0");
	$commentId = (isset($_POST['commentId']) ? $_POST['commentId'] : "0");
	$comment = "";
	if(isset($_POST['newcomment'])){
		$comment = mysqli_real_escape_string($conn,$_POST['newcomment']);
	}
	if(isset($_POST['newcomment'.$commentId])){
		$comment = mysqli_real_escape_string($conn,$_POST['newcomment'.$commentId ]);
	}

	$auditlogDesc = "added the comment for ";$emailids = "";$empids = "";
	$projectId = 0;
	$defectdata = mysqli_query($conn,"SELECT * from s_rtm where s_rtm_id = '".$rtmId."' and accountId ='".$accountId."'  ");

	while($ddata = mysqli_fetch_assoc($defectdata)){
		$projectId = $ddata['projectId'];
		$rtmIdstr = $ddata['s_rtm_reqnum'];
	}
	$empdata = mysqli_query($conn,"SELECT IFNULL(group_concat(s_e_emailid),'') as emailids, IFNULL(group_concat(s_e_id),'') as empids from  s_employees where s_e_activestatus = 'Active' and s_e_id in(select employeeId from s_project_members where projectId ='".$projectId."' and accountId ='".$accountId."' ) and accountId ='".$accountId."'   Order by s_e_id desc");

	while($edata = mysqli_fetch_assoc($empdata)){
		$emailids = $edata['emailids'];
		$empids = $edata['empids'];
	}
	$auditlogDesc = "added the comment for $rtmIdstr";
	// Prepare the SQL statement
	$sql = "INSERT INTO s_rtm_comments (rtmId, s_dc_key, s_dc_comment, accountId, s_dc_enteredby) VALUES (?, ?, ?, ?, ?)";
	$stmt = mysqli_prepare($conn, $sql);

	// Bind the parameters
	mysqli_stmt_bind_param($stmt, "sssss", $rtmId, $commentId, $comment, $accountId, $enteredby);

	// Execute the statement
	mysqli_stmt_execute($stmt);

	// Close the statement
	mysqli_stmt_close($stmt);

	if($emailids !=""){
		$notificationSql = "insert into s_notifications (`s_n_viewer`, `s_n_employees`,`s_n_recordid`,`s_n_recordnum`,`s_n_desc`,`accountId`,`s_n_enteredby`,s_n_emailflag,s_n_module   ) values ('','".$empids."','".$rtmId."','".$rtmIdstr."','".$auditlogDesc."','".$accountId."','".$enteredby."','0','RTM') ";
		
		mysqli_query( $conn, $notificationSql);

	}
}


function sendEmail($nEmailids,$ndefectnum,$nauditlogDesc,$nrtmId){
	global $conn,$accountId;
	// echo $nActivationNum;
// $emailid = "";$firstname = "";
// $assignsqldata = mysqli_query($conn,"SELECT *  from s_employees where accountId = '".$accountId."' and s_e_id = '".$nAssignto."' order by s_e_id desc limit 1");

// 	while($assigndata = mysqli_fetch_assoc($assignsqldata)){
// 		$emailid = $assigndata['s_e_emailid'];
// 		$firstname = $assigndata['s_e_fname'];
// 	}
$emailarr = explode(",", $nEmailids);
if(count($emailarr) >0){

$emailsqldata = mysqli_query($conn,"SELECT *  from s_emailsetting where accountId = '".$accountId."' order by s_es_id desc limit 1");
$e_host = "";
$e_port = "";
$e_fromname = "";
$e_username = "";
$e_password = "";
$e_id = 0;

	while($data = mysqli_fetch_assoc($emailsqldata)){
$e_host = $data['s_es_host'];
$e_port =  $data['s_es_port'];
$e_fromname =  $data['s_es_fromname'];
$e_username =  $data['s_es_username'];
$e_password =  $data['s_es_password'];
$e_id =  $data['s_es_id'];

}
$subject = "STEP - Defect Details";
$mail             = new PHPMailer(); // defaults to using php "mail()"

   $mail->IsSMTP(); // enable SMTP
            $mail->IsHTML(true);
   $mail->SMTPDebug  = 1;                     // enables SMTP debug information (for testing)
      $mail->SMTPAuth   = true;                  // enable SMTP authentication
      $mail->SMTPSecure = "ssl";                 // sets the prefix to the servier
      $mail->Host       = "$e_host";      // sets GMAIL as the SMTP server
      $mail->Port       = $e_port;   // set the SMTP port for the GMAIL server
      $mail->SMTPKeepAlive = true;
      $mail->Mailer = "smtp";
$body             = "Hi,<br/><br/>$nauditlogDesc . Please click on the following link by login to your account.<br/><br/>
	<a href='http://192.168.0.254:90/Step-Testalibre/master/defectdetails.php?id=$nrtmId' >$ndefectnum</a>";
$mail->Username   = "$e_username";  // GMAIL username
$mail->Password   = "$e_password"     ;       // GMAIL password

$mail->SetFrom("$e_username", "$e_fromname");

// $mail->AddReplyTo('test@gmail.com', 'Dipika');
$len = count($emailarr);
for($i=0; $i< $len; $i++){

$mail->AddAddress(trim($emailarr[$i]));
}
// $mail->AddAddress(trim($emailid));
// $mail->Subject    = "Daily Status Report -".$dsrdate;
$mail->Subject    = "$subject";

$mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test

$mail->MsgHTML($body);

if(!$mail->Send()) {
	echo 1;
  // echo "Mailer Error: " . $mail->ErrorInfo;
} else {
	echo 0;
  // echo "Message sent!";
}
}

}
