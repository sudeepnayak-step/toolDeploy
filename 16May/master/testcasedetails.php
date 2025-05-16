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
                        <h1 class=" font-weight-bold">Test Case Details</h1>
                    </div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="page-header float-left">
                    <div class="page-title">
                        <ol class="breadcrumb text-left">
                            <li><a href="<?php echo STEP_root; ?>index.php">Dashboard</a></li>                
                            <li><a href="<?php echo STEP_root; ?>testmanagement.php">Test Management</a></li>
                            <li><a href="<?php echo STEP_root; ?>master/testcasenew.php">Test Case</a></li>
                            <li class="active">Test Case Details</li>
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
                    <span class="card-title" id="testcasenumtxt"></span>
                </div>
                <div class="card-body">
                    <div class="row form-group">
                        <p class="col-md-4" id="projecttxt"></p>
                        <p class="col-md-4" id="releasetxt"></p>
                        <p class="col-md-4" id="testtypetext"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-4" id="testscenarionumtxt"></p>
                        <p class="col-md-4" id="moduletxt"></p>
                        <p class="col-md-4" id="submoduletxt"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-4" id="reviewertxt"></p>
                        <p class="col-md-4" id="modetxt"></p>
                        <p class="col-md-4" id="categorytxt"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-6" id="testscenariodesctxt"></p>
                        <p class="col-md-6" id="testcasedesctxt"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-6" id="precondtxt"></p>
                        <p class="col-md-6" id="testdatatxt"></p>
                    </div>
		    <div class="row form-group">
                        <p class="col-md-6" id="commenttxt"></p>
                    </div>
                </div>
            </div>
               
            <div class="row"> 
                <div class="col-md-12 text-right">
                    <button type="button" class="btn btn-step m-3" id="addTestcase" data-toggle="modal" data-target="#stepmodal"><i class="fa fa-plus"></i> Add Steps</button>
                </div>
            </div>

            <table id="stepsTbl" class="table compact " style="width:100%;">
                <thead  class="bg-step text-white">
                    <tr align="left">
                    <th class="notexport">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="select_all">
                            <label class="custom-control-label" for="select_all">&nbsp;</label>
                        </div>
                    </th> 
                    <th>Step No</th>
                    <th>Steps</th>  
                    <th>Expected Result</th> 
                    <th class="notexport">Action</th>
                    </tr> 
                </thead>
                
            </table>
        </div>

    </div>
    <?php include(STEP_dir.'master/step_form.php'); ?>
    <?php include(STEP_dir.'master/testcase_form.php'); ?>
    <?php include(STEP_dir.'js.php'); ?>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/testcasedetails-init.js"></script>

    

</body>

</html>
