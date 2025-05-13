var bulkcheckboxarr = new Array();
var filterReleaseoption = "";
var filterModuleoption = "";
var filterSubmoduleoption = "";
var filterTCoption = "";
var sno = 0;
(function ($) {
  
$.fn.dataTable.ext.errMode = 'none';
    //    "use strict";
$("#filter_projectId").html("");
$("#filter_projectId").selectpicker('refresh');

$("#filter_releaseId").html("");
$("#filter_releaseId").selectpicker('refresh');

$("#filter_module").html("");
$("#filter_module").selectpicker('refresh');

$("#filter_submodule").html("");
$("#filter_submodule").selectpicker('refresh');

$("#filter_testcaseId").html("");
$("#filter_testcaseId").selectpicker('refresh');

$("#filter_category").html("");
$("#filter_category").selectpicker('refresh');
/// end of filter
$("#projectId").html("");
$("#projectId").selectpicker('refresh');

$("#releaseId").html("");
$("#releaseId").selectpicker('refresh');

$("#activityId").html("");
$("#activityId").selectpicker('refresh');

$("#assignto").html("");
$("#assignto").selectpicker('refresh');

$("#reviewer").html("");
$("#reviewer").selectpicker('refresh');

$("#category").html("");
$("#category").selectpicker('refresh');

$("#scenarioIdstr").val("");
$("#scenarioId").html("");
$("#scenarioId").selectpicker('refresh');

/**
 * p1: Load active projects in the page
 * @return {Promise}
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
                          $("#copy_projectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                          $("#move_projectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                          $("#upload_projectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                          $("#filter_projectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                        });
                      }

                     $("#filter_projectId").selectpicker('refresh');
                     $("#projectId").selectpicker('refresh');
                     $("#copy_projectId").selectpicker('refresh');
                     $("#move_projectId").selectpicker('refresh');
                     $("#upload_projectId").selectpicker('refresh');
                     resolve(true);
                   },error:function (jqXHR, textStatus, errorThrown) {
                     resolve(true);
                    }
               });
  
    });
};
/**
 * p2: Load all active Employees in the page
 * @return {Promise}
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
                           $("#filter_category").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
                        });
                      }

                     $("#category").selectpicker('refresh');
                     $("#filter_category").selectpicker('refresh');
                     resolve(true);
                   },error:function (jqXHR, textStatus, errorThrown) {
                     resolve(true);
                    }
               });
  
    });
};


/**
 * p3: Load all active releases in the page
 * @return {Promise}
 */
var p3 = function(){
    return new Promise(function(resolve, reject){
        
        $.ajax({
                   type: "POST",
                   url: STEP_root+'api/getDropdown.php',
                   dataType:'json',
                   data:  {'formtype':'allFilterRelease'}, 
                   success: function(data)
                   {
                      if(data != null && data['data']!=null){
                        $.each( data['data'], function( key, value ) {
                          $("#filter_releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                          filterReleaseoption += "<option value='"+value['id']+"' >"+value['releaseId']+"</option>";
                        });
                      }
                     $("#filter_releaseId").selectpicker('refresh');
                     resolve(true);
                   },error:function (jqXHR, textStatus, errorThrown) {
                     resolve(true);
                    }
               });
  
    });
};

/**
 * p4: Load all active test cases in the page
 * @return {Promise}
 */
var p4 = function(){
    return new Promise(function(resolve, reject){
        
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'allFilterTestcase'},
          success: function(data)
          {
            var modarr = new Array();
            var submodarr = new Array();
            var tcarr = new Array();
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                if(jQuery.inArray(value['testcasename'], tcarr) <0){
                    tcarr.push(value['testcasename']);
                    $("#filter_testcaseId").append("<option value='"+value['testcasename']+"' >"+value['testcasename']+"</option>");
                    filterTCoption += "<option value='"+value['testcasename']+"' >"+value['testcasename']+"</option>";
                }
                if(jQuery.inArray(value['modulename'], modarr) <0){
                    modarr.push(value['modulename']);
                    $("#filter_module").append("<option value='"+value['modulename']+"' >"+value['modulename']+"</option>");
                    filterModuleoption += "<option value='"+value['modulename']+"' >"+value['modulename']+"</option>";
                }
                if(jQuery.inArray(value['submodulename'], submodarr) <0){
                  submodarr.push(value['submodulename']);
                  $("#filter_submodule").append("<option value='"+value['submodulename']+"' >"+value['submodulename']+"</option>");
                  filterSubmoduleoption += "<option value='"+value['submodulename']+"' >"+value['submodulename']+"</option>";
                }

              });
            }

            $("#filter_testcaseId").selectpicker('refresh');
            $("#filter_module").selectpicker('refresh');
            $("#filter_submodule").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};
p1().then(p2).then(tccategory).then(p3).then(p4).then(function(){
        getScenario(0,0);
});

/** initialize test case table */
var releaseTable =  $('#testcaseTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        console.log( 'An error has been reported by DataTables: ', message );
        formatErrorMessage("","");

    } ).DataTable({
        responsive: true,
        "ajax": {
        "type":"POST",
        "url": STEP_root+"api/getallTestcaselist.php",
        "data": function (d) {
            var nProjectId = ($("#filter_projectId").val() != null ? $("#filter_projectId").val() : "");
            var nReleaseId = ($("#filter_releaseId").val() != null ? $("#filter_releaseId").val() : "");
            var nModule = ($("#filter_module").val() != null ? $("#filter_module").val() : "");
            var nSubmodule = ($("#filter_submodule").val() != null ? $("#filter_submodule").val() : "");
            var nCategory = ($("#filter_category").val() != null ? $("#filter_category").val() : "");
            var nTestcase = ($("#filter_testcaseId").val() != null ? $("#filter_testcaseId").val() : "");
            return "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&module="+nModule+"&&submodule="+nSubmodule+"&&category="+nCategory+"&&testcaseId="+nTestcase;
        }
      },
      "columnDefs": [
          {
                "orderable": false,
                "visible": true,
                'targets': [0],
                  "class": "text-left",
                "render": function ( data, type, row ) {
                  return '<div class="custom-control custom-checkbox">'+
                            '<input type="checkbox" class="custom-control-input" id="checkbox'+data+'">'+
                            '<label class="custom-control-label" for="checkbox'+data+'">&nbsp;</label>'+
                        '</div>';
                }
          }, 
          {
              "orderable": true,
              'targets': [1],
              "type": 'natural-nohtml',
                "class": "text-left",
              "render": function ( data, type, row ) {
                return '<a href="'+STEP_root+'master/testcasedetails.php?id='+row[0]+'" class="text-step"><b>'+data+'</b> </a>';
              }   
          }, 
          {
            "orderable": false,
            "visible": ((localStorage.getItem("usertype") == "Admin") || (localStorage.getItem("ruleIds").split(",").indexOf("16") !== -1)) ? true : false,
            "targets": -1,
            "class":"text-left",
              render: function ( data, type, row ) {
              return '<a href="JavaScript:void(0)" id="deleteTestcase'+data+'" data-id="'+data+'" >'+
                      '  <span class="fa fa-trash text-danger "></span>'+
                    ' </a>';
              }           
          },
          {
            "orderable": true,"targets":[12],"class":"text-left wrap-text",
         	render: renderDescriptionhtmlColumn
          },
          {"visible": false,"orderable": false,"targets":[2,3,4,6,8,9,10,11,13,14,15,16,17,18,19],"class":"text-left"} , 
          {"orderable": true,"targets":[2,3,4,5,6,7,8,9,10,11,12,13,14,15],"class":"text-left"}  
        ],
        "drawCallback": function (settings) { 
            $('[data-toggle="popover"]').popover();
        },
	scrollY: '500px',       // Set your desired height
	scrollCollapse: true,   // Collapse the table height if fewer rows
        "scrollX": true,
        "pageLength": 25,
        "paging": true,
        "info": true,
        "stateSave": true,            
        dom: '<"row"<"col-md-12"<"row"<"col-md-6"lB><"col-md-6"f> > ><"col-md-12"rt> <"col-md-12"<"row"<"col-md-5"i><"col-md-7"p>>> >',
        buttons: {
            buttons: [
                { extend: 'excel', className: 'btn ml-3',text:'<span style="padding-right:5px; float:left" ><i class="fa fa-download"></i>&nbsp; Test Cases Export</span>',
                    "title": "Test Cases Export",
                    "exportOptions": {
                          "columns": ':not(.notexport)',
                          "orthogonal": 'export'
                    } ,
                    action: function ( e, dt, node, config ) {
                          var nProjectId = ($("#filter_projectId").val() != null ? $("#filter_projectId").val() : "");
                          var nReleaseId = ($("#filter_releaseId").val() != null ? $("#filter_releaseId").val() : "");
                          var nModule = ($("#filter_module").val() != null ? $("#filter_module").val() : "");
                          var nSubmodule = ($("#filter_submodule").val() != null ? $("#filter_submodule").val() : "");
                          var nCategory = ($("#filter_category").val() != null ? $("#filter_category").val() : "");
                          var nTestcase = ($("#filter_testcaseId").val() != null ? $("#filter_testcaseId").val() : "");
                          var dform = $(document.createElement('form'));
                          $(dform).attr("action", STEP_root+"api/getTCexport.php");
                          $(dform).attr("method", "POST");

                          var inputname = $("<input>").attr("type", "hidden").attr("name", "projectId").val(nProjectId);
                          $(dform).append($(inputname));
                          
                          var inputname1 = $("<input>").attr("type", "hidden").attr("name", "releaseId").val(nReleaseId);
                          $(dform).append($(inputname1));

                          var inputname2 = $("<input>").attr("type", "hidden").attr("name", "module").val(nModule);
                          $(dform).append($(inputname2));

                          var inputname3 = $("<input>").attr("type", "hidden").attr("name", "submodule").val(nSubmodule);
                          $(dform).append($(inputname3));

                          var inputname4 = $("<input>").attr("type", "hidden").attr("name", "category").val(nCategory);
                          $(dform).append($(inputname4));

                          var inputname5 = $("<input>").attr("type", "hidden").attr("name", "testcaseId").val(nTestcase);
                          $(dform).append($(inputname5));

                          dform.appendTo( document.body );
                          $(dform).submit();
                          $(dform).remove();


                    }
                },
                { extend: 'excel', className: 'btn ml-3',text:'<span style="padding-right:5px; float:left" ><i class="fa fa-download"></i>&nbsp; Test Cases Steps Export</span>',
                    "title": "Test Cases Steps Export",
                    "exportOptions": {
                          "columns": ':not(.notexport)',
                          "orthogonal": 'export'
                    } ,
                    action: function ( e, dt, node, config ) {
                        var nProjectId = ($("#filter_projectId").val() != null ? $("#filter_projectId").val() : "");
                        var nReleaseId = ($("#filter_releaseId").val() != null ? $("#filter_releaseId").val() : "");
                        var nModule = ($("#filter_module").val() != null ? $("#filter_module").val() : "");
                        var nSubmodule = ($("#filter_submodule").val() != null ? $("#filter_submodule").val() : "");
                        var nCategory = ($("#filter_category").val() != null ? $("#filter_category").val() : "");
                        var nTestcase = ($("#filter_testcaseId").val() != null ? $("#filter_testcaseId").val() : "");
                        var dform = $(document.createElement('form'));
                        $(dform).attr("action", STEP_root+"api/getTCexport1.php");
                        $(dform).attr("method", "POST");

                        var inputname = $("<input>").attr("type", "hidden").attr("name", "projectId").val(nProjectId);
                        $(dform).append($(inputname));
                        
                        var inputname1 = $("<input>").attr("type", "hidden").attr("name", "releaseId").val(nReleaseId);
                        $(dform).append($(inputname1));

                        var inputname2 = $("<input>").attr("type", "hidden").attr("name", "module").val(nModule);
                        $(dform).append($(inputname2));

                        var inputname3 = $("<input>").attr("type", "hidden").attr("name", "submodule").val(nSubmodule);
                        $(dform).append($(inputname3));

                        var inputname4 = $("<input>").attr("type", "hidden").attr("name", "category").val(nCategory);
                        $(dform).append($(inputname4));

                        var inputname5 = $("<input>").attr("type", "hidden").attr("name", "testcaseId").val(nTestcase);
                        $(dform).append($(inputname5));

                        dform.appendTo( document.body );
                        $(dform).submit();
                        $(dform).remove();


                    }
                }
            ]
        }
	});

releaseTable.buttons().container().appendTo('#exportButtonsContainer');

 	$( document ).on( "click", "[id=addStep]", function(e) {
      // prevent default action
      e.preventDefault();
      sno = sno+1;  
      stepsTbl.row.add( ["","","",""] ).draw();
        
    });

  $( document ).on( "click", ".deleteSteps", function(e) {
        // prevent default action
        e.preventDefault();
        stepsTbl
        .row( $(this).parents('tr') )
        .remove()
        .draw();
        
  });

  /** delete testcase by id */
 $( document ).on( "click", "[id^=deleteTestcase]", function(e) {
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
                      data:  {"id":currentId,"formtype":"Testcase"}, 
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

/** get testcase details by id */
    $( document ).on( "click", "[id^=editTestcase]", function(e) {
      // prevent default action
      e.preventDefault();

      var currentId = $(this).attr("data-id");
      if(currentId != "0"){
            $.ajax({
              type: "POST",
              url: STEP_root+'api/getSingleedit.php',
              dataType:'json',
              data:  {"id":currentId,"formtype":"Testcase"}, // serializes the form's elements.
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
                        $("#steps").val(data['steps']);
                        $("#expectedresult").val(data['expectedresult']);
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

                        getRelease(data['projectId'],1).then(function(){
                          
                            $("#releaseId").val(data['releaseId']);
                            $("#releaseId").attr("data-exist",data['releaseId']);
                              if(data['editable'] != null && data['editable'] >0){
                                $('#releaseId').prop('disabled', true);
                              }else{
                                $('#releaseId').prop('disabled', false);
                              }
                              $("#releaseId").selectpicker('refresh');

                            getActivity(data['projectId'],data['releaseId'],1).then(function(){
                                
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
//** detech change in data and raise a flag */
$( document ).on( "change", "[id=testscenariodesc],[id=testcasedesc],[id=steps],[id=expectedresult],[id=precondition],[id=testdata],[id=comment]", function(e) {
        // prevent default action
        e.preventDefault();
        var nId = $(this).attr("id");
        $("#"+nId+"_change").val(1);
});
$('#copymodal').on('shown.bs.modal', function() { 

        $("#copy_activityId").html("");
        $("#copy_activityId").val('default');
        $("#copy_activityId").selectpicker("refresh");
        $("#copy_projectId").val('default');
        $("#copy_projectId").selectpicker("refresh");
        $("#copy_releaseId").html("");
        $("#copy_releaseId").val('default');
        $("#copy_releaseId").selectpicker("refresh");
}) ;

   $('#movemodal').on('shown.bs.modal', function() { 

            $("#move_activityId").html("");
            $("#move_activityId").val('default');
            $("#move_activityId").selectpicker("refresh");
            $("#move_projectId").val('default');
            $("#move_projectId").selectpicker("refresh");
            $("#move_releaseId").html("");
            $("#move_releaseId").val('default');
            $("#move_releaseId").selectpicker("refresh");
    }) ;

   $('#uploadmodal').on('shown.bs.modal', function() { 

            $("#upload_projectId").val('default');
            $("#upload_projectId").selectpicker("refresh");
            $("#upload_releaseId").html("");
            $("#upload_releaseId").val('default');
            $("#upload_releaseId").selectpicker("refresh");
    }) ;
    
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

    $( document ).on( "change", "[id=copy_projectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nPorjectId = this.value;
        getRelease(nPorjectId,2);
});
    $( document ).on( "change", "[id=move_projectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nPorjectId = this.value;
        getRelease(nPorjectId,3);
});

    $( document ).on( "change", "[id=upload_projectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nPorjectId = this.value;
        getRelease(nPorjectId,4);
});

 $( document ).on( "change", "[id=copy_releaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nReleaseId = this.value;
        var nPorjectId = $("#copy_projectId").val();
        getActivity(nPorjectId,nReleaseId,2);
});

 $( document ).on( "change", "[id=move_releaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nReleaseId = this.value;
        var nPorjectId = $("#move_projectId").val();
        getActivity(nPorjectId,nReleaseId,3);
});
 $( document ).on( "change", "[id=scenarioId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nVal = $('#scenarioId option:selected').text();
          $("#scenarioIdstr").val(nVal);

});



    /**
     * Fetches the release dropdown options based on the given project ID and flag.
     * 
     * @param {number} nProjectId - The ID of the project.
     * @param {number} nFlag - The flag indicating which release dropdown to update.
     *    - 1: $("#releaseId")
     *    - 2: $("#copy_releaseId")
     *    - 3: $("#move_releaseId")
     *    - 4: $("#upload_releaseId")
     * @return {Promise} - Resolves to true when the release dropdown has been updated.
     */
function getRelease(nProjectId,nFlag){

    return new Promise(function(resolve, reject){
        if(nFlag == 1){
          $("#releaseId").html('');
          $("#releaseId").selectpicker('refresh');
        }else if(nFlag == 2){
          $("#copy_releaseId").html('');
          $("#copy_releaseId").selectpicker('refresh');
        }else if(nFlag == 3){
          $("#move_releaseId").html('');
          $("#move_releaseId").selectpicker('refresh');
        }else if(nFlag == 4){
          $("#upload_releaseId").html('');
          $("#upload_releaseId").selectpicker('refresh');
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
                  if(nFlag == 1){
                    $("#releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                  }else if(nFlag == 2){
                    $("#copy_releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                  }else if(nFlag == 3){
                    $("#move_releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                  }else if(nFlag == 4){
                    $("#upload_releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                  }
                });
              }
              if(nFlag == 1){
                $("#releaseId").selectpicker('refresh');
              }else if(nFlag == 2){
                $("#copy_releaseId").selectpicker('refresh');
                }else if(nFlag == 3){
                  $("#move_releaseId").selectpicker('refresh');
                }else if(nFlag == 4){
                  $("#upload_releaseId").selectpicker('refresh');
                }
              resolve(true);
            },error:function (jqXHR, textStatus, errorThrown) {
              reject(true);
            }
        });
    });
  }


/**
 * Fetches and populates the assignee dropdown based on the given project ID.
 * Sends an AJAX request to the server to retrieve assignee data and updates the dropdown options.
 * 
 * @param {number} nProjectId - The ID of the project for which to fetch assignee details.
 * @returns {Promise} Resolves true if the dropdown is populated successfully.
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
          resolve(true);
        }
      });
  
    });
}


/**
 * Fetches and populates test case and module dropdowns based on the given project, release, and module filters.
 * Sends an AJAX request to the server to retrieve relevant test cases and updates the dropdown options.
 * 
 * @param {string} nProjectId - The ID of the selected project.
 * @param {string} nReleaseId - The ID of the selected release.
 * @param {string} nModule - The name of the selected module. If empty, fetches all modules.
 * @returns {Promise} Resolves true if the dropdowns are populated successfully.
 */

function getFilterTC(nProjectId,nReleaseId,nModule){

    return new Promise(function(resolve, reject){
          $("#filter_testcaseId").html('');
          $("#filter_testcaseId").selectpicker('refresh');
          if(nModule == ""){
            $("#filter_module").html('');
            $("#filter_module").selectpicker('refresh');
          }
          $.ajax({
              type: "POST",
              url: STEP_root+'api/getDropdown.php',
              dataType:'json',
              data:  {'formtype':'FilterTestcase',"projectId":nProjectId,"releaseId":nReleaseId,"module":nModule}, // serializes the form's elements.
              success: function(data)
              {
              var modarr = new Array();
              if(data != null && data['data']!=null){
                $.each( data['data'], function( key, value ) {
                  $("#filter_testcaseId").append("<option value='"+value['testcaseid']+"' >"+value['testcasename']+"</option>");
                  if(nModule == ""){
                    if(jQuery.inArray(value['modulename'], modarr) <0){
                      modarr.push(value['modulename']);
                      $("#filter_module").append("<option value='"+value['modulename']+"' >"+value['modulename']+"</option>");
                    }
                  }
                });
              }

                $("#filter_testcaseId").selectpicker('refresh');
                if(nModule == ""){
                  $("#filter_module").selectpicker('refresh');
                }
                resolve(true);
              },error:function (jqXHR, textStatus, errorThrown) {
                resolve(true);
              }
          });
  
    });

      
    }
  /**
   * Fetches the scenario dropdown options based on the given project ID and flag.
   * @param {number} nProjectId - The ID of the project.
   * @param {number} nFLag - A flag indicating whether to fetch all scenarios (1) or only active scenarios (2).
   * @returns {Promise} Resolves true if the dropdown is populated successfully.
   */
function getScenario(nProjectId,nFLag){

    return new Promise(function(resolve, reject){
          $("#scenarioId").html('');
          $("#scenarioId").selectpicker('refresh');
          $.ajax({
            type: "POST",
            url: STEP_root+'api/getDropdown.php',
            dataType:'json',
            data:  {'formtype':'TestcaseScenario',"projectId":nProjectId,"flag":nFLag}, // serializes the form's elements.
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

  /**
   * Fetches the activity dropdown options based on the given project ID and release ID.
   * 
   * @param {number} nProjectId - The ID of the project.
   * @param {number} nReleaseID - The ID of the release.
   * @param {number} nFlag - The flag indicating which activity dropdown to update.
   *    - 1: $("#activityId")
   *    - 2: $("#copy_activityId")
   *    - 3: $("#move_activityId")
   * @return {Promise} - Resolves to true when the activity dropdown has been updated.
   */
function getActivity(nProjectId,nReleaseID,nFlag){

    return new Promise(function(resolve, reject){
      if(nFlag == 1){
          $("#activityId").html('');
          $("#activityId").selectpicker('refresh');
      }else if(nFlag == 2){
          $("#copy_activityId").html('');
          $("#copy_activityId").selectpicker('refresh');
      }else if(nFlag == 3){
          $("#move_activityId").html('');
          $("#move_activityId").selectpicker('refresh');
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
                $("#activityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
              }else if(nFlag == 2){
                $("#copy_activityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
              }else if(nFlag == 3){
                $("#move_activityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
              }
            });
          }
          if(nFlag == 1){
              $("#activityId").selectpicker('refresh');
            }else if(nFlag == 2){
              $("#copy_activityId").selectpicker('refresh');
            }else if(nFlag == 3){
              $("#move_activityId").selectpicker('refresh');
            }
          resolve(true);
        },error:function (jqXHR, textStatus, errorThrown) {
          resolve(true);
        }
      });
  
    });
}
//** save testcase data to database */
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
      "steps": {
          maxlength: textlimit
      },
      "expectedresult": {
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
    "steps": {
      maxlength: "You have reached your maximum limit of characters allowed"
    },
    "expectedresult": {
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
        url: STEP_root+"api/saveTestcasenew.php", //The url where the server req would we made.
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
   var mymodal = $('#testcasemodal');
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
    $("#reviewer").val('default');
    $("#reviewer").selectpicker("refresh");
    $("#category").val('default');
    $("#category").selectpicker("refresh");
    $("#scenarioId").html("");
    $("#scenarioIdstr").val();
    $("#scenarioId").val('default');
    $("#scenarioId").selectpicker("refresh");

    releaseTable.ajax.reload( null, false );
    $('#select_all').attr("checked",false);
    bulkcheckboxarr.length = 0;
}

//** this function copies the testcases */
$('form[id="copyform"]').validate({

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
    "releaseId": 'required'
  },
  messages: {
    "activityId": 'Please select testtype',
    "projectId": 'Please select project',
    "releaseId": 'Please select release'
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     form_data.append('ids',bulkcheckboxarr);
     $.ajax({
        url: STEP_root+"api/copyTestcasenew.php", //The url where the server req would we made.
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

                  var mymodal = $('#copymodal');
                  mymodal.modal('hide');
                  $(form)[0].reset();
                  $("#copy_activityId").val('default');
                  $("#copy_activityId").selectpicker("refresh");
                  $("#copy_projectId").val('default');
                  $("#copy_projectId").selectpicker("refresh");
                  $("#copy_releaseId").html("");
                  $("#copy_releaseId").val('default');
                  $("#copy_releaseId").selectpicker("refresh");
                  releaseTable.ajax.reload( null, false );
                  bulkcheckboxarr.length = 0;
                   $.alert({
                      title: 'Success',
                      content: data['message'],
                      type: 'green',
                      typeAnimated: true
                  });
              }else if(data['status'] == "Error"){

                  var mymodal = $('#copymodal');
                  mymodal.modal('hide');
                  $(form)[0].reset();
                  $("#copy_activityId").val('default');
                  $("#copy_activityId").selectpicker("refresh");
                  $("#copy_projectId").val('default');
                  $("#copy_projectId").selectpicker("refresh");
                  $("#copy_releaseId").html("");
                  $("#copy_releaseId").val('default');
                  $("#copy_releaseId").selectpicker("refresh");
                  releaseTable.ajax.reload( null, false );
                  bulkcheckboxarr.length = 0;
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

/** this moves the testcases to different project,release, activity */
$('form[id="moveform"]').validate({

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
    "releaseId": 'required'
  },
  messages: {
    "activityId": 'Please select testtype',
    "projectId": 'Please select project',
    "releaseId": 'Please select release'
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     form_data.append('ids',bulkcheckboxarr);
     $.ajax({
        url: STEP_root+"api/moveTestcase.php", //The url where the server req would we made.
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
                  var mymodal = $('#movemodal');
                  mymodal.modal('hide');
                  $(form)[0].reset();
                  $("#move_activityId").val('default');
                  $("#move_activityId").selectpicker("refresh");
                  $("#move_projectId").val('default');
                  $("#move_projectId").selectpicker("refresh");
                  $("#move_releaseId").html("");
                  $("#move_releaseId").val('default');
                  $("#move_releaseId").selectpicker("refresh");
                  releaseTable.ajax.reload( null, false );
                  bulkcheckboxarr.length = 0;
                   $.alert({
                      title: 'Success',
                      content: data['message'],
                      type: 'green',
                      typeAnimated: true
                  });
              }else if(data['status'] == "Error"){
                  var mymodal = $('#movemodal');
                  mymodal.modal('hide');
                  $(form)[0].reset();
                  $("#move_activityId").val('default');
                  $("#move_activityId").selectpicker("refresh");
                  $("#move_projectId").val('default');
                  $("#move_projectId").selectpicker("refresh");
                  $("#move_releaseId").html("");
                  $("#move_releaseId").val('default');
                  $("#move_releaseId").selectpicker("refresh");
                  releaseTable.ajax.reload( null, false );
                  bulkcheckboxarr.length = 0;
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
     $('.dropdown').on('show.bs.dropdown', function () {
            $('.dataTables_scrollFoot').css("overflow", "visible");
      });
      $('.dropdown').on('hide.bs.dropdown', function () {
          $('.dataTables_scrollFoot').css("overflow", "hidden");
      });
    $('thead input[id="select_all"]').on('click', function(e){ 

      if(this.checked){
         $('#testcaseTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#testcaseTbl tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });  
   
   // Handle click on checkbox to set state of "Select all" control
   $('#testcaseTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
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
   

/** bulk action to remove the testcases */
    $( document ).on( "click", ".bulkAction", function(e) {
        // prevent default action
        e.preventDefault();

        var nType = $(this).attr("data-type");
        if(bulkcheckboxarr.length > 0){
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
                      url: STEP_root+"api/bulkAction.php", //The url where the server req would we made.
                      async: false,
                      type: "POST", //The type which you want to use: GET/POST
                      data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=Testcase", //The variables which are going.
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
                    }
                }
            }
        });
        }else
        {
            $.alert({
            title: 'Information',
            content: "Please select atleast one testcase to delete.",
            type: 'blue',
            typeAnimated: true
            });
        }
   
});

$.validator.addMethod('filesize', function (value, element, param) {
    return this.optional(element) || (element.files[0].size <= param)
}, 'File size must be less than {0}');


// this function upload the excel file and save the uploaded testcases into database
$('form[id="uploadform"]').validate({

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
    "projectId": 'required',
    "releaseId": 'required',
    "file": {
        required: true,
    },
    "testscenariodesc": {
        maxlength: textlimit
    },
    "testcasedesc": {
        maxlength: textlimit
    },
    "steps": {
        maxlength: textlimit
    },
    "expectedresult": {
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
    "projectId": 'Please select project',
    "releaseId": 'Please select release',
    "file":{
            required:"Please select the file",           
        },
    "testscenariodesc": {
      maxlength: "You have reached your maximum limit of characters allowed"
    },
    "testcasedesc": {
      maxlength: "You have reached your maximum limit of characters allowed"
    },
    "steps": {
      maxlength: "You have reached your maximum limit of characters allowed"
    },
    "expectedresult": {
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
     $.ajax({
        url: STEP_root+"api/uploadTestcasenew.php", //The url where the server req would we made.
        async: false,
        type: "POST", //The type which you want to use: GET/POST
        data: form_data , //The variables which are going.
        dataType: "json", //Return data type (what we expect).
        cache: false,
        contentType: false,
        processData: false,
        //This is the function which will be called if ajax call is successful.
        success: function(data) {

          $("#errmsg").html("");
          if(data != null){
            if(data['status'] != null){
              if(data['status'] == "Success"){
                 var mymodal = $('#uploadmodal');
                  mymodal.modal('hide');
                  $(form)[0].reset();
                  $("#upload_projectId").val('default');
                  $("#upload_projectId").selectpicker("refresh");
                  $("#upload_releaseId").html("");
                  $("#upload_releaseId").val('default');
                  $("#upload_releaseId").selectpicker("refresh");
                  releaseTable.ajax.reload( null, false );
                $.alert({
                      title: 'Success',
                      content: data['message'],
                      type: 'green',
                      typeAnimated: true
                  });
                  if(data['errmsg'] !=null){
                    var errmsg = "";
                     $.each( data['errmsg'], function( nkey, nvalue ) {
                          errmsg += nkey+" at line no. "+nvalue;
                     });
                      $("#errmsg").html('<div class="alert alert-warning alert-dismissible fade show" role="alert" style="height:100px; overflow-y:scroll;" >Last upload error : <br/>'+errmsg+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '  <span aria-hidden="true">&times;</span>'+
                    '</button>'+
                 ' </div>');
                  }
              }else if(data['status'] == "Error"){
                  $.alert({
                      title: 'Encountered an error!',
                      content: data['message'],
                      type: 'red',
                      typeAnimated: true
                  });
                  var mymodal = $('#uploadmodal');
                  mymodal.modal('hide');
                  $(form)[0].reset();
                  $("#upload_projectId").val('default');
                  $("#upload_projectId").selectpicker("refresh");
                  $("#upload_releaseId").html("");
                  $("#upload_releaseId").val('default');
                  $("#upload_releaseId").selectpicker("refresh");
                  releaseTable.ajax.reload( null, false );
                  if(data['errmsg'] !=null){
                    var errmsg = "";
                     $.each( data['errmsg'], function( nkey, nvalue ) {
                          errmsg += nkey+" at line no. "+nvalue;
                     });
                      $("#errmsg").html('<div class="alert alert-warning alert-dismissible fade show" role="alert" style="height:100px; overflow-y:scroll;" >Last upload error : <br/>'+errmsg+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '  <span aria-hidden="true">&times;</span>'+
                    '</button>'+
                 ' </div>');
                  }
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
  $("#steps_change").val("0");
  $("#expectedresult_change").val("0");
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

$("#copymodal").on("shown.bs.modal", function () { 
    if(bulkcheckboxarr.length == 0){
      $.alert({
          title: 'Information',
          content: "Please select atleast one testcase for copy.",
          type: 'blue',
          typeAnimated: true
      });
    }
});
$("#movemodal").on("shown.bs.modal", function () { 
    if(bulkcheckboxarr.length == 0){
      $.alert({
          title: 'Information',
          content: "Please select atleast one testcase to move.",
          type: 'blue',
          typeAnimated: true
      });
    }
});
$('#copymodal').on('hidden.bs.modal', function () {
  $('#copyform').trigger("reset");
  $("#copy_activityId").val('default');
  $("#copy_activityId").selectpicker("refresh");
  $("#copy_projectId").val('default');
  $("#copy_projectId").selectpicker("refresh");
  $("#copy_releaseId").html("");
  $("#copy_releaseId").val('default');
  $("#copy_releaseId").selectpicker("refresh");

  $('#copyform .state-error').css('display', 'none');
});

$('#movemodal').on('hidden.bs.modal', function () {
  $('#moveform').trigger("reset");
  $("#move_activityId").val('default');
  $("#move_activityId").selectpicker("refresh");
  $("#move_projectId").val('default');
  $("#move_projectId").selectpicker("refresh");
  $("#move_releaseId").html("");
  $("#move_releaseId").val('default');
  $("#move_releaseId").selectpicker("refresh");


  $('#moveform .state-error').css('display', 'none');
});

$('#uploadmodal').on('hidden.bs.modal', function () {
  $('#uploadform').trigger("reset");
  $("#upload_projectId").val('default');
  $("#upload_projectId").selectpicker("refresh");
  $("#upload_releaseId").html("");
  $("#upload_releaseId").val('default');
  $("#upload_releaseId").selectpicker("refresh");
  
  $('#uploadform .state-error').css('display', 'none');
});


$( document ).on( "change", "[id=filter_projectId]", function(e) {
      // prevent default action
      e.preventDefault();
      var nProjectId = this.value;
      filterRelease().then(filterModule).then(function(){
      });
});
     
$( document ).on( "change", "[id=filter_releaseId]", function(e) {
      // prevent default action
      e.preventDefault();
      filterModule().then(function(){
      });
});
$( document ).on( "change", "[id=filter_module],[id=filter_submodule]", function(e) {
      // prevent default action
      e.preventDefault();
      filterTC().then(function(){
      });
});
var filterRelease = function(){
    return new Promise(function(resolve, reject){
      var nProjectId = ($("#filter_projectId").val() != null ? $("#filter_projectId").val() : '');
      $("#filter_releaseId").html('');
      $("#filter_releaseId").selectpicker('refresh');
      $.ajax({
        type: "POST",
        url: STEP_root+'api/getDropdown.php',
        dataType:'json',
        data:  {'formtype':'allFilterRelease',"projectId":nProjectId}, // serializes the form's elements.
        success: function(data)
        {
          if(data != null && data['data']!=null){
            $.each( data['data'], function( key, value ) {
              $("#filter_releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
            });
          }

          $("#filter_releaseId").selectpicker('refresh');
          resolve(true);
        },error:function (jqXHR, textStatus, errorThrown) {
          resolve(true);
        }
      });
    });
};
/**
 * Fetches and populates module and submodule dropdowns based on project and release filters.
 * Also populates the test case dropdown with all test cases for the selected project and release.
 * 
 * @return {Promise} Resolves true if the drop downs are populated successfully.
 */
var filterModule = function(){
    return new Promise(function(resolve, reject){
      var nProjectId = ($("#filter_projectId").val() != null ? $("#filter_projectId").val() : '');
      var nReleaseId = ($("#filter_releaseId").val() != null ? $("#filter_releaseId").val() : '');
      
      $("#filter_module").html('');
      $("#filter_module").selectpicker('refresh');

      $("#filter_submodule").html('');
      $("#filter_submodule").selectpicker('refresh');

      $("#filter_testcaseId").html('');
      $("#filter_testcaseId").selectpicker('refresh');
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'allFilterTestcase',"projectId":nProjectId,"releaseId":nReleaseId}, // serializes the form's elements.
          success: function(data)
          {
            var modarr = new Array();
            var submodarr = new Array();
            var tcarr = new Array();
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                if(jQuery.inArray(value['testcasename'], tcarr) <0){
                  tcarr.push(value['testcasename']);
                  $("#filter_testcaseId").append("<option value='"+value['testcasename']+"' >"+value['testcasename']+"</option>");
                }
                
                if(jQuery.inArray(value['modulename'], modarr) <0){
                  modarr.push(value['modulename']);
                  $("#filter_module").append("<option value='"+value['modulename']+"' >"+value['modulename']+"</option>");
                }
                if(jQuery.inArray(value['submodulename'], submodarr) <0){
                  submodarr.push(value['submodulename']);
                  $("#filter_submodule").append("<option value='"+value['submodulename']+"' >"+value['submodulename']+"</option>");
                }
              });
            }

            $("#filter_testcaseId").selectpicker('refresh');
            $("#filter_module").selectpicker('refresh');
            $("#filter_submodule").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};


/**
 * Populates the test case dropdown based on selected project, release, module, and submodule filters.
 * Sends an AJAX request to fetch relevant test cases from the server and updates the dropdown options.
 * 
 * @returns {Promise} Resolves true if the dropdown is populated successfully.
 */
var filterTC = function(){
    return new Promise(function(resolve, reject){
      var nProjectId = ($("#filter_projectId").val() != null ? $("#filter_projectId").val() : '');
      var nReleaseId = ($("#filter_releaseId").val() != null ? $("#filter_releaseId").val() : '');
      var nModule = ($("#filter_module").val() != null ? $("#filter_module").val() : '');
      var nSubmodule = ($("#filter_submodule").val() != null ? $("#filter_submodule").val() : '');
      
      $("#filter_testcaseId").html('');
      $("#filter_testcaseId").selectpicker('refresh');
      $.ajax({
        type: "POST",
        url: STEP_root+'api/getDropdown.php',
        dataType:'json',
        data:  {'formtype':'allFilterTestcase',"projectId":nProjectId,"releaseId":nReleaseId,"module":nModule,"submodule":nSubmodule}, // serializes the form's elements.
        success: function(data)
        {
          var modarr = new Array();
          var tcarr = new Array();
          if(data != null && data['data']!=null){
            $.each( data['data'], function( key, value ) {
              if(jQuery.inArray(value['testcasename'], tcarr) <0){
                  tcarr.push(value['testcasename']);
              $("#filter_testcaseId").append("<option value='"+value['testcasename']+"' >"+value['testcasename']+"</option>");
            }
            });
          }

          $("#filter_testcaseId").selectpicker('refresh');
          resolve(true);
        },error:function (jqXHR, textStatus, errorThrown) {
          resolve(true);
        }
      });
  
    });
};

$( document ).on( "change", "[id=filter_projectId],[id=filter_releaseId],[id=filter_module],[id=filter_submodule],[id=filter_testcaseId],[id=filter_category]", function(e) {
  // prevent default action
    e.preventDefault();
  releaseTable.ajax.reload( null, false );

});



$( document ).on( "click", "#resetFilter", function(e) {
        // prevent default action
        e.preventDefault();
        

          $("#filter_projectId").val('default');
          $("#filter_projectId").selectpicker("refresh");

          $("#filter_releaseId").html(filterReleaseoption);
          $("#filter_releaseId").val('default');
          $("#filter_releaseId").selectpicker('refresh');



          $("#filter_module").html(filterModuleoption);
          $("#filter_module").val('default');
          $("#filter_module").selectpicker('refresh');


          $("#filter_category").val('default');
          $("#filter_category").selectpicker("refresh");

          $("#filter_submodule").html(filterSubmoduleoption);
          $("#filter_submodule").val('default');
          $("#filter_submodule").selectpicker('refresh');

          $("#filter_testcaseId").html(filterTCoption);
          $("#filter_testcaseId").val('default');
          $("#filter_testcaseId").selectpicker('refresh');
          reloadTbl();
});

/** initiliaze testcase step table */
var stepsTbl =  $('#stepsTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        formatErrorMessage("","");
    } ).DataTable({
        responsive: true,
        "columnDefs": [
          {
              "orderable": false,
              'targets': [0],
                "class": "text-left",
              "render": function ( data, type, row ) {
                
                return sno;
            
              }
          }, 
          {
              "orderable": false,
              'targets': [1],
                "class": "text-left",
              "render": function ( data, type, row ) {
                // sno = sno+1;
                return '<textarea  class="form-control"  name="step_desc[]" id="step_desc'+sno+'" rows="2"></textarea>';
            
              }
          }, 
          {
              "orderable": false,
              'targets': [2],
                "class": "text-left",
              "render": function ( data, type, row ) {
                  return '<textarea  class="form-control" name="step_expectedresult[]" id="step_expectedresult'+sno+'" rows="2"></textarea>';
              }
          }, 
          {"orderable": false,
            "targets": -1,
            "class":"text-left",
              render: function ( data, type, row ) {
              return '<a href="JavaScript:void(0)" id="deleteSteps'+sno+'" data-id="'+sno+'" class="deleteSteps">'+
                      '  <span class="fa fa-trash text-danger "></span>'+
                      ' </a>';
              }           
          }
        ],

        "pageLength": 25,
        "searching": false,
        "paging": false,
        "info": false,
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            $("td:nth-child(1)", nRow).html(iDisplayIndex + 1);
            return nRow;
        }
  });

  sno = sno+1;
  stepsTbl.row.add( ["","","",""] ).draw();

  $("#stepsTbl").wrap("<div class='scrolledTable'></div>");
})(jQuery);
