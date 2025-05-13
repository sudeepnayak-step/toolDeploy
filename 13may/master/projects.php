<?php
include('../config.php');
include('../chksession.php');
$activetab = "projectActive";
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
                            <li class="active">Projects</li>
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
                        
                <div class="col-3 col-sm-3">
                    <div class="form-group">
                        <label for="tblfilterprojectId" class=" form-control-label font-weight-bold">Project : </label>

                        <select class="selectpicker form-control" id="tblfilterprojectId" name="tblfilterprojectId[]"  data-live-search="true" title="Select Project" data-hide-disabled="true"  multiple data-actions-box="true"></select>
                    </div>
                </div>  
                <div class="col-2 col-sm-2">
                    <div class="form-group">
                        <label for="tblfilterstatus" class=" form-control-label font-weight-bold">Status : </label>
                            <select class="form-control selectpicker" id="tblfilterstatus" name="tblfilterstatus[]"  data-live-search="true" title="Select Status" data-hide-disabled="true" multiple data-actions-box="true" >
                            
                            <option value="Pending"  data-content="<span class='badge badge-warning'>Pending</span>">Pending</option>
                            <option value="In Progress" data-content="<span class='badge badge-primary'>In Progress</span>">In Progress</option>
                            <option value="Complete" data-content="<span class='badge badge-success'>Complete</span>">Complete</option>
                            </select>
                    </div>
                </div>  
                <div class="col-3 col-sm-3">
                    <div class="form-group">
                        <label for="tblfilterowner" class=" form-control-label font-weight-bold">Owner : </label>

                        <select class="selectpicker form-control" id="tblfilterowner" name="tblfilterowner[]"  data-live-search="true" title="Select Owner" data-hide-disabled="true"  multiple data-actions-box="true"></select>
                    </div>
                </div>
                <div class="col-2 col-sm-2">
                    <div class="form-group">
                        <label for="tblfilterplanstart" class=" form-control-label font-weight-bold">Plan Start Date : </label>
                        <div class=" input-group">
                            <input type="text" id="tblfilterplanstart" name="tblfilterplanstart" placeholder="dd/mm/yyyy" class="form-control datepicker" readonly="">
                            <label class="input-group-addon btn" for="tblfilterplanstart">
                                <span class="fa fa-calendar"></span>
                            </label>                    
                        </div>
                    </div>
                </div>
                <div class="col-2 col-sm-2">
                    <div class="form-group">
                        <label for="tblfilterplanend" class=" form-control-label font-weight-bold">Plan End Date : </label>
                        <div class=" input-group">
                            <input type="text" id="tblfilterplanend" name="tblfilterplanend" placeholder="dd/mm/yyyy" class="form-control datepicker" readonly="">
                            <label class="input-group-addon btn" for="tblfilterplanend">
                                <span class="fa fa-calendar"></span>
                            </label>                    
                        </div>
                    </div>
                </div>
            </div>
            <hr>
        	
	    <div class="row mb-3">
            <div class="col-md-4 text-left "  id="exportButtonsContainer" >
            </div>	 
      	    <div class="col-md-4"></div>
            <?php 
            if((isset($_SESSION["usertype"]) && $_SESSION["usertype"] == "Admin") || (isset($_SESSION["ruleIds"]) && in_array("2", explode(",", $_SESSION["ruleIds"])))){ ?>
             
                <div class="col-md-4 text-right">
                    <button type="button" class="btn btn-step " id="addProject" data-toggle="modal" data-target="#projectmodal"><i class="fa fa-plus"></i> ADD Project</button>
                </div>
            
            <?php } ?>
            </div>
	    <table id="projectTbl" class="table compact nowrap border" style="width:100%;">
                <thead  class="bg-step text-white" id="filters">
                    <tr align="left">
                    <th class="notexport">
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
    
    <div class="modal fade" id="projectmodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header bg-step">
                    <h5 class="modal-title" id="scrollmodalLabel">New Project</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="projectform" method="post" class="form-horizontal" action="" enctype="multipart/form-data">
                    <div class="modal-body">

                            <div id="informationalert"></div>
                            <div class="row form-group">
                                
                                    <div class="col-4 " style="display: none;">
                                    <div class="form-group">
                                        <label for="projId" class=" form-control-label">Release Name : </label>
                                        <input type="text" id="projId" name="projId" placeholder="Enter release name" value="0" class="form-control">
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="projectname" class=" form-control-label">Project Name : </label>
                                        <input type="text" id="projectname" name="projectname" placeholder="Enter your project name" data-id="0" class="form-control" data-exist="">
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="projectcode" class=" form-control-label">Project Code : </label>
                                        <input type="text" id="projectcode" name="projectcode" placeholder="Enter project code" data-id="0" class="form-control" data-exist="">
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="projectstatus" class=" form-control-label">Project Status : </label>
                                            <select class="form-control" id="projectstatus" name="projectstatus" data-exist=""    data-live-search="true" title="Select status" data-hide-disabled="true">
                                            
                                            <option value="Pending"  data-content="<span class='badge badge-warning'>Pending</span>">Pending</option>
                                            <option value="In Progress" data-content="<span class='badge badge-primary'>In Progress</span>">In Progress</option>
                                            <option value="Complete" data-content="<span class='badge badge-success'>Complete</span>">Complete</option>
                                            </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="planstartdate" class=" form-control-label">Plan Start Date : </label>
                                        <div class=" input-group">
                                            <input type="text" id="planstartdate" name="planstartdate" placeholder="dd/mm/yyyy" class="form-control dateselection" readonly="" data-exist="">
                                            <label class="input-group-addon btn" for="planstartdate">
                                                <span class="fa fa-calendar"></span>
                                            </label>                    
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group required" >
                                        <label for="planenddate" class=" form-control-label">Plan End Date : </label>
                                        <div class=" input-group">
                                            <input type="text" id="planenddate" name="planenddate" placeholder="dd/mm/yyyy" class="form-control dateselection" readonly="" data-exist="">
                                            <label class="input-group-addon btn" for="planenddate">
                                                <span class="fa fa-calendar"></span>
                                            </label>                    
                                        </div>
                                    </div>
                                </div>

                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="revisedstartdate" class=" form-control-label">Revised Start Date : </label>
                                        <div class=" input-group">
                                            <input type="text" id="revisedstartdate" name="revisedstartdate" placeholder="dd/mm/yyyy" class="form-control dateselection" readonly="" data-exist="">
                                            <label class="input-group-addon btn" for="revisedstartdate">
                                                <span class="fa fa-calendar"></span>
                                            </label>                    
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="revisedenddate" class=" form-control-label">Revised End Date : </label>
                                        <div class=" input-group">
                                            <input type="text" id="revisedenddate" name="revisedenddate" placeholder="dd/mm/yyyy" class="form-control dateselection" readonly="" data-exist="">
                                            <label class="input-group-addon btn" for="revisedenddate">
                                                <span class="fa fa-calendar"></span>
                                            </label>                    
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="actualstartdate" class=" form-control-label">Actual Start Date : </label>
                                        <div class=" input-group">
                                            <input type="text" id="actualstartdate" name="actualstartdate" placeholder="dd/mm/yyyy" class="form-control dateselection" readonly="" data-exist="">
                                            <label class="input-group-addon btn" for="actualstartdate">
                                                <span class="fa fa-calendar"></span>
                                            </label>                    
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="actualenddate" class=" form-control-label">Actual End Date : </label>
                                        <div class=" input-group">
                                            <input type="text" id="actualenddate" name="actualenddate" placeholder="dd/mm/yyyy" class="form-control enddateselection" readonly="" data-exist="">
                                            <label class="input-group-addon btn" for="actualenddate">
                                                <span class="fa fa-calendar"></span>
                                            </label>                    
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="teammember" class=" form-control-label">Team Member : </label>

                                        <select class="selectpicker form-control" multiple id="teammember" name="teammember[]"  data-selected-text-format="count > 3" data-live-search="true" title="Select team members" data-hide-disabled="true"  data-exist=""></select>

                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group required">
                                        <label for="projectowner" class=" form-control-label">Project Owner : </label>

                                        <select class="selectpicker form-control" id="projectowner" name="projectowner"  data-live-search="true" title="Select project owner" data-hide-disabled="true"  data-exist=""></select>

                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="projectclient" class=" form-control-label">Client : </label>

                                        <select class="selectpicker form-control projectclient" id="projectclient" name="projectclient"  data-live-search="true" title="Select client" data-hide-disabled="true"  data-exist=""></select>
    
                                    </div>
                                </div>
                            </div>

                            <div class="row form-group">
                                <div class="col-4 hidden">
                                    <div class="form-group">
                                        <label for="ragstatus" class=" form-control-label">RAG Status : </label>
                                            <select class="form-control" id="ragstatus" name="ragstatus"  data-exist="">
                                            <option value="" >Select Status</option>
                                            <option value="G">G</option>
                                            <option value="A">A</option>
                                            <option value="R">R</option>
                                            </select>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="form-group">
                                        <label for="activestatus" class=" form-control-label">Active Status : </label>
                                            <select class="form-control" id="activestatus" name="activestatus" required=""  data-exist="">
                                            <option value="" >Select Status</option>
                                            <option value="Active" selected="">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-4">
                                    <label class=" form-control-label">Duration : <span id="duration" style="font-weight: bold;">0</span></label>
                                </div>
                                <div class="col-4">
                                    <label class=" form-control-label">Elapse Days : <span id="elapsedays" style="font-weight: bold;">0</span></label>
                                </div>
                                <div class="col-4">
                                    <label class=" form-control-label">Pending Days : <span id="remaingdays" style="font-weight: bold;">0</span></label>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-8">
                                    <div class="form-group">
                                        <label for="projectdesc" class=" form-control-label">Description : </label>
                                        <input type="hidden" id="projectdesc_change" name="projectdesc_change"  value="0" />
                                        <textarea  class="form-control stepeditor"  name="projectdesc" id="projectdesc" rows="2"></textarea>
                                    </div>
                                </div>


                                <div class="col-4">
                                        <label for="file">Upload Documents</label>
                                        <input type="file" class="" id="file" name="fileToUpload[]"  multiple="multiple" style="width:100%">
                                </div>
                            </div>
                            <h6 id="projattachmentsheader" class="hidden">Attachments</h6>
                            <br/>
                            <!-- <hr> -->
                            <div class="row form-group" id="projattachments"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary noeditPermission hidden" data-dismiss="modal">Ok</button>
                        <button type="button" class="btn btn-gray editPermission" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-step editPermission">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>




    <?php include(STEP_dir.'js.php'); ?>
    <script src="<?php echo STEP_root; ?>assets/js/init-scripts/master/project-init.js"></script>

    

</body>

</html>
