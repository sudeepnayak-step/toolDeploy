<?php
include('../config.php');
include('../chksession.php');
$activetab = "userActive";
?>
<!doctype html>
<html class="no-js" lang="en">

<head>
    <?php include(STEP_dir.'headmetatag.php'); ?>
    <?php include(STEP_dir.'css.php'); ?>
</head>

<body>

    <?php include(STEP_dir.'leftpanel.php'); ?>

    <div id="right-panel" class="right-panel"  style="background-color: white;">
        <?php include(STEP_dir.'header.php'); ?>

        <div class="breadcrumbs">
            <div class="col-sm-8">
                <div class="page-header float-left">
                    <div class="page-title">
                        <ol class="breadcrumb text-left">
                            <li><a href="<?php echo STEP_root; ?>index.php">Dashboard</a></li>
                            <li class="active">Users</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row  mb-3"> 
           	<div class="col-md-4 text-left "  id="exportButtonsContainer" ></div>
        	<div class="col-md-4"></div>  

                <div class="col-md-4 text-right">
                    <button type="button" class="btn btn-step " id="addUser" data-toggle="modal" data-target="#usermodal">Add User</button>
                </div>
            </div>
                
            <table id="userTbl" class="table compact " style="width:100%;">
                <thead  class="bg-step text-white" id="filters">
                    <tr>
                    <th class="notexport">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="select_all">
                            <label class="custom-control-label" for="select_all">&nbsp;</label>
                        </div>
                    </th>
                    <th>Full Name</th>
                    <th>Email ID</th> 
                    <th>Phone No.</th> 
                    <th>Role</th>  
                    <th>User ID</th>  
                    <th>Account Status</th>  
                    <th>Active Status</th> 
                    <th class="notexport">Action</th> 
                    </tr> 
                </thead>
            </table>
        </div>
    </div>

    <div class="modal fade" id="usermodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">New User</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="userform" method="post" class="form-horizontal">
                    <div class="modal-body">
                        <div id="informationalert"></div>
                        <div class="row form-group">
                            
                                <div class="col-4 " style="display: none;">
                                <div class="form-group">
                                    <label for="uid" class=" form-control-label">uid : </label>
                                    <input type="text" id="uid" name="uid" placeholder="Enter release name" value="0" class="form-control">
                                    <input type="text" id="userId" name="userId" placeholder="Enter release name" value="0" class="form-control">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="firstname" class=" form-control-label">First Name : </label>
                                    <input type="text" id="firstname" name="firstname" placeholder="Enter first name" class="form-control"  data-exist="">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="middlename" class=" form-control-label">Middle Name : </label>
                                    <input type="text" id="middlename" name="middlename" placeholder="Enter middle name" class="form-control" data-exist="">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="lastname" class=" form-control-label">Last Name : </label>
                                    <input type="text" id="lastname" name="lastname" placeholder="Enter last name" class="form-control" data-exist="">
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="emailid" class=" form-control-label">Email ID : <small>(This will consider as a username)</small></label>
                                    <input type="email" id="emailid" name="emailid" placeholder="Enter email id" class="form-control" data-exist="" data-id="0" >
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="phoneno" class=" form-control-label">Phone No. : </label>
                                    <input type="number" id="phoneno" name="phoneno" placeholder="Enter phone no." class="form-control" data-exist="">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="roleId" class=" form-control-label">Role : </label>

                                    <select class="selectpicker form-control" id="roleId" name="roleId"  data-live-search="true" title="Select Role" data-hide-disabled="true" data-exist=""></select>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="activestatus" class=" form-control-label">Active Status : </label>
                                        <select class="form-control" id="activestatus" name="activestatus" required="" data-exist="">
                                        <option value="" >Select Status</option>
                                        <option value="Active" selected="">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-step">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>




    <?php include(STEP_dir.'js.php'); ?>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/user-init.js"></script>

    

</body>

</html>
