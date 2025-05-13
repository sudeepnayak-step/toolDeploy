var bulkcheckboxarr = new Array();
var tc_bulkcheckboxarr = new Array();
var temp_testexecutionId = 0;
var temp_testrunId = 0;
var filter_projectId = 0;
var filter_releaseId = 0;
var filter_activityId = 0;
var autoDefectId = 0;
var nTestsuitetype = "";
var nSchedulchk = "";
(function ($) {
$.fn.dataTable.ext.errMode = 'none';
  var temp_testsuiteId = window.location.search.substr(1);
  var arr = temp_testsuiteId.split("=");
  var param1 = arr[0];
  var paramval1 = arr[1];

/**
 * This function is used to load the details of the testsuite based on the paramval1 
 * which is passed through the url parameter. It makes an ajax call to the getSingleedit.php
 * and loads the data for the testsuite and also loads the testcases associated with the testsuite
 */
  function loadDetails(){
  // alert(param1);
     $.ajax({
         type: "POST",
         url: STEP_root+'api/getSingleedit.php',
         dataType:'json',
         data:  {"id":paramval1,"formtype":"Testsuite"}, // serializes the form's elements.
         success: function(data)
         {
          
          $("#prvdefect").addClass("hidden");
          $("#nextdefect").addClass("hidden");
          if(data !=null){
              if(data['id'] !=null){
                  if(data['prvId'] != null && data['prvId'] !="0" && data['prvId'] !=""){
                    $("#prvdefect").attr("href",STEP_root+'master/testexecution.php?id='+data['prvId']);
                    $("#prvdefect").removeClass("hidden");
                  }
                  if(data['nextId'] != null && data['nextId'] !="0" && data['nextId'] !=""){
                    $("#nextdefect").attr("href",STEP_root+'master/testexecution.php?id='+data['nextId']);
                    $("#nextdefect").removeClass("hidden");
                  }
                  var nDetailstxt = "Test Suite ID : <span class=' big text-step'><strong>"+data['testsuitenum']+"</strong></span>";
                   if((data['editPermission'] != null && data['editPermission'] >0)){
                    nDetailstxt += "<a href='JavaScript:void(0)' id='editTestsuite"+paramval1+"' data-id='"+paramval1+"' class='text-step pull-right' data-toggle='modal' data-target='#testsuitemodal' ><b>Edit Testsuite</b> </a>";
                   }
                  $("#suitenumtxt").html(nDetailstxt);
                  $("#suitenametxt").html("Test Suite : <strong>"+data['testsuitename']+"</strong>");
                  $("#projecttxt").html("Project : <strong>"+data['projectname']+"</strong>");
                  $("#releasetxt").html("Release : <strong>"+data['releaseNum']+"</strong>");
                  $("#activitytxt").html("Activity : <strong>"+data['activityname']+"</strong>");
                  $("#desctxt").html("Description : "+data['testsuitedesc']+"");
                  $("#typetxt").html("Execution Type : <strong>"+data['type']+"</strong>");

                  filter_projectId = data['projectId'];
                  filter_releaseId = data['releaseId'];
                  filter_activityId = data['activityId'];
                  nTestsuitetype = data['type'];
                  nSchedulchk = data['schedchk'];
                  getFilterTC(filter_projectId,filter_releaseId,"");
                  
                testcaseTbl.ajax.reload( null, false );
              }
          }

         },error:function (jqXHR, textStatus, errorThrown) {
                formatErrorMessage(jqXHR, errorThrown);
          }
     });
 }
 loadDetails();

$("#projectId").html("");
$("#projectId").selectpicker('refresh');

$("#ts_projectId").html("");
$("#ts_projectId").selectpicker('refresh');

$("#filter_module").html("");
$("#filter_module").selectpicker('refresh');

$("#filter_testcaseId").html("");
$("#filter_testcaseId").selectpicker('refresh');


$("#defecttypeId").html("");
$("#defecttypeId").selectpicker('refresh');

$("#defectstatusId").html("");
$("#defectstatusId").selectpicker('refresh');

$("#assignto").html("");
$("#assignto").selectpicker('refresh');

$("#tc_assignto").html("");
$("#tc_assignto").selectpicker('refresh');

/**
 * p1: Function to get the defect types from the database and populate the #defecttypeId selectpicker.
 */
var p1 = function(){
    return new Promise(function(resolve, reject){
        
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'DefectType'}, // serializes the form's elements.
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#defecttypeId").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
              });
            }

            $("#defecttypeId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};

var p2 = function(){
    return new Promise(function(resolve, reject){
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'DefectStatus'}, // serializes the form's elements.
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#defectstatusId").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
              });
            }

            $("#defectstatusId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};

/**
 * p3: Function to fetch active projects from the server and populate the 
 * #projectId and #ts_projectId selectpickers with the retrieved project data.
 */
var p3 = function(){
    return new Promise(function(resolve, reject){
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
                  $("#ts_projectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                });
              }

              $("#projectId").selectpicker('refresh');
              $("#ts_projectId").selectpicker('refresh');
              resolve(true);
            },error:function (jqXHR, textStatus, errorThrown) {
              resolve(true);
            }
        });
  
    });
};


p1().then(p2).then(p3).then(function(){
});

/** initialize the testcase table */
var testcaseTbl =  $('#testcaseTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        formatErrorMessage("","");

    } ).DataTable({
      responsive: true,
      "ajax": {
        "type":"POST",
        "url": STEP_root+"api/getallTestcase.php",
        "data": function (d) {
            var nModule = $("#filter_module").val();
            var nTestcase = $("#filter_testcaseId").val();
            return "projectId="+filter_projectId+"&&releaseId="+filter_releaseId+"&&activityId="+filter_activityId+"&&module="+nModule+"&&testcaseId="+nTestcase+"&&testsuiteId="+paramval1+"&&type="+nTestsuitetype;
 
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
                            '<input type="checkbox" class="custom-control-input" id="tc_checkbox'+data+'">'+
                            '<label class="custom-control-label" for="tc_checkbox'+data+'">&nbsp;</label>'+
                        '</div>';
                }
            },
        {"visible": false,"orderable": false,"targets":[7,10,11,12,13,18],"class":"text-left"} , 
        {"orderable": false,"targets":[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],"class":"text-left"}  
      ],
      "pageLength": 25,
      "paging": true,
      "info": true,
      "stateSave": true,
  });
      
  $("#testcaseTbl").wrap("<div class='scrolledTable'></div>");

  $( document ).on( "change", "[id=filter_module]", function(e) {
        // prevent default action
        e.preventDefault();
        var nModule = this.value;
        getFilterTC(filter_projectId,filter_releaseId,nModule);

        testcaseTbl.ajax.reload( null, false );
        $('#tc_select_all').attr("checked",false);
        tc_bulkcheckboxarr.length = 0;
  });

  $( document ).on( "change", "[id=filter_testcaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nModule = this.value;
        testcaseTbl.ajax.reload( null, false );
        $('#tc_select_all').attr("checked",false);
        tc_bulkcheckboxarr.length = 0;
        
  });


/**
 * Fetches and populates test case and module dropdowns based on project, release, and module filters.
 */
function getFilterTC(nProjectId,nReleaseId,nModule){

  return new Promise(function(resolve, reject){
    var modarr = new Array();
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
        data:  {'formtype':'FilterTestcase',"projectId":filter_projectId,"releaseId":filter_releaseId,"activityId":filter_activityId,"module":nModule}, // serializes the form's elements.
        success: function(data)
        {
          if(data != null && data['data']!=null){
            $.each( data['data'], function( key, value ) {
              $("#filter_testcaseId").append("<option value='"+value['testcaseid']+"' >"+value['testcasename']+"</option>");
              if(nModule == ""){
                if(jQuery.inArray( value['modulename'], modarr ) < 0){
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
          reject(true);
        }
    });
  
    });
}


/** initliaze test execution table */
var releaseTable =  $('#testexecutionTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        console.log( 'An error has been reported by DataTables: ', message );
        formatErrorMessage("","");

    } ).DataTable({
        responsive: true,
        "ajax": STEP_root+"api/getallTestexecution.php?"+temp_testsuiteId,
        "columnDefs": [
        	{
                'sortable': false,
                'targets': [0],
                "orderable": false,
                 "class": "text-left",
                "render": function ( data, type, row ) {
                  var nDIsable = "";var disableStyle = "";
                  if(row[15] == "1") nDIsable = ' disabled ';
                  if(row[15] == "1") disableStyle = '  style="cursor: no-drop;" ';
                	return '<div class="custom-control custom-checkbox " '+disableStyle+'>'+
                            '<input type="checkbox" class="custom-control-input" id="checkbox'+data+'" '+nDIsable+'>'+
                            '<label class="custom-control-label" for="checkbox'+data+'">&nbsp;</label>'+
                        '</div>' ;
                }
            },
          {
                "orderable": true,
                'targets': [3],
                 "class": "text-left",
                "render": function ( data, type, row ) {
                  // return data;
                  return '<a href="JavaScript:void(0)" id="editTestcase'+row[0]+'" data-id="'+row[0]+'" data-testcaseId="'+row[4]+'" class="text-step" data-toggle="modal" data-target="#testcasedetailsmodal" ><b>'+
                          data+
                         '</b> </a>';
                }
            },
          {
                "orderable": true,
                "visible": true,
                'targets': [9],
                 "class": "text-left defectView",
                "render": function ( data, type, row ) {
                  if(data != "" && data !="0"){

                  return '<a href="JavaScript:void(0)" id="editDefect'+row[0]+'" data-id="'+row[8]+'" class="text-step" data-toggle="modal" data-target="#defectmodal" ><b>'+data+'</b> </a>';
                }else{
                  return "-";
                }
                }
            },
          {
                "orderable": true,
                "visible": true,
                'targets': [15],
                 "class": "text-left",
                "render": function ( data, type, row ) {
                  if(data =="1"){

                    return 'Running';
                  }else if(data =="2"){

                    return 'Done';
                  }else{
                    return "No Run";
                  }
                }
            },
          {
                'sortable': false,
                "orderable": false,
                'targets': [6],
                 "class": "text-left",
                "render": function ( data, type, row ) {
                  var nDIsable = "";var disableStyle = "";
                  if(row[15] == "1") nDIsable = ' disabled ';
                  if(row[15] == "1") disableStyle = '  "cursor: no-drop; ';
                  var rStatus= '<div class="form-group " style="width:120px;'+disableStyle+'">'+
                              '<select class="form-control" id="testeresult'+row[0]+'" name="testeresult'+row[0]+'"  data-id="'+row[0]+'"  data-testcaseId="'+row[4]+'" data-iteration="'+row[11]+'"  '+nDIsable+'>'+
                             '   <option value="" >Result</option>'+
                            '    <option value="Pass" '+(data == "Pass" ? 'selected="selected"' : '')+'>Pass</option>'+
                           '     <option value="Fail" '+(data == "Fail" ? 'selected="selected"' : '')+'>Fail</option>'+
                          '      <option value="In Progress" '+(data == "In Progress" ? 'selected="selected"' : '')+'>In Progress</option>'+
                          '      <option value="Pending" '+(data == "Pending" ? 'selected="selected"' : '')+'>Pending</option>'+
                          '      <option value="Block" '+(data == "Block" ? 'selected="selected"' : '')+'>Block</option>'+
                          '      <option value="NA" '+(data == "NA" ? 'selected="selected"' : '')+'>NA</option>'+
                         '     </select>'+
                        '</div>';
                  return type == "export" ? data : rStatus;
                }
            },

          {
                "orderable": true,
                'targets': [7],
                 "class": "text-left",
                "render": function ( data, type, row ) {
                  return (row[15] == "1" ? '<a href="JavaScript:void(0)" style="color:#aaa;"><b><u>Steps</u></b> </a>' : '<a href="JavaScript:void(0)" id="editSteps'+row[0]+'" data-id="'+row[0]+'" data-testcaseId="'+row[4]+'" class="text-step"  data-toggle="modal" data-target="#stepexecutionmodal" ><b>Steps</b> </a>');
                }
            },
          {
                'sortable': false,
                'targets': [10],
                 "class": "text-left",
                "render": function ( data, type, row ) {
                  if(data !=""){

                  return '<a href="'+data+'"><img src="'+STEP_root+'images/doc.png" height="3%"/></a>';
                }else{
                  return '-';
                }
                }
            },
            {
              "orderable": false,
              "targets": -1,
              "class":"text-left",
              render: function ( data, type, row ) {
              return '<a href="JavaScript:void(0)" id="deleteTestcase'+data+'" data-id="'+data+'" >'+
                      '  <span class="fa fa-trash text-danger "></span>'+
                    ' </a>';
              }           
          },
    		  {"targets":[2,4,8,11],"class":"text-left","visible":false}
		    ],
        "drawCallback": function( settings ) {
          if(autoDefectId >0){
            
            $("#editDefect"+autoDefectId).trigger("click");
          }
        },
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
                "text":'<span style="padding-right:5px; float:left" >Download</span>',
                "buttons": [
                    {
                        "text": 'Excel',
                        "title": 'Tescase Execution List',
                        "extend": 'excelHtml5',
                        "exportOptions": {
                          "columns": ':not(.notexport)',
                          "orthogonal": 'export'
                        }
                    },
                    {
                        "text": 'CSV',
                        "title": 'Tescase Execution List',
                        "extend": 'csvHtml5',
                        "exportOptions": {
                          "columns": ':not(.notexport)',
                          "orthogonal": 'export'
                        }
                    },
                    {
                        "text": 'PDF',
                        "title": 'Tescase Execution List',
                        "extend": 'pdfHtml5',
                        "orientation": 'landscape',
                        "pageSize": 'LEGAL',
                        "exportOptions": {
                          "columns": ':not(.notexport)',
                          "orthogonal": 'export'
                        },
                        customize: function ( doc ) {}
                    },
                ]
            }
        ]
	});

releaseTable.buttons().container().appendTo('#exportButtonsContainer');
/** delete testcase based on id */
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
                            data:  {"id":currentId,'formtype':'ExecutionTestcase'}, // serializes the form's elements.
                            success: function(data)
                            {
                            if(data != null){
                              if(data['status'] != null){
                                if(data['status'] == "Success"){
                                  
                                  releaseTable.ajax.reload( null, false );
                                  $('#select_all').attr("checked",false);
                                  bulkcheckboxarr.length = 0;
                                  
                                  testcaseTbl.ajax.reload( null, false );
                                  $('#tc_select_all').attr("checked",false);
                                  tc_bulkcheckboxarr.length = 0;
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


/** update test result data into databased based on id */
    $( document ).on( "change", "[id^=testeresult]", function(e) {
      // prevent default action
      e.preventDefault();
      var currentId = $(this).attr("data-id");
      var temp_iteration = $(this).attr("data-iteration");
      var temp_testcaseId = $(this).attr("data-testcaseId");
      var nVal = $(this).val();
        $.ajax({
            url: STEP_root+"api/updateTestexecution.php", //The url where the server req would we made.
            async: false,
            type: "POST", //The type which you want to use: GET/POST
            data: "id="+currentId+"&&value="+nVal+"&&col=testresult"+"&&activityId="+filter_activityId+"&&iteration="+temp_iteration+"&&testcaseId="+temp_testcaseId, //The variables which are going.
            dataType: "html", //Return data type (what we expect).
            //This is the function which will be called if ajax call is successful.
            success: function(data)
            { 
              if(nVal == "Fail"){
                ConfirmDialog('Do you want to create a defect',currentId);
              }
            },error:function (jqXHR, textStatus, errorThrown) {
                  formatErrorMessage(jqXHR, errorThrown);
            }
        });
    });

/**
 * ConfirmDialog -  to create a defect if execution fail
 */
function ConfirmDialog(message,nid) {

    $.confirm({
              title: 'Confirm!',
              content: 'Are you sure you want to create a defect?',
              buttons: {
                  No: function () {
                      
                  },
                  Yes: {
                      btnClass: 'btn-blue',
                      action: function(){
                          $.ajax({
                             type: "POST",
                             url: STEP_root+'api/createAutodefect.php',
                             dataType:'json',
                             data:  {"id":nid}, // serializes the form's elements.
                             success: function(data)
                             {
                              if(data != null){
                                if(data['status'] != null){
                                  if(data['status'] == "Success"){
                                    autoDefectId = nid;
                                    releaseTable.ajax.reload( null, false );
                                    $('#select_all').attr("checked",false);
                                    bulkcheckboxarr.length = 0;

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
            
}

function ConfirmDialog1(message,nid) {
  var r = confirm(message);
  if (r == true) {
    $.ajax({
        url: STEP_root+"api/createAutodefect.php", //The url where the server req would we made.
        async: false,
        type: "POST", //The type which you want to use: GET/POST
        data: "id="+nid, //The variables which are going.
        dataType: "html", //Return data type (what we expect).
        //This is the function which will be called if ajax call is successful.
        success: function(data)
        { 
            alert("Defect created successfully");
          
            releaseTable.ajax.reload( null, false );
            $('#select_all').attr("checked",false);
            bulkcheckboxarr.length = 0;
        },error:function (jqXHR, textStatus, errorThrown) {
              formatErrorMessage(jqXHR, errorThrown);
        }
    });
  } else {
  }
};

/** update actual result for execution */
    $( document ).on( "keyup", "[id^=actualeresult]", function(e) {
        // prevent default action
        e.preventDefault();

        var currentId = $(this).attr("data-id");
        var temp_iteration = $(this).attr("data-iteration");
        var nVal = $(this).val();
          $.ajax({
              url: STEP_root+"api/updateTestexecution.php", //The url where the server req would we made.
              async: false,
              type: "POST", //The type which you want to use: GET/POST
              data: "id="+currentId+"&&value="+nVal+"&&col=actualresult"+"&&activityId="+filter_activityId+"&&iteration="+temp_iteration, //The variables which are going.
              dataType: "html", //Return data type (what we expect).
              //This is the function which will be called if ajax call is successful.
              success: function(data)
              { 
              },error:function (jqXHR, textStatus, errorThrown) {
                    formatErrorMessage(jqXHR, errorThrown);
              }
          });
      });


     $('.dropdown').on('show.bs.dropdown', function () {
          $('.dataTables_scrollFoot').css("overflow", "visible");
      });
      $('.dropdown').on('hide.bs.dropdown', function () {
          $('.dataTables_scrollFoot').css("overflow", "hidden");
      });
    $('thead input[id="select_all"]').on('click', function(e){ 

      if(this.checked){
         $('#testexecutionTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#testexecutionTbl tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });  
   
   // Handle click on checkbox to set state of "Select all" control
   $('#testexecutionTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
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

   $('thead input[id="tc_select_all"]').on('click', function(e){ 

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
        var el = $('#tc_select_all').get(0); 
        // If "Select all" control is checked and has 'indeterminate' property
        if(el && el.checked){
          // Set visual state of "Select all" control 
          // as 'indeterminate'
          el.checked = false;
        }
        var index = tc_bulkcheckboxarr.indexOf(parseInt(this.id.match(/\d+/)));
        if(index > -1)
        {
            tc_bulkcheckboxarr.splice(index,1)
        }
      }else
      {
          tc_bulkcheckboxarr.push(parseInt(this.id.match(/\d+/)));
      }
   });

/** bulk action to execute multiple test cases */
   $( document ).on( "click", ".bulkAction", function(e) {
      // prevent default action
      e.preventDefault();

      var nType = $(this).attr("data-type");
      if(bulkcheckboxarr.length > 0){
            $.ajax({
            url: STEP_root+"api/bulkAction.php", //The url where the server req would we made.
            async: false,
            type: "POST", //The type which you want to use: GET/POST
            data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=Testexecution&&executiontype="+nTestsuitetype+"&&testsuiteId="+paramval1+"&&schedchk="+nSchedulchk, //The variables which are going.
            dataType: "text", //Return data type (what we expect).
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
            
            $.alert({
                  title: 'Information',
                  content: "Please select atleast one testcase to execute",
                  type: 'info',
                  typeAnimated: true
              });
        }

  });

  /** action to execute testcase using uipath */
  $( document ).on( "click", ".uipathbulkAction", function(e) {
      // prevent default action
      e.preventDefault();

      var nType = $(this).attr("data-type");
      if(bulkcheckboxarr.length > 0){
        $.ajax({
            url: "https://www.testcalibre.com/execute", //The url where the server req would we made.
            async: false,
            type: "post",
            //This is the function which will be called if ajax call is successful.
            success: function(data)
            { 
              $.alert({
                title: 'Success',
                content: "Send to UiPath",
                type: 'success',
                typeAnimated: true
            });
                // releaseTable.ajax.reload( null, false );
                $('#select_all').attr("checked",false);
                bulkcheckboxarr.length = 0;
            },error:function (jqXHR, textStatus, errorThrown) {
                  formatErrorMessage(jqXHR, errorThrown);
            }
        });
        }else
        {
            
            $.alert({
                title: 'Information',
                content: "Please select atleast one testcase to execute",
                type: 'info',
                typeAnimated: true
            });
        }

  });

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
  },
  messages: {
  },

  submitHandler: function(form) {

      if(tc_bulkcheckboxarr.length > 0){
         var form_data = new FormData($(form)[0]); 
         form_data.append('testsuiteDBId',paramval1);
         form_data.append('testcaseIds',tc_bulkcheckboxarr);
         $.ajax({
            url: STEP_root+"api/saveSuite_testcasenew.php", //The url where the server req would we made.
            async: false,
            type: "POST", //The type which you want to use: GET/POST
            data: form_data , //The variables which are going.
            dataType: "text", //Return data type (what we expect).
            cache: false,
            contentType: false,
            processData: false,
            //This is the function which will be called if ajax call is successful.
            success: function(data) {
                var mymodal = $('#testcasemodal');
                mymodal.modal('hide');
                $(form)[0].reset();
                $("#activityId").val('default');
                $("#activityId").selectpicker("refresh");
                $("#projectId").val('default');
                $("#projectId").selectpicker("refresh");
                $("#releaseId").html("");
                $("#releaseId").val('default');
                $("#releaseId").selectpicker("refresh");
                $("#scenarioId").html("");
                $("#scenarioId").val('default');
                $("#scenarioId").selectpicker("refresh");
                $("#testcaseId").html("");
                $("#testcaseId").val('default');
                $("#testcaseId").selectpicker("refresh");
                releaseTable.ajax.reload( null, false );
                $('#select_all').attr("checked",false);
                bulkcheckboxarr.length = 0;
                testcaseTbl.ajax.reload( null, false );
                $('#tc_select_all').attr("checked",false);
                tc_bulkcheckboxarr.length = 0;
            },error:function (jqXHR, textStatus, errorThrown) {
                  formatErrorMessage(jqXHR, errorThrown);
            }
        });
       }else{
          $.alert({
                title: 'Information',
                content: "Please select atleast one testcase",
                type: 'info',
                typeAnimated: true
            });
       }
}
});


$('#testcasemodal').on('hidden.bs.modal', function () {
    $('#testcaseform').trigger("reset");
    $("#activityId").val('default');
    $("#activityId").selectpicker("refresh");
    $("#projectId").val('default');
    $("#projectId").selectpicker("refresh");
    $("#releaseId").html("");
    $("#releaseId").val('default');
    $("#releaseId").selectpicker("refresh");
    $("#scenarioId").html("");
    $("#scenarioId").val('default');
    $("#scenarioId").selectpicker("refresh");
    $("#testcaseId").html("");
    $("#testcaseId").val('default');
    $("#testcaseId").selectpicker("refresh");
    
});

$( document ).on( "click", "[id^=editTestcase]", function(e) {
  // prevent default action
  e.preventDefault();

  var currentId = $(this).attr("data-id");
  var temp_testcaseId = $(this).attr("data-testcaseId");
  temp_testexecutionId = currentId;
        testcasehistoryTbl.ajax.reload( null, false );
  if(currentId != "0"){
        $.ajax({
            type: "POST",
            url: STEP_root+'api/getSingleedit.php',
            dataType:'json',
            data:  {"id":temp_testcaseId,"formtype":"TestcaseDetails"}, // serializes the form's elements.
            success: function(data)
            {
            if(data !=null){
                if(data['id'] !=null){
                    $("#testcaseDBId").val(data['id']);
                    $("#tc_module").html(data['module']);
                    $("#tc_submodule").html(data['submodule']);
                    $("#tc_testmode").html(data['testmode']);

                    $("#tc_testscenariodesc").val(data['testscenariodesc']);
                    $("#tc_testcasedesc").val(data['testcasedesc']);
                    $("#tc_steps").val(data['steps']);
                    $("#tc_expectedresult").val(data['expectedresult']);
                    $("#tc_precondition").val(data['precondition']);
                    $("#tc_testdata").val(data['testdata']);
                    $("#tc_comment").val(data['comment']);

                    $("#tc_projectId").html(data['projectId']);

                    $("#tc_author").html(data['author']);

                    $("#tc_reviewer").html(data['reviewer']);
                    $("#tc_releaseId").html(data['releaseId']);
                    $("#tc_activityId").html(data['activityId']);
                    $("#tc_scenarioId").html(data['scenarioIdstr']);
                    $("#tc_assignto").html(data['assignto']);
                }
            }

            },error:function (jqXHR, textStatus, errorThrown) {
                  formatErrorMessage(jqXHR, errorThrown);
            }
        });
    }else{

    }
});

/** testcase history table */
var testcasehistoryTbl =  $('#testcasehistoryTbl')
    .on( 'error.dt', function ( e, settings, techNote, message ) {
        formatErrorMessage("","");

    } ).DataTable({
        "ajax": {
          "type":"POST",
        "url": STEP_root+"api/getallTestcasehistory.php",
        "data": function (d) {
            return "testexecutionId="+temp_testexecutionId;
 
        }
      },
      "columnDefs": [ 
      
        {
            'sortable': false,
            'targets': [-1],
              "class": "text-left",
            "render": function ( data, type, row ) {
              if(data !="" && data != null){

              return '<a href="'+data+'"><img src="'+STEP_root+'images/doc.png" height="3%"/></a>';
            }else{
              return '';
            }
            }
        },

        {
            "orderable": true,
            'targets': [2],
              "class": "text-left",
            "render": function ( data, type, row ) {
              return '<a href="JavaScript:void(0)" id="editIteraton'+row[0]+'" data-id="'+row[0]+'" data-executionId="'+temp_testexecutionId+'" class="text-step" data-toggle="modal" data-target="#stepiterationmodal" ><b>Steps</b> </a>';
            }
        },
        {"orderable": false,"targets":[0,1,2,3,4,5],"class":"text-left"} 
      ],
      "searching": false,
      "paging": false,
      "info": false,
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
  });

/** get test suite details */
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

                          $("#testsuitedesc").val(data['testsuitedesc']);

                            $("#ts_projectId").val(data['projectId']);
                            $("#ts_projectId").selectpicker('refresh');

                          ts_getRelease(data['projectId'],1).then(function(){
                                $("#ts_releaseId").val(data['releaseId']);
                                $("#ts_releaseId").selectpicker('refresh');

                              ts_getActivity(data['projectId'],data['releaseId'],1).then(function(){
                                    $("#ts_activityId").val(data['activityId']);
                                    $("#ts_activityId").selectpicker('refresh');

                              });
                          });
                          
                          ts_getAssignee(data['projectId'],1).then(function(){
                                $("#ts_assignto").val(data['assignto']);
                                $("#ts_assignto").selectpicker('refresh');
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

  /**
   * Function to get the Release details based on the project Id
   */
  function ts_getRelease(nProjectId,nFlag){

      return new Promise(function(resolve, reject){
          if(nFlag == "1"){
                $("#ts_releaseId").html('');
                $("#ts_releaseId").selectpicker('refresh');
                $("#ts_activityId").html('');
                $("#ts_activityId").selectpicker('refresh');
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
                          $("#ts_releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                        }else{
                          $("#releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");

                        }
                        });
                      }
                      if(nFlag == "1"){
                        $("#ts_releaseId").selectpicker('refresh');
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
   * Gets the Assignee details based on the project Id.
   */
function ts_getAssignee(nProjectId,nFlag){

    return new Promise(function(resolve, reject){
        if(nFlag == "1"){
              $("#ts_assignto").html('');
              $("#ts_assignto").selectpicker('refresh');
        }else{
          $("#assignto").html('');
          $("#assignto").selectpicker('refresh');
        }
        $.ajax({
            type: "POST",
            url: STEP_root+'api/getDropdown.php',
            dataType:'json',
            data:  {'formtype':'Assignee',"projectId":nProjectId}, // serializes the form's elements.
            success: function(data)
            {
              if(data != null && data['data']!=null){
                $.each( data['data'], function( key, value ) {
                  if(nFlag == "1"){
                  $("#ts_assignto").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
                  }else{
                  $("#assignto").append("<option value='"+value['id']+"' >"+value['name']+"</option>");

                  }
                });
              }
              if(nFlag == "1"){
                $("#ts_assignto").selectpicker('refresh');
              }else{
                $("#assignto").selectpicker('refresh');                          
              }
              resolve(true);
            },error:function (jqXHR, textStatus, errorThrown) {
              reject(true);
            }
        });
  
    });
  }


  /**
   * Function to get the activity details based on the project Id and release Id.
   * It returns a promise and resolves the promise with true if the activity details are fetched from the server.
   */
  function ts_getActivity(nProjectId,nReleaseID,nFlag){

    return new Promise(function(resolve, reject){
          if(nFlag == 1){
              $("#ts_activityId").html('');
              $("#ts_activityId").selectpicker('refresh');
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
                  $("#ts_activityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
                }else{
                  $("#activityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");

                }
                });
              }
              if(nFlag == 1){
                $("#ts_activityId").selectpicker('refresh');
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


$( document ).on( "change", "[id=ts_projectId]", function(e) {
    // prevent default action
    e.preventDefault();
    var nProjectId = this.value;
    ts_getRelease(nProjectId,1);
    ts_getAssignee(nProjectId,1);
});


 $( document ).on( "change", "[id=ts_releaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nReleaseId = this.value;
        var nProjectId = $("#ts_projectId").val();
        ts_getActivity(nProjectId,nReleaseId,0);
});


/** save testsuite data into database */
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
    "ts_activityId": 'required',
    "ts_projectId": 'required',
    "ts_releaseId": 'required',
    "testsuitename": 'required',
    "testsuitedesc": {
          maxlength: 2000
      }
  },
  messages: {
    "ts_activityId": 'Please enter acticity',
    "ts_projectId": 'Please select project',
    "ts_releaseId": 'Please select release',
    "testsuitename": 'Please enter test suite name',
    "testsuitedesc": {
          maxlength: "You have reached your maximum limit of characters allowed"
      }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]);
     form_data.append('projectId_change',($("#ts_projectId").val() != null && $("#ts_projectId").val() != $("#ts_projectId").attr("data-exist") ? "1":"0"));
     form_data.append('releaseId_change',($("#ts_releaseId").val() != null && $("#ts_releaseId").val() != $("#ts_releaseId").attr("data-exist") ? "1":"0"));
     form_data.append('activityId_change',($("#ts_activityId").val() != null && $("#ts_activityId").val() != $("#ts_activityId").attr("data-exist") ? "1":"0"));
     form_data.append('testsuitename_change',($("#testsuitename").val() != null && $("#testsuitename").val() != $("#testsuitename").attr("data-exist") ? "1":"0"));
     form_data.append('assignto_change',($("#ts_assignto").val() != null && $("#ts_assignto").val() != $("#ts_assignto").attr("data-exist") ? "1":"0"));
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
                var mymodal = $('#testsuitemodal');
                mymodal.modal('hide');
                $(form)[0].reset();

                $("#ts_activityId").val('default');
                $("#ts_activityId").selectpicker("refresh");
                $("#ts_projectId").val('default');
                $("#ts_projectId").selectpicker("refresh");
                $("#ts_releaseId").html("");
                $("#ts_releaseId").val('default');
                $("#ts_releaseId").selectpicker("refresh");
                $("#ts_assignto").html("");
                $("#ts_assignto").val('default');
                $("#ts_assignto").selectpicker("refresh");
                loadDetails();
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



$('#testsuitemodal').on('hidden.bs.modal', function () {
  $('#testsuiteform').trigger("reset");
  autoDefectId = 0;


  $("#ts_activityId").removeAttr("disabled");
  $("#ts_projectId").removeAttr("disabled");
  $("#ts_releaseId").removeAttr("disabled");
  $("#ts_activityId").val('default');
  $("#ts_activityId").selectpicker("refresh");
  $("#ts_projectId").val('default');
  $("#ts_projectId").selectpicker("refresh");
  $("#ts_releaseId").html("");
  $("#ts_releaseId").val('default');
  $("#ts_releaseId").selectpicker("refresh");
  $("#ts_assignto").html("");
  $("#ts_assignto").val('default');
  $("#ts_assignto").selectpicker("refresh");


  $("#schedchk_change").val("0");
  $("#testsuitedesc_change").val("0");
  $("#ts_projectId").attr("data-exist","");
  $("#ts_releaseId").attr("data-exist","");
  $("#testsuitename").attr("data-exist","");
  $("#ts_activityId").attr("data-exist","");
  $("#ts_assignto").attr("data-exist","");

  $("#schedchk").prop("checked",false);
  $("#schdulingsetting").addClass("hidden");
  $("#schdulingsettingchk").addClass("hidden");
  $(".autosetting").addClass("hidden");

  $('#testsuiteform .state-error').css('display', 'none');
});



//////////////////

$( document ).on( "change", "[id=testsuitedesc],[id=command]", function(e) {
    // prevent default action
    e.preventDefault();
    var nId = $(this).attr("id");
    $("#"+nId+"_change").val(1);
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


$( document ).on( "click", "[id^=editSteps]", function(e) {
  // prevent default action
  e.preventDefault();

  var currentId = $(this).attr("data-id");
  var temp_testcaseId = $(this).attr("data-testcaseId");
  temp_testexecutionId = currentId;
  $("#executionId").val(currentId);
  stepexecutionTbl.ajax.reload( null, false );
});


$( document ).on( "click", "[id^=editIteraton]", function(e) {
    // prevent default action
    e.preventDefault();

    var currentId = $(this).attr("data-id");
    var temp_executionId = $(this).attr("data-executionId");
    temp_testrunId = currentId;
    stepiterationTbl.ajax.reload( null, false );
});

/** initialize test execution step table */
var stepexecutionTbl =  $('#stepexecutionTbl')
.on( 'error.dt', function ( e, settings, techNote, message ) {
      console.log( 'An error has been reported by DataTables: ', message );
      formatErrorMessage("","");

  } ).DataTable({
      "ajax": {
        "type":"POST",
      "url": STEP_root+"api/getallTestexecutionsteps.php",
      "data": function (d) {
          return "testexecutionId="+temp_testexecutionId;

      }
    },
    "columnDefs": [
      {
              "orderable": false,
              "visible": false,
              'targets': [0]                
      },
      {
        "orderable": true,"targets":[2,3],"class":"text-left","width":"20%",
        "render": $.fn.dataTable.render.ellipsis()
      },
      {
            'sortable': false,
            "orderable": false,
            'targets': [4],
              "class": "text-left",
            "render": function ( data, type, row ) {
              var nDIsable = "";var disableStyle = "";
              var rStatus= '<div class="form-group " style="width:120px;'+disableStyle+'">'+
                          '<select class="form-control" name="step_testresult[]" id="step_testresult'+row[0]+'"  data-id="'+row[0]+'"  data-testcaseId="'+row[4]+'"  '+nDIsable+'>'+
                          '   <option value="" >Result</option>'+
                        '    <option value="Pass" '+(data == "Pass" ? 'selected="selected"' : '')+'>Pass</option>'+
                        '     <option value="Fail" '+(data == "Fail" ? 'selected="selected"' : '')+'>Fail</option>'+
                      '      <option value="In Progress" '+(data == "In Progress" ? 'selected="selected"' : '')+'>In Progress</option>'+
                      '      <option value="Pending" '+(data == "Pending" ? 'selected="selected"' : '')+'>Pending</option>'+
                      '      <option value="Block" '+(data == "Block" ? 'selected="selected"' : '')+'>Block</option>'+
                      '      <option value="NA" '+(data == "NA" ? 'selected="selected"' : '')+'>NA</option>'+
                      '     </select>'+
                    '</div>';
              return type == "export" ? data : rStatus;
            }
      },
      {
            "orderable": false,
            'targets': [5],
              "class": "text-left",
            "render": function ( data, type, row ) {
              // sno = sno+1;
              return '<input type="hidden"  class="form-control"  name="stepexecutionId[]" id="stepexecutionId'+row[0]+'" value="'+row[0]+'" />'+
              '<input type="hidden"  class="form-control"  name="stepiteration[]" id="stepiteration'+row[0]+'" value="'+row[6]+'" />'+
              '<textarea  class="form-control"  name="step_actualresult[]" id="step_actualresult'+row[0]+'" rows="2" style="width:150px;">'+data+'</textarea>';
          
            }
      }
    ],
    "searching": false,
    "paging": false,
    "info": false
  });

/** save test execution data */
$('form[id="stepexecutionform"]').validate({

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
      
  },
  messages: {
   
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     form_data.append("activityId",filter_activityId);
     

     $.ajax({
        url: STEP_root+"api/saveStepexecution.php", //The url where the server req would we made.
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

                releaseTable.ajax.reload( null, false );
                $('#select_all').attr("checked",false);
                bulkcheckboxarr.length = 0;
                var mymodal = $('#stepexecutionmodal');
                mymodal.modal('hide');
                $(form)[0].reset();
                if(data['result'] != null && data['result'] == "Fail"){
                  if(data['executionId'] != null && data['executionId'] != "" && data['executionId'] !="0"){
                    ConfirmDialog('Do you want to create a defect',data['executionId']);
                  }else{
                    $.alert({
                        title: 'Success',
                        content: data['message'],
                        type: 'green',
                        typeAnimated: true
                    });
                  }

                }else{
                  $.alert({
                        title: 'Success',
                        content: data['message'],
                        type: 'green',
                        typeAnimated: true
                    });
                }
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

/** initialization of step iteration table */
var stepiterationTbl =  $('#stepiterationTbl')
.on( 'error.dt', function ( e, settings, techNote, message ) {
      console.log( 'stepiterationTbl An error has been reported by DataTables: ', message );
      formatErrorMessage("","");

  } ).DataTable({
      "ajax": {
        "type":"POST",
      "url": STEP_root+"api/getallTeststepiteration.php",
      "data": function (d) {
          return "testrunId="+temp_testrunId;

      }
    },
    "columnDefs": [
      {
        "orderable": true,"targets":[1,2],"class":"text-left","width":"20%",
        "render": $.fn.dataTable.render.ellipsis()
      }
    ],
    "searching": false,
    "paging": false,
    "info": false
});


})(jQuery);
