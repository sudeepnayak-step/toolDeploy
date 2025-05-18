
<div class="modal fade" id="defectmodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header bg-step">
                <h5 class="modal-title" id="scrollmodalLabel">New Defect</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="defectform" method="post" class="form-horizontal" action="" enctype="multipart/form-data">
                <div class="modal-body">
                    
                        <div class="col-sm-12">
                            <div class="alert  alert-info alert-dismissible fade show" role="alert">
                                <span class="badge badge-pill badge-info">Information</span> Release, Testcase ID and employee assignment is based on project selection.
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="row form-group">
                            
                                <div class="col-4 " style="display: none;">
                                <div class="form-group">
                                    <label for="dId" class=" form-control-label">ID : </label>
                                    <input type="text" id="dId" name="dId" placeholder="Enter release name" value="0" class="form-control" />
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
                                    <label for="projectId" class=" form-control-label">Release ID : </label>

                                    <select class="selectpicker form-control" id="releaseId" name="releaseId" data-exist=""  data-live-search="true" title="Select release" data-hide-disabled="true"></select>
                                </div>
                            </div>

                            <div class="col-4">
                                <div class="form-group">
                                    <label for="testcaseId" class=" form-control-label">Test Case ID : </label>

                                    <select class="selectpicker form-control" id="testcaseId" name="testcaseId" data-exist=""  data-live-search="true" title="Select testcase" data-hide-disabled="true"></select>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">

                            <div class="col-4">
                                <div class="form-group">
                                    <label for="module" class=" form-control-label">Module : </label>
                                    <input type="text" id="module" name="module" placeholder="Enter module" data-exist=""  class="form-control">
                                </div>
                            </div>
                            
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="submodule" class=" form-control-label">Sub Module : </label>
                                    <input type="text" id="submodule" name="submodule" placeholder="Enter submodule"  data-exist=""  class="form-control">
                                </div>
                            </div>

                            <div class="col-4">
                                <div class="form-group">
                                    <label for="defecttypeId" class=" form-control-label">Defect Type: </label>

                                    <select class="selectpicker form-control" id="defecttypeId" name="defecttypeId" data-exist=""  data-live-search="true" title="Select defect type" data-hide-disabled="true"></select>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="severity" class=" form-control-label">Severity : </label>
                                        <select class="form-control" id="severity" name="severity" data-exist="" >
                                        <option value="" >Select severity</option>
                                        <option value="High">High</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        </select>
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

                            <div class="col-4">
                                <div class="form-group">
                                    <label for="defectstatusId" class=" form-control-label">Defect Status: </label>

                                    <select class="selectpicker form-control" id="defectstatusId" name="defectstatusId" data-exist=""  data-live-search="true" title="Select defect status" data-hide-disabled="true"></select>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
				
                            <div class="col-4">
                                <div class="form-group">
                                    <label for="environment" class=" form-control-label">Enviornment : </label>
                                        <select class="form-control" id="environment" name="environment" data-exist="" >
                                        <option value="" >Select environment</option>
                                        <option value="QA">QA</option>
                                        <option value="UAT">UAT</option>
                                        <option value="Production">Production</option>
                                        </select>
                                </div>
                            </div>

                            <div class="col-4">
                                <div class="form-group">
                                    <label for="assignto" class=" form-control-label">Assign to : </label>
                                    
                                    <select class="selectpicker form-control"  id="assignto" name="assignto" data-exist=""  data-live-search="true" title="Select team Members" data-hide-disabled="true" ></select>
                                </div>
                            </div>
                        </div>

                        <div class="row form-group">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="shortdesc" class=" form-control-label">Short Description : </label>
                                    <input type="hidden" id="shortdesc_change" name="shortdesc_change"  value="0" />
                                    <textarea  class="form-control stepeditor" name="shortdesc" id="shortdesc" data-exist="" row="4" height="20%"></textarea>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="longdesc" class=" form-control-label">Detailed Description : </label>
                                    <input type="hidden" id="longdesc_change" name="longdesc_change"  value="0" />
                                    <textarea  class="form-control stepeditor" name="longdesc" id="longdesc" data-exist="" row="4"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="testdata" class=" form-control-label">Test data : </label>
                                    <input type="hidden" id="testdata_change" name="testdata_change"  value="0" />
                                    <textarea  class="form-control stepeditor" name="testdata" id="testdata" data-exist="" row="4"></textarea>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="steps" class=" form-control-label">Steps : </label>
                                    <input type="hidden" id="steps_change" name="steps_change"  value="0" />
                                    <textarea  class="form-control stepeditor" name="steps" id="steps" data-exist="" row="4"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="expectedresult" class=" form-control-label">Expected Result : </label>
                                    <input type="hidden" id="expectedresult_change" name="expectedresult_change"  value="0" />
                                    <textarea  class="form-control stepeditor" name="expectedresult" id="expectedresult" data-exist="" row="4"></textarea>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="steps" class=" form-control-label">Actual Result : </label>
                                    <input type="hidden" id="actualresult_change" name="actualresult_change"  value="0" />
                                    <textarea  class="form-control stepeditor" name="actualresult" id="actualresult" data-exist="" row="4"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-12">
				
                                <div class="form-group required">
                                    <label for="file"  class=" form-control-label">Upload File</label>
                                    <input type="file" class="form-control" id="file" name="fileToUpload[]" required  multiple="multiple" width="100%">
				</div>
                            </div>
                        </div>
                        

                        <h6 id="defectattachmentsheaderedit" class="hidden">Attachments</h6>
                        <br/>
                        <div class="row form-group" id="defectattachmentsedit"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-gray" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-step">Save</button>
                </div>
            </form>
        </div>
    </div>
</div>


