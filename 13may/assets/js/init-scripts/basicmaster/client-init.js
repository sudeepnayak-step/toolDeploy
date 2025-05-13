var bulkcheckboxarr = new Array();
(function ($) {
    //    "use strict";
    /*  Data Table
    -------------*/

    $('#bootstrap-data-table').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
    });

  var clientTable =  $('#clientTbl').DataTable({
        "ajax": {
            "url": STEP_root+"api/getallBasicmaster.php",
            "type": 'POST',
            "data": function ( d ) {
            return {'formtype':'Client','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")};
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
                 "orderable": true,
                'targets': [1],
                 "class": "text-left",
                "render": function ( data, type, row ) {
                  return '<a href="JavaScript:void(0)" id="editClient'+row[0]+'" data-id="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#clientmodal" ><b>'+
                          data+
                         '</b> </a>';
                }
            }, 
            {
	            "targets": -1,
	            "class":"text-left",
                "visible":false,
	    		render: function ( data, type, row ) {
					return '<a href="JavaScript:void(0)" id="deleteClient'+data+'" data-id="'+data+'" >'+
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
    		{"orderable": true,"targets":[1],"class":"text-left"}  
		],
	scrollY: '500px',       // Set your desired height
	scrollCollapse: true,   // Collapse the table height if fewer rows
        "scrollX": true,
        "paging": true,
        "info": true,
        "stateSave": true,
        "sDom": "<'dt-panelmenu  clearfix'<'col-sm-8 text-left'l><'col-sm-4'f>>" +
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
                        "title": 'Client list',
                        "extend": 'excelHtml5',
                        "exportOptions": {
                            "columns": ':not(.notexport)',
                            "orthogonal": 'export'
                        }
                    },
                    {
                        "text": 'CSV',
                        "title": 'Client list',
                        "extend": 'csvHtml5',
                        "exportOptions": {
                            "columns": ':not(.notexport)',
                            "orthogonal": 'export'
                        }
                    },
                    {
                        "text": 'PDF',
                        "title": 'Client list',
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
/** delete the client */
 $( document ).on( "click", "[id^=deleteClient]", function(e) {
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
                             url: STEP_root+'api/deleteBasicmaster.php',
                             dataType:'json',
                             data:  {"id":currentId,'formtype':'Client','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, // serializes the form's elements.
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


    $( document ).on( "click", "[id^=editClient]", function(e) {
        // prevent default action
        e.preventDefault();

          var currentId = $(this).attr("data-id");
          if(currentId != "0"){
               $.ajax({
                   type: "POST",
                   url: STEP_root+'api/getBasicmaster.php',
                   dataType:'json',
                   data:  {"id":currentId,'formtype':'Client','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, // serializes the form's elements.
                   success: function(data)
                   {
                    if(data !=null){
                        if(data['id'] !=null){
                            $("#clientId").val(data['id']);
                            $("#clientname").val(data['clientname']);
                            $("#clientname").attr("data-id",data['id']);
                            $("#activestatus").val(data['activestatus']);
                            
                        }
                    }

                   }
               });
           }else{

           }
        });

$('form[id="clientform"]').validate({

    // onkeyup: function(element) {$(element).valid()},
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
    "clientname": {
        required: true,
        checkunique: "clientname"
      },
    "activestatus": 'required'
  },
  messages: {

    "clientname": {
        required: 'Please enter client name'
      }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     $.ajax({
        url: STEP_root+"api/saveClient.php", //The url where the server req would we made.
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
        }
    });
}
});

function closeModelform(form){
   var mymodal = $('#clientmodal');
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTbl();
}
function reloadTbl(){

    clientTable.ajax.reload( null, false );
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
         $('#clientTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#clientTbl tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });  
   
   // Handle click on checkbox to set state of "Select all" control
   $('#clientTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
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
   


    $( document ).on( "click", ".bulkAction", function(e) {
        // prevent default action
        e.preventDefault();

          var nType = $(this).attr("data-type");
          if(bulkcheckboxarr.length > 0){
                $.ajax({
                url: STEP_root+"api/bulkAction.php", //The url where the server req would we made.
                async: false,
                type: "POST", //The type which you want to use: GET/POST
                data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=Client", //The variables which are going.
                dataType: "html", //Return data type (what we expect).
                //This is the function which will be called if ajax call is successful.
                success: function(data)
                { 
                    clientTable.ajax.reload( null, false );
                    $('#select_all').attr("checked",false);
                    bulkcheckboxarr.length = 0;
                }
            });
            }else
            {
                
                //alert("kk")
            }
   
      });

$('#clientmodal').on('hidden.bs.modal', function () {
  $('#clientform').trigger("reset");
  $("#clientname").attr("data-id","0");
  $('#clientform .state-error').css('display', 'none');
});
})(jQuery);
