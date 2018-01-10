/***************Time Tracker variables start here****************/
var projectList_array = [];
var activeprojectList_array = [];
var entities = [];
var activities_array = [];
var names = [];
var todayprojectList_array = [];
var futureproject_array = [];
var non_project_activities_array = [];
/***************Time Tracker variables end here***************/
(function() {
  workflow.controller('timeTrackerController', ['$scope', '$http', '$rootScope', '$timeout', '$q', '$log', '$window', '$filter', 'timeTrackerService', '$timepicker', 'CONSTANT', 'States','StopwatchFactory','$state','$stateParams', 'loginService', 'storage', timeTrackerController]);

  function timeTrackerController($scope, $http, $rootScope, $timeout, $q, $log, $window, $filter, timeTrackerService, $timepicker, CONSTANT, States, StopwatchFactory, $state, $stateParams, loginService, storage) {

    $scope.select = {};

    console.log("from TimeTracker controller");
    $rootScope.isLoggedIn = JSON.parse($window.localStorage.getItem('userJSON')).loggedIn;
    $rootScope.loggedInUser = JSON.parse($window.localStorage.getItem('userJSON')).employee_name;
    $rootScope.outerShowMenuList = JSON.parse($window.localStorage.getItem('outerShowMenuList'));
    console.log(" >> menu >> "+JSON.parse($window.localStorage.getItem('outerShowMenuList')));
    $rootScope.selectedTimezone = $window.localStorage.getItem('selectedTimezone');
    $rootScope.timezone_area = $window.localStorage.getItem('timezone_area');
    $rootScope.timezoneList = JSON.parse($window.localStorage.getItem('timezoneList'));

    $rootScope.showSelecteTimezone = function(){
      console.log(" >> timezoneList >> "+$rootScope.timezoneList.length);
      var timezoneId;
      for(var i=0;i<$rootScope.timezoneList.length;i++)
      {
        console.log(" >> Timezone >> "+$rootScope.timezoneList[i].isSelected);
        if($rootScope.selectedTimezone == $rootScope.timezoneList[i].timezone_short_name){
          $rootScope.timezone_area = $rootScope.timezoneList[i].timezone_area;
          timezoneId = $rootScope.timezoneList[i].timezone_id;
        }
      }
      console.log(" >> selectedTimezone >> "+$rootScope.selectedTimezone);
      console.log(" >> timezone_area >> "+$rootScope.timezone_area);
      var userId = JSON.parse($window.localStorage.getItem('userJSON')).employee_id;
      loginService.timezone({"emp_id":userId,"timezoneId":timezoneId})
      .then(function(response) {
        console.log(" >> response >> "+response);
        if( response.recordsets[0][0] != undefined && response.recordsets[0][0].Success != "0" ){
          console.log(" >> Success >> "+response.recordsets[0][0].Success);
          if(response.recordsets[0][0].Success == '1')
          {
            stop();
            displayTime($rootScope.timezone_area);

            console.log(" >> offset >> "+new Date().getTimezoneOffset());
            console.log(" >> moment >> "+moment().tz("Asia/kolkata").format("Z"));
            console.log(" >> moment >> "+moment().tz($rootScope.timezone_area).format("Z"));
            var t1 = moment().tz($rootScope.timezone_area).format("Z").replace(":",".");
            var t2 = moment().tz("Asia/kolkata").format("Z").replace(":",".");
            var t3 = t1 - t2;
            $rootScope.offset_wrtIST = t3;
            console.log(" >> t1 >> "+t1+" >> t2 >> "+t2+" >> t3 >> "+t3);
            console.log(" >> moment >> "+moment().locale("en"));
            console.log(" >> moment >> "+moment().format('LLLL'));
            console.log(" >> timezone >> "+moment().tz("America/Los_Angeles").format('LLLL'));

            console.log(" >> selectedTimezone >> "+$rootScope.selectedTimezone);
            console.log(" >> timezone_area >> "+$rootScope.timezone_area);

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
      //console.log(">> displayTime <<");
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

    $scope.userId = JSON.parse($window.localStorage.getItem('userJSON')).employee_id;
    $scope.userCfdsId = JSON.parse($window.localStorage.getItem('userJSON')).cfds_id;
    $scope.selectedServiceTab = $scope.userCfdsId;
    $scope.deliveryDetailsShow = false;
    $scope.disablePeerDropdown = true;
    //$scope.task_date = Date.now();
    console.log("userCfdsId>>" + $scope.userCfdsId + "<<$scope.selectedServiceTab>>" + $scope.selectedServiceTab);
    /*****************Variable declaration starts here************/

    var calendarDate = $filter('date')(new Date(), "yyyy-MM-dd");

    $scope.swap = function() {
      alert($scope.selected);
      if ($scope.selected == 1)
        $scope.selected = 2;
      else
        $scope.selected = 1;
    }

    $scope.futureProjectone = [];
    $scope.showTable = {
      projectTable: false,
      nonProjectTable: false,
      h_projectTable: false,
      h_nonProjectTable: false,
      additionalHandoverTable: false
    }; /***variable for displaying/hiding project and non project tables****/
    /*****************Variable declaration ends here************/

    /********************************Tab section starts here***************************/
    /*$scope.tab = 1;
    $scope.tt = "tab-current";

    $scope.setTab = function(newTab) {
      $scope.tab = newTab;
      $scope.datepaginator().init();

      if (newTab === 1) {
        $scope.tt = "tab-current";
        $scope.ba = [];
        $scope.show = false;
        $scope.myObj = {
          "display": "display:none !important",
        }
      }

      if (newTab === 2) {
        $scope.ba = "tab-current";
        $scope.tt = [];

        $scope.show = true;
        $scope.getBilledActivities();
        $scope.myObj = {
          "display": "display:inline",
        }
      }
    };*/

    $scope.tab = 1;
    angular.element('.tab-content-sec').addClass('hide');
    angular.element('.tab-content-first').removeClass('hide');
    $scope.setTab = function(newTab) {
      if (newTab == 1) {
        angular.element('.tab-content-sec').addClass('hide');
        angular.element('.tab-content-first').removeClass('hide');
      }
      else{
        angular.element('.tab-content-sec').removeClass('hide');
        angular.element('.tab-content-first').addClass('hide');
        $scope.datepaginator().init();
      }
    }
    $scope.isSet = function(tabNum) {
      return $scope.tab === tabNum;
    };

    $scope.isServiceTab = function(tabNum) {
      /*console.log("tabNum>>>" + tabNum + "<<$scope.tab>>" + $scope.serviceTab);*/
      return $scope.serviceTab === tabNum;
    };

    /*$scope.showHideTable = function(list, listType) {
      if (list && list.length > 0 && listType === 'p') {
        console.log("In IF ProjectList");
        $scope.showTable.projectTable = true;
      } else if (list && list.length > 0 && listType === 'np') {
        $scope.showTable.nonProjectTable = true;
      } else if (list && list.length > 0 && listType === 'hp') {
        $scope.showTable.h_projectTable = true;
      } else if (list && list.length > 0 && listType === 'hnp') {
        $scope.showTable.h_nonProjectTable = true;
      } else if (list && list.length > 0 && listType === 'a') {
        $scope.showTable.additionalHandoverTable = true;
      } else {
        $scope.showTable.h_projectTable = false;
        $scope.showTable.h_nonProjectTable = false;
        $scope.showTable.additionalHandoverTable = false;
      }
    }*/

    $scope.showHandoverBtnFunc = function() {
      var now = moment().format("YYYY-MM-DD");;
      var then = moment(calendarDate).format("YYYY-MM-DD");

      console.log("now>>" + now + "<<then>>" + then);
      if (now === then) {
        console.log("calendarDate equals today");
        $scope.showHandoverBtn = true;
      } else {
        $scope.showHandoverBtn = false;
      }
    }
    $scope.showHandoverBtnFunc();
    /********************************Tab section ends here***************************/

    $scope.datepaginator = function() {
      console.log("In datepaginator");
      return {
        init: function() {
          $("#paginator4").datepaginator({
            size: "small",
            endDate: moment(Date.now()),
            startDateFormat: "YYYY-MM",
            onSelectedDateChanged: function(a, t) {
              calendarDate = moment(t).format("YYYY-MM-DD");
              console.log("calendarDate>>" + calendarDate);
              $scope.getBilledActivities();
              $scope.showHandoverBtnFunc();
              /*alert("Selected date: " + moment(t).format("Do, MMM YYYY"))*/
            }
          })
        }
      }
    };

    /*jQuery(document).ready(function() {
      $scope.datepaginator().init();
    });*/
    /**********************************************Service calls and Page functions in following order***************************
      1. $scope.stopwatches/timeout-------> For timer
      2. $scope.save_details--------------> saving deliverables and task for a project
      3. $scope.setServiceTab-------------> set service wise tasks on service tab selection
      4. $scope.changeTaskDate------------> new function to update task date in DB.. Not yet started...
      5. $scope.quickBill-----------------> billing the projects (unbilled & today's tasks only)
      6. String.prototype.toHHMMSS--------> return executed hours in HH:MM:SS for tasks added in time tracker
      7. $scope.onloadData----------------> page onload function calls
      8. $scope.hoverDeliver--------------> called on row project selection
      9. $scope.todoAdd-------------------> called on Add task button click
      10.$scope.remove--------------------> remove tasks from time tracker
      11.$scope.removeFuture--------------> remove future tasks from time tracker
      12.$scope.pauseAll------------------> pausing all tasks
      13.$scope.removeToday---------------> remove today tasks from time tracker
      14.$scope.getBilledActivities ------> page onload function
      15.$scope.edit ---------------------> edit Billed entries
      16.$scope.delete -------------------> delete Billed entries
    ****************************************************************************************************************************/

    /***Time Tracker function calls**/

    $scope.stopwatches = [{
      interval: 1000,
      log: []
    }];
    $scope.pause_array = [];
    $timeout(function() {

      /*var check_pause = angular.element('.glyphicon-pause').hasClass('ok');

      if (check_pause) {}*/

        $(".glyphicon-pause.ok").each(function(v, index) {
          var data_time = $(this).attr('time');
          $(this).click();
          $scope.pause_array.push(data_time);

        });


      console.log(" >> $scope.pause_array >> "+$scope.pause_array.length);
      console.log("valueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      angular.forEach($scope.pause_array, function(value, key) {
        console.log(value);
        $('.' + value + '-play').click();


      });


    }, 1000);

    /*$rootScope.outerShowMenuList = JSON.parse($window.localStorage.getItem('outerShowMenuList'));*/

    /*$scope.save_details = function(e) {
      var selected_exec_quantity = $scope.otherData[0].executed_quantity;
      var comment = $scope.comment;
      var peer_rework = $scope.peer_rework;
      var weekend_hours = $scope.weekend_hours;
      var delivery_name = $scope.delivery_name;
      $scope.right_project_id;
      $scope.time_tracker_task_id;

    }*/

    $scope.save_details = function(otheData,obj) {
      console.log(" >> client >> " + $scope.select.selectedClient);
      //console.log(e.project_id + "<<selectedClient>>" + $scope.select.selectedClient + "<<$scope.select.delivery_name>>" + $scope.select.delivery_name + " >> $scope.cat_activity_data[0] >> " + $scope.cat_activity_data[0]);
      console.log("time_tracker_task_id >>" + $scope.timeTracker_Task_id_qb);
      console.log("project_id >>" + $scope.timeTracker_project_qb);
      console.log("employee_id >> "+$scope.userId);
      console.log("task_id >>" + $scope.cat_activity_data[0]);
      console.log("delivery_name >>" + JSON.stringify($scope.select.delivery_name));
      console.log("executed_hours >> "+otheData.est_hours + ':' + otheData.est_mins);
      console.log("comments >>" + $scope.comment);
      console.log("weekend_hours >>" + otheData.weekend_hours);
      console.log("peer_rework >>" + otheData.peer_rework);
      if( otheData.peer_rework == 'Y' ){
        console.log("selectedEmployee >>" + otheData.selectedEmployee);
      }
      else{
        console.log("selectedEmployee >>" + 0);
      }

      console.log("executed_quantity >>" + otheData.executed_quantity);
      console.log("recurring >>" + $scope.Recurring_Task_qb);
      console.log("$data.p_date >>" + $filter('date')($scope.timeTracker_Date_qb, "yyyy-MM-dd"));



      if ($scope.timeTracker_project_qb === 0) {
        //deliverable_name = '';
        //deliverable_id = '';
        deliverable_id = '';
        p_deliverable_id = '';
        deliverable_name = '';
        client_id = ($scope.select.selectedClient == undefined || $scope.select.selectedClient == '-1') ? '' : $scope.select.selectedClient.id ;
      } else {
        //deliverable_name = $scope.select.delivery_name.name;
        //deliverable_id = $scope.select.delivery_name.id;
        deliverable_id = ($scope.select.delivery_name == undefined || $scope.select.delivery_name == '-1') ? '' : $scope.select.delivery_name.id;
        p_deliverable_id = ($scope.select.delivery_name == undefined || $scope.select.delivery_name == '-1') ? '' : $scope.select.delivery_name.p_deliverable_id ;
        deliverable_name = ($scope.select.delivery_name == undefined || $scope.select.delivery_name == '-1') ? '' : $scope.select.delivery_name.name;
        client_id = '';
      }
      console.log(" >> client_id >> "+client_id);
      console.log(" >> deliverable_id >> "+deliverable_id);
      console.log(" >> p_deliverable_id >> "+p_deliverable_id);
      console.log(" >> deliverable_name >> "+deliverable_name);
      /*var peer_name = [],
        peer_id = [],
        deliverable_name = [],
        deliverable_id = [],
        client_id = [],
        client_name = [];
      if ($scope.otherData[0].selectedEmployee) {
        peer_name = $scope.otherData[0].selectedEmployee.employee_name;
        peer_id = $scope.otherData[0].selectedEmployee.employee_id;
      } else {
        peer_name = '';
        peer_id = '';
      }

      if (e.project_id === 0) {
        deliverable_name = '';
        deliverable_id = '';
        p_deliverable_id = '';
        if( $scope.select.selectedClient != undefined || $scope.select.selectedClient != null ){
            client_id = $scope.select.selectedClient.client_id;
        }
        else{
          client_id = '';
        }

      } else {

        if( $scope.select.delivery_name != undefined || $scope.select.delivery_name != null ){
            p_deliverable_id = $scope.select.delivery_name.p_deliverable_id;
            deliverable_name = $scope.select.delivery_name.name;
            deliverable_id = $scope.select.delivery_name.id;
        }
        else{
          p_deliverable_id = '';
          deliverable_name = '';
          deliverable_id = '';
        }
        client_id = '';
      }*/
      var isErrorInSave = false;
      if( otheData.peer_rework == 'Y' && otheData.selectedEmployee ==  undefined){
        isErrorInSave = true;
      }
      if($scope.estHrsLabel != undefined && $scope.estHrsLabel != null && $scope.estHrsLabel != "" && $scope.estHrsLabel > 23 ){
        isErrorInSave = true;
      }
      if($scope.estMinsLabel != undefined && $scope.estMinsLabel != null  && $scope.estMinsLabel != "" && $scope.estMinsLabel > 59 ){
        isErrorInSave = true;
      }
      console.log(" >> isErrorInSave >> "+isErrorInSave);
      if(isErrorInSave){

        if( otheData.peer_rework == 'Y' && otheData.selectedEmployee ==  undefined){
          $scope.peerEmpAlert = "border: 1px solid red";
        }
        else{
          $scope.peerEmpAlert = "";
        }

        if($scope.estHrsLabel != undefined && $scope.estHrsLabel != null && $scope.estHrsLabel != "" && $scope.estHrsLabel > 23 ){
          $scope.estHrsLabelValidate ="border:1px solid red";
        }
        else{
          $scope.estHrsLabelValidate ="";
        }
        if($scope.estMinsLabel != undefined && $scope.estMinsLabel != null && $scope.estMinsLabel != "" && $scope.estMinsLabel > 59 ){
          $scope.estMinsLabelValidate ="border:1px solid red";
        }
        else{
          $scope.estMinsLabelValidate ="";
        }

      }
      else{
        if( otheData.peer_rework == 'Y' && otheData.selectedEmployee ==  undefined){
          $scope.peerEmpAlert = "border: 1px solid red";
        }
        else{
          $scope.peerEmpAlert = "";
        }

        if($scope.estHrsLabel != undefined && $scope.estHrsLabel != null && $scope.estHrsLabel != "" && $scope.estHrsLabel > 23 ){
          $scope.estHrsLabelValidate ="border:1px solid red";
        }
        else{
          $scope.estHrsLabelValidate ="";
        }
        if($scope.estMinsLabel != undefined && $scope.estMinsLabel != null && $scope.estMinsLabel != "" && $scope.estMinsLabel > 59 ){
          $scope.estMinsLabelValidate ="border:1px solid red";
        }
        else{
          $scope.estMinsLabelValidate ="";
        }

        $http({
          method: "GET",
          url: CONSTANT.API_URL + '/timeTracker/save_details',
          params: {
            P_comments: $scope.comment,
            P_isPeerRework: otheData.peer_rework,
            P_isWeekendHours: otheData.weekend_hours,
            P_deliverable_name: deliverable_name,
            P_deliverable_id: deliverable_id,
            P_employee_id: $scope.userId,
            P_task_id: $scope.cat_activity_data[0] ==  undefined ? '' : $scope.cat_activity_data[0],
            P_task_name: $scope.cat_activity_data[1] ==  undefined ? '' : $scope.cat_activity_data[1],
            P_selected_task_service_line: $scope.cat_activity_data[2] ==  undefined ? '' : $scope.cat_activity_data[2],
            P_category_id: "",
            P_project_deliverable_id: p_deliverable_id,
            project_id: $scope.right_project_id,
            P_time_tracker_task_id: $scope.timeTracker_Task_id_qb,
            P_peer_name: (otheData.selectedEmployee ==  undefined || otheData.selectedEmployee ==  '') ? '0' : otheData.selectedEmployee.employee_name,
            P_peer_id: (otheData.selectedEmployee ==  undefined || otheData.selectedEmployee ==  '') ? '0' : otheData.selectedEmployee.employee_id,
            P_est_hours: $scope.estHrsLabel,
            P_est_mins: $scope.estMinsLabel,
            P_client_id: client_id,
            P_quantity: otheData.executed_quantity,
            p_timeTDate: $filter('date')($scope.timeTracker_Date_qb, "yyyy-MM-dd")
          },
        }).then(function mySuccess(response) {
          console.log(response);

          $.toast({
            heading: 'Successfully saved!',
            text: 'Task is saved Successfully.',
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'success',
            hideAfter: 3500,
            stack: 6
          });

        }, function myError(response) {
          $scope.myWelcome = response.statusText;
        });
      }

    }

    $scope.projectList = [];
    $scope.cat_activity_data = [];

    /*$scope.serviceTab = 1;*/
    $scope.setServiceTab = function(newTab, service_id) {
      console.log("service_id value in newTab>>" + newTab + "<<service_id>>" + service_id);
      $scope.activeIndex = newTab;
      $scope.selectedCat = service_id;
      var result = _.where(activities_array, {
        cfds_id: service_id
      });
      $scope.active_activities_array = result;
    };

    $scope.saveActivity = function(task_id, task_name,service_name, parent_ind, child_ind) {
      $scope.cat_activity_data = [];
      console.log(" >> parent_ind >> "+parent_ind+" >> child_ind >> "+child_ind);
      $('.activity-tab').removeClass('selected');
    //  console.log("2");
      $('.' + task_id + '-activity').addClass('selected');
      //console.log("3");
      $scope.cat_activity_data.push(task_id, task_name, service_name);
      //console.log(" >> length >> "+$scope.outerList.length);

      for(var i=0; i < $scope.outerList.length; i++){
        var obj = $scope.outerList[ i ];
        //console.log(">> name >> "+obj.service_name+" >> length >> "+obj.innerMenu.length);
        for(var j=0; j < obj.innerMenu.length; j++){
          var innerMenu = obj.innerMenu[j];
          //innerMenu.btnClass = innerMenu.billable =='Y' ? 'info' : 'danger';
          innerMenu.styleClassback = innerMenu.billable =='Y' ? 'background-color: #f5efef' : 'background-color: #f3e0e2';
        }
      }


      for(var i=0; i < $scope.outerList.length; i++){
        var obj = $scope.outerList[ i ];
        //console.log(">> name >> "+obj.service_name+" >> length >> "+obj.innerMenu.length);
        for(var j=0; j < obj.innerMenu.length; j++){
          var innerMenu = obj.innerMenu[j];
          if( i === parent_ind &&  j === child_ind ){
            console.log(" >> success >> "+i+" >> "+j);
            //innerMenu.btnClass = "success";
            innerMenu.styleClassback = 'background: darkgrey';
            //innerMenu.styleClassback = innerMenu.billable =='Y' ? 'background-color: #f5efef' : 'background-color: #f3e0e2';
          }
          console.log(" >> i >> "+i+" >> j >> "+j+" >> "+innerMenu.styleClassback);
        }
      }

      console.log(" >> length >> "+JSON.stringify($scope.cat_activity_data));
    }

    $scope.changeTaskDate = function(rowObj,table,index,otheData,obj) {
      $scope.currTable = table;
      console.log("In changeTaskDate() >>" + rowObj+" >> "+table+" >> "+index);
      console.log("rowObj.p_date >>" + rowObj.p_date);
      console.log("rowObj.p_org_date >>" + rowObj.p_org_date);
      console.log("rowObj.flag >>" + rowObj.flag);
      console.log("$scope.task_date >> "+$scope.task_date);
      /*if(rowObj.flag == 'S'){
        rowObj.p_date = $scope.task_date;
        alert("Please reset before changine task date");
      }
      else{*/
        var date2 = new Date($scope.task_date).getTime();
        var date1 = new Date(rowObj.p_date).getTime();
        console.log(" >> "+moment(date1).isAfter(date2)+" >> "+moment(date1).isBefore(date2)+" >> "+moment(date1).isSame(date2));
        var hh, mm, ss;
        $timeout(function () {
         console.log(" >> "+$(".indexCurrTime"+table+""+index+"").text().trim());
         console.log(" >> "+$(".indexCurrTime"+table+""+index+"").text().trim().split(":"));
         console.log(" >> "+$(".indexCurrTime"+table+""+index+"").text().trim().split(":")[0]);
         console.log(" >> "+$(".indexCurrTime"+table+""+index+"").text().trim().split(":")[1]);
         console.log(" >> "+$(".indexCurrTime"+table+""+index+"").text().trim().split(":")[2]);
         hh = $(".indexCurrTime"+table+""+index+"").text().trim().split(":")[0];
         mm = $(".indexCurrTime"+table+""+index+"").text().trim().split(":")[1];
         ss = $(".indexCurrTime"+table+""+index+"").text().trim().split(":")[2];
       }).then(function(){
         console.log("In changeTaskDate() >>" + date1+" >> "+date2+" >> "+hh+" >> "+mm+" >> "+ss);
         if( !((hh == "00" || hh == "" || hh == undefined) && (mm == "00" || mm == "" || mm == undefined) && (ss == "00" || ss == "" || ss == undefined ))){
           rowObj.p_date = rowObj.p_org_date;
           alert("Please reset before changing task date");
         }
         else
         {
           console.log(">> $scope.time_tracker_task_id >> "+rowObj.time_tracker_task_id);
           console.log(">> $scope.project_id >> "+rowObj.project_id);
           console.log(">> $scope.todoInput >> "+rowObj.todoText);
           console.log(">> $scope.est_hrs >> "+rowObj.estimated_hours);
           console.log(">> $scope.est_mins >> "+rowObj.estimated_mins);
           console.log(">> $scope.recurring >> "+rowObj.Recurring_Task);
           console.log(">> $scope.task_date >> "+rowObj.p_date);

           console.log(" >> client >> " + $scope.select.selectedClient);
          console.log("time_tracker_task_id >>" + $scope.timeTracker_Task_id_qb);
          console.log("project_id >>" + $scope.timeTracker_project_qb);
          console.log("employee_id >> "+$scope.userId);
          console.log("task_id >>" + $scope.cat_activity_data[0]);
          console.log("delivery_name >>" + JSON.stringify($scope.select.delivery_name));
          console.log("executed_hours >> "+otheData.est_hours + ':' + otheData.est_mins);
          console.log("comments >>" + $scope.comment);
          console.log("weekend_hours >>" + otheData.weekend_hours);
          console.log("peer_rework >>" + otheData.peer_rework);
          if( otheData.peer_rework == 'Y' ){
          console.log("selectedEmployee >>" + otheData.selectedEmployee);
          }
          else{
          console.log("selectedEmployee >>" + 0);
          }
          console.log("executed_quantity >>" + otheData.executed_quantity);
          console.log("recurring >>" + $scope.Recurring_Task_qb);
          console.log("$data.p_date >>" + $filter('date')($scope.timeTracker_Date_qb, "yyyy-MM-dd"));
          if ($scope.timeTracker_project_qb === 0) {
          	deliverable_id = '';
          	p_deliverable_id = '';
          	deliverable_name = '';
          	client_id = ($scope.select.selectedClient == undefined || $scope.select.selectedClient == '-1') ? '' : $scope.select.selectedClient.id ;
          } else {
          	deliverable_id = ($scope.select.delivery_name == undefined || $scope.select.delivery_name == '-1') ? '' : $scope.select.delivery_name.id;
          	p_deliverable_id = ($scope.select.delivery_name == undefined || $scope.select.delivery_name == '-1') ? '' : $scope.select.delivery_name.p_deliverable_id ;
          	deliverable_name = ($scope.select.delivery_name == undefined || $scope.select.delivery_name == '-1') ? '' : $scope.select.delivery_name.name;
          	client_id = '';
          }
          console.log(" >> client_id >> "+client_id);
          console.log(" >> deliverable_id >> "+deliverable_id);
          console.log(" >> p_deliverable_id >> "+p_deliverable_id);
          console.log(" >> deliverable_name >> "+deliverable_name);
          console.log(" >>  p_date >> "+rowObj.p_date);
          var isErrorInSave = false;
          if( otheData.peer_rework == 'Y' && otheData.selectedEmployee ==  undefined){
          	isErrorInSave = true;
          }
          console.log(" >> isErrorInSave >> "+isErrorInSave);
          if(isErrorInSave){
          	$scope.peerEmpAlert = "border: 1px solid red";
          }
          else{
          	$scope.peerEmpAlert = "";
          	$http({
          	method: "GET",
          	url: CONSTANT.API_URL + '/timeTracker/save_details',
          	params: {
          		P_comments: $scope.comment,
          		P_isPeerRework: otheData.peer_rework,
          		P_isWeekendHours: otheData.weekend_hours,
          		P_deliverable_name: deliverable_name,
          		P_deliverable_id: deliverable_id,
          		P_employee_id: $scope.userId,
          		P_task_id: $scope.cat_activity_data[0] ==  undefined ? '' : $scope.cat_activity_data[0],
          		P_task_name: $scope.cat_activity_data[1] ==  undefined ? '' : $scope.cat_activity_data[1],
          		P_selected_task_service_line: $scope.cat_activity_data[2] ==  undefined ? '' : $scope.cat_activity_data[2],
          		P_category_id: "",
          		P_project_deliverable_id: p_deliverable_id,
          		project_id: $scope.right_project_id,
          		P_time_tracker_task_id: $scope.timeTracker_Task_id_qb,
          		P_peer_name: (otheData.selectedEmployee ==  undefined || otheData.selectedEmployee ==  '') ? '0' : otheData.selectedEmployee.employee_name,
          		P_peer_id: (otheData.selectedEmployee ==  undefined || otheData.selectedEmployee ==  '') ? '0' : otheData.selectedEmployee.employee_id,
          		P_est_hours: $scope.estHrsLabel,
          		P_est_mins: $scope.estMinsLabel,
          		P_client_id: client_id,
          		P_quantity: otheData.executed_quantity,
          		p_timeTDate: $filter('date')(rowObj.p_date, "yyyy-MM-dd")
          	},
          	}).then(function mySuccess(response) {
          	console.log(response);

          	  $.toast({
          		heading: 'Successfully moved!',
          		text: 'Task is moved and saved Successfully.',
          		position: 'top-right',
          		loaderBg: '#ff6849',
          		icon: 'success',
          		hideAfter: 3500,
          		stack: 6
          	  });

              $scope.onloadData();

          	}, function myError(response) {
          	$scope.myWelcome = response.statusText;
          	});
          }


           /*$http({
             method: "GET",
             url: CONSTANT.API_URL + '/timeTracker/removeTask',
             params: {
               P_time_tracker_task_id: rowObj.time_tracker_task_id,
               P_employee_id: $scope.userId,
             },
           }).then(function mySuccess(response) {
           }, function myError(response) {
           });
           console.log(" >> currTable >> "+$scope.currTable);
           if ($scope.currTable == 0) {
             $scope.remove($scope.curr_index, $scope.timeTracker_Task_id_qb,rowObj);
           } else if ($scope.currTable == 1) {
             $scope.removeToday($scope.curr_index, $scope.timeTracker_Task_id_qb,rowObj);
           } else if ($scope.currTable == 2) {
             $scope.removeFuture($scope.curr_index, $scope.timeTracker_Task_id_qb,rowObj);
           }

           $http({
             method: "GET",
             url: CONSTANT.API_URL + '/timeTracker/addTimedProjects',
             params: {
               proj_id: rowObj.p_id,
               task_date: $filter('date')(rowObj.p_date, 'yyyy-MM-dd'),
               est_hrs: rowObj.estimated_hours,
               est_mins: rowObj.estimated_mins,
               recurring: rowObj.Recurring_Task,
               emp_id: $scope.userId
             }
           }).then(function mySuccess(response) {
             $scope.result = response.data;
             console.log("responseeeeee <<<<<<<<<<<<<<<<<<<<<  --- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
             console.log(response.data.recordsets[2]);
             if (response.data.recordsets[1].length > 0) {
               $scope.unbilled = true;
               $scope.unbilled_length = response.data.recordsets[1].length;
             }
             activeprojectList_array = [];
             $scope.todoList = activeprojectList_array;
             angular.forEach(response.data.recordsets[1], function(x) {
               $scope.elapseTime = x.executed_hours.toHHMMSS();
               activeprojectList_array.push({
                 "todoText": x.project_number+"/"+x.project_name,
                 "p_id": x.project_id,
                 "p_date": new Date($filter('date')(x.time_tracker_date)),
                 "p_org_date": new Date($filter('date')(x.time_tracker_date)),
                 "executed_hrs": x.executed_hours,
                 "time_tracker_task_id": x.time_tracker_task_id,
                 "elapse_time": x.executed_hours.toHHMMSS(),
                 "estimated_hours": x.estimated_hours,
                 "estimated_mins": x.estimated_mins,
                 "executed_hours": x.executed_hours,
                 "executed_mins": x.executed_mins,
                 "Recurring_Task":x.Recurring_Task,
                 "trDisplay":""
               });
             });
             $scope.todoList = activeprojectList_array;
             if (response.data.recordsets[2].length > 0) {
               $scope.today = true;
               $scope.today_length = response.data.recordsets[2].length;
             }
             todayprojectList_array = [];
             $scope.todayprojectList = [];
             angular.forEach(response.data.recordsets[2], function(x) {
               $scope.elapseTime = x.executed_hours.toHHMMSS();
               todayprojectList_array.push({
                 "todoText": x.project_number+"/"+x.project_name,
                 "p_id": x.project_id,
                 "p_date": new Date($filter('date')(x.time_tracker_date)),
                 "p_org_date": new Date($filter('date')(x.time_tracker_date)),
                 "executed_hrs": x.executed_hours,
                 "elapse_time": x.executed_hours.toHHMMSS(),
                 "estimated_hours": x.estimated_hours,
                 "estimated_mins": x.estimated_mins,
                 "executed_hours": x.executed_hours,
                 "executed_mins": x.executed_mins,
                 "time_tracker_task_id": x.time_tracker_task_id,
                 "Recurring_Task": x.Recurring_Task,
                 "flag": x.flag,
                 "trDisplay":""
               });
             });
             $scope.todayprojectList = todayprojectList_array;
             if (response.data.recordsets[3].length > 0) {
               $scope.future = true;
               $scope.future_length = response.data.recordsets[3].length;
             }
             futureproject_array = [];
             angular.forEach(response.data.recordsets[3], function(x) {
               $scope.elapseTime = x.executed_hours.toHHMMSS();
               futureproject_array.push({
                 "todoText": x.project_number+"/"+x.project_name,
                 "p_id": x.project_id,
                 "p_date": new Date($filter('date')(x.time_tracker_date)),
                 "p_org_date": new Date($filter('date')(x.time_tracker_date)),
                 "executed_hrs": x.executed_hours,
                 "elapse_time": x.executed_hours.toHHMMSS(),
                 "estimated_hours": x.estimated_hours,
                 "estimated_mins": x.estimated_mins,
                 "executed_hours": x.executed_hours,
                 "executed_mins": x.executed_mins,
                 "time_tracker_task_id": x.time_tracker_task_id,
                 "Recurring_Task": x.Recurring_Task,
                 "flag": x.flag,
                 "trDisplay":""
               });
             });
             $scope.futureProjectone = futureproject_array;

             if($scope.todoList.length > 0){
               $scope.showTodoList = "visibility:visible;display:block;";
             }
             else{
               $scope.showTodoList = "visibility:hidden;display:none;";
             }

             if($scope.todayprojectList.length > 0){
               $scope.showTodayList = "visibility:visible;display:block;";
             }
             else{
               $scope.showTodayList = "visibility:hidden;display:none;";
             }

             if($scope.futureProjectone.length > 0){
               $scope.showFutureList = "visibility:visible;display:block;";
             }
             else{
               $scope.showFutureList = "visibility:hidden;display:none;";
             }

             $scope.pause_array = [];

             $scope.est_hrs = "";
             $scope.est_mins = "";
             $scope.recurring = false;
             $scope.task_date = $scope.task_date_state
           },
           function myError(response) {
             $scope.result = response.statusText;
           });
           if($scope.todoList.length > 0){
             $scope.showTodoList = "visibility:visible;display:block;";
           }
           else{
             $scope.showTodoList = "visibility:hidden;display:none;";
           }

           if($scope.todayprojectList.length > 0){
             $scope.showTodayList = "visibility:visible;display:block;";
           }
           else{
             $scope.showTodayList = "visibility:hidden;display:none;";
           }

           if($scope.futureProjectone.length > 0){
             $scope.showFutureList = "visibility:visible;display:block;";
           }
           else{
             $scope.showFutureList = "visibility:hidden;display:none;";
           }*/
         }
       });


      //}

      console.log("Out of changeTaskDate()");
    }

    $scope.clickPause = function(clas){
      $timeout(function () {
       $(clas).click();
      });
    };

    /*$scope.copyHHMM = function(currTbl,curr_index){
      (function(){$scope.copyHHMM1(currTbl,curr_index)}).then(
        function(response){
        $scope.copyHHMM1(currTbl,curr_index);
      },
      function(err){

      });
    };*/

    $scope.copyHHMMRan = function(currTbl,curr_index){
      $timeout(function () {
       console.log(" >> "+$(".indexCurrTime"+currTbl+""+curr_index+"").text().trim());
       console.log(" >> "+$(".indexCurrTime"+currTbl+""+curr_index+"").text().trim().split(":"));
       console.log(" >> "+$(".indexCurrTime"+currTbl+""+curr_index+"").text().trim().split(":")[0]);
       console.log(" >> "+$(".indexCurrTime"+currTbl+""+curr_index+"").text().trim().split(":")[1]);
       $scope.otherData[0].est_hours = $(".indexCurrTime"+currTbl+""+curr_index+"").text().trim().split(":")[0];
       $scope.otherData[0].est_mins = $(".indexCurrTime"+currTbl+""+curr_index+"").text().trim().split(":")[1];
      });
    };

    $scope.copyHHMM = function(currTbl,curr_index){

      $(".highlight").find(".numbers").text();

      console.log(" >> "+$(".highlight").find(".numbers").text());
      console.log(" >> "+$(".highlight").find(".numbers").text().trim().split(":"));
      console.log(" >> "+$(".highlight").find(".numbers").text().trim().split(":")[0]);
      console.log(" >> "+$(".highlight").find(".numbers").text().trim().split(":")[1]);
      $scope.otherData[0].est_hours = $(".highlight").find(".numbers").text().trim().split(":")[0];
      $scope.otherData[0].est_mins = $(".highlight").find(".numbers").text().trim().split(":")[1];

      /*console.log(" >> copyHHMM >> "+$scope.currData.executed_hrs+" >> "+$scope.currData.flag);
      if(currTbl == "1" && $scope.currData.flag == "S" )
      {
        console.log(" >> flag >> "+$scope.currData.flag);
        var genClass = ".todayIndexPause"+curr_index+"";
        console.log(" >> genClass >> "+genClass);
        $timeout(function () {
          $(genClass).click();
        });

        $timeout(function () {
          angular.element('.btnCopyHHMMClass').triggerHandler('click');
        },1000);
      }
      else{
        var h,m;
        $timeout(function () {
         console.log(" >> "+$(".indexCurrTime"+currTbl+""+curr_index+"").text().trim());
         console.log(" >> "+$(".indexCurrTime"+currTbl+""+curr_index+"").text().trim().split(":"));
         console.log(" >> "+$(".indexCurrTime"+currTbl+""+curr_index+"").text().trim().split(":")[0]);
         console.log(" >> "+$(".indexCurrTime"+currTbl+""+curr_index+"").text().trim().split(":")[1]);
         $scope.otherData[0].est_hours = $(".indexCurrTime"+currTbl+""+curr_index+"").text().trim().split(":")[0];
         $scope.otherData[0].est_mins = $(".indexCurrTime"+currTbl+""+curr_index+"").text().trim().split(":")[1];
        });
      }*/
    }

    $scope.quickBill = function(otheData,obj) {
      console.log("In quickBill() timeTrackerController");
      console.log("time_tracker_task_id >>" + $scope.timeTracker_Task_id_qb);
      console.log("project_id >>" + $scope.timeTracker_project_qb);
      console.log("employee_id >> "+$scope.userId);
      console.log("task_id >>" + $scope.cat_activity_data[0]);
      console.log("delivery_name >>" + JSON.stringify($scope.select.delivery_name));
      console.log("executed_hours >> "+otheData.est_hours + ':' + otheData.est_mins);
      console.log("comments >>" + $scope.comment);
      console.log("weekend_hours >>" + otheData.weekend_hours);
      console.log("peer_rework >>" + otheData.peer_rework);
      if( otheData.peer_rework == 'Y' ){
        console.log("selectedEmployee >>" + otheData.selectedEmployee);
      }
      else{
        console.log("selectedEmployee >>" + 0);
      }

      console.log("executed_quantity >>" + otheData.executed_quantity);
      console.log("recurring >>" + $scope.Recurring_Task_qb);
      console.log("$data.p_date >>" + $filter('date')($scope.timeTracker_Date_qb, "yyyy-MM-dd"));
      if(otheData.est_hours == undefined){
        otheData.est_hours = 0;
      }
      if(otheData.est_mins == undefined){
        otheData.est_mins = 0;
      }
      if ($scope.timeTracker_project_qb === 0) {
        //deliverable_name = '';
        //deliverable_id = '';
        p_deliverable_id = '';
        client_id = ($scope.select.selectedClient == undefined || $scope.select.selectedClient == '-1') ? '' : $scope.select.selectedClient.id ;
      } else {
        //deliverable_name = $scope.select.delivery_name.name;
        //deliverable_id = $scope.select.delivery_name.id;
        p_deliverable_id = ($scope.select.delivery_name == undefined || $scope.select.delivery_name == '-1') ? '' : $scope.select.delivery_name.p_deliverable_id ;
        client_id = '0';
      }
      var isError = false;
      if ($scope.timeTracker_project_qb === 0) {
        if(client_id == '' || $scope.cat_activity_data[0] == undefined ||
        (otheData.est_hours == undefined && otheData.est_mins == undefined) ||
        (otheData.est_hours == 0 && otheData.est_mins == 0) || otheData.est_hours > 23 || otheData.est_mins > 59  ||
        (otheData.peer_rework == 'Y' && otheData.selectedEmployee ==  undefined) ){
          isError = true;
        }
        else{
          isError = false;
        }
        if( isError == true){
          if(client_id == ''){
            $scope.deliveryAlert = "border:1px solid red";
          }
          else{
            $scope.deliveryAlert = "";
          }
            if($scope.cat_activity_data[0] == undefined){
              $scope.taskAlert ="color: red";
            }
            else{
              $scope.taskAlert ="";
            }
          if( otheData.est_hours == undefined || otheData.est_hours == 0 || otheData.est_hours > 23)
          {
            $scope.estHrsAlert = "border:1px solid red";
          }
          else{
            $scope.estHrsAlert = "";
          }

          if( otheData.est_mins == undefined || otheData.est_mins == 0 || otheData.est_mins > 59)
          {
            $scope.estMinsAlert = "border:1px solid red";
          }
          else{
            $scope.estMinsAlert = "";
          }


          /*if(otheData.est_hours == undefined){
            $scope.estHrsAlert = "border:1px solid red";
          }
          else{
            $scope.estHrsAlert = "";
          }
          if(otheData.est_mins == undefined){
            $scope.estMinsAlert = "border:1px solid red";
          }
          else{
            $scope.estMinsAlert = "";
          }*/
          if(otheData.peer_rework == 'Y' && otheData.selectedEmployee ==  undefined){
            $scope.peerEmpAlert = "border: 1px solid red";
          }
          else{
            $scope.peerEmpAlert = "";
          }
          alert(" 1) Please select/fill highlighted field(s) \n 2) Estimated hour can not be greater than 23:59 ");
        }
        else{
          var params = {
            time_tracker_task_id: $scope.timeTracker_Task_id_qb,
            project_id: $scope.timeTracker_project_qb,
            employee_id: $scope.userId,
            task_id: $scope.cat_activity_data[0],
            project_deliverable_id: p_deliverable_id,
            executed_hours: (otheData.est_hours == undefined ? '0' : otheData.est_hours)  + ':' + (otheData.est_mins == undefined ? '0': otheData.est_mins),
            comments: $scope.comment,
            weekend_hours: otheData.weekend_hours,
            peer_rework: otheData.peer_rework,
            executed_quantity: otheData.executed_quantity,
            rework_for: (otheData.selectedEmployee ==  undefined || otheData.selectedEmployee ==  '') ? '0' : otheData.selectedEmployee.employee_id,
            execution_date: $filter('date')($scope.timeTracker_Date_qb, 'yyyy-MM-dd'),
            P_Recurring_Task: $scope.Recurring_Task_qb,
            P_client_id: client_id,
            P_est_hours: $scope.estHrsLabel,
            P_est_mins: $scope.estMinsLabel,
          }

          timeTrackerService.quickBill(params).then(projectResp, getError).catch(errorCallback);

          function projectResp(response) {
            console.log("response>>" + response);
            if (response != "error") {
              console.log("In response not error");
              $scope.cat_activity_data = [];
              console.log(">> currTable >> "+$scope.currTable);
              if ($scope.currTable == 0) {
                $scope.remove($scope.curr_index, $scope.timeTracker_Task_id_qb,obj);
              } else if ($scope.currTable == 1) {
                $scope.removeToday($scope.curr_index, $scope.timeTracker_Task_id_qb,obj);
              } else if ($scope.currTable == 2) {
                $scope.removeFuture($scope.curr_index, $scope.timeTracker_Task_id_qb,obj);
              }

              $.toast({
                heading: 'Successfully Billed!',
                text: 'Task is billed Successfully.',
                position: 'top-right',
                loaderBg: '#ff6849',
                icon: 'success',
                hideAfter: 3500,
                stack: 6
              });

            } else {
              alert("Some error occurred!!");
            }
          }
        }
        //}
      }
      else{
        if(p_deliverable_id == '' || $scope.cat_activity_data[0] == undefined ||
        (otheData.est_hours == undefined && otheData.est_mins == undefined) ||
        (otheData.est_hours == 0 && otheData.est_mins == 0) || otheData.est_hours > 23 || otheData.est_mins > 59  ||
          ( otheData.peer_rework == 'Y' && otheData.selectedEmployee ==  undefined) ){
          isError = true;
        }
        else{
          isError = false;
        }
        if( isError == true){
          if(p_deliverable_id == ''){
            $scope.deliveryAlert = "border:1px solid red";
          }
          else{
            $scope.deliveryAlert = "";
          }
          if($scope.cat_activity_data[0] == undefined){
            $scope.taskAlert ="color: red";
          }
          else{
            $scope.taskAlert ="";
          }
          if( otheData.est_hours == undefined || otheData.est_hours == 0 || otheData.est_hours > 23)
          {
            $scope.estHrsAlert = "border:1px solid red";
          }
          else{
            $scope.estHrsAlert = "";
          }
          if( otheData.est_mins == undefined || otheData.est_mins == 0 || otheData.est_mins > 59)
          {
            $scope.estMinsAlert = "border:1px solid red";
          }
          else{
            $scope.estMinsAlert = "";
          }
          /*if(otheData.est_hours == undefined){
            $scope.estHrsAlert = "border:1px solid red";
          }
          else{
            $scope.estHrsAlert = "";
          }
          if(otheData.est_mins == undefined){
            $scope.estMinsAlert = "border:1px solid red";
          }
          else{
            $scope.estMinsAlert = "";
          }*/
          if(otheData.peer_rework == 'Y' && otheData.selectedEmployee ==  undefined){
            $scope.peerEmpAlert = "border:1px solid red";
          }
          else{
            $scope.peerEmpAlert = "";
          }
          alert(" 1) Please select/fill highlighted field(s) \n 2) Estimated hour can not be greater than 23:59 ");
        }
        else{
          var params = {
            time_tracker_task_id: $scope.timeTracker_Task_id_qb,
            project_id: $scope.timeTracker_project_qb,
            employee_id: $scope.userId,
            task_id: $scope.cat_activity_data[0],
            project_deliverable_id: p_deliverable_id,
            executed_hours: (otheData.est_hours == undefined ? '0' : otheData.est_hours) + ':' + (otheData.est_mins == undefined ? '0': otheData.est_mins),
            comments: $scope.comment,
            weekend_hours: otheData.weekend_hours,
            peer_rework: otheData.peer_rework,
            executed_quantity: otheData.executed_quantity,
            rework_for: (otheData.selectedEmployee ==  undefined || otheData.selectedEmployee ==  '') ? '0' : otheData.selectedEmployee.employee_id,
            execution_date: $filter('date')($scope.timeTracker_Date_qb, 'yyyy-MM-dd'),
            P_Recurring_Task: $scope.Recurring_Task_qb,
            P_client_id: client_id,
            P_est_hours: $scope.estHrsLabel,
            P_est_mins: $scope.estMinsLabel,
          }

          timeTrackerService.quickBill(params).then(projectResp, getError).catch(errorCallback);

          function projectResp(response) {
            console.log("response>>" + response);
            if (response != "error") {
              console.log("In response not error");
              $scope.cat_activity_data = [];
              console.log(">> currTable >> "+$scope.currTable);
              if ($scope.currTable == 0) {
                $scope.remove($scope.curr_index, $scope.timeTracker_Task_id_qb,$scope.currData,obj);
              } else if ($scope.currTable == 1) {
                $scope.removeToday($scope.curr_index, $scope.timeTracker_Task_id_qb,$scope.currData,obj);
              } else if ($scope.currTable == 2) {
                $scope.removeFuture($scope.curr_index, $scope.timeTracker_Task_id_qb,$scope.currData,obj);
              }

              $.toast({
                heading: 'Successfully Billed!',
                text: 'Task is billed Successfully.',
                position: 'top-right',
                loaderBg: '#ff6849',
                icon: 'success',
                hideAfter: 3500,
                stack: 6
              });

            } else {
              alert("Some error occurred!!");
            }
          }
        }
        //}
      }

      if($scope.todoList.length > 0){
        $scope.showTodoList = "visibility:visible;display:block;";
      }
      else{
        $scope.showTodoList = "visibility:hidden;display:none;";
      }

      if($scope.futureProjectone.length > 0){
        $scope.showFutureList = "visibility:visible;display:block;";
      }
      else{
        $scope.showFutureList = "visibility:hidden;display:none;";
      }

      if($scope.todayprojectList.length > 0){
        $scope.showTodayList = "visibility:visible;display:block;";
      }
      else{
        $scope.showTodayList = "visibility:hidden;display:none;";
      }


      /*if ($scope.select.delivery_name != undefined && (otheData.est_hours != undefined || otheData.est_mins != undefined)) {



        var params = {
          time_tracker_task_id: $scope.timeTracker_Task_id_qb,
          project_id: $scope.timeTracker_project_qb,
          employee_id: $scope.userId,
          task_id: $scope.cat_activity_data[0],
          project_deliverable_id: p_deliverable_id,
          executed_hours: otheData.est_hours + ':' + otheData.est_mins,
          comments: $scope.comment,
          weekend_hours: $scope.weekend_hours,
          peer_rework: $scope.peer_rework,
          executed_quantity: otheData.executed_quantity,
          rework_for: '0',
          execution_date: $filter('date')($scope.timeTracker_Date_qb, 'yyyy-MM-dd'),
          P_Recurring_Task: $scope.Recurring_Task_qb,
          P_client_id: client_id
        }

        timeTrackerService.quickBill(params).then(projectResp, getError).catch(errorCallback);

        function projectResp(response) {
          console.log("response>>" + response);
          if (response != "error") {
            console.log("In response not error");
            $scope.cat_activity_data = [];
            if ($scope.currTable == 0) {
              $scope.remove($scope.curr_index, $scope.timeTracker_Task_id_qb);
            } else if ($scope.currTable == 1) {
              $scope.removeToday($scope.curr_index, $scope.timeTracker_Task_id_qb);
            }

            $.toast({
              heading: 'Successfully Billed!',
              text: 'Task is billed Successfully.',
              position: 'top-right',
              loaderBg: '#ff6849',
              icon: 'success',
              hideAfter: 3500,
              stack: 6
            });
          } else {
            alert("Some error occurred!!");
          }
        }

        console.log("Out of quickBill() timeTrackerController >>>" + $scope.deliveryDetailsShow);
      }
      else{
        console.log(" >> "+$scope.taskAlert);
        if($scope.otherData[0].est_hours == undefined ||
          $scope.otherData[0].est_mins == undefined ||
          (($scope.otherData[0].est_hours == '00' || $scope.otherData[0].est_hours == '0') &&
           ($scope.otherData[0].est_mins == '00' || $scope.otherData[0].est_mins == '0'))){
          $scope.estHrsAlert = "border:1px solid red";
          $scope.estMinsAlert = "border:1px solid red";
        }
        else{
          $scope.estHrsAlert = "";
          $scope.estMinsAlert = "";
        }

        if ($scope.timeTracker_project_qb === 0) {
          if($scope.select.selectedClient == undefined){
              $scope.clientAlert = "border:1px solid red";
          }
          else{
              $scope.clientAlert = "";
          }
        }
        else{
          if($scope.select.delivery_name == undefined){
              $scope.deliveryAlert = "border:1px solid red";
          }
          else{
              $scope.deliveryAlert = "";
          }
        }
        $.toast({
          heading: 'Error!',
          text: 'Please fill highlighted field',
          position: 'top-right',
          loaderBg: '#ff6849',
          icon: 'error',
          hideAfter: 3500,
          stack: 6
        });
      }*/
    }


    /*$scope.isSet = function(tabNum) {
      return $scope.tab === tabNum;
    };*/



    String.prototype.toHHMMSS = function() {
      var sec_num = parseInt(this, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);
      if (hours < 10) {
        hours = "0" + hours;
      }


      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (hours > 23) {
        hours = "23" + hours;
        minutes = "59" + minutes;
        seconds = "59" + seconds;
      }

      return hours + ':' + minutes + ':' + seconds;
    }


    $scope.onloadData = function() {
      console.log("In onloadData() timeTrackerController");
      $http({
        method: "GET",
        url: CONSTANT.API_URL + '/timeTracker',
        params: {
          emp_id: $scope.userId
        }
      }).then(function mySuccess(response) {
        //console.log(" >> data >> "+JSON.stringify(response.data.recordsets[1]));
        $scope.myWelcome = response.data;
        $scope.projectList_array=[];
        /*console.log("responseee timeeee level 123455");
        console.log(response.data);*/
        angular.forEach(response.data.recordset, function(x) {
          var prj_name="";
          if(x.project_name != undefined && x.project_name != null && x.project_number != undefined &&  x.project_number != null){
            prj_name = x.project_number+"/"+x.project_name;
          }
          else if(x.project_name == undefined || x.project_name == null){
            prj_name = x.project_number;
          }
          else if (x.project_number == undefined || x.project_number == null) {
            prj_name = x.project_name;
          }
          $scope.projectList_array.push({
            "proj_name": prj_name,
            "proj_id": x.project_id
          });
        });
        console.log(" >> task_date >> "+response.data.recordsets[1][0].TODAY_DATE);
        $scope.task_date = new Date($filter('date')(response.data.recordsets[1][0].TODAY_DATE));
        $scope.task_date_state = new Date($filter('date')(response.data.recordsets[1][0].TODAY_DATE));
        //$scope.minimum_date = new Date($filter('date')(response.data.recordsets[1][0].PREVIOUS_DATE));
        var minn_date = moment(new Date($filter('date')(response.data.recordsets[1][0].TODAY_DATE)).getTime()).add(0, 'days');
        $scope.minimum_date = new Date(minn_date);
        var maxx_date = moment(new Date($filter('date')(response.data.recordsets[1][0].PREVIOUS_DATE)).getTime()).add(30, 'days');
        $scope.maximum_date = new Date(maxx_date);
        console.log(" >> minimum_date >> "+$scope.minimum_date+" >> maximum_date >> "+$scope.maximum_date);
      }, function myError(response) {
        $scope.myWelcome = response.statusText;
      });
      $scope.unbilled = false;
      $scope.today = false;
      $scope.future = false;


      $http({
        method: "GET",
        url: CONSTANT.API_URL + '/timeTracker/timedProjects',
        params: {
          emp_id: $scope.userId
        }
      }).then(function mySuccess(response) {
        $scope.myWelcome = response.data;
        //console.log(".................ytoday..................");
        //console.log(response.data.recordsets[1]);
        if (response.data.recordsets[0].length > 0) {
          $scope.unbilled = true;
          $scope.unbilled_length = response.data.recordsets[0].length;
        }

        if (response.data.recordsets[1].length > 0) {

          $scope.today = true;
          $scope.today_length = response.data.recordsets[1].length;

        }
        if (response.data.recordsets[2].length > 0) {
          $scope.future = true;
          $scope.future_length = response.data.recordsets[2].length;
        }
        activeprojectList_array = [];

        /*angular.forEach(response.data.recordset, function(x) {
          $scope.elapseTime = x.executed_hours.toHHMMSS();

          activeprojectList_array.push({
            "todoText": x.project_name,
            "p_id": x.project_id,
            "p_date": $filter('date')(x.time_tracker_date, "dd MMM yyyy"),
            "executed_hrs": x.executed_hours,
            "time_tracker_task_id": x.time_tracker_task_id,
            "elapse_time": x.executed_hours.toHHMMSS(),
            "estimated_hours": x.estimated_hours,
            "estimated_mins": x.estimated_mins,
            "executed_hours": x.executed_hours,
            "executed_mins": x.executed_mins
          });
        });
        $scope.todoList = activeprojectList_array;

        angular.forEach(response.data.recordsets[1], function(x) {
          $scope.elapseTime = x.executed_hours.toHHMMSS();
          todayprojectList_array.push({
            "todoText": x.project_name,
            "p_id": x.project_id,
            "p_date": $filter('date')(x.time_tracker_date, "dd MMM yyyy"),
            "executed_hrs": x.executed_hours,
            "elapse_time": x.executed_hours.toHHMMSS(),
            "estimated_hours": x.estimated_hours,
            "estimated_mins": x.estimated_mins,
            "executed_hours": x.executed_hours,
            "executed_mins": x.executed_mins,
            "time_tracker_task_id": x.time_tracker_task_id,
            "Recurring_Task": x.Recurring_Task,
            "flag": x.flag
          });
        });*/

        //Unbilled Project List
        activeprojectList_array = [];

        angular.forEach(response.data.recordset, function(x) {
          $scope.elapseTime = x.executed_hours.toHHMMSS();

          activeprojectList_array.push({
            "todoText": x.project_number+"/"+x.project_name,
            "p_id": x.project_id,
            "p_date": new Date($filter('date')(x.time_tracker_date)),
            "p_org_date": new Date($filter('date')(x.time_tracker_date)),
            "executed_hrs": x.executed_hours,
            "time_tracker_task_id": x.time_tracker_task_id,
            "elapse_time": x.executed_hours.toHHMMSS(),
            "estimated_hours": x.estimated_hours,
            "estimated_mins": x.estimated_mins,
            "executed_hours": x.executed_hours,
            "executed_mins": x.executed_mins,
            "Recurring_Task": x.Recurring_Task,
            "trDisplay":"",
            "disable":"true"
          });
        });
        $scope.todoList = activeprojectList_array;

        todayprojectList_array = [];
        // Today Project List
        //console.log(" recordsets 1 >> "+JSON.stringify(response.data.recordsets[1]));
        angular.forEach(response.data.recordsets[1], function(x) {
        //  $scope.elapseTime = x.executed_hours.toHHMMSS();
          todayprojectList_array.push({
            "todoText": x.project_number+"/"+x.project_name,
            "p_id": x.project_id,
            "p_date": new Date($filter('date')(x.time_tracker_date)),
            "p_org_date": new Date($filter('date')(x.time_tracker_date)),
            "executed_hrs": x.executed_hours,
            "elapse_time": x.executed_hours.toHHMMSS(),
            "estimated_hours": x.estimated_hours,
            "estimated_mins": x.estimated_mins,
            "executed_hours": x.executed_hours,
            "executed_mins": x.executed_mins,
            "time_tracker_task_id": x.time_tracker_task_id,
            "Recurring_Task": x.Recurring_Task,
            "flag": x.flag,
            "trDisplay":"",
            "disable":"true"
          });
        });
        $scope.todayprojectList = todayprojectList_array;
        //Future Project List
        futureproject_array = [];
        angular.forEach(response.data.recordsets[2], function(x) {
          $scope.elapseTime = x.executed_hours.toHHMMSS();
          futureproject_array.push({
            "todoText": x.project_number+"/"+x.project_name,
            "p_id": x.project_id,
            "p_date": new Date($filter('date')(x.time_tracker_date)),
            "p_org_date": new Date($filter('date')(x.time_tracker_date)),
            "executed_hrs": x.executed_hours,
            "elapse_time": x.executed_hours.toHHMMSS(),
            "estimated_hours": x.estimated_hours,
            "estimated_mins": x.estimated_mins,
            "executed_hours": x.executed_hours,
            "executed_mins": x.executed_mins,
            "time_tracker_task_id": x.time_tracker_task_id,
            "Recurring_Task": x.Recurring_Task,
            "flag": x.flag,
            "trDisplay":"",
            "disable":"true"
          });
        });

        $scope.futureProjectone = futureproject_array;

        if($scope.todoList.length > 0){
          $scope.showTodoList = "visibility:visible;display:block;";
        }
        else{
          $scope.showTodoList = "visibility:hidden;display:none;";
        }

        if($scope.todayprojectList.length > 0){
          $scope.showTodayList = "visibility:visible;display:block;";
        }
        else{
          $scope.showTodayList = "visibility:hidden;display:none;";
        }

        if($scope.futureProjectone.length > 0){
          $scope.showFutureList = "visibility:visible;display:block;";
        }
        else{
          $scope.showFutureList = "visibility:hidden;display:none;";
        }

        /*if($scope.todoList.length > 0){
          $("#collapseOneId").click();
        }
        else if($scope.todayprojectList.length > 0){
          $("#collapseTwoId").click();
        }
        else if($scope.futureProjectone.length > 0){
          $("#collapseThreeId").click();
        }*/



      }, function myError(response) {
        $scope.myWelcome = response.statusText;
      });
      console.log("Out of onloadData() timeTrackerController");
    }

    $scope.onloadData();

    // $timeout(
    //   function(){
    //     $scope.onloadData();
    //   },
    //   500
    // )

    $scope.selected = undefined;
    $scope.futureProjectone = futureproject_array;
    $scope.states = States;
    $scope.todoList = activeprojectList_array;
    $scope.todayprojectList = todayprojectList_array;
    //console.log("scope todolist");
    //console.log(activeprojectList_array);
    $scope.length = $scope.todoList.length;

    $scope.checkContent = function() {
      if ($scope.todoInput.length === 0 || typeof $scope.todoInput === 'undefined') {
        $scope.msg = "pls enter something";
      } else {
        $scope.msg = "Something Entered";
      }
    }


    /*$scope.hoverDeliver = function($data) {


      $http({
        method: "GET",
        url: CONSTANT.API_URL + '/timeTracker/deliverable',
        params: {
          emp_id: 3370,
          project_id: $data.p_id,
          time_tracker_task_id: $data.time_tracker_task_id,
        },
      }).then(function mySuccess(response) {

        console.log(response.data);
        $scope.res_deliverable_id = response.data.recordset[0].deliverable_id;
        $scope.res_deliverable_id = response.data.recordset[0].deliverable_name;
        $scope.myWelcome = response.data;
        $scope.right_project_id = $data.p_id;
        $scope.entities_scope = [];
        $scope.right_project_name = "";
        $scope.names = [];
        $scope.active_activities_array = [];
        $scope.right_project_id = $data.p_id;
        $scope.entities_scope = [];
        entities = [];
        if ($data.p_id != 0) {

          $scope.right_project_name = response.data.recordset[0].project_name;
          angular.forEach(response.data.recordsets[0], function(x) {
            names.push({
              "name": x.deliverable_name,
              "id": x.deliverable_id,
              "p_deliverable_id": x.project_deliverable_id,
              "array": [x.deliverable_id, x.deliverable_name, x.project_deliverable_id]
            });
          });

          $scope.names = names;

          activities_array = response.data.recordsets[1];
          console.log("activities array");
          console.log(activities_array);
          $scope.otherData = response.data.recordsets[6];
          angular.forEach(response.data.recordsets[2], function(x) {
            entities.push({
              "service_name": x.service_name,
              "service_id": x.cfds_id
            });
          });

          $scope.entities_scope = entities;

        } else {
          $scope.right_project_name = response.data.recordsets[4][0].client_name;
          angular.forEach(response.data.recordsets[4], function(x) {

            names.push({
              "name": x.client_name,
              "id": x.client_id
            });
          });

          $scope.names = names;
          activities_array = response.data.recordsets[5];
          console.log("activities array");
          console.log(activities_array);
          $scope.otherData = response.data.recordsets[6];
          angular.forEach(response.data.recordsets[2], function(x) {

            entities.push({
              "service_name": x.service_name,
              "service_id": x.cfds_id
            });
          });

          $scope.entities_scope = entities;


        }
        console.log(entities);
        $scope.setServiceTab(0, entities[0].service_id);

      }, function myError(response) {
        $scope.myWelcome = response.statusText;
      });


    }*/

    $scope.hoverDeliver = function(index,$data,currTable) {
      /*$scope.activeIndex = 2;*/
      $('.activity-tab').removeClass('selected');
      $scope.currData = $data;
      $scope.taskAlert = "";
      $scope.estHrsAlert = "";
      $scope.estMinsAlert = "";
      $scope.clientAlert = "";
      $scope.deliveryAlert = "";
      $http({
        method: "GET",
        url: CONSTANT.API_URL + '/timeTracker/deliverable',
        params: {
          emp_id: $scope.userId,
          project_id: $data.p_id,
          time_tracker_task_id: $data.time_tracker_task_id,
        },
      }).then(function mySuccess(response) {
        $scope.deliveryDetailsShow = true;
        $scope.hover_data = response.data.recordset;
        if ($data.p_id !== 0) {
          $scope.res_deliverable_id = response.data.recordset[0].deliverable_id;
          $scope.res_deliverable_id = response.data.recordset[0].deliverable_name;
        }
        $scope.myWelcome = response.data;
        $scope.right_project_id = $data.p_id;
        $scope.entities_scope = [];
        $scope.right_project_name = "";
        $scope.names = [];
        $scope.active_activities_array = [];
        $scope.right_project_id = $data.p_id;
        $scope.entities_scope = [];
        entities = [];

        activities_array = response.data.recordsets[1];
        $scope.billedPeerList = response.data.recordsets[3];
        $scope.otherData = response.data.recordsets[6];
        //console.log(" >> estHrsLabel >> "+response.data.recordsets[6][0].estimated_hours);
        if( response.data.recordsets[6][0].estimated_hours < 10){
          $scope.estHrsLabel = "0"+response.data.recordsets[6][0].estimated_hours;
        }
        else{
          $scope.estHrsLabel = response.data.recordsets[6][0].estimated_hours;
        }
        //console.log(" >> estMinsLabel >> "+response.data.recordsets[6][0].estimated_mins);
        if( response.data.recordsets[6][0].estimated_mins < 10 ){
          $scope.estMinsLabel = "0"+response.data.recordsets[6][0].estimated_mins;
        }
        else{
          $scope.estMinsLabel = response.data.recordsets[6][0].estimated_mins;
        }

        $scope.timeTracker_Task_id_qb = response.data.recordsets[6][0].time_tracker_task_id;
        $scope.timeTracker_project_qb = response.data.recordsets[6][0].project_id;
        $scope.timeTracker_Date_qb = response.data.recordsets[6][0].time_tracker_date;
        $scope.Recurring_Task_qb = response.data.recordsets[6][0].Recurring_Task;
        $scope.otherData = timeTrackerService.getFinalOtherData($scope.otherData, $scope.billedPeerList);
        if( $scope.otherData[0].peer_rework == 'Y'){
          disablePeerDropdown = false;
        }
        else{
          disablePeerDropdown = true;
        }
        $scope.curr_index = index;
        $scope.currTable = currTable;
        $scope.billBtnSH = (currTable == '1' || currTable == '0') ? true : false;
        $scope.comment = response.data.recordsets[6][0].comments;
        $scope.service_name_qb = response.data.recordsets[6][0].service_name;
        $scope.task_id_qb = response.data.recordsets[6][0].task_id;
        $scope.project_id_qb = response.data.recordsets[6][0].project_id;
        var allocation_table = "<table class='table'>";
        allocation_table = allocation_table +"<tr><td>Allocation Comments</td><td>"+response.data.recordsets[6][0].Allocation_Comment+"</td></tr>"
        allocation_table = allocation_table +"<tr><td>Estimated Hours</td><td>"+$scope.estHrsLabel+":"+$scope.estMinsLabel+"</td></tr>";
        allocation_table = allocation_table +"<tr><td>Allocated By</td><td>"+response.data.recordsets[6][0].created_by_name+"("+response.data.recordsets[6][0].created_by+")"+"</td></tr>";
        allocation_table = allocation_table +"</table>";
        $scope.task_allocation_details = allocation_table;
        console.log(" >> task_allocation_details >> "+$scope.task_allocation_details);



        if ($data.p_id != 0) {
          $scope.names = [];
          names = [];
          $scope.right_project_name = response.data.recordset[0].project_name;
          angular.forEach(response.data.recordsets[0], function(x) {
            var delerble_name = "";
            if(x.description == undefined || x.description == null){
              delerble_name = x.deliverable_name;
            }
            else{
              delerble_name = x.deliverable_name+"("+x.description+")";
            }
            names.push({
              "name": delerble_name,
              "id": x.deliverable_id,
              "p_deliverable_id": x.project_deliverable_id,
              "description": x.description,
              "array": [x.deliverable_id, x.deliverable_name, x.project_deliverable_id, x.description]
            });
          });

          $scope.names = names;
          angular.forEach(names, function(value, key) {
            angular.forEach($scope.otherData, function(value2, key2) {
              if (angular.equals(value.p_deliverable_id, value2.project_deliverable_id)) {
                $scope.select.delivery_name = value;
              }
            });
          });


          angular.forEach(response.data.recordsets[2], function(x) {
            entities.push({
              "service_name": x.service_name,
              "service_id": x.cfds_id,
              "p_deliverable_id": x.project_deliverable_id,
              "array": [x.deliverable_id, x.deliverable_name, x.project_deliverable_id]
            });
          });
          $scope.entities_scope = entities;
          /*$scope.selectedServiceTab = userCfdsId;*/
          /*for(var i = 0 ; i< $scope.entities_scope.length; i++)
          {
            //.log(" >> service_name_qb >> "+$scope.service_name_qb);
            //console.log(" >> service_name >> "+$scope.entities_scope[i].service_name);
            console.log(" >> activeIndex >> "+$scope.activeIndex+" >> "+$scope.service_name_qb+" >>"+$scope.entities_scope[i].service_name);
            if($scope.service_name_qb == $scope.entities_scope[i].service_name){
              $scope.activeIndex = i;
              console.log(" >> activeIndex >> "+$scope.activeIndex+" >> "+$scope.service_name_qb+" >>"+$scope.entities_scope[i].service_name);
            }
            console.log(" >> activeIndex >> "+$scope.activeIndex+" >> "+$scope.service_name_qb+" >>"+$scope.entities_scope[i].service_name);
          }*/
        } else {
          $scope.names = [];
          names = [];
          if( response.data.recordsets[4][0].client_name != undefined && response.data.recordsets[4][0].client_name != null && response.data.recordsets[4][0].client_name != '')
          {
              $scope.right_project_name = response.data.recordsets[4][0].client_name;
          }
          else
          {
              $scope.right_project_name = "Non Project Time";
          }

          angular.forEach(response.data.recordsets[4], function(x) {
            names.push({
              "name": x.client_name,
              "id": x.client_id
            });
          });

          $scope.names = names;
          activities_array = response.data.recordsets[5];
          entities = [];
          $scope.entities_scope = [];
          angular.forEach(response.data.recordsets[2], function(value, key) {
            console.log("value.cfds_id>>>" + value.cfds_id);
            entities.push({
              "service_name": value.service_name,
              "service_id": value.cfds_id
            });
          });
          $scope.entities_scope = entities;
        }


        var selectedServiceTab="0";
        $scope.outerList =[];
        var menuList =JSON.stringify(response.data.recordsets[1]);
        var menuListArr = JSON.parse(menuList);
        var outerMenuList = [];
        for ( var i = 0 ; i < menuListArr.length ; i++ ) {
          var menu = menuListArr[ i ];
          if ((outerMenuList).indexOf(menu.service_name) == -1) {
            outerMenuList.push(menu.service_name);
          }
        }
        var outerList = [];
        var taskExists = "N",existingTaskId,existingTaskName,existingSerName;
        $scope.cat_activity_data = [];
        for( var i = 0 ; i < outerMenuList.length ; i++ ){
          var mainMenu = outerMenuList[ i ];
          if( $scope.service_name_qb == undefined || $scope.service_name_qb == null ){
            selectedServiceTab = 0;
          }
          else{
            if($scope.service_name_qb == mainMenu){
              selectedServiceTab = i;
            }
          }
          var jsonObj= {
            "service_name":outerMenuList[ i ],
            "innerMenu":[]
          };
          for ( var j = 0 ; j < menuListArr.length ; j++ ) {
            if(mainMenu == menuListArr[j].service_name)
            {
              //console.log(" menuListArr[j].billable >> "+menuListArr[j].billable);
              console.log("");
              if($scope.project_id_qb == undefined || $scope.project_id_qb == null || $scope.project_id_qb == '0' || $scope.project_id_qb == 0 ){
                if(menuListArr[j].billable =='N'){
                  var innerMenu = {};
                  innerMenu.task_id = menuListArr[j].task_id;
                  innerMenu.task_name = menuListArr[j].task_name;
                  innerMenu.cfds_id = menuListArr[j].cfds_id;
                  innerMenu.task_name = menuListArr[j].task_name;
                  innerMenu.billable = menuListArr[j].billable;
                  if( $scope.task_id_qb == undefined || $scope.task_id_qb == null ){
                      innerMenu.btnClass = innerMenu.billable =='Y' ? 'info' : 'danger';
                  }
                  else{
                    if( $scope.task_id_qb == innerMenu.task_id){
                      innerMenu.btnClass = "success";
                      innerMenu.styleClassback = innerMenu.billable =='Y' ? 'background-color: #B2EAC3' : 'background-color: #fb9678';
                      taskExists = 'Y';
                      existingTaskId = innerMenu.task_id;
                      existingTaskName = innerMenu.task_name;
                      existingSerName = menuListArr[j].service_name;
                    }
                    else{
                      innerMenu.btnClass = (innerMenu.billable =='Y' ? 'info' : 'danger');
                    }
                  }
                  jsonObj.innerMenu.push(innerMenu);
                }
              }
              else{
                var innerMenu = {};
                innerMenu.task_id = menuListArr[j].task_id;
                innerMenu.task_name = menuListArr[j].task_name;
                innerMenu.cfds_id = menuListArr[j].cfds_id;
                innerMenu.task_name = menuListArr[j].task_name;
                innerMenu.billable = menuListArr[j].billable;
                if( $scope.task_id_qb == undefined || $scope.task_id_qb == null ){
                    innerMenu.btnClass = innerMenu.billable =='Y' ? 'info' : 'danger';
                }
                else{
                  if( $scope.task_id_qb == innerMenu.task_id){
                    innerMenu.btnClass = "success";
                    innerMenu.styleClassback = innerMenu.billable =='Y' ? 'background-color: #B2EAC3' : 'background-color: #fb9678';
                    taskExists = 'Y';
                    existingTaskId = innerMenu.task_id;
                    existingTaskName = innerMenu.task_name;
                    existingSerName = menuListArr[j].service_name;
                  }
                  else{
                    innerMenu.btnClass = (innerMenu.billable =='Y' ? 'info' : 'danger');
                  }
                }
                jsonObj.innerMenu.push(innerMenu);
              }
            }
          }
          outerList.push(jsonObj);
        }
        console.log(">> taskExists >> "+taskExists+" >> existingTaskId >> "+existingTaskId+" >> existingTaskName >> "+existingTaskName+" >> existingSerName >> "+existingSerName);
        if(taskExists == 'Y'){
          $scope.cat_activity_data.push(existingTaskId, existingTaskName, existingSerName);
        }
        else{
          $scope.cat_activity_data = [];
        }
        $scope.outerList = outerList;
        $scope.selectedServiceTab = selectedServiceTab;
        console.log(" >> selectedServiceTab >> "+$scope.selectedServiceTab);
        $timeout(
          function(){
            //console.log(">> serviceTab click called >> .serviceTab"+selectedServiceTab);
            $(".serviceTab"+selectedServiceTab+"").children().click();
            //console.log(">> serviceTab click called >>");
        },50);
        console.log(" >> "+$scope.selectedServiceTab);



        /*console.log("$scope.otherData[0].cfds_id>>" + $scope.otherData[0].cfds_id);
        var count2 = 0;
        angular.forEach($scope.entities_scope, function(value, key) {
          count2++;
          angular.forEach($scope.otherData, function(value2, key2) {
            if (angular.equals(value.service_id, value2.cfds_id)) {
              console.log("value2.cfds_id>>" + value2.cfds_id);
              if (value2.time_tracker_task_id === $data.time_tracker_task_id) {
                console.log("In IF IF@@@@@@@@@@@@@@@@@@" + count2);
                $scope.activeIndex = count2 - 1;
              }
              value.isActive = true;
            } else {
              value.isActive = false;
            }
          });
        });

        if (!$scope.otherData[0].cfds_id) {
          var count = 0;
          angular.forEach($scope.entities_scope, function(value, key) {
            console.log("value.service_id>>" + value.service_id + "<<userCfdsId>>" + $scope.userCfdsId);
            count++;
            if (value.service_id === $scope.userCfdsId) {
              $scope.activeIndex = count - 1;
            }
          });
          console.log("count>>" + count);
        }
        console.log("$scope.activeIndex after selecting row>>" + $scope.activeIndex + "<<$scope.otherData[0].cfds_id>>" + $scope.otherData[0].cfds_id);
        if (!$scope.otherData[0].cfds_id) {
          $timeout(function(){
            $scope.setServiceTab($scope.activeIndex, $scope.userCfdsId);
          },1000);
        } else {
          $timeout(function(){
            $scope.setServiceTab($scope.activeIndex, $scope.otherData[0].cfds_id);
          },1000);
        }*/
        console.log(" >> currTable >> "+currTable+" >> index >> "+index);
        if(currTable === "0"){
          //console.log(" >> length >> "+$scope.todoList.length);
          for(var toDo=0; toDo< $scope.todoList.length; toDo++){
            if( toDo === index){
              $scope.todoList[toDo].disable = false;
            }
            else{
              $scope.todoList[toDo].disable = true;
            }
          }
        }
        if(currTable === "1"){
          //console.log(" >> length >> "+$scope.todayprojectList.length);
          for(var today=0; today< $scope.todayprojectList.length; today++){
            //console.log(">> today >> "+today+" >> index >> "+index+" >> disable >> "+$scope.todayprojectList[today].disable);
            if( today === index){
              $scope.todayprojectList[today].disable = false;
            }
            else{
              $scope.todayprojectList[today].disable = true;
            }
          }
        }
        if(currTable === "2"){
          //console.log(" >> length >> "+$scope.futureProjectone.length);
          for(var future=0; future< $scope.futureProjectone.length; future++){
            if( future === index){
              $scope.futureProjectone[future].disable = false;
            }
            else{
              $scope.futureProjectone[future].disable = true;
            }
          }
        }
        //$data.disable = false;
      }, function myError(response) {
        $scope.myWelcome = response.statusText;
      });
      /*$scope.activeIndex = 1;*/
      /*console.log("activeIndex>>" + $scope.activeIndex);*/
    }

    $scope.todoAdd = function() {
      console.log("$scope.todoInput >> "+$scope.todoInput);
      console.log("$scope.est_hrs >> "+$scope.est_hrs);
      console.log("$scope.est_mins >> "+$scope.est_mins);

      if($scope.est_hrs == undefined || $scope.est_hrs == null || $scope.est_hrs == ""){
        $scope.est_hrs=0;
      }

      if($scope.est_mins == undefined || $scope.est_mins == null || $scope.est_mins == ""){
        $scope.est_mins=0;
      }

      var error = false;

      if($scope.todoInput == undefined || $scope.todoInput == null || $scope.todoInput == ""){
        error = true;
      }
      if($scope.est_hrs != undefined && $scope.est_hrs != null && $scope.est_hrs != "" && $scope.est_hrs > 23 ){
        error = true;
      }
      if($scope.est_mins != undefined && $scope.est_mins != null  && $scope.est_mins != "" && $scope.est_mins > 59 ){
        error = true;
      }

      if(!error){
        if($scope.todoInput != undefined || $scope.todoInput == null || $scope.todoInput == "")
        {
          $scope.projectnameNumberAlert ="";
        }
        else{
          $scope.projectnameNumberAlert ="border:1px solid red";
        }
        if($scope.est_hrs != undefined && $scope.est_hrs != null && $scope.est_hrs != "" && $scope.est_hrs > 23 ){
          $scope.estHrsAlertToDo ="border:1px solid red";
        }
        else{
          $scope.estHrsAlertToDo ="";
        }
        if($scope.est_mins != undefined && $scope.est_mins != null && $scope.est_mins != "" && $scope.est_mins > 59 ){
          $scope.estMinsAlertToDo ="border:1px solid red";
        }
        else{
          $scope.estMinsAlertToDo ="";
        }
        $timeout(function() {
        /*var check_pause = angular.element('.glyphicon-pause').hasClass('ok');
        if (check_pause) {}*/
          $(".glyphicon-pause.ok").each(function(v, index) {
            var data_time = $(this).attr('time');
            $(this).click();
            $scope.pause_array.push(data_time);
          });
          console.log(" >> $scope.pause_array >> "+$scope.pause_array.length);
          console.log("valueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
          angular.forEach($scope.pause_array, function(value, key) {
            console.log(value);
            $('.' + value + '-play').click();
          });
        }, 1000);
        console.log("$scope.userId>>" + $scope.userId);
        var proj_id = $scope.todoInput.proj_id;
        $scope.todoInput = "";
        $scope.length = $scope.todoList.length;
        console.log($scope.length);
        var recurring = 'N';
        if ($scope.recurring) {
          recurring = 'Y';
        }
        $http({
          method: "GET",
          url: CONSTANT.API_URL + '/timeTracker/addTimedProjects',
          params: {
            proj_id: proj_id,
            task_date: $filter('date')($scope.task_date, 'yyyy-MM-dd'),
            est_hrs: $scope.est_hrs,
            est_mins: $scope.est_mins,
            recurring: recurring,
            emp_id: $scope.userId
          }
        }).then(function mySuccess(response) {
          $scope.result = response.data;
          console.log("responseeeeee <<<<<<<<<<<<<<<<<<<<<  --- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          console.log(response.data.recordsets[2]);
          if (response.data.recordsets[1].length > 0) {
            $scope.unbilled = true;
            $scope.unbilled_length = response.data.recordsets[1].length;
          }
          activeprojectList_array = [];
          $scope.todoList = activeprojectList_array;
          angular.forEach(response.data.recordsets[1], function(x) {
            $scope.elapseTime = x.executed_hours.toHHMMSS();
            activeprojectList_array.push({
              "todoText": x.project_number+"/"+x.project_name,
              "p_id": x.project_id,
              "p_date": new Date($filter('date')(x.time_tracker_date)),
              "p_org_date": new Date($filter('date')(x.time_tracker_date)),
              "executed_hrs": x.executed_hours,
              "time_tracker_task_id": x.time_tracker_task_id,
              "elapse_time": x.executed_hours.toHHMMSS(),
              "estimated_hours": x.estimated_hours,
              "estimated_mins": x.estimated_mins,
              "executed_hours": x.executed_hours,
              "executed_mins": x.executed_mins,
              "Recurring_Task":x.Recurring_Task,
              "trDisplay":""
            });
          });
          $scope.todoList = activeprojectList_array;
          if (response.data.recordsets[2].length > 0) {
            $scope.today = true;
            $scope.today_length = response.data.recordsets[2].length;
          }
          todayprojectList_array = [];
          $scope.todayprojectList = [];
          angular.forEach(response.data.recordsets[2], function(x) {
            $scope.elapseTime = x.executed_hours.toHHMMSS();
            todayprojectList_array.push({
              "todoText": x.project_number+"/"+x.project_name,
              "p_id": x.project_id,
              "p_date": new Date($filter('date')(x.time_tracker_date)),
              "p_org_date": new Date($filter('date')(x.time_tracker_date)),
              "executed_hrs": x.executed_hours,
              "elapse_time": x.executed_hours.toHHMMSS(),
              "estimated_hours": x.estimated_hours,
              "estimated_mins": x.estimated_mins,
              "executed_hours": x.executed_hours,
              "executed_mins": x.executed_mins,
              "time_tracker_task_id": x.time_tracker_task_id,
              "Recurring_Task": x.Recurring_Task,
              "flag": x.flag,
              "trDisplay":""
            });
          });
          $scope.todayprojectList = todayprojectList_array;
          if (response.data.recordsets[3].length > 0) {
            $scope.future = true;
            $scope.future_length = response.data.recordsets[3].length;
          }
          futureproject_array = [];
          angular.forEach(response.data.recordsets[3], function(x) {
            $scope.elapseTime = x.executed_hours.toHHMMSS();
            futureproject_array.push({
              "todoText": x.project_number+"/"+x.project_name,
              "p_id": x.project_id,
              "p_date": new Date($filter('date')(x.time_tracker_date)),
              "p_org_date": new Date($filter('date')(x.time_tracker_date)),
              "executed_hrs": x.executed_hours,
              "elapse_time": x.executed_hours.toHHMMSS(),
              "estimated_hours": x.estimated_hours,
              "estimated_mins": x.estimated_mins,
              "executed_hours": x.executed_hours,
              "executed_mins": x.executed_mins,
              "time_tracker_task_id": x.time_tracker_task_id,
              "Recurring_Task": x.Recurring_Task,
              "flag": x.flag,
              "trDisplay":""
            });
          });
          $scope.futureProjectone = futureproject_array;

          if($scope.todoList.length > 0){
            $scope.showTodoList = "visibility:visible;display:block;";
          }
          else{
            $scope.showTodoList = "visibility:hidden;display:none;";
          }

          if($scope.todayprojectList.length > 0){
            $scope.showTodayList = "visibility:visible;display:block;";
          }
          else{
            $scope.showTodayList = "visibility:hidden;display:none;";
          }

          if($scope.futureProjectone.length > 0){
            $scope.showFutureList = "visibility:visible;display:block;";
          }
          else{
            $scope.showFutureList = "visibility:hidden;display:none;";
          }

          $scope.pause_array = [];

          //$("#collapseTwoId").click();
          $scope.est_hrs = "";
          $scope.est_mins = "";
          $scope.recurring = false;
          $scope.task_date = $scope.task_date_state
        },
        function myError(response) {
          $scope.result = response.statusText;
        });
      }
      else{
        if($scope.todoInput == undefined || $scope.todoInput == null || $scope.todoInput == ""){
          $scope.projectnameNumberAlert ="border:1px solid red";
        }
        else{
          $scope.projectnameNumberAlert ="";
        }
        if($scope.est_hrs != undefined && $scope.est_hrs != null && $scope.est_hrs != "" && $scope.est_hrs > 23 ){
          $scope.estHrsAlertToDo ="border:1px solid red";
        }
        else{
          $scope.estHrsAlertToDo ="";
        }
        if($scope.est_mins != undefined && $scope.est_mins != null && $scope.est_mins != "" && $scope.est_mins > 59 ){
          $scope.estMinsAlertToDo ="border:1px solid red";
        }
        else{
          $scope.estMinsAlertToDo ="";
        }
        alert(" 1) Project Number/Name can not be blank \n 2) Estimated hour can not be greater than 23:59 ");
      }
    };

    $scope.remove = function($index, $time_tracker_task_id,exec_hrs,x) {
      console.log(">> index >> "+$index+" >> tracker_id >> "+$time_tracker_task_id+" >> exec_hrs >> "+exec_hrs+" >> x >> "+x);
      var oldList = $scope.todoList;
      var deleteitem = $scope.todoText;
      //$scope.todoList.splice($index, 1);
      x.trDisplay = "display:none";
      $scope.length = $scope.todoList.length;
      $scope.deliveryDetailsShow = false;

      /*$http({
        method: "GET",
        url: CONSTANT.API_URL + '/timeTracker/removeTask',
        params: {
          P_time_tracker_task_id: $time_tracker_task_id,
          P_employee_id: $scope.userId,
        },
      }).then(function mySuccess(response) {

      }, function myError(response) {
      });*/


      $scope.todoList = [];
      angular.forEach(oldList, function(x) {
        if (!x.done) $scope.todoList.push(x);
      });

      $scope.todoList.splice($index,1);

      if($scope.todoList.length > 0){
        $scope.showTodoList = "visibility:visible;display:block;";
      }
      else{
        $scope.showTodoList = "visibility:hidden;display:none;";
      }


    };

    $scope.removeTable = function($index, $time_tracker_task_id,exec_hrs,x) {
      console.log(">> index >> "+$index+" >> tracker_id >> "+$time_tracker_task_id+" >> exec_hrs >> "+exec_hrs+" >> x >> "+x);
      var oldList = $scope.todoList;
      var deleteitem = $scope.todoText;
    //  $scope.todoList.splice($index, 1);
      x.trDisplay = "display:none";
      $scope.length = $scope.todoList.length;
      $scope.deliveryDetailsShow = false;

      $http({
        method: "GET",
        url: CONSTANT.API_URL + '/timeTracker/removeTask',
        params: {
          P_time_tracker_task_id: $time_tracker_task_id,
          P_employee_id: $scope.userId,
        },
      }).then(function mySuccess(response) {

      }, function myError(response) {
      });


      $scope.todoList = [];
      angular.forEach(oldList, function(x) {
        if (!x.done) $scope.todoList.push(x);
      });
      if($scope.todoList.length > 0){
        $scope.showTodoList = "visibility:visible;display:block;";
      }
      else{
        $scope.showTodoList = "visibility:hidden;display:none;";
      }

    };

    $scope.removeFuture = function($index, $time_tracker_task_id,x) {
      var oldList = $scope.futureProjectone;
      var deleteitem = $scope.todoText;
      //$scope.futureProjectone.splice($index, 1);
      x.trDisplay = "display:none";
      $scope.length = $scope.futureProjectone.length;

      /*$http({
        method: "GET",
        url: CONSTANT.API_URL + '/timeTracker/removeTask',
        params: {
          P_time_tracker_task_id: $time_tracker_task_id,
          P_employee_id: $scope.userId,
        },
      }).then(function mySuccess(response) {

      }, function myError(response) {
      });*/


      $scope.futureProjectone = [];
      angular.forEach(oldList, function(x) {
        if (!x.done) $scope.futureProjectone.push(x);
      });
      $scope.deliveryDetailsShow = false;



      if($scope.futureProjectone.length > 0){
        $scope.showFutureList = "visibility:visible;display:block;";
      }
      else{
        $scope.showFutureList = "visibility:hidden;display:none;";
      }
    };

    $scope.removeFutureTable = function($index, $time_tracker_task_id,x) {
      var oldList = $scope.futureProjectone;
      var deleteitem = $scope.todoText;
      $scope.futureProjectone.splice($index, 1);
      x.trDisplay = "display:none";
      $scope.length = $scope.futureProjectone.length;

      $http({
        method: "GET",
        url: CONSTANT.API_URL + '/timeTracker/removeTask',
        params: {
          P_time_tracker_task_id: $time_tracker_task_id,
          P_employee_id: $scope.userId,
        },
      }).then(function mySuccess(response) {

      }, function myError(response) {
      });


      $scope.futureProjectone = [];
      angular.forEach(oldList, function(x) {
        if (!x.done) $scope.futureProjectone.push(x);
      });
      $scope.deliveryDetailsShow = false;

      if($scope.futureProjectone.length > 0){
        $scope.showFutureList = "visibility:visible;display:block;";
      }
      else{
        $scope.showFutureList = "visibility:hidden;display:none;";
      }
    };

    $scope.pauseAll = function() {

      //console.log(angular.element('.glyphicon-pause-task:not(.hide)').triggerHandler('click'));
      var pause_icon_length = $('.glyphicon-pause-task:not(.hide)').length;
      var input = [];


      $(".glyphicon-pause-task:not(.hide)").each(function(v, index) {
        var time_attr = $(this).attr('time');
        input.push(time_attr);
      });



      angular.forEach(input, function(value, key) {
        console.log(value);
        $('.' + value + '-pause').click();
      });

      //console.log(input);


    }

    $scope.removeToday = function($index, $time_tracker_task_id,x) {
      var oldList = $scope.todayprojectList;
      var deleteitem = $scope.todoText;
      //$scope.todayprojectList.splice($index, 1);
      x.trDisplay = "display:none";
      $scope.length = $scope.todayprojectList.length;

      /*$http({
        method: "GET",
        url: CONSTANT.API_URL + '/timeTracker/removeTask',
        params: {
          P_time_tracker_task_id: $time_tracker_task_id,
          P_employee_id: $scope.userId,
        },
      }).then(function mySuccess(response) {

      }, function myError(response) {
      });*/

      $scope.todayprojectList = [];
      $scope.deliveryDetailsShow = false;
      angular.forEach(oldList, function(x) {
        if (!x.done) $scope.todayprojectList.push(x);
      });

      $scope.todayprojectList.splice($index,1);

      if($scope.todayprojectList.length > 0){
        $scope.showTodayList = "visibility:visible;display:block;";
      }
      else{
        $scope.showTodayList = "visibility:hidden;display:none;";
      }
    };

    $scope.removeTodayTable = function($index, $time_tracker_task_id,x) {
      var oldList = $scope.todayprojectList;
      var deleteitem = $scope.todoText;
      $scope.todayprojectList.splice($index, 1);
      x.trDisplay = "display:none";
      $scope.length = $scope.todayprojectList.length;

      $http({
        method: "GET",
        url: CONSTANT.API_URL + '/timeTracker/removeTask',
        params: {
          P_time_tracker_task_id: $time_tracker_task_id,
          P_employee_id: $scope.userId,
        },
      }).then(function mySuccess(response) {

      }, function myError(response) {
      });

      $scope.todayprojectList = [];
      $scope.deliveryDetailsShow = false;
      angular.forEach(oldList, function(x) {
        if (!x.done) $scope.todayprojectList.push(x);
      });

      if($scope.todayprojectList.length > 0){
        $scope.showTodayList = "visibility:visible;display:block;";
      }
      else{
        $scope.showTodayList = "visibility:hidden;display:none;";
      }
    };


    /***Time Tracker function calls end here**/
    $scope.getBilledActivities = function() {
      console.log("In getOnloadData()>>" + calendarDate);
      var inputParams = {
        "employee_id": $scope.userId,
        "curr_date": calendarDate,
        "cfds_id": $scope.userCfdsId
      }

      timeTrackerService.getBilledActivities(inputParams).then(projectResp, getError).catch(errorCallback);

      function projectResp(response) {
        console.log("response>>" + response);
        if (response != "error") {
          //$scope.projectBilledList = response.recordsets[0];
          $scope.projectBilledListTemp = response.recordsets[0];
          $scope.nonProjectBilledListTemp = response.recordsets[1];
          $scope.employeeDetails = response.recordsets[2];
          $scope.backDatedEntryDate = response.recordsets[3];
          $scope.dateRange = response.recordsets[4];
          $scope.hoursExecutedList = response.recordsets[5];
          $scope.timeTrackerDate = response.recordsets[6];
          $scope.projectDropdownList = response.recordsets[7];

          $scope.projectBilledList = timeTrackerService.getBilledList($scope.projectBilledListTemp);
          /*.then(showHideTable, getError).catch(errorCallback);*/
          $scope.nonProjectBilledList = timeTrackerService.getNPBilledList($scope.nonProjectBilledListTemp);
          /*.then(showHideTable, getError).catch(errorCallback);*/
          console.log("$scope.showTable value>>" + $scope.showTable);
          console.log("$scope.nonProjectBilledList >>" + $scope.nonProjectBilledList.length);

          if (($scope.projectBilledList && $scope.projectBilledList.length > 0) && ($scope.nonProjectBilledList && $scope.nonProjectBilledList.length > 0)) {
            /*console.log("In IF ProjectList");*/
            $scope.showTable.projectTable = true;
            $scope.showTable.nonProjectTable = true;
          }else if($scope.projectBilledList && $scope.projectBilledList.length > 0){
            $scope.showTable.projectTable = true;
            $scope.showTable.nonProjectTable = false;
          } else if ($scope.nonProjectBilledList && $scope.nonProjectBilledList.length > 0) {
            $scope.showTable.projectTable = false;
            $scope.showTable.nonProjectTable = true;
          } else {
            console.log("In else npTable");
            $scope.showTable.projectTable = false;
            $scope.showTable.nonProjectTable = false;
          }

          /*$scope.showHideTable($scope.projectBilledList, 'p');
          $scope.showHideTable($scope.nonProjectBilledList, 'np');*/

          /*function showHideTable(list, listType) {
            console.log("In showHideTable()");
            console.log("In showHideTable() list>>" + list);
            if (list && list.length > 0 && listType === 'p') {
              $scope.showTable.projectTable = true;
            } else if (list && list.length > 0 && listType === 'np') {
              $scope.showTable.nonProjectTable = true;
            } else {
              $scope.showTable.projectTable = false;
              $scope.showTable.nonProjectTable = false;
            }
          }*/
          console.log("$scope.showTable.projectTable >>" + $scope.showTable.projectTable);
          console.log("$scope.showTable.nonProjectTable >>" + $scope.showTable.nonProjectTable);
          /*console.log("$scope.projectDropdownList>>" + $scope.projectDropdownList.length);*/
        } else {
          alert("Some error occurred!!");
        }
      }
    } /*********end of $scope.getBilledActivities()**********/

    //$scope.getBilledActivities(); /*****calling function on page load******/

    /*$("#executed_hours").timepicker({
      format: 'hh:mm'
    });*/

    /*var myTimepicker = $timepicker(element, ngModelController);
    console.log("myTimepicker>>" + myTimepicker);*/
    var projectDeliverablesListTemp = [];
    var peerProjectListTemp = [];

    $scope.edit = function(rowObj, flag) {
      console.log("In edit()");

      var editParams = [];

      if (flag === 'p') {
        editParams = {
          "project_task_id": rowObj.project_task_id,
          "project_id": rowObj.project_id,
          "employee_id": $scope.userId
        }
      } else {
        editParams = {
          "project_task_id": rowObj.project_task_id,
          "project_id": '0',
          "employee_id": $scope.userId
        }
      }
      timeTrackerService.getEditData(editParams).then(projectResp, getError).catch(errorCallback);

      function projectResp(response) {
        console.log("response>>" + response);
        if (response != "error") {
          $scope.projectList = response.recordsets[0];
          projectDeliverablesListTemp = response.recordsets[1];
          $scope.projectDeliverableList = response.recordsets[1];
          $scope.taskList = response.recordsets[2];
          $scope.clientList = response.recordsets[3];
          peerProjectListTemp = response.recordsets[4];
          $scope.peerProjectList = response.recordsets[4];


          timeTrackerService.getEditProjectBilledList(rowObj, $scope.projectBilledListTemp, $scope.peerProjectList, $scope.projectDeliverableList);
          timeTrackerService.getEditNonProjectBilledList(rowObj, $scope.nonProjectBilledListTemp, $scope.peerProjectList);

          $scope.disablePeerDropdown(rowObj);
          $scope.onProjectChange(rowObj);
        } else {
          alert("Some error occurred!!");
        }
      }
    }

    $scope.onProjectChange = function(projectObj){
      console.log("In onProjectChange >>" + projectObj.selectedProject + "<<length before>>" + $scope.projectDeliverableList.length);
      $scope.projectDeliverableList = projectDeliverablesListTemp;
      $scope.peerProjectList = peerProjectListTemp;

      $scope.projectDeliverableList = $scope.projectDeliverableList.filter(function(x) {
        return x.project_id == projectObj.selectedProject;
      });
      console.log("In projectDeliverableList length >>" + $scope.projectDeliverableList.length);

      $scope.peerProjectList = $scope.peerProjectList.filter(function(x) {
        return x.project_id == projectObj.selectedProject;
      });
    }

    $scope.cancel = function() {
      console.log("In cancel()");
      $scope.getBilledActivities();
    }

    $scope.save = function(rowObj, flag) {
      console.log("In save()" + rowObj.isWeekend);
      console.log("In save()" + rowObj.isPeerRework);

      var params = [], errorMsg = "";

      if (flag === 'p') {
        rowObj.executed_hours = (rowObj.hours?rowObj.hours:0) + ":" + (rowObj.mins?rowObj.mins:0);
        params = {
          "rowObj": rowObj,
          "user_id": $scope.userId,
          "insert_update_flag": 'U'
        }
        console.log("rowObj.selectedPeerName >>" + rowObj.selectedPeerName);
        console.log("rowObj.selectedProject >>" + rowObj.selectedProject);

        if(!rowObj.selectedProject){
          errorMsg = "project missing";
          rowObj.p_border = {'width': 100 + '%','border-color':'red'};
        } else {
          rowObj.p_border = {'width': 100 + '%','border-color':''};
        }

        if(!rowObj.selectedDeliverable){
          errorMsg = "delivery missing";
          rowObj.d_border = {'width': 100 + '%','border-color':'red'};
        } else {
          rowObj.d_border = {'width': 100 + '%','border-color':''};
        }

        if(!rowObj.selectedTask){
          errorMsg = "task missing";
          rowObj.t_border = {'width': 100 + '%','border-color':'red'};
        } else {
          rowObj.t_border = {'width': 100 + '%','border-color':''};
        }

        if(rowObj.isPeerRework == 'Y' && (rowObj.selectedPeerName?!rowObj.selectedPeerName.employee_name_no:!rowObj.selectedPeerName)){
          errorMsg = "peer missing";
          rowObj.pr_border = {'width': 100 + '%','border-color':'red'};
        } else {
          rowObj.pr_border = {'width': 100 + '%','border-color':''};
        }

      } else if (flag === 'd') {
        params = {
          "rowObj": rowObj,
          "user_id": $scope.userId,
          "insert_update_flag": 'D'
        }
      } else {
        rowObj.selectedProject = 0;
        rowObj.selectedDeliverable = 0;
        rowObj.client_id = rowObj.selectedClient;
        rowObj.executed_hours = (rowObj.hours?rowObj.hours:0) + ":" + (rowObj.mins?rowObj.mins:0);
        console.log("rowObj.selectedClient >>" + rowObj.selectedClient);
        params = {
          "rowObj": rowObj,
          "user_id": $scope.userId,
          "insert_update_flag": 'N'
        }

        if(!rowObj.selectedClient){
          errorMsg = "project missing";
          rowObj.npc_border = {'width': 100 + '%','border-color':'red'};
        } else {
          rowObj.npc_border = {'width': 100 + '%','border-color':''};
        }

        if(!rowObj.selectedTask){
          errorMsg = "task missing";
          rowObj.npt_border = {'width': 100 + '%','border-color':'red'};
        } else {
          rowObj.npt_border = {'width': 100 + '%','border-color':''};
        }
      }
      /*console.log("rowObj.selectedPeerName >>" + rowObj.selectedPeerName.employee_name_no);
      console.log("rowObj.selectedProject >>" + rowObj.selectedProject);*/

      console.log("errorMsg >>" + errorMsg + "<<>>");
      if(!errorMsg && $scope.validHours(rowObj)){
        timeTrackerService.save(params).then(projectResp, getError).catch(errorCallback);

        function projectResp(response) {
          console.log("response>>" + response);
          if (response != "error") {
            console.log("success!! calling getBilledActivities()");
            $scope.getBilledActivities();
          } else {
            alert("Some error occurred!!");
          }
        }
      } else {
        console.log("In else");

        $.toast({
            heading: 'Please select highlighted fields!!',
            text: 'Hours cannot be > 23 and minutes cannot be > 59!!',
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'error',
            hideAfter: 3500,
            stack: 6
          });
      }
    }

    $scope.onPageChanges = function(index,flag){

      angular.forEach($scope.projectBilledList,function(value,key){
        value.cmntBoxStyle = {'visibility': 'hidden'};
      })
      if(flag === 'showCmntBox'){
        $scope.projectBilledList[index].cmntBoxStyle = {'visibility': 'visible'};
      };
      if(flag === 'hideCmntBox'){
        $scope.projectBilledList[index].cmntBoxStyle = {'visibility': 'hidden'};
        $scope.projectBilledList[index].showCmntImg = $scope.projectBilledList[index].description.length > 0 ? true : false;
      };
    }

    $scope.onPageChangesNP = function(index,flag){

      angular.forEach($scope.nonProjectBilledList,function(value,key){
        value.cmntBoxStyle = {'visibility': 'hidden'};
      })
      if(flag === 'showCmntBox'){
        $scope.nonProjectBilledList[index].cmntBoxStyle = {'visibility': 'visible'};
      };
      if(flag === 'hideCmntBox'){
        $scope.nonProjectBilledList[index].cmntBoxStyle = {'visibility': 'hidden'};
        $scope.nonProjectBilledList[index].showCmntImg = $scope.nonProjectBilledList[index].description.length > 0 ? true : false;
      };
    }

    $scope.validHours = function(rowObj){
      var errMsg = "";
      //var executed_hours = (hours?hours:"0") + ":" + (mins?mins:"0");
      var hours = rowObj.executed_hours?rowObj.executed_hours.split(":")[0]:"0";
      var mins = rowObj.executed_hours?rowObj.executed_hours.split(":")[1]:"0";
      console.log("hours >>" + hours + "<< mins >>" + mins);

      if(parseInt(hours) > 23) {
        errMsg = "Invalid hours";
      } else if(parseInt(mins) > 59) {
        errMsg = "Invalid mins";
      } else if(parseInt(hours) == 0 && parseInt(mins) == 0) {
        errMsg = "Invalid";
      }
      console.log("errMsg >> " + errMsg);
      if(errMsg) {
        rowObj.timeBorder = {'border-color':'red'};
        return false;
      } else {
        rowObj.timeBorder = {'border-color':''};
        return true;
      }

    }

    /*$scope.delete = function(rowObj, flag) {
      console.log("In delete()");

      var params = {
          "rowObj": rowObj,
          "user_id": $scope.userId,
          "insert_update_flag": 'D'
        }

      timeTrackerService.save(params).then(projectResp, getError).catch(errorCallback);

      function projectResp(response) {
        console.log("response>>" + response);
        if (response != "error") {
          console.log("success!! calling getBilledActivities()");
          $scope.getBilledActivities();
        } else {
          alert("Some error occurred!!");
        }
      }
    }*/

    /********************************************Handover block starts here**************************************************/
    $scope.additionalHandoverList = [];
    $scope.handoverOnload = function() {
      console.log("In handoverOnload()");

      timeTrackerService.handoverOnload($scope.userId).then(projectResp, getError).catch(errorCallback);

      function projectResp(response) {
        console.log("response>>" + response);
        if (response != "error") {
          console.log("calling handoverOnload()");
          $scope.handoverListTemp = response.recordsets[0];
          $scope.additionalHandoverListTemp = response.recordsets[1];
          $scope.h_projectListTemp = response.recordsets[2];
          $scope.h_nonProjectListTemp = response.recordsets[3];
          $scope.assignToEmpList = response.recordsets[4];

          $scope.handoverList = timeTrackerService.getModifiedHandoverList($scope.handoverListTemp, $scope.assignToEmpList);
          $scope.h_projectList = timeTrackerService.getHandoverList($scope.handoverList, $scope.h_projectListTemp);
          $scope.h_nonProjectList = timeTrackerService.getNonProjectHandoverList($scope.handoverList, $scope.h_nonProjectListTemp);
          $scope.additionalHandoverList = timeTrackerService.getAdditionalHandoverList($scope.additionalHandoverListTemp, $scope.assignToEmpList);

          /*$scope.showHideTable($scope.h_projectList, 'hp');
          $scope.showHideTable($scope.h_nonProjectList, 'hnp');
          $scope.showHideTable($scope.additionalHandoverList, 'a');*/

          if ($scope.h_projectList && $scope.h_projectList.length > 0) {
            $scope.showTable.h_projectTable = true;
          }

          if ($scope.h_nonProjectList && $scope.h_nonProjectList.length > 0) {
            $scope.showTable.h_nonProjectTable = true;
          }

          if ($scope.additionalHandoverList && $scope.additionalHandoverList.length > 0) {
            $scope.showTable.additionalHandoverTable = true;
          } /*else {
            $scope.showTable.h_projectTable = false;
            $scope.showTable.h_nonProjectTable = false;
            $scope.showTable.additionalHandoverTable = false;
          }*/


        } else {
          alert("Some error occurred!!");
        }
      }
    }

    /****Handover On Save validation starts here****/
    $scope.validations = function(){
     var errorMsg = "";
     _.each($scope.h_projectList, function(handoverObj){
       console.log("handoverObj.status >>" + handoverObj.status);
       if(!handoverObj.status && !handoverObj.assign_employee_name){
         errorMsg += "In case of pending handover assigned to employee name mandatory!!";
         handoverObj.css = {'width': 100 + '%','border-color':'red'};
         handoverObj.class = "radioNotSelected";
       } else {
         handoverObj.css = {'width': 100 + '%','border-color':''};
         handoverObj.class = "radioSelected";
       }
     });
     _.each($scope.h_nonProjectListTemp, function(npHandoverObj){
       if(!npHandoverObj.status && !npHandoverObj.assign_employee_name){
         errorMsg += "In case of pending handover assigned to employee name mandatory!!";
         npHandoverObj.css = {'width': 100 + '%','border-color':'red'};
         npHandoverObj.class = "radioNotSelected";
       } else {
         npHandoverObj.css = {'width': 100 + '%','border-color':''};
         npHandoverObj.class = "radioSelected";
       }
     });
     _.each($scope.additionalHandoverList, function(addHandoverObj){
       console.log("addHandoverObj.selectedProject >>" + addHandoverObj.selectedProject);
       if(!addHandoverObj.status && !addHandoverObj.assign_employee_name){
         errorMsg += "In case of pending handover assigned to employee name mandatory!!";
         addHandoverObj.css = {'width': 100 + '%','border-color':'red'};
         addHandoverObj.class = "radioNotSelected";
       } else {
         addHandoverObj.css = {'width': 100 + '%','border-color':''};
         addHandoverObj.class = "radioSelected";
       }
       if(!addHandoverObj.selectedProject || addHandoverObj.selectedProject == "-1"){
         errorMsg += "In case of additional handover, project name mandatory!!";
         addHandoverObj.projectDDcss = {'width': 100 + '%','border-color':'red'};
       }
       if(!addHandoverObj.handover_comments){
         errorMsg += "In case of pending handover assigned to employee name mandatory!!";
         addHandoverObj.commentCss = {'width': 100 + '%','border-color':'red'};
       }
     });
     console.log("errorMsg >>" + errorMsg);
     if(errorMsg){
       alert("Please select highlighted fields!!");
       $scope.closeModal = "error";
       return false;
     } else {
       $scope.closeModal = "modal";
       return true;
     }
   }
   /****Handover On Save validation ends here****/

   $scope.saveHandover = function() {
     console.log("In saveHandover()");

     /*$scope.validations();*/

     if($scope.validations()){

       var handoverStr = timeTrackerService.getSaveHandoverStr($scope.h_projectList, $scope.h_nonProjectList, $scope.additionalHandoverList);

       var params = {
         "user_id": $scope.userId,
         "handoverStr": handoverStr
       }

       timeTrackerService.saveHandover(params).then(projectResp, getError).catch(errorCallback);

       function projectResp(response) {
         console.log("response>>" + response);
         if (response != "error") {
           console.log("Success Save handover successfull");
           $.toast({
             heading: 'Handover',
             text: 'Updated Successfully',
             position: 'top-right',
             loaderBg: '#ff6849',
             icon: 'success',
             hideAfter: 3500,
             stack: 6
           });
         } else {
           alert("Some error occurred!!");
         }
       }
     } else {
       console.log("Some Error occurred... Did not call service!!");
     }
   }

    $scope.addRows = function() {
      console.log("In addRows()");

      $scope.additionalHandoverList.push({
        'selectedProject': '-1',
        'status': false,
        'unique_id': Date.now(),
        'assign_employee_name': '',
        'estimated_hours': '',
        'handover_comments': '',
        'additional_id': 0
      });
      $scope.showTable.additionalHandoverTable = true;
      /*$scope.showHideTable($scope.additionalHandoverList, 'a');*/
    }

    $scope.assignedTo = function(obj) {
      console.log("In assignedTo() ::>" + obj.status);

      if (obj.status) {
        obj.disableAssignedTo = true;
        obj.assign_employee_name = '';
        obj.estimated_hours = "";
      } else {
        obj.disableAssignedTo = false;
      }

    }

    $scope.peerDropdown = function(obj) {
      console.log("In peerDropdown() ::>" + obj);

      if (angular.equals(obj, 'N')) {
        console.log("In peerdd if");
        $scope.disablePeerDropdown = true;
        $scope.otherData[0].selectedEmployee = [];
      } else {
        $scope.disablePeerDropdown = false;
      }
    }

    $scope.disablePeerDropdown = function(obj) {
      console.log("In disablePeerDropdown() ::>" + obj.isPeerRework);

      if (angular.equals(obj.isPeerRework, 'N') || !obj.isPeerRework) {
        console.log("In peerdd if");
        obj.disablePeerDropdown = true;
        obj.selectedPeerName = [];
      } else {
        obj.disablePeerDropdown = false;
      }
    }
    /********************************************Handover block ends here**************************************************/
    /**********************************************Service calls and Page functions ends here ******************************/
    /*Promise reject function*/
    function getError(reason) {
      console.log(reason);
    };
    /*Promise CATCH function*/
    function errorCallback(errorMessage) {
      console.log(errorMessage);
    };
  };
})();

workflow.controller("stopWatchDemoCtrl", function($scope, States, $attrs, $http, CONSTANT) {
    $scope.stopwatches = [{
      interval: 1000,
      log: []
    }];
    console.log('----------------------->>>>>>>>>>>>>>>>>>>',$scope.x.executed_hrs); // Prints 'someCustomValue'

  })
  /*.directive('bbStopwatch', ['StopwatchFactory', function(StopwatchFactory, $http) {
      return {
        restrict: 'EA',
        scope: true,
        link: function(scope, elem, attrs) {
          console.log(scope.x.executed_hrs); // Prints 'someCustomValue'

          var stopwatchService = new StopwatchFactory(scope[attrs.options], scope.x.executed_hrs);

          scope.startTimer = stopwatchService.startTimer;
          scope.stopTimer = stopwatchService.stopTimer;
          scope.resetTimer = stopwatchService.resetTimer;

        }
      };
    }])*/
  /*.factory('StopwatchFactory', ['$interval', '$http', 'CONSTANT', function($interval, $http, CONSTANT) {

    return function(options, e) {
      console.log(".........." + e);
      var startTime = 0,
        currentTime = null,
        offset = 0,
        interval = null,
        self = this;

      if (!options.interval) {
        options.interval = 100;
      }
      if (typeof options.elapsedTime != "undefined") {
        // e = options.elapsedTime;

      } else {
        options.elapsedTime = new Date(e * 1000);
      }

      self.running = false;

      function pushToLog(lap) {
        if (options.log !== undefined) {
          options.log.push(lap);
        }
      }

      self.updateTime = function() {
        currentTime = new Date().getTime();
        /*console.log("start time___________" + startTime);
        console.log(offset);
        var timeElapsed = e * 1000 + (currentTime - startTime);
        /*console.log(timeElapsed);
        options.elapsedTime.setTime(timeElapsed);
      };

      self.startTimer = function(m, userId) {
        console.log("userId in pause>>" + userId);
        $('.' + m.time_tracker_task_id + '-play').addClass('hide');
        $('.' + m.time_tracker_task_id + '-pause').removeClass('hide');

        $http({
          method: "GET",
          url: CONSTANT.API_URL + '/timeTracker/playpause',
          params: {
            P_employee_id: userId,
            P_string: m.p_id + "~~" + m.time_tracker_task_id + "~~" + "S" + "@@",
          },
        }).then(function mySuccess(response) {
          //  $scope.myWelcome = response.data;
          /*var executedHourList1 = response.data.recordsets[0];
          var el_time = 0;
          angular.forEach(executedHourList1, function(value, key){
            el_time = value.executed_hours;
          });
          updateTime(el_time);
        }, function myError(response) {
          //$scope.myWelcome = response.statusText;
        });

        if (self.running === false) {
          startTime = new Date().getTime();
          interval = $interval(self.updateTime, options.interval);
          self.running = true;
        }
      };

      self.stopTimer = function(m, userId) {

        $('.' + m.time_tracker_task_id + '-pause').addClass('hide');
        $('.' + m.time_tracker_task_id + '-play').removeClass('hide');

        $http({
          method: "GET",
          url: CONSTANT.API_URL + '/timeTracker/playpause',
          params: {
            P_employee_id: userId,
            P_string: m.p_id + "~~" + m.time_tracker_task_id + "~~" + "P" + "@@",
          },
        }).then(function mySuccess(response) {
          /*var executedHourList2 = response.data.recordsets[0];
          var el_time = 0;
          angular.forEach(executedHourList2, function(value, key){
            el_time = value.executed_hours;
          });
          updateTime(el_time);
        }, function myError(response) {
          /*$scope.myWelcome = response.statusText;
        });


        if (self.running === false) {
          return;
        }
        self.updateTime();
        offset = offset + currentTime - startTime;
        pushToLog(currentTime - startTime);
        $interval.cancel(interval);
        self.running = false;
      };

      self.resetTimer = function() {
        startTime = new Date().getTime();
        options.elapsedTime.setTime(0);
        ß
        timeElapsed = offset = 0;
      };

      self.cancelTimer = function() {
        $interval.cancel(interval);
      };

      return self;

    };
  }]);*/

  .factory('StopwatchFactory', ['$interval', '$http', 'CONSTANT', function($interval, $http, CONSTANT) {
    console.log("<<<<==== StopwatchFactory ====>>>>");
    abc = function(options, e) {
      console.log(" In abc function",options);


      console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee");
      console.log(e);
      console.log("optionsssssssssssssssssssssssssssssssssssss");
      console.log(options);


      var exce_res;
      var startTime = 0,
        currentTime = null,
        offset = 0,
        interval = null,
        self = this;

      if (!options.interval) {
        options.interval = 100;
      }
      if (typeof options.elapsedTime != "undefined") {
        // e = options.elapsedTime;

      } else {
        options.elapsedTime = new Date(e * 1000);
      }
      self.running = false;

      function pushToLog(lap) {
        if (options.log !== undefined) {
          options.log.push(lap);
        }
      }
      self.updateTime = function() {
        console.log('<<<<<<<<<<<<=====================In updateTime function=============>>>>>>>>>>>>>>')
        currentTime = new Date().getTime();
        if (typeof timeElapsed != "undefined") {
          // e = options.elapsedTime;

        } else {
          var timeElapsed = e * 1000 + (currentTime - startTime);

          if(timeElapsed > 86399999){

            self.cancelTimer();
            self.stopTimer();
          }
          options.elapsedTime.setTime(timeElapsed);
        }

        //setScope(options.elapsedTime);
      };

      self.startTimer = function(event, m, userId) {
        event.stopPropagation();
        console.log(m);
        $('.' + m.time_tracker_task_id + '-play').addClass('hide');
        $('.' + m.time_tracker_task_id + '-pause').removeClass('hide');



        $http({
          method: "GET",
          url: CONSTANT.API_URL + '/timeTracker/playpause',
          params: {
            P_employee_id: userId,
            P_string: m.p_id + "~~" + m.time_tracker_task_id + "~~" + "S" + "@@",
          },
        }).then(function mySuccess(response) {
          //startTime =
          m.flag = "S";
          return response;

        }, function myError(response) {
          //$scope.myWelcome = response.statusText;
        });


        if (self.running === false) {
          startTime = new Date().getTime();
          if(startTime > 86400000){
            self.cancelTimer();
          }

          interval = $interval(self.updateTime, options.interval);
          self.running = true;
        }
      };

      self.stopTimer = function(event,m, userId) {
        console.log(m);
        event.stopPropagation();

        $('.' + m.time_tracker_task_id + '-pause').addClass('hide');
        $('.' + m.time_tracker_task_id + '-play').removeClass('hide');

        var executedHrs = $http({
          method: "GET",
          url: CONSTANT.API_URL + '/timeTracker/playpause',
          params: {
            P_employee_id: userId,
            P_string: m.p_id + "~~" + m.time_tracker_task_id + "~~" + "P" + "@@",
          },
        }).then(function mySuccess(response) {
          //$scope.myWelcome = response.data;
          e = response.data.recordset[0].executed_hours;
          console.log("zzzzzzzzzzzzzzzzzzzzzzz");
          console.log(e);
        //  $scope.x.executed_hrs = e;
          //$scope.onloadData();
          console.log(response);


          todayprojectList_array = [];
          // Today Project List
          //console.log(" recordsets 1 >> "+JSON.stringify(response.data.recordsets[1]));
          angular.forEach(response.data.recordsets[2], function(x) {
          //  $scope.elapseTime = x.executed_hours.toHHMMSS();
            todayprojectList_array.push({
              "todoText": x.project_number+"/"+x.project_name,
              "p_id": x.project_id,
              "p_date": new Date($filter('date')(x.time_tracker_date)),
              "p_org_date": new Date($filter('date')(x.time_tracker_date)),
              "executed_hrs": x.executed_hours,
              "elapse_time": x.executed_hours.toHHMMSS(),
              "estimated_hours": x.estimated_hours,
              "estimated_mins": x.estimated_mins,
              "executed_hours": x.executed_hours,
              "executed_mins": x.executed_mins,
              "time_tracker_task_id": x.time_tracker_task_id,
              "Recurring_Task": x.Recurring_Task,
              "flag": x.flag,
              "trDisplay":"",
              "disable":"true"
            });
          });
          $scope.todayprojectList = todayprojectList_array;

          return e;



          m.flag = "P";
        }, function myError(response) {
          //$scope.myWelcome = response.statusText;
        });

          //$scope.x.executed_hrs = executedHrs;
        //console.log(" >> executedHrs >> ");
        console.log(executedHrs)

        if (self.running === false) {
          return;
        }
        self.updateTime();
        offset = offset + currentTime - startTime;
        pushToLog(currentTime - startTime);
        $interval.cancel(interval);
        self.running = false;
      };

      /*self.resetTimer = function(obj,userId,flag) {
        console.log(">> reset timer >> "+flag);
        if(flag == 'S'){
          self.stopTimer(obj,userId);
        }
        startTime = new Date().getTime();
        options.elapsedTime.setTime(0);
        timeElapsed = offset = 0;
        console.log(">> timeElapsed >> "+timeElapsed+" >> offset >> "+offset);
      };*/

      self.resetTimer = function(event,m,userId,flag) {
        console.log(">> m >> "+m+" >> userId >> "+userId+" >> flag >> "+flag);
        event.stopPropagation();

        var executedHrs = $http({
          method: "GET",
          url: CONSTANT.API_URL + '/timeTracker/playpause',
          params: {
            P_employee_id: userId,
            P_string: m.p_id + "~~" + m.time_tracker_task_id + "~~" + "R" + "@@",
          },
        }).then(function mySuccess(response) {
          //$scope.myWelcome = response.data;
          e = response.data.recordset[0].executed_hours;
          console.log(">> reset e >> "+e);
          m.flag = "S";
          self.stopTimer(event,m,userId);

          startTime = new Date().getTime();
          options.elapsedTime.setTime(0);
          timeElapsed = offset = 0;
        }, function myError(response) {
          //$scope.myWelcome = response.statusText;
        });

      };

      self.cancelTimer = function() {
        $interval.cancel(interval);
      };



      return exce_res;

    };
    console.log("fffffffffffffffffffffffffffffffff");
    console.log(abc);
    return abc;
  }]);


/*workflow.factory("States", function() {
  var states = projectList_array;
  console.log("statessssssssssss");
  console.log(projectList_array);

  return states;

});*/
