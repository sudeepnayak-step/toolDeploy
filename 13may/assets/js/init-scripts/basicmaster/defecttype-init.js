var bulkcheckboxarr = new Array();
(function ($) {
    //    "use strict";
    /*  Data Table
    -------------*/

    $('#bootstrap-data-table').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
    });
/** initialize the defect type table */
    var typeTable =  $('#defecttypeTbl').DataTable({
        "ajax": {
            "url": STEP_root+"api/getallBasicmaster.php",
            "type": 'POST',
            "data": function ( d ) {
            return {'formtype':'DefectType','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")};
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
                  return '<a href="JavaScript:void(0)" id="editDefectType'+row[0]+'" data-id="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#defecttypemodal" ><b>'+
                          data+
                         '</b> </a>';
                }
            }, 
            {
	            "targets": -1,
               "visible": false,
	            "class":"text-left",
	    		render: function ( data, type, row ) {
					return '<a href="JavaScript:void(0)" id="deleteDefectType'+data+'" data-id="'+data+'" >'+
					        '  <span class="fa fa-trash text-danger "></span>'+
					       ' </a>';
    			}           
        	},
            { "orderable": true,
                "targets": [-2],
                "class":"text-left",
                render: function ( data, type, row ) {
                    var badgecolor = (data != "Active" ? "badge-danger" : "badge-success");
                    return '<span class="badge badge-pill '+badgecolor+'">'+data+'</span>';
                }           
            },
    		{"targets":[1],"class":"text-left"}  
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
                        "title": 'Defect type list',
                        "extend": 'excelHtml5',
                        "exportOptions": {
                            "columns": ':not(.notexport)',
                            "orthogonal": 'export'
                        }
                    },
                    {
                        "text": 'CSV',
                        "title": 'Defect type list',
                        "extend": 'csvHtml5',
                        "exportOptions": {
                            "columns": ':not(.notexport)',
                            "orthogonal": 'export'
                        }
                    },
                    {
                        "text": 'PDF',
                        "title": 'Defect type list',
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
/** delete defect type master record by id */
 $( document ).on( "click", "[id^=deleteDefectType]", function(e) {
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
                             data:  {"id":currentId,'formtype':'DefectType','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, // serializes the form's elements.
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

    /** edit defect type master by id */
    $( document ).on( "click", "[id^=editDefectType]", function(e) {
        // prevent default action
        e.preventDefault();

        var currentId = $(this).attr("data-id");
        if(currentId != "0"){
            $.ajax({
                type: "POST",
                url: STEP_root+'api/getBasicmaster.php',
                dataType:'json',
                data:  {"id":currentId,'formtype':'DefectType','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, // serializes the form's elements.
                success: function(data)
                {
                if(data !=null){
                    if(data['id'] !=null){
                        $("#defecttypeId").val(data['id']);
                        $("#defecttypename").val(data['defecttypename']);
                        $("#defecttypename").attr("data-id",data['id']);
                        $("#activestatus").val(data['activestatus']);
                        
                    }
                }

                }
            });
        }else{

        }
    });

/** save defect type data  */
$('form[id="defecttypeform"]').validate({

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
    "defecttypename": {
        required: true,
        checkunique: "defecttypename"
      },
    "activestatus": 'required'
  },
  messages: {
    "defecttypename":  {
        required: 'Please enter defect type'
      }
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     $.ajax({
        url: STEP_root+"api/saveDefecttype.php", //The url where the server req would we made.
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
   var mymodal = $('#defecttypemodal');
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTbl();
}
function reloadTbl(){

    typeTable.ajax.reload( null, false );
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
         $('#defecttypeTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#defecttypeTbl tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });  
   
   // Handle click on checkbox to set state of "Select all" control
   $('#defecttypeTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
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
   

/** bulk action to make records active or inactive */
    $( document ).on( "click", ".bulkAction", function(e) {
        // prevent default action
        e.preventDefault();

          var nType = $(this).attr("data-type");
          if(bulkcheckboxarr.length > 0){
                $.ajax({
                url: STEP_root+"api/bulkAction.php", //The url where the server req would we made.
                async: false,
                type: "POST", //The type which you want to use: GET/POST
                data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=DefectType", //The variables which are going.
                dataType: "html", //Return data type (what we expect).
                //This is the function which will be called if ajax call is successful.
                success: function(data)
                { 
                    typeTable.ajax.reload( null, false );
                    $('#select_all').attr("checked",false);
                    bulkcheckboxarr.length = 0;
                }
            });
            }   
      });

$('#defecttypemodal').on('hidden.bs.modal', function () {
  $('#defecttypeform').trigger("reset");
  $("#defecttypename").attr("data-id","0");
  $('#defecttypeform .state-error').css('display', 'none');
});
})(jQuery);
