<?php
include('../config.php');
include('../chksession.php');
$activetab = "rolemgmtActive";
?>
<!doctype html>
<html class="no-js" lang="en">
<head>
    <?php include(STEP_dir.'headmetatag.php'); ?>
    <?php include(STEP_dir.'css.php'); ?>
</head>

<body>

    <?php include(STEP_dir.'leftpanel.php'); ?>

    <div id="right-panel" class="right-panel">
        <?php include(STEP_dir.'header.php'); ?>

        <div class="breadcrumbs">
            <div class="col-sm-8">
                <div class="page-header float-left">
                    <div class="page-title">
                        <ol class="breadcrumb text-left">
                            <li><a href="<?php echo STEP_root; ?>index.php">Dashboard</a></li>
                            <li class="active">Roles</li>
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
                    <button type="button" class="btn btn-step" id="addRole" data-toggle="modal" data-target="#rolemodal">Add Role</button>
                </div>
            </div>
            <table id="roleTbl" class="table compact " style="width:100%">
                <thead class="bg-step text-white">
                    <tr>
                    <th class="notexport">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="select_all">
                            <label class="custom-control-label" for="select_all">&nbsp;</label>
                        </div>
                    </th>
                    <th>Role  Name</th>
                    <th>Resposnbility</th> 
                    <th>Active Status</th> 
                    <th class="notexport">Action</th> 
                    </tr> 
                </thead>
            </table>
        </div>
    </div>
    <div class="modal fade" id="rolemodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Role</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="roleform" method="post" class="form-horizontal">
                    <div class="modal-body">
                        
                            <div class="row form-group">

                                <div class="col-4 " style="display: none;">
                                    <div class="form-group">
                                        <label for="roleId" class=" form-control-label"> ID : </label>
                                        <input type="text" id="roleId" name="roleId" placeholder="Enter activity name" value="0" class="form-control">
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="rolename" class=" form-control-label">Role Name : </label>
                                        <input type="text" id="rolename" name="rolename" placeholder="Enter role name" class="form-control" value="" data-id="0" >
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="activestatus" class=" form-control-label">Active Status : </label>
                                            <select class="form-control" id="activestatus" name="activestatus" required="">
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
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/basicmaster/role-init.js"></script>

    

</body>

</html>
