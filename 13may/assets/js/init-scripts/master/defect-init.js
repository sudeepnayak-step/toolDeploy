var bulkcheckboxarr = new Array();
var filterReleaseoption = "";
var filterDefectIDoption = "";
var filterStatusoption = "";
var imgexts = new Array('gif', 'png', 'jpg','jpeg');
var docexts = new Array('docx','doc');
var csvexts = new Array('csv');
var excelexts = new Array('xls','xlsx','xlt');
(function ($) {
    //    "use strict";


$.fn.dataTable.ext.errMode = 'none';

/** initializing editor */
$("[id=testdata__]").Editor({
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
$("[id=shortdesc__]").Editor({
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

$("[id=longdesc__]").Editor({
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

$("[id=comment]").Editor({
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

$("[id=steps__]").Editor({
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

$("[id=expectedresult__]").Editor({
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

$("[id=actualresult__]").Editor({
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


$("#projectId").html("");
$("#projectId").selectpicker('refresh');
$("#upload_projectId").html("");
$("#upload_projectId").selectpicker('refresh');
$("#upload_releaseId").html("");
$("#upload_releaseId").selectpicker('refresh');

$("#tblfilterprojectId").html("");
$("#tblfilterprojectId").selectpicker('refresh');

$("#releaseId").html("");
$("#releaseId").selectpicker('refresh');

$("#tblfilterreleaseId").html("");
$("#tblfilterreleaseId").selectpicker('refresh');

$("#tblfilterdefectId").html("");
$("#tblfilterdefectId").selectpicker('refresh');

$("#tblfilterstatusId").html("");
$("#tblfilterstatusId").selectpicker('refresh');


$("#testcaseId").html("");
$("#testcaseId").selectpicker('refresh');

$("#defecttypeId").html("");
$("#defecttypeId").selectpicker('refresh');

$("#defectstatusId").html("");
$("#defectstatusId").selectpicker('refresh');

$("#assignto").html("");
$("#assignto").selectpicker('refresh');

/**
 * p1: Promise to get DefectType dropdown
 * @return {Promise}
 */
var p1 = function(){
    return new Promise(function(resolve, reject){
        $.ajax({
            type: "POST",
            url: STEP_root+'api/getDropdown.php',
            dataType:'json',
            data:  {'formtype':'DefectType'}, 
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

/**
 * p2: Promise to get DefectStatus dropdown
 * @return {Promise}
 */
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
                  $("#tblfilterstatusId").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
                  filterStatusoption += "<option value='"+value['id']+"' >"+value['name']+"</option>";
                });
              }

              $("#defectstatusId").selectpicker('refresh');
              $("#tblfilterstatusId").selectpicker('refresh');
              resolve(true);
            },error:function (jqXHR, textStatus, errorThrown) {
                resolve(true);
            }
        });
    });
};

/**
 * p3: Promise to retrieve and populate active projects dropdowns
 * @return {Promise}
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
                $("#tblfilterprojectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                $("#upload_projectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
              });
            }

            $("#projectId").selectpicker('refresh');
            $("#tblfilterprojectId").selectpicker('refresh');
            $("#upload_projectId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};


/**
 * p4: Promise to retrieve and populate all release dropdowns
 * @return {Promise}
 */
var p4 = function(){
    return new Promise(function(resolve, reject){
        $.ajax({
            type: "POST",
            url: STEP_root+'api/getDropdown.php',
            dataType:'json',
            data:  {'formtype':'allFilterRelease'}, // serializes the form's elements.
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
 * p5: Promise to retrieve and populate all defects dropdowns
 * @return {Promise}
 */
var p5 = function(){
    return new Promise(function(resolve, reject){
        $.ajax({
            type: "POST",
            url: STEP_root+'api/getDropdown.php',
            dataType:'json',
            data:  {'formtype':'allFilterDefect'}, // serializes the form's elements.
            success: function(data)
            {
              if(data != null && data['data']!=null){
                $.each( data['data'], function( key, value ) {
                  $("#tblfilterdefectId").append("<option value='"+value['id']+"' >"+value['defectId']+"</option>");
                  filterDefectIDoption += "<option value='"+value['id']+"' >"+value['defectId']+"</option>";
                });
              }
              $("#tblfilterdefectId").selectpicker('refresh');
              resolve(true);
            },error:function (jqXHR, textStatus, errorThrown) {
              resolve(true);
            }
        });
  
    });
};
p1().then(p2).then(p3).then(p4).then(p5).then(function(){
});
  
/** initialize defect table */
var releaseTable =  $('#defectTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        formatErrorMessage("","");

    } ).DataTable({
        responsive: true,
        "ajax": {
        "type":"POST",
        "url": STEP_root+"api/getallDefectslist.php",
        "data": function (d) {
            var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : "");
            var nReleaseId = ($("#tblfilterreleaseId").val() != null ? $("#tblfilterreleaseId").val() : "");
            var ndefectId = ($("#tblfilterdefectId").val() != null ? $("#tblfilterdefectId").val() : "");
            var nStatusId = ($("#tblfilterstatusId").val() != null ? $("#tblfilterstatusId").val() : "");
            return "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&defectId="+ndefectId+"&&statusId="+nStatusId;
 
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
              "targets": 5,
	            "type": 'natural-nohtml',
              "class":"text-left",
              render: function ( data, type, row ) {
                return '<a href="'+STEP_root+'master/defectdetails.php?id='+row[0]+'" class="text-step"><b>'+data+'</b> </a>';
              }
            },
            {
              "orderable": false,
              "visible": ((localStorage.getItem("usertype") == "Admin") || (localStorage.getItem("ruleIds").split(",").indexOf("28") !== -1)) ? true : false,
	            "targets": -1,
	            "class":"text-left",
	    		    render: function ( data, type, row ) {
                return '<a href="JavaScript:void(0)" id="deleteDefect'+data+'" data-id="'+data+'" >'+
                  '  <span class="fa fa-trash text-danger "></span>'+
                 ' </a>';
					
    			    }           
        	  },
            {"orderable": true,
              "targets": -2,
              "class":"text-left",
              render: function ( data, type, row ) {

                if(data == "1"){
              return '<a href="'+STEP_root+'master/defectattachments.php?id='+row[0]+'" class="text-step"><b>View</b> </a>';
                }else{
                    return 'Not Found';
                }
              }           
            },
            {
              "orderable": true,
              "targets": 14,
              "class":"text-left",
              render: function ( data, type, row ) {
              return (data !="" ? '<span class="badge  badge-default "><b>'+data+'</b></span> ' : "-");
              }
            },
            {
            "orderable": true,"targets":[7],"class":"text-left wrap-text",
                render: renderDescriptionhtmlColumn
//            "render": $.fn.dataTable.render.ellipsis()
            },
            {"orderable": false,"targets":[1,2,3,4,6,8,9,10,11,12,18,19],"class":"text-left" ,"visible" : false}  ,
            {"orderable": true,"targets":[7,13,14,15,16,17,18],"class":"text-left"}  
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
        "sDom": "<'dt-panelmenu  clearfix'<'col-sm-8 text-left'lB><'col-sm-4'f>>" +
          "<'row'<'col-sm-12'tr>>" +
          "<'row'<'col-sm-5'i><'col-sm-7'p>>",
          "buttons": [
            {
                "extend": 'collection',
                "autoClose": 'true',
                "text":'<span style="padding-right:5px; float:left" ><i class="fa fa-download"></i>&nbsp; Defect Report</span>',
                "buttons": [
                    {
                        "text": 'Excel',
                        "title": 'Defect Report',
                        "extend": 'excelHtml5',
                        "exportOptions": {
                          "columns": ':not(.notexport)',
                          "orthogonal": 'export'
                        }
                    },
                    {
                        "text": 'CSV',
                        "title": 'Defect Report',
                        "extend": 'csvHtml5',
                        "exportOptions": {
                          "columns": ':not(.notexport)',
                          "orthogonal": 'export'
                        }
                    },
                    {
                        "text": 'PDF',
                        "title": 'Defect Report',
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
  /** reove the defect data by id */
 $( document ).on( "click", "[id^=deleteDefect]", function(e) {
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
                            data:  {"id":currentId,"formtype":"Defect"}, // serializes the form's elements.
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

function closeModelform(form){
   var mymodal = $('#defectmodal');
    // mymodal.find('.modal-body').text(data);
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTbl();
}
function reloadTbl(){
  $('#defectform').trigger("reset");
  $("#projectId").val('default');
  $("#projectId").selectpicker("refresh");
  $("#assignto").val('default');
  $("#assignto").selectpicker("refresh");
  $("#releaseId").html("");
  $("#releaseId").val('default');
  $("#releaseId").selectpicker("refresh");
  $("#testcaseId").val('default');
  $("#testcaseId").selectpicker("refresh");
  $("#defectstatusId").val('default');
  $("#defectstatusId").selectpicker("refresh");
  $("#defecttypeId").val('default');
  $("#defecttypeId").selectpicker("refresh");
  $("#releaseId").html("");


  releaseTable.ajax.reload( null, false );
  $('#select_all').attr("checked",false);
  bulkcheckboxarr.length = 0;
}

/** get the details of defect */
    $( document ).on( "click", "[id^=editDefect]", function(e) {
        // prevent default action
        e.preventDefault();

        var currentId = $(this).attr("data-id");
        if(currentId != "0"){
          $.ajax({
              type: "POST",
              url: STEP_root+'api/getSingleedit.php',
              dataType:'json',
              data:  {"id":currentId,"formtype":"Defect"}, // serializes the form's elements.
              success: function(data)
              {
                if(data !=null){
                    if(data['id'] !=null){
                        if(data['testcaseId'] == "0" || data['testcaseId'] == ""){
                          enableModule();                           
                        }else{
                            disableModule(); 
                        }
                        $("#dId").val(data['id']);
                        $("#shortdesc").val(data['shortdesc']);
                        $("#longdesc").val(data['longdesc']);
                        $("#testdata").val(data['testdata']);
                        $("#steps").val(data['steps']);
                        $("#expectedresult").val(data['expectedresult']);
                        $("#actualresult").val(data['actualresult']);
                        
                        $("#module").val(data['module']);
                        $("#module").attr("data-exist",data['module']);
                        $("#submodule").val(data['submodule']);
                        $("#submodule").attr("data-exist",data['submodule']);
                        $("#severity").val(data['severity']);
                        $("#severity").attr("data-exist",data['severity']);
                        $("#priority").val(data['priority']);
                        $("#priority").attr("data-exist",data['priority']);

                        $("#defecttypeId").val(data['defecttypeId']);
                        $("#defecttypeId").attr("data-exist",data['defecttypeId']);
                        $("#defecttypeId").selectpicker('refresh');
                        $("#defectstatusId").val(data['defectstatusId']);
                        $("#defectstatusId").attr("data-exist",data['defectstatusId']);
                        $("#defectstatusId").selectpicker('refresh');

                        $("#projectId").val(data['projectId']);
                        $("#projectId").attr("data-exist",data['projectId']);
                        $("#projectId").selectpicker('refresh');



                        getRelease(data['projectId'],0).then(function(){
                            $("#releaseId").val(data['releaseId']);
                            $("#releaseId").attr("data-exist",data['releaseId']);
                            $("#releaseId").selectpicker('refresh');

                            getTestcase(data['projectId'],data['releaseId'],0).then(function(){
                              $("#testcaseId").val(data['testcaseId']);
                              $("#testcaseId").attr("data-exist",data['testcaseId']);
                              $("#testcaseId").selectpicker('refresh');
                            });
                        });

                        getAssignee(data['projectId']).then(function(){
                            $("#assignto").val(data['assignto']);
                            $("#assignto").attr("data-exist",data['assignto']);
                            $("#assignto").selectpicker('refresh');
                        });
                        $("#defectattachmentsedit").html("");
                        $("#defectattachmentsheaderedit").addClass("hidden");
                        if(data['attachments'] != null){
                          $.each( data['attachments'], function( key, value ) {
                            $("#defectattachmentsheaderedit").removeClass("hidden");
                              
                              if(jQuery.inArray( value['extension'], docexts ) > -1){

                                  $("#defectattachmentsedit").append('<div class="col-md-2" id="editattachment_'+key+'">'+
                                      '  <div class="card">'+
                                      '      <div class="card-body">'+
                                      '          <div class="mx-auto d-block" align="center">'+
                                      '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="editprojattachment_'+key+'"><img src="'+STEP_root+'images/doc.png" height="50%" width="50%"></a>'+
                                      '          </div>'+
                                      '          <hr>'+
                                      '          <div class="card-text ">'+
                                      '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                      '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="editdeleteattachment_'+key+'" data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                                      '          </div>'+
                                      '      </div>'+
                                      '  </div>'+
                                    '</div>');
                              }else if(jQuery.inArray( value['extension'], csvexts ) > -1){

                                  $("#defectattachmentsedit").append('<div class="col-md-2" id="editattachment_'+key+'">'+
                                      '  <div class="card">'+
                                      '      <div class="card-body">'+
                                      '          <div class="mx-auto d-block" align="center">'+
                                      '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="editprojattachment_'+key+'"><img src="'+STEP_root+'images/csv.png" height="50%" width="50%"></a>'+
                                      '          </div>'+
                                      '          <hr>'+
                                      '          <div class="card-text ">'+
                                      '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                      '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="editdeleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                                      '          </div>'+
                                      '      </div>'+
                                      '  </div>'+
                                    '</div>');
                              }else if(jQuery.inArray( value['extension'], excelexts ) > -1){

                                  $("#defectattachmentsedit").append('<div class="col-md-2" id="editattachment_'+key+'">'+
                                      '  <div class="card">'+
                                      '      <div class="card-body">'+
                                      '          <div class="mx-auto d-block" align="center">'+
                                      '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="editprojattachment_'+key+'"><img src="'+STEP_root+'images/excel.png" height="50%" width="50%"></a>'+
                                      '          </div>'+
                                      '          <hr>'+
                                      '          <div class="card-text ">'+
                                      '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                      '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="editdeleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                                      '          </div>'+
                                      '      </div>'+
                                      '  </div>'+
                                    '</div>');
                              }else if(jQuery.inArray( value['extension'], imgexts ) > -1){

                                  $("#defectattachmentsedit").append('<div class="col-md-2" id="editattachment_'+key+'">'+
                                      '  <div class="card">'+
                                      '      <div class="card-body">'+
                                      '          <div class="mx-auto d-block" align="center">'+
                                      '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="editprojattachment_'+key+'"><img src="'+value['filename']+'" height="50%" width="50%"></a>'+
                                      '          </div>'+
                                      '          <hr>'+
                                      '          <div class="card-text ">'+
                                      '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                      '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="editdeleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                                      '          </div>'+
                                      '      </div>'+
                                      '  </div>'+
                                    '</div>');
                              }else {

                                  $("#defectattachmentsedit").append('<div class="col-md-2" id="editattachment_'+key+'">'+
                                      '  <div class="card">'+
                                      '      <div class="card-body">'+
                                      '          <div class="mx-auto d-block" align="center">'+
                                      '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="editprojattachment_'+key+'"><i class="fa fa-file-text pr-1"></i></a>'+
                                      '          </div>'+
                                      '          <hr>'+
                                      '          <div class="card-text ">'+
                                      '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                      '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="editdeleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
                                      '          </div>'+
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



  $( document ).on( "click", "[id^=editprojattachment_]", function(e) {
        // prevent default action
        e.preventDefault();

        var fileview = $(this).attr("fileview");
        window.open(fileview,"window2","");
    });
    
    $( document ).on( "click", "[id^=editdeleteattachment_]", function(e) {
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



    $( document ).on( "change", "[id=shortdesc],[id=longdesc],[id=testdata],[id=steps],[id=expectedresult],[id=actualresult]", function(e) {
        // prevent default action
        e.preventDefault();
        var nProjectId = this.value;
        var nId = $(this).attr("id");
        $("#"+nId+"_change").val(1);
    });
    $( document ).on( "change", "[id=projectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nProjectId = this.value;
        var nExistval = $(this).attr("data-exist");
        enableModule();
        getRelease(nProjectId,0);
        getAssignee(nProjectId);
    });
    
    $( document ).on( "change", "[id=upload_projectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nPorjectId = this.value;
        getRelease(nPorjectId,2);
    });
    
    $( document ).on( "change", "[id=tblfiltertestcaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        releaseTable.ajax.reload( null, false );
    });
    $( document ).on( "change", "[id=releaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nReleaseId = this.value;
        enableModule();
        var nPorjectId = $("#projectId").val();
        getTestcase(nPorjectId,nReleaseId,0);
    });

    function disableModule(){

        $("#module").prop("readonly",true);
        $("#submodule").prop("readonly",true);

        $("#module").css("cursor","no-drop");
        $("#submodule").css("cursor","no-drop");
    }
    function enableModule(){

        $("#module").val("");
        $("#submodule").val("");

        $("#module").prop("readonly",false);
        $("#submodule").prop("readonly",false);

        $("#module").css("cursor","default");
        $("#submodule").css("cursor","default");
    }
    $( document ).on( "change", "[id=testcaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        var ntestcaseId = this.value;
        getTestcaseinfo(ntestcaseId);
    });
    $( document ).on( "change", "[id=tblfilterprojectId],[id=tblfilterreleaseId],[id=tblfilterdefectId],[id=tblfilterstatusId]", function(e) {
        // prevent default action
        e.preventDefault();

        releaseTable.ajax.reload( null, false );
    });

    function getTestcaseinfo(ntestcaseId){
         $.ajax({
            type: "POST",
            url: STEP_root+'api/getSingleedit.php',
            dataType:'json',
            data:  {"id":ntestcaseId,"formtype":"Testcase"}, // serializes the form's elements.
            success: function(data)
            {
            if(data !=null){
                if(data['id'] !=null){
                    $("#module").val(data['module']);
                    $("#submodule").val(data['submodule']);
                    disableModule();
              }
            }

            }
        });
  
    }
    function getRelease(nProjectId,nFlag){

        return new Promise(function(resolve, reject){
          if(nFlag == 1){
              $("#tblfilterreleaseId").html('');
                $("#tblfilterreleaseId").selectpicker('refresh');
          }else if(nFlag == 2){
              $("#upload_releaseId").html('');
                $("#upload_releaseId").selectpicker('refresh');

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
                  if(nFlag == 1){
                  $("#tblfilterreleaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                  }else if(nFlag == 2){
                  $("#upload_releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                  }else{

                  $("#releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                  }
                });
              }
              if(nFlag == 1){
                $("#tblfilterreleaseId").selectpicker('refresh');
              }else if(nFlag == 2){
                $("#upload_releaseId").selectpicker('refresh');
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

    function getDefects(nProjectId,nReleaseId){

        return new Promise(function(resolve, reject){

          $("#tblfilterdefectId").html('');
          $("#tblfilterdefectId").selectpicker('refresh');
          $.ajax({
              type: "POST",
              url: STEP_root+'api/getDropdown.php',
              dataType:'json',
              data:  {'formtype':'Defect',"projectId":nProjectId,"releaseId":nReleaseId}, // serializes the form's elements.
              success: function(data)
              {
                if(data != null && data['data']!=null){
                  $.each( data['data'], function( key, value ) {
                    $("#tblfilterdefectId").append("<option value='"+value['id']+"' >"+value['defectId']+"</option>");
                  });
                }

                $("#tblfilterdefectId").selectpicker('refresh');
                resolve(true);
              },error:function (jqXHR, textStatus, errorThrown) {
                resolve(true);
              }
          });
  
    });
}


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


function getTestcase(nProjectId,nReleaseId,nFlag){

  return new Promise(function(resolve, reject){

      $("#testcaseId").html('');
      $("#testcaseId").selectpicker('refresh');
                   
      $.ajax({
        type: "POST",
        url: STEP_root+'api/getDropdown.php',
        dataType:'json',
        data:  {'formtype':'Testcase',"projectId":nProjectId,"releaseId":nReleaseId}, // serializes the form's elements.
        success: function(data)
        {
          if(data != null && data['data']!=null){
            $.each( data['data'], function( key, value ) {
              
                $("#testcaseId").append("<option value='"+value['id']+"' >"+value['testcaseId']+"</option>");
              
            });
          }
          
          $("#testcaseId").selectpicker('refresh');
            
          resolve(true);
      },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
      }
        
    });
  
  }); 
}

/** saves the defect data into database */
$('form[id="defectform"]').validate({

                    
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
    //"fileToUpload[]": 'required'
    "fileToUpload[]": {
                required: function() {
                    return ($("#dId").val() === "" || $("#dId").val() === "0");
                }
            }
  },
  messages: {
    "projectId": 'Please select project',
    "releaseId": 'Please select release',
    "fileToUpload[]": {
                required: "Please upload at least one file."
            }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]);
     form_data.append('projectId_change',($("#projectId").val() != null && $("#projectId").val() != $("#projectId").attr("data-exist") ? "1":"0"));
     form_data.append('releaseId_change',($("#releaseId").val() != null && $("#releaseId").val() != $("#releaseId").attr("data-exist") ? "1":"0"));
     form_data.append('testcaseId_change',($("#testcaseId").val() != null && $("#testcaseId").val() != $("#testcaseId").attr("data-exist") ? "1":"0"));
     form_data.append('assignto_change',($("#assignto").val() != null && $("#assignto").val() != $("#assignto").attr("data-exist") ? "1":"0"));
     form_data.append('module_change',($("#module").val() != null && $("#module").val() != $("#module").attr("data-exist") ? "1":"0"));
     form_data.append('submodule_change',($("#submodule").val() != null && $("#submodule").val() != $("#submodule").attr("data-exist") ? "1":"0"));
     form_data.append('severity_change',($("#severity").val() != null && $("#severity").val() != $("#severity").attr("data-exist") ? "1":"0"));
     form_data.append('priority_change',($("#priority").val() != null && $("#priority").val() != $("#priority").attr("data-exist") ? "1":"0"));
     form_data.append('defecttypeId_change',($("#defecttypeId").val() != null && $("#defecttypeId").val() != $("#defecttypeId").attr("data-exist") ? "1":"0"));
     form_data.append('defectstatusId_change',($("#defectstatusId").val() != null && $("#defectstatusId").val() != $("#defectstatusId").attr("data-exist") ? "1":"0"));
     
     $.ajax({
        url: STEP_root+"api/saveDefect.php", //The url where the server req would we made.
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
         $('#defectTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#defectTbl tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });  
   
   // Handle click on checkbox to set state of "Select all" control
   $('#defectTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
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
   

/** bulk action to change the status of defect */
  $( document ).on( "click", ".bulkAction", function(e) {
      // prevent default action
      e.preventDefault();

      var nType = $(this).attr("data-type");
      if(bulkcheckboxarr.length > 0){
            $.ajax({
            url: STEP_root+"api/bulkAction.php", //The url where the server req would we made.
            async: false,
            type: "POST", //The type which you want to use: GET/POST
            data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=Defect", //The variables which are going.
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


$('#defectmodal').on('hidden.bs.modal', function () {
  $('#defectform').trigger("reset");
  $("#projectId").val('default');
  $("#projectId").selectpicker("refresh");
  $("#assignto").val('default');
  $("#assignto").selectpicker("refresh");
  $("#releaseId").html("");
  $("#releaseId").val('default');
  $("#releaseId").selectpicker("refresh");
  $("#testcaseId").val('default');
  $("#testcaseId").selectpicker("refresh");
  $("#defectstatusId").val('default');
  $("#defectstatusId").selectpicker("refresh");
  $("#defecttypeId").val('default');
  $("#defecttypeId").selectpicker("refresh");
  $("#releaseId").html("");
});

//upload defect from excel sheet
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
    }
  },
  messages: {
    "projectId": 'Please select project',
    "releaseId": 'Please select release',
    "file":{
        required:"Please select the file",           
    }
  },
  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     $.ajax({
        url: STEP_root+"api/uploadDefect.php", //The url where the server req would we made.
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
                          if(nvalue !=""){
                            errmsg += nkey+" at line no. "+nvalue+"<br/>";
                          }
                     });
                     if(errmsg != ""){
                          $("#errmsg").html('<div class="alert alert-warning alert-dismissible fade show" role="alert" style="height:100px; overflow-y:scroll;" >Last upload error : <br/>'+errmsg+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '  <span aria-hidden="true">&times;</span>'+
                        '</button>'+
                     ' </div>');
                      }
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
                      if(nvalue !=""){
                          errmsg += nkey+" at line no. "+nvalue+"<br/>";
                        }
                     });
                     if(errmsg !=""){
                      $("#errmsg").html('<div class="alert alert-warning alert-dismissible fade show" role="alert" style="height:100px; overflow-y:scroll;" >Last upload error : <br/>'+errmsg+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '  <span aria-hidden="true">&times;</span>'+
                    '</button>'+
                 ' </div>');
                    }
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


$('#uploadmodal').on('hidden.bs.modal', function () {
  $('#uploadform').trigger("reset");
  $("#upload_projectId").val('default');
  $("#upload_releaseId").html("");
  $("#upload_projectId").selectpicker("refresh");
  $("#upload_releaseId").val('default');
  $("#upload_releaseId").selectpicker("refresh");

});

$( document ).on( "change", "[id=tblfilterprojectId]", function(e) {
      // prevent default action
      e.preventDefault();
      var nProjectId = this.value;
      
      filterRelease().then(filterDefect).then(function(){
      });
});
     
$( document ).on( "change", "[id=tblfilterreleaseId]", function(e) {
  // prevent default action
  e.preventDefault();
  filterDefect().then(function(){
  });
});


/**
 * filterRelease
 *
 * @description
 * Filter release by project id.
 *
 * @param {none}
 * @returns {Promise}
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
 * filterDefect
 *
 * @description
 * Filter defect by project id and release id.
 *
 * @param {none}
 * @returns {Promise}
 */
var filterDefect = function(){
    return new Promise(function(resolve, reject){
      var nProjectId = ($("#tblfilterprojectId").val() != null ? $("#tblfilterprojectId").val() : '');
      var nReleaseId = ($("#tblfilterreleaseId").val() != null ? $("#tblfilterreleaseId").val() : '');
        
      $("#tblfilterdefectId").html('');
      $("#tblfilterdefectId").selectpicker('refresh');
      $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'allFilterDefect',"projectId":nProjectId,"releaseId":nReleaseId}, // serializes the form's elements.
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#tblfilterdefectId").append("<option value='"+value['id']+"' >"+value['defectId']+"</option>");
              });
            }

            $("#tblfilterdefectId").selectpicker('refresh');
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

          $("#tblfilterreleaseId").html(filterReleaseoption);
          $("#tblfilterreleaseId").val('default');
          $("#tblfilterreleaseId").selectpicker('refresh');

          $("#tblfilterdefectId").html(filterDefectIDoption);
          $("#tblfilterdefectId").val('default');
          $("#tblfilterdefectId").selectpicker('refresh');

          $("#tblfilterstatusId").html(filterStatusoption);
          $("#tblfilterstatusId").val('default');
          $("#tblfilterstatusId").selectpicker('refresh');


          reloadTbl();
});
})(jQuery);
