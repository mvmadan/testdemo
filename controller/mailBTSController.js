workflow.controller("mailBTSController", ['$scope', 'Upload', '$rootScope', '$window', '$http', '$timeout', '$q', '$log', '$filter', 'mailBTSService', function($scope, Upload, $rootScope, $window, $http, $timeout, $q, $log, $filter, mailBTSService) {

  $scope.isLoggedIn = JSON.parse($window.localStorage.getItem('userJSON')).loggedIn;
  $scope.loggedInUser = JSON.parse($window.localStorage.getItem('userJSON')).employee_name;
  var user_id = JSON.parse($window.localStorage.getItem('userJSON')).employee_id;
  var htmlStr = "";

  window.scrollTo(0, document.body.scrollHeight);

  //================================================== start of generating the excel file of BTS mail ============================
  mailBTSService.getMailBTSService().then(projectResponseMailBTS)

  function projectResponseMailBTS(response) {
    if (response != "error") {

      $scope.mailBTSList = response.recordsets[0];
      // console.log("==========>>>>>>>>"+ JSON.stringify($scope.mailBTSList));

      for (var i = 0; i < $scope.mailBTSList.length; i++) {
        $scope.mailBTSList[i].serialNo = i + 1;

        var dates = $scope.mailBTSList[i].created_on.slice(0, $scope.mailBTSList[i].created_on.length - 14)
        parts = dates.split("-");
        if (parts[1] == '01') {
          parts[1] = 'Jan';
        } else if (parts[1] == '02') {
          parts[1] = 'Feb';
        } else if (parts[1] == '03') {
          parts[1] = 'Mar';
        } else if (parts[1] == '04') {
          parts[1] = 'Apr';
        } else if (parts[1] == '05') {
          parts[1] = 'May';
        } else if (parts[1] == '06') {
          parts[1] = 'Jun';
        } else if (parts[1] == '07') {
          parts[1] = 'Jul';
        } else if (parts[1] == '08') {
          parts[1] = 'Aug';
        } else if (parts[1] == '09') {
          parts[1] = 'Sep';
        } else if (parts[1] == '10') {
          parts[1] = 'Oct';
        } else if (parts[1] == '11') {
          parts[1] = 'Nov';
        } else if (parts[1] == '12') {
          parts[1] = 'Dec';
        }
        $scope.mailBTSList[i].created_on = parts[2] + " " + parts[1] + " " + parts[0];
      }


      $scope.headersData = [{
          "column_name": "serialNo",
          "display_column_name": "Sr. no"
        },
        {
          "column_name": "Client",
          "display_column_name": "Client"
        },
        {
          "column_name": "Client code",
          "display_column_name": "Client Code"
        },
        {
          "column_name": "Type",
          "display_column_name": "Type"
        },
        {
          "column_name": "created_on",
          "display_column_name": "Created On"
        },
        {
          "column_name": "project_id",
          "display_column_name": "Project Id"
        },
        {
          "column_name": "Project Number",
          "display_column_name": "Project Number"
        },
        {
          "column_name": "Project Name",
          "display_column_name": "Project Name"
        },
        {
          "column_name": "Project Status",
          "display_column_name": "Project Status"
        },
        {
          "column_name": "PIC",
          "display_column_name": "PIC"
        },
        {
          "column_name": "Client Team",
          "display_column_name": "Client Team"
        },
        {
          "column_name": "Region",
          "display_column_name": "Region"
        },
        {
          "column_name": "Overall_Client_Estimate",
          "display_column_name": "Overall Client Estimate"
        },
        {
          "column_name": "Overall_Actual_Hours",
          "display_column_name": "Overall Actual Hours"
        },
        {
          "column_name": "Overall_Hours_Logged_On_Change_Request",
          "display_column_name": "Overall Hours Logged On Change Request"
        },
        {
          "column_name": "Overall % execution (on final estimate)",
          "display_column_name": "Overall % execution"
        },
        {
          "column_name": "GPM Client Estimate",
          "display_column_name": "GPM Client Estimate"
        },
        {
          "column_name": "GPM Actual Hours",
          "display_column_name": "GPM Actual Hours"
        },
        {
          "column_name": "GPM Hours Logged On Change Request",
          "display_column_name": "GPM Hours Logged On Change Request"
        },
        {
          "column_name": "GPM % execution (on final estimate)",
          "display_column_name": "GPM % execution"
        },

        {
          "column_name": "SP Client Estimate",
          "display_column_name": "SP Client Estimate"
        },
        {
          "column_name": "SP Actual Hours",
          "display_column_name": "SP Actual Hours"
        },
        {
          "column_name": "SP Hours Logged On Change Request",
          "display_column_name": "SP Hours Logged On Change Request"
        },
        {
          "column_name": "SP % execution (on final estimate)",
          "display_column_name": "SP % execution"
        },

        {
          "column_name": "DP Client Estimate",
          "display_column_name": "DP Client Estimate"
        },
        {
          "column_name": "DP Actual Hours",
          "display_column_name": "DP Actual Hours"
        },
        {
          "column_name": "DP Hours Logged On Change Request",
          "display_column_name": "DP Hours Logged On Change Request"
        },
        {
          "column_name": "DP % execution (on final estimate)",
          "display_column_name": "DP % execution"
        },

        {
          "column_name": "RW Client Estimate",
          "display_column_name": "RW Client Estimate"
        },
        {
          "column_name": "RW Actual Hours",
          "display_column_name": "RW Actual Hours"
        },
        {
          "column_name": "RW Hours Logged On Change Request",
          "display_column_name": "RW Hours Logged On Change Request"
        },
        {
          "column_name": "RW % execution (on final estimate)",
          "display_column_name": "RW % execution"
        },

        {
          "column_name": "OEC Client Estimate",
          "display_column_name": "OEC Client Estimate"
        },
        {
          "column_name": "OEC Actual Hours",
          "display_column_name": "OEC Actual Hours"
        },
        {
          "column_name": "OEC Hours Logged On Change Request",
          "display_column_name": "OEC Hours Logged On Change Request"
        },
        {
          "column_name": "OEC % execution (on final estimate)",
          "display_column_name": "OEC % execution"
        },

        {
          "column_name": "MRTech Client Estimate",
          "display_column_name": "MRTech Client Estimate"
        },
        {
          "column_name": "MRTech Actual Hours",
          "display_column_name": "MRTech Actual Hours"
        },
        {
          "column_name": "MRTech Hours Logged On Change Request",
          "display_column_name": "MRTech Hours Logged On Change Request"
        },
        {
          "column_name": "MRTech % execution (on final estimate)",
          "display_column_name": "MRTech % execution"
        },

      ];
      $scope.filename = 'Daily_BTS_Report';
      var fields = [];
      var header = [];
      var separator = ',';
      angular.forEach($scope.headersData, function(value, key) {
        fields.push(value.column_name);
        header.push(value.display_column_name);
      });
      clickFun();

      function clickFun() {
        var bodyData = _bodyData();
        var strData = _convertToExcel(bodyData);
        var blob = new Blob([strData], {
          type: "application/vnd.ms-excel"
        });
        return saveAs(blob, [$scope.filename + '.csv']);
      };

      function _bodyData() {
        var data = $scope.mailBTSList;
        var body = "";
        angular.forEach(data, function(dataItem) {
          var rowItems = [];
          angular.forEach(fields, function(field) {
            if (field.indexOf('.')) {
              field = field.split(".");
              var curItem = dataItem;
              // deep access to obect property
              angular.forEach(field, function(prop) {
                if (curItem !== null && curItem !== undefined) {
                  curItem = curItem[prop];
                }
              });
              data = curItem;
              //console.log(">>data>> " + data);
            } else {
              data = dataItem[field];
              //console.log(">>data>> " + data);
            }
            var fieldValue = data !== null ? data : ' ';
            if (fieldValue !== undefined && angular.isObject(fieldValue)) {
              fieldValue = _objectToString(fieldValue);
            }
            if (typeof fieldValue == 'string') {
              rowItems.push('"' + fieldValue.replace(/"/g, '""') + '"');
            } else {
              rowItems.push(fieldValue);
            }
          });

          body += rowItems.join(separator) + '\n';
        });
        return body;
      }

      function _convertToExcel(body) {
        return header.join(separator) + '\n' + body;
      }

      function _objectToString(object) {
        var output = '';
        angular.forEach(object, function(value, key) {
          output += key + ':' + value + ' ';
        });
        return '"' + output + '"';
      }

      /*for (var i = 0; i < $scope.mailBTSList.length; i++) {
        htmlStr += "<tbody><tr><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i].Client + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['Client code'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i].Type + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i].Business_Type + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i].created_on + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i].project_id + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['Project Number'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['Project Name'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['Project Status'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i].PIC + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['Client Team'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i].Region + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i].Overall_Client_Estimate + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i].Overall_Actual_Hours + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i].Overall_Hours_Logged_On_Change_Request + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['Overall % execution (on final estimate)'] + "</td><td style='border: 1px solid black;'>"
           +
          $scope.mailBTSList[i]['GPM Client Estimate'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['GPM Actual Hours'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['GPM Hours Logged On Change Request'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['GPM % execution (on final estimate)'] + "</td><td style='border: 1px solid black;'>" +

          $scope.mailBTSList[i]['SP Client Estimate'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['SP Actual Hours'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['SP Hours Logged On Change Request'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['SP % execution (on final estimate)'] + "</td>   <td style='border: 1px solid black;'>" +

          $scope.mailBTSList[i]['DP Client Estimate'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['DP Actual Hours'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['DP Hours Logged On Change Request'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['DP % execution (on final estimate)'] + "</td>  <td style='border: 1px solid black;'>" +

          $scope.mailBTSList[i]['RW Client Estimate'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['RW Actual Hours'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['RW Hours Logged On Change Request'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['RW % execution (on final estimate)'] + "</td>  <td style='border: 1px solid black;'>" +

          $scope.mailBTSList[i]['OEC Client Estimate'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['OEC Actual Hours'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['OEC Hours Logged On Change Request'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['OEC % execution (on final estimate)'] + "</td>  <td style='border: 1px solid black;'>" +

          $scope.mailBTSList[i]['MRTech Client Estimate'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['MRTech Actual Hours'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['MRTech Hours Logged On Change Request'] + "</td><td style='border: 1px solid black;'>" +
          $scope.mailBTSList[i]['MRTech % execution (on final estimate)'] + "</td> </tr></tbody>"

      } //end of for loop*/
    } //end of if
    else {
      alert("Some error occurred!!");
    }
  } //end of function projectResponseMailTable
  //================================================== end of generating the excel file of BTS mail ============================

  //================================================== start of send function ============================================
  $scope.send = function(excelfile) {
    console.log("In send function" + $scope.excelfile);
    $("#message_span").text("Sending E-mail.... Please wait");

    var parameters = {
      "to": $scope.toModel,
      "subject": $scope.subjectModel,
    };
    console.log("parameters====>>>>" + JSON.stringify(parameters));

    mailBTSService.getMailBTSRequestService(parameters).then(projectResponseMailBTSRequest)

    function projectResponseMailBTSRequest(response) {
      if (response != "error") {
        $("#message_span").empty().html("Email is been sent at " + $scope.toModel + " Please check inbox!");
      } //end of for loop
      else {
        alert("Some error occurred!!");
        $("#message_span").text("");
        $scope.toModel = "";
        $scope.subjectModel = "";
      }
    } //end of function projectResponseMailBTSRequest
  }
  //================================================== end of send function ============================================
}]); //end of workflow.controller
