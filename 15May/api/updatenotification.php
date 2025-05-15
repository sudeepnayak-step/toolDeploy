<?php
include('config.php');
session_start();
 
$enteredby = 0;$accountId = 0;$userempid = 0;
/** This script updates the notification status based on whether the user has viewed the notification or not. */
if(isset($_SESSION["id"])){
    $enteredby = $_SESSION["id"];
    $accountId = $_SESSION["accountId"];
    $userempid = $_SESSION["userempid"];
}
if($_SERVER['REQUEST_METHOD'] === 'POST'){

	$id = (isset($_POST['id']) ? $_POST['id'] : "0");

	if(!empty($id) && $id !="0") {
		$viewerarr = array();
		$result = array();
		// Use prepared statements to prevent SQL injection
		$sqldata = mysqli_prepare($conn, "SELECT IFNULL(s_n_viewer,'') as viewer FROM s_notifications WHERE s_n_id = ? AND accountId = ? ORDER BY s_n_id DESC LIMIT 1");
		mysqli_stmt_bind_param($sqldata, "si", $id, $accountId);
		mysqli_stmt_execute($sqldata);
		$result_data = mysqli_stmt_get_result($sqldata);

		if (mysqli_num_rows($result_data) > 0) {

			while($pdata = mysqli_fetch_assoc($result_data)){
				if($pdata['viewer'] != ""){
					$result = array_merge($viewerarr,explode(",", $pdata['viewer']));
				}
			}
		}
        // Close the prepared statement
        mysqli_stmt_close($sqldata);

		array_push($result, $userempid);
		$result = array_unique($result);
		// Use prepared statements to prevent SQL injection
        $sql = "UPDATE s_notifications SET s_n_viewer = ? WHERE s_n_id = ? AND accountId = ?";
        $stmt1 = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt1, "sii", implode(",", $result), $id, $accountId);
        mysqli_stmt_execute($stmt1);

        // Close the prepared statement
        mysqli_stmt_close($stmt1);

}
}
