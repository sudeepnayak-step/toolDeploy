var bulkcheckboxarr = new Array();
(function ($) {
    //    "use strict";
    /*  Data Table
    -------------*/

    $('#bootstrap-data-table').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
    });
    // initialize activity table
    var projTable =  $('#activityTbl').DataTable({
        "ajax": {
            "url": STEP_root+"api/getallBasicmaster.php",
            "type": 'POST',
            "data": function ( d ) {
            return {'formtype':'Activity','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")};
            }
        },
        "columnDefs": [
        	{
                'sortable': false,
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
                "orderable": true,
                'targets': [1],
                 "class": "text-left",
                "render": function ( data, type, row ) {
                  return '<a href="JavaScript:void(0)" id="editActivity'+row[0]+'" data-id="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#activitymodal" ><b>'+
                          data+
                         '</b> </a>';
                }
            },
            {
              "visible": false,
	            "targets": -1,
	            "class":"text-left",
              render: function ( data, type, row ) {
              return '<a href="JavaScript:void(0)" id="deleteActivity'+data+'" data-id="'+data+'" >'+
                      '  <span class="fa fa-trash text-danger "></span>'+
                    ' </a>';
              }           
        	},
          {
              "targets": [-2],
                "orderable": true,
              "class":"text-left",
              render: function ( data, type, row ) {
                  var badgecolor = (data != "Active" ? "badge-danger" : "badge-success");
                  return '<span class="badge badge-pill '+badgecolor+'">'+data+'</span>';
              }           
          },
    		{"targets":[1,2,3],"class":"text-left"}  
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
                        "title": 'Activity Master',
                        "extend": 'excelHtml5',
                        "exportOptions": {
                          "columns": ':not(.notexport)',
                          "orthogonal": 'export'
                        }
                    },
                    {
                        "text": 'CSV',
                        "title": 'Activity Master',
                        "extend": 'csvHtml5',
                        "exportOptions": {
                          "columns": ':not(.notexport)',
                          "orthogonal": 'export'
                        }
                    },
                    {
                        "text": 'PDF',
                        "title": 'Activity Master',
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

  /** delete activity by id */
 $( document ).on( "click", "[id^=deleteActivity]", function(e) {
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
                             data:  {"id":currentId,'formtype':'Activity','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, // serializes the form's elements.
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

        /** edit activity */
    $( document ).on( "click", "[id^=editActivity]", function(e) {
        // prevent default action
        e.preventDefault();

        var currentId = $(this).attr("data-id");
        if(currentId != "0"){
              $.ajax({
                  type: "POST",
                  url: STEP_root+'api/getBasicmaster.php',
                  dataType:'json',
                  data:  {"id":currentId,'formtype':'Activity','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, // serializes the form's elements.
                  success: function(data)
                  {
                  if(data !=null){
                      if(data['id'] !=null){
                          $("#activityId").val(data['id']);
                          $("#activityname").val(data['activityname']);
                          $("#activityname").attr("data-id",data['id']);
                          $("#activitycode").val(data['activitycode']);
                          $("#activitycode").attr("data-id",data['id']);
                          $("#activitytype").val(data['activitytype']);
                          
                      }
                  }

                  }
              });
          }else{

          }
      });

      /** validate the data and submit the activity form */
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
      "activityname": {
          required: true,
          foldername: true,
          checkunique: "activityname"
        },
      "activitycode": {
          required: true,
          foldername: true,
          checkunique: "activitycode"
        },
      "activitytype": 'required'
    },
    messages: {
      "activityname": {
          required: 'Please enter activity name'
        },
      "activitycode": {
          required: 'Please enter activity code'
        },
      "activitytype": 'Please select activity type'
    },

    submitHandler: function(form) {
      var form_data = new FormData($(form)[0]); 
      form_data.append("enteredby",localStorage.getItem("id"));
      form_data.append("accountId",localStorage.getItem("accountId"));
      form_data.append("userempid",localStorage.getItem("userempid"));
      $.ajax({
          url: STEP_root+"api/saveActivitymaster.php", //The url where the server req would we made.
          async: false,
          type: "POST", //The type which you want to use: GET/POST
          data: form_data , //The variables which are going.
          dataType: "json", //Return data type (what we expect).
          cache: false,
          contentType: false,
          processData: false,
      //                     mimeType: "multipart/form-data",
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
   var mymodal = $('#activitymodal');
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTbl();
}
function reloadTbl(){

    $("#activityname").attr("data-id","0");
    $("#activitycode").attr("data-id","0");
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
   


    $( document ).on( "click", ".bulkAction", function(e) {
        // prevent default action
        e.preventDefault();

          var nType = $(this).attr("data-type");
          if(bulkcheckboxarr.length > 0){
                $.ajax({
                url: STEP_root+"api/bulkAction.php", //The url where the server req would we made.
                async: false,
                type: "POST", //The type which you want to use: GET/POST
                data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=Activity", //The variables which are going.
                dataType: "html", //Return data type (what we expect).
                //This is the function which will be called if ajax call is successful.
                success: function(data)
                { 
                    projTable.ajax.reload( null, false );
                    $('#select_all').attr("checked",false);
                    bulkcheckboxarr.length = 0;
                }
            });
            }   
      });

$('#activitymodal').on('hidden.bs.modal', function () {
  $('#activityform').trigger("reset");

  $("#activityname").attr("data-id","0");
  $("#activitycode").attr("data-id","0");
    $('#activityform .state-error').css('display', 'none');
});
})(jQuery);
