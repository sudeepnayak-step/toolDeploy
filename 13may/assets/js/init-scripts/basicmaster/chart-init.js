var bulkcheckboxarr = new Array();
(function ($) {
    //    "use strict";
    /*  Data Table
    -------------*/
$.fn.dataTable.ext.errMode = 'none';
    $('#bootstrap-data-table').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
    });

$("#xAxis").html("");
$("#xAxis").selectpicker('refresh');
$("#yAxis").html("");
$("#yAxis").selectpicker('refresh');
/** initialize chart table */
  var chartTable =  $('#chartTbl')
    .on( 'error.dt', function ( e, settings, techNote, message ) {
        console.log( 'An error has been reported by DataTables: ', message );
        formatErrorMessage("","");

    } ).DataTable({
        "ajax": {
            "url": STEP_root+"api/getallBasicmaster.php",
            "type": 'POST',
            "data": function ( d ) {
            return {'formtype':'Chart','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")};
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
            "orderable": false,
            'targets': [1],
              "class": "text-left",
            "render": function ( data, type, row ) {
              return '<a href="JavaScript:void(0)" id="editChart'+row[0]+'" data-id="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#chartmodal" ><b>'+
                      data+
                      '</b> </a>';
            }
            },
            {
	            "targets": -1,
	            "class":"text-left",
              render: function ( data, type, row ) {
              return '<a href="JavaScript:void(0)" id="deleteChart'+data+'" data-id="'+data+'" >'+
					        '  <span class="fa fa-trash text-danger "></span>'+
					       ' </a>';
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
    	  {"targets":[1,2,3],"class":"text-left"}  
		    ],
	scrollY: '500px',       // Set your desired height
	scrollCollapse: true,   // Collapse the table height if fewer rows
        "scrollX": true,
        "paging": true,
        "info": true,
        "stateSave": true,
        "sDom": "<'dt-panelmenu  clearfix'<'col-sm-8'l><'col-sm-4 text-right'f>>" +
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
                      "title": 'Chart Setting',
                      "extend": 'excelHtml5',
                      "exportOptions": {
                        "columns": ':not(.notexport)',
                        "orthogonal": 'export'
                      }
                  },
                  {
                      "text": 'CSV',
                      "title": 'Chart Setting',
                      "extend": 'csvHtml5',
                      "exportOptions": {
                        "columns": ':not(.notexport)',
                        "orthogonal": 'export'
                      }
                  },
                  {
                      "text": 'PDF',
                      "title": 'Chart Setting',
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
function getColumns(nModule){

  return new Promise(function(resolve, reject){
      $("#xAxis").html("");
      $("#xAxis").selectpicker('refresh');
      $("#yAxis").html("");
      $("#yAxis").selectpicker('refresh');
      $.ajax({
            type: "POST",
            url: STEP_root+'api/createColumn.php',
            dataType:'json',
            data: {'tablename':nModule}, // serializes the form's elements.
            success: function(data)
            {

              if(data != null && data['data']!=null){
                $.each( data['data'], function( key, value ) {
                  $("#xAxis").append("<option value='"+value['id']+"' >"+value['value']+"</option>");
                  $("#yAxis").append("<option value='"+value['id']+"' >"+value['value']+"</option>");
                });
              }

              $("#xAxis").val('default');
              $("#xAxis").selectpicker('refresh');

              $("#yAxis").val('default');
              $("#yAxis").selectpicker('refresh');
                resolve(true);
              },error:function (jqXHR, textStatus, errorThrown) {
                reject(true);
                    // formatErrorMessage(jqXHR, errorThrown);
                    // console.log(textStatus+" // "+jqXHR+" // "+ errorThrown);
              }
              
          });
  
    });
  }


 $( document ).on( "change", "[id=module],[id=charttype]", function(e) {
        // prevent default action
        e.preventDefault();
            var charttype = $("#charttype").val();
            var tblname = $("#module").val();

            $("#xAxis").html("");
            $("#xAxis").selectpicker('refresh');
            $("#yAxis").html("");
            $("#yAxis").selectpicker('refresh');
            if(charttype==""){
               $.alert({
                      title: 'Information',
                      content: "Please select chart type.",
                      type: 'blue',
                      typeAnimated: true
                  });
            }else if(tblname==""){
               $.alert({
                      title: 'Information',
                      content: "Please select module.",
                      type: 'blue',
                      typeAnimated: true
                  });
            }else{
              $.ajax({
                  type: "POST",
                  url: STEP_root+'api/createColumn.php',
                  dataType:'json',
                  data: {'tablename':tblname,'charttype':charttype}, // serializes the form's elements.
                  success: function(data)
                {

                    if(data != null && data['data']!=null){
                      $.each( data['data'], function( key, value ) {
                        $("#xAxis").append("<option value='"+value['id']+"' >"+value['value']+"</option>");
                        $("#yAxis").append("<option value='"+value['id']+"' >"+value['value']+"</option>");
                      });
                    }

                  $("#xAxis").selectpicker('refresh');
                  $("#yAxis").selectpicker('refresh');
                  if(charttype == "Pie"){
                      $("#yaxisdiv").removeClass("hidden");
                      $("#caltypediv").removeClass("hidden");
                      $("#xaxisdiv").addClass("hidden");
                  }else if(charttype == "Column" || charttype == "Line"){
                      $("#yaxisdiv").removeClass("hidden");
                      $("#xaxisdiv").removeClass("hidden");
                      $("#caltypediv").addClass("hidden");
                  }else {
                      $("#yaxisdiv").addClass("hidden");
                      $("#xaxisdiv").addClass("hidden");
                      $("#caltypediv").addClass("hidden");
                  }
                },error:function (jqXHR, textStatus, errorThrown) {
                    formatErrorMessage(jqXHR, errorThrown);
                    // console.log(textStatus+" // "+jqXHR+" // "+ errorThrown);
                }
                    
              });
            } 
      });

      /** delete chart */
 $( document ).on( "click", "[id^=deleteChart]", function(e) {
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
                             data:  {"id":currentId,'formtype':'Chart','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, // serializes the form's elements.
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

/** edit chart */
    $( document ).on( "click", "[id^=editChart]", function(e) {
        // prevent default action
        e.preventDefault();

        $("#xAxis").html("");
        $("#xAxis").val('default');
        $("#xAxis").selectpicker('refresh');
        $("#yAxis").html("");   
         $("#yAxis").val('default');
        $("#yAxis").selectpicker('refresh');
          var currentId = $(this).attr("data-id");
          if(currentId != "0"){
               $.ajax({
                   type: "POST",
                   url: STEP_root+'api/getBasicmaster.php',
                   dataType:'json',
                   data:  {"id":currentId,'formtype':'Chart','enteredby':localStorage.getItem("id"),'accountId':localStorage.getItem("accountId"),'userempid':localStorage.getItem("userempid")}, // serializes the form's elements.
                   success: function(data)
                   {
                    if(data !=null){
                        if(data['id'] !=null){
                            $("#chartId").val(data['id']);
                            $("#charttitle").val(data['charttitle']);
                            $("#chartsubtitle").val(data['chartsubtitle']);
                            $("#charttype").val(data['charttype']);
                            $("#activestatus").val(data['activestatus']);
                            $("#module").val(data['module']);
                            $("#caltype").val(data['caltype']);
                            
                            getColumns(data['module']).then(function(){
                                 // Hurray! All done!
                                $("#xAxis").val(data['xAxis']);
                                $("#xAxis").selectpicker('refresh');
                                $("#yAxis").val(data['yAxis']);
                                $("#yAxis").selectpicker('refresh');

                                if(data['charttype'] == "Pie"){
                                  $("#yaxisdiv").removeClass("hidden");
                                  $("#caltypediv").removeClass("hidden");
                                  $("#xaxisdiv").addClass("hidden");
                              }else if(data['charttype'] == "Column" || data['charttype'] == "Line"){
                                  $("#yaxisdiv").removeClass("hidden");
                                  $("#xaxisdiv").removeClass("hidden");
                                  $("#caltypediv").addClass("hidden");
                              }else {
                                  $("#yaxisdiv").addClass("hidden");
                                  $("#xaxisdiv").addClass("hidden");
                                  $("#caltypediv").addClass("hidden");
                              }
                           
                            });

                        }
                    }

                   },error:function (jqXHR, textStatus, errorThrown) {
                          formatErrorMessage(jqXHR, errorThrown);
                    }
               });
           }else{

           }
        });

$('form[id="chartform"]').validate({

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
    "charttitle": 'required',
    "charttype": 'required',
    "module": 'required',
    "xAxis": {
      required:  function(element) {return ($("#charttype").val()=="Column" || $("#charttype").val()=="Line");}
    },
    "yAxis": 'required',
    "caltype": {
      required:  function(element) {return ($("#charttype").val()=="Pie");}
    }
  },
  messages: {
    "charttitle": 'Please enter title',
    "chartsubtitle": 'Please enter subtitle',
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     form_data.append("enteredby",localStorage.getItem("id"));
     form_data.append("accountId",localStorage.getItem("accountId"));
     form_data.append("userempid",localStorage.getItem("userempid"));
     $.ajax({
        url: STEP_root+"api/saveChart.php", //The url where the server req would we made.
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
   var mymodal = $('#chartmodal');
    mymodal.modal('hide');
    $(form)[0].reset();
    reloadTbl();
}
function reloadTbl(){

    $("#xAxis").html("");
    $("#xAxis").val('default');
    $("#xAxis").selectpicker('refresh');
    $("#yAxis").html("");   
    $("#yAxis").val('default');
    $("#yAxis").selectpicker('refresh');
    chartTable.ajax.reload( null, false );
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
         $('#chartTbl tbody input[type="checkbox"]:not(:checked)').trigger('click');
      } else {
         $('#chartTbl tbody input[type="checkbox"]:checked').trigger('click');
      }

      // Prevent click event from propagating to parent
      e.stopPropagation();
   });  
   
   // Handle click on checkbox to set state of "Select all" control
   $('#chartTbl tbody').on('change', 'input[type="checkbox"]', function(){ 
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
              data: "type="+nType+"&&ids="+bulkcheckboxarr+"&&formtype=Chart", //The variables which are going.
              dataType: "html", //Return data type (what we expect).
              //This is the function which will be called if ajax call is successful.
              success: function(data)
              { 
                  chartTable.ajax.reload( null, false );
                  $('#select_all').attr("checked",false);
                  bulkcheckboxarr.length = 0;
              }
          });
        }
   
      });

$('#chartmodal').on('hidden.bs.modal', function () {
  $('#chartform').trigger("reset");
});
})(jQuery);
