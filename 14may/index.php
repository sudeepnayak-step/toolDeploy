<?php
include('config.php');
include('chksession.php');
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
            <div class="col-sm-12">
                <div class="page-header float-left">
                    <div class="page-title">
                        <ol class="breadcrumb text-left">
                            <li><a href="<?php echo STEP_root; ?>index.php">Dashboard</a></li>                
                            <li class="active">Overview</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        <div class="content mt-3">
            <ul class="nav nav-tabs  nav-pills md-tabs indigo " id="myTabJust" role="tablist" style="border: 0 !important;">
              <li class="nav-item">
                <a class="nav-link active" id="home-tab-just" data-toggle="tab" href="#summary-just" role="tab" aria-controls="home-just"
                  aria-selected="true">Overall Summary</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" id="profile-tab-just" data-toggle="tab" href="#execution-just" role="tab" aria-controls="profile-just"
                  aria-selected="false">Test Execution</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" id="contact-tab-just" data-toggle="tab" href="#defect-just" role="tab" aria-controls="contact-just"
                  aria-selected="false">Defect</a>
              </li>

              <li class="nav-item">
                <a class="nav-link" id="dsrdash-tab-just" data-toggle="tab" href="#dsr-just" role="tab" aria-controls="dsrdash-just"
                  aria-selected="false">DSR</a>
              </li>
            </ul>
            <div class="tab-content  pt-5" id="myTabContentJust">
                <div class="tab-pane fade" id="dsr-just" role="tabpanel" aria-labelledby="dsrdash-tab-just">

                    <div class="container" style="margin-top: -25px;">
                        <div class="row "> 
                            <div class="col-md-12 text-right">
                               <button type="button" class="btn btn-step btn-sm mb-2" id="resetDSRFilter"><i class="fa fa-refresh"></i>&nbsp; Reset</button>
                            </div>
                        </div>

                        <form id="dsrform" method="post" class="form-horizontal"> 
                            <div class="row ">
                                
                                <div class="col-3">
                                    <div class="form-group">
                                        <label for="dsrprojectId" class=" form-control-label font-weight-bold">Project : </label>

                                        <select class="selectpicker form-control" id="dsrprojectId" name="dsrprojectId"  data-live-search="true" title="Select Project" data-hide-disabled="true"   data-actions-box="true"></select>
                                    </div>
                                </div>
                                
                                <div class="col-3">
                                    <div class="form-group">
                                        <label for="dsrreleaseId" class=" form-control-label font-weight-bold">Release : </label>

                                        <select class="selectpicker form-control" id="dsrreleaseId" name="dsrreleaseId"  data-live-search="true" title="Select Release" data-hide-disabled="true"  data-actions-box="true"></select>
                                    </div>
                                </div>
                                <div class="col-3 hidden">
                                    <div class="form-group">
                                        <label for="dsractivityId" class=" form-control-label font-weight-bold">Activity : </label>

                                        <select class="selectpicker form-control" id="dsractivityId" name="dsractivityId[]"  data-live-search="true" title="Select Activity" data-hide-disabled="true"  multiple data-actions-box="true"></select>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="form-group">
                                        <label for="dsrdate" class=" form-control-label font-weight-bold">Date : </label>
                                        <div class=" input-group">
                                            <input type="text" id="dsrdate" name="dsrdate" placeholder="dd/mm/yyyy"  value="<?php echo date("d/m/Y");?>" data-today="<?php echo date("d/m/Y");?>"  class="form-control datepicker" readonly="">
                                            <label class="input-group-addon btn" for="dsrdate">
                                               <span class="fa fa-calendar"></span>
                                            </label>                    
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row "> 
                                <div class="col-md-12 text-left">
                                   <button type="submit" class="btn btn-step btn-sm mb-2" id="applyDSRFilter"><i class="fa fa-filter"></i>&nbsp; Filter</button>
                                </div>
                            </div>
                        </form> 
                        <hr>
                        <div id="notificationdiv" ></div>
                        <div id="dsrdiv" class="hidden">

                            <input type="hidden" id="projectclient" name="projectclient" placeholder="Enter release name" value="0" class="form-control projectclient">
                            <div class="row">
                                <div class="col-md-12 text-right">
                                   <!-- <button type="submit" class="btn btn-step btn-sm mb-2" id="sendDSR"><i class="fa fa-email"></i>&nbsp; Send Email</button> -->
                                   <button type="button" class="btn btn-step m-3" id="downloadDSR" ><i class="fa fa-download"></i>&nbsp; Download</button>
                                   <button type="button" class="btn btn-step m-3" id="sendDSR" data-toggle="modal" data-target="#sendDSRmodal">Send Email</button>
                                </div>

                            </div>
                            <div class="row">

                                <div class="col-12">
                                    <table id="dstTbl1" class="table  nowrap border" >
                                        <thead class="bg-step text-white">
                                            <tr>
                                                <th colspan="3" class="text-center "><big>Daily Status Report</big></th> 
                                            </tr>
                                            <tr class="bg-white">
                                                <th colspan="3" class="text-center"></th> 
                                            </tr>  
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="row mt-4">

                                <div class="col-12">
                                    <table id="dsrriskissueTbl" class="table  compact table-bordered"  width="100%">

                                        <thead  class="bg-step text-white">
                                            <tr>
                                            <th colspan="10" class="text-center"><big>Executive Summary</big></th> 
                                            </tr>
                                            <tr class="bg-white">
                                            <th colspan="10" class="text-center"></th> 
                                            </tr>
                                            <tr>
                                                <th colspan="5">
                                                    <div class="form-group">
                                                        <label for="dsroverallsummery" class=" form-control-label">Overall Summary : </label>
                                                        <textarea  class="form-control" name="dsroverallsummery" id="dsroverallsummery" rows="4"></textarea>
                                                    </div>
                                                </th> 
                                                <th colspan="5" >                                              
                                                     <div class="form-group">
                                                        <label for="dsrprodlosssummery" class=" form-control-label">Productivity Loss Summary : </label>
                                                        <textarea  class="form-control" name="dsrprodlosssummery" id="dsrprodlosssummery" rows="4"></textarea>
                                                    </div>
                                                </th> 
                                            </tr>
                                            <tr>
                                            <th colspan="10" class="text-center">Risk / Issue : </th> 
                                            </tr> 
                                            <tr>
                                            <th>Sr. No.</th> 
                                            <th>Description</th> 
                                            <th>Status</th> 
                                            <th>Activity</th> 
                                            <th>Type</th> 
                                            <th>Action</th> 
                                            <!-- <th>Action/<br/>Mitigation<br/>Plans</th>  -->
                                            <th>Impact</th>
                                            <th>Actionable</th> 
                                            <th>Raised By</th> 
                                            <th>Raised Date</th> 
                                            </tr> 
                                        </thead>
                                    </table>
                                </div>
                            </div>
                            

                            <!-- ///////////////// -->
                            <div class="row mt-4" >
                                <div class="col-12">
                                    <table class="table  compact  nowrap border"  width="100%">
                                        <thead  class="bg-step text-white">
                                            <tr>
                                            <th  class="text-center"><big>Activity Status Updates</big></th> 
                                            </tr> 
                                             <tr  class="bg-white">
                                            <th  id="dsrtestexecutionChartdiv"></th> 
                                            </tr> 
                                        </thead>
                                    </table>
                                </div>
                                <div class="col-12">
                                    <table id="dsrtestplanTbl" class="table  compact  nowrap border"  width="100%">
                                        <thead  class="bg-step text-white">
                                            <tr>
                                                <th>Activity Name</th>
                                                <th>Status</th> 
                                                <th>Activity completion %</th> 
                                                <th>Plan Start Date</th> 
                                                <th>Plan End Date</th>
                                                <th>Revised Start Date</th> 
                                                <th>Revised End Date</th>
                                                <th>Actual Start Date</th> 
                                                <th>Actual End Date</th>                
                                                <th>Remark</th> 
                                            </tr> 
                                        </thead>
                                    </table>
                                </div>
                            </div>
                            <!-- ////////////// -->

                            <div class="row mt-4">

                                <div class="col-12">
                                    <a href="javascript:void(0)" class="pull-right text-step" id="dsrtestexec_visibility" data-status="1" data-div="dsrtestexecDiv" >Hide Execution Summary</a>
                                </div>
                            </div>
                            <div class="row mt-4" id="dsrtestexecDiv">
                                <div class="col-12">
                                    <table class="table  compact  nowrap border"  width="100%">
                                        <thead  class="bg-step text-white">
                                            <tr>
                                            <th  class="text-center"><big>Test Execution Summary</big></th> 
                                            </tr> 
                                             <tr  class="bg-white">
                                            <th  id="dsrtestexecutionChartdiv"></th> 
                                            </tr> 
                                        </thead>
                                    </table>
                                </div>

                                <!-- <div class="row" id="dsrtestexecutionChartdiv"></div> -->
                                <!-- <h4 class="col-12 font-weight-bold ml-3 mr-3 mt-3 bg-step">TestExecution Summary : </h4> -->
                                <div class="col-12">
                                    <table id="dsrtestexesummaryTbl" class="table  compact  nowrap border"  width="100%">
                                        <thead  class="bg-step text-white">
                                            <!-- <tr>
                                            <th colspan="22" class="text-center">Test Execution Summary : </th> 
                                            </tr> -->
                                            <!--  <tr  class="bg-white">
                                            <th colspan="22" id="dsrtestexecutionChartdiv"></th> 
                                            </tr>  -->
                                            <tr>
                                            <th>Module Name</th>
                                            <th>Total Created TC</th>
                                            <th>Executable Test Cases</th>
                                            <th>Total Executed</th>
                                            <th>Iteration</th> 
                                            <th>Passed</th>
                                            <th>Failed</th>
                                            <th>In Progress</th>
                                            <th>No Run</th>
                                            <th>Blocked</th>
                                            <th>Deferred</th>
                                            <th>NA</th>
                                            <th>On Hold</th>
                                            <th>% Executed</th>
                                            <th>Passed Rate %</th>
                                            <th>Failed Rate %</th>
                                            <th>% In Progress</th>
                                            <th>% No Run</th>
                                            <th>% Blocked</th>
                                            <th>% On Hold</th>
                                            <th>% Deferred</th>
                                            <th>% NA</th>                                        
                                            </tr> 
                                        </thead>

                                        <tfoot>
                                            <tr class="bg-step  text-white text-center">
                                                <th>Grand Total</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            
                            <div class="row mt-4">
                                <div class="col-12">
                                    <table id="dsrdefectTbl" class="table  compact  nowrap border"  width="100%">
                                        <thead  class="bg-step text-white">
                                            <tr>
                                            <th colspan="10" class="text-center"><big>Defect Details</big></th> 
                                            </tr>
                                            <tr class="bg-white ">
                                            <th colspan="10" class="text-center" id="dsrDefectChartdiv">
                                                    <div class="col-sm-6"  id="dsrchartAgeing" style="height: 370px; padding-bottom:  20px; " ></div>
                                            </th> 
                                            </tr>   
                                            <tr class="defecttr">
                                            <th>Defect ID</th>
                                            <th>Defect ID</th>
                                            <th>Defect Description</th>
                                            <th>Defect Status</th>
                                            <th>Severity</th> 
                                            <th>Priority</th>
                                            <th>Reported By</th>
                                            <th>Assigned To</th>
                                            <th>No. of TCs Impacted</th>
                                            <th>Defect Ageing (In days)</th>                                      
                                            </tr> 
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              
                <div class="tab-pane fade show active" id="summary-just" role="tabpanel" aria-labelledby="home-tab-just">

                    <div class="container ">
                        <div class="row" >
                            <div class="col-3">
                                <div class="card  bg-flat-color text-center">
                                    <div class="card-body ">                                    
                                       <!-- <p>Total Project</p>-->
                                        <h3 class="mb-2 text-center">
                                            <span  id="totalprojcount" style="font-weight: bold;">-</span>
                                        </h3>
					<p >Total Project</p>
                                    </div>

                                </div>
                            </div>
                            <div class="col-3">
                                <div class="card  bg-flat-color text-center">
                                    <div class="card-body">
                                        <!-- <p>Total Testcases Executed</p> -->
                                        <h3 class="mb-2 text-center">
                                            <span  id="tottestexecute" style="font-weight: bold;">-</span>
                                        </h3>
					<p>Total Testcases Executed</p>
                                    </div>

                                </div>
                            </div>
                
                            <div class="col-3">
                                <div class="card  bg-flat-color text-center">
                                    <div class="card-body">
                                        
                                        <!-- <p>Total Raised Defects</p> -->
                                        <h3 class="mb-2 text-center">
                                            <span  id="raiseddefectcount" style="font-weight: bold;">-</span>
                                        </h3>
					<p>Total Raised Defects</p>

                                    </div>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="card bg-flat-color text-center">
                                    <div class="card-body ">
                                        
                                        <!-- <p >Total Milestone Achieved</p> -->
                                        <h3 class="mb-2 text-center">
                                            <span id="totmilestone" style="font-weight: bold;">-</span>
                                        </h3>
					<p >Total Milestone Achieved</p>

                                    </div>
                                </div>
                            </div>
                            
                        </div>
                
                        <div class="row" id="ProjectChartdiv"></div>
                        
                        <div class="container" >
                            <table id="projectTbl" class="table compact  nowrap border" style="width:100%;">
                                    <thead  class="bg-step text-white" id="filters">
                                        <tr>
                                        <th>
                                            <div class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" id="select_all">
                                                <label class="custom-control-label" for="select_all">&nbsp;</label>
                                            </div>
                                        </th>
                                        <th>Project Name</th>
                                        <th>Project Code</th>
                                        <th>RAG Status</th> 
                                        <th>Members</th> 
                                        <th>Status</th> 
                                        <th>Plan Start Date</th> 
                                        <th>Plan End Date</th>
                                        <th>Revised Start Date</th> 
                                        <th>Revised End Date</th>
                                        <th>Actual Start Date</th> 
                                        <th>Actual End Date</th> 
                                        <th>Owner</th>  
                                        <th>Client</th>  
                                        <th>Description</th>  
                                        <th class="notexport">Documents</th>  
                                        <th>Active Status</th> 
                                        <th class="notexport">Action</th> 
                                        </tr> 
                                    </thead>
                                </table>
                            </div>
                    
                    </div>
                        

                </div>
              
                <div class="tab-pane fade" id="execution-just" role="tabpanel" aria-labelledby="profile-tab-just">
                
                    <div class="container " style="margin-top: -25px;">
                        <form id="filtertestcaseform" method="post" class="form-horizontal">

                            <div class="row "> 
                                <div class="col-md-12 text-right">
                                <button type="button" class="btn btn-step btn-sm mb-2" id="resetTestexeFilter"><i class="fa fa-refresh"></i>&nbsp; Reset</button>
                                </div>
                            </div> 
                            <div class="row ">
                                
                                <div class="col-3">
                                    <div class="form-group">
                                        <label for="projectId" class=" form-control-label font-weight-bold">Project : </label>

                                        <select class="selectpicker form-control" id="projectId" name="projectId[]" multiple data-live-search="true" title="Select Project" data-hide-disabled="true" multiple data-actions-box="true"></select>
                                    </div>
                                </div>
                                
                                <div class="col-3">
                                    <div class="form-group">
                                        <label for="releaseId" class=" form-control-label font-weight-bold">Release : </label>

                                        <select class="selectpicker form-control" id="releaseId" name="releaseId[]" multiple data-live-search="true" title="Select Release" data-hide-disabled="true" multiple data-actions-box="true"></select>
                                    </div>
                                </div>
                                <div class="col-3 hidden">
                                    <div class="form-group">
                                        <label for="activityId" class=" form-control-label font-weight-bold">Activity : </label>

                                        <select class="selectpicker form-control" id="activityId" name="activityId[]" multiple data-live-search="true" title="Select Activity" data-hide-disabled="true" multiple data-actions-box="true"></select>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="form-group">
                                        <label for="testsuiteId" class=" form-control-label font-weight-bold">Testsuite ID : </label>

                                        <select class="selectpicker form-control" id="testsuiteId" name="testsuiteId[]" multiple data-live-search="true" title="Select Testsuite" data-hide-disabled="true" multiple data-actions-box="true"></select>
                                    </div>
                                </div>
                                <div class="col-3 hidden">
                                    <div class="form-group">
                                        <label for="testcasedate" class=" form-control-label font-weight-bold">Date : </label>
                                        <div class=" input-group">
                                            <input type="text" id="testcasedate" name="testcasedate" placeholder="dd/mm/yyyy"  value="<?php echo date("d/m/Y");?>" class="form-control datepicker" readonly="">
                                            <label class="input-group-addon btn" for="testcasedate">
                                            <span class="fa fa-calendar"></span>
                                            </label>                    
                                        </div>
                                    </div>
                        
                                </div>
                            </div>                        
                        </form>
			<div class="row" >
                                <div class="col-3">
                                    <div class="card  bg-flat-color text-center">
                                        <div class="card-body ">
                                            <h3 class="mb-2 text-center">
                                                <span  id="total_testcase" style="font-weight: bold;">-</span>
                                            </h3>
                                            <p >Total Testcase</p>
                                        </div>

                                    </div>
                                </div>
				<div class="col-3">
                                    <div class="card  bg-flat-color text-center">
                                        <div class="card-body ">
                                            <h3 class="mb-2 text-center">
                                                <span  id="passtc" style="font-weight: bold;">-</span>
                                            </h3>
                                            <p >Total Passed</p>
                                        </div>

                                    </div>
                                </div>
				<div class="col-3">
                                    <div class="card  bg-flat-color text-center">
                                        <div class="card-body ">
                                            <h3 class="mb-2 text-center">
                                                <span  id="failedtc" style="font-weight: bold;">-</span>
                                            </h3>
                                            <p >Total Failed</p>
                                        </div>

                                    </div>
                                </div>
				<div class="col-3">
                                    <div class="card  bg-flat-color text-center">
                                        <div class="card-body ">
                                            <h3 class="mb-2 text-center">
                                                <span  id="inprogresstc" style="font-weight: bold;">-</span>
                                            </h3>
                                            <p >In Progress</p>
                                        </div>

                                    </div>
                                </div>
			</div>
                        <div id="executionnotificationdiv" class="">
                            <div class="col-12 alert alert-warning alert-dismissible fade show" role="alert">Use the filters above to drill down into project-specific test
 execution data.
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                        <div class="row executionfilter hidden" id="testexecutionChartdiv"></div>

                        <div class="container executionfilter hidden  mt-3" >
                           <!-- <div class="row">
                                <div class="col-12"> -->
                                    <table id="testexesummaryTbl" class="table  compact  nowrap border"  width="100%">
                                        <thead  class="bg-step text-white">
                                            <tr>
                                            <th>Module Name</th>
                                            <th>Total Created TC</th>
                                            <th>Executable Test Cases</th>
                                            <th>Total Executed</th>
                                            <th>Iteration</th> 
                                            <th>Passed</th>
                                            <th>Failed</th>
                                            <th>In Progress</th>
                                            <th>No Run</th>
                                            <th>Blocked</th>
                                            <th>Deferred</th>
                                            <th>NA</th>
                                            <th>On Hold</th>
                                            <th>% Executed</th>
                                            <th>Passed Rate %</th>
                                            <th>Failed Rate %</th>
                                            <th>% In Progress</th>
                                            <th>% No Run</th>
                                            <th>% Blocked</th>
                                            <th>% On Hold</th>
                                            <th>% Deferred</th>
                                            <th>% NA</th>                                        
                                            </tr> 
                                        </thead>
                                        <tfoot>
                                            <tr class="bg-step  text-white text-center">
                                                <th>Grand Total</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                                <th>0</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                <!--</div>
                            </div>-->
                        </div>
                    </div>
                </div>

                <div class="tab-pane fade" id="defect-just" role="tabpanel" aria-labelledby="contact-tab-just">
                    <div class="container " style="margin-top: -25px;">
                    
                        <div class="row "> 
                            <div class="col-md-12 text-right">
                               <button type="button" class="btn btn-step btn-sm mb-2" id="resetDefectFilter"><i class="fa fa-refresh"></i>&nbsp; Reset</button>
  
                            </div>
                        </div> 
                        <div class="row ">
                            
                            <div class="col-3">
                                <div class="form-group">
                                    <label for="defectprojectId" class=" form-control-label font-weight-bold">Project : </label>

                                    <select class="selectpicker form-control" id="defectprojectId" name="defectprojectId[]"  data-live-search="true" title="Select Project" data-hide-disabled="true"  multiple data-actions-box="true"></select>
                                </div>
                            </div>
                            
                            <div class="col-3">
                                <div class="form-group">
                                    <label for="defectreleaseId" class=" form-control-label font-weight-bold">Release : </label>

                                    <select class="selectpicker form-control" id="defectreleaseId" name="defectreleaseId[]"  data-live-search="true" title="Select Release" data-hide-disabled="true"  multiple data-actions-box="true"></select>
                                </div>
                            </div>
                            <div class="col-3 hidden">
                                <div class="form-group">
                                    <label for="defectactivityId" class=" form-control-label font-weight-bold">Activity : </label>

                                    <select class="selectpicker form-control" id="defectactivityId" name="defectactivityId[]"  data-live-search="true" title="Select Activity" data-hide-disabled="true"  multiple data-actions-box="true"></select>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="form-group">
                                    <label for="defectdate" class=" form-control-label font-weight-bold">Date : </label>
                                    <div class=" input-group">
                                        <input type="text" id="defectdate" name="defectdate" placeholder="dd/mm/yyyy"  value="<?php echo date("d/m/Y");?>" data-today="<?php echo date("d/m/Y");?>"  class="form-control datepicker" readonly="">
                                        <label class="input-group-addon btn" for="defectdate">
                                           <span class="fa fa-calendar"></span>
                                        </label>                    
                                    </div>
                                </div>
                            </div>
                            <div class="col-3 hidden">
                                <div class="form-group">
                                    <label for="defectstatusId" class=" form-control-label font-weight-bold">Status : </label>
                                    <select class="selectpicker form-control" id="defectstatusId" name="defectstatusId"  data-live-search="true" title="Select Status" data-hide-disabled="true"></select>
                                </div>
                            </div>
                        </div>
                       
			<div class="row" >
	                        <div class="col-3">
	                            <div class="card  bg-flat-color text-center">
	                                <div class="card-body ">
	                                    <h3 class="mb-2 text-center">
	                                        <span  id="total_defects" style="font-weight: bold;">-</span>
	                                    </h3>
	                                    <p >Total Defects</p>
	                                </div>

	                            </div>
	                        </div>
	                        
	                        
	                        <div class="col-3">
	                            <div class="card  bg-flat-color text-center">
	                                <div class="card-body ">
	                                    <h3 class="mb-2 text-center">
	                                        <span  id="open_defects" style="font-weight: bold;">-</span>
	                                    </h3>
	                                    <p >Open Defects</p>
	                                </div>

	                            </div>
	                        </div>
	                        
	                        <div class="col-3">
	                            <div class="card  bg-flat-color text-center">
	                                <div class="card-body ">
	                                    <h3 class="mb-2 text-center">
	                                        <span  id="closed_defects" style="font-weight: bold;">-</span>
	                                    </h3>
	                                    <p >Closed Defects</p>
	                                </div>

	                            </div>
	                        </div>
	                        
	                        <div class="col-3">
	                            <div class="card  bg-flat-color text-center">
	                                <div class="card-body ">
	                                    <h3 class="mb-2 text-center">
	                                        <span  id="critical_defects" style="font-weight: bold;">-</span>
	                                    </h3>
	                                    <p >Critical Defects</p>
	                                </div>

	                            </div>
	                        </div>
	                        
	                    </div>
			
                        <div id="defectnotificationdiv" class="">
                            <div class="col-12 alert alert-warning alert-dismissible fade show" role="alert">Apply project and release filters to see detailed defect ageing, severity, and module-wise charts.
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                        <div class="row defectfilter hidden" id="DefectChartdiv">
                            <div class="col-sm-6"  id="chartAgeing" style="height: 370px; padding-bottom:  20px; " ></div>
                            
                        </div>
                        <div class="container defectfilter hidden" >
                            <table id="topdefectTbl" class="table  compact nowrap border "  width="100%">
                                <thead  class="bg-step text-white">
                                    <tr>
                                    <th>Defect ID</th>
                                    <th>Defect ID</th>
                                    <th>Defect Description</th>
                                    <th>Defect Status</th>
                                    <th>Severity</th> 
                                    <th>Priority</th>
                                    <th>Reported By</th>
                                    <th>Assigned To</th>
                                    <th>No. of TCs Impacted</th>
                                    <th>Defect Ageing (In days)</th>                                      
                                    </tr> 
                                </thead>
                            </table>
                        </div>

                    <?php include(STEP_dir.'master/defectdetailsmodal.php'); ?>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog   modal-xl" role="document"  style="width:60%;">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modelTablebody">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="sendDSRmodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Send Email</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="emailform" method="post" class="form-horizontal">
                    <div class="modal-body">
                        
                        <div class="row form-group">
                            <div class="col-12">
                                <div class="form-group required">
                                    
                                    <label for="sendto" class=" form-control-label">Sent To : </label>
                                    <textarea  class="form-control" name="sendto" id="sendto" rows="2"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">

                            <div class="col-12">
                                <div class="form-group">
                                    <label for="cc" class=" form-control-label">CC : </label>
                                    <textarea  class="form-control" name="cc" id="cc" rows="2"></textarea>
                                </div>
                            </div>

                        </div>
                        <div class="row form-group">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="bcc" class=" form-control-label">BCC : </label>
                                    <textarea  class="form-control" name="bcc" id="bcc" rows="2"></textarea>
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
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/dashboard-init.js"></script>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/resetpassword-init.js"></script>

</body>

</html>
