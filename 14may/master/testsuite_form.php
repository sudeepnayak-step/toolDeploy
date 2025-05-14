<div class="modal fade" id="testsuitemodal" tabindex="-1" role="dialog" aria-labelledby="scrollmodalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header bg-step">
                <h5 class="modal-title" id="scrollmodalLabel">Testsuite</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="testsuiteform" method="post" class="form-horizontal">
                <div class="modal-body">
                    
                        <div class="col-sm-12">
                            <div class="alert  alert-info alert-dismissible fade show" role="alert">
                                <span class="badge badge-pill badge-info">Information</span> Release, test type and employee assignment is based on project selection.<br/>
                                <div id="informationalert"></div>
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-4 " style="display: none;">
                                <div class="form-group">
                                    <label for="testsuiteDBId" class=" form-control-label">Activity ID : </label>
                                    <input type="text" id="testsuiteDBId" name="testsuiteDBId" placeholder="Enter activity name" value="0" class="form-control">
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="form-group required">
                                    <label for="ts_projectId" class=" form-control-label">Project : </label>

                                    <select class="selectpicker form-control" id="ts_projectId" name="projectId"  data-live-search="true" title="Select project" data-hide-disabled="true"  data-exist=""></select>
                                </div>
                            </div>
                            
                            <div class="col-4">
                                <div class="form-group required">
                                    <label for="ts_releaseId" class=" form-control-label">Release : </label>

                                    <select class="selectpicker form-control" id="ts_releaseId" name="releaseId"  data-live-search="true" title="Select release" data-hide-disabled="true" data-exist=""></select>
                                </div>
                            </div>
                            
                            <div class="col-4">
                                <div class="form-group required">
                                    <label for="ts_activityId" class=" form-control-label">Test Plan : </label>

                                    <select class="selectpicker form-control" id="ts_activityId" name="activityId"  data-live-search="true" title="Select test plan" data-hide-disabled="true" data-exist=""></select>
                                </div>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-4">
                                <div class="form-group required">
                                    <label for="testsuitename" class=" form-control-label">Test Suite name : </label>
                                    <input type="text" id="testsuitename" name="testsuitename" placeholder="Enter testsuite Name" class="form-control" data-exist="">
                                </div>
                            </div>


                            <div class="col-4">
                                <div class="form-group">
                                    <label for="ts_assignto" class=" form-control-label">Assign to : </label>

                                    <select class="selectpicker form-control" id="ts_assignto" name="assignto"  data-live-search="true" title="Select assignee" data-hide-disabled="true"  data-exist=""></select>
                                </div>
                            </div>

                            <div class="col-4">
                                <div class="form-group">
                                    <label for="testsuitedesc" class=" form-control-label">Description : </label>
                                    <input type="hidden" id="testsuitedesc_change" name="testsuitedesc_change"  value="0" />
                                    <textarea  class="form-control" name="testsuitedesc" id="testsuitedesc" rows="2"></textarea>
                                </div>
                            </div>
                            
                        </div>
                                        
                                <div class="row form-group">
                                    <div class="col-12">
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="artifactschk" name="artifactschk">
                                            <input type="hidden" id="artifactschk_change" name="artifactschk_change"  value="0" />
                                            <label class="custom-control-label" for="artifactschk">Do you want to run this on Test-Artifacts? </label>
                                        </div>
                                        
                                    </div>
                                </div>
                        <div class="row form-group">
                            <div class="col-4">
                                <div class="form-group required">
                                    <label for="type" class=" form-control-label">Execution Type : </label>
                                        <select class="form-control" id="type" name="type" required>
                                        <option value="" >Select Type</option>
                                        <option value="Manual">Manual</option>
                                        <option value="Automation">Automation</option>
                                        </select>
                                </div>
                            </div>

                            <div class="col-4 autosetting hidden">
                                <div class="form-group">
                                    <label for="machinId" class=" form-control-label">Machin ID : </label>
                                    <input type="text" id="machinId" name="machinId" placeholder="Enter machin id" value="" data-id="0" class="form-control">
                                </div>
                            </div>

                            <div class="col-4 autosetting hidden">
                                <div class="form-group">
                                    <label for="command" class=" form-control-label">Command : </label>
                                    <input type="hidden" id="command_change" name="command_change"  value="0" />
                                    <textarea  class="form-control stepeditor"  name="command" id="command" rows="2"></textarea>
                                </div>
                            </div>
                        </div>
                        <div id="schdulingsetting" class="hidden">
                            <hr>
                            <div class="row form-group">
                                <div class="col-12">
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="schedchk" name="schedchk">
                                        <input type="hidden" id="schedchk_change" name="schedchk_change"  value="0" />
                                        <label class="custom-control-label" for="schedchk">Do you want to schedule this? </label>
                                    </div>
                                    
                                </div>
                            </div>

                            <div id="schdulingsettingchk" class="hidden">
                                <h6 class="modal-title mb-2" id="scrollmodalLabel">Schedular Setting</h6>
                                <div class="row form-group">
                                    
                                    <div class="col-4">
                                        <div class="form-group ">
                                            <label for="schedularevery" class=" form-control-label">Execute Every : </label>
                                            <input type="text" id="schedularevery" name="schedularevery" placeholder="Enter unit"  data-id="0" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-4 ">
                                        <div class="form-group ">
                                            <label for="schedulartype" class=" form-control-label">&nbsp;</label>
                                                <select class="form-control" id="schedulartype" name="schedulartype" >
                                                <option value="" >Select Type</option>
                                                <option value="Minute" >Minute</option>
                                                <option value="Hour">Hour</option>
                                                <option value="Day">Day</option>
                                                </select>
                                        </div>
                                    </div>

                                    <div class="col-4 hidden" id="startimediv">
                                        <div class="form-group ">
                                            <label for="schedularstart" class=" form-control-label">Execution Start time : </label>
                                            <input type="text" id="schedularstart" name="schedularstart" placeholder="HH:mm" value="" data-id="0" class="form-control datetimepicker" readonly="">
                                        </div>
                                    </div>
                                </div>

                                <div class="row form-group">


                                    <div class="col-4">
                                        <div class="form-group ">
                                            <label for="schedularend" class=" form-control-label">Execution End date & time : </label>
                                            <input type="text" id="schedularend" name="schedularend" placeholder="YYYY-mm-dd HH:mm" value="" data-id="0" class="form-control datetimepicker" readonly="">
                                        </div>
                                    </div>
                                </div>
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

