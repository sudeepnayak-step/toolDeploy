var bulkcheckboxarr = new Array();
var filterProjoption = "";
var filterReleaseoption = "";
var filterActivityoption = "";
var  riskActivityId = 0;
var riskSrno = 0;
var actionableBYOpt = "";
(function ($) {

    //    "use strict";
var temp_testsuiteId = window.location.search.substr(1);

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const paramval1 =(urlParams.has('id') ?  urlParams.get('id') : 0);

const risktype =(urlParams.has('type') ? urlParams.get('type')  : "");

$.fn.dataTable.ext.errMode = 'none';
$('#bootstrap-data-table').DataTable({
    lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
});

$("#tblfilterstatus").val('default');
$("#tblfilterstatus").selectpicker("refresh");
$("#activityId").html("");
$("#activityId").selectpicker('refresh');

$("#projectId").html("");
$("#projectId").selectpicker('refresh');

$("#releaseId").html("");
$("#releaseId").selectpicker('refresh');

$("#tblfilterprojectId").html("");
$("#tblfilterprojectId").selectpicker('refresh');

$("#tblfilterreleaseId").html("");
$("#tblfilterreleaseId").selectpicker('refresh');

$("#tblfilteractivityId").html("");
$("#tblfilteractivityId").selectpicker('refresh');

$("#assignto").html("");
$("#assignto").selectpicker('refresh');
$("#owner").html("");
$("#owner").selectpicker('refresh');


/**
 * p1 is a promise that returns a list of all activities from the API 
 * It resolves with true once the data is fetched and the dropdowns are populated
 * 
 * @return {Promise} 
 * @resolves {Boolean} true
 */
var p1 = function(){
    return new Promise(function(resolve, reject){
        
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'Activity'}, 
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#activityId").append("<option value='"+value['id']+"' ntype='"+value['activitytype']+"' >"+value['activityname']+"</option>");
                $("#tblfilteractivityId").append("<option value='"+value['id']+"' ntype='"+value['activitytype']+"' >"+value['activityname']+"</option>");
                filterActivityoption += "<option value='"+value['id']+"' ntype='"+value['activitytype']+"' >"+value['activityname']+"</option>";
              });
            }

            $("#activityId").selectpicker('refresh');
            $("#tblfilteractivityId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
        });
  
    });
};

/**
 * Fetches a list of all active projects from the server and appends them to 
 * the projectId and tblfilterprojectId select elements in the DOM.
 * @return {Promise} A promise that resolves to true when the dropdowns are 
 * successfully populated with project data.
 */

var p2 = function(){
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
                $("#tblfilterprojectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                filterProjoption += "<option value='"+value['id']+"' >"+value['projectname']+"</option>";
              });
            }

            $("#projectId").selectpicker('refresh');
            $("#tblfilterprojectId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};

/**
 * Fetches a list of all employees from the server and appends them to 
 * the owner select element in the DOM.
 * @return {Promise} A promise that resolves to true when the dropdown is 
 * successfully populated with employee data.
 */
var p3 = function(){
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
              $("#owner").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
              actionableBYOpt +="<option value='"+value['id']+"' >"+value['name']+"</option>";
            });
          }

          $("#owner").selectpicker('refresh');
          resolve(true);
        },error:function (jqXHR, textStatus, errorThrown) {
          resolve(true);
        }
      });
    });
};


/**
 * p4 Promise
 * 
 * Initiates an AJAX call to retrieve a dropdown list of all filter releases.
 */
var p4 = function(){
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

p1().then(p2).then(p3).then(p4).then(function(){
});

/** initialize the activity table */
  var releaseTable =  $('#activityTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
      formatErrorMessage("","");

  } ).DataTable({
      responsive: true,
      "ajax": {
        "type":"POST",
        "url": STEP_root+"api/getallProjectActivity.php",
        "data": function (d) {
          
            var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : '');
            var nReleaseId = ($("#tblfilterreleaseId").val() != null ? $("#tblfilterreleaseId").val() : '');
            var nActivityId = ($("#tblfilteractivityId").val() != null ? $("#tblfilteractivityId").val() : '');
            var nStatus = ($("#tblfilterstatus").val() != null ? $("#tblfilterstatus").val() : '');
            var nPlanstart = ($("#tblfilterplanstart").val() != null ? $("#tblfilterplanstart").val() : '');
            var nPlanend = ($("#tblfilterplanend").val() != null ? $("#tblfilterplanend").val() : '');
            
            return "projectId="+nProjectId+"&&status="+nStatus+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&planstart="+nPlanstart+"&&planend="+nPlanend;
 
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
        {
              "orderable": false,
              'targets': [1],
                "class": "text-left",
              "render": function ( data, type, row ) {
                return '<a href="JavaScript:void(0)" id="editProjactivity'+row[0]+'" data-id="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#activitymodal" ><b>'+
                        data+
                        '</b> </a>';
              }
        }, 
        {"orderable": true,
            "targets": -1,
            "visible": ((localStorage.getItem("usertype") == "Admin") || (localStorage.getItem("ruleIds").split(",").indexOf("12") !== -1)) ? true : false,
            "class":"text-left",
            render: function ( data, type, row ) {
            return '<a href="JavaScript:void(0)" id="deleteProjactivity'+data+'" data-id="'+data+'" >'+
                    '  <span class="fa fa-trash text-danger "></span>'+
                  ' </a>';
            }           
        },

        {
          "orderable": true,
            "targets": [2],
            "class":"text-left",
            render: function ( data, type, row ) {
              if(data == ""){
                return "-";
              }else{
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
                // var badgecolor = (data == "Pending" ? "badge-warning" : "badge-success");
                return '<span class="badge badge-pill '+badgecolor+'">'+data+'</span>';
              }
            }           
        },
        {
              "orderable": true,
              'targets': [10],
                "class": "text-left",
              "render": function ( data, type, row ) {
                var lbl = (data !="0" ? "View Risk/Issue" : "Add Risk/Issue");
                return '<a href="JavaScript:void(0)" id="viewRiskissue'+row[0]+'" data-id="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#riskissuemodal" ><b>'+
                        lbl+
                        '</b> </a>';
              }
        },
        {
          "orderable": true,
            "targets": [11],
            "class":"text-left",
            render: function ( data, type, row ) {
                var badgecolor = "badge-danger";
                switch(data){
                  case "Excellent":
                    badgecolor = "badge-success";
                    break;
                  case "Good":
                    badgecolor = "badge-primary ";
                    break;
                  case "Normal":
                    badgecolor = "badge-warning";
                    break;

                }
                return '<span class="badge  '+badgecolor+'">'+data+'</span>';
            }           
        },
        {"orderable": true,
            "targets": [-2],
            "class":"text-left",
            render: function ( data, type, row ) {
                var badgecolor = (data != "Active" ? "badge-danger" : "badge-success");
                return '<span class="badge badge-pill '+badgecolor+'">'+data+'</span>';
            }           
        },
        {"orderable": true,"targets":[1,2,3,4,5,7,8,9,10,11,12,13],"class":"text-left"}  
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
            "text":'<span style="padding-right:5px; float:left" ><i class="fa fa-download"></i>&nbsp; Test Plan Report</span>',
            "buttons": [
                {
                    "text": 'Excel',
                    "title": 'Test Plan List',
                    "extend": 'excelHtml5',
                    "exportOptions": {
                      "columns": ':not(.notexport)',
                      "orthogonal": 'export'
                    }
                },
                {
                    "text": 'CSV',
                    "title": 'Test Plan List',
                    "extend": 'csvHtml5',
                    "exportOptions": {
                      "columns": ':not(.notexport)',
                      "orthogonal": 'export'
                    }
                },
                {
                    "text": 'PDF',
                    "title": 'Test Plan List',
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
/** initialize the risk table */
 var riskissueTbl =  $('#riskissueTbl')
 .on( 'error.dt', function ( e, settings, techNote, message ) {
        formatErrorMessage("","");

    } ).DataTable({
        responsive: true,
        "ajax": {
        "url": STEP_root+"api/getallRiskissue.php",
        "data": function (d) {
            return "activityId="+riskActivityId;
 
        }
      },
      "columnDefs": [

        {
          "orderable": false,
          "targets": 0,
          "class":"text-center",
          render: function ( data, type, row ) {
          return (++riskSrno);
          }           
        },
        {"orderable": false,
          "targets": -1,
          "class":"text-center",
          render: function ( data, type, row ) {
          return '<input type="hidden" id="riskissueId'+riskSrno+'" name="riskissueId[]" value="'+data+'" /><a href="JavaScript:void(0)" id="deleteRiskIssue'+data+'" data-id="'+data+'" >'+
                  '  <span class="fa fa-trash text-danger "></span>'+
                  ' </a>';
          }           
        },
        {
          "orderable": false,
          "targets": 1,
          "class":"text-center",
          render: function ( data, type, row ) {
          return '<input type="text" id="raiseddate'+riskSrno+'" style="width:150px;"  name="raiseddate[]" value="'+data+'"  data-exist="'+data+'" data-no="'+riskSrno+'" placeholder="dd/mm/yyyy" class="form-control dateselection" readonly="">';
          }           
        },
        {
          "orderable": false,
          "targets": 2,
          "class":"text-center",
          render: function ( data, type, row ) {
          return '<select required class="form-control" id="riskissuetype'+riskSrno+'"  data-exist="'+data+'" name="riskissuetype[]" style="background:transparent; border:none; width:150px;">'+
                      '<option value="" >Select Type</option>'+
                      '<option value="Risk" '+(data == "Risk" ? 'selected = "selected" ' : '')+'>Risk</option>'+
                      ' <option value="Issue" '+(data == "Issue" ? 'selected = "selected" ' : '')+'>Issue</option>'+
                    '</select>';
          }           
        },
        {
          "orderable": false,
          "targets": 3,
          "class":"text-center",
          render: function ( data, type, row ) {
          return '<input type="hidden" id="changeriskissuedesc'+riskSrno+'" name="changeriskissuedesc[]"  value="0" />'+
                '<textarea  class="form-control" style="width:150px;" name="riskissuedesc[]" id="riskissuedesc'+riskSrno+'" rows="2">'+data+'</textarea>';
          }           
        },
        {
          "orderable": false,
          "targets": 4,
          "class":"text-center",
          render: function ( data, type, row ) {
          return '<select class="  form-control" id="actionableby'+riskSrno+'" data-exist="'+data+'" name="actionableby[]" data-val="'+data+'" data-live-search="true" title="Select Employee" data-hide-disabled="true" style="background:transparent; border:none; width:150px;">'+
                      '<option value="" >Select Actionable By</option>'+actionableBYOpt
                    '</select>';
          }           
        },
        {
          "orderable": false,
          "targets": 5,
          "class":"text-center",
          render: function ( data, type, row ) {
          return '<input type="hidden" id="changeriskissueplan'+riskSrno+'" name="changeriskissueplan[]"  value="0" />'+
                '<textarea  class="form-control" style="width:150px;" name="riskissueplan[]" id="riskissueplan'+riskSrno+'" rows="2" >'+data+'</textarea>';
          }           
        },
        {
          "orderable": false,
          "targets": 6,
          "class":"text-center",
          render: function ( data, type, row ) {
          return '<input type="text" id="closuredate'+riskSrno+'" data-exist="'+data+'" style="width:150px;"  name="closuredate[]" value="'+data+'" placeholder="dd/mm/yyyy" class="form-control " readonly="">';
          }           
        },
        {
          "orderable": false,
          "targets": 7,
          "class":"text-center",
          render: function ( data, type, row ) {
            
          return '<span id="ageingdays'+riskSrno+'" name="ageingdays[]" >'+data+'</span>';
          }           
        },
        {"orderable": false,
          "targets": 8,
          // "visible": false,
          "class":"text-center",
          render: function ( data, type, row ) {
          return '<select class="form-control" id="riskissuestatus'+riskSrno+'" data-exist="'+data+'" name="riskissuestatus[]"  data-no="'+riskSrno+'"  style="background:transparent; border:none; width:150px;">'+
                      '<option value="" >Select Staus</option>'+
                      '<option value="In Progress" '+(data == "In Progress" ? 'selected = "selected" ' : '')+'>In Progress</option>'+
                      ' <option value="Open" '+(data == "Open" ? 'selected = "selected" ' : '')+'>Open</option>'+
                      ' <option value="Close" '+(data == "Close" ? 'selected = "selected" ' : '')+'>Close</option>'+
                    '</select>';
          }           
        },
        {"orderable": false,
          "targets": 9,
          // "visible": false,
          "class":"text-center",
          render: function ( data, type, row ) {
          return '<input type="hidden" id="changeprobability'+riskSrno+'" name="changeprobability[]"  value="0" />'+
                '<textarea  class="form-control" style="width:150px;" name="probability[]" id="probability'+riskSrno+'" rows="2">'+data+'</textarea>';
          }           
        },
        {"orderable": false,
          "targets": 10,
          // "visible": false,
          "class":"text-center",
          render: function ( data, type, row ) {
          return '<input type="hidden" id="changeimpact'+riskSrno+'" name="changeimpact[]"  value="0" />'+
                '<textarea  class="form-control" style="width:150px;" name="impact[]" id="impact'+riskSrno+'" rows="2">'+data+'</textarea>';
          }           
        }
      ],
      "fnRowCallback": function (nRow, aData, iDisplayIndex) {
          $("td:nth-child(1)", nRow).html(iDisplayIndex + 1);
          return nRow;
      },
      "drawCallback": function (settings) { 

        $("[id^=actionableby]").each(function() {
          var nVal = $(this).attr("data-val");
            $(this).val(nVal);
        });
        $("[id^=riskissuestatus]").each(function() {
            var nStatus = $(this).val();
            if(nStatus != "Close"){
              var nSrno = $(this).attr("data-no");
              var startdate = moment($("#raiseddate"+nSrno).val(), 'DD/MM/YYYY').format('MM/DD/YYYY');
              var nAgeing = 0;
              var enddate =  moment().format('MM/DD/YYYY')
              nAgeing = getBusinessDatesCount(new Date(startdate),new Date(enddate));
              console.log(nSrno,"changeDate :: ",nAgeing);
              $("#ageingdays"+nSrno).html(nAgeing);
            }
        });
      },
      "searching": false,
      "paging": false,
      "info": false,
      "initComplete": function(settings, json) {
            if(risktype ==""){

              $("#editProjactivity"+paramval1).trigger("click");
            }else{
              $("#viewRiskissue"+paramval1).trigger("click");

            }

            setTimeout(function(){

            var url= document.location.href;
            window.history.pushState({}, "", url.split("?")[0]);
            },1000);
        }
  });

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}
$("#riskissueTbl").wrap("<div class='scrolledTable'></div>");

$( document ).on( "focus", "[id^=closuredate]", function(e) {
    // prevent default action
    e.preventDefault();
    var nId = $(this).attr("id");
    $("#"+nId).datepicker({
        format: 'dd/mm/yyyy',
        todayHighlight: true,
        autoclose: true
    });
    $("#"+nId).datepicker("setDate",'1d');
});
$( document ).on( "focus", "[id^=raiseddate]", function(e) {
    // prevent default action
    e.preventDefault();
    var nId = $(this).attr("id");
    $("#"+nId).datepicker({
        format: 'dd/mm/yyyy',
        todayHighlight: true,
        autoclose: true
    }).on("changeDate", function (e) {
        var nSrno = $(this).attr("data-no");
        var startdate = moment($(this).val(), 'DD/MM/YYYY').format('MM/DD/YYYY');
        var nAgeing = 0;
        var enddate =  moment().format('MM/DD/YYYY')
        nAgeing = getBusinessDatesCount(new Date(startdate),new Date(enddate));
        console.log(nSrno,"changeDate :: ",nAgeing);
        $("#ageingdays"+nSrno).html(nAgeing);
    });
    $("#"+nId).datepicker("setDate",'1d');
});

 $( document ).on( "change", "[id^=impact],[id^=probability],[id^=riskissueplan],[id^=riskissuedesc]", function(e) {
    // prevent default action
    e.preventDefault();
    var nId = $(this).attr("id");
    $("#change"+nId).val(1);
  });
 $( document ).on( "click", "[id^=deleteProjactivity]", function(e) {
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
                        data:  {"id":currentId,"formtype":"ProjectActivity"}, 
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

/** delete risk issue by id */
$( document ).on( "click", "[id^=deleteRiskIssue]", function(e) {
  // prevent default action
  e.preventDefault();
    var nthistr = $(this).parents('tr');
    var currentId = $(this).attr("data-id");
    if(currentId != "0"){
          $.ajax({
              type: "POST",
              url: STEP_root+'api/deleteAction.php',
              dataType:'text',
              data:  {"id":currentId,"formtype":"RiskIssue"}, 
              success: function(data)
              {
                riskissueTbl
              .row( nthistr )
              .remove()
              .draw();
              }
          });
      }else{

      }
  });

  /** get activity details */
    $( document ).on( "click", "[id^=editProjactivity]", function(e) {
        // prevent default action
        e.preventDefault();

        var currentId = $(this).attr("data-id");
        if(currentId != "0"){
          $.ajax({
              type: "POST",
              url: STEP_root+'api/getSingleedit.php',
              dataType:'json',
              data:  {"id":currentId,"formtype":"ProjectActivity"}, 
              success: function(data)
              {
              if(data !=null){
                  if(data['id'] !=null){
                      $("#projectclient").val(data['projectclient']);
                      $("#projactivityId").val(data['id']);
                      $("#projectactivitystatus").val(data['status']);
                        $("#projectactivitystatus").attr("data-exist",data['status']);
                      $("#projectactivitystatus").selectpicker("refresh");
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

                      $("#projactivitydesc").val(data['projactivitydesc']);

                      $("#activestatus").val(data['activestatus']);
                        $("#activestatus").attr("data-exist",data['activestatus']);

                      $("#percompletion").val(data['percompletion']);
                        $("#percompletion").attr("data-exist",data['percompletion']);

                      if(data['activitytype'] == "Execution"){
                        $("#percompletion").val("0");
                        $("#percompletiondiv").addClass("hidden");
                      }else{
                        $("#percompletiondiv").removeClass("hidden");                              
                      }

                        $("#activityId").val(data['activityId']);
                        $("#activityId").attr("data-exist",data['activityId']);

                      $("#informationalert").html("");
                        if(data['editable'] != null && data['editable'] >0){

                          $("#informationalert").html(' Project/Release/Activity is not changable because testcases are already created for this activity.');
                          $('#activityId').prop('disabled', true);
                        }else{
                          $('#activityId').prop('divsabled', false);
                        }
                        $("#activityId").selectpicker('refresh');

                        $("#projectId").val(data['projectId']);
                        $("#projectId").attr("data-exist",data['projectId']);
                          if(data['editable'] != null && data['editable'] >0){
                            $('#projectId').prop('disabled', true);
                          }else{
                            $('#projectId').prop('disabled', false);
                          }
                        $("#projectId").selectpicker('refresh');


                        $("#owner").val(data['owner']);
                        $("#owner").attr("data-exist",data['owner']);
                        $("#owner").selectpicker('refresh');
                        getprojinfo(data['projectId']);
                        getreleaseinfo(data['releaseId']);
                        getRelease(data['projectId'],0).then(function(){

                            $("#releaseId").val(data['releaseId']);
                            $("#releaseId").attr("data-exist",data['releaseId']);
                            if(data['editable'] != null && data['editable'] >0){
                                $('#releaseId').prop('disabled', true);
                            }else{
                                $('#releaseId').prop('disabled', false);
                            }
                            $("#releaseId").selectpicker('refresh');
                        });

                        getAssignee(data['projectId']).then(function(){
                            $('#assignto').selectpicker('val', data['assignto'].split(","));
                            $("#assignto").attr("data-exist",data['assignto']);
                            $("#assignto").selectpicker('refresh');
                        });
                        calculateDays();


                        $('#activityId').prop('disabled', true);
                        $("#activityId").selectpicker("refresh");
                        $('#projectId').prop('disabled', true);
                        $("#projectId").selectpicker("refresh");
                        $('#releaseId').prop('disabled', true);
                        $("#releaseId").selectpicker("refresh");
                        $('#projectactivitystatus').prop('disabled', true);
                        $("#projectactivitystatus").selectpicker("refresh");
                        $('#assignto').prop('disabled', true);
                        $("#assignto").selectpicker("refresh");
                        $('#planstartdate').prop('disabled', true);
                        $('#planenddate').prop('disabled', true);
                        $('#revisedstartdate').prop('disabled', true);
                        $('#revisedenddate').prop('disabled', true);
                        $('#actualstartdate').prop('disabled', true);
                        $('#actualenddate').prop('disabled', true);
                        $('#activestatus').prop('disabled', true);
                        $('#percompletion').prop('disabled', true);
                        $(".noeditPermission").removeClass("hidden");
                        $(".editPermission").addClass("hidden");
                        if(data['editPermission'] != null && data['editPermission'] >0){
                                                        
                            $('#activityId').removeAttr('disabled');
                            $("#activityId").selectpicker("refresh");
                            $('#projectId').removeAttr('disabled');
                            $("#projectId").selectpicker("refresh");
                            $('#releaseId').removeAttr('disabled');
                            $("#releaseId").selectpicker("refresh");
                            $('#projectactivitystatus').removeAttr('disabled');
                            $("#projectactivitystatus").selectpicker("refresh");
                            $('#assignto').removeAttr('disabled');
                            $("#assignto").selectpicker("refresh");
                            $('#planstartdate').removeAttr('disabled');
                            $('#planenddate').removeAttr('disabled');
                            $('#revisedstartdate').removeAttr('disabled');
                            $('#revisedenddate').removeAttr('disabled');
                            $('#actualstartdate').removeAttr('disabled');
                            $('#actualenddate').removeAttr('disabled');
                            $('#activestatus').removeAttr('disabled');
                            $('#percompletion').removeAttr('disabled');
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


    $( document ).on( "click", "[id^=addRiskissue]", function(e) {
        // prevent default action
        e.preventDefault();
         $.ajax({
            type: "POST",
            url: STEP_root+'api/addRiskissue.php',
            dataType:'html',
            data:  {"activityId":riskActivityId}, 
            success: function(data)
            {
            
              if(data !=null && data > 0){
                  riskissueTbl.row.add( [data,"","","","0","","","0","","","",data] ).draw();
              }
            },error:function (jqXHR, textStatus, errorThrown) {
                      formatErrorMessage(jqXHR, errorThrown);
                }
        });

    });


    $( document ).on( "click", "[id^=viewRiskissue]", function(e) {
        // prevent default action
        e.preventDefault();

          var currentId = $(this).attr("data-id");
          riskActivityId = currentId;
          riskSrno = 0;
          riskissueTbl.ajax.reload( null, false );

    });


    $( document ).on( "change", "[id=releaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nReleaseId = this.value;

        getreleaseinfo(nReleaseId);
    });
    $( document ).on( "change", "[id=projectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nProjectId = this.value;

        getprojinfo(nProjectId);
        getRelease(nProjectId,0);
        getAssignee(nProjectId);
    });


    /**
     * Populate the release info from the database given the release id.
     * @param {number} nReleaseId - The id of the release to get the info for.
     */
    function  getreleaseinfo(nReleaseId){
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getRelease.php',
          dataType:'json',
          data:  {"id":nReleaseId}, 
          success: function(data)
          {
          if(data !=null){
              if(data['planstartdate'] !=null){
                  $("#release_planstartdate").val(data['planstartdate']);
                  $("#release_planenddate").val(data['planenddate']);

                  $("#release_revisedstartdate").val(data['revisedstartdate']);
                  $("#release_revisedenddate").val(data['revisedenddate']);

                  $("#release_actualstartdate").val(data['actualstartdate']);
                  $("#release_actualenddate").val(data['actualenddate']);
              }
            }
          },error:function (jqXHR, textStatus, errorThrown) {
          }
        });
    }
/**
 * Fetches project information based on the provided project ID
 * and updates the project client field in the UI. If the project
 * client data is not found, it sets the field to "0".
 *
 * @param {number} nProjectId - The ID of the project to fetch information for.
 */

  function  getprojinfo(nProjectId){
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
              }
            }
          },error:function (jqXHR, textStatus, errorThrown) {
                  $("#projectclient").val("0");
                  $("#projectclient").trigger("change");
          }
        });
    }

    $( document ).on( "change", "[id=tblfilterprojectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nProjectId = this.value;
        filterRelease().then(filterActivity).then(function(){
        });
    });
     $( document ).on( "change", "[id=tblfilterreleaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        filterActivity().then(function(){
        });
    });

/**
 * Filters the release dropdown based on the selected project ID.
 * 
 * @returns {Promise} - A promise that resolves when the release dropdown is updated.
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

    /**
     * Filters the activity dropdown based on the selected project ID and release ID.
     * 
     * @returns {Promise} - A promise that resolves when the activity dropdown is updated.
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
          data:  {'formtype':'allFilterActivity',"projectId":nProjectId,"releaseId":nReleaseId}, 
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

   $( document ).on( "change", "[id=tblfilterprojectId],[id=tblfilterreleaseId],[id=tblfilteractivityId],[id=tblfilterstatus],[id=tblfilterplanstart],[id=tblfilterplanend]", function(e) {
     // prevent default action
      e.preventDefault();
      releaseTable.ajax.reload( null, false );

    });

    $( document ).on( "change", "[id=activityId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nVal = this.value;
        if(nVal != "0"){
            $.ajax({
                type: "POST",
                url: STEP_root+'api/getBasicmaster.php',
                dataType:'json',
                data:  {"id":nVal,'formtype':'Activity','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, 
                
                success: function(data)
                {
                if(data !=null){
                    if(data['activitytype'] !=null){
                      if(data['activitytype'] == "Execution"){
                          $("#percompletion").val("0");
                          $("#percompletiondiv").addClass("hidden");
                        }else{
                          $("#percompletion").val("");
                          $("#percompletiondiv").removeClass("hidden");                              
                        }
                    }
                }

                },error:function (jqXHR, textStatus, errorThrown) {
                      formatErrorMessage(jqXHR, errorThrown);
                }
            });
          }else{

                            $("#percompletion").val("0");
                            $("#percompletiondiv").addClass("hidden");
          }

        
});


  /**
   * @function getRelease
   * @description get release based on project id and type of release whether for filter or for table
   * @param {number} nProjectId - The ID of the project.
   * @param {number} nFlag - The flag indicating which release dropdown to update.
   *    - 1: $("#tblfilterreleaseId")
   *    - 2: $("#releaseId")
   * @return {Promise} - Resolves to true when the release dropdown has been updated.
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
          data:  {'formtype':'Release',"projectId":nProjectId}, 
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
            resolve(true);
          }
          
      });
  
    });
}


  /**
   * @function getAssignee
   * @description get Assignee based on project id
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

/** Saves the activity data into database */
$('form[id="activityform"]').validate({

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
    "projectactivitystatus": 'required',

    "percompletion": {
      required:  function(element) {
        return ($("#projectactivitystatus").val()=="In Progress" || $("#projectactivitystatus").val()=="Complete");
      }
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
      "projactivitydesc": {
          maxlength: textlimit
      }
  },
  messages: {
    "activityId": 'Please enter test plan',
    "projectId": 'Please select project',
    "releaseId": 'Please select release',
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
    "projactivitydesc": {
      maxlength: "You have reached your maximum limit of characters allowed"
    }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 

     form_data.append('activityId_change',($("#activityId").val() != null && $("#activityId").val() != $("#activityId").attr("data-exist") ? "1":"0"));
     form_data.append('releaseId_change',($("#releaseId").val() != null && $("#releaseId").val() != $("#releaseId").attr("data-exist") ? "1":"0"));
     form_data.append('projectId_change',($("#projectId").val() != null && $("#projectId").val() != $("#projectId").attr("data-exist") ? "1":"0"));
     form_data.append('projectactivitystatus_change',($("#projectactivitystatus").val() != null && $("#projectactivitystatus").val() != $("#projectactivitystatus").attr("data-exist") ? "1":"0"));
     form_data.append('planstartdate_change',($("#planstartdate").val() != null && $("#planstartdate").val() != $("#planstartdate").attr("data-exist") ? "1":"0"));
     form_data.append('planenddate_change',($("#planenddate").val() != null && $("#planenddate").val() != $("#planenddate").attr("data-exist") ? "1":"0"));
     form_data.append('revisedstartdate_change',($("#revisedstartdate").val() != null && $("#revisedstartdate").val() != $("#revisedstartdate").attr("data-exist") ? "1":"0"));
     form_data.append('revisedenddate_change',($("#revisedenddate").val() != null && $("#revisedenddate").val() != $("#revisedenddate").attr("data-exist") ? "1":"0"));
     form_data.append('actualstartdate_change',($("#actualstartdate").val() != null && $("#actualstartdate").val() != $("#actualstartdate").attr("data-exist") ? "1":"0"));
     form_data.append('actualenddate_change',($("#actualenddate").val() != null && $("#actualenddate").val() != $("#actualenddate").attr("data-exist") ? "1":"0"));
     form_data.append('activestatus_change',($("#activestatus").val() != null && $("#activestatus").val() != $("#activestatus").attr("data-exist") ? "1":"0"));
     form_data.append('assignto_change',($("#assignto").val() != null && $("#assignto").val() != $("#assignto").attr("data-exist") ? "1":"0"));
     form_data.append('percompletion_change',($("#percompletion").val() != null && $("#percompletion").val() != $("#percompletion").attr("data-exist") ? "1":"0"));
     $.ajax({
        url: STEP_root+"api/saveProjectAcitivity.php", //The url where the server req would we made.
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
   var mymodal = $('#activitymodal');
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
  $("#owner").val('default');
  $("#owner").selectpicker("refresh");
  $("#releaseId").html("");
  $("#releaseId").val('default');
  $("#releaseId").selectpicker("refresh")

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
         $('#activityTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#activityTbl tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });  
   
   // Handle click on checkbox to set state of "Select all" control
   $('#activityTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
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
   

/** bulk action to change status of activity */
$( document ).on( "click", ".bulkAction", function(e) {
    // prevent default action
    e.preventDefault();

    var nType = $(this).attr("data-type");
    if(bulkcheckboxarr.length > 0){
          $.ajax({
          url: STEP_root+"api/bulkAction.php", //The url where the server req would we made.
          async: false,
          type: "POST", //The type which you want to use: GET/POST
          data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=ProjectActivity", //The variables which are going.
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

$('#activitymodal').on('hidden.bs.modal', function () {
  $('#activityform').trigger("reset");
  $("#informationalert").html("");

  $("#activityId").removeAttr("disabled");
  $("#projectId").removeAttr("disabled");
  $("#releaseId").removeAttr("disabled");

  $("#activityId").val('default');
  $("#activityId").selectpicker("refresh");
  $("#projectId").val('default');
  $("#projectId").selectpicker("refresh");
  $("#owner").val('default');
  $("#owner").selectpicker("refresh");
  $("#releaseId").html("");
  $("#releaseId").val('default');
  $("#releaseId").selectpicker("refresh");
  $("#duration").html(0);
  $("#elapsedays").html(0);
  $("#remaingdays").html(0);


  $("#projectactivitystatus").val('default');
  $("#projectactivitystatus").selectpicker("refresh");

  $("#projactivitydesc_change").val("0");
  $("#activityId").attr("data-exist","");
  $("#assignto").attr("data-exist","");
  $("#releaseId").attr("data-exist","");
  $("#projectId").attr("data-exist","");
  $("#projectactivitystatus").attr("data-exist","");
  $("#planstartdate").attr("data-exist","");
  $("#planenddate").attr("data-exist","");
  $("#revisedstartdate").attr("data-exist","");
  $("#revisedenddate").attr("data-exist","");
  $("#actualstartdate").attr("data-exist","");
  $("#actualenddate").attr("data-exist","");
  $("#activestatus").attr("data-exist","");
  $("#percompletion").attr("data-exist","");

  $('#activityform .state-error').css('display', 'none');
});



$( document ).on( "change", "[id=projactivitydesc]", function(e) {
        // prevent default action
        e.preventDefault();
        var nId = $(this).attr("id");
        $("#"+nId+"_change").val(1);
        console.log(nId);
        console.log($("#"+nId+"_change").val());
});

/** save risk to database */
$('form[id="riskissueform"]').validate({

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
  messages: {},

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     form_data.append('activityId',riskActivityId);

    $("[id^=riskissueId]").each(function() {
      var nNo = $(this).attr('id').match(/\d+/); 
      form_data.append('raiseddate_change[]',($("#raiseddate"+nNo).val() != null && $("#raiseddate"+nNo).val() != $("#raiseddate"+nNo).attr("data-exist") ? "1":"0"));
      form_data.append('riskissuetype_change[]',($("#riskissuetype"+nNo).val() != null && $("#riskissuetype"+nNo).val() != $("#riskissuetype"+nNo).attr("data-exist") ? "1":"0"));
      form_data.append('actionableby_change[]',($("#actionableby"+nNo).val() != null && $("#actionableby"+nNo).val() != $("#actionableby"+nNo).attr("data-exist") ? "1":"0"));
      form_data.append('closuredate_change[]',($("#closuredate"+nNo).val() != null && $("#closuredate"+nNo).val() != $("#closuredate"+nNo).attr("data-exist") ? "1":"0"));
      form_data.append('riskissuestatus_change[]',($("#riskissuestatus"+nNo).val() != null && $("#riskissuestatus"+nNo).val() != $("#riskissuestatus"+nNo).attr("data-exist") ? "1":"0"));
     
    });
     $.ajax({
        url: STEP_root+"api/saveRiskissue.php", //The url where the server req would we made.
        async: false,
        type: "POST", //The type which you want to use: GET/POST
        data: form_data , //The variables which are going.
        dataType: "text", //Return data type (what we expect).
        cache: false,
        contentType: false,
        processData: false,
        //This is the function which will be called if ajax call is successful.
        success: function(data) {
            var mymodal = $('#riskissuemodal');
            mymodal.modal('hide');
            releaseTable.ajax.reload( null, false );
        },error:function (jqXHR, textStatus, errorThrown) {
          formatErrorMessage(jqXHR, errorThrown);
        }
    });
  }
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

          $("#tblfilterplanstart").val('');
          $("#tblfilterplanend").val('');

          $("#tblfilterstatus").val('default');
          $("#tblfilterstatus").selectpicker("refresh");
          reloadTbl();
});
})(jQuery);
