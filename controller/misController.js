(function() {
  workflow.controller('misController', ['$scope', '$rootScope', '$window', '$http', '$timeout', '$q', '$log', '$filter', 'misService', misController]);

  function misController($scope, $rootScope, $window, $http, $timeout, $q, $log, $filter, misService) {

    $('#navbarHeaderId').removeClass('classTwo').addClass('classOne')
    $('#navbarSidebarId').removeClass('classTwo').addClass('classOne')

    $rootScope.isLoggedIn = JSON.parse($window.localStorage.getItem('userJSON')).loggedIn;
    $rootScope.loggedInUser = JSON.parse($window.localStorage.getItem('userJSON')).employee_name;
    $rootScope.outerShowMenuList = JSON.parse($window.localStorage.getItem('outerShowMenuList'));
    //console.log(" >> menu >> "+JSON.parse($window.localStorage.getItem('outerShowMenuList')));
    $rootScope.selectedTimezone = $window.localStorage.getItem('selectedTimezone');
    $rootScope.timezone_area = $window.localStorage.getItem('timezone_area');
    $rootScope.timezoneList = JSON.parse($window.localStorage.getItem('timezoneList'));

    $rootScope.showSelecteTimezone = function(){

      var timezoneId;
      for(var i=0;i<$rootScope.timezoneList.length;i++)
      {

        if($rootScope.selectedTimezone == $rootScope.timezoneList[i].timezone_short_name){
          $rootScope.timezone_area = $rootScope.timezoneList[i].timezone_area;
          timezoneId = $rootScope.timezoneList[i].timezone_id;
        }
      }

      var userId = JSON.parse($window.localStorage.getItem('userJSON')).employee_id;
      loginService.timezone({"emp_id":userId,"timezoneId":timezoneId})
      .then(function(response) {

        if( response.recordsets[0][0] != undefined && response.recordsets[0][0].Success != "0" ){
          if(response.recordsets[0][0].Success == '1')
          {
            stop();
            displayTime($rootScope.timezone_area);
            var t1 = moment().tz($rootScope.timezone_area).format("Z").replace(":",".");
            var t2 = moment().tz("Asia/kolkata").format("Z").replace(":",".");
            var t3 = t1 - t2;
            $rootScope.offset_wrtIST = t3;
            storage.save('selectedTimezone',$rootScope.selectedTimezone);
            storage.save('timezone_area',$rootScope.timezone_area);
            angular.element(document.querySelector('#myModal')).modal('hide');
          }
        }
       },
      function(error) {
          console.log("***Error in menu***");
      });
    }
    var timer = 0;
    var displayTime = function(timezone)
    {

      var time = moment().tz(timezone).format('LLLL');
      $('#clock').html(time);
      timer = setTimeout(function(){displayTime(timezone)}, 1000);
    }

    var stop = function(){
      if (timer) {
        clearTimeout(timer);
        timer = 0;
      }
    }

    displayTime($rootScope.timezone_area);

    /*=============Declaration part==============*/
    var userId = JSON.parse($window.localStorage.getItem('userJSON')).employee_id;
    var date;
    var userId = userId;
    var theHelp = Chart.helpers;

    var leftCount = 0;
    var rightCount = 0;

    $scope.month1;
    $scope.month2;
    $scope.month3;

    $scope.hideMyPage = false;

    function onLoadDate(){

      misService.onLoadDate().then(projectResp, getError).catch(errorCallback);
      function projectResp(response) {
        if (response != "error") {
          date = response.recordsets[0][0].TODAY_DATE;
          $scope.currentDate =  $filter('date')( date, "dd-MMM-yy");
        }
        else {
          alert("Some error occurred!!");
        };
      };
    };


    function onLoadData() {

      var param = {
        "employee_id" : userId,
        "date" : $filter('date')(new Date(), "dd MMM yyyy")
      };

      misService.onLoadData(param).then(projectResp, getError).catch(errorCallback);

      document.getElementById('loadTT').style.visibility="visible";

      function projectResp(response) {

        if (response && response != "error") {
          $scope.hideMyPage = true;

          $scope.differentitatorsData = misService.differentitatorsData(response.recordsets[0]);
          $scope.differentitatorsDataSatisfaction = response.recordsets[0] ? response.recordsets[0][1] : "0" ;
          $scope.differentitatorsDataEscalations = response.recordsets[0] ? response.recordsets[0][2] : "0";
          $scope.differentitatorsDataDelays = response.recordsets[0] ? response.recordsets[0][3] : "0";
          $scope.differentitatorsDataDefault = response.recordsets[0] ? response.recordsets[0][0] : "0";

          $scope.differentitatorsExcelData = response.recordsets[0].length > 0 ? response.recordsets[0] : false;

          $scope.errorsData = response.recordsets[2][0] ? misService.errorData(response.recordsets[2][0]) : [0,100];

          $scope.billableUtilizationThisMonth = response.recordsets[5][0] ? response.recordsets[5][0].executed_hours_This_Month + " hrs" : 0 + " hrs";
          $scope.percentageBillableUtilizationThisMonth = response.recordsets[5][0] ? response.recordsets[5][0].Perc_executed_hours_This_Month + "%" : 0 + "%";
          $scope.percentageBillableHoursLastMonth = response.recordsets[5][0] ? response.recordsets[5][0].Per_executed_hours_Last_Month + "%" : 0 + "%";
          $scope.percentageBillableHoursYTD = response.recordsets[5][0] ? response.recordsets[5][0].Per_Executed_hours_YTD + "%" : 0 + "%";
          $scope.yesterdayBillableUtilization = response.recordsets[5][0] ? response.recordsets[5][0].Yesterday + "hrs" : 0 + "hrs";
          $scope.billableUtilization = response.recordsets[5][0] ? response.recordsets[5][0].Billable_hours + " hrs" : 0 + "hrs";
          $scope.nonBillableUtilization = response.recordsets[5][0] ? response.recordsets[5][0].NonBillable_Yesterday + " hrs" : 0 + "hrs";

          $scope.complexityData = response.recordsets[3] ? response.recordsets[3] : "0";
          $scope.timeSpentOnTaskData = response.recordsets[4] ? response.recordsets[4] : "0";

          $scope.targetHours = response.recordsets[7][0].target_working_hours ? response.recordsets[7][0].target_working_hours + " hrs" : 0 + " hrs" ;
          $scope.currentRate = response.recordsets[8][0].current_rate ? response.recordsets[8][0].current_rate + " hrs" : 0 + " hrs" ;
          $scope.requireRate = response.recordsets[9][0].required_rate ? response.recordsets[9][0].required_rate + " hrs" : 0 + " hrs" ;

          $scope.rnrObj = response.recordsets[10];
          $scope.rnrData = response.recordsets[10][0];
          //$scope.rnrData.Rnr_Year = response.recordsets[10][0].Rnr_Year || 2017;

          $scope.currentMonth = response.recordsets[11][0] ? response.recordsets[11][0].this_month : "0";
          $scope.lastMonth = response.recordsets[12][0] ? response.recordsets[12][0].previous_month : "0";
          $scope.previousDay = response.recordsets[13][0] ? response.recordsets[13][0].yesterday : "0";
          $scope.ytdYear = response.recordsets[14][0] ? response.recordsets[14][0].ytd_fy : "0";

          $scope.adhocVsTracker = response.recordsets[15];

          $scope.leaves = misService.getScheduled_UnscheduledLeaves(response.recordsets[1][0],$scope.ytdYear);

          /*to show no data image in case no data in Adhoc Vs Tracker*/
          $scope.showAdhocVsTracker = $scope.adhocData == 0  && $scope.trackerData == 0 ? true : false;

          /*to show no data image in case no data in Complexity Vs Execution*/
          var showComplexityVSExecutionFunction = function(){

            var count = $scope.complexityData.length;
            var innerCount = 0;
            $scope.showComplexityVSExecution = false;
           angular.forEach($scope.complexityData,function(value,key)
            {
              if(value.perc_Executed_Hours == 0){
                innerCount++;
            };
            });
            if(count == innerCount || !$scope.complexityData){
              $scope.showComplexityVSExecution = true
            }
          };

          /*to show no data image in case no data in Time spent on billable task*/
          var showTimeSpentOnbillTaskFunction = function(){

            var count = $scope.timeSpentOnTaskData.length;
            var innerCount = 0;
            $scope.showTimeSpentOnbillTask = false;
           angular.forEach($scope.timeSpentOnTaskData,function(value,key)
            {
              if(value.perc_Executed_Hours == 0 || !$scope.timeSpentOnTaskData){
                innerCount++;
            };
            });
            if(count == innerCount){
              $scope.showTimeSpentOnbillTask = true
            }
          };

          showComplexityVSExecutionFunction();
          showTimeSpentOnbillTaskFunction();

          if(!$scope.rnrObj[0]) {

            $scope.rnrList = [

              {"month" : "Apr-17"  , "color_code" : "#5959a0" , "IS_Curr_Month" : "N"},
              {"month" : "May-17"  , "color_code" : "#e06741" , "IS_Curr_Month" : "N"},
              {"month" : "Jun-17"  , "color_code" : "#a29595" , "IS_Curr_Month" : "N"},
              {"month" : "Jul-17"  , "color_code" : "#e06741" , "IS_Curr_Month" : "N"},
              {"month" : "Aug-17"  , "color_code" : "#a29595" , "IS_Curr_Month" : "N"},
              {"month" : "Sep-17"  , "color_code":  "#5959a0" , "IS_Curr_Month" : "N"},
              {"month" : "Oct-17"  , "color_code" : "#e06741" , "IS_Curr_Month" : "N"},
              {"month" : "Nov-17"  , "color_code" : "#a29595" , "IS_Curr_Month" : "Y"}];

              angular.forEach($scope.rnrList,function(value,key){
                if(value.IS_Curr_Month == 'Y'){
                  value.highlightColor = '#0574ea',
                  value.highlightStyle = {
                    "border" : "1px solid #7098e0",
                    "border-radius" : "36px",
                    "margin" : "1px",
                    "background-color" : "#e8f3ff"
                  }
                }
              })
          }

          else{
            if($scope.rnrObj){
              angular.forEach($scope.rnrObj,function(value,key){
                if(value.IS_Curr_Month == 'Y'){
                  value.highlightColor = '#686868',
                  value.highlightStyle = {
                    "border" : "1px solid #7098e0",
                    "border-radius" : "36px",
                    "margin" : "1px",
                    "background-color" : "#e8f3ff"
                  }
                }
              })
              $scope.rnrList = $scope.rnrObj
            }
          }

          $scope.month1 = $scope.rnrList[0].month;
          $scope.month2 = $scope.rnrList[1].month;
          $scope.month3 = $scope.rnrList[2].month;


          $scope.rightList = function(){

            rightCount++;

            if($scope.rnrList.length > 3 ) {
              if(rightCount <= $scope.rnrList.length - 3) {
                $scope.rnrList.push($scope.rnrList.shift())
                $scope.month1 = $scope.rnrList[0].month;
                $scope.month2 = $scope.rnrList[1].month;
                $scope.month3 = $scope.rnrList[2].month;
              };
            };
            if(rightCount > $scope.rnrList.length - 3) {
              rightCount = $scope.rnrList.length - 3;
            };
            if(leftCount == rightCount){
              rightCount = 0;
            }

          };


          $scope.leftlist = function(){

            if(rightCount == 0) {
              leftCount = 0;
              //rightCount = 0;
            }
            else{
              leftCount++
            };


            if(rightCount > 0) {
              if($scope.rnrList.length > 3) {
                if(leftCount <= rightCount ) {
                  $scope.rnrList.unshift($scope.rnrList.pop());
                  $scope.month1 = $scope.rnrList[0].month;
                  $scope.month2 = $scope.rnrList[1].month;
                  $scope.month3 = $scope.rnrList[2].month;
                }
              };
            };

            if(leftCount > rightCount) {
              leftCount = rightCount
            }

            if(leftCount == rightCount){
              leftCount = 0;
              rightCount = 0;
            }
          };

          /*Billable doghnut graph data*/
          $scope.utilizationLabels = ["Billable Utilization"];

          if(response.recordsets[5][0]){
            $scope.utilizationData = response.recordsets[5][0].Perc_executed_hours_This_Month > 100 ? [response.recordsets[5][0].Perc_executed_hours_This_Month] : [response.recordsets[5][0] ? response.recordsets[5][0].Perc_executed_hours_This_Month : 0, 100 - (response.recordsets[5][0] ? response.recordsets[5][0].Perc_executed_hours_This_Month : 0)];
          }
          else{
            $scope.utilizationData = [0,100]
          };

          $scope.utilizationColor= ['#00c5ed','#d9e1e6'];
          $scope.utilizationOptions =  {
            maintainAspectRatio: false,
            responsive: true,
            tooltips : {
                enabled: false
              },
            cutoutPercentage: 75
          }


          /*Error Count Doughnut chart data*/
          $scope.errorLabel = ["This Month"];
          //errorData service has been call to get errors data
          $scope.errorData =  [$scope.errorsData.dataWeight,100-$scope.errorsData.dataWeight];
          $scope.errorChartColor= ['#f76a6a','#d9e1e6'];

          $scope.errorChartOptions =  {
            maintainAspectRatio: false,
            responsive: true,
            tooltips : {
                enabled: false
              },
            cutoutPercentage: 75
          }



          /*Complexity Vs Execution Pie Chart data*/
          $scope.complexityChartData = misService.getcomplexityDataShowData($scope.complexityData);
          $scope.complexityChartLabel = misService.getcomplexityDataShowLabel($scope.complexityData);
          $scope.complexityChartHours = misService.getcomplexityDataShowHours($scope.complexityData);
          $scope.complexityChartColor = ['#00c5ed' , '#00abe0', '#0096d4','#007ec6','#006ebb','#0055a1','#005098','#003f76','#00355f']
          $scope.complexityChartOptions =  {
            maintainAspectRatio: false,
            responsive: true,
            tooltips: {
              callbacks: {
                // title: function(tooltipItem, data){
                //   return 'Hours : ' + '2Hrs'
                // },
                label: function(tooltipItem, data) {
                return  $scope.complexityChartLabel[JSON.stringify(tooltipItem.index)] + ' : ' +$scope.complexityChartData[JSON.stringify(tooltipItem.index)] + '%' + ' | ' +  $scope.complexityChartHours[JSON.stringify(tooltipItem.index)] + ' Hrs';
                }
              }
            },
            legend: {
            display: true,
            position: 'right',
            // generateLabels changes from chart to chart
            labels: {
              fontSize : 10,
              usePointStyle:true,
              boxWidth : 13,
              padding : 6,
              generateLabels: function(chart) {
                var data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map(function(label, i) {
                    var meta = chart.getDatasetMeta(0);
                    var ds = data.datasets[0];
                    var arc = meta.data[i];
                    var custom = arc && arc.custom || {};
                    var getValueAtIndexOrDefault = theHelp.getValueAtIndexOrDefault;
                    var arcOpts = chart.options.elements.arc;
                    var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                    var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                    var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
                      return {
                      // And finally :
                      text: label + " - " + ds.data[i] + "%",
                      fillStyle: fill,
                      strokeStyle: stroke,
                      lineWidth: bw,
                      hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
            }
          }

          /*Adhoc Vs Tracker Pie Chart data*/
          $scope.adhocVsTrackerChartData =  misService.getAdhocVsTrackerShowData($scope.adhocVsTracker);
          $scope.adhocVsTrackerLabel = misService.getAdhocVsTrackerShowLabel($scope.adhocVsTracker);
          $scope.adhocVsTrackerHours = misService.getAdhocVsTrackerShowHours($scope.adhocVsTracker);
          $scope.adhocVsTrackerColor = ['#00c5ed' , '#00abe0', '#0096d4','#007ec6','#006ebb','#0055a1','#005098','#003f76','#00355f']
          $scope.adhocVsTrackerOptions =  {
            maintainAspectRatio: false,
            tooltips: {
              callbacks: {
                // title: function(tooltipItem, data){
                //   return 'Hours : ' + '2Hrs'
                // },
                label: function(tooltipItem, data) {
                return  $scope.adhocVsTrackerLabel[JSON.stringify(tooltipItem.index)] + ' : ' + $scope.adhocVsTrackerChartData[JSON.stringify(tooltipItem.index)] + '%' + ' | ' + $scope.adhocVsTrackerHours[JSON.stringify(tooltipItem.index)] + ' Hrs';
                }
              }
            },
            responsive:true,
            legend: {
            display: true,
            position: 'right',
            // generateLabels changes from chart to chart
            labels: {
              fontSize : 10,
              usePointStyle:true,
              boxWidth : 13,
              padding : 6,
              generateLabels: function(chart) {
                var data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map(function(label, i) {
                    var meta = chart.getDatasetMeta(0);
                    var ds = data.datasets[0];
                    var arc = meta.data[i];
                    var custom = arc && arc.custom || {};
                    var getValueAtIndexOrDefault = theHelp.getValueAtIndexOrDefault;
                    var arcOpts = chart.options.elements.arc;
                    var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                    var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                    var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
                      return {
                      // And finally :
                      text: label + " - " + ds.data[i] + "%",
                      fillStyle: fill,
                      strokeStyle: stroke,
                      lineWidth: bw,
                      hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
            }
          }


          /*Time Spent on Task Data Pie Chart data*/
          $scope.timeSpentOnTaskShowData = misService.getTimeSpentOnTaskDataShowData($scope.timeSpentOnTaskData);
          $scope.timeSpentOnTaskShowLabel = misService.getTimeSpentOnTaskDataShowLabel($scope.timeSpentOnTaskData);
          $scope.timeSpentOnTaskShowHours = misService.getTimeSpentOnTaskDataShowHours($scope.timeSpentOnTaskData);
          $scope.timeSpentChartColor = ['#00c5ed' , '#00abe0', '#0096d4','#007ec6','#006ebb','#0055a1','#005098','#003f76','#00355f']
          $scope.timeSpentChartOptions =  {
            maintainAspectRatio: false,
            responsive: true,
            dynamicDisplay : false,
            tooltips: {
              callbacks: {
                // title: function(tooltipItem, data){
                //   return 'Hours : ' + '2Hrs'
                // },
                label: function(tooltipItem, data) {
                return  $scope.timeSpentOnTaskShowLabel[JSON.stringify(tooltipItem.index)] + ' : ' +$scope.timeSpentOnTaskShowData[JSON.stringify(tooltipItem.index)] + '%' + ' | ' + $scope.timeSpentOnTaskShowHours[JSON.stringify(tooltipItem.index)] +  ' Hrs';
                }
              }
            },
            legend: {
            display: true,
            position: 'right',
            // generateLabels changes from chart to chart
            labels: {
              fontSize : 10,
              fullWidth: true,
              usePointStyle:true,
              boxWidth : 13,
              padding : 6,
              generateLabels: function(chart) {
                var data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map(function(label, i) {
                    var meta = chart.getDatasetMeta(0);
                    var ds = data.datasets[0];
                    var arc = meta.data[i];
                    var custom = arc && arc.custom || {};
                    var getValueAtIndexOrDefault = theHelp.getValueAtIndexOrDefault;
                    var arcOpts = chart.options.elements.arc;
                    var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                    var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                    var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
                      return {
                      // And finally :
                      text: label + " - " + ds.data[i] + "%",
                      fillStyle: fill,
                      strokeStyle: stroke,
                      lineWidth: bw,
                      hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                      index: i
                    };
                  });
                }
                return [];
              }
            }

            }
          }
        }
        else
        {
          alert("Some error occurred!!");
        }
        document.getElementById('loadTT').style.visibility="hidden";
      }
    };

/*
    //==================================================== start of $scope.misExcelReport function =============================
$scope.excelExport = function() {
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
  finalData.push(["Differentiator Name", "Current Month", "Current Year"]);

  finalData2.push(["Total Errors For This Month", "Internal Errors For This Month", "External Errors For This Month", "Total Errors Previous Month", "Total Erros YTD"]);

  finalData3.push(["Employee Id", "Complexity", "% Executed Hours"]);

  finalData4.push(["Employee Id", "Task Name", "% Executed Hours"])

  if()
  for (var i = 0; i < $scope.differentitatorsData.length; i++) {
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

  // add worksheet to workbook
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


// code for zip
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
    // set up XMLHttpRequest
    var url = "MIS_Excel_Report.xlsx";
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(e) {
      var arraybuffer = oReq.response;

      //convert data to binary string
      var data = new Uint8Array(arraybuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");

      // Call XLSX
      var workbook = XLSX.read(bstr, {
        type: "binary"
      });
      console.log("workbook ===>>>> " + workbook);
      // DO SOMETHING WITH workbook HERE

      var first_sheet_name = workbook.SheetNames[1];
      var address_of_cell = 'A2';

      // Get worksheet
      var worksheet = workbook.Sheets[first_sheet_name];

      // Find desired cell
      var desired_cell = worksheet[address_of_cell];

      // Get the value
      var desired_value = desired_cell.v;


      var wb = new Workbook(),
        ws = worksheet;

      // add worksheet to workbook
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
*/

    /*Promise reject function*/
    function getError(reason) {
      console.log(reason);
    };


    /*Promise CATCH function*/
    function errorCallback(errorMessage) {
      console.log(errorMessage);
    };


    /*Function Call on Load*/
    onLoadData();
    onLoadDate();
    //$scope.showComplexityVSExecution();

  }
})();
