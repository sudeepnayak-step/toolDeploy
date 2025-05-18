var bulkcheckboxarr = new Array();
var imgexts = new Array('gif', 'png', 'jpg','jpeg');
var docexts = new Array('docx','doc');
var csvexts = new Array('csv');
var pdfexts = new Array('pdf');
var excelexts = new Array('xls','xlsx','xlt');
(function ($) {
    //    "use strict";
 var temp_testsuiteId = window.location.search.substr(1);
  var arr = temp_testsuiteId.split("=");
  var param1 = arr[0];
  var paramval1 = arr[1];
  
$("#editbtn").html('<a href="JavaScript:void(0)" id="editDefect'+paramval1+'" data-id="'+paramval1+'" class="text-step pull-right" data-toggle="modal" data-target="#defectmodal" ><b>Edit Defect</b> </a>');

/**
 * Function to load the defect details based on the id 
 * @returns {undefined}
 */
function loadDefectdetails(){
$.ajax({
    type: "POST",
    url: STEP_root+'api/getSingleedit.php',
    dataType:'json',
    data:  {"id":paramval1,"formtype":"Defectdetails"}, // serializes the form's elements.
    success: function(data)
    {
    $("#prvdefect").addClass("hidden");
    $("#nextdefect").addClass("hidden");
    if(data !=null){
        if(data['id'] !=null){
            if(data['prvId'] != null && data['prvId'] !="0" && data['prvId'] !=""){
              $("#prvdefect").attr("href",STEP_root+'master/defectdetails.php?id='+data['prvId']);
              $("#prvdefect").removeClass("hidden");
            }
            if(data['nextId'] != null && data['nextId'] !="0" && data['nextId'] !=""){
              $("#nextdefect").attr("href",STEP_root+'master/defectdetails.php?id='+data['nextId']);
              $("#nextdefect").removeClass("hidden");
            }
            var nDetailstxt = "Defect ID : <span class=' big text-step'><strong>"+data['defectnum']+"</strong></span>";
            if((data['editPermission'] != null && data['editPermission'] >0)){
            nDetailstxt += "<a href='JavaScript:void(0)' id='editDefect"+paramval1+"' data-id='"+paramval1+"' class='text-step pull-right' data-toggle='modal' data-target='#defectmodal' ><b>Edit Defect</b> </a>";
            }
            $("#defectnumtxt").html(nDetailstxt);
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
	    $("#environmenttxt").html("Environment : <strong>"+data['environment']+"</strong>");
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
            $("#defectattachmentsheader").addClass("hidden");
              if(data['attachments'] != null){
                $.each( data['attachments'], function( key, value ) {
                console.log(key,value);
                $("#defectattachmentsheader").removeClass("hidden");
                  if(jQuery.inArray( value['extension'], docexts ) > -1){

                      $("#defectattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
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

                      $("#defectattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
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

                      $("#defectattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
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

                      $("#defectattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
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

                      $("#defectattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
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

                      $("#defectattachments").append('<div class="col-md-2" id="attachment_'+key+'">'+
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
            
        }
    }

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
  url: STEP_root+'api/getDefectcomments.php',
  dataType:'json',
  data:  {"defectId":paramval1}, // serializes the form's elements.
  success: function(data)
  {
  $("#defectcommentdiv").html('');
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
        var defectcomments = '<div class="comment mb-2  row">'+
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

        $("#defectcommentdiv").append(defectcomments);
        $("form#replyform"+value['id']).submit(function(event) {
            event.preventDefault();
            var formData = new FormData(this);
            formData.append("defectId",paramval1);
            formData.append("commentId",value['id']);
            $.ajax({
              url: STEP_root+"api/saveDefectcomment.php", //The url where the server req would we made.
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
loadDefectdetails();
loadComment();

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
     form_data.append("defectId",paramval1);
     
     $.ajax({
        url: STEP_root+"api/saveDefectcomment.php", //The url where the server req would we made.
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

})(jQuery);
