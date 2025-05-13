var bulkcheckboxarr = new Array();
var filterReleaseoption = "";
var filterActivityoption = "";
(function ($) {

$.fn.dataTable.ext.errMode = 'none';
    //    "use strict";
    
$("#projectId").html("");
$("#projectId").selectpicker('refresh');

$("#releaseId").html("");
$("#releaseId").selectpicker('refresh');

$("#activityId").html("");
$("#activityId").selectpicker('refresh');

$("#assignto").html("");
$("#assignto").selectpicker('refresh');

$("#tblfilterprojectId").html("");
$("#tblfilterprojectId").selectpicker('refresh');

$("#tblfilterreleaseId").html("");
$("#tblfilterreleaseId").selectpicker('refresh');

$("#tblfilteractivityId").html("");
$("#tblfilteractivityId").selectpicker('refresh');


    /**
     * Function to get all active projects from database and append them to both
     * projectId and tblfilterprojectId select elements.
     * @return {Promise} A promise object that resolves to true if the operation is
     * successful and rejects to true if there is an error.
     */
var p1 = function(){
    return new Promise(function(resolve, reject){
        console.log('p1');
        
        $.ajax({
                   type: "GET",
                   url: STEP_root+'api/getActiveproject.php',
                   dataType:'json',
                   data:  {'formtype':'Project'}, // serializes the form's elements.
                   success: function(data)
                   {
                      if(data != null && data['data']!=null){
                        $.each( data['data'], function( key, value ) {
                          $("#projectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                          $("#tblfilterprojectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                        });
                      }

                     $("#projectId").selectpicker('refresh');
                     $("#tblfilterprojectId").selectpicker('refresh');
                     resolve(true);
                   },error:function (jqXHR, textStatus, errorThrown) {
                     reject(true);
                    }
               });
  
    });
};

/**
 * Function to get all active releases from database and append them to 
 * tblfilterreleaseId select element.
 * @return {Promise} A promise object that resolves to true if the operation is
 * successful and rejects to true if there is an error.
 */
var p2 = function(){
    return new Promise(function(resolve, reject){
        console.log('p2 FilterRelease');
        
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'allFilterRelease'}, 
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#tblfilterreleaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                filterReleaseoption += "<option value='"+value['id']+"' >"+value['releaseId']+"</option>";
              });
            }
            $("#tblfilterreleaseId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};


/**
 * Function to get all active activities from database and append them to 
 * tblfilteractivityId select element.
 * @return {Promise} A promise object that resolves to true if the operation is
 * successful and rejects to true if there is an error.
 */
var p3 = function(){
    return new Promise(function(resolve, reject){
        
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'allFilterActivity'}, // serializes the form's elements.
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#tblfilteractivityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
                filterActivityoption += "<option value='"+value['id']+"' >"+value['activityId']+"</option>";
              });
            }
            $("#tblfilteractivityId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};
p1().then(p2).then(p3).then(function(){
     // Hurray! All done!

});

/**
 * Download a report of the testsuite table data based on the selected filters.
 * @param  {None} 
 * @return {None}
 */
function downloadReport(){
  var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : "");
  var nReleaseId = ($("#tblfilterreleaseId").val() != null ? $("#tblfilterreleaseId").val() : "");
  var ndefectId = ($("#tblfilteractivityId").val() != null ? $("#tblfilteractivityId").val() : "");
  var nData= "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+ndefectId;

  window.open(STEP_root+"api/reportTestsuite.php?"+nData,'_blank');
}
  /** initialize testsuite table */
var releaseTable =  $('#testsuiteTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        formatErrorMessage("","");

    } ).DataTable({
      responsive: true,
      "ajax": {
        "type":"POST",
        "url": STEP_root+"api/getallTestsuite.php",
        "data": function (d) {
            var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : "");
            var nReleaseId = ($("#tblfilterreleaseId").val() != null ? $("#tblfilterreleaseId").val() : "");
            var ndefectId = ($("#tblfilteractivityId").val() != null ? $("#tblfilteractivityId").val() : "");
            return "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+ndefectId;
 
        }
      },
      "columnDefs": [
        {
          "orderable": false,
          'targets': [0],
          "visible": false,
          "class": "text-left",
          "render": function ( data, type, row ) {
            return '<div class="custom-control custom-checkbox">'+
                      '<input type="checkbox" class="custom-control-input" id="checkbox'+data+'">'+
                      '<label class="custom-control-label" for="checkbox'+data+'">&nbsp;</label>'+
                  '</div>';
          }
        },  
        {
          "orderable": false,
          'targets': [1],
          "class": "text-left",
          "render": function ( data, type, row ) {
              
              return '<a href="'+STEP_root+'master/testexecutionnew.php?id='+row[0]+'" class="text-step"><b>'+data+'</b> </a>';
          }
        },  
        {
          "orderable": true,
          'targets': [2],
          "class": "text-left",
          "type": 'natural'
        },
          {
            "orderable": false,
            "targets": -1,
            "visible": ((localStorage.getItem("usertype") == "Admin") || (localStorage.getItem("ruleIds").split(",").indexOf("20") !== -1)) ? true : false,
            "class":"text-left",
            render: function ( data, type, row ) {
            return '<a href="JavaScript:void(0)" id="deleteTestsuite'+data+'" data-id="'+data+'" >'+
                    '  <span class="fa fa-trash text-danger "></span>'+
                  ' </a>';
            }           
        }, 
        {
          "orderable": true,
          "targets": 2,
          "class":"text-left",           
        },
        {"orderable": true,"targets":[1,2,3,5,6,7,8],"class":"text-left"}  
      ],
      scrollY: '500px',       // Set your desired height
      scrollCollapse: true,   // Collapse the table height if fewer rows
      "scrollX": true,
      "pageLength": 25,
      "paging": true,
      "info": true,
      "stateSave": true,
      "sDom": "<'dt-panelmenu  clearfix'<'col-sm-8 text-left'lB><'col-sm-4'f>>" +
                  "<'row'<'col-sm-12'tr>>" +
                  "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                  "buttons": [
          {
              "extend": 'collection',
              "autoClose": 'true',
              "text":'<span style="padding-right:5px; float:left" ><i class="fa fa-download"></i>&nbsp; Test Execution Report</span>',

              "buttons": [
                  {
                      "text": 'Excel',
                      "title": 'Test Execution Report',
                      action: function ( e, dt, node, config ) {
                          downloadReport();
                      }
                  },
              ]
          }
      ]
	});
  releaseTable.buttons().container().appendTo('#exportButtonsContainer');

/** delete testsuite based on id */
 $( document ).on( "click", "[id^=deleteTestsuite]", function(e) {
        // prevent default action
        e.preventDefault();

        var currentId = $(this).attr("data-id");
        if(currentId != "0"){
          $.confirm({
            title: 'Confirm!',
            content: 'Are you sure you want to delete this record? <br/><div class="alert  alert-info fade show mt-1" role="alert">'+
                                          '      <span class="badge badge-pill badge-info">Note</span> This will delete all dependencies'+
                                          '     <button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                          ' </div>',
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
                          data:  {"id":currentId,"formtype":"Testsuite"}, // serializes the form's elements.
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

/** get details of testsuite based on id */
    $( document ).on( "click", "[id^=editTestsuite]", function(e) {
        // prevent default action
        e.preventDefault();

          var currentId = $(this).attr("data-id");
          if(currentId != "0"){
               $.ajax({
                   type: "POST",
                   url: STEP_root+'api/getSingleedit.php',
                   dataType:'json',
                   data:  {"id":currentId,"formtype":"Testsuite"}, // serializes the form's elements.
                   success: function(data)
                   {
                    if(data !=null){
                        if(data['id'] !=null){
                            $("#testsuiteDBId").val(data['id']);
                            $("#testsuitename").val(data['testsuitename']);
                            $("#testsuitename").attr("data-exist",data['testsuitename']);

                            $("#testsuitedesc").val(data['testsuitedesc']);

                            $("#projectId").val(data['projectId']);
                            $("#projectId").attr("data-exist",data['projectId']);

                            $("#informationalert").html("");
                            if(data['editable'] != null && data['editable'] >0){

                              $("#informationalert").html(' Project/Release/Activity is not changable because testcases are already assign to this testsuite.');
                              $('#projectId').prop('disabled', true);
                            }else{
                              $('#projectId').prop('divsabled', false);
                            }
                            $("#projectId").selectpicker('refresh');

                            getRelease(data['projectId'],0).then(function(){
                                $("#releaseId").val(data['releaseId']);
                                $("#releaseId").attr("data-exist",data['releaseId']);
                                if(data['editable'] != null && data['editable'] >0){
                                  $('#releaseId').prop('disabled', true);
                                }else{
                                  $('#releaseId').prop('disabled', false);
                                }
                                $("#releaseId").selectpicker('refresh');

                                getActivity(data['projectId'],data['releaseId']).then(function(){
                                     $("#activityId").val(data['activityId']);
                                     $("#activityId").attr("data-exist",data['activityId']);

                                   if(data['editable'] != null && data['editable'] >0){
                                      $('#activityId').prop('disabled', true);
                                   }else{
                                      $('#activityId').prop('disabled', false);
                                   }
                                     $("#activityId").selectpicker('refresh');

                                });
                            });
                            
                            getAssignee(data['projectId']).then(function(){
                                 $("#assignto").val(data['assignto']);
                                 $("#assignto").attr("data-exist",data['assignto']);
                                 $("#assignto").selectpicker('refresh');
                            });



                            $("#type").val(data['type']);
                            $("#type").attr("data-exist",data['type']);
                            
                            $("#machinId").val(data['machinId']);
                            $("#machinId").attr("data-exist",data['machinId']);

                            $("#command").val(data['command']);
                            $("#command").attr("data-exist",data['command']);

                            $("#schedularevery").val(data['schedularevery']);
                            $("#schedularevery").attr("data-exist",data['schedularevery']);


                            $("#schedulartype").val(data['schedulartype']);
                            $("#schedulartype").attr("data-exist",data['schedulartype']);
                            var schedulartype = $("#schedulartype").val();
            
                            $("#schedularstart").val('');
                            $("#startimediv").addClass("hidden");
                            if(schedulartype !=""){
                                if(schedulartype == "Day"){
                                      $("#startimediv").removeClass("hidden");
                                }else{
                                    $("#schedularstart").val('');
                                    $("#startimediv").addClass("hidden");
                               }              
                            } 
                            $("#schedchk").prop("checked",false);
                            if(data['schedchk'] == "on"){
                              $("#schedchk").prop("checked",true);
                            }

                            if($("#schedchk").is(":checked")){
                                    $("#schdulingsettingchk").removeClass("hidden");
                            }else{
                                  $("#schdulingsettingchk").addClass("hidden");
                           } 

                            $("#schedularstart").val(data['schedularstart']);
                            $("#schedularstart").attr("data-exist",data['schedularstart']);


                            $("#schedularend").val(data['schedularend']);
                            $("#schedularend").attr("data-exist",data['schedularend']);

                            $("#schdulingsetting").addClass("hidden");
                            $(".autosetting").addClass("hidden");
                            if(data['type'] == "Automation"){
                                  $("#schdulingsetting").removeClass("hidden");
                                  $(".autosetting").removeClass("hidden");
                            }else{
                                $("#schdulingsetting").addClass("hidden");
                                $(".autosetting").addClass("hidden");
                           } 

                        }
                    }

                   },error:function (jqXHR, textStatus, errorThrown) {
                          formatErrorMessage(jqXHR, errorThrown);
                    }
               });
           }else{

           }
        });


$( document ).on( "change", "[id=projectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nPorjectId = this.value;
        getRelease(nPorjectId,0);
        getAssignee(nPorjectId);
});


 $( document ).on( "change", "[id=releaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nReleaseId = this.value;
        var nPorjectId = $("#projectId").val();
        getActivity(nPorjectId,nReleaseId,0);
});

/** get realese and activity based on project filter */
$( document ).on( "change", "[id=tblfilterprojectId]", function(e) {
    // prevent default action
    e.preventDefault();
    var nProjectId = this.value;
    filterRelease().then(filterActivity).then(function(){
    });
});
/** get activity based on realese filter */
$( document ).on( "change", "[id=tblfilterreleaseId]", function(e) {
    // prevent default action
    e.preventDefault();
    filterActivity().then(function(){
    });
});

/**
 * @function filterRelease
 * @description filter release based on project filter
 * @return {Promise} resolves with true
 */
var filterRelease = function(){
    return new Promise(function(resolve, reject){
      var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : '');
        
        $("#tblfilterreleaseId").html('');
        $("#tblfilterreleaseId").selectpicker('refresh');
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'allFilterRelease',"projectId":nProjectId}, // serializes the form's elements.
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#tblfilterreleaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
              });
            }

            $("#tblfilterreleaseId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};

/**
 * @function filterActivity
 * @description filter activity based on project and release filter
 * @return {Promise} resolves with true
 */
var filterActivity = function(){
    return new Promise(function(resolve, reject){
      var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : '');
      var nReleaseId = ($("#tblfilterreleaseId").val() != null ? $("#tblfilterreleaseId").val() : '');
        
      $("#tblfilteractivityId").html('');
      $("#tblfilteractivityId").selectpicker('refresh');
      $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'allFilterActivity',"projectId":nProjectId,"releaseId":nReleaseId}, // serializes the form's elements.
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#tblfilteractivityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
              });
            }

            $("#tblfilteractivityId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};

/**
 * @function getRelease
 * @description get release based on project id and type of release whether for filter or for table
 */
function getRelease(nProjectId,nFlag){

  return new Promise(function(resolve, reject){
    if(nFlag == "1"){
      $("#tblfilterreleaseId").html('');
      $("#tblfilterreleaseId").selectpicker('refresh');
    }else{
      $("#releaseId").html('');
      $("#releaseId").selectpicker('refresh');
    }
    $.ajax({
        type: "POST",
        url: STEP_root+'api/getDropdown.php',
        dataType:'json',
        data:  {'formtype':'Release',"projectId":nProjectId}, // serializes the form's elements.
        success: function(data)
        {
          if(data != null && data['data']!=null){
            $.each( data['data'], function( key, value ) {
              if(nFlag == "1"){
              $("#tblfilterreleaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
            }else{
              $("#releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");

            }
            });
          }
        if(nFlag == "1"){
          $("#tblfilterreleaseId").selectpicker('refresh');
        }else{
          $("#releaseId").selectpicker('refresh');
        }
          resolve(true);
        },error:function (jqXHR, textStatus, errorThrown) {
          reject(true);
        }
    });
  
    });

      
    }
    

/**
 * Fetches the list of assignees for a given project and populates the assignee dropdown.
 */

function getAssignee(nProjectId){

  return new Promise(function(resolve, reject){
    $("#assignto").html('');
    $("#assignto").selectpicker('refresh');
    $.ajax({
      type: "POST",
      url: STEP_root+'api/getDropdown.php',
      dataType:'json',
      data:  {'formtype':'Assignee',"projectId":nProjectId}, // serializes the form's elements.
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
        reject(true);
      }
    });
  });
}

/**
 * Fetches the activity dropdown options based on the given project ID and release ID.
 */
function getActivity(nProjectId,nReleaseID,nFlag){

    return new Promise(function(resolve, reject){
        if(nFlag == 1){
            $("#tblfilteractivityId").html('');
            $("#tblfilteractivityId").selectpicker('refresh');
        }else{
            $("#activityId").html('');
            $("#activityId").selectpicker('refresh');
        }
                    
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'ProjectActivity',"projectId":nProjectId,"releaseId":nReleaseID}, // serializes the form's elements.
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                if(nFlag == 1){
                $("#tblfilteractivityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
              }else{
                $("#activityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");

              }
              });
            }
            if(nFlag == 1){
            $("#tblfilteractivityId").selectpicker('refresh');
            }else{

            $("#activityId").selectpicker('refresh');
            }
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });

      
}

/** save testsuite data using ajax api call */
$('form[id="testsuiteform"]').validate({

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
    "testsuitename": 'required',
    "testsuitedesc": {
          maxlength: textlimit
      }
  },
  messages: {
    "activityId": 'Please enter test plan',
    "projectId": 'Please select project',
    "releaseId": 'Please select release',
    "testsuitename": 'Please enter test suite name',
    "testsuitedesc": {
          maxlength: "You have reached your maximum limit of characters allowed"
      }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     form_data.append('projectId_change',($("#projectId").val() != null && $("#projectId").val() != $("#projectId").attr("data-exist") ? "1":"0"));
     form_data.append('releaseId_change',($("#releaseId").val() != null && $("#releaseId").val() != $("#releaseId").attr("data-exist") ? "1":"0"));
     form_data.append('activityId_change',($("#activityId").val() != null && $("#activityId").val() != $("#activityId").attr("data-exist") ? "1":"0"));
     form_data.append('testsuitename_change',($("#testsuitename").val() != null && $("#testsuitename").val() != $("#testsuitename").attr("data-exist") ? "1":"0"));
     form_data.append('assignto_change',($("#assignto").val() != null && $("#assignto").val() != $("#assignto").attr("data-exist") ? "1":"0"));
     form_data.append('type_change',($("#type").val() != null && $("#type").val() != $("#type").attr("data-exist") ? "1":"0"));
     form_data.append('machinId_change',($("#machinId").val() != null && $("#machinId").val() != $("#machinId").attr("data-exist") ? "1":"0"));
     
     form_data.append('schedularevery_change',($("#schedularevery").val() != null && $("#schedularevery").val() != $("#schedularevery").attr("data-exist") ? "1":"0"));
     form_data.append('schedulartype_change',($("#schedulartype").val() != null && $("#schedulartype").val() != $("#schedulartype").attr("data-exist") ? "1":"0"));
     form_data.append('schedularstart_change',($("#schedularstart").val() != null && $("#schedularstart").val() != $("#schedularstart").attr("data-exist") ? "1":"0"));
     form_data.append('schedularend_change',($("#schedularend").val() != null && $("#schedularend").val() != $("#schedularend").attr("data-exist") ? "1":"0"));
     
     $.ajax({
        url: STEP_root+"api/saveTestsuite.php", //The url where the server req would we made.
        async: false,
        type: "POST", //The type which you want to use: GET/POST
        data: form_data , //The variables which are going.
        dataType: "json", //Return data type (what we expect).
        cache: false,
        contentType: false,
        processData: false,
        //This is the function w1hich will be called if ajax call is successful.
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
   var mymodal = $('#testsuitemodal');
    // mymodal.find('.modal-body').text(data);
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTbl();
}
function reloadTbl(){
  
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
      releaseTable.ajax.reload( null, false );

    $('#select_all').attr("checked",false);
    bulkcheckboxarr.length = 0;
}

    $('.dropdown').on('show.bs.dropdown', function () {
        $('.dataTables_scrollFoot').css("overflow", "visible");
    });
    $('.dropdown').on('hide.bs.dropdown', function () {
        $('.dataTables_scrollFoot').css("overflow", "hidden");
    });
    $('thead input[id="select_all"]').on('click', function(e){ 

      if(this.checked){
         $('#testsuiteTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#testsuiteTbl tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });  
   
   // Handle click on checkbox to set state of "Select all" control
   $('#testsuiteTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
      // If checkbox is not checked
      if(!this.checked){
         var el = $('#select_all').get(0); 
         // If "Select all" control is checked and has 'indeterminate' property
         if(el && el.checked){
            // Set visual state of "Select all" control 
            // as 'indeterminate'
            el.checked = false;
         }
        var index = bulkcheckboxarr.indexOf(parseInt(this.id.match(/\d+/)));
        if(index > -1)
        {
            bulkcheckboxarr.splice(index,1)
        }
      }else
      {
          bulkcheckboxarr.push(parseInt(this.id.match(/\d+/)));
        }
   });
   

/** bulk action to make testsuite active or inactive */
    $( document ).on( "click", ".bulkAction", function(e) {
        // prevent default action
        e.preventDefault();

        var nType = $(this).attr("data-type");
        if(bulkcheckboxarr.length > 0){
              $.ajax({
              url: STEP_root+"api/bulkAction.php", //The url where the server req would we made.
              async: false,
              type: "POST", //The type which you want to use: GET/POST
              data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=Testsuite", //The variables which are going.
              dataType: "html", //Return data type (what we expect).
              //This is the function which will be called if ajax call is successful.
              success: function(data)
              { 
                  releaseTable.ajax.reload( null, false );
                  $('#select_all').attr("checked",false);
                  bulkcheckboxarr.length = 0;
              },error:function (jqXHR, textStatus, errorThrown) {
                    formatErrorMessage(jqXHR, errorThrown);
              }
          });
        }else
        {
        }
   
      });

$( document ).on( "change", "[id=testsuitedesc],[id=command]", function(e) {
        // prevent default action
        e.preventDefault();
        var nId = $(this).attr("id");
        $("#"+nId+"_change").val(1);
});

$('#testsuitemodal').on('hidden.bs.modal', function () {
  $('#testsuiteform').trigger("reset");

  $("#informationalert").html("");

  $("#activityId").removeAttr("disabled");
  $("#projectId").removeAttr("disabled");
  $("#releaseId").removeAttr("disabled");
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


  $("#schedchk_change").val("0");
  $("#testsuitedesc_change").val("0");
  $("#projectId").attr("data-exist","");
  $("#releaseId").attr("data-exist","");
  $("#testsuitename").attr("data-exist","");
  $("#activityId").attr("data-exist","");
  $("#assignto").attr("data-exist","");

  $("#schedchk").attr("checked",false);
  $("#schdulingsetting").addClass("hidden");
  $("#schdulingsettingchk").addClass("hidden");
  $(".autosetting").addClass("hidden");

  $('#testsuiteform .state-error').css('display', 'none');

});


   $( document ).on( "change", "[id=tblfilterprojectId],[id=tblfilterreleaseId],[id=tblfilteractivityId]", function(e) {
     // prevent default action
      e.preventDefault();
      releaseTable.ajax.reload( null, false );

  });



$( document ).on( "click", "#resetFilter", function(e) {
        // prevent default action
        e.preventDefault();
        

          $("#tblfilterprojectId").val('default');
          $("#tblfilterprojectId").selectpicker("refresh");

          $("#tblfilterreleaseId").html(filterReleaseoption);
          $("#tblfilterreleaseId").val('default');
          $("#tblfilterreleaseId").selectpicker('refresh');


          $("#tblfilteractivityId").html(filterActivityoption);
          $("#tblfilteractivityId").val('default');
          $("#tblfilteractivityId").selectpicker('refresh');


          reloadTbl();
});


 $( document ).on( "change", "[id=type]", function(e) {
        // prevent default action
        e.preventDefault();
        var nType = $("#type").val();

        $("#schdulingsetting").addClass("hidden");
        $(".autosetting").addClass("hidden");
        if(nType == "Automation"){
              $("#schdulingsetting").removeClass("hidden");
              $(".autosetting").removeClass("hidden");
        }else{
            $("#schdulingsetting").addClass("hidden");
            $(".autosetting").addClass("hidden");
        }  
});


 $( document ).on( "change", "[id=schedchk]", function(e) {
      // prevent default action
      e.preventDefault();

      $("#schedchk_change").val(1);
      if($("#schedchk").is(":checked")){
          $("#schdulingsettingchk").removeClass("hidden");
      }else{
        $("#schdulingsettingchk").addClass("hidden");
      }   
});
 $( document ).on( "change", "[id=schedulartype]", function(e) {
    // prevent default action
    e.preventDefault();
    var schedulartype = $("#schedulartype").val();

    $("#schedularstart").val('');
    $("#startimediv").addClass("hidden");
    if(schedulartype !=""){
        if(schedulartype == "Day"){
              $("#startimediv").removeClass("hidden");
        }else{
            $("#schedularstart").val('');
            $("#startimediv").addClass("hidden");
        }              
    } 
});


$('#schedularend').datetimepicker({
    format: 'yyyy-mm-dd hh:ii',
    minuteStep: 1,
    pickerPosition: 'top-right',
});

$('#schedularstart').datetimepicker({
    pickDate: false,
    minuteStep: 1,
    pickerPosition: 'top-right',
    format: 'hh:ii',
    autoclose: true,
    showMeridian: true,
    startView: 1,
    maxView: 1,
  });
})(jQuery);
