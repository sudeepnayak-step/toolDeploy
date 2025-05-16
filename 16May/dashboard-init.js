var bulkcheckboxarr = new Array();

var filterReleaseoption = "";
var filterActivityoption = "";
var filterTestsuiteoption = "";
var filterDefectReleaseoption = "";
var filterDefectActivityOption = "";

var imgexts = new Array('gif', 'png', 'jpg','jpeg');
var docexts = new Array('docx','doc');
var csvexts = new Array('csv');
var excelexts = new Array('xls','xlsx');

Highcharts.setOptions({
 colors: ['#5bc0de', '#f0ad4e', '#5cb85c', '#0275d8', '#06f7fa', '#6ddce8', '#04446c', '#6872ac','#5c4d82','#8bc0b9']
});
  Highcharts.setOptions({lang: {noData: "No data to display"}});

(function ($) {
$("#projectId").html("");
$("#projectId").selectpicker('refresh');

$("#releaseId").html("");
$("#releaseId").selectpicker('refresh');

$("#activityId").html("");
$("#activityId").selectpicker('refresh');

$("#testsuiteId").html("");
$("#testsuiteId").selectpicker('refresh');

$("#defectprojectId").html("");
$("#defectprojectId").selectpicker('refresh');

$("#defectreleaseId").html("");
$("#defectreleaseId").selectpicker('refresh');

$("#defectactivityId").html("");
$("#defectactivityId").selectpicker('refresh');

$("#defectstatusId").html("");
$("#defectstatusId").selectpicker('refresh');

// DSR
$("#dsrprojectId").html("");
$("#dsrprojectId").selectpicker('refresh');

$("#dsrreleaseId").html("");
$("#dsrreleaseId").selectpicker('refresh');

$("#dsractivityId").html("");
$("#dsractivityId").selectpicker('refresh');

/**
 * Fetches the active projects and populates the project-related dropdowns.
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
                  $("#defectprojectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                  $("#dsrprojectId").append("<option value='"+value['id']+"' >"+value['projectname']+"</option>");
                });
              }

              $("#projectId").selectpicker('refresh');
              $("#defectprojectId").selectpicker('refresh');
              $("#dsrprojectId").selectpicker('refresh');
              resolve(true);
            },error:function (jqXHR, textStatus, errorThrown) {
              resolve(true);
            }
        });
  
    });
};

/**
 * Fetches defect status data from the server and populates the defect status dropdown.
 */
var p2 = function(){
    return new Promise(function(resolve, reject){        
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'DefectStatus'}, 
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#defectstatusId").append("<option value='"+value['id']+"' >"+value['name']+"</option>");
              });
            }

            $("#defectstatusId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};

/**
 * Fetches data from the server for populating the dashboard.
 * The data fetched includes the total number of test execution, total number of projects, total number of raised defects, and total number of milestones.
 * The data is displayed in the respective fields on the dashboard.
 */
var p3 = function(){
    return new Promise(function(resolve, reject){
        $.ajax({
          type: "POST",
          url: STEP_root+'api/dashboard/gettotcount.php',
          dataType:'json',
          success: function(data)
          {
            $("#tottestexecute").html(data['tottestexecute']);
            $("#totalprojcount").html(data['totalprojcount']);
            $("#raiseddefectcount").html(data['raiseddefectcount']);
            $("#totmilestone").html(data['totmilestone']);
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};


/**
 * Fetches release data from the server and populates the release-related dropdowns.
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
                $("#releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
                $("#defectreleaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");

                  filterReleaseoption += "<option value='"+value['id']+"' >"+value['releaseId']+"</option>";
                  filterDefectReleaseoption += "<option value='"+value['id']+"' >"+value['releaseId']+"</option>";
              
              });
            }

            $("#releaseId").selectpicker('refresh');
            $("#defectreleaseId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};

/**
 * Fetches all activity data from the server and populates the activity-related dropdowns.
 */
var p5 = function(){
    return new Promise(function(resolve, reject){
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'allFilterActivity'}, // serializes the form's elements.
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#activityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
                filterActivityoption += "<option value='"+value['id']+"' >"+value['activityId']+"</option>";
                filterDefectActivityOption += "<option value='"+value['id']+"' >"+value['activityId']+"</option>";
              
              });
            }

            $("#activityId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};

/**
 * Fetches all testsuite data from the server and populates the testsuite-related dropdowns.
 */
var p6 = function(){
    return new Promise(function(resolve, reject){
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'allFilterTestsuite'}, 
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                $("#testsuiteId").append("<option value='"+value['id']+"' >"+value['testsuiteId']+"</option>");
                filterTestsuiteoption += "<option value='"+value['id']+"' >"+value['testsuiteId']+"</option>";
              });
            }

            $("#testsuiteId").selectpicker('refresh');
            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};

/**
 * Fetches defect count data from the server and updates the respective fields on the dashboard.
 * The data fetched includes total defects, open defects, closed defects, and critical defects.
 * Returns a promise that resolves to true upon successful data retrieval or error.
 */

var defectcount = function(){
  var nProjectId = ($("#defectprojectId").val() != null ? $("#defectprojectId").val() : '');
  var nReleaseId = ($("#defectreleaseId").val() != null ? $("#defectreleaseId").val() : '');
  var nActivityId = ($("#defectactivityId").val() != null ? $("#defectactivityId").val() : '');
  var nStatusId = ($("#defectstatusId").val() != null ? $("#defectstatusId").val() : '');
  var nDate = $("#defectdate").val();

  return new Promise(function(resolve, reject){
      $.ajax({
        type: "POST",
        url: STEP_root+'api/dashboard/getdefectcount.php',
        data: {'projectId':nProjectId,'releaseId':nReleaseId,'activityId':nActivityId,'defectstatusId':nStatusId,'defectdate':nDate},
        dataType:'json',
        success: function(data)
        {
          $("#total_defects").html(data['total_defects']);
          $("#open_defects").html(data['open_defects']);
          $("#closed_defects").html(data['closed_defects']);
          $("#critical_defects").html(data['critical_defects']);
          resolve(true);
        },error:function (jqXHR, textStatus, errorThrown) {
          resolve(true);
        }
    });

  });
};
var testcasecount = function(){
  var nProjectId = ($("#projectId").val() != null ? $("#projectId").val() : '');
  var nReleaseId = ($("#releaseId").val() != null ? $("#releaseId").val() : '');
  
  return new Promise(function(resolve, reject){
      $.ajax({
        type: "POST",
        url: STEP_root+'api/dashboard/gettestcasecount.php',
	data: {'projectId':nProjectId,'releaseId':nReleaseId},
        dataType:'json',
        success: function(data)
        {
          $("#total_testcase").html(data['total_testcase']);
	  $("#passtc").html(data['passtc']);
	  $("#failedtc").html(data['failedtc']);
	  $("#blocktc").html(data['blocktc']);
          resolve(true);
        },error:function (jqXHR, textStatus, errorThrown) {
          resolve(true);
        }
    });

  });
};
// p1().then(p2).then(p3).then(p4).then(p5).then(p6).then(function(){
//      // All done!
// });
  /** initialization of project table */
  var projTable =  $('#projectTbl').DataTable({
    "ajax": STEP_root+"api/getallProjects.php",
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
            "orderable": true,
            "visible": true,
            'targets': [1],
              "class": "text-left",
            "render": function ( data, type, row ) {
                return data;
            }
        }, 
      {
            "orderable": false,
            'targets': [4],
              "class": "text-left",
            "render": function ( data, type, row ) {
              var nArr = (data != null && data !="") ? data.split(",") : [];
              var nMembers = "";
              var nCount = 0;
              console.log(nArr);
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
              return nMembers;
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
                return '<span class="badge  '+badgecolor+'">'+data+'</span>';
            }           
        },
        {
          "orderable": false,
          "visible": false,
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
        "visible": false,
          "targets": [-2],
          "class":"text-left",
          render: function ( data, type, row ) {
              var badgecolor = (data != "Active" ? "badge-danger" : "badge-success");
              return '<span class="badge badge-pill '+badgecolor+'">'+data+'</span>';
          }           
      },
      {"orderable": true,"targets":[2,3,5,6,7,8,9],"class":"text-left"} , 
      {"visible": false,"targets":[2,4,6,7,8,9,12,13,14,15,16,17],"class":"text-left"}  
    ],
    scrollY: '500px',       // Set your desired height
    scrollCollapse: true,   // Collapse the table height if fewer rows
    "scrollX": true,
    "paging": false,
    "info": false,
    buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
  });


  $( document ).on( "change", "[id=projectId]", function(e) {
      // prevent default action
      e.preventDefault();
      var nProjectId = this.value;
      getRelease(nProjectId,'TestExecution');

      //getActivity(nProjectId,'','TestExecution');
      getTestsuite(nProjectId,'','','TestExecution');
      releaseTable.ajax.reload( null, false );
      releaseTable.columns.adjust().draw();
      if(nProjectId !=null && nProjectId !=""){
  	   if($(".executionfilter").hasClass("hidden"))$(".executionfilter").removeClass("hidden");
	   if(!$("#executionnotificationdiv").hasClass("hidden"))$("#executionnotificationdiv").addClass("hidden");
	  
		 getTestexecutionchart();
	  
      }else{
	resetexecutionfilter();
      } 
	testcasecount();
});
$( document ).on( "change", "[id=releaseId]", function(e) {
    // prevent default action
    e.preventDefault();
    var nReleaseId = this.value;
    var nPorjectId = $("#projectId").val();
    //getActivity(nPorjectId,nReleaseId,'TestExecution');
    getTestsuite(nPorjectId,nReleaseId,'','TestExecution');
    releaseTable.ajax.reload( null, false );
    getTestexecutionchart();
        testcasecount();
});

 $( document ).on( "change", "[id=activityId]", function(e) {
      // prevent default action
      e.preventDefault();
      releaseTable.ajax.reload( null, false );
      getTestexecutionchart();
        testcasecount();
});

 $( document ).on( "change", "[id=testsuiteId],[id=testcasedate]", function(e) {
      // prevent default action
      e.preventDefault();
      releaseTable.ajax.reload( null, false );
      getTestexecutionchart();
        testcasecount();
});
 
function resetdefectfilter(){
$("#DefectChartdiv").html('<div class="col-sm-6"  id="chartAgeing" style="height: 370px; padding-bottom:  20px; " ></div>');
if(!$(".defectfilter").hasClass("hidden"))$(".defectfilter").addClass("hidden");
if($("#defectnotificationdiv").hasClass("hidden"))$("#defectnotificationdiv").removeClass("hidden");
}
function resetexecutionfilter(){
$("#testexecutionChartdiv").html('');
if(!$(".executionfilter").hasClass("hidden"))$(".executionfilter").addClass("hidden");
if($("#executionnotificationdiv").hasClass("hidden"))$("#executionnotificationdiv").removeClass("hidden");
}
 /// defect tab
$( document ).on( "change", "[id=defectprojectId]", function(e) {
    // prevent default action
    e.preventDefault();
    var nPorjectId = this.value;
    getRelease(nPorjectId,'Defect');

    defectTable.ajax.reload( null, false );
    if(nPorjectId !=null && nPorjectId !=""){
     if($(".defectfilter").hasClass("hidden"))$(".defectfilter").removeClass("hidden");
     if(!$("#defectnotificationdiv").hasClass("hidden"))$("#defectnotificationdiv").addClass("hidden");
     getdefectchart();
    }else{
	resetdefectfilter();
    }
    defectcount();
});
 $( document ).on( "change", "[id=defectreleaseId]", function(e) {
    // prevent default action
    e.preventDefault();
    var nReleaseId = this.value;
    var nPorjectId = $("#defectprojectId").val();

    //getActivity(nPorjectId,nReleaseId,'Defect');

    defectTable.ajax.reload( null, false );
    getdefectchart();
    defectcount();
});

$( document ).on( "change", "[id=defectactivityId],[id=defectstatusId]", function(e) {
    // prevent default action
    e.preventDefault();

    defectTable.ajax.reload( null, false );
    getdefectchart();
    defectcount();
});

$( document ).on( "change", "[id=defectdate]", function(e) {
    // prevent default action
    e.preventDefault();

    defectTable.ajax.reload( null, false );
    getdefectchart();
    defectcount();
});
 

/**
 * This function will get the release dropdown based on the projectid and type.
 */
function getRelease(nProjectId,nmType){

  return new Promise(function(resolve, reject){
      if(nmType == "TestExecution"){
          nProjectId = $("#projectId").val();
          $("#releaseId").html('');
          $("#releaseId").selectpicker('refresh');
      }else if(nmType == "Defect"){
          nProjectId = $("#defectprojectId").val();
          $("#defectreleaseId").html('');
          $("#defectreleaseId").selectpicker('refresh');
      }else if(nmType == "DSR"){
          nProjectId = $("#dsrprojectId").val();
          $("#dsrreleaseId").html('');
          $("#dsrreleaseId").selectpicker('refresh');
      }
       if(nProjectId!= null && nProjectId !=""){             
	      $.ajax({
	        type: "POST",
	        url: STEP_root+'api/getDropdown.php',
	        dataType:'json',
	        data:  {'formtype':'allFilterRelease',"projectId":nProjectId}, 
	        success: function(data)
	        {
	          if(data != null && data['data']!=null){
	            $.each( data['data'], function( key, value ) {
	              if(nmType == "TestExecution"){
	                $("#releaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
	              }else if(nmType == "Defect"){
	                $("#defectreleaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
	              }else if(nmType == "DSR"){
	                $("#dsrreleaseId").append("<option value='"+value['id']+"' >"+value['releaseId']+"</option>");
	              }
	            });
	          }
	          if(nmType == "TestExecution"){
	            $("#releaseId").selectpicker('refresh');
	          }else if(nmType == "Defect"){
	            $("#defectreleaseId").selectpicker('refresh');
	          }else if(nmType == "DSR"){
	            $("#dsrreleaseId").selectpicker('refresh');
	          }
	          resolve(true);
	        }
	    });
  	}
  });

      
}


/**
 * This function will get the activity dropdown based on the projectid,releaseid and type.
 */
function getActivity(nProjectId,nReleaseID,nmType){

  return new Promise(function(resolve, reject){
    if(nmType == "TestExecution"){
        nProjectId = $("#projectId").val();
        nReleaseID = $("#releaseId").val();
        $("#activityId").html('');
        $("#activityId").selectpicker('refresh');
      }else if(nmType == "Defect"){
        nProjectId = $("#defectprojectId").val();
        nReleaseID = $("#defectreleaseId").val();
        $("#defectactivityId").html('');
        $("#defectactivityId").selectpicker('refresh');
      }else if(nmType == "DSR"){
        nProjectId = $("#dsrprojectId").val();
        nReleaseID = $("#dsrreleaseId").val();
        $("#dsractivityId").html('');
        $("#dsractivityId").selectpicker('refresh');
      }
      $.ajax({
        type: "POST",
        url: STEP_root+'api/getDropdown.php',
        dataType:'json',
        data:  {'formtype':'allFilterActivity',"projectId":nProjectId,"releaseId":nReleaseID,"type":nmType}, // serializes the form's elements.
        success: function(data)
        {
          if(data != null && data['data']!=null){
            $.each( data['data'], function( key, value ) {
              if(nmType == "TestExecution"){
                $("#activityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
              }else if(nmType == "Defect"){
                $("#defectactivityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
              } else if(nmType == "DSR"){
                $("#dsractivityId").append("<option value='"+value['id']+"' >"+value['activityId']+"</option>");
              }
            });
          }

          if(nmType == "TestExecution"){
            $("#activityId").selectpicker('refresh');
          }else if(nmType == "Defect"){
          
            $("#defectactivityId").selectpicker('refresh');
          }else if(nmType == "DSR"){
          
            $("#dsractivityId").selectpicker('refresh');
          }
          resolve(true);
        }
    });
  
  });
}


/**
 * Fetches testsuite data from the server and populates the testsuite-related dropdown.
 */
function getTestsuite(nProjectId,nReleaseID,nActivityId,nmType){

  return new Promise(function(resolve, reject){
      if(nmType == "TestExecution"){
          nProjectId = $("#projectId").val();
          nReleaseID = $("#releaseId").val();
          nActivityId = $("#activityId").val();
          $("#testsuiteId").html('');
          $("#testsuiteId").selectpicker('refresh');
        }
       if(nReleaseID !=null && nReleaseID !=""){
        $.ajax({
          type: "POST",
          url: STEP_root+'api/getDropdown.php',
          dataType:'json',
          data:  {'formtype':'allFilterTestsuite',"projectId":nProjectId,"releaseId":nReleaseID,"activityId":nActivityId}, // serializes the form's elements.
          success: function(data)
          {
            if(data != null && data['data']!=null){
              $.each( data['data'], function( key, value ) {
                if(nmType == "TestExecution"){
                  $("#testsuiteId").append("<option value='"+value['id']+"' >"+value['testsuiteId']+"</option>");
                }
              });
            }

            if(nmType == "TestExecution"){
              $("#testsuiteId").selectpicker('refresh');
            }
            resolve(true);
          }
        });
  }
    });
  }

  /** initialize the test execution summary table */
  var releaseTable =  $('#testexesummaryTbl').DataTable({
	autoWidth: false,
    "ajax": {
        "url": STEP_root+"api/dashboard/getTestexecutionsummary.php",
        "data": function (d) {
            var nProjectId = ($("#projectId").val() != null ? $("#projectId").val() : '');
            var nReleaseId = ($("#releaseId").val() != null ? $("#releaseId").val() : '');
            var nActivityId = ($("#activityId").val() != null ? $("#activityId").val() : '');
            var nTestsuiteId = ($("#testsuiteId").val() != null ? $("#testsuiteId").val() : '');
            var nDate = $("#testcasedate").val();
            return "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&testsuiteId="+nTestsuiteId+"&&testcasedate="+nDate;
 
        }
      },
        "columnDefs": [

          {"orderable": true,
              "targets": 0,
              "class":"text-left",
          render: function ( data, type, row ) {
          return (data !="" ? data : "-");
          }
        },
        {"orderable": false,"targets":[10,20],"class":"text-left",visible:false}  ,
        {"orderable": true,"targets":[1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21],"class":"text-left"}  
    ],
    scrollY: '500px',       // Set your desired height
    scrollCollapse: true,   // Collapse the table height if fewer rows
    "scrollX": true,
    "paging": false,
    "info": false,
            
    "footerCallback": function ( row, data, start, end, display ) {
        var api = this.api(), data;

        // Remove the formatting to get integer data for summation
        var intVal = function ( i ) {
            return typeof i === 'string' ?
                i.replace(/[\$,]/g, '')*1 :
                typeof i === 'number' ?
                    i : 0;
        };
        var tottestexecute = 0,totexecutabletc = 0,passcount = 0,failcount= 0,inprogresscount = 0,noruncount = 0,blockcount = 0,holdcount = 0,deferredcount = 0,nacount = 0;
              
        var  fcolumns = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        for (var i = 0; i < fcolumns.length; i++) { 
          var  total = api
            .column( fcolumns[i] )
            .data()
            .reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );
          // Update footer
          $( api.column( fcolumns[i] ).footer() ).html(parseFloat(total.toFixed(2)) );
          if(fcolumns[i]==2){ totexecutabletc = total.toFixed(2);}
          else if(fcolumns[i]==3){ tottestexecute = total.toFixed(2);}
          else if(fcolumns[i]==4){ 
            var nextSeqNum = api
                        .column(fcolumns[i])
                        .data()
                        .sort(function(a,b){ return a-b; })
                        .reverse()[0];
            $( api.column( fcolumns[i] ).footer() ).html(nextSeqNum);
          }
          else if(fcolumns[i]==5){ passcount = total.toFixed(2);}
          else if(fcolumns[i]==6){ failcount = total.toFixed(2);}
          else if(fcolumns[i]==7){ inprogresscount = total.toFixed(2);}
          else if(fcolumns[i]==8){ noruncount = total.toFixed(2);}
          else if(fcolumns[i]==9){ blockcount = total.toFixed(2);}
          else if(fcolumns[i]==10){ deferredcount = total.toFixed(2);}
          else if(fcolumns[i]==11){ nacount = total.toFixed(2);}
          else if(fcolumns[i]==12){ holdcount = total.toFixed(2);}
          else if(fcolumns[i]==13){ 
            var exepercentage = (totexecutabletc > tottestexecute ? (tottestexecute/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(exepercentage.toFixed(2)) );

          }else if(fcolumns[i]==14){ 
            var passpercentage = (totexecutabletc > passcount ? (passcount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(passpercentage.toFixed(2)) );

          }else if(fcolumns[i]==15){ 
            var failpercentage = (totexecutabletc > failcount ? (failcount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(((failcount/totexecutabletc)*100).toFixed(2)) );

          }else if(fcolumns[i]==16){ 
            var inprogresspercentage = (totexecutabletc > inprogresscount ? (inprogresscount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(inprogresspercentage.toFixed(2)) );

          }else if(fcolumns[i]==17){ 
            var norunpercentage = (totexecutabletc > noruncount ? (noruncount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(norunpercentage.toFixed(2)) );

          }else if(fcolumns[i]==18){ 
            var blockpercentage = (totexecutabletc > blockcount ? (blockcount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(blockpercentage.toFixed(2)) );

          }else if(fcolumns[i]==19){ 
            var holdpercentage = (totexecutabletc > holdcount ? (holdcount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(holdpercentage.toFixed(2)) );

          }else if(fcolumns[i]==20){ 
            var deferredpercentage = (totexecutabletc > deferredcount ? (deferredcount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(deferredpercentage.toFixed(2)) );

          }else if(fcolumns[i]==21){ 
            var napercentage = (totexecutabletc > nacount ? (nacount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(napercentage.toFixed(2)) );

          }
      }
    },
    "stateSave": true,
    "sDom": "<'dt-panelmenu  clearfix'<'col-sm-8 text-left'B><'col-sm-4'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                "buttons": [
        {
            "extend": 'collection',
            "autoClose": 'true',
            "text":'<span style="padding-right:5px; float:left" >Test Execution Report</span>',
            "buttons": [
                {
                    "text": 'Excel',
                    "title": 'Test Execution Report',
                    "extend": 'excelHtml5',
                    "exportOptions": {
                      "columns": ':not(.notexport)',
                      "orthogonal": 'export'
                    }, footer: true
                },
                {
                    "text": 'CSV',
                    "title": 'Test Execution Report',
                    "extend": 'csvHtml5',
                    "exportOptions": {
                      "columns": ':not(.notexport)',
                      "orthogonal": 'export'
                    }, footer: true
                },
                {
                    "text": 'PDF',
                    "title": 'Test Execution Report',
                    "extend": 'pdfHtml5',
                    "orientation": 'landscape',
                    "pageSize": 'LEGAL',
                    "exportOptions": {
                      "columns": ':not(.notexport)',
                      "orthogonal": 'export'
                    }, footer: true,
                    customize: function ( doc ) {}
                },
            ]
        }
    ]
  });

/**  $("#testexesummaryTbl").wrap("<div class='scrolledTable'></div>");*/
releaseTable.columns.adjust().draw();

$('a[data-toggle="tab"]').on('shown.bs.tab', function () {
    releaseTable.columns.adjust().draw();
    dsrtestexesummaryTbl.columns.adjust().draw();
});
 /** releaseTable.columns.adjust().draw(false);*/
  /** initialize the defect table */
  var defectTable =  $('#topdefectTbl').DataTable({
    autoWidth: false,
    "ajax": {
        "url": STEP_root+"api/dashboard/getTopdefects.php",
        "type":"POST",
        "data": function (d) {
            var nProjectId = ($("#defectprojectId").val() != null ? $("#defectprojectId").val() : '');
            var nReleaseId = ($("#defectreleaseId").val() != null ? $("#defectreleaseId").val() : '');
            var nActivityId = ($("#defectactivityId").val() != null ? $("#defectactivityId").val() : '');
            var nStatusId = ($("#defectstatusId").val() != null ? $("#defectstatusId").val() : '');
            var nDate = $("#defectdate").val();
            return "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&defectstatusId="+nStatusId+"&&defectdate="+nDate;
 
        }
      },
      "columnDefs": [
        {"orderable": false,"targets":[0],"class":"text-center",visible:false}  ,
        {
                "orderable": true,
                'targets': [1],
                 "class": "text-center",
                "render": function ( data, type, row ) {
                  return '<a href="JavaScript:void(0)" id="editDefect'+row[0]+'" data-id="'+row[0]+'"  data-defectId="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#defectdetailsmodal" ><b>'+
                          data+
                         '</b> </a>';
                }
            },
        {
        "orderable": true,"targets":[2],"class":"text-center wrap-text", "width": "300px",
         render: renderDescriptionColumn
        },
        {"orderable": true,
          "targets": 3,
          "class":"text-center",
          render: function ( data, type, row ) {
          return (data !="" ? '<span class="badge  badge-default "><b>'+data+'</b></span> ' : "-");
          }
        },
        {"orderable": true,"targets":[1,2,3,4,5,6,7,8,9],"class":"text-center"}  ,
        {"visible": false,"targets":[5,6,7,8],"class":"text-center"}  
      ],
      "pageLength": 25,
      "searching": false,
      "paging": true,
      "info": false,
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
      "drawCallback": function (settings) { 
          $('[data-toggle="popover"]').popover();
      }
  });
      
  $("#topdefectTbl").wrap("<div class='scrolledTable'></div>");
  
$('form[id="filtertestcaseform"]').validate({

  onkeyup: function(element) {$(element).valid()},
  errorClass: "state-error",
  validClass: "state-success",
  errorElement: "em",
  rules: {
    "activityId": 'required',
    "projectId": 'required',
    "releaseId": 'required'
  },
  messages: {
    "activityId": 'Please enter acticity',
    "projectId": 'Please select project',
    "releaseId": 'Please select release'
  },

  submitHandler: function(form) {
     var form_data = new FormData($(form)[0]); 
     
      releaseTable.ajax.reload( null, false );
      getTestexecutionchart();
        testcasecount();
  }
});

function getchart(){
  var nProjectId = $("#projectId").val();
  var nReleaseId = $("#releaseId").val();
  var nActivityId = $("#activityId").val();
  var nDate = $("#testcasedate").val();
  var nData = "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&testcasedate="+nDate;

  $.getJSON(STEP_root+"api/dashboard/getTestexecutionchart.php?"+nData, function (chartresult) {
    Highcharts.chart('testexepie', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
          text: 'Test Execution'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.1f}%</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: false,
                  format: '<b>{point.name}</b>: {point.y:.1f} %'
              }
          }
      },
      series: [{
          name: 'Execution % ',
          data: chartresult['seriesdata']
      }]
    });
  });
}


/** this script get the dynamic projct chart and display it */
function getprojstatuschart(){
  var nFlag = 1;
  return new Promise(function (resolve, reject) {
    $.getJSON(STEP_root+"api/dashboard/getcustomProjectchart.php", function (chartresult) {
      let tasks = [];
      $.each(chartresult,function(k,v){

        // Async processing if needed
        let task = new Promise(function (res) {
          if (nFlag > 4){
            nFlag = 1
          }else{
          nFlag++;
          }
          var colDIv = '<div class="card  col-6" >'+
                '  <div class="card-header ">'+
                '      <strong>'+v['title']+'</strong>'+
                '      <small>'+(v['subtitle'] != "" ? '('+v['subtitle']+')' :"")+'</small>'+
                '  </div>'+
                '  <div class="card-body"><div  id="projectChart'+k+'" style="height: 370px;"></div></div>'+
              ' </div>';
            $("#ProjectChartdiv").append(colDIv);
          var chart_id = v['id'];

          var cType = (v['type'] =="Percentage" ? "%" : "");
          if(v['charttype'] == "Column" || v['charttype'] == "Line"){

            Highcharts.chart('projectChart'+k, {
                chart: {
                    type: v['charttype'].toLowerCase()
                },
                title: {
                    text: ""
                },
                subtitle: {
                    text: v['subtitle']
                },
                xAxis: {
                    categories: v['xaxis'],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },

                plotOptions: {
                  series: {
                    dataLabels: { 
                      enabled: false, 
                      inside: false,
                      overflow: 'none',
                      crop: true,
                      backgroundColor:'rgba(0,0,0,0.8)',
                      borderColor: 'rgba(0,0,0,0.9)',
                      color: 'rgba(255,255,255,0.75)',
                      borderWidth: .5,
                      borderRadius: 5,
                      y: -10,
                      style: {
                        fontFamily: 'Helvetica, sans-serif',
                        fontSize: '10px',
                        fontWeight: 'normal',
                        textShadow: 'none'
                      }
                    },
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                var cat_name = this.category;

                                $.ajax({
                                        type: "POST",
                                        url: STEP_root+"api/dashboard/projectchartInfo.php",
                                        data: {'chart_id':chart_id,'xVal':cat_name}, 
                                        success: function(data)
                                        {
                                        $("#exampleModalLongTitle").html(v['title']);
                                        $("#modelTablebody").html(data);

                                        var mymodal = $('#exampleModalCenter');
                                        mymodal.modal('show');
                                        $('#projectinfotbl').DataTable({
                                          "pageLength":5,
                                          "lengthChange": false,
                                          "paging":true,
                                          "info":true,
                                          "searching":false,
                                        } );
                                        $("#projectinfotbl").wrap("<div class='scrolledTable'></div>");
                                      }
                                  });
                              }
                          }
                      }
                  }
                },
                series: v['seriesdata']
            });

          }else if(v['charttype'] == "Pie"){

            Highcharts.chart('projectChart'+k, {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie'
              },
              title: {
                  text: ""
              },
              tooltip: {
                  pointFormat: '{series.name}: <b>{point.y}'+cType+'</b>'
              },
              plotOptions: {
                  pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: false,
                          connectorShape: 'fixedOffset',
                          format: '<b>{point.name}</b>: {point.y}'+cType
                      },
                      showInLegend: true,
                      point: {
                          events: {
                              click: function () {
                                  console.log('chart_id: ' + chart_id + ', value: ' + this.name);
                                  var cat_name = this.name;
    
                                  $.ajax({
                                    type: "POST",
                                    url: STEP_root+"api/dashboard/projectchartInfo.php",
                                    data: {'chart_id':chart_id,'xVal':cat_name},
                                    success: function(data)
                                    {
                                        $("#exampleModalLongTitle").html(v['title']);
                                        $("#modelTablebody").html(data);

                                        var mymodal = $('#exampleModalCenter');
                                        mymodal.modal('show');
                                        $('#projectinfotbl').DataTable({
                                          "pageLength":5,
                                          "lengthChange": false,
                                          "paging":true,
                                          "info":true,
                                          "searching":false,
                                        } );
                                        $("#projectinfotbl").wrap("<div class='scrolledTable'></div>");
                                    }
                                    });
                              }
                          }
                      }
                    }
              },
              series: [{
                  name: '',
                  colorByPoint: true,
                  data: v['seriesdata']
              }]
            });
          }
          res();
        });

        tasks.push(task);  
      });

      Promise.all(tasks)
      .then(() => {
          console.log("getprojstatuschart chart processing complete");
          resolve();
      })
      .catch(err => {
          console.error("Error processing getprojstatuschart:", err);
          // reject(err);
          resolve();
      });
    });
  });
}

/** this script get the dynamic test execution chart and display it */
function getTestexecutionchart(){
    $("#testexecutionChartdiv").html("");
    var nProjectId = ($("#projectId").val() != null ? $("#projectId").val() : "");
    var nReleaseId = ($("#releaseId").val() != null ? $("#releaseId").val() : "");
    var nActivityId = ($("#activityId").val() != null ? $("#activityId").val() : "");
    var nDate = ($("#testcasedate").val() != null ? $("#testcasedate").val() : "");
    var nData = "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&testcasedate="+nDate;
  
    var nFlag = 1;
    return new Promise(function (resolve, reject) {
      $.getJSON(STEP_root+"api/dashboard/getcustomTestExecutionchart.php?"+nData, function (chartresult) {

        let tasks = [];
        $.each(chartresult,function(k,v){


          // Async processing if needed
          let task = new Promise(function (res) {

            if (nFlag > 4){
              nFlag = 1
            }else{
            nFlag++;
            }
            var colDIv = '<div class="card  col-6 " >'+
                  '  <div class="card-header ">'+
                  '      <strong>'+v['title']+'</strong>'+
                  '      <small>'+(v['subtitle'] != "" ? '('+v['subtitle']+')' :"")+'</small>'+
                  '  </div>'+
                  '  <div class="card-body"><div  id="executionChart'+k+'" style="height: 370px; "></div></div>'+
                ' </div>';
            $("#testexecutionChartdiv").append(colDIv);
            var chart_id = v['id'];

            var cType = (v['type'] =="Percentage" ? "%" : "");
            if(v['charttype'] == "Column" || v['charttype'] == "Line"){

                Highcharts.chart('executionChart'+k, {
                  chart: {
                      type:  v['charttype'].toLowerCase()
                  },
                  title: {
                      text: ""
                  },
                  subtitle: {
                      text: v['subtitle']
                  },
                  xAxis: {
                      categories: v['xaxis'],
                      crosshair: true
                  },
                  yAxis: {
                      min: 0,
                      title: {
                          text: ''
                      }
                  },
                  tooltip: {
                      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                          '<td style="padding:0"><b>{point.y}</b></td></tr>',
                      footerFormat: '</table>',
                      shared: true,
                      useHTML: true
                  },

                  plotOptions: {
                      series: {
                        dataLabels: { 
                          enabled: false, 
                          inside: false,
                          overflow: 'none',
                          crop: true,
                          // shape: 'callout',
                          backgroundColor:'rgba(0,0,0,0.8)',
                          borderColor: 'rgba(0,0,0,0.9)',
                          color: 'rgba(255,255,255,0.75)',
                          borderWidth: .5,
                          borderRadius: 5,
                          y: -10,
                          style: {
                            fontFamily: 'Helvetica, sans-serif',
                            fontSize: '10px',
                            fontWeight: 'normal',
                            textShadow: 'none'
                          }
                        },
                        cursor: 'pointer',
                        point: {
                            events: {
                              click: function () {
                                  var cat_name = this.category;
				 var nProjectId = ($("#projectId").val() != null ? $("#projectId").val() : '');
                                  var nReleaseId = ($("#releaseId").val() != null ? $("#releaseId").val() : '');
                                  var nActivityId = ($("#activityId").val() != null ? $("#activityId").val() : '');
                                  var nTestsuiteId = ($("#testsuiteId").val() != null ? $("#testsuiteId").val() : '');

                                  $.ajax({
                                    type: "POST",
                                    url: STEP_root+"api/dashboard/testexecutionchartInfo.php",
                                    data: {'chart_id':chart_id,'xVal':cat_name,'projectId':nProjectId,'releaseId':nReleaseId,'activityId':nActivityId,'testsuiteId':nTestsuiteId}, 
                                    success: function(data)
                                    {
                                        $("#exampleModalLongTitle").html(v['title']);
                                        $("#modelTablebody").html(data);

                                        var mymodal = $('#exampleModalCenter');
                                        mymodal.modal('show');
                                        $('#testcaseinfotbl').DataTable({
                                          "pageLength":5,
                                          "lengthChange": false,
                                          "paging":true,
                                          "info":true,
                                          "searching":false,
                                        } );
                                        $("#testcaseinfotbl").wrap("<div class='scrolledTable'></div>");
                                      }
                                    });
                                }
                              }
                        }
                      }
                  },
                  series: v['seriesdata']
                });

            }else if(v['charttype'] == "Pie"){

                Highcharts.chart('executionChart'+k, {
                  chart: {
                      plotBackgroundColor: null,
                      plotBorderWidth: null,
                      plotShadow: false,
                      type: 'pie'
                  },
                  title: {
                      text: ""
                  },
                  tooltip: {
                      pointFormat: '{series.name}: <b>{point.y}'+cType+'</b>'
                  },
                  plotOptions: {
                      pie: {
                          allowPointSelect: true,
                          cursor: 'pointer',
                          dataLabels: {
                              enabled: false,
                              connectorShape: 'fixedOffset',
                              format: '<b>{point.name}</b>: {point.y}'+cType
                          },
                          showInLegend: true,
                          point: {
                              events: {
                                  click: function () {
                                      var cat_name = this.name;
                                      var xId = this.id;
                                      
                                      
                                      var nProjectId = ($("#projectId").val() != null ? $("#projectId").val() : '');
                                      var nReleaseId = ($("#releaseId").val() != null ? $("#releaseId").val() : '');
                                      var nActivityId = ($("#activityId").val() != null ? $("#activityId").val() : '');
                                      var nTestsuiteId = ($("#testsuiteId").val() != null ? $("#testsuiteId").val() : '');
        
                                      $.ajax({
                                            type: "POST",
                                            url: STEP_root+"api/dashboard/testexecutionchartInfo.php",
                                            data: {'xId':xId,'chart_id':chart_id,'xVal':cat_name,'type':'Status','projectId':nProjectId,'releaseId':nReleaseId,'activityId':nActivityId,'testsuiteId':nTestsuiteId}, // serializes the form's elements.
                                            success: function(data)
                                            {
                                              $("#exampleModalLongTitle").html(v['title']);
                                              $("#modelTablebody").html(data);

                                              var mymodal = $('#exampleModalCenter');
                                              mymodal.modal('show');
                                              $('#testcaseinfotbl').DataTable({
                                                  "pageLength":5,
                                                "lengthChange": false,
                                                "paging":true,
                                                "info":true,
                                                "searching":false,
                                              } );
                                              $("#testcaseinfotbl").wrap("<div class='scrolledTable'></div>");
                                            }
                                        });
                                    }
                              }
                          }
                          
                      }
                  },
                  series: [{
                      name: '',
                      colorByPoint: true,
                      data: v['seriesdata']
                  }]
              });
            }
            res();
          });

          tasks.push(task);  
        });

        Promise.all(tasks)
        .then(() => {
            console.log("getprojstatuschart chart processing complete");
            resolve();
        })
        .catch(err => {
            console.error("Error processing getprojstatuschart:", err);
            // reject(err);
            resolve();
        });

      });
    });
}

// getprojstatuschart();
// getTestexecutionchart();
// getdefectchart();
p1().then(p2).then(p3)
//.then(p4).then(p5).then(p6)
.then(defectcount).then(getprojstatuschart)
.then(testcasecount)
/*.then(getTestexecutionchart)*/
/*.then(getdefectchart) */
.then(function(){
     // Hurray! All done!
     console.log("All done chart:)");
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
      
/** this script get custom  chart and defect agent chart */

  function getdefaultdefectchart(nData){

  return new Promise((resolve, reject) => {
 
  $.getJSON(STEP_root+"api/dashboard/getDefectchart.php?"+nData, function (chartresult) {
    
        // Defect Ageing
        Highcharts.chart('chartAgeing', {
          chart: {
              type: 'column'
          },
          title: {
              text: "", //'Defect Ageing Summary '
          },
          subtitle: {
              text: 'Modulewise'
          },
          xAxis: {
              categories: chartresult['categories'],
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Ageing in days'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y}</b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
                series: {
                  dataLabels: { 
                    enabled: false, 
                    inside: false,
                    overflow: 'none',
                    crop: true,
                    // shape: 'callout',
                    backgroundColor:'rgba(0,0,0,0.8)',
                    borderColor: 'rgba(0,0,0,0.9)',
                    color: 'rgba(255,255,255,0.75)',
                    borderWidth: .5,
                    borderRadius: 5,
                    y: -10,
                    style: {
                      fontFamily: 'Helvetica, sans-serif',
                      fontSize: '10px',
                      fontWeight: 'normal',
                      textShadow: 'none'
                    }
                  },
                  cursor: 'pointer',
                  point: {
                      events: {
                          click: function () {
                              var cat_name = this.category;
                              
                              
                              var nProjectId = ($("#defectprojectId").val() != null ? $("#defectprojectId").val() : '');
                              var nReleaseId = ($("#defectreleaseId").val() != null ? $("#defectreleaseId").val() : '');
                              var nActivityId = ($("#defectactivityId").val() != null ? $("#defectactivityId").val() : '');
                              var nStatusId = ($("#defectstatusId").val() != null ? $("#defectstatusId").val() : '');
                              var nDate = $("#defectdate").val();

                              $.ajax({
                                type: "POST",
                                url: STEP_root+"api/dashboard/defectchartInfo.php",
                                data: {'chart_id':'','xVal':cat_name,'type':'Ageing','projectId':nProjectId,'releaseId':nReleaseId,'activityId':nActivityId,'defectstatusId':nStatusId,'defectdate':nDate}, // serializes the form's elements.
                                success: function(data)
                                {
                                  $("#exampleModalLongTitle").html('Ageing in days');
                                  $("#modelTablebody").html(data);

                                  var mymodal = $('#exampleModalCenter');
                                  mymodal.modal('show');
                                  $('#defectinfotbl').DataTable({
                                    "pageLength":5,
                                    "scrollX": true,
                                    "lengthChange": false,
                                    "paging":true,
                                    "info":true,
                                    "searching":false,
                                  } );
                                  $("#defectinfotbl").wrap("<div class='scrolledTable'></div>");
                                }
                              });
                          }
                      }
                  }
                }
          },
          series: [{
              name: 'Status of defect reported',
              data: chartresult['Ageing']

          }]
        });
      });
      resolve();
    });
}
function getdefectchart(){
  var colDIv = '<div class="card col-6 " >'+
      '  <div class="card-header">'+
      '      <strong>Defect Ageing Summary</strong>'+
      '  </div>'+
      '  <div class="card-body"><div  id="chartAgeing" style="height: 370px; padding: 10dp;; margin-right: 10dp; background-color: #F1F1F1;"></div></div>'+
    ' </div>';
  $("#DefectChartdiv").html(colDIv);
  var nProjectId = ($("#defectprojectId").val() != null ? $("#defectprojectId").val() : "");
  var nReleaseId =  ($("#defectreleaseId").val() != null ? $("#defectreleaseId").val() : "");
  var nActivityId =  ($("#defectactivityId").val() != null ? $("#defectactivityId").val() : "");
  var nStatusId =  ($("#defectstatusId").val() != null ? $("#defectstatusId").val() : "");
  var nDate = $("#defectdate").val();
  var nData =  "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&defectstatusId="+nStatusId+"&&defectdate="+nDate;
  var nFlag = 1;

  return new Promise(function (resolve, reject) {
    $.getJSON(STEP_root+"api/dashboard/getcustomDefectchart.php?"+nData, function (chartresult) {
      let tasks = [];
      $.each(chartresult,function(k,v){


        // Async processing if needed
        let task = new Promise(function (res) {
            if (nFlag > 4){
              nFlag = 1
            }else{
               nFlag++;
            }
            
            var colDIv = '<div class="card col-6 " >'+
                            '  <div class="card-header ">'+
                            '      <strong>'+v['title']+'</strong>'+
                            '      <small>'+(v['subtitle'] != "" ? '('+v['subtitle']+')' :"")+'</small>'+
                            '  </div>'+
                            '  <div class="card-body"><div  id="defectChart'+k+'" style="height: 370px; padding: 10dp;; margin-right: 10dp; background-color: #F1F1F1;"></div></div>'+
                         ' </div>';

              $("#DefectChartdiv").append(colDIv);
              var chart_id = v['id'];
              var cType = (v['type'] =="Percentage" ? "%" : "");
              
              if(v['charttype'] == "Column" || v['charttype'] == "Line"){
                  Highcharts.chart('defectChart'+k, {
                      chart: {
                          type:  v['charttype'].toLowerCase()

                      },
                      title: {
                          text: ""
                      },
                      subtitle: {
                          text: v['subtitle']
                      },
                      xAxis: {
                          categories: v['xaxis'],
                          crosshair: true
                      },
                      yAxis: {
                          min: 0,
                          title: {
                              text: ''
                          }
                      },
                      tooltip: {
                          headerFormat: '<span style="font-size:10px">{point.name}</span><table>',
                          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                              '<td style="padding:0"><b>{point.y}</b></td></tr>',
                          footerFormat: '</table>',
                          shared: true,
                          useHTML: true
                      },

                      plotOptions: {
                          series: {
                            dataLabels: { 
                              enabled: false, 
                              inside: false,
                              overflow: 'none',
                              crop: true,
                              // shape: 'callout',
                              backgroundColor:'rgba(0,0,0,0.8)',
                              borderColor: 'rgba(0,0,0,0.9)',
                              color: 'rgba(255,255,255,0.75)',
                              borderWidth: .5,
                              borderRadius: 5,
                              y: -10,
                              style: {
                                fontFamily: 'Helvetica, sans-serif',
                                fontSize: '10px',
                                fontWeight: 'normal',
                                textShadow: 'none'
                              }
                            },
                            cursor: 'pointer',
                            point: {
                              events: {
                                  click: function () {
                                      console.log('Category: ' + this.category + ', value: ' + this.y+" | "+chart_id);
                                      var cat_name = this.category;
                                      var cat_status = (k == 2 ? 'Type' : 'Status');
                                      
                                      var nProjectId = ($("#defectprojectId").val() != null ? $("#defectprojectId").val() : '');
                                      var nReleaseId = ($("#defectreleaseId").val() != null ? $("#defectreleaseId").val() : '');
                                      var nActivityId = ($("#defectactivityId").val() != null ? $("#defectactivityId").val() : '');
                                      var nStatusId = ($("#defectstatusId").val() != null ? $("#defectstatusId").val() : '');
                                      var nDate = $("#defectdate").val();
                                      $.ajax({
                                          type: "POST",
                                          url: STEP_root+"api/dashboard/defectchartInfo.php",
                                          data: {'chart_id':chart_id,'xVal':cat_name,'type':cat_status,'projectId':nProjectId,'releaseId':nReleaseId,'activityId':nActivityId,'defectstatusId':nStatusId,'defectdate':nDate}, // serializes the form's elements.
                                          success: function(data)
                                          {
                                            $("#exampleModalLongTitle").html(v['title']);
                                            $("#modelTablebody").html(data);

                                            var mymodal = $('#exampleModalCenter');
                                            mymodal.modal('show');
                                            $('#defectinfotbl').DataTable({
                                              "pageLength":5,
                                              "scrollX": true,
                                              "lengthChange": false,
                                              "paging":true,
                                              "info":true,
                                              "searching":false,
                                            } );
                                            $("#defectinfotbl").wrap("<div class='scrolledTable'></div>");
                                          }
                                        });
                                    }
                                }
                            }
                          }
                      },
                      series: v['seriesdata']
                  });

              }else if(v['charttype'] == "Pie"){

                  Highcharts.chart('defectChart'+k, {
                      chart: {

                          plotBackgroundColor: null,
                          plotBorderWidth: null,
                          plotShadow: false,
                          type: 'pie'
                      },
                      title: {
                          text: ""
                      },
                      tooltip: {
                          pointFormat: '{series.name}: <b>{point.y}'+cType+'</b>'
                      },
                      plotOptions: {
                          pie: {
                              allowPointSelect: true,
                              cursor: 'pointer',
                              dataLabels: {
                                  enabled: false,
                                  connectorShape: 'fixedOffset',
                                  format: '<b>{point.name}</b>: {point.y}'+cType
                              },
                              showInLegend: true,
                              point: {
                                  events: {
                                      click: function () {
                                          var cat_name = this.name;
                                          var xId = this.id;
                                          
                                          
                                          var nProjectId = ($("#defectprojectId").val() != null ? $("#defectprojectId").val() : '');
                                          var nReleaseId = ($("#defectreleaseId").val() != null ? $("#defectreleaseId").val() : '');
                                          var nActivityId = ($("#defectactivityId").val() != null ? $("#defectactivityId").val() : '');
                                          var nStatusId = ($("#defectstatusId").val() != null ? $("#defectstatusId").val() : '');
                                          var nDate = $("#defectdate").val();
                                          $.ajax({
                                                type: "POST",
                                                url: STEP_root+"api/dashboard/defectchartInfo.php",
                                                data: {'xId':xId,'chart_id':chart_id,'xVal':cat_name,'type':'Status','projectId':nProjectId,'releaseId':nReleaseId,'activityId':nActivityId,'defectstatusId':nStatusId,'defectdate':nDate}, // serializes the form's elements.
                                                success: function(data)
                                                {
                                                $("#exampleModalLongTitle").html(v['title']);
                                                $("#modelTablebody").html(data);

                                                var mymodal = $('#exampleModalCenter');
                                                mymodal.modal('show');
                                                $('#defectinfotbl').DataTable({
                                                  "pageLength":5,
                                                  "lengthChange": false,
                                                  "paging":true,
                                                  "info":true,
                                                  "searching":false,
                                                } );
                                                $("#defectinfotbl").wrap("<div class='scrolledTable'></div>");
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        },
                      series: [{
                          name: '',
                          colorByPoint: true,
                          data: v['seriesdata']
                      }]
                    });
              }
              res();
        });

        tasks.push(task);
      });

      Promise.all(tasks)
      .then(() => {
          console.log("Project chart processing complete");
          // resolve();
          return getdefaultdefectchart(nData); // wait for chart to load
      })
      .catch(err => {
          console.error("Error processing chart:", err);
          // reject(err);
          
          return getdefaultdefectchart(nData); // wait for chart to load
      });

    });
  });


}


/** get the defect details based on id */
$( document ).on( "click", "[id^=editDefect]", function(e) {
    // prevent default action
    e.preventDefault();

    var temp_defectId = $(this).attr("data-defectId");
    if(temp_defectId != "0"){
          $.ajax({
              type: "POST",
              url: STEP_root+'api/getSingleedit.php',
              dataType:'json',
              data:  {"id":temp_defectId,"formtype":"Defectdetails"}, 
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


/** reset the test execution filter */
$( document ).on( "click", "#resetTestexeFilter", function(e) {
        // prevent default action
        e.preventDefault();
        

        $("#projectId").val('default');
        $("#projectId").selectpicker("refresh");

        $("#releaseId").html(filterReleaseoption);
        $("#releaseId").val('default');
        $("#releaseId").selectpicker('refresh');

        $("#activityId").html(filterActivityoption);
        $("#activityId").val('default');
        $("#activityId").selectpicker('refresh');

        $("#testsuiteId").html(filterTestsuiteoption);
        $("#testsuiteId").val('default');
        $("#testsuiteId").selectpicker('refresh');
        releaseTable.ajax.reload( null, false );
        //getTestexecutionchart();
	testcasecount();
        $("#testexecutionChartdiv").html('');
        resetexecutionfilter();
});

/*** reset the defect filter */
$( document ).on( "click", "#resetDefectFilter", function(e) {
    // prevent default action
    e.preventDefault();

    $("#defectprojectId").val('default');
    $("#defectprojectId").selectpicker("refresh");

    $("#defectreleaseId").html(filterDefectReleaseoption);
    $("#defectreleaseId").val('default');
    $("#defectreleaseId").selectpicker('refresh');

    $("#defectactivityId").html(filterDefectActivityOption);
    $("#defectactivityId").val('default');
    $("#defectactivityId").selectpicker('refresh');

    $("#defectdate").val($("#defectdate").attr("data-today"));

    defectTable.ajax.reload( null, false );
    //getdefectchart();
    defectcount();
    $("#DefectChartdiv").html('<div class="col-sm-6"  id="chartAgeing" style="height: 370px; padding-bottom:  20px; " ></div>');
    resetdefectfilter();
});



///////////// dsr 

/**
 * Fetches project information based on the selected project ID, release ID, and date,
 * and updates the dashboard summary and charts accordingly. Hides or shows relevant 
 * sections based on the response data. If data is available, it populates various 
 * fields and tables with the project, release, and date details. If no data is found, 
 * it displays a notification to select a project and release.
 */
var dsr1 = function(){
    return new Promise(function(resolve, reject){
        
        $("#dsrdiv").addClass("hidden");
        $("#notificationdiv").addClass("hidden");
        var nProjectId = ($("#dsrprojectId").val() != null ? $("#dsrprojectId").val() : '');
        var nReleaseId = ($("#dsrreleaseId").val() != null ? $("#dsrreleaseId").val() : '');
        var nDate = $("#dsrdate").val();
        
        $.ajax({
          type: "POST",
          url: STEP_root+'api/dashboard/getdsrprojinfo.php',
          dataType:'json',
          data:  {'projectId':nProjectId,'releaseId':nReleaseId,'dsrdate':nDate}, 
          success: function(data)
          {
            if(data != null && data['data']!=null  && data['data']!=""){
                var nProjdata = data['data'];
                $("#projectclient").val(nProjdata['projectclient']);
                $("#dsroverallsummery").val(nProjdata['overallsummary']);
                $("#dsrprodlosssummery").val(nProjdata['prodlosssummary']);
                $("#dstTbl1 tbody").append("<tr>"+
                  "<td>"+'Project'+" : <b>"+nProjdata['Project']+"</b></td>"+
                  "<td>"+'Release'+" : <b>"+nProjdata['Release']+"</b></td>"+
                  "<td>"+'Plan Start Date'+" : <b>"+nProjdata['Plan Start Date']+"</b></td>"+
                  "</tr>");
                $("#dstTbl1 tbody").append("<tr>"+
                  "<td>"+'Plan End Date'+" : <b>"+nProjdata['Plan End Date']+"</b></td>"+
                  "<td>"+'Revised Start Date'+" : <b>"+nProjdata['Revised Start Date']+"</b></td>"+
                  "<td>"+'Revised End Date'+" : <b>"+nProjdata['Revised End Date']+"</b></td>"+
                  "</tr>");
              dsrcalculateDays(data['data']['Revised Start Date'],data['data']['Revised End Date'],data['data']['Plan Start Date'],data['data']['Plan End Date']);

              $("#dsrdiv").removeClass("hidden");
              $("#notificationdiv").addClass("hidden");
              dsrriskissueTbl.ajax.reload( null, false );
              dsrtestplanTbl.ajax.reload( null, false );
              dsrtestexesummaryTbl.ajax.reload( null, false );
              dsrdefectTbl.ajax.reload( null, false );
              getDSRTestexecutionchart();
              getdsrdefectchart();
              dsrtestexesummaryTbl.columns.adjust().draw();
            }else{
              $("#notificationdiv").removeClass("hidden");
              $("#notificationdiv").html('<div class="col-4 alert alert-warning alert-dismissible fade show" role="alert">Please select project and release.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '  <span aria-hidden="true">&times;</span>'+
                '</button>'+
              ' </div>');
            }

            resolve(true);
          },error:function (jqXHR, textStatus, errorThrown) {
            resolve(true);
          }
      });
  
    });
};



function dsrcalculateDays(revisedstartdate,revisedenddate,planstartdate,planeddate){
    var nElapse = 0;
    if(revisedstartdate != "-"){
        var startdate = moment(revisedstartdate, 'DD/MM/YYYY').format('MM/DD/YYYY');
        var enddate =  moment().format('MM/DD/YYYY')
        nElapse = getBusinessDatesCount(new Date(startdate),new Date(enddate));
    }else if(planstartdate != "-"){
        var startdate = moment(planstartdate, 'DD/MM/YYYY').format('MM/DD/YYYY');
        var enddate =  moment().format('MM/DD/YYYY')
        nElapse = getBusinessDatesCount(new Date(startdate),new Date(enddate));
    }

    var nDuration = 0;
    if(revisedstartdate != "-" && revisedenddate != "-"){
        var startdate = moment(revisedstartdate, 'DD/MM/YYYY').format('MM/DD/YYYY');
        var enddate =  moment(revisedenddate, 'DD/MM/YYYY').format('MM/DD/YYYY');
        nDuration = getBusinessDatesCount(new Date(startdate),new Date(enddate));
    }else if(planstartdate != "-" && planeddate != "-"){
        var startdate = moment(planstartdate, 'DD/MM/YYYY').format('MM/DD/YYYY');
        var enddate =  moment(planeddate, 'DD/MM/YYYY').format('MM/DD/YYYY');
        nDuration = getBusinessDatesCount(new Date(startdate),new Date(enddate));
    }
    var remaingDays = (nDuration >nElapse ? (nDuration - nElapse) : 0);


    $("#dstTbl1 tbody").append("<tr>"+
      "<td>"+'Duration in Days'+" : <b>"+nDuration+"</b></td>"+
      "<td>"+'Elapsed Days'+" : <b>"+nElapse+"</b></td>"+
      "<td>"+'Remaining Days'+" : <b>"+remaingDays+"</b></td>"+
      "</tr>");

    var printcontent = document.getElementById("dstTbl1").outerHTML;
}
dsr1().then(function(){
     //  All done!

});

/** initialize risk issue table */
var dsrriskissueTbl =  $('#dsrriskissueTbl').DataTable({
  "ajax": {
    "url": STEP_root+"api/dashboard/getDSRriskissue.php",
    "data": function (d) {
    
        var nProjectId = ($("#dsrprojectId").val() != null ? $("#dsrprojectId").val() : '');
        var nReleaseId = ($("#dsrreleaseId").val() != null ? $("#dsrreleaseId").val() : '');
        var nActivityId = ($("#dsractivityId").val() != null ? $("#dsractivityId").val() : '');
        var nDate = $("#dsrdate").val();
        return "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&dsrdate="+nDate;

    }
  },
  "columnDefs": [
    
      {"orderable": true,
          "targets": 2,
          "class":"text-left",
      render: function ( data, type, row ) {
      return (data !="" ? '<span class="badge  badge-default "><b>'+data+'</b></span> ' : "-");
      }
    },
    {"orderable": true,"targets":[0,1,2,3,4,5,6,7,8],"class":"text-left"}  
  ],
  "searching": false,
  "paging": false,
  "info": false,
});

$("#dsrriskissueTbl").wrap("<div class='scrolledTable'></div>");

/** initialize dsr test plan table */
var dsrtestplanTbl =  $('#dsrtestplanTbl').DataTable({
  "ajax": {
      "url": STEP_root+"api/dashboard/getDSRtestplan.php",
      "data": function (d) {
      
          var nProjectId = ($("#dsrprojectId").val() != null ? $("#dsrprojectId").val() : '');
          var nReleaseId = ($("#dsrreleaseId").val() != null ? $("#dsrreleaseId").val() : '');
          var nActivityId = ($("#dsractivityId").val() != null ? $("#dsractivityId").val() : '');
          var nDate = $("#dsrdate").val();
          return "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&dsrdate="+nDate;

      }
    },
    "columnDefs": [
      
        {"orderable": false,
            "targets": 0,
            "class":"text-left",
        render: function ( data, type, row ) {
        return (data !="" ? '<span class="badge  badge-default "><b>'+data+'</b></span> ' : "-");
        }
      },
      {"orderable": false,"targets":[0,1,2,3,4,5,6,7,8,9],"class":"text-left"}  
    ],
    "searching": false,
    "paging": false,
    "info": false,
    "order": false,
  });

$("#dsrtestplanTbl").wrap("<div class='scrolledTable'></div>");

/** initialize defect table */
var dsrdefectTbl =  $('#dsrdefectTbl').DataTable({
    autoWidth: false,
    "language": {
      "emptyTable": "No defect available"
    },
    "ajax": {
        "url": STEP_root+"api/dashboard/getTopdefects.php",
        "type":"POST",
        "data": function (d) {
            var nProjectId = ($("#dsrprojectId").val() != null ? $("#dsrprojectId").val() : '');
            var nReleaseId = ($("#dsrreleaseId").val() != null ? $("#dsrreleaseId").val() : '');
            var nActivityId = ($("#dsractivityId").val() != null ? $("#dsractivityId").val() : '');
            var nDate = $("#dsrdate").val();
            return "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&defectdate="+nDate;
 
        }
      },
      "columnDefs": [
        {"orderable": false,"targets":[0],"class":"text-center",visible:false}  ,
        {
            "orderable": true,
            'targets': [1],
              "class": "text-left",
            "render": function ( data, type, row ) {
              return '<a href="JavaScript:void(0)" id="editDefect'+row[0]+'" data-id="'+row[0]+'"  data-defectId="'+row[0]+'" class="text-step" data-toggle="modal" data-target="#defectdetailsmodal" ><b>'+
                      data+
                      '</b> </a>';
            }
        },
        {
        "orderable": false,"targets":[2],"class":"text-left wrap-text", "width": "300px",
         render: renderDescriptionColumn
        },
        {"orderable": true,
          "targets": 3,
          "class":"text-left",
          render: function ( data, type, row ) {
          return (data !="" ? '<span class="badge  badge-default "><b>'+data+'</b></span> ' : "-");
          }
        },
        {"orderable": true,"targets":[1,3,4,5,6,7,8,9],"class":"text-center"}  ,
        {"visible": false,"targets":[5,6,7,8],"class":"text-center"}  
      ],

      "pageLength": 25,
      "searching": false,
      "paging": true,
      "info": false,
      "order": false,
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
      "drawCallback": function (settings) { 
          $('[data-toggle="popover"]').popover();
      }
});
$("#dsrdefectTbl").wrap("<div class='scrolledTable'></div>");
 
/** initialize test execution summary table */
var dsrtestexesummaryTbl =  $('#dsrtestexesummaryTbl').DataTable({
  "language": {
    "emptyTable": "No execution available"
  },
  "ajax": {
      "url": STEP_root+"api/dashboard/getDSRTestexecution.php",
      "data": function (d) {
          var nProjectId = ($("#dsrprojectId").val() != null ? $("#dsrprojectId").val() : '');
          var nReleaseId = ($("#dsrreleaseId").val() != null ? $("#dsrreleaseId").val() : '');
          var nActivityId = ($("#dsractivityId").val() != null ? $("#dsractivityId").val() : '');
          var nDate = $("#dsrdate").val();
            return "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&defectdate="+nDate;
      }
    },
   autoWidth: false,
    "columnDefs": [
      {
        "orderable": true,
        "targets": 0,
        "class":"text-left",
        render: function ( data, type, row ) {
        return (data !="" ? data : "-");
        }
      },
      {"orderable": false,"targets":[10,20],"class":"text-left",visible:false}  ,
      {"orderable": true,"targets":[1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21],"class":"text-left"}  
    ],
    scrollX:true,
    scrollY: '500px',       // Set your desired height
    scrollCollapse: true,   // Collapse the table height if fewer rows
    "searching": false,
    "paging": false,
    "info": false,
    "order": false,
    "footerCallback": function ( row, data, start, end, display ) {
        var api = this.api(), data;

        // Remove the formatting to get integer data for summation
        var intVal = function ( i ) {
            return typeof i === 'string' ?
                i.replace(/[\$,]/g, '')*1 :
                typeof i === 'number' ?
                    i : 0;
        };

        var tottestexecute = 0,totexecutabletc = 0,passcount = 0,failcount= 0,inprogresscount = 0,noruncount = 0,blockcount = 0,holdcount = 0,deferredcount = 0,nacount = 0;
        var  fcolumns = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        for (var i = 0; i < fcolumns.length; i++) { 
          var  total = api
                                .column( fcolumns[i] )
                                .data()
                                .reduce( function (a, b) {
                                    return intVal(a) + intVal(b);
                                }, 0 );
          // Update footer
          $( api.column( fcolumns[i] ).footer() ).html(parseFloat(total.toFixed(2)) );
          if(fcolumns[i]==2){ totexecutabletc = total.toFixed(2);}
          else if(fcolumns[i]==3){ tottestexecute = total.toFixed(2);}
          else if(fcolumns[i]==4){ 
            var nextSeqNum = api
                        .column(fcolumns[i])
                        .data()
                        .sort(function(a,b){ return a-b; })
                        .reverse()[0];
            $( api.column( fcolumns[i] ).footer() ).html(nextSeqNum);
          }
          else if(fcolumns[i]==5){ passcount = total.toFixed(2);}
          else if(fcolumns[i]==6){ failcount = total.toFixed(2);}
          else if(fcolumns[i]==7){ inprogresscount = total.toFixed(2);}
          else if(fcolumns[i]==8){ noruncount = total.toFixed(2);}
          else if(fcolumns[i]==9){ blockcount = total.toFixed(2);}
          else if(fcolumns[i]==10){ deferredcount = total.toFixed(2);}
          else if(fcolumns[i]==11){ nacount = total.toFixed(2);}
          else if(fcolumns[i]==12){ holdcount = total.toFixed(2);}
          else if(fcolumns[i]==13){ 
            var exepercentage = (totexecutabletc > tottestexecute ? (tottestexecute/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(exepercentage.toFixed(2)) );

          }else if(fcolumns[i]==14){ 
            var passpercentage = (parseInt(totexecutabletc) > parseInt(passcount) ? (passcount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(passpercentage.toFixed(2)) );

          }else if(fcolumns[i]==15){ 
            var failpercentage = (parseInt(totexecutabletc) > parseInt(failcount) ? (failcount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(failpercentage.toFixed(2)) );

          }else if(fcolumns[i]==16){ 
            var inprogresspercentage = (totexecutabletc > inprogresscount ? (inprogresscount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(inprogresspercentage.toFixed(2)) );

          }else if(fcolumns[i]==17){ 
            var norunpercentage = (totexecutabletc > noruncount ? (noruncount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(norunpercentage.toFixed(2)) );

          }else if(fcolumns[i]==18){ 
            var blockpercentage = (totexecutabletc > blockcount ? (blockcount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(blockpercentage.toFixed(2)) );

          }else if(fcolumns[i]==19){ 
            var holdpercentage = (totexecutabletc > holdcount ? (holdcount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(holdpercentage.toFixed(2)) );

          }else if(fcolumns[i]==20){ 
            var deferredpercentage = (totexecutabletc > deferredcount ? (deferredcount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(deferredpercentage.toFixed(2)) );

          }else if(fcolumns[i]==21){ 
            var napercentage = (totexecutabletc > nacount ? (nacount/totexecutabletc)*100 : 0);
            $( api.column( fcolumns[i] ).footer() ).html(parseFloat(napercentage.toFixed(2)) );

          }
        }
    }
        
  });

  dsrtestexesummaryTbl.columns.adjust().draw();

  // SUM PLUGIN
  jQuery.fn.dataTable.Api.register( 'sum()', function ( ) {
      return this.flatten().reduce( function ( a, b ) {
          if ( typeof a === 'string' ) {
              a = a.replace(/[^\d.-]/g, '') * 1;
          }
          if ( typeof b === 'string' ) {
              b = b.replace(/[^\d.-]/g, '') * 1;
          }

          return a + b;
      }, 0 );
  } );

  //$("#dsrtestexesummaryTbl").wrap("<div class='scrolledTable'></div>");
 

  $( document ).on( "change", "[id=dsroverallsummery],[id=dsrprodlosssummery]", function(e) {
    // prevent default action
    e.preventDefault();
    var nProjectId = ($("#dsrprojectId").val() != null ? $("#dsrprojectId").val() : '');
    var nReleaseId = ($("#dsrreleaseId").val() != null ? $("#dsrreleaseId").val() : '');
    var nOverallsummery = ($("#dsroverallsummery").val() != null ? $("#dsroverallsummery").val() : '');
    var nProdlosssummery = ($("#dsrprodlosssummery").val() != null ? $("#dsrprodlosssummery").val() : '');
    var nDate = $("#dsrdate").val();
    
    $.ajax({
        type: "POST",
        url: STEP_root+'api/dashboard/getdsrprojinfo.php',
        dataType:'json',
        data:  {'projectId':nProjectId,'releaseId':nReleaseId,'dsrdate':nDate,'overallsummery':nOverallsummery,'prodlosssummery':nProdlosssummery}, // serializes the form's elements.
        success: function(data)
        {
          if(data != null && data['data']!=null  && data['data']!=""){
          }

        },error:function (jqXHR, textStatus, errorThrown) {
          formatErrorMessage(jqXHR, errorThrown);
        }
    });
  });
    
  $( document ).on( "change", "[id=dsrprojectId]", function(e) {
    // prevent default action
    e.preventDefault();
    var nProjectId = this.value;
    getRelease(nProjectId,'DSR');

    $("#dsractivityId").html('');
    $("#dsractivityId").selectpicker('refresh');

  });

  $( document ).on( "change", "[id=dsrreleaseId]", function(e) {
        // prevent default action
        e.preventDefault();
        
        var nReleaseId = this.value;
        var nPorjectId = $("#dsrprojectId").val();
        //getActivity(nPorjectId,nReleaseId,'DSR');
  });



  $('form[id="dsrform"]').validate({

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
      "dsrprojectId": 'required',
      "dsrreleaseId": 'required',
      "dsrdate": 'required'
    },
    messages: {
      "dsrprojectId": 'Please select project',
      "dsrreleaseId": 'Please select release',
      "dsrdate": 'Please select date'
    },

    submitHandler: function(form) {
          $("#dstTbl1 tbody").html("");
          dsr1().then(function(){
              
          });
    }

  });
  
  $( document ).on( "click", "#downloadDSR", function(e) {
    // prevent default action
    e.preventDefault();


        var nProjectId = ($("#dsrprojectId").val() != null ? $("#dsrprojectId").val() : '');
        var nReleaseId = ($("#dsrreleaseId").val() != null ? $("#dsrreleaseId").val() : '');
        var nActivityId = ($("#dsractivityId").val() != null ? $("#dsractivityId").val() : '');
        var nDate = $("#dsrdate").val();
        var nData = "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&dsrdate="+nDate;

      window.open(STEP_root+"api/dashboard/downloadDSR.php?"+nData,'_blank');

  });

  $( document ).on( "click", "#resetDSRFilter", function(e) {
    // prevent default action
    e.preventDefault();
    

      $("#dsrprojectId").val('default');
      $("#dsrprojectId").selectpicker("refresh");

      $("#dsrreleaseId").html('');
      $("#dsrreleaseId").val('default');
      $("#dsrreleaseId").selectpicker('refresh');

      $("#dsractivityId").html('');
      $("#dsractivityId").val('default');
      $("#dsractivityId").selectpicker('refresh');

      
    $("#dsrdiv").addClass("hidden");
    $("#notificationdiv").removeClass("hidden");
                    $("#notificationdiv").html('<div class="col-4 alert alert-warning alert-dismissible fade show" role="alert">Please select project and release.'+
                      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                      '  <span aria-hidden="true">&times;</span>'+
                      '</button>'+
                    ' </div>');

  });



$('form[id="emailform"]').validate({

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
    "sendto": {
        required: true
      }
  },
  messages: {
  },

  submitHandler: function(form) {
    var form_data = new FormData($(form)[0]); 

    var nProjectId = ($("#dsrprojectId").val() != null ? $("#dsrprojectId").val() : '');
    var nReleaseId = ($("#dsrreleaseId").val() != null ? $("#dsrreleaseId").val() : '');
    var nActivityId = ($("#dsractivityId").val() != null ? $("#dsractivityId").val() : '');
    var nDate = $("#dsrdate").val();

    form_data.append("projectId",nProjectId);
    form_data.append("releaseId",nReleaseId);
    form_data.append("activityId",nActivityId);
    form_data.append("dsrdate",nDate);

    $.ajax({
        url: STEP_root+"api/dashboard/sendDSR.php", //The url where the server req would we made.
        async: false,
        type: "POST", //The type which you want to use: GET/POST
        data: form_data , //The variables which are going.
        dataType: "text", //Return data type (what we expect).
        cache: false,
        contentType: false,
        processData: false,
        //This is the function which will be called if ajax call is successful.
        success: function(rdata) {
          if(rdata != null){
            if(rdata.indexOf("Message sent!") !== -1){
                closeModelform(form);
                $.alert({
                      title: 'Success',
                      content: "Email sent successfully.",
                      type: 'green',
                      typeAnimated: true
                  });
            }else{
              $.alert({
                      title: 'Encountered an error!',
                      content: "Email sending failed.",
                      type: 'red',
                      typeAnimated: true
                  });

            }
          }
        }
    });
  }
});

function getDSRTestexecutionchart(){
  $("#dsrtestexecutionChartdiv").html("");
  var nProjectId = ($("#dsrprojectId").val() != null ? $("#dsrprojectId").val() : '');
  var nReleaseId = ($("#dsrreleaseId").val() != null ? $("#dsrreleaseId").val() : '');
  var nActivityId = ($("#dsractivityId").val() != null ? $("#dsractivityId").val() : '');
  var nDate = $("#dsrdate").val();
  var nData = "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&testcasedate="+nDate;

  var nFlag = 1;
  $.getJSON(STEP_root+"api/dashboard/getcustomTestExecutionchart.php?"+nData, function (chartresult) {
    $.each(chartresult,function(k,v){

      if (nFlag > 4){
        nFlag = 1
      }else{
        nFlag++;
      }
      
      var colDIv = '<div class="card  col-6 " >'+
          '  <div class="card-header">'+
          '      <strong>'+v['title']+'</strong>'+
          '      <small>'+(v['subtitle'] != "" ? '('+v['subtitle']+')' :"")+'</small>'+
          '  </div>'+
          '  <div class="card-body"><div  id="dsrexecutionChart'+k+'" style="height: 370px; "></div></div>'+
        ' </div>';
        
      $("#dsrtestexecutionChartdiv").append(colDIv);
      var chart_id = v['id'];

      var cType = (v['type'] =="Percentage" ? "%" : "");
      if(v['charttype'] == "Column" || v['charttype'] == "Line"){

          Highcharts.chart('dsrexecutionChart'+k, {
              chart: {
                  type:  v['charttype'].toLowerCase()
              },
              title: {
                  text: ""
              },
              subtitle: {
                  text: v['subtitle']
              },
              xAxis: {
                  categories: v['xaxis'],
                  crosshair: true
              },
              yAxis: {
                  min: 0,
                  title: {
                      text: ''
                  }
              },
              tooltip: {
                  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                      '<td style="padding:0"><b>{point.y}</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
              },

              plotOptions: {
                  series: {
                    dataLabels: { 
                      enabled: false, 
                      inside: false,
                      overflow: 'none',
                      crop: true,
                      // shape: 'callout',
                      backgroundColor:'rgba(0,0,0,0.8)',
                      borderColor: 'rgba(0,0,0,0.9)',
                      color: 'rgba(255,255,255,0.75)',
                      borderWidth: .5,
                      borderRadius: 5,
                      y: -10,
                      style: {
                        fontFamily: 'Helvetica, sans-serif',
                        fontSize: '10px',
                        fontWeight: 'normal',
                        textShadow: 'none'
                      }
                    },
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                
                              var cat_name = this.category;
  			      var nProjectId = ($("#dsrprojectId").val() != null ? [$("#dsrprojectId").val()] : '');
                              var nReleaseId = ($("#dsrreleaseId").val() != null ? [$("#dsrreleaseId").val()] : '');
                              
                              

                              $.ajax({
                                  type: "POST",
                                  url: STEP_root+"api/dashboard/testexecutionchartInfo.php",
                                  data: {'chart_id':chart_id,'xVal':cat_name,'projectId':nProjectId,'releaseId':nReleaseId}, // serializes the form's elements.
                                  success: function(data)
                                  {
                                    $("#exampleModalLongTitle").html(v['title']);
                                    $("#modelTablebody").html(data);

                                    var mymodal = $('#exampleModalCenter');
                                    mymodal.modal('show');
                                    $('#testcaseinfotbl').DataTable({
                                      "pageLength":5,
                                      "lengthChange": false,
                                      "paging":true,
                                      "info":true,
                                      "searching":false,
                                    } );
                                    $("#testcaseinfotbl").wrap("<div class='scrolledTable'></div>");
                                  }
                                });
                            }
                        }
                    }
                  }
              },
              series: v['seriesdata']
          });

      }else if(v['charttype'] == "Pie"){

          Highcharts.chart('dsrexecutionChart'+k, {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie'
              },
              title: {
                  text: ""
              },
              tooltip: {
                  pointFormat: '{series.name}: <b>{point.y}'+cType+'</b>'
              },
              plotOptions: {
                  pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: false,
                          connectorShape: 'fixedOffset',
                          format: '<b>{point.name}</b>: {point.y}'+cType
                      },
                      showInLegend: true,
                      point: {
                          events: {
                            click: function () {
                              var cat_name = this.name;
                              var xId = this.id;
                              
                              
                              var nProjectId = ($("#dsrprojectId").val() != null ? [$("#dsrprojectId").val()] : '');
                              var nReleaseId = ($("#dsrreleaseId").val() != null ? [$("#dsrreleaseId").val()] : '');
                              
                              $.ajax({
                                type: "POST",
                                url: STEP_root+"api/dashboard/testexecutionchartInfo.php",
                                data: {'xId':xId,'chart_id':chart_id,'xVal':cat_name,'type':'Status','projectId':nProjectId,'releaseId':nReleaseId}, // serializes the form's elements.
                                success: function(data)
                                {
                                    $("#exampleModalLongTitle").html(v['title']);
                                    $("#modelTablebody").html(data);

                                    var mymodal = $('#exampleModalCenter');
                                    mymodal.modal('show');
                                    $('#testcaseinfotbl').DataTable({
                                      "pageLength":5,
                                      "lengthChange": false,
                                      "paging":true,
                                      "info":true,
                                      "searching":false,
                                    } );
                                    $("#testcaseinfotbl").wrap("<div class='scrolledTable'></div>");
                                }
                              });
                            }
                          }
                      }
                  }
              },
              series: [{
                  name: '',
                  colorByPoint: true,
                  data: v['seriesdata']
              }]
          });
      }
    });
  });
        

}

/**
 * Generates and displays the Defect Ageing Summary chart on the dashboard.
 * This function fetches data for defect ageing and custom defect charts
 * based on project, release, activity, and date filters, and renders them
 * using Highcharts. It also handles click events on chart points to retrieve
 * and display detailed defect information in a modal.
 */
function getdsrdefectchart(){
    var colDIv = '<div class="card col-6 " >'+
                      '  <div class="card-header ">'+
                      '      <strong>Defect Ageing Summary</strong>'+
                      '  </div>'+
                      '  <div class="card-body"><div  id="dsrchartAgeing" style="height: 370px; padding: 10dp;; margin-right: 10dp; background-color: #F1F1F1;"></div></div>'+
                   ' </div>';
    $("#dsrDefectChartdiv").html(colDIv);
    var nProjectId = ($("#dsrprojectId").val() != null ? $("#dsrprojectId").val() : '');
    var nReleaseId = ($("#dsrreleaseId").val() != null ? $("#dsrreleaseId").val() : '');
    var nActivityId = ($("#dsractivityId").val() != null ? $("#dsractivityId").val() : '');
    var nDate = $("#dsrdate").val();
    var nData =  "projectId="+nProjectId+"&&releaseId="+nReleaseId+"&&activityId="+nActivityId+"&&defectdate="+nDate;
    var nFlag = 1;
    $.getJSON(STEP_root+"api/dashboard/getcustomDefectchart.php?"+nData, function (chartresult) {
        $.each(chartresult,function(k,v){
          if (nFlag > 4){
            nFlag = 1
          }else{
            nFlag++;
          }
          
          var colDIv = '<div class="card col-6 " >'+
                      '  <div class="card-header ">'+
                      '      <strong>'+v['title']+'</strong>'+
                      '      <small>'+(v['subtitle'] != "" ? '('+v['subtitle']+')' :"")+'</small>'+
                      '  </div>'+
                      '  <div class="card-body"><div  id="dsrdefectChart'+k+'" style="height: 370px; padding: 10dp;; margin-right: 10dp; background-color: #F1F1F1;"></div></div>'+
                   ' </div>';

          $("#dsrDefectChartdiv").append(colDIv);
          var chart_id = v['id'];
          var cType = (v['type'] =="Percentage" ? "%" : "");
          
          if(v['charttype'] == "Column" || v['charttype'] == "Line"){
              Highcharts.chart('dsrdefectChart'+k, {
                chart: {
                    type:  v['charttype'].toLowerCase()

                },
                title: {
                    text: ""
                },
                subtitle: {
                    text: v['subtitle']
                },
                xAxis: {
                    categories: v['xaxis'],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.name}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },

                plotOptions: {
                    series: {
                      dataLabels: { 
                        enabled: false, 
                        inside: false,
                        overflow: 'none',
                        crop: true,
                        // shape: 'callout',
                        backgroundColor:'rgba(0,0,0,0.8)',
                        borderColor: 'rgba(0,0,0,0.9)',
                        color: 'rgba(255,255,255,0.75)',
                        borderWidth: .5,
                        borderRadius: 5,
                        y: -10,
                        style: {
                          fontFamily: 'Helvetica, sans-serif',
                          fontSize: '10px',
                          fontWeight: 'normal',
                          textShadow: 'none'
                        }
                      },
                      cursor: 'pointer',
                      point: {
                          events: {
                              click: function () {
                                  console.log('Category: ' + this.category + ', value: ' + this.y+" | "+chart_id);
                                  var cat_name = this.category;
                                  var cat_status = (k == 2 ? 'Type' : 'Status');
                                  
                                  var nProjectId = ($("#defectprojectId").val() != null ? $("#defectprojectId").val() : '');
                                  var nReleaseId = ($("#defectreleaseId").val() != null ? $("#defectreleaseId").val() : '');
                                  var nActivityId = ($("#defectactivityId").val() != null ? $("#defectactivityId").val() : '');
                                  var nStatusId = ($("#defectstatusId").val() != null ? $("#defectstatusId").val() : '');
                                  var nDate = $("#defectdate").val();
                                  $.ajax({
                                      type: "POST",
                                      url: STEP_root+"api/dashboard/defectchartInfo.php",
                                      data: {'chart_id':chart_id,'xVal':cat_name,'type':cat_status,'projectId':nProjectId,'releaseId':nReleaseId,'activityId':nActivityId,'defectstatusId':nStatusId,'defectdate':nDate}, // serializes the form's elements.
                                      success: function(data)
                                      {
                                        $("#exampleModalLongTitle").html(v['title']);
                                        $("#modelTablebody").html(data);

                                        var mymodal = $('#exampleModalCenter');
                                        mymodal.modal('show');
                                        $('#defectinfotbl').DataTable({
                                          "pageLength":5,
                                          "scrollX": true,
                                          "lengthChange": false,
                                          "paging":true,
                                          "info":true,
                                          "searching":false,
                                        } );
                                        $("#defectinfotbl").wrap("<div class='scrolledTable'></div>");
                                      }
                                  });
                              }
                          }
                      }
                    }
                },
                series: v['seriesdata']
            });

          }else if(v['charttype'] == "Pie"){

            Highcharts.chart('dsrdefectChart'+k, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: ""
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}'+cType+'</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                            connectorShape: 'fixedOffset',
                            format: '<b>{point.name}</b>: {point.y}'+cType
                        },
                        showInLegend: true,
                        point: {
                            events: {
                                click: function () {
                                    var cat_name = this.name;
                                    var xId = this.id;
                                    
                                    
                                    var nProjectId = ($("#defectprojectId").val() != null ? $("#defectprojectId").val() : '');
                                    var nReleaseId = ($("#defectreleaseId").val() != null ? $("#defectreleaseId").val() : '');
                                    var nActivityId = ($("#defectactivityId").val() != null ? $("#defectactivityId").val() : '');
                                    var nStatusId = ($("#defectstatusId").val() != null ? $("#defectstatusId").val() : '');
                                    var nDate = $("#defectdate").val();
                                    $.ajax({
                                        type: "POST",
                                        url: STEP_root+"api/dashboard/defectchartInfo.php",
                                        data: {'xId':xId,'chart_id':chart_id,'xVal':cat_name,'type':'Status','projectId':nProjectId,'releaseId':nReleaseId,'activityId':nActivityId,'defectstatusId':nStatusId,'defectdate':nDate}, // serializes the form's elements.
                                        success: function(data)
                                        {
                                          $("#exampleModalLongTitle").html(v['title']);
                                          $("#modelTablebody").html(data);

                                          var mymodal = $('#exampleModalCenter');
                                          mymodal.modal('show');
                                          $('#defectinfotbl').DataTable({
                                            "pageLength":5,
                                            "lengthChange": false,
                                            "paging":true,
                                            "info":true,
                                            "searching":false,
                                          } );
                                          $("#defectinfotbl").wrap("<div class='scrolledTable'></div>");
                                        }
                                    });
                                  }
                            }
                        }
                        
                    }
                },
                series: [{
                    name: '',
                    colorByPoint: true,
                    data: v['seriesdata']
                }]
            });
          }
        });

    });

    $.getJSON(STEP_root+"api/dashboard/getDefectchart.php?"+nData, function (chartresult) {
        // Defect Ageing
        Highcharts.chart('dsrchartAgeing', {
            chart: {
                type: 'column'
            },
            title: {
                text: '',//'Defect Ageing Summary '
            },
            subtitle: {
                text: 'Modulewise'
            },
            xAxis: {
                categories: chartresult['categories'],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Ageing in days'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                  series: {
                      dataLabels: { 
                        enabled: false, 
                        inside: false,
                        overflow: 'none',
                        crop: true,
                        // shape: 'callout',
                        backgroundColor:'rgba(0,0,0,0.8)',
                        borderColor: 'rgba(0,0,0,0.9)',
                        color: 'rgba(255,255,255,0.75)',
                        borderWidth: .5,
                        borderRadius: 5,
                        y: -10,
                        style: {
                          fontFamily: 'Helvetica, sans-serif',
                          fontSize: '10px',
                          fontWeight: 'normal',
                          textShadow: 'none'
                        }
                      },
                      cursor: 'pointer',
                      point: {
                          events: {
                              click: function () {
                                  var cat_name = this.category;
                                  
                                  var nProjectId = ($("#defectprojectId").val() != null ? $("#defectprojectId").val() : '');
                                  var nReleaseId = ($("#defectreleaseId").val() != null ? $("#defectreleaseId").val() : '');
                                  var nActivityId = ($("#defectactivityId").val() != null ? $("#defectactivityId").val() : '');
                                  var nStatusId = ($("#defectstatusId").val() != null ? $("#defectstatusId").val() : '');
                                  var nDate = $("#defectdate").val();
    
                                  $.ajax({
                                        type: "POST",
                                        url: STEP_root+"api/dashboard/defectchartInfo.php",
                                        data: {'chart_id':'','xVal':cat_name,'type':'Ageing','projectId':nProjectId,'releaseId':nReleaseId,'activityId':nActivityId,'defectstatusId':nStatusId,'defectdate':nDate}, // serializes the form's elements.
                                        success: function(data)
                                        {
                                          $("#exampleModalLongTitle").html('Ageing in days');
                                          $("#modelTablebody").html(data);

                                          var mymodal = $('#exampleModalCenter');
                                          mymodal.modal('show');
                                          $('#defectinfotbl').DataTable({
                                            "pageLength":5,
                                            "scrollX": true,
                                            "lengthChange": false,
                                            "paging":true,
                                            "info":true,
                                            "searching":false,
                                          } );
                                          $("#defectinfotbl").wrap("<div class='scrolledTable'></div>");
                                        }
                                    });
                              }
                          }
                      }
                  }
              },
              series: [{
                name: 'Status of defect reported',
                data: chartresult['Ageing']

              }]
        });
    });
}



function closeModelform(form){
   var mymodal = $('#sendDSRmodal');
    mymodal.modal('hide');
    $(form)[0].reset();
}

$('#sendDSRmodal').on('hidden.bs.modal', function () {
  $('#emailform').trigger("reset");

    $('#emailform .state-error').css('display', 'none');
});



$( document ).on( "click", "[id=dsrtestexec_visibility]", function(e) {
    // prevent default action
    e.preventDefault();
    var vStatus = $(this).attr("data-status");
    var vDiv = $(this).attr("data-div");
    if(vStatus == "1"){
      $(this).html("Show Execution Summary");
      $("#"+vDiv).hide();
      $(this).attr("data-status","0");

      $('#dsrdefectTbl').parents('div.dataTables_wrapper').first().hide();
    }else{

      $("#"+vDiv).show();
      $(this).html("Hide Execution Summary");
      $(this).attr("data-status","1");

      $('#dsrdefectTbl').parents('div.dataTables_wrapper').first().show();
    }
});

})(jQuery);
