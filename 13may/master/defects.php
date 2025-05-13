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
            <div class="col-sm-12">
                <div class="page-header float-left">
                    <div class="page-title">
                        <ol class="breadcrumb text-left">
                            <li><a href="<?php echo STEP_root; ?>index.php">Dashboard</a></li>
                            <li class="active">Defects Management</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        <div class="container" > 
    
            <div class="row ">
                        
                <div class="col-3">
                    <div class="form-group">
                        <label for="tblfilterprojectId" class=" form-control-label font-weight-bold">Project : </label>

                        <select class="selectpicker form-control" id="tblfilterprojectId" name="tblfilterprojectId[]"  data-live-search="true" title="Select Project" data-hide-disabled="true"   multiple data-actions-box="true"></select>
                    </div>
                </div>
                
                <div class="col-3">
                    <div class="form-group">
                        <label for="tblfilterreleaseId" class=" form-control-label font-weight-bold">Release : </label>

                        <select class="selectpicker form-control" id="tblfilterreleaseId" name="tblfilterreleaseId[]"  data-live-search="true" title="Select Release" data-hide-disabled="true"  multiple data-actions-box="true"></select>
                    </div>
                </div>
                <div class="col-3 ">
                    <div class="form-group">
                        <label for="tblfilterdefectId" class=" form-control-label font-weight-bold">Defect ID : </label>

                        <select class="selectpicker form-control" id="tblfilterdefectId" name="tblfilterdefectId[]"  data-live-search="true" title="Select Defect" data-hide-disabled="true"  multiple data-actions-box="true"></select>
                    </div>
                </div>
                <div class="col-3 ">
                    <div class="form-group">
                        <label for="tblfilterstatusId" class=" form-control-label font-weight-bold">Defect Status : </label>
                        
                        <select class="selectpicker form-control" id="tblfilterstatusId" name="tblfilterstatusId[]"  data-live-search="true" title="Select Defect Status" data-hide-disabled="true"  multiple data-actions-box="true"></select>
                    </div>
                </div>
            </div>
            <div class="row "> 
                <div class="col-md-12 text-right">
                    <button type="button" class="btn btn-danger btn-sm mb-2" id="resetFilter"><i class="fa fa-refresh"></i>&nbsp; Reset</button>
                    
                </div>
            </div>              
            <hr>
            <div class="row mb-3">   

                <div class="col-md-2">

                <?php 
                if((isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin") || (isset($_SESSION["ruleIds"]) && in_array("26", explode(",", $_SESSION["ruleIds"])))){ ?>
                    
                    <button type="button" class="btn btn-step" id="addDefect" data-toggle="modal" data-target="#defectmodal"> Add Defect <i class="fa fa-plus"></i></button>

                <?php } ?>
                </div>

                <div class="col-md-8 text-left "  id="exportButtonsContainer"></div>
                <div class="col-md-2 text-right">
                    <button class="btn btn-step dropdown-toggle" type="button" id="dropdownActionButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Bulk Action
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownActionButton">
                    <a class="dropdown-item" href="javascript:void(0)" data-toggle="modal" data-target="#uploadmodal"  data-type="Upload">Upload Defect</a>
                    <a class="dropdown-item" href="<?php echo STEP_root; ?>api/DownloadSample.php?type=Defect"  target="_blank" data-type="Download">Download Sample Format</a>
                    </div>
                </div>
            </div>

            <div class="col-md-12" id="errmsg">
            </div>
            
            <table id="defectTbl" class="table compact nowrap border" style="width:100%;">
                <thead  class="bg-step text-white">
                    <tr>
                    <th class="notexport">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="select_all">
                            <label class="custom-control-label" for="select_all">&nbsp;</label>
                        </div>
                    </th>
                    <th>Project</th>
                    <th>Release ID</th>
                    <th>Module</th>
                    <th>Sub Module</th>
                    <th>Defect ID</th>
                    <th>Testcase ID</th>
                    <th>Description</th>
                    <th>Long Description</th>
                    <th>Test Data</th>
                    <th>Steps</th>
                    <th>Expected Result</th>
                    <th>Actual Result</th>
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
    <div class="modal fade" id="uploadmodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Upload Defect</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="uploadform" method="post" action="/" class="form-horizontal"  enctype="multipart/form-data">
                    <div class="modal-body">
                        
                            <div class="row form-group">
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="upload_projectId" class=" form-control-label">Project : </label>

                                        <select class="selectpicker form-control" id="upload_projectId" name="projectId"  data-live-search="true" title="Select project" data-hide-disabled="true" onchange="getRelease(this)"></select>
                                    </div>
                                </div>
                                
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="upload_releaseId" class=" form-control-label">Release : </label>

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
                
    <?php include(STEP_dir.'master/defect_form.php'); ?>

    <?php include(STEP_dir.'js.php'); ?>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/defect-init.js?v=1"></script>

    

</body>

</html>
