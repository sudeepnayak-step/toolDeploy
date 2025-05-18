var bulkcheckboxarr = new Array();
var tc_bulkcheckboxarr = new Array();
var defect_bulkcheckboxarr = new Array();
var temp_testexecutionId = 0;
var filter_projectId = 0;
var nRTMid = 0;
var filter_releaseId = 0;
var imgexts = new Array('gif', 'png', 'jpg','jpeg');
var docexts = new Array('docx','doc');

var pdfexts = new Array('pdf');
var csvexts = new Array('csv');
var excelexts = new Array('xls','xlsx');
(function ($) {
  var temp_rtmId = window.location.search.substr(1);
  var arr = temp_rtmId.split("=");
  var param1 = arr[0];
  var paramval1 = arr[1];
  nRTMid = arr[1];

$.fn.dataTable.ext.errMode = 'none';


/**
 * This function is used to load the details of the RTM 
 */
  function loadDetails(){
     $.ajax({
         type: "POST",
         url: STEP_root+'api/getSingleedit.php',
         dataType:'json',
         data:  {"id":nRTMid,"formtype":"RTM"}, // serializes the form's elements.
         success: function(data)
         {
          
          $("#prvdefect").addClass("hidden");
          $("#nextdefect").addClass("hidden");
          if(data !=null){
              if(data['id'] !=null){
                  if(data['prvId'] != null && data['prvId'] !="0" && data['prvId'] !=""){
                    $("#prvdefect").attr("href",STEP_root+'master/rtmtestcase.php?id='+data['prvId']);
                    $("#prvdefect").removeClass("hidden");
                  }
                  if(data['nextId'] != null && data['nextId'] !="0" && data['nextId'] !=""){
                    $("#nextdefect").attr("href",STEP_root+'master/rtmtestcase.php?id='+data['nextId']);
                    $("#nextdefect").removeClass("hidden");
                  }
                  var nRTMtxt = "Requirement ID : <span class=' big text-step'><strong>"+data['reqnum']+"</strong></span>";

                   if((data['editPermission'] != null && data['editPermission'] >0) && data['editable'] <=0){
                    nRTMtxt += "<a href='JavaScript:void(0)' id='editRTM"+paramval1+"' data-id='"+paramval1+"' class='text-step pull-right' data-toggle='modal' data-target='#rtmmodal' ><b>Edit Requirement</b> </a>";
                   }
                  $("#rtmnumtxt").html(nRTMtxt);
                  $("#projecttxt").html("Project : <strong>"+data['projectname']+"</strong>");
                  $("#releasetxt").html("Release : <strong>"+data['releaseNum']+"</strong>");
                  var nRTMstatus = data['rtmstatus'];
                  switch(nRTMstatus){
                    case "Pending" : 
                          nRTMstatus = "<span class='badge badge-warning'>Pending</span>";
                          break;
                    case "In Progress" : 
                          nRTMstatus = "<span class='badge badge-primary'>In Progress</span>";
                          break;
                    case "Pass" : 
                          nRTMstatus = "<span class='badge badge-success'>Pass</span>";
                          break;
                    case "Fail" : 
                          nRTMstatus = "<span class='badge badge-danger'>Fail</span>";
                          break;
                  }
                  $("#statustxt").html("Status : <strong>"+nRTMstatus+"</strong>");
                  $("#desctxt").html("Description : "+data['rtmdesc']+"");
                  $("#summarytxt").html("Summary : "+data['summary']+"");
                  $("#commenttxt").html("Comment : "+data['rtmcomment']+"");
	          $("#reviewertxt").html("Reviewer : <strong>"+data['reviewer']+"</strong>");
	         $("#prioritytxt").html("Priority : <strong>"+data['priority']+"</strong>");
		$("#moduletxt").html("Module : <strong>"+data['module']+"</strong>");
                    $("#submoduletxt").html("Sub Module : <strong>"+data['submodule']+"</strong>");
		 if(data['assignee'] != null){
	              var dAssignee = "";var dCount = data['assignee'].length;
	                $.each( data['assignee'], function( key, value ) {
	                console.log(key,value);
	                if((dCount-1) == key){

	                  dAssignee += ""+value+"";
	                }else{
	                  dAssignee += "<strike>"+value+"</strike>&nbsp;&nbsp;";

	                }
	              });

	              $("#assignmenttxt").html("Assignee : <br/>"+dAssignee+"");
	            }
		    $("#rtmattachments").html("");
	            $("#rtmattachmentsheader").addClass("hidden");
	            if(data['attachments'] != null){
	              $.each( data['attachments'], function( key, value ) {
	                console.log(key,value);
	                $("#rtmattachmentsheader").removeClass("hidden");
	                if(jQuery.inArray( value['extension'], docexts ) > -1){

	                    $("#rtmattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
	                        '  <div class="card">'+
	                        '      <div class="card-body">'+
	                        '          <div class="mx-auto d-block" align="center">'+
	                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><img src="'+STEP_root+'images/doc.png" height="50%" width="50%"></a>'+
	                        '          </div>'+
	                        '          <hr>'+
	                        ((data['editPermission'] != null && data['editPermission'] >0) ?
	                          '          <div class="card-text ">'+
	                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
	                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'" data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
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

	                    $("#rtmattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
	                        '  <div class="card">'+
	                        '      <div class="card-body">'+
	                        '          <div class="mx-auto d-block" align="center">'+
	                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><img src="'+STEP_root+'images/csv.png" height="50%" width="50%"></a>'+
	                        '          </div>'+
	                        '          <hr>'+
	                        ((data['editPermission'] != null && data['editPermission'] >0) ?
	                          '          <div class="card-text ">'+
	                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
	                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
	                        '          </div>'
	                        :
	                          '          <div class="card-text text-center ">'+
	                        '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
	                        '          </div>')+
	                        '      </div>'+
	                        '  </div>'+
	                      '</div>');
	                }else if(jQuery.inArray( value['extension'], pdfexts ) > -1){

	                    $("#rtmattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
	                        '  <div class="card">'+
	                        '      <div class="card-body">'+
	                        '          <div class="mx-auto d-block" align="center">'+
	                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><img src="'+STEP_root+'images/pdf.png" height="50%" width="50%"></a>'+
	                        '          </div>'+
	                        '          <hr>'+

	                        ((data['editPermission'] != null && data['editPermission'] >0) ?
	                          '          <div class="card-text ">'+
	                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
	                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
	                        '          </div>'
	                        :
	                          '          <div class="card-text text-center">'+
	                        '              <a class="text-center" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
	                        '          </div>')+
	                        '      </div>'+
	                        '  </div>'+
	                      '</div>');
	                }else if(jQuery.inArray( value['extension'], excelexts ) > -1){

	                    $("#rtmattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
	                        '  <div class="card">'+
	                        '      <div class="card-body">'+
	                        '          <div class="mx-auto d-block" align="center">'+
	                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><img src="'+STEP_root+'images/excel.png" height="50%" width="50%"></a>'+
	                        '          </div>'+
	                        '          <hr>'+

	                        ((data['editPermission'] != null && data['editPermission'] >0) ?
	                          '          <div class="card-text ">'+
	                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
	                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
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

	                    $("#rtmattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
	                        '  <div class="card">'+
	                        '      <div class="card-body">'+
	                        '          <div class="mx-auto d-block" align="center">'+
	                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><img src="'+value['filename']+'" height="50%" width="50%"></a>'+
	                        '          </div>'+
	                        '          <hr>'+

	                        ((data['editPermission'] != null && data['editPermission'] >0) ?
	                          '          <div class="card-text ">'+
	                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
	                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
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

	                    $("#rtmattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
	                        '  <div class="card">'+
	                        '      <div class="card-body">'+
	                        '          <div class="mx-auto d-block" align="center">'+
	                        '              <a href="javascript:void(0) " fileview="'+value['filename']+'" id="projattachment_'+key+'"><i class="fa fa-file-text pr-1"></i></a>'+
	                        '          </div>'+
	                        '          <hr>'+
	                        ((data['editPermission'] != null && data['editPermission'] >0) ?
	                          '          <div class="card-text ">'+
	                        '              <a class="text-left" href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
	                        '               <a class="pull-right text-danger" href="javascript:void()" data-file="'+value['filepath']+'" id="deleteattachment_'+key+'"  data-id="attachment_'+key+'"><i class="fa fa-remove pr-1" ></i></a>'+
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
                  filter_projectId = data['projectId'];
                  filter_releaseId = data['releaseId'];
                  getFilterTC(filter_projectId,filter_releaseId,"");
                  getFilterDefect(filter_projectId,filter_releaseId,"");
                
                rtmtcTbl.ajax.reload( null, false );
                $('#select_all').attr("checked",false);
                bulkcheckboxarr.length = 0;
                
                testcaseTbl.ajax.reload( null, false );
                $('#tc_select_all').attr("checked",false);
                tc_bulkcheckboxarr.length = 0;
              }
          }

         },error:function (jqXHR, textStatus, errorThrown) {
                formatErrorMessage(jqXHR, errorThrown);
          }
     });
 
}

/**
 * Function to load comments for a defect.
 * It sends a POST request to getDefectcomments.php to get the comments.
 * On success, it will loop through the comments and append a div containing the comment details to #defectcommentdiv
 * It also sets up an event listener for the reply form to submit the comment via AJAX.
 */
function loadComment(){
$.ajax({
  type: "POST",
  url: STEP_root+'api/getRTMcomments.php',
  dataType:'json',
  data:  {"rtmId":paramval1}, // serializes the form's elements.
  success: function(data)
  {
  $("#rtmcommentdiv").html('');
  if(data != null && data['data']!=null){
    $.each( data['data'], function( key, value ) {
        var replydiv = "";
        if(value['reply'] != null ){
          $.each( value['reply'], function( rkey, rvalue ) {

            var cDatetime = rvalue['commenttime'];
            var cDate = moment(cDatetime, 'YYYY-MM-DD HH:mm:ss').format('DD MMM,YYYY');
            var cTime = moment(cDatetime, 'YYYY-MM-DD HH:mm:ss').format('h:m a');
            var cCurrentdate = moment().format('DD MMM,YYYY');
            if(cDate == cCurrentdate) cDate = "Today, ";
              replydiv += '<div class="comment-reply col-md-11 offset-md-1 col-sm-10 offset-sm-2">'+
            '<div class="row">'+
            '    <div class="comment-avatar col-md-1 col-sm-2 text-center pr-1">'+
            '        <a href=""><img class="mx-auto rounded-circle img-fluid" src="'+STEP_root+'images/admin.jpg" alt="avatar"></a>'+
            '    </div>'+
            '    <div class="comment-content col-md-11 col-sm-10 col-12">'+
            '        <h6 class="small comment-meta"><a href="#">'+rvalue['empname']+'</a> '+cDate+' '+cTime+'</h6>'+
            '        <div class="comment-body">'+
            '            <p>'+rvalue['comment']+'<br>'+
            '            </p>'+
            '        </div>'+
            '    </div>'+
            '</div>'+
        '</div>';
          });
        }
        var replymodel = '<div class="card1 hidden" id="replydiv'+value['id']+'">'+
                '    <form id="replyform'+value['id']+'" class="form-horizontal"  enctype="multipart/form-data" >'+
                '    <div class="card-body card-block">'+
                '            <div class="form-group">'+
                '                            <label for="newcomment'+value['id']+'" class=" form-control-label">Comment : </label>'+
                '                            <textarea  class="form-control " required name="newcomment'+value['id']+'" id="newcomment'+value['id']+'" row="4"></textarea>'+
                '                        </div>'+
                '    </div>'+
                '    <div class="card-footer1 pull-right">'+
                '        <button type="submit" class="btn btn-step btn-sm">'+
                '            <i class="fa fa-dot-circle-o"></i> Submit'+
                '        </button>'+
                '        <button type="reset" class="btn btn-danger btn-sm">'+
                '            <i class="fa fa-ban"></i> Reset'+
                '        </button>'+
                '        <button type="button" class="btn btn-info btn-sm" id="cancelform'+value['id']+'" data-id="'+value['id']+'" >'+
                '            <i class="fa fa-ban"></i> Cancel'+
                '        </button>'+
                '    </div>'+
                '    </form>'+
                '</div>';
        var cDatetime = value['commenttime'];
        var cDate = moment(cDatetime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY');
        var cTime = moment(cDatetime, 'YYYY-MM-DD HH:mm:ss').format('h:m a');
        var cCurrentdate = moment().format('MM/DD/YYYY');
        if(cDate == cCurrentdate) cDate = "Today, ";
        var rtmcomments = '<div class="comment mb-2  row">'+
        '<div class="comment-avatar col-md-1 col-sm-2 text-center pr-1">'+
        '    <a href=""><img class="mx-auto rounded-circle img-fluid" src="'+STEP_root+'images/admin.jpg" alt="avatar"></a>'+
        '</div>'+
        '<div class="comment-content col-md-11 col-sm-10">'+
        '    <h4 class="small comment-meta"><a href="#">'+value['empname']+'</a> '+cDate+' '+cTime+'</h4>'+
        '    <div class="comment-body">'+
        '        <p>'+value['comment']+'<br>'+
        '            <a href="JavaScript:void(0)" id="addreply'+value['id']+'" data-id="'+value['id']+'" class="text-step text-right small"  ><i class="ion-reply"></i> Reply</a>'+
        '        </p>'+replymodel+
        '    </div>'+
        '</div>'+replydiv+
        '</div>';

        $("#rtmcommentdiv").append(rtmcomments);
        $("form#replyform"+value['id']).submit(function(event) {
            event.preventDefault();
            var formData = new FormData(this);
            formData.append("rtmId",paramval1);
            formData.append("commentId",value['id']);
            $.ajax({
              url: STEP_root+"api/saveRTMcomment.php", //The url where the server req would we made.
              async: false,
              type: "POST", //The type which you want to use: GET/POST
              data: formData , //The variables which are going.
              dataType: "text", //Return data type (what we expect).
              cache: false,
              contentType: false,
              processData: false,
              //This is the function which will be called if ajax call is successful.
              success: function(data) {
                  $("form#replyform"+value['id'])[0].reset();
                  $("#newcomment"+value['id']).val('');
                  loadComment();
              }
          });
        });
    });

  }
}
});  
}

function loadHistory(){

	$.ajax({
  type: "POST",
  url: STEP_root+'api/getRTMlogs.php',
  dataType:'json',
  data:  {"rtmId":paramval1}, // serializes the form's elements.
  success: function(data)
  {
	  $("#rtmhistorydiv").html('');
	  if(data != null && data['data']!=null){
	    $.each( data['data'], function( key, value ) {
		var cDatetime = value['logtime'];
	        var cDate = moment(cDatetime, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY');
	        var cTime = moment(cDatetime, 'YYYY-MM-DD HH:mm:ss').format('h:m a');
	        var cCurrentdate = moment().format('MM/DD/YYYY');
	        if(cDate == cCurrentdate) cDate = "Today, ";
	        var rtmlogs = '<div class="comment mb-2  row">'+
	        '<div class="comment-avatar col-md-1 col-sm-2 text-center pr-1">'+
	        '    <a href=""><img class="mx-auto rounded-circle img-fluid" width="60%" src="'+STEP_root+'images/admin.jpg" alt="avatar"></a>'+
	        '</div>'+
	        '<div class="comment-content col-md-11 col-sm-10">'+
	        '    <h4 class="small comment-meta"><a href="#">'+value['empname']+'</a> '+cDate+' '+cTime+'</h4>'+
	        '    <div class="comment-body">'+
	        '        <p>Change in '+value['description']+
	        '        </p>'+
	        '    </div>'+
	        '</div>'+
	        '</div>';

	        $("#rtmhistorydiv").append(rtmlogs);
	   })
	  }
  }
  });
}

loadDetails();
loadComment();
loadHistory();
$("#filter_module").html("");
$("#filter_module").selectpicker('refresh');

$("#filter_testcaseId").html("");
$("#filter_testcaseId").selectpicker('refresh');

$("#filter_defectmodule").html("");
$("#filter_defectmodule").selectpicker('refresh');

$("#filter_defectId").html("");
$("#filter_defectId").selectpicker('refresh');

/** initialize testcase table */
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
            return "projectId="+filter_projectId+"&&releaseId="+filter_releaseId+"&&module="+nModule+"&&testcaseId="+nTestcase+"&&rtmId="+nRTMid;
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
        {"visible": false,"orderable": false,"targets":[7,10,11,12,13,14,15],"class":"text-left"} , 
        {"orderable": true,"targets":[1,2,3,4,5,6,7,8,9,10,11,12,13],"class":"text-left"}  
      ],
      "lengthChange": false,
      "paging": true,
      "info": true,
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      "stateSave": true
  });

  $("#testcaseTbl").wrap("<div class='scrolledTable'></div>");

  /** initialize defect table */
  var defectTbl =  $('#defectTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        console.log( 'An error has been reported by DataTables: ', message );
        formatErrorMessage("","");

    } ).DataTable({
        responsive: true,
        "ajax": {
        "type":"POST",
        "url": STEP_root+"api/getallDefects.php",
        "data": function (d) {
            var nModule = $("#filter_defectmodule").val();
            var nDefect = $("#filter_defectId").val();
            return "projectId="+filter_projectId+"&&releaseId="+filter_releaseId+"&&module="+nModule+"&&defectId="+nDefect+"&&rtmId="+nRTMid;
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
                          '<input type="checkbox" class="custom-control-input" id="defect_checkbox'+data+'">'+
                          '<label class="custom-control-label" for="defect_checkbox'+data+'">&nbsp;</label>'+
                      '</div>';
              }
          },
        {"visible": false,"orderable": false,"targets":[1,2,12,13,14,15],"class":"text-left"} , 
        {"orderable": true,"targets":[2,3,4,5,6,7,8,9,10,11,12,13],"class":"text-left"}  
      ],
      "lengthChange": false,
      "paging": true,
      "info": true,
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
      "stateSave": true
  });


  $("#defectTbl").wrap("<div class='scrolledTable'></div>");
  
$( document ).on( "change", "[id=filter_module]", function(e) {
        // prevent default action
        e.preventDefault();
        var nModule = this.value;
        // var nProjectId = $("#filter_projectId").val();
        // var nReleaseId = $("#filter_releaseId").val();
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

$( document ).on( "change", "[id=filter_defectmodule]", function(e) {
        // prevent default action
        e.preventDefault();
        var nModule = this.value;
        getFilterDefect(filter_projectId,filter_releaseId,nModule);

        defectTbl.ajax.reload( null, false );
        $('#defect_select_all').attr("checked",false);
        defect_bulkcheckboxarr.length = 0;
        
});

$( document ).on( "change", "[id=filter_defectId]", function(e) {
        // prevent default action
        e.preventDefault();
        var nModule = this.value;
        defectTbl.ajax.reload( null, false );
        $('#defect_select_all').attr("checked",false);
        defect_bulkcheckboxarr.length = 0;
        
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
      data:  {'formtype':'FilterTestcase',"projectId":filter_projectId,"releaseId":filter_releaseId,"module":nModule,"rtmId":nRTMid}, // serializes the form's elements.
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
        resolve(true);
      }
  });
  
});

  
}

function getFilterDefect(nProjectId,nReleaseId,nModule){

    return new Promise(function(resolve, reject){
      var modarr = new Array();
      $("#filter_defectId").html('');
      $("#filter_defectId").selectpicker('refresh');
      if(nModule == ""){
        $("#filter_defectmodule").html('');
        $("#filter_defectmodule").selectpicker('refresh');
      }
      $.ajax({
        type: "POST",
        url: STEP_root+'api/getDropdown.php',
        dataType:'json',
        data:  {'formtype':'FilterDefect',"projectId":filter_projectId,"releaseId":filter_releaseId,"module":nModule}, // serializes the form's elements.
        success: function(data)
        {
          if(data != null && data['data']!=null){
            $.each( data['data'], function( key, value ) {
              $("#filter_defectId").append("<option value='"+value['defectid']+"' >"+value['defectname']+"</option>");
              if(nModule == ""){
                if(jQuery.inArray( value['modulename'], modarr ) < 0){
                  modarr.push(value['modulename']);
                  $("#filter_defectmodule").append("<option value='"+value['modulename']+"' >"+value['modulename']+"</option>");
                }
              }
            });
          }

          $("#filter_defectId").selectpicker('refresh');
          if(nModule == ""){
            $("#filter_defectmodule").selectpicker('refresh');
          }
          resolve(true);
        },error:function (jqXHR, textStatus, errorThrown) {
          resolve(true);
        }
    });
  
});

  
}


/** initiliaze RTM table */
  var rtmtcTbl =  $('#rtmtcTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        console.log( 'An error has been reported by DataTables: ', message );
        formatErrorMessage("","");

    } ).DataTable({
        responsive: true,
        "ajax": {
          "type":"POST",
          "url": STEP_root+"api/getallRTMTC.php",
          "data": function (d) {
              var nModule = $("#filter_module").val();
              var nTestcase = $("#filter_testcaseId").val();
              return "projectId="+filter_projectId+"&&releaseId="+filter_releaseId+"&&rtmId="+nRTMid;
  
          }
        },
        "columnDefs": [
        	  {
                'sortable': false,
                'visible': false,
                'targets': [0],
                 "class": "text-left"
            },
            {
                "orderable": true,
                'targets': [3],
                 "class": "text-left",
                "render": function ( data, type, row ) {
                return '<a href="JavaScript:void(0)" id="editTestcase'+row[0]+'" data-id="'+row[0]+'"  data-testcaseId="'+row[4]+'" class="text-step" data-toggle="modal" data-target="#testcasedetailsmodal" ><b>'+
                          data+
                         '</b> </a>';
                }
            },
            {
              "orderable": true,"targets":[5,6],"class":"text-left",
              "render": $.fn.dataTable.render.ellipsis()
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
            {"targets":[4,7],"class":"text-left","visible":false},  
            {"orderable": true,"targets":[1,2,3,4,5,8],"class":"text-left"}  
		      ],
          "paging": false,
          "info": false,
          "stateSave": true,
	});

  $("#rtmtcTbl").wrap("<div class='scrolledTable'></div>");

  /** initialize RTM defect table */
 var rtmdefectTbl =  $('#rtmdefectTbl')
    .on( 'error.dt', function ( e, settings, techNote, message ) {
        console.log( 'An error has been reported by DataTables: ', message );
        formatErrorMessage("","");

    } ).DataTable({
      responsive: true,
      "ajax": {
        "type":"POST",
        "url": STEP_root+"api/getallRTMDefect.php",
        "data": function (d) {
            var nModule = $("#filter_defectmodule").val();
            var nTestcase = $("#filter_defectId").val();
            return "projectId="+filter_projectId+"&&releaseId="+filter_releaseId+"&&rtmId="+nRTMid;
 
        }
      },
        "columnDefs": [
          {
                'sortable': false,
                'visible': false,
                'targets': [0],
                 "class": "text-left"
            },
            {
                "orderable": true,
                'targets': [3],
                 "class": "text-left",
                "render": function ( data, type, row ) {
                  return '<a href="JavaScript:void(0)" id="editDefect'+row[0]+'" data-id="'+row[0]+'"  data-defectId="'+row[4]+'" class="text-step" data-toggle="modal" data-target="#defectdetailsmodal" ><b>'+
                          data+
                         '</b> </a>';
                }
            },
            {
              "orderable": false,"targets":[6],"class":"text-left",
              "render": $.fn.dataTable.render.ellipsis()
            },
            {
              "orderable": false,
              "targets": -1,
              "class":"text-left",
              render: function ( data, type, row ) {
              return '<a href="JavaScript:void(0)" id="deleteDefect'+data+'" data-id="'+data+'" >'+
                      '  <span class="fa fa-trash text-danger "></span>'+
                    ' </a>';
              }           
          },
          {"targets":[4],"class":"text-left","visible":false},   
          {"orderable": true,"targets":[1,2,3,4,5,7,8,9],"class":"text-left"} 
        ],
        
        "paging": false,
        "info": false,
        "stateSave": true,
  });


  $("#rtmdefectTbl").wrap("<div class='scrolledTable'></div>");

  /** delete testcase from RTM */
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
                      data:  {"id":currentId,"formtype":"RTMTestcase","rtmId":nRTMid}, // serializes the form's elements.
                        success: function(data)
                        {
                        if(data != null){
                          if(data['status'] != null){
                            if(data['status'] == "Success"){
                              reloadrtmtcTbl();
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


function closeTCModelform(form){
   var mymodal = $('#testcasemodal');
    // mymodal.find('.modal-body').text(data);
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadrtmtcTbl();
}
function reloadrtmtcTbl(){

    $("#filter_testcaseId").val('default');
    $("#filter_testcaseId").selectpicker("refresh");
    $("#filter_module").val('default');
    $("#filter_module").selectpicker("refresh");
    
    rtmtcTbl.ajax.reload( null, false );
    $('#select_all').attr("checked",false);
    bulkcheckboxarr.length = 0;
    
    testcaseTbl.ajax.reload( null, false );
    $('#tc_select_all').attr("checked",false);
    tc_bulkcheckboxarr.length = 0;
                   
}


function closedefectModelform(form){
   var mymodal = $('#defectmodal');
    // mymodal.find('.modal-body').text(data);
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadrtmdefectTbl();
}
function reloadrtmdefectTbl(){

    $("#filter_defectId").val('');
    $("#filter_defectId").selectpicker("refresh");
    $("#filter_defectmodule").val('');
    $("#filter_defectmodule").selectpicker("refresh");
        
    rtmdefectTbl.ajax.reload( null, false );
    
    defectTbl.ajax.reload( null, false );
    $('#defect_select_all').attr("checked",false);
    defect_bulkcheckboxarr.length = 0;

}

/** delete defect from RTM */
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
                  data:  {"id":currentId,"formtype":"RTMTestcase","rtmId":nRTMid}, // serializes the form's elements.
                      success: function(data)
                      {
                      if(data != null){
                        if(data['status'] != null){
                          if(data['status'] == "Success"){
                            reloadrtmdefectTbl();
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
   

   $('thead input[id="defect_select_all"]').on('click', function(e){ 

      if(this.checked){
         $('#defectTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#defectTbl tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
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
   
   //
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
  

   // Handle click on checkbox to set state of "Select all" control
   $('#defectTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
      // If checkbox is not checked
      if(!this.checked){
         var el = $('#defect_select_all').get(0); 
         // If "Select all" control is checked and has 'indeterminate' property
         if(el && el.checked){
            // Set visual state of "Select all" control 
            // as 'indeterminate'
            el.checked = false;
         }
          var index = defect_bulkcheckboxarr.indexOf(parseInt(this.id.match(/\d+/)));
                if(index > -1)
                {
                    defect_bulkcheckboxarr.splice(index,1)
                }
      }else
      {
          defect_bulkcheckboxarr.push(parseInt(this.id.match(/\d+/)));
        }
   });

   /** save testcase data into database */
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
         form_data.append('rtmId',nRTMid);
         form_data.append('testcaseIds',tc_bulkcheckboxarr);
         $.ajax({
            url: STEP_root+"api/saveRTM_testcase.php", //The url where the server req would we made.
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
       }else{
        
           $.alert({
                title: 'Information',
                content: "Please select testcase.",
                type: 'blue',
                typeAnimated: true
            });
       }
}
});

/** save defect form data */
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
  },
  messages: {
  },

  submitHandler: function(form) {
      if(defect_bulkcheckboxarr.length > 0){
         var form_data = new FormData($(form)[0]); 
         form_data.append('rtmId',nRTMid);
         form_data.append('defectIds',defect_bulkcheckboxarr);
         
         $.ajax({
            url: STEP_root+"api/saveRTM_defect.php", //The url where the server req would we made.
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
                    closedefectModelform(form);
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
              // console.log(textStatus+" // "+jqXHR+" // "+ errorThrown);
        }
        } );
       }else{
            $.alert({
                title: 'Information',
                content: "Please select defect.",
                type: 'blue',
                typeAnimated: true
            });
       }
}
});

$('#testcasemodal').on('hidden.bs.modal', function () {
  $('#testcaseform').trigger("reset");
  $("#filter_testcaseId").val('default');
  $("#filter_testcaseId").selectpicker("refresh");
  $("#filter_module").val('default');
  $("#filter_module").selectpicker("refresh");
});

$('#defectmodal').on('hidden.bs.modal', function () {
  $('#defectform').trigger("reset");
  $("#filter_defectId").val('default');
  $("#filter_defectId").selectpicker("refresh");
  $("#filter_defectmodule").val('default');
  $("#filter_defectmodule").selectpicker("refresh");
});

/** get testcase details */
$( document ).on( "click", "[id^=editTestcase]", function(e) {
    // prevent default action
    e.preventDefault();

    var temp_testcaseId = $(this).attr("data-testcaseId");
    $("#testcasehistoryTbl").hide();
    if(temp_testcaseId != "0"){
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
                      $("#precondition").val(data['precondition']);
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


/** get details of defect */
$( document ).on( "click", "[id^=editDefect]", function(e) {
        // prevent default action
        e.preventDefault();

          var temp_defectId = $(this).attr("data-defectId");
          if(temp_defectId != "0"){
               $.ajax({
                   type: "POST",
                   url: STEP_root+'api/getSingleedit.php',
                   dataType:'json',
                   data:  {"id":temp_defectId,"formtype":"Defectdetails"}, // serializes the form's elements.
                   success: function(data)
                   {
                    if(data !=null){
                        if(data['id'] !=null){
                            $("#defectnumtxt").html("Defect ID : <span class=' big '><strong>"+data['defectnum']+"</strong></span>");
                            $("#projecttxt").html("Project : <strong>"+data['projectId']+"</strong>");
                            $("#releasetxt").html("Release : <strong>"+data['releaseId']+"</strong>");
                            $("#testcasetxt").html("Testcase ID : <strong>"+data['testcaseId']+"</strong>");
                            $("#defecttypetxt").html("Defetc Type : <strong>"+data['defecttypeId']+"</strong>");
                            $("#defectstatustxt").html("Defect Status : <strong>"+data['defectstatusId']+"</strong>");
                            $("#moduletxt").html("Module : <strong>"+data['module']+"</strong>");
                            $("#submoduletxt").html("SubModule : <strong>"+data['submodule']+"</strong>");
                            $("#severitytxt").html("Severity : <strong>"+data['severity']+"</strong>");
                            $("#prioritytxt").html("Priority : <strong>"+data['priority']+"</strong>");
                            $("#shortdesctxt").html("Short Description : <br/><strong>"+data['shortdesc']+"</strong>");
                            $("#longdesctxt").html("Detailed Description : <br/><strong>"+data['longdesc']+"</strong>");
                            $("#testdatetxt").html("Test Data : <br/><strong>"+data['testdata']+"</strong>");
                            $("#steptxt").html("Steps : <br/><strong>"+data['steps']+"</strong>");
                            $("#expectedtxt").html("Expected Result : <br/><strong>"+data['expectedresult']+"</strong>");
                            $("#actualtxt").html("Actual Result : <br/><strong>"+data['actualresult']+"</strong>");
                            $("#defectattachmentsheader").addClass("hidden");
                             if(data['attachments'] != null){
                               $.each( data['attachments'], function( key, value ) {
                                console.log(key,value);
                                $("#defectattachmentsheader").removeClass("hidden");
                                  if(jQuery.inArray( value['extension'], docexts ) > -1){

                                      $("#defectattachments").append('<div class="col-md-2">'+
                                          '  <div class="card">'+
                                          '      <div class="card-body">'+
                                          '          <div class="mx-auto d-block" align="center">'+
                                          '              <a  href="'+value['filename']+'" target="_blank"><img src="'+STEP_root+'images/doc.png" height="50%" width="50%"></a>'+
                                          '          </div>'+
                                          '          <hr>'+
                                          '          <div class="card-text text-sm-center">'+
                                          '              <a href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                          '          </div>'+
                                          '      </div>'+
                                          '  </div>'+
                                        '</div>');
                                  }else if(jQuery.inArray( value['extension'], csvexts ) > -1){

                                      $("#defectattachments").append('<div class="col-md-2">'+
                                          '  <div class="card">'+
                                          '      <div class="card-body">'+
                                          '          <div class="mx-auto d-block" align="center">'+
                                          '              <a  href="'+value['filename']+'" target="_blank"><img src="'+STEP_root+'images/csv.png" height="50%" width="50%"></a>'+
                                          '          </div>'+
                                          '          <hr>'+
                                          '          <div class="card-text text-sm-center">'+
                                          '              <a href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                          '          </div>'+
                                          '      </div>'+
                                          '  </div>'+
                                        '</div>');
                                  }else if(jQuery.inArray( value['extension'], excelexts ) > -1){

                                      $("#defectattachments").append('<div class="col-md-2">'+
                                          '  <div class="card">'+
                                          '      <div class="card-body">'+
                                          '          <div class="mx-auto d-block" align="center">'+
                                          '              <a  href="'+value['filename']+'" target="_blank"><img src="'+STEP_root+'images/excel.png" height="50%" width="50%"></a>'+
                                          '          </div>'+
                                          '          <hr>'+
                                          '          <div class="card-text text-sm-center">'+
                                          '              <a href="'+value['filename']+'" download target="_blank" ><i class="fa fa-download pr-1"></i></a>'+
                                          '          </div>'+
                                          '      </div>'+
                                          '  </div>'+
                                        '</div>');
                                  }else if(jQuery.inArray( value['extension'], imgexts ) > -1){

                                      $("#defectattachments").append('<div class="col-md-2">'+
                                          '  <div class="card">'+
                                          '      <div class="card-body">'+
                                          '          <div class="mx-auto d-block" align="center">'+
                                          '              <a  href="'+value['filename']+'" target="_blank"><img src="'+value['filename']+'" height="50%" width="50%"></a>'+
                                          '          </div>'+
                                          '          <hr>'+
                                          '          <div class="card-text text-sm-center">'+
                                          '              <a href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
                                          '          </div>'+
                                          '      </div>'+
                                          '  </div>'+
                                        '</div>');
                                  }else {

                                      $("#defectattachments").append('<div class="col-md-2">'+
                                          '  <div class="card">'+
                                          '      <div class="card-body">'+
                                          '          <div class="mx-auto d-block" align="center">'+
                                          '              <a  href="'+value['filename']+'" target="_blank"><i class="fa fa-file-text pr-1"></i></a>'+
                                          '          </div>'+
                                          '          <hr>'+
                                          '          <div class="card-text text-sm-center">'+
                                          '              <a href="'+value['filename']+'" download target="_blank"><i class="fa fa-download pr-1"></i></a>'+
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

$('#rtmmodal').on('hidden.bs.modal', function () {
    loadDetails();
   loadHistory();
});


/** view defect in a new window */
$( document ).on( "click", "[id^=projattachment_]", function(e) {
    // prevent default action
    e.preventDefault();

    var fileview = $(this).attr("fileview");
    window.open(fileview,"window2","");
});
    
/** delete attachment from defect */
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


  $( document ).on( "click", "[id^=cancelform]", function(e) {
      // prevent default action
      e.preventDefault();

      var currentId = $(this).attr("data-id");
      if(currentId != "0"){

          $("form#replyform"+currentId)[0].reset();
          $("#newcomment"+currentId).val('');
          $("#replydiv"+currentId).addClass('hidden');
            
        }else{

        }
    });

$( document ).on( "click", "[id^=addreply]", function(e) {
    // prevent default action
    e.preventDefault();

    var currentId = $(this).attr("data-id");
    if(currentId != "0"){
        $("#replydiv"+currentId).removeClass('hidden');
          
      }else{

      }
  });

  /** save comment against the defect into database */
$('form[id="commentform"]').validate({

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
      "newcomment": {
          required: true,
          maxlength: 1000
      }
  },
  messages: {
    "newcomment": {
      maxlength: "You have reached your maximum limit of characters allowed"
    }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     form_data.append("rtmId",paramval1);
     
     $.ajax({
        url: STEP_root+"api/saveRTMcomment.php", //The url where the server req would we made.
        async: false,
        type: "POST", //The type which you want to use: GET/POST
        data: form_data , //The variables which are going.
        dataType: "text", //Return data type (what we expect).
        cache: false,
        contentType: false,
        processData: false,
        //This is the function which will be called if ajax call is successful.
        success: function(data) {
            $(form)[0].reset();
            $("#newcomment").val('');
            loadComment();
        }
    });
}
});

})(jQuery);
