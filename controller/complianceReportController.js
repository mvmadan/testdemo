workflow.controller("complianceReportController", ['$scope', '$rootScope', '$window', '$http', '$timeout', '$q', '$log', '$filter', 'complianceReportService', function($scope, $rootScope, $window, $http, $timeout, $q, $log, $filter, complianceReportService) {

  $rootScope.isLoggedIn = JSON.parse($window.localStorage.getItem('userJSON')).loggedIn;
  $rootScope.loggedInUser = JSON.parse($window.localStorage.getItem('userJSON')).employee_name;
  $rootScope.outerShowMenuList = JSON.parse($window.localStorage.getItem('outerShowMenuList'));
  console.log(" >> menu >> " + JSON.parse($window.localStorage.getItem('outerShowMenuList')));
  $rootScope.selectedTimezone = $window.localStorage.getItem('selectedTimezone');
  $rootScope.timezone_area = $window.localStorage.getItem('timezone_area');
  $rootScope.timezoneList = JSON.parse($window.localStorage.getItem('timezoneList'));

  $rootScope.showSelecteTimezone = function() {
    console.log(" >> timezoneList >> " + $rootScope.timezoneList.length);
    var timezoneId;
    for (var i = 0; i < $rootScope.timezoneList.length; i++) {
      console.log(" >> Timezone >> " + $rootScope.timezoneList[i].isSelected);
      if ($rootScope.selectedTimezone == $rootScope.timezoneList[i].timezone_short_name) {
        $rootScope.timezone_area = $rootScope.timezoneList[i].timezone_area;
        timezoneId = $rootScope.timezoneList[i].timezone_id;
      }
    }
    console.log(" >> selectedTimezone >> " + $rootScope.selectedTimezone);
    console.log(" >> timezone_area >> " + $rootScope.timezone_area);
    var userId = JSON.parse($window.localStorage.getItem('userJSON')).employee_id;
    loginService.timezone({
        "emp_id": userId,
        "timezoneId": timezoneId
      })
      .then(function(response) {
          console.log(" >> response >> " + response);
          if (response.recordsets[0][0] != undefined && response.recordsets[0][0].Success != "0") {
            console.log(" >> Success >> " + response.recordsets[0][0].Success);
            if (response.recordsets[0][0].Success == '1') {
              stop();
              displayTime($rootScope.timezone_area);

              console.log(" >> offset >> " + new Date().getTimezoneOffset());
              console.log(" >> moment >> " + moment().tz("Asia/kolkata").format("Z"));
              console.log(" >> moment >> " + moment().tz($rootScope.timezone_area).format("Z"));
              var t1 = moment().tz($rootScope.timezone_area).format("Z").replace(":", ".");
              var t2 = moment().tz("Asia/kolkata").format("Z").replace(":", ".");
              var t3 = t1 - t2;
              $rootScope.offset_wrtIST = t3;
              console.log(" >> t1 >> " + t1 + " >> t2 >> " + t2 + " >> t3 >> " + t3);
              console.log(" >> moment >> " + moment().locale("en"));
              console.log(" >> moment >> " + moment().format('LLLL'));
              console.log(" >> timezone >> " + moment().tz("America/Los_Angeles").format('LLLL'));

              console.log(" >> selectedTimezone >> " + $rootScope.selectedTimezone);
              console.log(" >> timezone_area >> " + $rootScope.timezone_area);

              storage.save('selectedTimezone', $rootScope.selectedTimezone);
              storage.save('timezone_area', $rootScope.timezone_area);

              angular.element(document.querySelector('#myModal')).modal('hide');
            }
          }
        },
        function(error) {
          console.log("***Error in menu***");
        });
  }

  var timer = 0;
  var displayTime = function(timezone) {
    //console.log(">> displayTime <<");
    var time = moment().tz(timezone).format('LLLL');
    $('#clock').html(time);
    timer = setTimeout(function() {
      displayTime(timezone)
    }, 1000);
  }

  var stop = function() {
    if (timer) {
      clearTimeout(timer);
      timer = 0;
    }
  }

  displayTime($rootScope.timezone_area);


  var user_id = JSON.parse($window.localStorage.getItem('userJSON')).employee_id;

  var client = "";
  var client_team = "";
  var team = "";
  var region = "";
  var service = "";
  var filename = "";
  var value = "";
  var Sr_no = "";

  $scope.headersData = [];
  //================================ start of complianceReportOnLoad function ====================================
  $scope.complianceReportOnLoad = function() {
    console.log("In complianceReportOnLoad function");

    var parameters = {
      "user_id": user_id,
    };
    complianceReportService.getOnLoadComplianceReportService(parameters).then(projectResponseOnLoad)

    function projectResponseOnLoad(response) {
      if (response != "error") {
        $scope.serviceList = response.recordsets[0];
        $scope.clientList = response.recordsets[1];
        $scope.clientTeamListTemp = response.recordsets[2];
        $scope.teamList = response.recordsets[3];
        $scope.regionListTemp = response.recordsets[4];
      } else {
        alert("Some error occurred!!");
      }
    } //end of projectResponseOnLoad
    //========================= start of changeClient function ==================================
    $scope.changeClient = function() {
      $scope.clientTeamList = [];
      $scope.regionList = [];

      if ($scope.clientModel !== null && $scope.clientModel !== undefined && $scope.clientModel !== "") {
        for (var j = 0; j < $scope.clientTeamListTemp.length; j++) {
          if ($scope.clientModel.client_id == $scope.clientTeamListTemp[j].client_id) {
            $scope.clientTeamList.push($scope.clientTeamListTemp[j]);
          }
        }
      } else {
        $scope.clientModel = "";
      }

      for (var k = 0; k < $scope.regionListTemp.length; k++) {
        if ($scope.clientModel.client_id == $scope.regionListTemp[k].client_id) {
          $scope.regionList.push($scope.regionListTemp[k]);
        }
      }

    } //end of $scope.changeClient function
    //========================================== end of changeClient function ===============================
  } //end of $scope.complianceReportOnLoad
  $scope.complianceReportOnLoad();
  //================================== end of complianceReportOnLoad function =============================

  $scope.errors_overdue = function() {
    console.log("In errors_overdue function");

    $scope.activeClass = "nav-item active";
  }

  //====================================== start of search function =======================================
  $scope.search = function(value, identifier) {
    console.log("In search function");
    $scope.sortColumn = "attributed";
    var error_msg = "Highlighted field(s) are mandatory"
    var errorFlag = true;

    if (identifier == 'errors_overdue') {
      $scope.activeClass = "nav-item active";
    }

    type = value; // value is 'E' and identifier is errors_overdue, the tab which is bydefault opened

    //=============================================== validation checking ========================================
    if (!$scope.serviceModel || $scope.clientModel == null || $scope.clientModel == "" || $scope.clientModel == 'undefined') {
      if (!$scope.serviceModel) {
        $scope.serviceStyle = {
          "border-color": "red"
        };
        errorFlag = false;
      } else {
        $scope.serviceStyle = "";
      }
      if ($scope.clientModel == null || $scope.clientModel == "" || $scope.clientModel == 'undefined') {
        $scope.clientStyle = {
          "border-color": "red"
        };
        errorFlag = false;
      } else {
        $scope.clientStyle = "";
      }
    }

    if (errorFlag == false) {
      alert(error_msg);
      $scope.showMessage = false;
      $scope.showTable = false;
      $scope.tabs = false;
    } else {
      $scope.tabs = true;
      $scope.serviceStyle = "";
      $scope.clientStyle = "";
    }

    if ($scope.serviceModel && $scope.clientModel || $scope.clientTeamModel || $scope.teamModel || $scope.regionModel) {

      service = $scope.serviceModel.cfds_id;
      client = $scope.clientModel.client_id;

      if ($scope.clientTeamModel) {
        client_team = $scope.clientTeamModel.client_team_id;
      } else if (!$scope.clientTeamModel) {
        client_team = -99;
      }

      if ($scope.teamModel) {
        team = $scope.teamModel.team_id;
      } else if (!$scope.teamModel) {
        team = -99;
      }

      if ($scope.regionModel) {
        region = $scope.regionModel.client_region_id;
      } else if (!$scope.regionModel) {
        region = -99;
      }
    };
    //=================================== passing parameters to getTableComplianceReportService ====================
    parameters = {
      "user_id": user_id,
      "client": client,
      "client_team": client_team,
      "team": team,
      "region": region,
      "service": service,
      "type": type
    };
    console.log("search function parameters==>> " + JSON.stringify(parameters));
    complianceReportService.getTableComplianceReportService(parameters).then(projectResponseTable)

    function projectResponseTable(response) {
      if (response != "error") {
        $scope.errorReportList = response.recordsets[0];
        $scope.errorTableList = response.recordsets[1];

        for (var i = 0; i < $scope.errorTableList.length; i++) {
          $scope.errorTableList[i].serialNo = i + 1;
        }

        if ($scope.errorTableList.length == 0) {
          $scope.showTable = false;
          $scope.showMessage = false;
        } else {
          $scope.showTable = true;
          $scope.showMessage = true;
        }

      } else {
        alert("Some error occurred!!");
      }
    } //end of projectResponseTables
  } // end of search function
  // =========================================== end of $scope.search function ========================================

  //============================================ sorting columns of table =============================
  $scope.sortData = function(column) {
    $scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
    $scope.sortColumn = column;
  }

  $scope.getSortClass = function(column) {
    if ($scope.sortColumn == column) {
      return $scope.reverseSort ? 'glyphicon glyphicon-chevron-up' : 'glyphicon glyphicon-chevron-down';
    }
    return '';
  }
  //==================================================== end of $scope.tabsMethod function =============================

  //==================================================== start of $scope.exportExcel function =============================
    $scope.exportExcel = function() {
      console.log("In exportExcel function");

      function datenum(v, date1904) {
        if (date1904) v += 1462;
        var epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
      }

      function sheet_from_array_of_arrays(data, opts) {
        var ws = {};
        var range = {
          s: {
            c: 10000000,
            r: 10000000
          },
          e: {
            c: 0,
            r: 0
          }
        };
        for (var R = 0; R != data.length; ++R) {
          for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {
              v: data[R][C]
            };
            if (cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({
              c: C,
              r: R
            });

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
              cell.t = 'n';
              cell.z = XLSX.SSF._table[14];
              cell.v = datenum(cell.v);
            } else cell.t = 's';

            // if (R == 0) {
            //   cell.s = {
            //     font: {
            //       bold: true
            //     }
            //   }
            // }
            if (R == 0) {
              cell.s = {

                fill: {
                  fgColor: {
                    rgb: "FFFFAA00"
                  }
                },
                font: {
                  bold: true
                }
              }
            }

            ws[cell_ref] = cell;
          }
        }
        if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
      }


      function Workbook() {
        if (!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
      }


      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }

       var sr_Column = "";
       var client_team_Column = "";
       var service_name_Column = "";
       var project_name_Column = "";
       var mileStone_Column = "";
       var error_type_Column = "";
       var attribute_Column = "";
       var error_log_by_Column = "";
       var error_log_on_Column = "";

       var finalData = [];
       //pushing column header
       finalData.push(["Sr. no","Region","Service","Project Number/Name","Milestone","Error Type","Attributed To","ErrorLogged By","Error Logged On"]);

        for(var i=0;i<$scope.errorTableList.length;i++){
         sr_Column = $scope.errorTableList[i].serialNo;
         client_team_Column = $scope.errorTableList[i].client_team_name;
         service_name_Column= $scope.errorTableList[i].service_name;
         project_name_Column = $scope.errorTableList[i]['Project_number/name'];
         mileStone_Column = $scope.errorTableList[i].Event_Name;
         error_type_Column = $scope.errorTableList[i].error_type;
         attribute_Column = $scope.errorTableList[i].Attribution;
         error_log_by_Column = $scope.errorTableList[i].error_logged_by;
         error_log_on_Column = $scope.errorTableList[i].error_logged_on;

         var result = [];
         result.push(sr_Column,client_team_Column,service_name_Column,project_name_Column,mileStone_Column,
                      error_type_Column,attribute_Column,error_log_by_Column,error_log_on_Column);
          //pushing final data
          finalData.push(result);
        }//end of for loop

       var ws_name = "SheetJS";
       var ws_name1 = "SheetJS1";
       var ws_name2 = "SheetJS2";



       var wb = new Workbook(),

         ws = sheet_from_array_of_arrays(finalData);
         ws2 = sheet_from_array_of_arrays(finalData);
         ws3 = sheet_from_array_of_arrays(finalData);

       /* add worksheet to workbook */
       wb.SheetNames.push(ws_name);
       wb.SheetNames.push(ws_name1);
       wb.SheetNames.push(ws_name2);


       wb.Sheets[ws_name] = ws;
       wb.Sheets[ws_name1] = ws2;
       wb.Sheets[ws_name2] = ws3;



       var wbout = XLSX.write(wb, {
         bookType: 'xlsx',
         bookSST: true,
         type: 'binary'
       });
       console.log(wb);
       saveAs(new Blob([s2ab(wbout)], {
         type: "application/octet-stream"
       }), "ComplianceReports.xlsx")

      function read() {
        /* set up XMLHttpRequest */
        var url = "ComplianceReports.xlsx";
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function(e) {
          var arraybuffer = oReq.response;

          /* convert data to binary string */
          var data = new Uint8Array(arraybuffer);
          var arr = new Array();
          for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");

          /* Call XLSX */
          var workbook = XLSX.read(bstr, {
            type: "binary"
          });
          console.log("workbook ===>>>> "+workbook);
          /* DO SOMETHING WITH workbook HERE */

          var first_sheet_name = workbook.SheetNames[1];
          var address_of_cell = 'A2';

          /* Get worksheet */
          var worksheet = workbook.Sheets[first_sheet_name];

          /* Find desired cell */
          var desired_cell = worksheet[address_of_cell];

          /* Get the value */
          var desired_value = desired_cell.v;


          var wb = new Workbook(),
            ws = worksheet;

          /* add worksheet to workbook */
          wb.SheetNames.push("new");
          wb.Sheets["new"] = ws;
          var wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            bookSST: true,
            type: 'binary'
          });

          saveAs(new Blob([s2ab(wbout)], {
            type: "application/octet-stream"
          }), "ComplianceReports.xlsx")
        }

        oReq.send();
      }//end of read function
  }//end of exportExcel function
  //==================================================== end of $scope.exportExcel function ===========================
}]); //end of workflow.controller
//==================================================== end of  workflow.controller function ============================
