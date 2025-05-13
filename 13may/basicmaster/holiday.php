<?php
include('../config.php');
include('../chksession.php');
$activetab = "holidayActive";
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
                            <li class="text-muted">Master</li>
                            <li><a href="<?php echo STEP_root; ?>basicmaster/clientholiday.php">Client Holidays</a></li>
                            <li class="active">Holidays</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row mb-3"> 
                <div class="col-md-4 text-left "  id="exportButtonsContainer" ></div>
                <div class="col-md-4"></div>                       
                <div class="col-md-4 text-right">
                    <button type="button" class="btn btn-step" id="addHoliday" data-toggle="modal" data-target="#holidaymodal">ADD</button>
                </div>
            </div>
            <table id="holidayTbl"  class="table compact " style="width:100%;">
                <thead  class="bg-step text-white" id="filters">
                    <tr>
                    <th class="notexport">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="select_all">
                            <label class="custom-control-label" for="select_all">&nbsp;</label>
                        </div>
                    </th>
                    <th>Name</th>
                    <th>Date</th> 
                    <th>Active Status</th> 
                    <th class="notexport">Action</th> 
                    </tr> 
                </thead>
            </table>
        </div>
    </div>

    <div class="modal fade" id="holidaymodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Holidays</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="holidayform" method="post" class="form-horizontal">
                    <div class="modal-body">
                        
                            <div class="row form-group">

                                <div class="col-4 " style="display: none;">
                                    <div class="form-group">
                                        <label for="roleId" class=" form-control-label"> ID : </label>
                                        <input type="text" id="holidayId" name="holidayId" placeholder="Enter activity name" value="0" class="form-control">
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="holidayname" class=" form-control-label">Name : </label>
                                        <input type="text" id="holidayname" name="holidayname" placeholder="Enter Holiday name" class="form-control">
                                    </div>
                                </div>

                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="holidaydate" class=" form-control-label">Date : </label>
                                        <input type="text" id="holidaydate" name="holidaydate" placeholder="dd/mm/yyyy" class="form-control datepicker" readonly="">
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
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/basicmaster/holiday-init.js"></script>

    

</body>

</html>
