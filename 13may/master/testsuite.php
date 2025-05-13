<?php
include('../config.php');
include('../chksession.php');
$activetab = "testsuiteActive";
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
            <div class="col-sm-12">
                <div class="page-header float-left">
                    <div class="page-title">
                        <ol class="breadcrumb text-left">
                            <li><a href="<?php echo STEP_root; ?>index.php">Dashboard</a></li>                
                            <li><a href="<?php echo STEP_root; ?>testmanagement.php">Test Management</a></li>
                            <li class="active">Test Suite</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        <div class="container" >
            <div class="row "> 
                <div class="col-md-12 text-right">
                    <button type="button" class="btn btn-danger btn-sm mb-2" id="resetFilter"><i class="fa fa-refresh"></i>&nbsp; Reset</button>
                </div>
            </div>
            <div class="row ">
                            
                <div class="col-3">
                    <div class="form-group">
                        <label for="tblfilterprojectId" class=" form-control-label font-weight-bold">Project : </label>

                        <select class="selectpicker form-control" id="tblfilterprojectId" name="tblfilterprojectId[]"  data-live-search="true" title="Select Project" data-hide-disabled="true"  multiple data-actions-box="true"></select>
                    </div>
                </div>
                
                <div class="col-3">
                    <div class="form-group">
                        <label for="tblfilterreleaseId" class=" form-control-label font-weight-bold">Release : </label>

                        <select class="selectpicker form-control" id="tblfilterreleaseId" name="tblfilterreleaseId[]"  data-live-search="true" title="Select Release" data-hide-disabled="true" multiple data-actions-box="true"></select>
                    </div>
                </div>
                
                <div class="col-3">
                    <div class="form-group">
                        <label for="tblfilteractivityId" class=" form-control-label font-weight-bold">Test Plan : </label>

                        <select class="selectpicker form-control" id="tblfilteractivityId" name="tblfilteractivityId[]"  data-live-search="true" title="Select Test Plan" data-hide-disabled="true" multiple data-actions-box="true"></select>
                    </div>
                </div>
            </div>
            <hr>
	    <div class="row mb-3"> 
                    <div class="col-md-4 text-left "  id="exportButtonsContainer" >
                    </div>
                    <div class="col-md-4"></div>
            <?php 
            if((isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin") || (isset($_SESSION["ruleIds"]) && in_array("18", explode(",", $_SESSION["ruleIds"])))){ ?> 
                <div class="col-md-4 text-right">
                    <button type="button" class="btn btn-step" id="addTestsuite" data-toggle="modal" data-target="#testsuitemodal"><i class="fa fa-plus"></i> Add Test Suite</button>
                </div>
            <?php } ?>
	   </div>
            <table id="testsuiteTbl" class="table compact nowrap border " style="width:100%;">
                <thead  class="bg-step text-white">
                    <tr>
                    <th class="notexport">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="select_all">
                            <label class="custom-control-label" for="select_all">&nbsp;</label>
                        </div>
                    </th>
                    <th>Test Suite Name</th> 
                    <th>Test Suite ID</th>
                    <th>Project</th> 
                    <th>Release</th> 
                    <th>Test Plan</th> 
                    <th>Assign to</th> 
                    <th>Type</th>  
                    <th>Description</th>
                    <th class="notexport">Action</th> 
                    </tr> 
                </thead>
            </table>
        </div>
    </div>

    <div class="modal fade" id="testsuitemodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Testsuite</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="testsuiteform" method="post" class="form-horizontal">
                    <div class="modal-body">
                        
                            <div class="col-sm-12">
                                <div class="alert  alert-info alert-dismissible fade show" role="alert">
                                    <span class="badge badge-pill badge-info">Information</span> Release, test type and employee assignment is based on project selection.<br/>
                                    <div id="informationalert"></div>
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-4 " style="display: none;">
                                    <div class="form-group">
                                        <label for="testsuiteDBId" class=" form-control-label">Activity ID : </label>
                                        <input type="text" id="testsuiteDBId" name="testsuiteDBId" placeholder="Enter activity name" value="0" class="form-control">
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="projectId" class=" form-control-label">Project : </label>

                                        <select class="selectpicker form-control" id="projectId" name="projectId"  data-live-search="true" title="Select project" data-hide-disabled="true" onchange="getRelease(this)" data-exist=""></select>
                                    </div>
                                </div>
                                
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="releaseId" class=" form-control-label">Release : </label>

                                        <select class="selectpicker form-control" id="releaseId" name="releaseId"  data-live-search="true" title="Select release" data-hide-disabled="true" data-exist=""></select>
                                    </div>
                                </div>
                                
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="activityId" class=" form-control-label">Test Plan : </label>

                                        <select class="selectpicker form-control" id="activityId" name="activityId"  data-live-search="true" title="Select test plan" data-hide-disabled="true" data-exist=""></select>
                                    </div>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="testsuitename" class=" form-control-label">Test Suite name : </label>
                                        <input type="text" id="testsuitename" name="testsuitename" placeholder="Enter testsuite Name" class="form-control" data-exist="">
                                    </div>
                                </div>


                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="assignto" class=" form-control-label">Assign to : </label>

                                        <select class="selectpicker form-control" id="assignto" name="assignto"  data-live-search="true" title="Select assignee" data-hide-disabled="true" data-exist="" ></select>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="testsuitedesc" class=" form-control-label">Description : </label>
                                        <input type="hidden" id="testsuitedesc_change" name="testsuitedesc_change"  value="0" />
                                        <textarea  class="form-control" name="testsuitedesc" id="testsuitedesc" rows="2"></textarea>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="row form-group">
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="type" class=" form-control-label">Execution Type : </label>
                                            <select class="form-control" id="type" name="type" required>
                                            <option value="" >Select Type</option>
                                            <option value="Manual">Manual</option>
                                            <option value="Automation">Automation</option>
                                            </select>
                                    </div>
                                </div>

                                <div class="col-4 autosetting hidden">
                                    <div class="form-group">
                                        <label for="machinId" class=" form-control-label">Machin ID : </label>
                                        <input type="text" id="machinId" name="machinId" placeholder="Enter machin id" value="" data-id="0" class="form-control">
                                    </div>
                                </div>

                                <div class="col-4 autosetting hidden">
                                    <div class="form-group">
                                        <label for="command" class=" form-control-label">Command : </label>
                                        <input type="hidden" id="command_change" name="command_change"  value="0" />
                                        <textarea  class="form-control stepeditor"  name="command" id="command" rows="2"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div id="schdulingsetting" class="hidden">
                                <hr>
                                <div class="row form-group">
                                    <div class="col-12">
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="schedchk" name="schedchk">
                                            <input type="hidden" id="schedchk_change" name="schedchk_change"  value="0" />
                                            <label class="custom-control-label" for="schedchk">Do you want to schedule this? </label>
                                        </div>
                                        
                                    </div>
                                </div>

                                <div id="schdulingsettingchk" class="hidden">
                                    <h6 class="modal-title mb-2" id="scrollmodalLabel">Schedular Setting : </h6>
                                    <div class="row form-group">
                                        
                                        <div class="col-4">
                                            <div class="form-group ">
                                                <label for="schedularevery" class=" form-control-label">Execute Every : </label>
                                                <input type="text" id="schedularevery" name="schedularevery" placeholder="Enter unit"  data-id="0" class="form-control">
                                            </div>
                                        </div>
                                        <div class="col-4 ">
                                            <div class="form-group ">
                                                <label for="schedulartype" class=" form-control-label">&nbsp;</label>
                                                    <select class="form-control" id="schedulartype" name="schedulartype" >
                                                    <option value="" >Select Type</option>
                                                    <option value="Minute" >Minute</option>
                                                    <option value="Hour">Hour</option>
                                                    <option value="Day">Day</option>
                                                    </select>
                                            </div>
                                        </div>

                                        <div class="col-4 hidden" id="startimediv">
                                            <div class="form-group ">
                                                <label for="schedularstart" class=" form-control-label">Execution Start time : </label>
                                                <input type="text" id="schedularstart" name="schedularstart" placeholder="HH:mm" value="" data-id="0" class="form-control datetimepicker" readonly="">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row form-group">


                                        <div class="col-4">
                                            <div class="form-group ">
                                                <label for="schedularend" class=" form-control-label">Execution End date & time : </label>
                                                <input type="text" id="schedularend" name="schedularend" placeholder="YYYY-mm-dd HH:mm" value="" data-id="0" class="form-control datetimepicker" readonly="">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-gray" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-step">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>




    <?php include(STEP_dir.'js.php'); ?>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/testsuite-init.js"></script>

    

</body>

</html>
