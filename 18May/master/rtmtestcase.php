<?php
include('../config.php');
include('../chksession.php');
$activetab = "rtmActive";
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
                        <h1 class=" font-weight-bold">Requirement</h1>
                    </div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="page-header float-left">
                    <div class="page-title">
                        <ol class="breadcrumb text-left">
                            <li><a href="<?php echo STEP_root; ?>index.php">Dashboard</a></li>                
                            <li><a href="<?php echo STEP_root; ?>testmanagement.php">Test Management</a></li>
                            <li><a href="<?php echo STEP_root; ?>master/rtm.php">Requirement</a></li>
                            <li class="active">Details</li>
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
                    <span class="card-title" id="rtmnumtxt"></span>
                </div>
                <div class="card-body">
                    <div class="row form-group">
                        <p class="col-md-4" id="projecttxt"></p>
                        <p class="col-md-4" id="releasetxt"></p>
                        <p class="col-md-4" id="statustxt"></p>
                    </div>
		    <div class="row form-group">
			<p class="col-md-4" id="prioritytxt"></p>
			<p class="col-md-4" id="moduletxt"></p>
			<p class="col-md-4" id="submoduletxt"></p>
		    </div>
		   <div class="row form-group">
                        <p class="col-md-4" id="reviewertxt"></p>
                        <p class="col-md-4" id="assignmenttxt"></p>
                   </div>

		   <div class="row form-group">
                        <p class="col-md-12" id="summarytxt"></p>
                   </div>		
 		   <div class="row form-group">
			<p class="col-md-12" id="desctxt"></p>
                        
                    </div>
		 
                   <div class="row form-group hidden">
                        <p class="col-md-6" id="commenttxt"></p>
                        
                    </div>
                    
                </div>
            </div>

           
            <h6 id="rtmattachmentsheader" class="hidden">Attachments</h6>
            <br/>
            <div class="row form-group" id="rtmattachments"></div>
            <div class="row form-group ">
                <div class="col-md-4" ></div>
            </div>

            <hr>

	    <!-- Tabs navs -->
<ul class="nav nav-tabs mb-3" id="ex1" role="tablist">
  <li class="nav-item" role="presentation">
    <a
      data-toggle="tab"
      class="nav-link active"
      id="ex1-tab-1"
      href="#ex1-tabs-1"
      role="tab"
      aria-controls="ex1-tabs-1"
      aria-selected="true"
      >Comments</a
    >
  </li>
  <li class="nav-item" role="presentation">
    <a
      data-toggle="tab"
      class="nav-link"
      id="ex1-tab-2"
      href="#ex1-tabs-2"
      role="tab"
      aria-controls="ex1-tabs-2"
      aria-selected="false"
      >History</a
    >
  </li>

</ul>
<!-- Tabs navs -->

<!-- Tabs content -->
<div class="tab-content" id="ex1-content">
  <div
    class="tab-pane fade show active"
    id="ex1-tabs-1"
    role="tabpanel"
    aria-labelledby="ex1-tab-1"
  >
            <div class="container py-2">
                <div class="row">
                    <div class="comments col-md-9" >
              <!--          <h3 class="mb-4 font-weight-light">Comments</h3>-->
                        <div id="rtmcommentdiv"></div>
                        
                        <div class="card1">
                            <form id="commentform" method="post" class="form-horizontal" action="" enctype="multipart/form-data">
                            <div class="card-body card-block">
                                    <div class="form-group">
                                                    <label for="newcomment" class=" form-control-label">Comment : </label>
                                                    <textarea  class="form-control " name="newcomment" id="newcomment" row="4"></textarea>
                                                </div>
                            </div>
                            <div class="card-footer1 pull-right">
                                <button type="submit" class="btn btn-step btn-sm">
                                    <i class="fa fa-dot-circle-o"></i> Submit
                                </button>
                                <button type="reset" class="btn btn-danger btn-sm">
                                    <i class="fa fa-ban"></i> Reset
                                </button>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
</div>
  <div class="tab-pane fade" id="ex1-tabs-2" role="tabpanel" aria-labelledby="ex1-tab-2">
    <div id="rtmhistorydiv"></div>
  </div>
</div>
<!-- Tabs content -->

	<hr/>
            <div class="row">  
                <div class="col-md-10">
		<h3 class="mb-4 font-weight-light">Traceability Coverage</h3>
                </div>
                <div class="col-md-2 text-right">
                        <button class="btn btn-step m-3 dropdown-toggle" type="button" id="dropdownActionButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Add
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownActionButton">
                    <a class="dropdown-item" href="javascript:void(0)" data-toggle="modal" data-target="#testcasemodal" id="addTestcase"  > Testcases</a>
                    <a class="dropdown-item" href="javascript:void(0)" data-toggle="modal" data-target="#defectmodal"  id="addDefecte">Defect</a>
                    </div>
                </div>
            </div>

            <div class="default-tab">
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Testcase</a>
                        <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Defects</a>
                    </div>
                </nav>
                <div class="tab-content pl-3 pt-2" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                            <table id="rtmtcTbl" class="table compact " style="width:100%;">
                                <thead  class="bg-step text-white">
                                    <tr align="left">
                                    <th class="notexport">Id</th>  
                                    <th>Module</th>  
                                    <th>Test Scenario ID</th> 
                                    <th>Testcase ID</th> 
                                    <th class="notexport">Testcase ID</th> 
                                    <th>TC Description</th>
                                    <th>Test Result</th>
                                    <th  class="notexport">Actual Result</th>
                                    <th>Iteration</th>
                                    <th>Action</th>
                                    </tr> 
                                </thead>
                                
                            </table>
                    </div>
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                        <table id="rtmdefectTbl" class="table compact " style="width:100%;">
                                <thead  class="bg-step text-white">
                                    <tr  align="left">
                                    <th class="notexport">Id</th>  
                                    <th>Module</th>
                                    <th>Sub Module</th>
                                    <th>Defect ID</th>
                                    <th class="notexport">Defect ID</th>
                                    <th>Testcase ID</th>
                                    <th>Description</th>
                                    <th>Type</th> 
                                    <th>Status</th> 
                                    <th>Severity</th> 
                                    <th>Priority</th> 
                                    <th>Action</th>
                                    </tr> 
                                </thead>
                                
                            </table>
                    </div>
                </div>

            </div>
        </div>

    </div>

    <div class="modal fade" id="testcasemodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Add Test Cases</h5>
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
                                            <th>TC Description</th>
                                            <th>TS Description</th>
                                            <th>Steps</th> 
                                            <th>Expected Result</th> 
                                            <th>Pre-Condition</th> 
                                            <th>Test Data</th> 
                                            </tr> 
                                        </thead>
                                    </table>
                                </div>
                            </div>
                            
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-step">Add to RTM</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="defectmodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Testcase</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="defectform" method="post" class="form-horizontal">
                    <div class="modal-body">
                        
                            <div class="row form-group">
                                <div class="col-3">
                                    <div class="form-group">
                                        <label for="filter_defectmodule" class=" form-control-label">Module : </label>

                                        <select class="selectpicker form-control" id="filter_defectmodule" name="filter_defectmodule"  data-live-search="true" title="Select module" data-hide-disabled="true"></select>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="form-group">
                                        <label for="filter_defectId" class=" form-control-label">Defect ID : </label>

                                        <select class="selectpicker form-control" id="filter_defectId" name="filter_defectId"  data-live-search="true" title="Select defect" data-hide-disabled="true"></select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row form-group">
                                <div class="col-12">
                                    <table id="defectTbl" class="table compact " style="width:100%;">
                                        <thead  class="bg-step text-white">
                                            <tr>
                                            <th class="notexport">
                                                <div class="custom-control custom-checkbox">
                                                    <input type="checkbox" class="custom-control-input" id="defect_select_all">
                                                    <label class="custom-control-label" for="defect_select_all">&nbsp;</label>
                                                </div>
                                            </th>
                                            
                                            <th>Project</th>
                                            <th>Release ID</th>
                                            <th>Module</th>
                                            <th>Sub Module</th>
                                            <th>Defect ID</th>
                                            <th>Testcase ID</th>
                                            <th>Description</th>
                                            <th>Type</th> 
                                            <th>Status</th> 
                                            <th>Severity</th> 
                                            <th>Priority</th> 
                                            <th>Created at</th> 
                                            <th>Updated at</th> 
                                            <th class="notexport">Attachments</th>  
                                            <th class="notexport">Action</th>
                                        </tr> 
                                        </thead>
                                    </table>
                                </div>
                            </div>
                            
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-step">Add to RTM</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <?php include(STEP_dir.'master/rtm_form.php'); ?>
    <?php include(STEP_dir.'master/testcasedetailsmodal.php'); ?>
    <?php include(STEP_dir.'master/defectdetailsmodal.php'); ?>
    <?php include(STEP_dir.'js.php'); ?>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/rtmtestcase-init.js"></script>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/rtm-init.js"></script>

    

</body>

</html>
