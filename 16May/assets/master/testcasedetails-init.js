var bulkcheckboxarr = new Array();

(function ($) {
  var temp_rtmId = window.location.search.substr(1);
  var arr = temp_rtmId.split("=");
  var param1 = arr[0];
  var paramval1 = arr[1];
  nTCid = arr[1];

$.fn.dataTable.ext.errMode = 'none';


/**
 * Fetches and populates the project dropdown with options.
 */
var p1 = function(){
    return new Promise(function(resolve, reject){
        
        $.ajax({
            type: "GET",
            url: STEP_root+'api/getActiveproject.php',
            dataType:'json',
            data:  {'formtype':'Project'}, 
            success: function(data)
            {
              if(data != null && data['data']!=null){
                $.each( data['data'], function( key, value ) {
                  $("#projectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                });
              }

              $("#projectId").selectpicker('refresh');

              resolve(true);
            },error:function (jqXHR, textStatus, errorThrown) {
              resolve(true);
            }
        });
  
    });
};

/**
 * Fetches and populates the reviewer dropdown with options.
 */
var p2 = function(){
    return new Promise(function(resolve, reject){
        
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'Employee'}, 
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#reviewer").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
              });
            }

            $("#reviewer").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};

/**
 * tccategory: Load all active Categories in the page
 * @return {Promise}
 */
var tccategory = function(){
    return new Promise(function(resolve, reject){
        
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'Category'}, 
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#category").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
              });
            }

            $("#category").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};


p1().then(p2).then(tccategory).then(function(){
});

/**
 * This function is used to load the details of the testcase based on the paramval1 
 * which is passed through the url parameter. It makes an ajax call to the getSingleedit.php
 * and loads the data for the testcase and also loads the steps associated with the testcase
 */
  function loadDetails(){
     $.ajax({
         type: "POST",
         url: STEP_root+'api/getSingleedit.php',
         dataType:'json',
         data:  {"id":nTCid,"formtype":"TestcaseDetails"}, 
         success: function(data)
         {
          
            $("#prvdefect").addClass("hidden");
            $("#nextdefect").addClass("hidden");
            if(data !=null){
                if(data['id'] !=null){
                    if(data['prvId'] != null && data['prvId'] !="0" && data['prvId'] !=""){
                      $("#prvdefect").attr("href",STEP_root+'master/testcasedetails.php?id='+data['prvId']);
                      $("#prvdefect").removeClass("hidden");
                    }
                    if(data['nextId'] != null && data['nextId'] !="0" && data['nextId'] !=""){
                      $("#nextdefect").attr("href",STEP_root+'master/testcasedetails.php?id='+data['nextId']);
                      $("#nextdefect").removeClass("hidden");
                    }
                    var nDetailstxt = "Test Case ID : <span class=' big text-step'><strong>"+data['testcasenum']+"</strong></span>";
                    if((data['editPermission'] != null && data['editPermission'] >0)){
                      nDetailstxt += "<a href='JavaScript:void(0)' id='editTestcase"+paramval1+"' data-id='"+paramval1+"' class='text-step pull-right' data-toggle='modal' data-target='#testcasemodal' ><b>Edit Testcase</b> </a>";
                    }
                    $("#testcasenumtxt").html(nDetailstxt);
                    $("#projecttxt").html("Project : <strong>"+data['projectId']+"</strong>");
                    $("#releasetxt").html("Release : <strong>"+data['releaseId']+"</strong>");
                    $("#testtypetext").html("Test Type : <strong>"+data['activityId']+"</strong>");
                    $("#testscenarionumtxt").html("Testcase Scenario : <strong>"+data['scenarioIdstr']+"</strong>");
                    $("#moduletxt").html("Module : <strong>"+data['module']+"</strong>");
                    $("#submoduletxt").html("Sub Module : <strong>"+data['submodule']+"</strong>");
                    $("#reviewertxt").html("Reviewer : <strong>"+data['reviewer']+"</strong>");
                    $("#modetxt").html("Test Mode : <strong>"+data['testmode']+"</strong>");
                    $("#categorytxt").html("Category : <strong>"+data['category']+"</strong>");
                    $("#testscenariodesctxt").html("Test Scenario Description : <strong>"+data['testscenariodesc']+"</strong>");
                    $("#testcasedesctxt").html("Test Case Description : <strong>"+data['testcasedesc']+"</strong>");
                    $("#precondtxt").html("Pre-Condition : <strong>"+data['precondition']+"</strong>");
                    $("#testdatatxt").html("Test Data : <strong>"+data['testdata']+"</strong>");
		    $("#commenttxt").html("Comment : <strong>"+data['comment']+"</strong>");

                }
            }

         },error:function (jqXHR, textStatus, errorThrown) {
                formatErrorMessage(jqXHR, errorThrown);
          }
     });
 
}
loadDetails();

/** initialize step table */
var stepsTbl =  $('#stepsTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        formatErrorMessage("","");

    } ).DataTable({
      responsive: true,
      "ajax": {
        "type":"POST",
        "url": STEP_root+"api/getallSteps.php",
        "data": function (d) {
          
            return "testcaseId="+nTCid;
 
        }
      },
      "columnDefs": [
          {
                "orderable": false,
                "visible": false,
                'targets': [0],
                 "class": "text-left",
                "render": function ( data, type, row ) {
                  return '<div class="custom-control custom-checkbox">'+
                            '<input type="checkbox" class="custom-control-input" id="checkbox'+data+'">'+
                            '<label class="custom-control-label" for="checkbox'+data+'">&nbsp;</label>'+
                        '</div>';
                }
          }, 
          {"orderable": false,
            "targets": -1,
            "class":"text-left",
            render: function ( data, type, row ) {
            return '<a href="JavaScript:void(0)" id="editStep'+row[0]+'" data-id="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#stepmodal" >'+
                    '  <span class="fa fa-pencil text-step "></span>'+
                  ' </a>&nbsp;&nbsp;<a href="JavaScript:void(0)" id="deleteSteps'+data+'" data-id="'+data+'" >'+
                    '  <span class="fa fa-trash text-danger "></span>'+
                  ' </a>';
            }           
          },
          {
            "orderable": false,"targets":[2,3],"class":"text-left","width": "40%",
            "render": $.fn.dataTable.render.ellipsis()
          },
          {"orderable": false,"targets":[1],"class":"text-left","width": "10%"}  ,
          {"orderable": false,"targets":[1,2,3,4],"class":"text-left"}  
      ],
      "drawCallback": function (settings) { 
          $('[data-toggle="popover"]').popover();
      },

      "scrollX": true,
      "pageLength": 25,
      "searching": false,
      "paging": false,
      "info": false,
      "ordering": false,
      "stateSave": true,  
  });

  /** get step details */
$( document ).on( "click", "[id^=editStep]", function(e) {
    // prevent default action
    e.preventDefault();

    var currentId = $(this).attr("data-id");
    if(currentId != "0"){
        $.ajax({
            type: "POST",
            url: STEP_root+'api/getSingleedit.php',
            dataType:'json',
            data:  {"id":currentId,"formtype":"TestcaseSteps"}, 
            success: function(data)
            {
            if(data !=null){
                if(data['id'] !=null){
                    $("#stepId").val(data['id']);

                    $("#steps").val(data['steps']);
                    $("#expectedresult").val(data['expectedresult']);
                    

                }
            }

            },error:function (jqXHR, textStatus, errorThrown) {
                  formatErrorMessage(jqXHR, errorThrown);
            }
        });
    }else{

    }
});

$( document ).on( "change", "[id=steps],[id=expectedresult]", function(e) {
        // prevent default action
        e.preventDefault();
        var nId = $(this).attr("id");
        $("#"+nId+"_change").val(1);
});


/** save testcase steps data */
$('form[id="stepform"]').validate({

  onkeyup: function(element) {$(element).valid()},
  errorClass: "state-error",
  validClass: "state-success",
  errorElement: "em",
  /* @validation highlighting + error placement  
  ---------------------------------------------------- */ 
  
  highlight: function(element, errorClass, validClass) {
          $(element).closest('.field').addClass(errorClass).removeClass(validClass);
  },
  unhighlight: function(element, errorClass, validClass) {
          $(element).closest('.field').removeClass(errorClass).addClass(validClass);
  },
  errorPlacement: function(error, element) {
      if (element.is(":radio") || element.is(":checkbox")) {
              element.closest('.option-group').after(error);
      } else {
              error.insertAfter(element.parent());
      }
  },
  rules: {
      "steps": {
          maxlength: textlimit
      },
      "expectedresult": {
          maxlength: textlimit
      }
  },
  messages: {
    "steps": {
      maxlength: "You have reached your maximum limit of characters allowed"
    },
    "expectedresult": {
      maxlength: "You have reached your maximum limit of characters allowed"
    }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     form_data.append('testcaseId',nTCid);
     

     $.ajax({
        url: STEP_root+"api/saveTCsteps.php", //The url where the server req would we made.
        async: false,
        type: "POST", //The type which you want to use: GET/POST
        data: form_data , //The variables which are going.
        dataType: "json", //Return data type (what we expect).
        cache: false,
        contentType: false,
        processData: false,
        //This is the function which will be called if ajax call is successful.
        success: function(data) {
          if(data != null){
            if(data['status'] != null){
              if(data['status'] == "Success"){
                closeModelform(form);
                $.alert({
                      title: 'Success',
                      content: data['message'],
                      type: 'green',
                      typeAnimated: true
                  });
              }else if(data['status'] == "Error"){
                  $.alert({
                      title: 'Encountered an error!',
                      content: data['message'],
                      type: 'red',
                      typeAnimated: true
                  });
              }else{
                $.alert({
                    title: 'Encountered an error!',
                    content: "Something went wrong. Please try again.",
                    type: 'red',
                    typeAnimated: true
                });
              }
            }
          }

        },error:function (jqXHR, textStatus, errorThrown) {
              formatErrorMessage(jqXHR, errorThrown);
        }
    });
}
});


function closeModelform(form){
   var mymodal = $('#stepmodal');
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTbl();
}
function reloadTbl(){
  
    stepsTbl.ajax.reload( null, false );
}


$('#stepmodal').on('hidden.bs.modal', function () {
  $('#stepform').trigger("reset");

  $("#steps_change").val("0");
  $("#expectedresult_change").val("0");

  $('#stepform .state-error').css('display', 'none');
});

/** get details of testcase */
$( document ).on( "click", "[id^=editTestcase]", function(e) {
    // prevent default action
    e.preventDefault();

    var currentId = $(this).attr("data-id");
    if(currentId != "0"){
          $.ajax({
              type: "POST",
              url: STEP_root+'api/getSingleedit.php',
              dataType:'json',
              data:  {"id":currentId,"formtype":"Testcase"}, 
              success: function(data)
              {
                if(data !=null){
                    if(data['id'] !=null){
                        $("#testcaseDBId").val(data['id']);

                        $("#module").val(data['module']);
                        $("#module").attr("data-exist",data['module']);

                        $("#submodule").val(data['submodule']);
                        $("#submodule").attr("data-exist",data['submodule']);

                        $("#testmode").val(data['testmode']);
                        $("#testmode").attr("data-exist",data['testmode']);

                        $("#testscenariodesc").val(data['testscenariodesc']);
                        $("#testcasedesc").val(data['testcasedesc']);
                        $("#precondition").val(data['precondition']);
                        $("#testdata").val(data['testdata']);
                        $("#comment").val(data['comment']);

                        $("#projectId").val(data['projectId']);
                        $("#projectId").attr("data-exist",data['projectId']);
                        $("#informationalert").html("");
                        if(data['editable'] != null && data['editable'] >0){

                          $("#informationalert").html(' Project/Release/Test type/Scenario is not changable because this tesetcase is either added in RTM or already executed.');
                          $('#projectId').prop('disabled', true);
                        }else{
                          $('#projectId').prop('divsabled', false);
                        }
                        $("#projectId").selectpicker('refresh');

                        $("#reviewer").val(data['reviewer']);
                        $("#reviewer").attr("data-exist",data['reviewer']);
                        $("#reviewer").selectpicker('refresh');

                        $("#category").val(data['category']);
                        $("#category").attr("data-exist",data['category']);
                        $("#category").selectpicker('refresh');

                        getRelease(data['projectId']).then(function(){
                          
                            $("#releaseId").val(data['releaseId']);
                            $("#releaseId").attr("data-exist",data['releaseId']);
                            if(data['editable'] != null && data['editable'] >0){
                              $('#releaseId').prop('disabled', true);
                            }else{
                              $('#releaseId').prop('disabled', false);
                            }
                            $("#releaseId").selectpicker('refresh');

                            getActivity(data['projectId'],data['releaseId']).then(function(){
                                $('#activityId').selectpicker('val', data['activityId'].split(","));
                                $("#activityId").attr("data-exist",data['activityId']);
                                if(data['editable'] != null && data['editable'] >0){
                                    $('#activityId').prop('disabled', true);
                                }else{
                                    $('#activityId').prop('disabled', false);
                                }
                                $("#activityId").selectpicker('refresh');

                                getScenario(data['projectId'],1).then(function(){
                                  
                                    $("#scenarioId").val(data['scenarioId']);
                                    $("#scenarioId").attr("data-exist",data['scenarioId']);
                                    if(data['editable'] != null && data['editable'] >0){
                                        $('#scenarioId').prop('disabled', true);
                                    }else{
                                        $('#scenarioId').prop('disabled', false);
                                    }
                                    $("#scenarioId").selectpicker('refresh');
                                });
                            });
                        });
                        
                        getAssignee(data['projectId']).then(function(){
                            $("#assignto").val(data['assignto']);
                            $("#assignto").attr("data-exist",data['assignto']);
                            $("#assignto").selectpicker('refresh');
                        });
                    }
                }

              },error:function (jqXHR, textStatus, errorThrown) {
                    formatErrorMessage(jqXHR, errorThrown);
              }
          });
      }else{

      }
  });

/**
 * @function getRelease
 * @description Gets a list of releases for a given project ID.
 */
function getRelease(nProjectId){

    return new Promise(function(resolve, reject){
      $("#releaseId").html('');
      $("#releaseId").selectpicker('refresh');
                

      $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'Release',"projectId":nProjectId}, 
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {

                  $("#releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
              });
            }

            $("#releaseId").selectpicker('refresh');

            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            reject(true);
          }
      });
  
    });
}


/**
 * @function getAssignee
 * @description Gets the Assignee details based on the project Id.
 * @param {number} nProjectId - The ID of the project.
 * @return {Promise} - Resolves to true when the Assignee dropdown has been updated.
 */
function getAssignee(nProjectId){

    return new Promise(function(resolve, reject){

        $("#assignto").html('');
        $("#assignto").selectpicker('refresh');
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'Assignee',"projectId":nProjectId}, 
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#assignto").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
              });
            }

            $("#assignto").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
        });
  
    });

      
}

/**
 * @function getActivity
 * @description Gets the activity details based on the project Id and release Id.
 * @param {number} nProjectId - The ID of the project.
 * @param {number} nReleaseID - The ID of the release.
 * @return {Promise} - Resolves to true when the activity dropdown has been updated.
 */
function getActivity(nProjectId,nReleaseID){

    return new Promise(function(resolve, reject){
          $("#activityId").html('');
          $("#activityId").selectpicker('refresh');

          $.ajax({
            type: "POST",
            url: STEP_root+'api/getDropdown.php',
            dataType:'json',
            data:  {'formtype':'ProjectActivity',"projectId":nProjectId,"releaseId":nReleaseID}, 
            success: function(data)
            {
              if(data != null && data['data']!=null){
                $.each( data['data'], function( key, value ) {
                  
                    $("#activityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
                });
              }

              $("#activityId").selectpicker('refresh');

              resolve(true);
            },error:function (jqXHR, textStatus, errorThrown) {
              resolve(true);
            }
        });
  
    });
}


/**
 * @function getScenario
 * @description Gets the scenario details based on the project ID and flag.
 * @return {Promise} - Resolves to true when the scenario dropdown has been updated.
 */
function getScenario(nProjectId,nFLag){

    return new Promise(function(resolve, reject){
          $("#scenarioId").html('');
          $("#scenarioId").selectpicker('refresh');
          $.ajax({
            type: "POST",
            url: STEP_root+'api/getDropdown.php',
            dataType:'json',
            data:  {'formtype':'TestcaseScenario',"projectId":nProjectId,"flag":nFLag}, 
            success: function(data)
            {
              if(data != null && data['data']!=null){
                $.each( data['data'], function( key, value ) {
                  $("#scenarioId").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
                });
              }

              $("#scenarioId").selectpicker('refresh');
              resolve(true);
            },error:function (jqXHR, textStatus, errorThrown) {
              resolve(true);
            }
        });
  
    });
  }

$( document ).on( "change", "[id=projectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nPorjectId = this.value;
        getRelease(nPorjectId,1);
        getScenario(nPorjectId,0);
        getAssignee(nPorjectId);

});
 $( document ).on( "change", "[id=releaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nReleaseId = this.value;
        var nPorjectId = $("#projectId").val();
        getActivity(nPorjectId,nReleaseId,1);
});
 $( document ).on( "change", "[id=scenarioId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nVal = $('#scenarioId option:selected').text();
        $("#scenarioIdstr").val(nVal);

});
$( document ).on( "change", "[id=testscenariodesc],[id=testcasedesc],[id=precondition],[id=testdata],[id=comment]", function(e) {
        // prevent default action
        e.preventDefault();
        var nId = $(this).attr("id");
        $("#"+nId+"_change").val(1);
});

/** save testcase details */
$('form[id="testcaseform"]').validate({

  onkeyup: function(element) {$(element).valid()},
  errorClass: "state-error",
  validClass: "state-success",
  errorElement: "em",
  /* @validation highlighting + error placement  
  ---------------------------------------------------- */ 
  
  highlight: function(element, errorClass, validClass) {
          $(element).closest('.field').addClass(errorClass).removeClass(validClass);
  },
  unhighlight: function(element, errorClass, validClass) {
          $(element).closest('.field').removeClass(errorClass).addClass(validClass);
  },
  errorPlacement: function(error, element) {
      if (element.is(":radio") || element.is(":checkbox")) {
              element.closest('.option-group').after(error);
      } else {
              error.insertAfter(element.parent());
      }
  },
  rules: {
    "activityId": 'required',
    "projectId": 'required',
    "releaseId": 'required',
    "scenarioId": 'required',
    "testmode": 'required',
    "testscenariodesc": {
        maxlength: textlimit
    },
    "testcasedesc": {
        maxlength: textlimit
    },
    "precondition": {
        maxlength: textlimit
    },
    "testdata": {
        maxlength: textlimit
    }
  },
  messages: {
    "activityId": 'Please select test type',
    "projectId": 'Please select project',
    "releaseId": 'Please select release',
    "scenarioId": 'Please select scenario',
    "testmode": 'Please select test mode',
    "testscenariodesc": {
      maxlength: "You have reached your maximum limit of characters allowed"
    },
    "testcasedesc": {
      maxlength: "You have reached your maximum limit of characters allowed"
    },
    "precondition": {
      maxlength: "You have reached your maximum limit of characters allowed"
    },
    "testdata": {
      maxlength: "You have reached your maximum limit of characters allowed"
    }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 

     form_data.append('projectId',($("#projectId").val() != null && $("#projectId").val() != "" ? $("#projectId").val():"0"));
     form_data.append('releaseId',($("#releaseId").val() != null && $("#releaseId").val() != "" ? $("#releaseId").val():"0"));
     form_data.append('activityId',($("#activityId").val() != null && $("#activityId").val() != "" ? ($("#activityId").val()).toString():"0"));
     form_data.append('scenarioId',($("#scenarioId").val() != null && $("#scenarioId").val() != "" ? $("#scenarioId").val():"0"));
     
     form_data.append('projectId_change',($("#projectId").val() != null && $("#projectId").val() != $("#projectId").attr("data-exist") ? "1":"0"));
     form_data.append('releaseId_change',($("#releaseId").val() != null && $("#releaseId").val() != $("#releaseId").attr("data-exist") ? "1":"0"));
     form_data.append('activityId_change',($("#activityId").val() != null && $("#activityId").val() != $("#activityId").attr("data-exist") ? "1":"0"));
     form_data.append('scenarioId_change',($("#scenarioId").val() != null && $("#scenarioId").val() != $("#scenarioId").attr("data-exist") ? "1":"0"));
     form_data.append('module_change',($("#module").val() != null && $("#module").val() != $("#module").attr("data-exist") ? "1":"0"));
     form_data.append('submodule_change',($("#submodule").val() != null && $("#submodule").val() != $("#submodule").attr("data-exist") ? "1":"0"));
     form_data.append('assignto_change',($("#assignto").val() != null && $("#assignto").val() != $("#assignto").attr("data-exist") ? "1":"0"));
     form_data.append('reviewer_change',($("#reviewer").val() != null && $("#reviewer").val() != $("#reviewer").attr("data-exist") ? "1":"0"));
     form_data.append('category_change',($("#category").val() != null && $("#category").val() != $("#category").attr("data-exist") ? "1":"0"));
     form_data.append('testmode_change',($("#testmode").val() != null && $("#testmode").val() != $("#testmode").attr("data-exist") ? "1":"0"));

     $.ajax({
        url: STEP_root+"api/saveTestcase.php", //The url where the server req would we made.
        async: false,
        type: "POST", //The type which you want to use: GET/POST
        data: form_data , //The variables which are going.
        dataType: "json", //Return data type (what we expect).
        cache: false,
        contentType: false,
        processData: false,
        //This is the function which will be called if ajax call is successful.
        success: function(data) {
          if(data != null){
            if(data['status'] != null){
              if(data['status'] == "Success"){
                closeTCModelform(form);
                $.alert({
                      title: 'Success',
                      content: data['message'],
                      type: 'green',
                      typeAnimated: true
                  });
              }else if(data['status'] == "Error"){
                  $.alert({
                      title: 'Encountered an error!',
                      content: data['message'],
                      type: 'red',
                      typeAnimated: true
                  });
              }else{
                $.alert({
                    title: 'Encountered an error!',
                    content: "Something went wrong. Please try again.",
                    type: 'red',
                    typeAnimated: true
                });
              }
            }
          }

        },error:function (jqXHR, textStatus, errorThrown) {
              formatErrorMessage(jqXHR, errorThrown);
        }
    });
}
});


function closeTCModelform(form){
   var mymodal = $('#testcasemodal');
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTCTbl();
}
function reloadTCTbl(){
  
    $("#activityId").val('default');
    $("#activityId").selectpicker("refresh");
    $("#projectId").val('default');
    $("#projectId").selectpicker("refresh");
    $("#releaseId").html("");
    $("#releaseId").val('default');
    $("#releaseId").selectpicker("refresh");
    $("#assignto").html("");
    $("#assignto").val('default');
    $("#assignto").selectpicker("refresh");
    $("#reviewer").val('default');
    $("#reviewer").selectpicker("refresh");
    $("#category").val('default');
    $("#category").selectpicker("refresh");
    $("#scenarioId").html("");
    $("#scenarioIdstr").val();
    $("#scenarioId").val('default');
    $("#scenarioId").selectpicker("refresh");

}

$('#testcasemodal').on('hidden.bs.modal', function () {
    $('#testcaseform').trigger("reset");

    $("#informationalert").html("");

    $("#activityId").removeAttr("disabled");
    $("#projectId").removeAttr("disabled");
    $("#releaseId").removeAttr("disabled");
    $("#scenarioId").removeAttr("disabled");

    $("#activityId").val('default');
    $("#activityId").selectpicker("refresh");
    $("#projectId").val('default');
    $("#projectId").selectpicker("refresh");
    $("#releaseId").html("");
    $("#releaseId").val('default');
    $("#releaseId").selectpicker("refresh");
    $("#scenarioId").html("");
    $("#scenarioIdstr").val();
    $("#scenarioId").val('default');
    $("#scenarioId").selectpicker("refresh");
    $("#reviewer").val('default');
    $("#reviewer").selectpicker("refresh");

    $("#category").val('default');
    $("#category").selectpicker("refresh");

    $("#testscenariodesc_change").val("0");
    $("#testcasedesc_change").val("0");
    $("#precondition_change").val("0");
    $("#testdata_change").val("0");
    $("#comment_change").val("0");
    $("#projectId").attr("data-exist","");
    $("#releaseId").attr("data-exist","");
    $("#activityId").attr("data-exist","");
    $("#scenarioId").attr("data-exist","");
    $("#module").attr("data-exist","");
    $("#submodule").attr("data-exist","");
    $("#assignto").attr("data-exist","");
    $("#reviewer").attr("data-exist","");
    $("#category").attr("data-exist","");
    $("#testmode").attr("data-exist","");


    $('#testcaseform .state-error').css('display', 'none');
});

/** delete steps from testcase */
$( document ).on( "click", "[id^=deleteSteps]", function(e) {
    // prevent default action
    e.preventDefault();

    var currentId = $(this).attr("data-id");
    if(currentId != "0"){
      $.confirm({
        title: 'Confirm!',
        content: 'Are you sure you want to delete this record?',
        buttons: {
            cancel: function () {
                
            },
            confirm: {
                btnClass: 'btn-blue',
                action: function(){
                    $.ajax({
                        type: "POST",
                        url: STEP_root+'api/deleteAction.php',
                        dataType:'json',
                      data:  {"id":currentId,"formtype":"Testcasesteps"}, 
                        success: function(data)
                        {
                        if(data != null){
                          if(data['status'] != null){
                            if(data['status'] == "Success"){
                              reloadTbl();
                              $.alert({
                                    title: 'Success',
                                    content: data['message'],
                                    type: 'green',
                                    typeAnimated: true
                                });
                            }else if(data['status'] == "Error"){
                                $.alert({
                                    title: 'Encountered an error!',
                                    content: data['message'],
                                    type: 'red',
                                    typeAnimated: true
                                });
                            }else{
                              $.alert({
                                  title: 'Encountered an error!',
                                  content: "Something went wrong. Please try again.",
                                  type: 'red',
                                  typeAnimated: true
                              });
                            }
                          }
                        }
                        
                        },error:function (jqXHR, textStatus, errorThrown) {
                              formatErrorMessage(jqXHR, errorThrown);
                        }
                    });
                }
            }
        }
    });

    }else{

    }
});



})(jQuery);
