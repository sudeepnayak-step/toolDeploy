<?php
include('../config.php');
include('../chksession.php');
$activetab = "defectActive";
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
            <div class="col-sm-4">
                <div class="page-header float-left">
                    <div class="page-title">
                        <h1>Defects Management</h1>
                    </div>
                </div>
            </div>
            <div class="col-sm-8">
                <div class="page-header float-right">
                    <div class="page-title">
                        <ol class="breadcrumb text-right">
                            <li><a href="<?php echo STEP_root; ?>index.php">Dashboard</a></li>
                            <li><a href="<?php echo STEP_root; ?>master/defects.php">Defect Management</a></li>
                            <li class="active">Defect Details</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="container" >
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
                    <span class="card-title" id="defectnumtxt"></span>
                </div>
                <div class="card-body">
                    <div class="row form-group">
                        <p class="col-md-4" id="projecttxt"></p>
                        <p class="col-md-4" id="releasetxt"></p>
                        <p class="col-md-4" id="testcasetxt"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-4" id="moduletxt"></p>
                        <p class="col-md-4" id="submoduletxt"></p>
                        <p class="col-md-4" id="defecttypetxt"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-4" id="severitytxt"></p>
                        <p class="col-md-4" id="prioritytxt"></p>
                        <p class="col-md-4" id="defectstatustxt"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-6" id="shortdesctxt"></p>
                        <p class="col-md-6" id="longdesctxt"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-6" id="testdatetxt"></p>
                        <p class="col-md-6" id="steptxt"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-6" id="expectedtxt"></p>
                        <p class="col-md-6" id="actualtxt"></p>
                    </div>
                    <div class="row form-group">
			<p class="col-md-6" id="environmenttxt"></p>
                        <p class="col-md-6" id="assignmenttxt"></p>
                    </div>
                    <div class="row form-group">
                        <p class="col-md-6" id="createdattxt"></p>
                        <p class="col-md-6" id="updatedtxt"></p>
                    </div>
                </div>
            </div>

            <h6 id="defectattachmentsheader" class="hidden">Attachments</h6>
            <br/>
            <div class="row form-group" id="defectattachments"></div>
            <div class="row form-group ">
                <div class="col-md-4" ></div>
            </div>

            <hr>
            <div class="container py-2">
                <div class="row">
                    <div class="comments col-md-9" >
                        <h3 class="mb-4 font-weight-light">Comments</h3>
                        <div id="defectcommentdiv"></div>
                        
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
        </div><!-- .content -->


    </div><!-- /#right-panel -->

                
    <?php include(STEP_dir.'master/defect_form.php'); ?>
    <?php include(STEP_dir.'master/replymodal.php'); ?>

    <?php include(STEP_dir.'js.php'); ?>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/defect-init.js"></script>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/defectcomment-init.js"></script>

    

</body>

</html>
