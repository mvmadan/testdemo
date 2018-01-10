workflow.controller("misExcelReportController", ['$scope', 'Upload', '$rootScope', '$window', '$http', '$timeout', '$q', '$log', '$filter', 'misExcelReportService', function($scope, Upload, $rootScope, $window, $http, $timeout, $q, $log, $filter, misExcelReportService) {

  $scope.isLoggedIn = JSON.parse($window.localStorage.getItem('userJSON')).loggedIn;
  $scope.loggedInUser = JSON.parse($window.localStorage.getItem('userJSON')).employee_name;
  var user_id = JSON.parse($window.localStorage.getItem('userJSON')).employee_id;

  var parameters = {
    "user_id": user_id,
  };

  misExcelReportService.getMisExcelReportService(parameters).then(projectResponseMisExcelReport)

  function projectResponseMisExcelReport(response) {
    if (response != "error") {

      $scope.MisExcelReportList0 = response.recordsets[0];
      $scope.MisExcelReportList2 = response.recordsets[2];
      $scope.MisExcelReportList3 = response.recordsets[3];
      $scope.MisExcelReportList4 = response.recordsets[4];
    } //end of function projectResponseMisExcelReport
  }

  //==================================================== start of $scope.misExcelReport function =============================
  $scope.misExcelReport = function() {
    console.log("In misExcelReport function");

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

          if (C == 0) {
            cell.s = {
              font: {
                bold: true
              }
            }
          }
          if (R == 0) {
            cell.s = {
              fill: {
                fgColor: {
                  rgb: "FFFFAA00"
                }
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

    var diff_name = "";
    var month = "";
    var year = "";

    var totalErrorThisMonth = "";
    var internalError = "";
    var externalError = "";
    var previousMonth = "";
    var totalYTD = "";

    var employee_id = "";
    var complexity = "";
    var hours = "";

    var emp_id = "";
    var task_name = "";
    var executed_hours = "";

    var finalData = [];
    var finalData2 = [];
    var finalData3 = [];
    var finalData4 = [];

    //pushing column header
    finalData.push(["Differentiator Name", "This Month", "This Year"]);

    finalData2.push(["Total Errors For This Month", "Internal Errors For This Month", "External Errors For This Month", "Total Errors Previous Month", "Total Erros YTD"]);

    finalData3.push(["Employee Id", "Complexity", "% Executed Hours"]);

    finalData4.push(["Employee Id", "Task Name", "% Executed Hours"])


    for (var i = 0; i < $scope.MisExcelReportList0.length; i++) {
      diff_name = $scope.MisExcelReportList0[i].differentiator_name;
      month = $scope.MisExcelReportList0[i].This_Month;
      year = $scope.MisExcelReportList0[i].This_Year;

      var result = [];
      result.push(diff_name, month, year);
      //pushing final data
      finalData.push(result);
    } //end of for loop

    for (var i = 0; i < $scope.MisExcelReportList2.length; i++) {
      totalErrorThisMonth = $scope.MisExcelReportList2[i].Total_Errors_For_This_Month;
      internalError = $scope.MisExcelReportList2[i].INTernal_Errors_For_This_Month;
      externalError = $scope.MisExcelReportList2[i].External_Errors_For_This_Month;
      previousMonth = $scope.MisExcelReportList2[i].Total_Errors_previous_month;
      totalYTD = $scope.MisExcelReportList2[i].Total_Errors_YTD;

      var result2 = [];
      result2.push(totalErrorThisMonth, internalError, externalError, previousMonth, totalYTD);
      //pushing final data
      finalData2.push(result2);
    } //end of for loop

    for (var i = 0; i < $scope.MisExcelReportList3.length; i++) {
      employee_id = $scope.MisExcelReportList3[i].Employee_Id;
      complexity = $scope.MisExcelReportList3[i].Complexity;
      hours = $scope.MisExcelReportList3[i].perc_Executed_Hours;

      var result3 = [];
      result3.push(employee_id, complexity, hours);
      //pushing final data
      finalData3.push(result3);
    } //end of for loop

    for (var i = 0; i < $scope.MisExcelReportList4.length; i++) {
      emp_id = $scope.MisExcelReportList4[i].Employee_Id;
      task_name = $scope.MisExcelReportList4[i].Task_Name;
      executed_hours = $scope.MisExcelReportList4[i].perc_Executed_Hours;

      var result4 = [];
      result4.push(emp_id, task_name, executed_hours);
      //pushing final data
      finalData4.push(result4);
    } //end of for loop

    var name = "name";
    var errors = "errors";
    var complexity = "complexity";
    var task = "task";

    var wb = new Workbook(),

      ws = sheet_from_array_of_arrays(finalData);
    ws2 = sheet_from_array_of_arrays(finalData2);
    ws3 = sheet_from_array_of_arrays(finalData3);
    ws4 = sheet_from_array_of_arrays(finalData4);

    /* add worksheet to workbook */
    wb.SheetNames.push(name);
    wb.SheetNames.push(errors);
    wb.SheetNames.push(complexity);
    wb.SheetNames.push(task);

    wb.Sheets[name] = ws;
    wb.Sheets[errors] = ws2;
    wb.Sheets[complexity] = ws3;
    wb.Sheets[task] = ws4;

    var wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });
    console.log(wb);

    var zip = new JSZip();
    zip.file("MIS_Excel_Report.xlsx", wbout, {
      binary: true
    });

    zip.generateAsync({
        type: "blob"
      })
      .then(function(content) {
        saveAs(content, "MIS_Zip_File.zip");
      });

    //  saveAs(new Blob([s2ab(wbout)], {
    //    type: "application/octet-stream"
    //  }), "MIS_Excel_Report.xlsx")
    //==============================================================================================================
    function read() {
      /* set up XMLHttpRequest */
      var url = "MIS_Excel_Report.xlsx";
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
        console.log("workbook ===>>>> " + workbook);
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
        }), "MIS_Excel_Report.xlsx")
      }

      oReq.send();
    } //end of read function
  } //end of exportExcel function
  //==================================================== end of $scope.exportExcel function ===========================
}]); //end of workflow.controller
