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
                        <h1 class=" font-weight-bold">Test Execution and Artifacts</h1>
                    </div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="page-header float-left">
                    <div class="page-title">
                        <ol class="breadcrumb text-left">
                            <li><a href="<?php echo STEP_root; ?>index.php">Dashboard</a></li>                
                            <li><a href="<?php echo STEP_root; ?>testmanagement.php">Test Management</a></li>
                            <li><a href="<?php echo STEP_root; ?>master/testsuite.php">Test Suite</a></li>
                            <li class="active">Test Execution and Artifacts</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="col-6">
                    <a href="JavaScript:Void(0);" id="prvdefect" class="btn btn-outline-step btn-sm hidden"><i class="fa fa-arrow-left"></i>&nbsp; Prev</a>
                </div>

                <div class="col-6 ">
                    <a href="JavaScript:Void(0);"id="nextdefect" class="pull-right btn btn-outline-step btn-sm hidden"><i class="fa fa-arrow-right"></i>&nbsp; Next</a>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <span class="card-title" id="suitenumtxt"></span>
                </div>
                <div class="card-body">
                    <div class="row form-group">
                        <p class="col-md-4" id="suitenametxt"></p>
                        <p class="col-md-4" id="projecttxt"></p>
                        <p class="col-md-4" id="releasetxt"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-4" id="activitytxt"></p>
                        <p class="col-md-4" id="typetxt"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-12" id="desctxt"></p>
                    </div>
                </div>
            </div>
               
            <div class="row mb-3">   

                <div class="col-md-4 text-left">
                    <button type="button" class="btn btn-step bulkAction"   data-type="Execute"><i class="fa fa-play"></i> &nbsp;&nbsp;Execute&nbsp;&nbsp;</button>
      		<!-- </div>
		<div class="col-md-2 text-left"> -->
                    <button type="button" class="btn btn-step uipathbulkAction"   data-type="Execute"><i class="fa fa-play"></i> &nbsp;&nbsp;Automation Execution&nbsp;&nbsp;</button>
		</div>
		<div class="col-md-1 text-left"   id="exportButtonsContainer" ></div>
                <div class="col-md-7 text-right">
                    <button type="button" class="btn btn-step" id="addTestcase" data-toggle="modal" data-target="#testcasemodal"><i class="fa fa-plus"></i> Add Testcase</button>
                    
                </div>
            </div>

            <table id="testexecutionTbl" class="table compact nowrap border" style="width:100%;">
                <thead  class="bg-step text-white" >
                    <tr align="left" >
                    <th class="notexport">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="select_all">
                            <label class="custom-control-label" for="select_all">&nbsp;</label>
                        </div>
                    </th> 
                    <th>Module</th>  
                    <th>Test Scenario ID</th> 
                    <th>Testcase ID</th> 
                    <th class="notexport">Test Case AutoID</th> 
                    <th>TC Description</th>
                    <th>Test Result</th>
                    <th>Steps</th>
                    <th class="notexport">View Defect</th>
                    <th >Defect</th>
                    <th class="notexport">Artifact</th>
                    <th>Iteration</th>
                    <th>Execution Start Time</th>
                    <th>Execution End Time</th>
                    <th>Execution Time</th>
                    <th class="notexport">Exection Status</th>
                    <th class="notexport">Exection Date</th>
                    <th class="notexport">Action</th>
                    </tr> 
                </thead>
                
            </table>
        </div>

    </div>


    <div class="modal fade" id="testcasemodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Testcase</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="testcaseform" method="post" class="form-horizontal">
                    <div class="modal-body">
                        
                            <div class="row form-group">
                                <div class="col-3">
                                    <div class="form-group">
                                        <label for="filter_module" class=" form-control-label">Module : </label>

                                        <select class="selectpicker form-control" id="filter_module" name="filter_module"  data-live-search="true" title="Select module" data-hide-disabled="true"></select>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="form-group">
                                        <label for="filter_testcaseId" class=" form-control-label">Test Case ID : </label>

                                        <select class="selectpicker form-control" id="filter_testcaseId" name="filter_testcaseId"  data-live-search="true" title="Select testcase" data-hide-disabled="true"></select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row form-group">
                                <div class="col-12">
                                    <table id="testcaseTbl" class="table compact " style="width:100%;">
                                        <thead  class="bg-step text-white">
                                            <tr>
                                            <th class="notexport">
                                                <div class="custom-control custom-checkbox">
                                                    <input type="checkbox" class="custom-control-input" id="tc_select_all">
                                                    <label class="custom-control-label" for="tc_select_all">&nbsp;</label>
                                                </div>
                                            </th>
                                            <th>Test Case ID</th> 
                                            <th>Test Scenario ID</th> 
                                            <th>Project</th> 
                                            <th>Release</th> 
                                            <th>Activity</th> 
                                            <th>Type</th> 
                                            <th>Module</th> 
                                            <th>Sub Module</th> 
                                            <th>Assign To</th> 
                                            <th>Author</th> 
                                            <th>Reviewer</th> 
                                            <th>TC Description</th>
                                            <th>TS Description</th>
                                            <th>Steps</th> 
                                            <th>Expected Result</th> 
                                            <th>Pre-Condition</th> 
                                            <th>Test Data</th> 
                                            <th>Comment</th>
                                            <th>Category</th>
                                            </tr> 
                                        </thead>
                                    </table>
                                </div>
                            </div>
                            
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-gray" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-step">Add to testsuite</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <?php include(STEP_dir.'master/defect_form.php'); ?>
    <?php include(STEP_dir.'master/testsuite_form.php'); ?>
    <?php include(STEP_dir.'master/testcasedetailsmodal.php'); ?>
    <?php include(STEP_dir.'master/stepexecutionmodal.php'); ?>
    <?php include(STEP_dir.'master/stepiterationmodal.php'); ?>
    <?php include(STEP_dir.'js.php'); ?>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/testexecutionnew-init.js"></script>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/defect-init.js"></script>

    

</body>

</html>
