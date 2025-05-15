<?php
include('../config.php');
include('../chksession.php');
$activetab = "testcaseActive";
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
                            <li class="active">Test Case</li>
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
            <div class="row "  style="margin-top: -25px;">
                        
                <div class="col-3">
                    <div class="form-group">
                        <label for="filter_projectId" class=" form-control-label font-weight-bold">Project : </label>

                        <select class="selectpicker form-control" id="filter_projectId" name="filter_projectId[]"  data-live-search="true" title="Select Project" data-hide-disabled="true"  multiple data-actions-box="true" ></select>
                    </div>
                </div>
                
                <div class="col-3">
                    <div class="form-group">
                        <label for="filter_releaseId" class=" form-control-label font-weight-bold">Release : </label>

                        <select class="selectpicker form-control" id="filter_releaseId" name="filter_releaseId[]"  data-live-search="true" title="Select Release" data-hide-disabled="true"  multiple data-actions-box="true" ></select>
                    </div>
                </div>
                <div class="col-3">
                    <div class="form-group">
                        <label for="filter_module" class=" form-control-label font-weight-bold">Module : </label>

                        <select class="selectpicker form-control" id="filter_module" name="filter_module[]"  data-live-search="true" title="Select Module" data-hide-disabled="true"  multiple data-actions-box="true" ></select>
                    </div>
                </div>

                <div class="col-3">
                    <div class="form-group">
                        <label for="filter_submodule" class=" form-control-label font-weight-bold">Sub Module : </label>

                        <select class="selectpicker form-control" id="filter_submodule" name="filter_submodule[]"  data-live-search="true" title="Select Sub Module" data-hide-disabled="true"  multiple data-actions-box="true" ></select>
                    </div>
                </div>


            </div>
            <div class="row form-group"> 
                <div class="col-3">
                    <div class="form-group">
                        <label for="filter_category" class=" form-control-label font-weight-bold">Category : </label>

                        <select class="selectpicker form-control" id="filter_category" name="filter_category[]"  data-live-search="true" title="Select Category" data-hide-disabled="true"  multiple data-actions-box="true" ></select>
                    </div>
                </div>
                <div class="col-3">
                    <div class="form-group">
                        <label for="filter_testcaseId" class=" form-control-label font-weight-bold">Test Case ID : </label>

                        <select class="selectpicker form-control" id="filter_testcaseId" name="filter_testcaseId[]"  data-live-search="true" title="Select Testcase" data-hide-disabled="true"  multiple data-actions-box="true" ></select>
                    </div>
                </div>
            </div>
            <hr/>
            <div class="row mb-3">   

                <div class="col-md-2">

                    <?php 
                    if((isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin") || (isset($_SESSION["ruleIds"]) && in_array("14", explode(",", $_SESSION["ruleIds"])))){ ?> 
                    <button type="button" class="btn btn-step " id="addTestcase" data-toggle="modal" data-target="#testcasemodal"><i class="fa fa-plus"></i> Add Test Case&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
                    <?php } ?>
                </div>

                <div class="col-md-8 text-left"  id="exportButtonsContainer" ></div>
                <div class="col-md-2 text-right">
                    <button class="btn btn-step dropdown-toggle" type="button" id="dropdownActionButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Bulk Action
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownActionButton">
                    <a class="dropdown-item" href="javascript:void(0)" data-toggle="modal" data-target="#uploadmodal"  data-type="Upload">Upload Testcases</a>
                    <a class="dropdown-item" href="<?php echo STEP_root; ?>api/DownloadSamplenew.php?type=Testcase"  target="_blank" data-type="Download">Download Sample Format</a>
                    <a class="dropdown-item hidden" href="javascript:void(0)" data-toggle="modal" data-target="#copymodal"  data-type="Copy">Copy Testcases</a>
                    <a class="dropdown-item hidden" href="javascript:void(0)" data-toggle="modal" data-target="#movemodal"  data-type="Move">Move Testcases</a>
                   <?php 
                    if((isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin") || (isset($_SESSION["ruleIds"]) && in_array("16", explode(",", $_SESSION["ruleIds"])))){ ?>
                    
		    <a class="dropdown-item bulkAction" href="javascript:void(0)"  data-type="Delete">Delete</a>
	          <?php  } ?>	
                    </div>
                </div>
            </div>
            <div class="col-md-12" id="errmsg">
            </div>
            <table id="testcaseTbl" class="table compact nowrap border " style="width:100%;">
                <thead  class="bg-step text-white">
                    <tr align="left">
                    <th class="notexport">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="select_all">
                            <label class="custom-control-label" for="select_all">&nbsp;</label>
                        </div>
                    </th>
                    <th>Test Case ID</th> 
                    <th>Test Scenario ID</th> 
                    <th>Project</th> 
                    <th>Release</th> 
                    <th>Test Type</th> 
                    <th>Test Mode</th> 
                    <th>Module</th> 
                    <th>Sub Module</th>  
                    <th class="notexport">Assign To</th> 
                    <th>Author</th> 
                    <th>Reviewer</th>
                    <th>TC Description</th>
                    <th>TS Description</th>
                    <th>Steps</th> 
                    <th>Expected Result</th> 
                    <th>Pre-Condition</th> 
                    <th>Test Data</th> 
                    <th>Comment</th> 
                    <th>Testcase Category</th>
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
                        
                            <div class="col-sm-12">
                                <div class="alert  alert-info alert-dismissible fade show" role="alert">
                                    <span class="badge badge-pill badge-info">Information</span> Release and test type is based on project selection.<br/>
                                    <div id="informationalert"></div>
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-4 " style="display: none;">
                                    <div class="form-group">
                                        <label for="testcaseDBId" class=" form-control-label">Activity ID : </label>
                                        <input type="text" id="testcaseDBId" name="testcaseDBId" placeholder="Enter activity name" value="0" class="form-control">
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group required ">
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
                                    <div class="form-group">
                                        <label for="activityId" class=" form-control-label">Test Type : </label>

                                        <select class="selectpicker form-control" id="activityId" name="activityId[]" multiple=""  data-live-search="true" title="Select test type" data-hide-disabled="true" data-exist=""></select>
                                    </div>
                                </div>
                            </div>
                            <div class="row form-group">
                                
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="scenarioId" class=" form-control-label">Testcase Scenario : </label>
                                        <input type="hidden" name="scenarioIdstr" id="scenarioIdstr" value=""/>
                                        <select class="selectpicker form-control" id="scenarioId" name="scenarioId"  data-live-search="true" title="Select Scenario" data-hide-disabled="true" data-exist=""></select>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="module" class=" form-control-label">Module : </label>
                                        <input type="text" id="module" name="module" placeholder="Enter module" class="form-control" data-exist="">
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="submodule" class=" form-control-label">Sub Module : </label>
                                        <input type="text" id="submodule" name="submodule" placeholder="Enter submodule" class="form-control" data-exist="">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row form-group">

                                <div class="col-4 hidden">
                                    <div class="form-group">
                                        <label for="assignto" class=" form-control-label">Assign to : </label>

                                        <select class="selectpicker form-control" id="assignto" name="assignto"  data-live-search="true" title="Select assignee" data-hide-disabled="true" data-exist=""></select>
                                    </div>
                                </div>

                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="reviewer" class=" form-control-label">Reviewer : </label>

                                        <select class="selectpicker form-control" id="reviewer" name="reviewer"  data-live-search="true" title="Select reviewer" data-hide-disabled="true" data-exist=""></select>
                                    </div>
                                </div>
                                
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="testmode" class=" form-control-label">Test Mode : </label>
                                            <select class="form-control" id="testmode" name="testmode" required="" data-exist="">
                                            <option value="" >Select Test Mode</option>
                                            <option value="Manual" selected="">Manual</option>
                                            <option value="Automation">Automation</option>
                                            </select>
                                    </div>
                                </div>

                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="category" class=" form-control-label">Category : </label>

                                        <select class="selectpicker form-control" id="category" name="category"  data-live-search="true" title="Select category" data-hide-disabled="true" data-exist=""></select>
                                    </div>
                                </div>
                            </div>
                            <div class="row form-group">

                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="testscenariodesc" class=" form-control-label">Test Scenario Description : </label>
                                        <input type="hidden" id="testscenariodesc_change" name="testscenariodesc_change"  value="0" />
                                        <textarea  class="form-control" name="testscenariodesc" id="testscenariodesc" rows="2"></textarea>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="testcasedesc" class=" form-control-label">Test Case Description : </label>
                                        <input type="hidden" id="testcasedesc_change" name="testcasedesc_change"  value="0" />
                                        <textarea  class="form-control" name="testcasedesc" id="testcasedesc" rows="2"></textarea>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row form-group">

                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="precondition" class=" form-control-label">Pre-Condition : </label>
                                        <input type="hidden" id="precondition_change" name="precondition_change"  value="0" />
                                        <textarea  class="form-control" name="precondition" id="precondition" rows="2"></textarea>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="testdata" class=" form-control-label">Test Data : </label>
                                        <input type="hidden" id="testdata_change" name="testdata_change"  value="0" />
                                        <textarea  class="form-control" name="testdata" id="testdata" rows="2"></textarea>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row form-group">

                                <div class="col-6">
                                    <div class="form-group">
                                        <label for="comment" class=" form-control-label">Comment : </label>
                                        <input type="hidden" id="comment_change" name="comment_change"  value="0" />
                                        <textarea  class="form-control" name="comment" id="comment" rows="2"></textarea>
                                    </div>
                                </div>
                            </div>


                            <div class="row form-group">
                                    <div class="col-12 pull-right">
                                        <button type="button" class="btn btn-step m-3" id="addStep" ><i class="fa fa-plus"></i> Add Steps</button>
                                    </div> 
                            </div>

                            <div class="row form-group">
                                    <div class="col-12"> 
                                        <table id="stepsTbl" class="table compact nowrap border " style="width:100%;">
                                        <thead  class="bg-step text-white">
                                            <tr align="left">
                                            <th>Steps No.</th>  
                                            <th>Steps</th>  
                                            <th>Expected Result</th> 
                                            <th class="notexport">Action</th>
                                            </tr> 
                                        </thead>
                                        
                                    </table>
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


    <div class="modal fade" id="copymodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Copy Testcase</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="copyform" method="post" class="form-horizontal">
                    <div class="modal-body">
                        
                            <div class="row form-group">
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="projectId" class=" form-control-label">Project : </label>

                                        <select class="selectpicker form-control" id="copy_projectId" name="projectId"  data-live-search="true" title="Select project" data-hide-disabled="true" onchange="getRelease(this)"></select>
                                    </div>
                                </div>
                                
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="releaseId" class=" form-control-label">Release : </label>

                                        <select class="selectpicker form-control" id="copy_releaseId" name="releaseId"  data-live-search="true" title="Select release" data-hide-disabled="true"></select>
                                    </div>
                                </div>
                                
                                <div class="col-4">
                                    <div class="form-group ">
                                        <label for="activityId" class=" form-control-label">Test Type : </label>

                                        <select class="selectpicker form-control" id="copy_activityId" name="activityId[]" multiple=""  data-live-search="true" title="Select test type" data-hide-disabled="true"></select>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-gray" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-step">Copy</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="movemodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Move Testcase</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="moveform" method="post" class="form-horizontal">
                    <div class="modal-body">
                        
                            <div class="row form-group">
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="projectId" class=" form-control-label">Project : </label>

                                        <select class="selectpicker form-control" id="move_projectId" name="projectId"  data-live-search="true" title="Select project" data-hide-disabled="true" ></select>
                                    </div>
                                </div>
                                
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="releaseId" class=" form-control-label">Release : </label>

                                        <select class="selectpicker form-control" id="move_releaseId" name="releaseId"  data-live-search="true" title="Select release" data-hide-disabled="true"></select>
                                    </div>
                                </div>
                                
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="activityId" class=" form-control-label">Test Type : </label>

                                        <select class="selectpicker form-control" id="move_activityId" name="activityId[]" multiple=""  data-live-search="true" title="Select test type" data-hide-disabled="true"></select>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-gray" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-step">Move</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="uploadmodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Upload Testcase</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="uploadform" method="post" action="/" class="form-horizontal"  enctype="multipart/form-data">
                    <div class="modal-body">
                        
                            <div class="row form-group">
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="projectId" class=" form-control-label">Project : </label>

                                        <select class="selectpicker form-control" id="upload_projectId" name="projectId"  data-live-search="true" title="Select project" data-hide-disabled="true" onchange="getRelease(this)"></select>
                                    </div>
                                </div>
                                
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="releaseId" class=" form-control-label">Release : </label>

                                        <select class="selectpicker form-control" id="upload_releaseId" name="releaseId"  data-live-search="true" title="Select release" data-hide-disabled="true"></select>
                                    </div>
                                </div>
                                
                            </div>
                        
                            <div class="row form-group">
                                <div class="col-sm-6 ">
                                    <div class="form-group required">
                                        <label for="file" class=" form-control-label">Upload File</label>
                                        <input type="file" class="form-control" id="file" name="file" style="width:100%" required>
                                    </div>
                                    </div>
                            </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-gray" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-step">Upload</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <?php include(STEP_dir.'js.php'); ?>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/testcasenew-init.js"></script>

    

</body>

</html>
