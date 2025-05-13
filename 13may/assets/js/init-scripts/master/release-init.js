var bulkcheckboxarr = new Array();
var filterProjoption = "";
var filterReleaseoption = "";
(function ($) {
    //    "use strict";

    /*  Data Table
    -------------*/

$.fn.dataTable.ext.errMode = 'none';
$('#bootstrap-data-table').DataTable({
    lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
});

$("#tblfilterstatus").val('default');
$("#tblfilterstatus").selectpicker("refresh");
$("#projectstatus").val('default');
$("#projectstatus").selectpicker("refresh");

$("#projectId").html("");

$("#projectId").selectpicker('refresh');


$("#tblfilterprojectId").html("");
$("#tblfilterprojectId").selectpicker('refresh');
$("#tblfilterreleaseId").html("");
$("#tblfilterreleaseId").selectpicker('refresh');

/**
 * Fetches a list of active projects from the server and populates the 
 * projectId and tblfilterprojectId dropdowns in the DOM with the retrieved 
 * project data. Updates the filterProjoption variable with the project 
 * options. The function returns a promise that resolves to true when the 
 * dropdowns are successfully updated.
 */
var p1 = function(){
    return new Promise(function(resolve, reject){
        
      $.ajax({
          type: "POST",
          url: STEP_root+'api/getActiveproject.php',
          dataType:'json',
          data:  {'formtype':'Project'}, 
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#projectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                $("#tblfilterprojectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                filterProjoption += "<option value='"+value['id']+"' >"+value['projectname']+"</option>";
              });
            }

            $("#projectId").selectpicker('refresh');
            $("#tblfilterprojectId").selectpicker('refresh');
            resolve(true);
          },
          error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
    });
};

/**
 * Fetches a list of all active releases from the server and appends them to 
 * the tblfilterreleaseId select element in the DOM. Updates the 
 * filterReleaseoption variable with the release options. The function returns 
 * a promise that resolves to true when the dropdown is successfully updated.
 */
var p2 = function(){
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
p1().then(p2).then(function(){
});


/**initialize release table */
  var releaseTable =  $('#releaseTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        formatErrorMessage("","");

    } ).DataTable({
      "ajax": {
        "url": STEP_root+"api/getallRelease.php",
        "type":"POST",
        "data": function (d) {
            var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : '');
            var nStatus = ($("#tblfilterstatus").val() != null ? $("#tblfilterstatus").val() : '');
            var nReleaseId = ($("#tblfilterreleaseId").val() != null ? $("#tblfilterreleaseId").val() : '');
            var nPlanstart = ($("#tblfilterplanstart").val() != null ? $("#tblfilterplanstart").val() : '');
            var nPlanend = ($("#tblfilterplanend").val() != null ? $("#tblfilterplanend").val() : '');
            
            return "projectId="+nProjectId+"&&status="+nStatus+"&&releaseId="+nReleaseId+"&&planstart="+nPlanstart+"&&planend="+nPlanend;
        }
      },
      "columnDefs": 
      [
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
          {
              "orderable": false,
              'targets': [1],
                "class": "text-left",
              "render": function ( data, type, row ) {
                return '<a href="JavaScript:void(0)" id="editRelease'+row[0]+'" data-id="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#releasemodal" ><b>'+
                        data+
                        '</b> </a>';
              }
          }, 
          {
            "orderable": true,
            "visible": false,
              "targets": [4],
              "class":"text-left",
              render: function ( data, type, row ) {
                  var badgecolor = "badge-info";
                  switch(data){
                    case "R":
                      badgecolor = "badge-danger";
                      break;
                    case "A":
                      badgecolor = "badge-warning ";
                      break;
                    case "G":
                      badgecolor = "badge-success";
                      break;

                  }
                  return '<span class="badge '+badgecolor+'">'+data+'</span>';
              }           
          },
          {
            "orderable": true,
              "targets": [6],
              "class":"text-left",
              render: function ( data, type, row ) {
                  var badgecolor = "badge-info";
                  switch(data){
                    case "Pending":
                      badgecolor = "badge-warning";
                      break;
                    case "In Progress":
                      badgecolor = "badge-primary ";
                      break;
                    case "Complete":
                      badgecolor = "badge-success";
                      break;

                  }
                  return '<span class="badge badge-pill '+badgecolor+'">'+data+'</span>';
              }           
          }, 
          {

            "orderable": false,
            "visible": ((localStorage.getItem("usertype") == "Admin") || (localStorage.getItem("ruleIds").split(",").indexOf("8") !== -1)) ? true : false,
            // "visible": false,
            "targets": -1,
            "class":"text-left",
            render: function ( data, type, row ) {
            return '<a href="JavaScript:void(0)" id="deleteRelease'+data+'" data-id="'+data+'" >'+
                    '  <span class="fa fa-trash text-danger "></span>'+
                  ' </a>';
            }           
        	},
          {
              "orderable": true,
              // "visible": false,
              "targets": [-2],
              "class":"text-left",
              render: function ( data, type, row ) {
                  var badgecolor = (data != "Active" ? "badge-danger" : "badge-success");
                  return '<span class="badge badge-pill '+badgecolor+'">'+data+'</span>';
              }           
          },
    		{"orderable": true,"targets":[1,2,3,4,5,6,7,8,9,10,11,12,13,14],"class":"text-left"} ,
        {"visible": false,"orderable": false,"targets":[2,5],"class":"text-left"} 
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
            "text":'<span style="padding-right:5px; float:left" ><i class="fa fa-download"></i>&nbsp; Release Report</span>',

            "buttons": [
                {
                    "text": 'Excel',
                    "title": 'Release Report',
                    "extend": 'excelHtml5',
                    "exportOptions": {
                      "columns": ':not(.notexport)',
                      "orthogonal": 'export'
                    }
                },
                {
                    "text": 'CSV',
                    "title": 'Release Report',
                    "extend": 'csvHtml5',
                    "exportOptions": {
                      "columns": ':not(.notexport)',
                      "orthogonal": 'export'
                    }
                },
                {
                    "text": 'PDF',
                    "title": 'Release Report',
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
      ],
  });
   releaseTable.buttons().container().appendTo('#exportButtonsContainer');

$( document ).on( "change", "[id=tblfilterprojectId]", function(e) {
      // prevent default action
      e.preventDefault();
      var nProjectId = this.value;
      filterRelease().then(function(){
      });
});

/**
 * Get the list of releases for the selected project and populate the dropdown.
 * 
 * @return {Promise} Resolves with true when the list is populated.
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
            data:  {'formtype':'allFilterRelease',"projectId":nProjectId}, 
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

function getRelease(nProjectId){

    return new Promise(function(resolve, reject){
      $("#tblfilterreleaseId").html('');
      $("#tblfilterreleaseId").selectpicker('refresh');
      $.ajax({
        type: "POST",
        url: STEP_root+'api/getDropdown.php',
        dataType:'json',
        data:  {'formtype':'Release',"projectId":nProjectId}, 
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
}

/** delete release by id */
 $( document ).on( "click", "[id^=deleteRelease]", function(e) {
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
                      url: STEP_root+'api/deleteRelease.php',
                      dataType:'json',
                      data:  {"id":currentId}, 
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

/** get details of release */
$( document ).on( "click", "[id^=editRelease]", function(e) {
// prevent default action
e.preventDefault();

  var currentId = $(this).attr("data-id");
  if(currentId != "0"){
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getRelease.php',
          dataType:'json',
          data:  {"id":currentId}, 
          success: function(data)
          {
              if(data !=null){
                if(data['id'] !=null){
                    $("#projectclient").val(data['projectclient']);
                    $("#projreleaseId").val(data['id']);
                    $("#releasename").val(data['releasename']);
                    $("#releasename").attr("data-id",data['id']);
                      $("#releasename").attr("data-exist",data['releasename']);

                    $("#releasestatus").val(data['releasestatus']);
                      $("#releasestatus").attr("data-exist",data['releasestatus']);
                    $("#releasestatus").selectpicker("refresh");

                    $("#planstartdate").val(data['planstartdate']);
                      $("#planstartdate").attr("data-exist",data['planstartdate']);

                    $("#planenddate").val(data['planenddate']);
                      $("#planenddate").attr("data-exist",data['planenddate']);

                    $("#revisedstartdate").val(data['revisedstartdate']);
                      $("#revisedstartdate").attr("data-exist",data['revisedstartdate']);

                    $("#revisedenddate").val(data['revisedenddate']);
                      $("#revisedenddate").attr("data-exist",data['revisedenddate']);

                    $("#actualstartdate").val(data['actualstartdate']);
                      $("#actualstartdate").attr("data-exist",data['actualstartdate']);

                    $("#actualenddate").val(data['actualenddate']);
                      $("#actualenddate").attr("data-exist",data['actualenddate']);

                    $("#releasedesc").val(data['releasedesc']);

                    $("#activestatus").val(data['activestatus']);
                      $("#activestatus").attr("data-exist",data['activestatus']);

                      $("#projectId").val(data['projectId']);
                      $("#projectId").attr("data-exist",data['projectId']);
                    $("#informationalert").html("");
                      if(data['editable'] != null && data['editable'] >0){

                        $("#informationalert").html('<div class="col-sm-12">'+
                                '    <div class="alert  alert-info alert-dismissible fade show" role="alert">'+
                                '        <span class="badge badge-pill badge-info">Information</span> Project is not changable because data is already created for this release.'+
                                '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '            <span aria-hidden="true">×</span>'+
                                '        </button>'+
                                '    </div>'+
                                '</div>');
                        $('#projectId').prop('disabled', true);
                      }else{
                        $('#projectId').prop('disabled', false);
                      }
                      $("#projectId").selectpicker('refresh');
                      calculateDays();
                    
                        $('#releasename').prop('disabled', true);
                        $('#releasestatus').prop('disabled', true);
                        $("#releasestatus").selectpicker("refresh");
                        $('#projectId').prop('disabled', true);
                        $("#projectId").selectpicker("refresh");                                
                        $('#planstartdate').prop('disabled', true);
                        $('#planenddate').prop('disabled', true);
                        $('#revisedstartdate').prop('disabled', true);
                        $('#revisedenddate').prop('disabled', true);
                        $('#actualstartdate').prop('disabled', true);
                        $('#actualenddate').prop('disabled', true);
                        $('#activestatus').prop('disabled', true);
                        $('#releasedesc').prop('disabled', true);

                        $(".noeditPermission").removeClass("hidden");
                        $(".editPermission").addClass("hidden");

                      if(data['editPermission'] != null && data['editPermission'] >0){

                          $('#releasename').removeAttr('disabled');
                          $('#releasestatus').removeAttr('disabled');
                          $("#releasestatus").selectpicker("refresh");
                          $('#projectId').removeAttr('disabled');
                          $("#projectId").selectpicker("refresh");
                          $('#planstartdate').removeAttr('disabled');
                          $('#planenddate').removeAttr('disabled');
                          $('#revisedstartdate').removeAttr('disabled');
                          $('#revisedenddate').removeAttr('disabled');
                          $('#actualstartdate').removeAttr('disabled');
                          $('#actualenddate').removeAttr('disabled');
                          $('#activestatus').removeAttr('disabled');
                          $('#releasedesc').removeAttr('disabled');

                          $(".noeditPermission").addClass("hidden");
                          $(".editPermission").removeClass("hidden");

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


/** save release form data */
$('form[id="releaseform"]').validate({
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
    "releasename": {
        required: true,
        foldername: true,
        checkunique: "releasename"
      },
    "planstartdate": {
        required: true,
      },
    "planenddate": {
        required: true,
        greaterStart: ["#planstartdate","plan start date"],
      },
      "revisedstartdate": {
        required:  function(element) {return ($("#revisedenddate").val()!="");},
        greaterStart: ["#planstartdate","plan start date"]
      },
      "revisedenddate": {
        required:  function(element) {return ($("#revisedstartdate").val()!="");},
        greaterStart: ["#revisedstartdate","revised start date"],
      },
      "actualstartdate": {
        required:  function(element) {return ($("#actualenddate").val()!="");},
        greaterStart: ["#planstartdate","plan start date"]
      },
      "actualenddate": {
        greaterStart: ["#actualstartdate","actual start date"]
      },
      "projectId": 'required',
      "releasedesc": {
          maxlength: textlimit
      }
  },
  messages: {
    "releasename": {
        required: 'Please enter release name'
      },
    "planstartdate": {
        required: 'Please select plan start date'
      },
    "planenddate": {
        required: 'Please select plan end date'
      },
    "revisedstartdate": {
        required: 'Please select revised start date'
      },
    "revisedenddate": {
        required: 'Please select revised end date'
      },
    "actualstartdate": {
        required: 'Please select actual start date'
      },
    "actualenddate": {
        required: 'Please select actual end date'
      },
    "projectId": 'Please select project',
    "releasedesc": {
      maxlength: "You have reached your maximum limit of characters allowed"
    }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     form_data.append('releasename_change',($("#releasename").val() != null && $("#releasename").val() != $("#releasename").attr("data-exist") ? "1":"0"));
     form_data.append('releasestatus_change',($("#releasestatus").val() != null && $("#releasestatus").val() != $("#releasestatus").attr("data-exist") ? "1":"0"));
     form_data.append('projectId_change',($("#projectId").val() != null && $("#projectId").val() != $("#projectId").attr("data-exist") ? "1":"0"));
     form_data.append('planstartdate_change',($("#planstartdate").val() != null && $("#planstartdate").val() != $("#planstartdate").attr("data-exist") ? "1":"0"));
     form_data.append('planenddate_change',($("#planenddate").val() != null && $("#planenddate").val() != $("#planenddate").attr("data-exist") ? "1":"0"));
     form_data.append('revisedstartdate_change',($("#revisedstartdate").val() != null && $("#revisedstartdate").val() != $("#revisedstartdate").attr("data-exist") ? "1":"0"));
     form_data.append('revisedenddate_change',($("#revisedenddate").val() != null && $("#revisedenddate").val() != $("#revisedenddate").attr("data-exist") ? "1":"0"));
     form_data.append('actualstartdate_change',($("#actualstartdate").val() != null && $("#actualstartdate").val() != $("#actualstartdate").attr("data-exist") ? "1":"0"));
     form_data.append('actualenddate_change',($("#actualenddate").val() != null && $("#actualenddate").val() != $("#actualenddate").attr("data-exist") ? "1":"0"));
     form_data.append('activestatus_change',($("#activestatus").val() != null && $("#activestatus").val() != $("#activestatus").attr("data-exist") ? "1":"0"));
     
     $.ajax({
        url: STEP_root+"api/saveRelease.php", //The url where the server req would we made.
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
   var mymodal = $('#releasemodal');
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTbl();
}
function reloadTbl(){

    $("#projectId").val('default');
    $("#projectId").selectpicker("refresh");
    $("#releasename").attr("data-id","0");
    $("#duration").html(0);
    $("#elapsedays").html(0);
    $("#remaingdays").html(0);

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
         $('#releaseTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#releaseTbl tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });  
   
   // Handle click on checkbox to set state of "Select all" control
   $('#releaseTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
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
   

/** bulk action to change the status of release */
    $( document ).on( "click", ".bulkAction", function(e) {
        // prevent default action
        e.preventDefault();

          var nType = $(this).attr("data-type");
          if(bulkcheckboxarr.length > 0){
                $.ajax({
                url: STEP_root+"api/releasebulkAction.php", //The url where the server req would we made.
                async: false,
                type: "POST", //The type which you want to use: GET/POST
                data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=Release", //The variables which are going.
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
   
      });

/** raise the flag if desc changes */
$( document ).on( "change", "[id=releasedesc]", function(e) {
        // prevent default action
        e.preventDefault();
        var nId = $(this).attr("id");
        $("#"+nId+"_change").val(1);
});
$('#releasemodal').on('hidden.bs.modal', function () {
  $('#releaseform').trigger("reset");

  $("#informationalert").html("");

  $("#projectId").removeAttr("disabled");

  $("#projectId").val('default');
  $("#projectId").selectpicker("refresh");
  $("#releasename").attr("data-id","0");
  $("#duration").html(0);
  $("#elapsedays").html(0);
  $("#remaingdays").html(0);
  $("#releasedesc_change").val("0");

  $("#releasestatus").val('default');
  $("#releasestatus").selectpicker("refresh");


  $("#releasedesc_change").val("0");
  $("#releasename").attr("data-exist","");
  $("#releasestatus").attr("data-exist","");
  $("#projectId").attr("data-exist","");
  $("#planstartdate").attr("data-exist","");
  $("#planenddate").attr("data-exist","");
  $("#revisedstartdate").attr("data-exist","");
  $("#revisedenddate").attr("data-exist","");
  $("#actualstartdate").attr("data-exist","");
  $("#actualenddate").attr("data-exist","");
  $("#activestatus").attr("data-exist","");


  $('#releasename').removeAttr('disabled');
  $('#releasestatus').removeAttr('disabled');
  $("#releasestatus").selectpicker("refresh");
  $('#projectId').removeAttr('disabled');
  $("#projectId").selectpicker("refresh");
  $('#planstartdate').removeAttr('disabled');
  $('#planenddate').removeAttr('disabled');
  $('#revisedstartdate').removeAttr('disabled');
  $('#revisedenddate').removeAttr('disabled');
  $('#actualstartdate').removeAttr('disabled');
  $('#actualenddate').removeAttr('disabled');
  $('#activestatus').removeAttr('disabled');
  $('#releasedesc').removeAttr('disabled');

  $(".noeditPermission").addClass("hidden");
  $(".editPermission").removeClass("hidden");
  
  $('#releaseform .state-error').css('display', 'none');
});

$( document ).on( "change", "[id=tblfilterprojectId],[id=tblfilterreleaseId],[id=tblfilterstatus],[id=tblfilterplanstart],[id=tblfilterplanend]", function(e) {
        // prevent default action
        e.preventDefault();
        releaseTable.ajax.reload( null, false );
});

    $( document ).on( "change", "[id=projectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nProjectId = this.value;
        $.ajax({
            type: "POST",
            url: STEP_root+'api/getProject.php',
            dataType:'json',
            data:  {"id":nProjectId}, 
            success: function(data)
            {
            if(data !=null){
                if(data['projectclient'] !=null){
                    $("#projectclient").val(data['projectclient']);
                    $("#projectclient").trigger("change");

                    $("#project_planstartdate").val(data['planstartdate']);
                    $("#project_planenddate").val(data['planenddate']);

                    $("#project_revisedstartdate").val(data['revisedstartdate']);
                    $("#project_revisedenddate").val(data['revisedenddate']);

                }
              }
            },error:function (jqXHR, textStatus, errorThrown) {
                    $("#projectclient").val("0");
                    $("#projectclient").trigger("change");
            }
          });
});

$( document ).on( "click", "#resetFilter", function(e) {
        // prevent default action
        e.preventDefault();
        

          $("#tblfilterprojectId").val('default');
          $("#tblfilterprojectId").selectpicker("refresh");

          $("#tblfilterreleaseId").html(filterReleaseoption);
          $("#tblfilterreleaseId").val('default');
          $("#tblfilterreleaseId").selectpicker('refresh');


          $("#tblfilterplanstart").val('');
          $("#tblfilterplanend").val('');

          $("#tblfilterstatus").val('default');
          $("#tblfilterstatus").selectpicker("refresh");
          reloadTbl();
});

})(jQuery);
