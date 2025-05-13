var bulkcheckboxarr = new Array();
(function ($) {
    //    "use strict";
    /*  Data Table
    -------------*/

$("#roleId").html("");
$("#roleId").selectpicker('refresh');

/**
 * p1: 
 * 
 * This function will return a role dropdown. 
 * The function will then update the role_div element with the data fetched from the API.
 * 
 * @return {Promise} 
 */
var p1 = function(){
    return new Promise(function(resolve, reject){
        console.log('p1');
        
        $.ajax({
                   type: "POST",
                   url: STEP_root+'api/getDropdown.php',
                   dataType:'json',
                   data:  {'formtype':'Role','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, // serializes the form's elements.
                   success: function(data)
                   {
                      if(data != null && data['data']!=null){
                        $.each( data['data'], function( key, value ) {
                          $("#roleId").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
                        });
                      }

                     $("#roleId").selectpicker('refresh');
                     resolve(true);
                   }
               });
  
    });
};
p1().then(function(){
});
$('#bootstrap-data-table').DataTable({
    lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
});

$.fn.dataTable.ext.errMode = 'none';
/** initialize the user table */   
var userTbl =  $('#userTbl')
  .on( 'error.dt', function ( e, settings, techNote, message ) {
        formatErrorMessage("","");

    } ).DataTable({
        "ajax": {
            "url": STEP_root+"api/getallUsers.php",
            "type": 'POST',
            "data": function ( d ) {
            return {'formtype':'User','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")};
            }
        },
        "columnDefs": [
          {
                'visible': false,
                'sortable': false,
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
                'targets': [2],
                 "class": "text-left",
                "render": function ( data, type, row ) {
                  return '<a href="JavaScript:void(0)" id="editUser'+row[0]+'" data-id="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#usermodal" ><b>'+
                          data+
                         '</b> </a>';
                }
          }, 
          {
            "orderable": false,
            "targets": -1,
            "visible": true,
            "class":"text-left",
            render: function ( data, type, row ) {
              if(row[6] == "Created"){
                  return '<a href="JavaScript:void(0)"  id="deleteUser'+data+'" data-id="'+data+'"  data-userId="'+row[5]+'">'+
                    '  <span class="fa fa-trash text-danger "></span>'+
                  ' </a>';
              }else{
                  return '<a href="JavaScript:void(0)"  data-trigger="hover" data-toggle="popover" title="Information" data-content="Useraccount is active for this employee. Hense you cannot delete this account.">'+
                    '  <span class="fa fa-trash text-default "></span>'+
                  ' </a>';
              }
            }           
          },
          {
              "targets": [-2],
              "class":"text-left",
              render: function ( data, type, row ) {
                  var badgecolor = (data != "Active" ? "badge-danger" : "badge-success");
                  return '<span class="badge badge-pill '+badgecolor+'">'+data+'</span>';
              }           
          },
          {
              "targets": [-3],
              "class":"text-left",
              render: function ( data, type, row ) {
                if(data == "Created"){
                  return '<a href="JavaScript:void(0)" class="text-step" id="resendActivation'+row[0]+'" data-id="'+row[0]+'"  data-empname="'+row[1]+'"  data-userId="'+row[5]+'" >Resend</span>';
                }else{
                  return data;
                }
              }           
          },
          {"visible":false,"targets":[5],"class":"text-left"} , 
          {"targets":[1,2,3],"class":"text-left"}  
      ],
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
          {
              "extend": 'collection',
              "autoClose": 'true',
              "text":'<span style="padding-right:5px; float:left" >Download</span>',
              "buttons": [
                  {
                      "text": 'Excel',
                      "title": 'User list',
                      "extend": 'excelHtml5',
                      "exportOptions": {
                        "columns": ':not(.notexport)',
                        "orthogonal": 'export'
                      }
                  },
                  {
                      "text": 'CSV',
                      "title": 'User list',
                      "extend": 'csvHtml5',
                      "exportOptions": {
                        "columns": ':not(.notexport)',
                        "orthogonal": 'export'
                      }
                  },
                  {
                      "text": 'PDF',
                      "title": 'User list',
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
      "drawCallback": function (settings) { 
          $('[data-toggle="popover"]').popover();
      }
  });

userTbl.buttons().container().appendTo('#exportButtonsContainer');
  /** delete the ued based on id */
 $( document ).on( "click", "[id^=deleteUser]", function(e) {
        // prevent default action
        e.preventDefault();

          var currentId = $(this).attr("data-id");
          var nUserid = $(this).attr("data-userId");
          if(currentId != "0"){

            $.confirm({
              title: 'Confirm!',
              content: 'Are you sure you want to delete this user?',
              buttons: {
                  cancel: function () {
                      
                  },
                  confirm: {
                      btnClass: 'btn-blue',
                      action: function(){
                        $.ajax({
                             type: "POST",
                             url: STEP_serverroot+'api/deleteUseraccount.php',
                             dataType:'json',
                             data:  {"userId":nUserid},
                             success: function(data)
                             {
                              if(data != null){
                                if(data['status'] != null){
                                  if(data['status'] == "Success"){

                                    deleteEmployee(currentId);
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
                              
                             }
                         });
                          
                      }
                  }
              }
          });
            
      }else{

      }
  });
/**
 * Delete an employee based on the currentId provided.
 * 
 * @param {string} currentId - The id of the employee to be deleted.
 */
function deleteEmployee(currentId){
  $.ajax({
      type: "POST",
      url: STEP_root+'api/deleteAction.php',
      dataType:'json',
      data:  {"id":currentId,'formtype':'User','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, // serializes the form's elements.
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
      
      }
  });
}

/** resendthe activation mail */
$( document ).on( "click", "[id^=resendActivation]", function(e) {
        // prevent default action
        e.preventDefault();

          var euserId = $(this).attr("data-userId");
          var eEmpname = $(this).attr("data-empname");
          if(euserId != "0"){

            $.confirm({
              title: 'Confirm!',
              content: 'Are you sure you want to resend the activation email?',
              buttons: {
                  cancel: function () {
                      
                  },
                  confirm: {
                      btnClass: 'btn-blue',
                      action: function(){
                          $.ajax({
                             type: "POST",
                             url: STEP_serverroot+'api/resendActivation.php',
                             dataType:'json',
                             data:  {"userId":euserId,'accountId':localStorage.getItem("accountId"),"local":STEP_root,"empname":eEmpname}, // serializes the form's elements.
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
                              
                             }
                         });
                      }
                  }
              }
          });
        }else{
        }
    });

/** get user detail based on id */
    $( document ).on( "click", "[id^=editUser]", function(e) {
        // prevent default action
        e.preventDefault();

          var currentId = $(this).attr("data-id");
          if(currentId != "0"){
               $.ajax({
                   type: "POST",
                   url: STEP_root+'api/getSingleedit.php',
                   dataType:'json',
                   data:  {"id":currentId,"formtype":"User",'enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, // serializes the form's elements.
                   success: function(data)
                   {
                    if(data !=null){
                        if(data['id'] !=null){
                            $("#uid").val(data['id']);
                            $("#firstname").val(data['firstname']);
                             $("#firstname").attr("data-exist",data['firstname']);

                            $("#middlename").val(data['middlename']);
                             $("#middlename").attr("data-exist",data['middlename']);

                            $("#lastname").val(data['lastname']);
                             $("#lastname").attr("data-exist",data['lastname']);

                            $("#emailid").val(data['emailid']);
                             $("#emailid").attr("data-exist",data['emailid']);

                            $("#emailid").attr("data-id",data['id']);
                            
                            $("#phoneno").val(data['phoneno']);
                             $("#phoneno").attr("data-exist",data['phoneno']);

                            $("#activestatus").val(data['activestatus']);
                             $("#activestatus").attr("data-exist",data['activestatus']);

                             $("#userId").val(data['userId']);

                             $("#roleId").val(data['roleId']);
                             $("#roleId").attr("data-exist",data['roleId']);
                             $("#roleId").selectpicker('refresh');
                             if(data['userId'] != null && data['userId'] !=""){                              
                               if(parseInt(data['userId']) >0){
                               }
                             }

                             if(data['editable'] != null && data['editable'] >0){

                                $("#informationalert").html('<div class="col-sm-12">'+
                                        '    <div class="alert  alert-info alert-dismissible fade show" role="alert">'+
                                        '        <span class="badge badge-pill badge-info">Information</span> User account is already created for this employee. Hense you cannot change the email id.'+
                                        '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                        '            <span aria-hidden="true">×</span>'+
                                        '        </button>'+
                                        '    </div>'+
                                        '</div>');
                                $('#emailid').prop('disabled', true);
                             }else{
                                $('#emailid').prop('disabled', false);
                             }

                            
                        }
                    }

                   }
               });
           }else{

           }
        });

/** save user detail changes */
$('form[id="userform"]').validate({

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
    "firstname": 'required',
    // "emailid": 'required',

    "emailid": {
        required: true,
        checkemail: "emailid"
      },
    "roleId": 'required'
  },
  messages: {


    "emailid": {
        required: 'Please enter email id'
      }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     form_data.append("enteredby",localStorage.getItem("id"));
     form_data.append("accountId",localStorage.getItem("accountId"));
     form_data.append("userempid",localStorage.getItem("userempid"));
     form_data.append("emailid",$("#emailid").val());

     form_data.append('firstname_change',($("#firstname").val() != null && $("#firstname").val() != $("#firstname").attr("data-exist") ? "1":"0"));
     form_data.append('middlename_change',($("#middlename").val() != null && $("#middlename").val() != $("#middlename").attr("data-exist") ? "1":"0"));
     form_data.append('lastname_change',($("#lastname").val() != null && $("#lastname").val() != $("#lastname").attr("data-exist") ? "1":"0"));
     form_data.append('emailid_change',($("#emailid").val() != null && $("#emailid").val() != $("#emailid").attr("data-exist") ? "1":"0"));
     form_data.append('phoneno_change',($("#phoneno").val() != null && $("#phoneno").val() != $("#phoneno").attr("data-exist") ? "1":"0"));
     form_data.append('roleId_change',($("#roleId").val() != null && $("#roleId").val() != $("#roleId").attr("data-exist") ? "1":"0"));
     form_data.append('activestatus_change',($("#activestatus").val() != null && $("#activestatus").val() != $("#activestatus").attr("data-exist") ? "1":"0"));

     var emailid_change = ($("#emailid").val() != null && $("#emailid").val() != $("#emailid").attr("data-exist") ? "1":"0");
     var roleId_change = ($("#roleId").val() != null && $("#roleId").val() != $("#roleId").attr("data-exist") ? "1":"0");
     var emailval = ($("#emailid").val() != null ? $("#emailid").val() :"");
     var roleIdval = ($("#roleId").val() != null ? $("#roleId").val() :"0");
     $.ajax({
        url: STEP_root+"api/saveUser.php", //The url where the server req would we made.
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
                  if(data['empdata'] !=null){
                      if(data['empdata']['userId'] !=null ){
                        if(data['empdata']['userId'] =="0"){                          
                              addUser(data['empdata'],form);
                        }else{
                          if(emailid_change == "1" || roleId_change == "1"){
                            var updateParam = {"emailid":emailval,"emailid_change":emailid_change,"roleId":roleIdval,"roleId_change":roleId_change};
                            updateUser(updateParam,data['empdata'],form);
                          }else{
                             closeModelform(form);
                            $.alert({
                                  title: 'Success',
                                  content: data['message'],
                                  type: 'green',
                                  typeAnimated: true
                              });
                          }
                        }
                      }else{
                        closeModelform(form);
                          $.alert({
                          title: 'Encountered an error!',
                          content: "Something went wrong. Please try again.",
                          type: 'red',
                          typeAnimated: true
                      });
                      }
                  }else{
                    closeModelform(form);
                      $.alert({
                      title: 'Encountered an error!',
                      content: "Something went wrong. Please try again.",
                      type: 'red',
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
        }
    });
}
});


function closeModelform(form){
   var mymodal = $('#usermodal');
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTbl();
}
function reloadTbl(){

            
    $("#roleId").val('default');
    $("#roleId").selectpicker("refresh");
    userTbl.ajax.reload( null, false );
    $('#select_all').attr("checked",false);
    bulkcheckboxarr.length = 0;
}


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
      $('#userTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
  } else {
      $('#userTbl tbody input[type="checkbox"]:checked').trigger('click');
  }

  // Prevent click event from propagating to parent
  e.stopPropagation();
});  
   
   // Handle click on checkbox to set state of "Select all" control
   $('#userTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
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
   

/** bulk action to make user active or inactive */
  $( document ).on( "click", ".bulkAction", function(e) {
      // prevent default action
      e.preventDefault();

        var nType = $(this).attr("data-type");
        if(bulkcheckboxarr.length > 0){
              $.ajax({
              url: STEP_root+"api/bulkAction.php", //The url where the server req would we made.
              async: false,
              type: "POST", //The type which you want to use: GET/POST
              data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=User", //The variables which are going.
              dataType: "html", //Return data type (what we expect).
              //This is the function which will be called if ajax call is successful.
              success: function(data)
              { 
                  userTbl.ajax.reload( null, false );
                  $('#select_all').attr("checked",false);
                  bulkcheckboxarr.length = 0;
                  
              }
          });
          }else
          {
          }

    });
$('#usermodal').on('hide.bs.modal', function(e){
    $('#userform')[0].reset();
    $("#roleId").val('default');
    $("#roleId").selectpicker("refresh");

    $('#userform .state-error').css('display', 'none');
});


  /**
   * Send a POST request to add a new user or update an existing user.
   * @param {Object} nmsg - an object containing the user information.
   * @param {HTMLElement} form - the form element that triggered the request.
   */
function addUser(nmsg,form){

          console.log("nmsg",nmsg);
          var userid = nmsg['userId'];
          var username = nmsg['username'];
          var useremail = nmsg['email'];
          var userempid = nmsg['employeeId'];
          var usertype = nmsg['type'];
          var liccount = nmsg['employeeId'];
          var roleId = nmsg['roleId'];
          var accountId = nmsg['accountId'];
          var accountactivestatus = nmsg['accountactivestatus'];
          var accountstatus = nmsg['accountstatus'];
          var enteredby = nmsg['enteredby'];
          var sendInfo = {
           "userid": userid,
           "username": username,
           "email": useremail,
           "type": usertype,
           "employeeId": userempid,
           "roleId": roleId,
           "accountId": accountId,
           "accountactivestatus": accountactivestatus,
           "accountstatus": accountstatus,
           "enteredby": enteredby,
           "local": STEP_root
       };
  $.ajax({
        url: STEP_serverroot+"api/addupdateUser.php", //The url where the server req would we made.
        async: false,
        type: "POST", //The type which you want to use: GET/POST
        data: sendInfo,
        dataType: "json", //Return data type (what we expect).
        cache: false,
        //This is the function which will be called if ajax call is successful.
        success: function(data) {
          if(data != null){
            if(data['status'] != null){
              if(data['status'] == "Success"){
                  if(data['userdata'] != null){
                    updateemployee(data['userdata'],form);
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
          
        }
    });
}

/**
 * Send a POST request to update an existing user.
 * @param {Object} nParam - an object containing the user information.
 * @param {Object} nmsg - an object containing the user information.
 * @param {HTMLElement} form - the form element that triggered the request.
 */
function updateUser(nParam,nmsg,form){

  var userid = nmsg['userId'];
  var username = nmsg['username'];
  var useremail = nmsg['email'];
  var userempid = nmsg['employeeId'];
  var usertype = nmsg['type'];
  var liccount = nmsg['employeeId'];
  var roleId = nmsg['roleId'];
  var accountId = nmsg['accountId'];
  var accountactivestatus = nmsg['accountactivestatus'];
  var accountstatus = nmsg['accountstatus'];
  var enteredby = nmsg['enteredby'];
  var sendInfo = {
    "userid": userid,
    "username": username,
    "email": useremail,
    "type": usertype,
    "employeeId": userempid,
    "roleId": roleId,
    "accountId": accountId,
    "accountactivestatus": accountactivestatus,
    "accountstatus": accountstatus,
    "enteredby": enteredby,
    "local": STEP_root
};
$.ajax({
        url: STEP_serverroot+"api/addupdateUser.php", //The url where the server req would we made.
        async: false,
        type: "POST", //The type which you want to use: GET/POST
        data: sendInfo,
        dataType: "json", //Return data type (what we expect).
        cache: false,
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
          
        }
    });
}

/**
 *  update an existing employee.
 */
function updateemployee(nmsg,form){

    var userid = nmsg['userId'];
    var empid = nmsg['empid'];
    $.ajax({
        url: STEP_root+"api/updateemployee.php", //The url where the server req would we made.
        async: false,
        type: "GET", //The type which you want to use: GET/POST
        data: "userid="+userid+"&&empid="+empid+"&&accountId="+localStorage.getItem("accountId"), //The variables which are going.
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
          
        }
    });
}

})(jQuery);
