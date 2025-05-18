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
                        <ol class="breadcrumb text-left">
                            <li><a href="<?php echo STEP_root; ?>index.php">Dashboard</a></li>                
                            <li><a href="<?php echo STEP_root; ?>testmanagement.php">Test Management</a></li>
                            <li class="active">Requirement</li>
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
                <div class="row">
                            
                    <div class="col-3">
                        <div class="form-group">
                            <label for="tblfilterprojectId" class=" form-control-label font-weight-bold">Project : </label>

                            <select class="selectpicker form-control" id="tblfilterprojectId" name="tblfilterprojectId[]"  data-live-search="true" title="Select Project" data-hide-disabled="true" multiple data-actions-box="true"></select>
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
                            <label for="tblfilterrtmId" class=" form-control-label font-weight-bold">Requirement ID : </label>

                            <select class="selectpicker form-control" id="tblfilterrtmId" name="tblfilterrtmId[]"  data-live-search="true" title="Select Requirement" data-hide-disabled="true" multiple data-actions-box="true"></select>
                        </div>
                    </div>

                    <div class="col-">
                        <div class="form-group">
                            <label for="tblfilterstatus" class=" form-control-label font-weight-bold">Status : </label>
                              <select class="form-control" id="tblfilterstatus" name="tblfilterstatus[]"  data-live-search="true" title="Select Status" data-hide-disabled="true"  multiple data-actions-box="true">                                
<!--                                <option value="Pending"  data-content="<span class='badge badge-warning'>Pending</span>">Pending</option>
                                <option value="In Progress" data-content="<span class='badge badge-primary'>In Progress</span>">In Progress</option>
                                <option value="Pass" data-content="<span class='badge badge-success'>Pass</span>">Pass</option>
                                <option value="Fail" data-content="<span class='badge badge-danger'>Fail</span>">Fail</option>-->
				<option value="Proposed"  data-content="<span class='badge badge-warning'>Proposed</span>">Proposed</option>
                                        <option value="Approved" data-content="<span class='badge badge-info'>Approved</span>">Approved</option>
                                        <option value="In Progress" data-content="<span class='badge badge-primary'>In Progress</span>">In Progress</option>
                                        <option value="Completed" data-content="<span class='badge badge-success'>Completed</span>">Completed</option>
                              </select>
                        </div>
                    </div> 
                </div>
                <hr>
		<div class="row mb-3"> 
                    <div class="col-md-4 text-left"  id="exportButtonsContainer" >
                    </div>
                    <div class="col-md-4"></div>
                <?php 
                if((isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin") || (isset($_SESSION["ruleIds"]) && in_array("22", explode(",", $_SESSION["ruleIds"])))){ ?>
                    <div class="col-md-4 text-right">
                        <button type="button" class="btn btn-step " id="addRTM" data-toggle="modal" data-target="#rtmmodal"><i class="fa fa-plus"></i> ADD</button>

                    </div>
            <?php } ?>
		</div>
                
            <table id="rtmTbl" class="table compact nowrap border " style="width:100%;">
                <thead  class="bg-step text-white">
                    <tr align="left">
                    <th>
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="select_all">
                            <label class="custom-control-label" for="select_all">&nbsp;</label>
                        </div>
                    </th>
                    <th>Requirement ID</th> 
                    <th>Project</th> 
                    <th>Release</th>
		   <th>Module</th>
		   <th>Summary</th>
                    <th>Description</th> 
                    <th>Status</th>  
                    <th>Author</th> 
                    <th>Reviewer</th> 
                    <th>Created at</th> 
                    <th class="notexport">Action</th> 
                    </tr> 
                </thead>
            </table>
        </div>
    </div>
    
    <div class="modal fade" id="rtmmodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">Requirement</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="rtmform" method="post" class="form-horizontal">
                    <div class="modal-body">
                        
                            <div class="col-sm-12">
                                <div class="alert  alert-info alert-dismissible fade show" role="alert">
                                    <span class="badge badge-pill badge-info">Information</span> Release is based on project selection.
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-4 " style="display: none;">
                                    <div class="form-group">
                                        <label for="rtmId" class=" form-control-label">RTM ID : </label>
                                        <input type="text" id="rtmId" name="rtmId" placeholder="Enter activity name" value="0" class="form-control">
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="projectId" class=" form-control-label">Project : </label>

                                        <select class="selectpicker form-control" id="projectId" name="projectId" data-exist=""  data-live-search="true" title="Select project" data-hide-disabled="true" onchange="getRelease(this)"></select>
                                    </div>
                                </div>
                                
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="projectId" class=" form-control-label">Release : </label>

                                        <select class="selectpicker form-control" id="releaseId" name="releaseId" data-exist=""  data-live-search="true" title="Select release" data-hide-disabled="true" ></select>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="rtmstatus" class=" form-control-label">Status : </label>
                                            <select class="form-control selectpicker" id="rtmstatus" name="rtmstatus" data-exist=""    data-live-search="true" title="Select status" data-hide-disabled="true">
                                          <!--  <option value="Pending"  data-content="<span class='badge badge-warning'>Pending</span>">Pending</option>
                                            <option value="In Progress" data-content="<span class='badge badge-primary'>In Progress</span>">In Progress</option>
                                            <option value="Pass" data-content="<span class='badge badge-success'>Pass</span>">Pass</option>
                                            <option value="Fail" data-content="<span class='badge badge-danger'>Fail</span>">Fail</option>-->
					<option value="Proposed"  data-content="<span class='badge badge-warning'>Proposed</span>">Proposed</option>
                                        <option value="Approved" data-content="<span class='badge badge-info'>Approved</span>">Approved</option>
                                        <option value="In Progress" data-content="<span class='badge badge-primary'>In Progress</span>">In Progress</option>
                                        <option value="Completed" data-content="<span class='badge badge-success'>Completed</span>">Completed</option>
                                            </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row form-group">
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
				<div class="col-4">
                                <div class="form-group">
                                    <label for="priority" class=" form-control-label">Priority : </label>
                                        <select class="form-control" id="priority" name="priority" data-exist="" >
                                        <option value="" >Select priority</option>
                                        <option value="High">High</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        </select>
                                </div>
                            </div>
			   </div>
			 <div class="row form-group">
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="assignto" class=" form-control-label">Assign to : </label>
                                    
                                    <select class="selectpicker form-control"  id="assignto" name="assignto" data-exist=""  data-live-search="true" title="Select team Members" data-hide-disabled="true" ></select>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="reviewer" class=" form-control-label">Reviewer : </label>
                                    <select class="selectpicker form-control" id='reviewer' name='reviewer' data-exist="" data-live-search="true" title="Select Reviewer" data-hide-disabled="true" ></select>
                                </div>
                            </div>
                            
                        </div>
                        <div class="row form-group hidden">
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="editmode" class=" form-control-label">Edit Mode : </label>
                                        <select class="form-control" id="editmode" name="editmode" data-exist="" >
                                        
                                        <option value="1" Selected>Editable</option>
                                        <option value="2">Read-only</option>
                                        
                                        </select>
                                </div>
                            </div>
                        </div>
			<div class="row form-group">
                            <div class="col-12 rtmsummary">
                                <div class="form-group">
                                    <label for="rtmsummary" class=" form-control-label">Summary : </label>
                                    <input type="hidden" id="rtmsummary_change" name="rtmsummary_change"  value="0" />
                                    <textarea  class="form-control" name="rtmsummary" id="rtmsummary" rows="2"></textarea>
                                </div>
                            </div>
                        </div>

			<div class="row form-group">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="rtmdesc" class=" form-control-label">Description : </label>
                                    <input type="hidden" id="rtmdesc_change" name="rtmdesc_change"  value="0" />
                                    <textarea  class="form-control" name="rtmdesc" id="rtmdesc" rows="5"></textarea>
                                </div>
                            </div>
                        </div>
		
                        <div class="row form-group">
                           <div class="col-6 hidden">
                                <div class="form-group">
                                    <label for="rtmcomment" class=" form-control-label">Comment : </label>
                                    <input type="hidden" id="rtmcomment_change" name="rtmcomment_change"  value="0" />
                                    <textarea  class="form-control" name="rtmcomment" id="rtmcomment" rows="2"></textarea>
                                </div>
                            </div>
                            <div class="col-sm-12">
                                    <label for="file">Upload File</label>
                                    <input type="file" class="" id="file" name="fileToUpload[]"  multiple="multiple" style="width:100%">
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
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/rtm-init.js"></script>

    

</body>

</html>
