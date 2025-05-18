var bulkcheckboxarr = new Array();
var filterReleaseoption = "";
var filterRTMoption = "";
(function ($) {
    //    "use strict";

    /*  Data Table
    -------------*/
$("[id=rtmdesc]").Editor({
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
$("#rtmsummary").Editor({
  'texteffects':false,
'aligneffects':false,
'textformats':false,
'fonteffects':false,
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
'undo':false,
'redo':false,
'l_align':true,
'r_align':true,
'c_align':true,
'justify':true,
'insert_link':false,
'unlink':false,
'insert_img':false,
'hr_line':false,
'block_quote':false,
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

$.fn.dataTable.ext.errMode = 'none';
$('#bootstrap-data-table').DataTable({
    lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
});


$("#rtmstatus").val('default');
$("#rtmstatus").selectpicker("refresh");
$("#projectId").html("");
$("#projectId").selectpicker('refresh');

$("#releaseId").html("");
$("#releaseId").selectpicker('refresh');

$("#reviewer").html("");
$("#reviewer").selectpicker('refresh');

$("#assignto").html("");
$("#assignto").selectpicker('refresh');
$("#tblfilterprojectId").html("");
$("#tblfilterprojectId").selectpicker('refresh');


$("#tblfilterreleaseId").html("");
$("#tblfilterreleaseId").selectpicker('refresh');



$("#tblfilterrtmId").html("");
$("#tblfilterrtmId").selectpicker('refresh');


$("#tblfilterstatus").selectpicker('refresh');

/**
 * @description Loads active project list for project and filter.
 * @return {Promise} Resolves true if the active project list is loaded successfully.
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
                  $("#tblfilterprojectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
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
 * Promise function to populate Employee dropdown
 * @return {Promise} resolves true once done
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
 * Promise function to populate Release dropdown
 * @return {Promise} resolves true once done
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
 * @description Loads active RTM list for filter based on Project and Release.
 * @return {Promise} Resolves true if the active RTM list is loaded successfully.
 */
var filterRTM = function(){
    return new Promise(function(resolve, reject){
      var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : '');
      var nReleaseId = ($("#tblfilterreleaseId").val() != null ? $("#tblfilterreleaseId").val() : '');
        
      $("#tblfilterrtmId").html('');
      $("#tblfilterrtmId").selectpicker('refresh');
      $.ajax({
        type: "POST",
        url: STEP_root+'api/getDropdown.php',
        dataType:'json',
        data:  {'formtype':'allFilterRTM',"projectId":nProjectId,"releaseId":nReleaseId}, 
        success: function(data)
        {
          if(data != null && data['data']!=null){
            $.each( data['data'], function( key, value ) {
              $("#tblfilterrtmId").append("<option value='"+value['id']+"' >"+value['rtmId']+"</option>");
              filterRTMoption += "<option value='"+value['id']+"' >"+value['rtmId']+"</option>";
            });
          }

          $("#tblfilterrtmId").selectpicker('refresh');
          resolve(true);
      },error:function (jqXHR, textStatus, errorThrown) {
          resolve(true);
      }
    });
  
    });
};

p1().then(p2).then(p3).then(filterRTM).then(function(){
});

/** initialize RTM table */
  var releaseTable =  $('#rtmTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        formatErrorMessage("","");

  } ).DataTable({
     // responsive: true,
	autoWidth: false,
      "ajax": {
        "type":"POST",
        "url": STEP_root+"api/getallRTM.php",
        "data": function (d) {
            var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : "");
            var nReleaseId = ($("#tblfilterreleaseId").val() != null ? $("#tblfilterreleaseId").val() : "");
            var nRTMid = ($("#tblfilterrtmId").val() != null ? $("#tblfilterrtmId").val() : "");
            var nSTatus = ($("#tblfilterstatus").val() != null ? $("#tblfilterstatus").val() : "");
            return "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&rtmId="+nRTMid+"&&status="+nSTatus;
 
        }
      },
      "columnDefs": 
      [
        	{
                "orderable": false,
                'visible': false,
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
                "type": 'natural-nohtml',
                "render": function ( data, type, row ) {
                    return '<a href="'+STEP_root+'master/rtmtestcase.php?id='+row[0]+'" class="text-step"><b>'+data+'</b> </a>';
                }
            }, 
            {
                "orderable": true,
                "targets": [7],
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
                      case "Pass":
                        badgecolor = "badge-success";
                        break;
                      case "Fail":
                        badgecolor = "badge-danger";
                        break;

                    }
                    return '<span class="badge badge-pill '+badgecolor+'">'+data+'</span>';
                  }
                }           
            },
            {
                "orderable": false,
                "visible": ((localStorage.getItem("usertype") == "Admin") || (localStorage.getItem("ruleIds").split(",").indexOf("24") !== -1)) ? true : false,
                "targets": -1,
	              "class":"text-left",
                render: function ( data, type, row ) {
                return '<a href="JavaScript:void(0)" id="deleteRTM'+data+'" data-id="'+data+'" >'+
                        '  <span class="fa fa-trash text-danger "></span>'+
                      ' </a>';
                }           
        	  },
            {
              "orderable": true,"targets":5,"class":"text-left wrap-text",
        // 	render: renderDescriptionhtmlColumn
        //      "render": $.fn.dataTable.render.ellipsis()
            },
	    {"targets":6,"visible":false},
	    {"orderable": true,"targets":[1,2,3,5,7,8,9,10,11],"class":"text-left"}  
        ],
      "drawCallback": function (settings) { 
          $('[data-toggle="popover"]').popover();
      },
	scrollY: '500px',       // Set your desired height
	scrollCollapse: true,   // Collapse the table height if fewer rows
      "scrollX": true,
      "paging": true,
      "info": true,
      "stateSave": true,
      "sDom": "<'dt-panelmenu  clearfix'<'col-sm-8 text-left'lB><'col-sm-4'f>>" +
          "<'row'<'col-sm-12'tr>>" +
          "<'row'<'col-sm-5'i><'col-sm-7'p>>",
          "buttons": [
	{ extend: 'excel', className: 'btn ml-3',text:'<span style="padding-right:5px; float:left" ><i class="fa fa-download"></i>&nbsp; Requirement Export</span>',
                    "title": "Requirement Export",
                    "exportOptions": {
                          "columns": ':not(.notexport)',
                          "orthogonal": 'export'
                    } ,
                    action: function ( e, dt, node, config ) {
                            var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : "");
                            var nReleaseId = ($("#tblfilterreleaseId").val() != null ? $("#tblfilterreleaseId").val() : "");
                            var nRTMid = ($("#tblfilterrtmId").val() != null ? $("#tblfilterrtmId").val() : "");
                            var nSTatus = ($("#tblfilterstatus").val() != null ? $("#tblfilterstatus").val() : "");
                      // return "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&rtmId="+nRTMid+"&&status="+nSTatus;
                               var dform = $(document.createElement('form'));
                              $(dform).attr("action", STEP_root+"api/getRTMexport.php");
                              $(dform).attr("method", "POST");
    
                              var inputname = $("<input>").attr("type", "hidden").attr("name", "projectId").val(nProjectId);
                              $(dform).append($(inputname));
                              
                              var inputname1 = $("<input>").attr("type", "hidden").attr("name", "releaseId").val(nReleaseId);
                              $(dform).append($(inputname1));

                              var inputname2 = $("<input>").attr("type", "hidden").attr("name", "ids").val(nRTMid);
                              $(dform).append($(inputname2));

                              var inputname3 = $("<input>").attr("type", "hidden").attr("name", "status").val(nSTatus);
                              $(dform).append($(inputname3));


                              dform.appendTo( document.body );
                              $(dform).submit();
                              $(dform).remove();


                    }
                }
        //{
         //   "extend": 'collection',
          //  "autoClose": 'true',
           // "text":'<span style="padding-right:5px; float:left" ><i class="fa fa-download"></i>&nbsp; Requirements Export</span>',
            //"buttons": [
             //   {
              //      "text": 'Excel',
               //     "title": 'Requirements Export',
                //    "extend": 'excelHtml5',
                 //   "exportOptions": {
                  //    "columns": ':not(.notexport)',
                   //   "orthogonal": 'export'
                    //}
               // },
                //{
                 //   "text": 'CSV',
                  //  "title": 'Requirements Export',
                   // "extend": 'csvHtml5',
                    //"exportOptions": {
                     // "columns": ':not(.notexport)',
                      //"orthogonal": 'export'
                    //}
                //},
                //{
                 //   "text": 'PDF',
                  //  "title": 'Requirements Export',
                   // "extend": 'pdfHtml5',
                    //"orientation": 'landscape',
                    //"pageSize": 'LEGAL',
                    //"exportOptions": {
                    //  "columns": ':not(.notexport)',
                    //  "orthogonal": 'export'
                   // },
                   // customize: function ( doc ) {}
               // },
            //]
        //}
    ]

	});

  
releaseTable.buttons().container().appendTo('#exportButtonsContainer');

  /** delete RTM from database */
 $( document ).on( "click", "[id^=deleteRTM]", function(e) {
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
                      data:  {"id":currentId,"formtype":"RTM"}, 
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
function closeModelform(form){
   var mymodal = $('#rtmmodal');
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTbl();
}
function reloadTbl(){
    $("#projectId").val('default');
    $("#projectId").selectpicker("refresh");
    $("#reviewer").val('default');
    $("#reviewer").selectpicker("refresh");

  $("#assignto").val('default');
  $("#assignto").selectpicker("refresh");
    $("#releaseId").html("");
    $("#releaseId").val('default');
    $("#releaseId").selectpicker("refresh");


    releaseTable.ajax.reload( null, false );
    $('#select_all').attr("checked",false);
    bulkcheckboxarr.length = 0;
}

/** get details of RTM */
    $( document ).on( "click", "[id^=editRTM]", function(e) {
      // prevent default action
      e.preventDefault();

      var currentId = $(this).attr("data-id");
      if(currentId != "0"){
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getSingleedit.php',
          dataType:'json',
          data:  {"id":currentId,"formtype":"RTM"}, 
          success: function(data)
          {
          if(data !=null){
              if(data['id'] !=null){
                  $("#rtmId").val(data['id']);
                  $("#rtmstatus").val(data['rtmstatus']);
                  $("#rtmstatus").attr("data-exist",data['rtmstatus']);
                  $("#rtmstatus").selectpicker('refresh');
                  //$("#rtmdesc").val(data['rtmdesc']);
		  $("#priority").val(data['priority']);
                  $("#priority").attr("data-exist",data['priority']);

                  $("#editmode").val(data['editmode']);
                  $("#editmode").attr("data-exist",data['editmode']);
                  //$("#rtmsummary").val(data['summary']);
		  $("#rtmsummary").Editor("setText",data['summary']);
                  $("#rtmdesc").Editor("setText",data['rtmdesc']);
		  $("#rtmcomment").val(data['rtmcomment']);

                  $("#reviewer").val(data['rtmreviewer']);
                  $("#reviewer").selectpicker('refresh');
                  $("#reviewer").attr("data-exist",data['rtmreviewer']);

 		
                 $("#module").val(data['module']);
                 $("#module").attr("data-exist",data['module']);

                 $("#submodule").val(data['submodule']);
                 $("#submodule").attr("data-exist",data['submodule']);

                  $("#informationalert").html("");
                  $("#projectId").val(data['projectId']);
                  if(data['editable'] != null && data['editable'] >0){

                      $("#informationalert").html('<div class="col-sm-12">'+
                              '    <div class="alert  alert-info alert-dismissible fade show" role="alert">'+
                       //       '        <span class="badge badge-pill badge-info">Information</span> Project and release are not changable because testcase/defects are already added for this.'+
				'<span class="badge badge-pill badge-info">Information</span> Requirement and traceability matrix is captured here'+
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
                    $("#projectId").attr("data-exist",data['projectId']);


                  getRelease(data['projectId'],0).then(function(){
                    $("#releaseId").val(data['releaseId']);
                    if(data['editable'] != null && data['editable'] >0){
                      $('#releaseId').prop('disabled', true);
                    }else{
                      $('#releaseId').prop('disabled', false);
                    }
                    $("#releaseId").selectpicker('refresh');
                    $("#releaseId").attr("data-exist",data['releaseId']);

                  });
                  
                        getAssignee(data['projectId']).then(function(){
                            $("#assignto").val(data['assignto']);
                            $("#assignto").attr("data-exist",data['assignto']);
                            $("#assignto").selectpicker('refresh');
                        });
		$("#rtmattachmentsedit").html("");
		 $("#rtmattachmentseditheader").addClass("hidden");
            if(data['attachments'] != null){
              $.each( data['attachments'], function( key, value ) {
                console.log(key,value);
                $("#rtmattachmentseditheader").removeClass("hidden");
                if(jQuery.inArray( value['extension'], docexts ) > -1){

                    $("#rtmattachmentsedit").append('<div class="col-md-2" id="editattachment_'+key+'">'+
                        '  <div class="card">'+
                        '      <div class="card-body">'+
                        '          <div class="mx-auto d-block" align="center">'+
                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="editprojattachment_'+key+'"><img src="'+STEP_root+'images/doc.png" height="50%" width="50%"></a>'+
                        '          </div>'+
                        '          <hr>'+
                        ((data['editPermission'] != null && data['editPermission'] >0) ?
                          '          <div class="card-text ">'+
                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="editdeleteattachment_'+key+'" data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                        '          </div>'
                        :
                          '          <div class="card-text text-center">'+
                        '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '          </div>'
                        )+
                        '      </div>'+
                        '  </div>'+
                      '</div>');
                }else if(jQuery.inArray( value['extension'], csvexts ) > -1){

                    $("#rtmattachmentsedit").append('<div class="col-md-2" id="editattachment_'+key+'">'+
                        '  <div class="card">'+
                        '      <div class="card-body">'+
                        '          <div class="mx-auto d-block" align="center">'+
                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="editprojattachment_'+key+'"><img src="'+STEP_root+'images/csv.png" height="50%" width="50%"></a>'+
                        '          </div>'+
                        '          <hr>'+
                        ((data['editPermission'] != null && data['editPermission'] >0) ?
                          '          <div class="card-text ">'+
                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="editdeleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                        '          </div>'
                        :
                          '          <div class="card-text text-center ">'+
                        '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '          </div>')+
                        '      </div>'+
                        '  </div>'+
                      '</div>');
                }else if(jQuery.inArray( value['extension'], pdfexts ) > -1){

                    $("#rtmattachmentsedit").append('<div class="col-md-2" id="editattachment_'+key+'">'+
                        '  <div class="card">'+
                        '      <div class="card-body">'+
                        '          <div class="mx-auto d-block" align="center">'+
                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="editprojattachment_'+key+'"><img src="'+STEP_root+'images/pdf.png" height="50%" width="50%"></a>'+
                        '          </div>'+
                        '          <hr>'+

                        ((data['editPermission'] != null && data['editPermission'] >0) ?
                          '          <div class="card-text ">'+
                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="editdeleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                        '          </div>'
                        :
                          '          <div class="card-text text-center">'+
                        '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '          </div>')+
                        '      </div>'+
                        '  </div>'+
                      '</div>');
                }else if(jQuery.inArray( value['extension'], excelexts ) > -1){

                    $("#rtmattachmentsedit").append('<div class="col-md-2" id="editattachment_'+key+'">'+
                        '  <div class="card">'+
                        '      <div class="card-body">'+
                        '          <div class="mx-auto d-block" align="center">'+
                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="editprojattachment_'+key+'"><img src="'+STEP_root+'images/excel.png" height="50%" width="50%"></a>'+
                        '          </div>'+
                        '          <hr>'+

                        ((data['editPermission'] != null && data['editPermission'] >0) ?
                          '          <div class="card-text ">'+
                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="editdeleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                        '          </div>'+
                        '      </div>'
                        :
                          '          <div class="card-text text-center">'+
                        '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '          </div>'+
                        '      </div>')+
                        '  </div>'+
                      '</div>');
                }else if(jQuery.inArray( value['extension'], imgexts ) > -1){

                    $("#rtmattachmentsedit").append('<div class="col-md-2" id="editattachment_'+key+'">'+
                        '  <div class="card">'+
                        '      <div class="card-body">'+
                        '          <div class="mx-auto d-block" align="center">'+
                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="editprojattachment_'+key+'"><img src="'+value['filename']+'" height="50%" width="50%"></a>'+
                        '          </div>'+
                        '          <hr>'+

                        ((data['editPermission'] != null && data['editPermission'] >0) ?
                          '          <div class="card-text ">'+
                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="editdeleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                        '          </div>'+
                        '      </div>'
                        :
                        '          <div class="card-text text-center">'+
                        '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '          </div>'+
                        '      </div>')+
                        '  </div>'+
                      '</div>');
                }else {

                    $("#rtmattachmentsedit").append('<div class="col-md-2" id="editattachment_'+key+'">'+
                        '  <div class="card">'+
                        '      <div class="card-body">'+
                        '          <div class="mx-auto d-block" align="center">'+
                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="editprojattachment_'+key+'"><i class="fa fa-file-text pr-1"></i></a>'+
                        '          </div>'+
                        '          <hr>'+
                        ((data['editPermission'] != null && data['editPermission'] >0) ?
                          '          <div class="card-text ">'+
                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="editdeleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                        '          </div>'
                        :
                          '          <div class="card-text text-center">'+
                        '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                        '          </div>')+
                        '      </div>'+
                        '  </div>'+
                      '</div>');
                }
              });
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


//$( document ).on( "change", "#rtmdesc,#rtmcomment", function(e) {
$("#rtmsummary").parent().find(".Editor-editor").on("input keyup paste", function() {
 

        // prevent default action
     //   e.preventDefault();
// console.log("Editor content changed:", $(this).html());
       // var nId = $(this).attr("id");
        $("#rtmsummary_change").val(1);
});

$("#rtmdesc").parent().find(".Editor-editor").on("input keyup paste", function() {
 

        // prevent default action
     //   e.preventDefault();
// console.log("Editor content changed:", $(this).html());
       // var nId = $(this).attr("id");
        $("#rtmdesc_change").val(1);
});
$( document ).on( "change", "[id=projectId]", function(e) {
    // prevent default action
    e.preventDefault();
    var nPorjectId = this.value;
    getRelease(nPorjectId,0);
  console.log("getassignee");  
        getAssignee(nPorjectId);
});

$( document ).on( "change", "[id=tblfilterprojectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nProjectId = this.value;
        filterRelease().then(filterRTM).then(function(){
      });
});

$( document ).on( "change", "[id=tblfilterreleaseId]", function(e) {
      // prevent default action
      e.preventDefault();
      filterRTM().then(function(){
      });
});
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


$( document ).on( "change", "[id=releaseId]", function(e) {
    // prevent default action
    e.preventDefault();
    var nReleaseId = this.value;
    var nPorjectId = $("#projectId").val();
    getTestcase(nPorjectId,nReleaseId);
});


/** get release dropdown based on project Id */
  function getRelease(nProjectId,nFlag){

    return new Promise(function(resolve, reject){
        if(nFlag == 1){
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
                if(nFlag == 1){
                  $("#tblfilterreleaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                }else{
                  $("#releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");                            
                }
              });
            }
            if(nFlag == 1){
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

    /** save RTM form data into database */
$('form[id="rtmform"]').validate({

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
    "rtmdesc": {
     //   maxlength: textlimit
    },
    "rtmsummary": {
       //maxlength: textlimit
    },
    "rtmcomment": {
        maxlength: textlimit
    }
  },
  messages: {
    "projectId": 'Please select project',
    "releaseId": 'Please select release',
    "rtmdesc": {
     // maxlength: "You have reached your maximum limit of characters allowed"
    },
    "rtmsummary": {
     // maxlength: "You have reached your maximum limit of characters allowed"
    },
    "rtmcomment": {
      maxlength: "You have reached your maximum limit of characters allowed"
    }
  },

  submitHandler: function(form) {
  
   var form_data = new FormData($(form)[0]); 
//     var summarytxt = $("[id=rtmsummary1]").Editor("getText");   
try {
    var editorContent = $("[id=rtmsummary]").Editor("getText");
    form_data.append("rtmsummary", editorContent);

var descContent = $("[id=rtmdesc]").Editor("getText");
    form_data.append("rtmdesc",descContent);
  // form_data.append('rtmsummary_change',1);
    //console.log("Editor Content:", editorContent);

} catch (error) {
    //console.error("Error:", error);
    //alert("Error occurred: " + error.message);
}
  form_data.append('projectId_change',($("#projectId").val() != null && $("#projectId").val() != $("#projectId").attr("data-exist") ? "1":"0"));
     form_data.append('releaseId_change',($("#releaseId").val() != null && $("#releaseId").val() != $("#releaseId").attr("data-exist") ? "1":"0"));
     form_data.append('rtmstatus_change',($("#rtmstatus").val() != null && $("#rtmstatus").val() != $("#rtmstatus").attr("data-exist") ? "1":"0"));
     form_data.append('reviewer_change',($("#reviewer").val() != null && $("#reviewer").val() != $("#reviewer").attr("data-exist") ? "1":"0"));

     form_data.append('assignto_change',($("#assignto").val() != null && $("#assignto").val() != $("#assignto").attr("data-exist") ? "1":"0"));

     form_data.append('priority_change',($("#priority").val() != null && $("#priority").val() != $("#priority").attr("data-exist") ? "1":"0"));
    form_data.append('module_change',($("#module").val() != null && $("#module").val() != $("#module").attr("data-exist") ? "1":"0"));
     form_data.append('submodule_change',($("#submodule").val() != null && $("#submodule").val() != $("#submodule").attr("data-exist") ? "1":"0"));
     
     form_data.append('editmode_change',($("#editmode").val() != null && $("#editmode").val() != $("#editmode").attr("data-exist") ? "1":"0"));
     $.ajax({
        url: STEP_root+"api/saveRTM.php", //The url where the server req would we made.
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

 // Custom Validation Rule for jQuery Editor
        $.validator.addMethod("editorMaxLength", function (value, element, param) {
            var text = $("#rtmsummary").Editor("getText").trim(); // Get Editor text
            return text.length <= param;
        }, "Maximum {0} characters allowed.");


$(".dateselection").datepicker({
    format: 'dd/mm/yyyy',
    todayHighlight: true,
    autoclose: true,
});



$('.dropdown').on('show.bs.dropdown', function () {
  $('.dataTables_scrollFoot').css("overflow", "visible");
});
$('.dropdown').on('hide.bs.dropdown', function () {
  $('.dataTables_scrollFoot').css("overflow", "hidden");
});
$('thead input[id="select_all"]').on('click', function(e){ 

  if(this.checked){
      $('#rtmTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
  } else {
      $('#rtmTbl tbody input[type="checkbox"]:checked').trigger('click');
  }

  // Prevent click event from propagating to parent
  e.stopPropagation();
});  
   
   // Handle click on checkbox to set state of "Select all" control
   $('#rtmTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
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
   

/** bulk action to change the status of multiple release */
    $( document ).on( "click", ".bulkAction", function(e) {
        // prevent default action
        e.preventDefault();

          var nType = $(this).attr("data-type");
          if(bulkcheckboxarr.length > 0){
                $.ajax({
                url: STEP_root+"api/bulkAction.php", //The url where the server req would we made.
                async: false,
                type: "POST", //The type which you want to use: GET/POST
                data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=RTM", //The variables which are going.
                dataType: "html", //Return data type (what we expect).
                //This is the function which will be called if ajax call is successful.
                success: function(data)
                { 
                    releaseTable.ajax.reload( null, false );
                    $('#select_all').attr("checked",false);
                    bulkcheckboxarr.length = 0;
                }
            });
          }
   
      });

$('#rtmmodal').on('hidden.bs.modal', function () {
    $('#rtmform').trigger("reset");
  
    $("#projectId").removeAttr("disabled");
    $("#releaseId").removeAttr("disabled");
    $("#informationalert").html("");
            

    $("#rtmstatus").val('default');
    $("#rtmstatus").selectpicker("refresh");

    $("#projectId").val('default');
    $("#projectId").selectpicker("refresh");

    $("#rtmdesc_change").val("0");
    $("#rtmsummary_change").val("0");
    $("#rtmcomment_change").val("0");
    $("#reviewer").val('default');
    $("#reviewer").selectpicker("refresh");

  $("#assignto").val('default');
  $("#assignto").selectpicker("refresh");
    $("#releaseId").html("");
    $("#releaseId").val('default');
    $("#releaseId").selectpicker("refresh");
	
  $("#module").attr("data-exist","");
  $("#submodule").attr("data-exist","");
    $("#projectId").attr("data-exist","");
    $("#releaseId").attr("data-exist","");
    $("#rtmstatus").attr("data-exist","");
    $("#reviewer").attr("data-exist","");
    $('#rtmform .state-error').css('display', 'none');
});


$( document ).on( "change", "[id=tblfilterprojectId],[id=tblfilterreleaseId],[id=tblfilterrtmId],[id=tblfilterstatus]", function(e) {
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


          $("#tblfilterrtmId").html(filterRTMoption);
          $("#tblfilterrtmId").val('default');
          $("#tblfilterrtmId").selectpicker('refresh');

          $("#tblfilterstatus").val('default');
          $("#tblfilterstatus").selectpicker("refresh");
          reloadTbl();
});


  $( document ).on( "click", "[id^=editprojattachment_]", function(e) {
        // prevent default action
        e.preventDefault();

        var fileview = $(this).attr("fileview");
        window.open(fileview,"window2","");
    });
    
    $( document ).on( "click", "[id^=editdeleteattachment_]", function(e) {
      e.preventDefault();

      var nId = $(this).attr("data-id");
console.log(nId);
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
                        data:  {"filepath":nFilepath}, // serializes the form's elements.
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
                              $("#edit"+nId).remove();
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
      }else{

      }
    });
})(jQuery);
