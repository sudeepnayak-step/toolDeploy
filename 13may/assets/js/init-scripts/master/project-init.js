var bulkcheckboxarr = new Array();
var filterProjoption = "";
var filterOwneroption = "";
var imgexts = new Array('gif', 'png', 'jpg','jpeg');
var docexts = new Array('docx','doc');
var csvexts = new Array('csv');
var pdfexts = new Array('pdf');
var excelexts = new Array('xls','xlsx','xlt');

(function ($) {
    //    "use strict";
    /*  Data Table
    -------------*/
 $(".stepeditor123").Editor({
  'texteffects':true,
'aligneffects':true,
'textformats':true,
'fonteffects':true,
'actions' : false,
'insertoptions' : false,
'extraeffects' : false,
'advancedoptions' : false,
'screeneffects':false,
'bold': true,
'italics': true,
'underline':true,
'ol':true,
'ul':true,
'undo':true,
'redo':true,
'l_align':true,
'r_align':true,
'c_align':true,
'justify':true,
'insert_link':false,
'unlink':false,
'insert_img':false,
'hr_line':true,
'block_quote':true,
'source':false,
'strikeout':false,
'indent':false,
'outdent':false,
// 'fonts':fonts,
// 'styles':styles,
'print':false,
'rm_format':false,
'status_bar':false,
// 'font_size':fontsizes,
// 'color':colors,
// 'splchars':specialchars,
'insert_table':false,
'select_all':false,
'togglescreen':false

 });
  $('#bootstrap-data-table').DataTable({
      lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
  });
$("#tblfilterstatus").val('default');
$("#tblfilterstatus").selectpicker("refresh");
$("#projectstatus").val('default');
$("#projectstatus").selectpicker("refresh");

$.fn.dataTable.ext.errMode = 'none';


/**
 * @function p1
 * @description 
 * This function is used to fill employee dropdown in project add/edit form.
 * It calls getDropdown.php API and fills team member and project owner dropdowns.
 * @returns {Promise} Returns a promise which resolves to true.
 */
var p1 = function(){
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
                $("#teammember").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
                $("#projectowner").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
                $("#tblfilterowner").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
                filterOwneroption += "<option value='"+value['id']+"' >"+value['name']+"</option>";
              });
            }

            $("#teammember").selectpicker('refresh');
            $("#projectowner").selectpicker('refresh');
            $("#tblfilterowner").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};

/**
 * @function p2
 * @description 
 * This function is used to fill client dropdown in project add/edit form.
 * It calls getDropdown.php API and fills client dropdown.
 * @returns {Promise} Returns a promise which resolves to true.
 */
var p2 = function(){
    return new Promise(function(resolve, reject){        
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'Client'}, 
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#projectclient").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
              });
            }

            $("#projectclient").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};
/**
 * @function p3
 * @description 
 * Fetches active projects from the server and populates the project dropdowns 
 * with the retrieved data. Updates the `#tblfilterprojectId` element with the 
 * active projects and refreshes the selectpicker.
 */
var p3 = function(){
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
                $("#tblfilterprojectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                filterProjoption += "<option value='"+value['id']+"' >"+value['projectname']+"</option>";
              });
            }

            $("#tblfilterprojectId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};
p1().then(p2).then(p3).then(function(){
});

/** Initialize the project table */
  var projTable =  $('#projectTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        formatErrorMessage("","");

    } ).DataTable({
      "ajax": {
        "url": STEP_root+"api/getallProjects.php",
        "type":"POST",
        "data": function (d) {
            var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : '');
            var nStatus = ($("#tblfilterstatus").val() != null ? $("#tblfilterstatus").val() : '');
            var nOwner = ($("#tblfilterowner").val() != null ? $("#tblfilterowner").val() : '');
            var nPlanstart = ($("#tblfilterplanstart").val() != null ? $("#tblfilterplanstart").val() : '');
            var nPlanend = ($("#tblfilterplanend").val() != null ? $("#tblfilterplanend").val() : '');

            return "projectId="+nProjectId+"&&status="+nStatus+"&&owner="+nOwner+"&&planstart="+nPlanstart+"&&planend="+nPlanend;
 
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
              return '<a href="JavaScript:void(0)" id="editProject'+row[0]+'" data-id="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#projectmodal" ><b>'+
                      data+
                      '</b> </a>';
            }
        }, 
        {
            "orderable": true,
            'targets': [4],
              "class": "text-left",
            "render": function ( data, type, row ) {
              var nArr = (data != null && data !="") ? data.split(",") : [];
              var nMembers = "";
              var nCount = 0;
              
              for(var j=0; j<nArr.length; j++){
                if(j <3){
                  nMembers += '<span class="fa fa-user text-step "></span> ';
                }else{
                  nCount++;
                }
              }
              if(nCount >0){

                  nMembers += '<span class="badge badge-pill badge-step ">+'+nCount+'</span> ';
              }
              return type == "export" ? data : nMembers;
            }
        },
        {
          "orderable": true,
            "targets": [5],
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
          "orderable": true,
            "targets": [3],
            "class":"text-left",
            render: function ( data, type, row ) {
                var badgecolor = "badge-warning";
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
          "orderable": false,
          "visible": ((localStorage.getItem("usertype") == "Admin") || (localStorage.getItem("ruleIds").split(",").indexOf("4") !== -1)) ? true : false,
          "targets": -1,
          "class":"text-left",
          render: function ( data, type, row ) {
          return '<a href="JavaScript:void(0)" id="deleteProject'+data+'" data-id="'+data+'" >'+
                  '  <span class="fa fa-trash text-danger "></span>'+
                ' </a>';
          }           
        },
        {
            "orderable": true,
            "targets": [-2],
            "class":"text-left",
            render: function ( data, type, row ) {
                var badgecolor = (data != "Active" ? "badge-danger" : "badge-success");
                return '<span class="badge badge-pill '+badgecolor+'">'+data+'</span>';
            }           
        },
        {
          "orderable": true,
          "targets": -3,
          "class":"text-left",
          render: function ( data, type, row ) {

            if(data == "1"){
              return '<a href="'+STEP_root+'master/projectattachments.php?id='+row[0]+'" class="text-step"><b>View</b> </a>';
            }else{
                return 'Not Found';
            }
          }           
        },
        {"orderable": true,"targets":[2,3,5,6,7,8,9,10,11,15,16,17],"class":"text-left"}  ,
        {"visible": false,"orderable": false,"targets":[2,4,15,12,13,14],"class":"text-left"}
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
          "text":'<span style="padding-right:5px; float:left" ><i class="fa fa-download"></i>&nbsp; Project Report</span>',
          "buttons": [
              {
                  "text": 'Excel',
                  "title": 'Project Report',
                  "extend": 'excelHtml5',
                  "exportOptions": {
                    "columns": ':not(.notexport)',
                    "orthogonal": 'export'
                  }
              },
              {
                  "text": 'CSV',
                  "title": 'Project Report',
                  "extend": 'csvHtml5',
                  "exportOptions": {
                    "columns": ':not(.notexport)',
                    "orthogonal": 'export'
                  }
              },
              {
                  "text": 'PDF',
                  "title": 'Project Report',
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
	projTable.buttons().container().appendTo('#exportButtonsContainer');

 	$( document ).on( "click", "[id^=newProject]", function(e) {
      // prevent default action
      e.preventDefault();
      if($("#projectform").is(":hidden")){
        $("#projectform").show();
      }else{
        $("#projectform").hide();
      }
      
  });

  /** delete project by id */
 $( document ).on( "click", "[id^=deleteProject]", function(e) {
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
                        url: STEP_root+'api/deleteProject.php',
                        dataType:'json',
                        data:  {"id":currentId,'formtype':'Activity'}, 
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

/** delete the attachment for project */
 $( document ).on( "click", "[id^=deleteattachment_]", function(e) {
    // prevent default action
    e.preventDefault();

    var nId = $(this).attr("data-id");
    var nFilepath = $(this).attr("data-file");
    if(nFilepath != ""){
      $.confirm({
        title: 'Confirm!',
        content: 'Are you sure you want to delete this attachment?',
        buttons: {
            cancel: function () {
                
            },
            confirm: {
                btnClass: 'btn-blue',
                action: function(){
                    $.ajax({
                        type: "POST",
                        url: STEP_root+'api/deleteAttachment.php',
                        dataType:'json',
                        data:  {"filepath":nFilepath}, 
                        success: function(data)
                        {
                        if(data != null){
                          if(data['status'] != null){
                            if(data['status'] == "Success"){
                              $.alert({
                                    title: 'Success',
                                    content: data['message'],
                                    type: 'green',
                                    typeAnimated: true
                                });
                              $("#"+nId).remove();
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
  });
    
  /** view the attachment in new window */
    $( document ).on( "click", "[id^=projattachment_]", function(e) {
        // prevent default action
        e.preventDefault();
        var fileview = $(this).attr("fileview");
        window.open(fileview,"window2","");
    });
    
    /** get the details of [rpject by id] */
    $( document ).on( "click", "[id^=editProject]", function(e) {
      // prevent default action
      e.preventDefault();

      var currentId = $(this).attr("data-id");
      if(currentId != "0"){
            $.ajax({
              type: "POST",
              url: STEP_root+'api/getProject.php',
              dataType:'json',
              data:  {"id":currentId}, 
              success: function(data)
              {
              if(data !=null){
                  if(data['id'] !=null){
                      $("#projId").val(data['id']);
                      $("#projectname").val(data['projectname']);
                      $("#projectname").attr("data-id",data['id']);
                        $("#projectname").attr("data-exist",data['projectname']);

                      $("#projectcode").val(data['projectcode']);
                      $("#projectcode").attr("data-id",data['id']);
                        $("#projectcode").attr("data-exist",data['projectcode']);

                      $("#informationalert").html("");
                        if(data['editable'] != null && data['editable'] >0){

                          $("#informationalert").html('<div class="col-sm-12">'+
                                  '    <div class="alert  alert-info alert-dismissible fade show" role="alert">'+
                                  '        <span class="badge badge-pill badge-info">Information</span> Project code is not changable because release is already created for this project.'+
                                  '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                  '            <span aria-hidden="true">×</span>'+
                                  '        </button>'+
                                  '    </div>'+
                                  '</div>');
                          $('#projectcode').prop('disabled', true);
                        }else{
                          $('#projectcode').prop('disabled', false);
                        }

                      $("#projectstatus").val(data['projectstatus']);
                      $("#projectstatus").selectpicker("refresh");
                        $("#projectstatus").attr("data-exist",data['projectstatus']);

                      $("#ragstatus").val(data['ragstatus']);
                        $("#ragstatus").attr("data-exist",data['ragstatus']);

                      $("#activestatus").val(data['activestatus']);
                        $("#activestatus").attr("data-exist",data['activestatus']);

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

                      $("#projectdesc").val(data['projectdesc']);

                      $("#projectowner").val(data['projectowner']);
                      $("#projectowner").selectpicker('refresh');
                      $("#projectowner").attr("data-exist",data['projectowner']);

                      $("#projectclient").val(data['projectclient']);
                      $("#projectclient").selectpicker('refresh');
                      $("#projectclient").attr("data-exist",data['projectclient']);

                      $('#teammember').selectpicker('val', data['teammember'].split(","));
                      $("#teammember").attr("data-exist",data['teammember']);
                      
                      $("#teammember").selectpicker('refresh');
                      $("#projattachmentsheader").addClass("hidden");
                        if(data['attachments'] != null){
                          $.each( data['attachments'], function( key, value ) {
                          
                          $("#projattachmentsheader").removeClass("hidden");
                            if(jQuery.inArray( value['extension'], docexts ) > -1){

                                $("#projattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
                                    '  <div class="card">'+
                                    '      <div class="card-body">'+
                                    '          <div class="mx-auto d-block" align="center">'+
                                    '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><img src="'+STEP_root+'images/doc.png" height="50%" width="50%"></a>'+
                                    '          </div>'+
                                    '          <hr>'+
                                    (!(data['editPermission'] != null && data['editPermission'] >0) ?
                                        '          <div class="card-text text-center">'+
                                    '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '          </div>'
                                    :
                                      '          <div class="card-text ">'+
                                    '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'" data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                                    '          </div>')+
                                    '      </div>'+
                                    '  </div>'+
                                  '</div>');
                            }else if(jQuery.inArray( value['extension'], csvexts ) > -1){

                                $("#projattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
                                    '  <div class="card">'+
                                    '      <div class="card-body">'+
                                    '          <div class="mx-auto d-block" align="center">'+
                                    '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><img src="'+STEP_root+'images/csv.png" height="50%" width="50%"></a>'+
                                    '          </div>'+
                                    '          <hr>'+
                                    (!(data['editPermission'] != null && data['editPermission'] >0) ?
                                      '          <div class="card-text text-center">'+
                                    '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '          </div>'
                                    :
                                      '          <div class="card-text ">'+
                                    '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                                    '          </div>')+
                                    '      </div>'+
                                    '  </div>'+
                                  '</div>');
                            }else if(jQuery.inArray( value['extension'], pdfexts ) > -1){

                                $("#projattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
                                    '  <div class="card">'+
                                    '      <div class="card-body">'+
                                    '          <div class="mx-auto d-block" align="center">'+
                                    '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><img src="'+STEP_root+'images/pdf.png" height="50%" width="50%"></a>'+
                                    '          </div>'+
                                    '          <hr>'+
                                    (!(data['editPermission'] != null && data['editPermission'] >0) ?
                                      '          <div class="card-text text-center">'+
                                    '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '          </div>'
                                    :
                                      '          <div class="card-text ">'+
                                    '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                                    '          </div>')+
                                    '      </div>'+
                                    '  </div>'+
                                  '</div>');
                            }else if(jQuery.inArray( value['extension'], excelexts ) > -1){

                                $("#projattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
                                    '  <div class="card">'+
                                    '      <div class="card-body">'+
                                    '          <div class="mx-auto d-block" align="center">'+
                                    '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><img src="'+STEP_root+'images/excel.png" height="50%" width="50%"></a>'+
                                    '          </div>'+
                                    '          <hr>'+
                                    (!(data['editPermission'] != null && data['editPermission'] >0) ?
                                      '          <div class="card-text text-center">'+
                                    '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '          </div>'
                                    :
                                      '          <div class="card-text ">'+
                                    '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                                    '          </div>')+
                                    '      </div>'+
                                    '  </div>'+
                                  '</div>');
                            }else if(jQuery.inArray( value['extension'], imgexts ) > -1){

                                $("#projattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
                                    '  <div class="card">'+
                                    '      <div class="card-body">'+
                                    '          <div class="mx-auto d-block" align="center">'+
                                    '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><img src="'+value['filename']+'" height="50%" width="50%"></a>'+
                                    '          </div>'+
                                    '          <hr>'+
                                    (!(data['editPermission'] != null && data['editPermission'] >0) ?
                                        '          <div class="card-text text-center ">'+
                                    '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '          </div>'
                                    :
                                      '          <div class="card-text ">'+
                                    '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                                    '          </div>')+
                                    '      </div>'+
                                    '  </div>'+
                                  '</div>');
                            }else {

                                $("#projattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
                                    '  <div class="card">'+
                                    '      <div class="card-body">'+
                                    '          <div class="mx-auto d-block" align="center">'+
                                    '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><i class="fa fa-file-text pr-1"></i></a>'+
                                    '          </div>'+
                                    '          <hr>'+
                                    (!(data['editPermission'] != null && data['editPermission'] >0) ? 
                                      '          <div class="card-text text-center">'+
                                    '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '          </div>' : 
                                      '          <div class="card-text ">'+
                                    '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                    '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                                    '          </div>')+
                                    '      </div>'+
                                    '  </div>'+
                                  '</div>');
                            }
                          });
                        }
                        calculateDays();

                        $('#projectname').prop('disabled', true);
                        $('#projectcode').prop('disabled', true);
                        $('#projectstatus').prop('disabled', true);
                        $("#projectstatus").selectpicker("refresh");
                        $('#planstartdate').prop('disabled', true);
                        $('#planenddate').prop('disabled', true);
                        $('#revisedstartdate').prop('disabled', true);
                        $('#revisedenddate').prop('disabled', true);
                        $('#actualstartdate').prop('disabled', true);
                        $('#actualenddate').prop('disabled', true);
                        $('#teammember').prop('disabled', true);
                        $("#teammember").selectpicker("refresh");
                        $('#projectowner').prop('disabled', true);
                        $("#projectowner").selectpicker("refresh");
                        $('#projectclient').prop('disabled', true);
                        $("#projectclient").selectpicker("refresh");
                        $('#ragstatus').prop('disabled', true);
                        $('#activestatus').prop('disabled', true);
                        $('#projectdesc').prop('disabled', true);
                        $('#file').prop('disabled', true);
                        $(".noeditPermission").removeClass("hidden");
                        $(".editPermission").addClass("hidden");

                        if(data['editPermission'] != null && data['editPermission'] >0){
                            $('#projectname').removeAttr('disabled');
                            $('#projectcode').removeAttr('disabled');
                            $('#projectstatus').removeAttr('disabled');
                            $("#projectstatus").selectpicker("refresh");
                            $('#planstartdate').removeAttr('disabled');
                            $('#planenddate').removeAttr('disabled');
                            $('#revisedstartdate').removeAttr('disabled');
                            $('#revisedenddate').removeAttr('disabled');
                            $('#actualstartdate').removeAttr('disabled');
                            $('#actualenddate').removeAttr('disabled');
                            $('#teammember').removeAttr('disabled');
                            $("#teammember").selectpicker("refresh");
                            $('#projectowner').removeAttr('disabled');
                            $("#projectowner").selectpicker("refresh");
                            $('#projectclient').removeAttr('disabled');
                            $("#projectclient").selectpicker("refresh");
                            $('#ragstatus').removeAttr('disabled');
                            $('#activestatus').removeAttr('disabled');
                            $('#projectdesc').removeAttr('disabled');
                            $('#file').removeAttr('disabled');
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


	$('#row-select').DataTable( {
        initComplete: function () {
				this.api().columns().every( function () {
					var column = this;
					var select = $('<select class="form-control"><option value=""></option></select>')
						.appendTo( $(column.footer()).empty() )
						.on( 'change', function () {
							var val = $.fn.dataTable.util.escapeRegex(
								$(this).val()
							);

							column
								.search( val ? '^'+val+'$' : '', true, false )
								.draw();
						} );

					column.data().unique().sort().each( function ( d, j ) {
						select.append( '<option value="'+d+'">'+d+'</option>' )
					} );
				} );
			}
		} );



/** save project data */
$('form[id="projectform"]').validate({

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
    "projectname": {
        required: true,
        foldername: true,
        checkunique: "projectname"
      },
    "projectcode": {
        required: true,
        foldername: true,
        checkunique: "projectcode"
      },
    "planstartdate": 'required',
    "planenddate": {
        required: true,
        greaterStart: ["#planstartdate","plan start date"]
      },
      "revisedstartdate": {
        required:  function(element) {return ($("#revisedenddate").val()!="");},
        greaterStart: ["#planstartdate","plan start date"]
      },
      "revisedenddate": {
        required:  function(element) {return ($("#revisedstartdate").val()!="");},
        greaterStart: ["#revisedstartdate","revised start date"]
      },
      "actualstartdate": {
        required:  function(element) {return ($("#actualenddate").val()!="" || $("#projectstatus").val()=="Complete");},
        greaterStart: ["#planstartdate","plan start date"]
      },
      "actualenddate": {
        required:  function(element) {return ($("#projectstatus").val()=="Complete");},
        greaterStart: ["#actualstartdate","actual start date"]
      },
      "teammember": 'required',
      "projectowner": 'required',
      "projectdesc": {
          maxlength: textlimit
      }
  },
  messages: {
    "projectname": {
        required: 'Please enter project name'
      },
    "projectcode": {
        required: 'Please enter project code'
      },
    "planstartdate": 'Please select plan start date',
    "planenddate": {
        required: 'Please select plan enddate'
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
        required: 'Please select actual enddate'
      },
    "teammember": 'Please select team members',
    "projectowner": 'Please select project owner',
    "projectdesc": {
      maxlength: "You have reached your maximum limit of characters allowed"
    }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 

     form_data.append('projectname_change',($("#projectname").val() != null && $("#projectname").val() != $("#projectname").attr("data-exist") ? "1":"0"));
     form_data.append('projectcode_change',($("#projectcode").val() != null && $("#projectcode").val() != $("#projectcode").attr("data-exist") ? "1":"0"));
     form_data.append('projectstatus_change',($("#projectstatus").val() != null && $("#projectstatus").val() != $("#projectstatus").attr("data-exist") ? "1":"0"));
     form_data.append('planstartdate_change',($("#planstartdate").val() != null && $("#planstartdate").val() != $("#planstartdate").attr("data-exist") ? "1":"0"));
     form_data.append('planenddate_change',($("#planenddate").val() != null && $("#planenddate").val() != $("#planenddate").attr("data-exist") ? "1":"0"));
     form_data.append('revisedstartdate_change',($("#revisedstartdate").val() != null && $("#revisedstartdate").val() != $("#revisedstartdate").attr("data-exist") ? "1":"0"));
     form_data.append('revisedenddate_change',($("#revisedenddate").val() != null && $("#revisedenddate").val() != $("#revisedenddate").attr("data-exist") ? "1":"0"));
     form_data.append('actualstartdate_change',($("#actualstartdate").val() != null && $("#actualstartdate").val() != $("#actualstartdate").attr("data-exist") ? "1":"0"));
     form_data.append('actualenddate_change',($("#actualenddate").val() != null && $("#actualenddate").val() != $("#actualenddate").attr("data-exist") ? "1":"0"));
     form_data.append('teammember_change',($("#teammember").val() != null && $("#teammember").val() != $("#teammember").attr("data-exist") ? "1":"0"));
     form_data.append('projectowner_change',($("#projectowner").val() != null && $("#projectowner").val() != $("#projectowner").attr("data-exist") ? "1":"0"));
     form_data.append('projectclient_change',($("#projectclient").val() != null && $("#projectclient").val() != $("#projectclient").attr("data-exist") ? "1":"0"));
     form_data.append('ragstatus_change',($("#ragstatus").val() != null && $("#ragstatus").val() != $("#ragstatus").attr("data-exist") ? "1":"0"));
     form_data.append('activestatus_change',($("#activestatus").val() != null && $("#activestatus").val() != $("#activestatus").attr("data-exist") ? "1":"0"));
     $.ajax({
        url: STEP_root+"api/saveProject.php", //The url where the server req would we made.
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
   var mymodal = $('#projectmodal');
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTbl();
}
function reloadTbl(){

    $("#projectowner").val('default');
    $("#projectowner").selectpicker("refresh");
    $("#teammember").val('default');
    $("#teammember").selectpicker("refresh");
    $("#projectclient").val('default');
    $("#projectclient").selectpicker("refresh");

    $("#projectname").attr("data-id","0");
    $("#projectcode").attr("data-id","0");
    projTable.ajax.reload( null, false );
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
         $('#projectTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#projectTbl tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });  
   


$( document ).on( "change", "[id=projectdesc]", function(e) {
        // prevent default action
        e.preventDefault();
        var nId = $(this).attr("id");
        $("#"+nId+"_change").val(1);
});
   // Handle click on checkbox to set state of "Select all" control
   $('#projectTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
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
   

/** bulk action to update the status for multiple project */
    $( document ).on( "click", ".bulkAction", function(e) {
        // prevent default action
        e.preventDefault();

        var nType = $(this).attr("data-type");
        if(bulkcheckboxarr.length > 0){
              $.ajax({
              url: STEP_root+"api/bulkAction.php", //The url where the server req would we made.
              async: false,
              type: "POST", //The type which you want to use: GET/POST
              data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=Project", //The variables which are going.
              dataType: "html", //Return data type (what we expect).
              //This is the function which will be called if ajax call is successful.
              success: function(data)
              { 
                  projTable.ajax.reload( null, false );
                  $('#select_all').attr("checked",false);
                  bulkcheckboxarr.length = 0;
              },error:function (jqXHR, textStatus, errorThrown) {
                    formatErrorMessage(jqXHR, errorThrown);
              }
          });
        }
      });

$('#projectmodal').on('hidden.bs.modal', function () {
  $('#projectform').trigger("reset");
  $("#projectname").attr("data-id","0");
  $("#projectowner").val('default');
  $("#projectowner").selectpicker("refresh");
  $("#teammember").val('default');
  $("#teammember").selectpicker("refresh");
  $("#projectclient").val('default');
  $("#projectclient").selectpicker("refresh");
  $("#duration").html(0);
  $("#elapsedays").html(0);
  $("#remaingdays").html(0);
  $("#projattachments").html("");
  $("#projattachmentsheader").addClass("hidden");
  $("#projectdesc_change").val("0");

  $("#projectstatus").val('default');
  $("#projectstatus").selectpicker("refresh");


  $("#informationalert").html("");

  $("#projectcode").removeAttr("disabled");

  $("#projectdesc_change").val("0");
  $("#projectname").attr("data-exist","");
  $("#projectcode").attr("data-exist","");
  $("#projectstatus").attr("data-exist","");
  $("#planstartdate").attr("data-exist","");
  $("#planenddate").attr("data-exist","");
  $("#revisedstartdate").attr("data-exist","");
  $("#revisedenddate").attr("data-exist","");
  $("#actualstartdate").attr("data-exist","");
  $("#actualenddate").attr("data-exist","");
  $("#teammember").attr("data-exist","");
  $("#projectowner").attr("data-exist","");
  $("#projectclient").attr("data-exist","");
  $("#ragstatus").attr("data-exist","");
  $("#activestatus").attr("data-exist","");
            


  $('#projectname').removeAttr('disabled');
  $('#projectcode').removeAttr('disabled');
  $('#projectstatus').removeAttr('disabled');
  $("#projectstatus").selectpicker("refresh");
  $('#planstartdate').removeAttr('disabled');
  $('#planenddate').removeAttr('disabled');
  $('#revisedstartdate').removeAttr('disabled');
  $('#revisedenddate').removeAttr('disabled');
  $('#actualstartdate').removeAttr('disabled');
  $('#actualenddate').removeAttr('disabled');
  $('#teammember').removeAttr('disabled');
  $("#teammember").selectpicker("refresh");
  $('#projectowner').removeAttr('disabled');
  $("#projectowner").selectpicker("refresh");
  $('#projectclient').removeAttr('disabled');
  $("#projectclient").selectpicker("refresh");
  $('#ragstatus').removeAttr('disabled');
  $('#activestatus').removeAttr('disabled');
  $('#projectdesc').removeAttr('disabled');
  $('#file').removeAttr('disabled');
  $(".noeditPermission").addClass("hidden");
  $(".editPermission").removeClass("hidden");

  $('#projectform .state-error').css('display', 'none');
});

$( document ).on( "change", "[id=tblfilterprojectId],[id=tblfilterowner],[id=tblfilterstatus],[id=tblfilterplanstart],[id=tblfilterplanend]", function(e) {
        // prevent default action
        e.preventDefault();
        projTable.ajax.reload( null, false );
});

$( document ).on( "change", "[id=tblfilterprojectId]", function(e) {
      // prevent default action
      e.preventDefault();
      var nProjectId = this.value;

      filterOwner().then(function(){
      });
});

/**
 * filterOwner
 * 
 * This function will filter the owner dropdown in project grid based on the selected project id
 * 
 * @return {Promise} - It will return a promise, if the promise is resolved, it means the filter is done.
 */
var filterOwner = function(){
    return new Promise(function(resolve, reject){
      var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : '');
        
      $("#tblfilterowner").html('');
      $("#tblfilterowner").selectpicker('refresh');
      $.ajax({
        type: "POST",
        url: STEP_root+'api/getDropdown.php',
        dataType:'json',
        data:  {'formtype':'allFilterOwner',"projectId":nProjectId}, 
        success: function(data)
        {
          if(data != null && data['data']!=null){
            $.each( data['data'], function( key, value ) {
              $("#tblfilterowner").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
            });
          }

          $("#tblfilterowner").selectpicker('refresh');
          resolve(true);
        },error:function (jqXHR, textStatus, errorThrown) {
          resolve(true);
        }
    });
  
  });
};

$( document ).on( "click", "#resetFilter", function(e) {
    // prevent default action
    e.preventDefault();


    $("#tblfilterprojectId").val('default');
    $("#tblfilterprojectId").selectpicker("refresh");

    $("#tblfilterowner").html(filterOwneroption);
    $("#tblfilterowner").val('default');
    $("#tblfilterowner").selectpicker('refresh');


    $("#tblfilterplanstart").val('');
    $("#tblfilterplanend").val('');

    $("#tblfilterstatus").val('default');
    $("#tblfilterstatus").selectpicker("refresh");
    reloadTbl();
});


})(jQuery);
