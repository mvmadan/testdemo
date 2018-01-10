(function() {
workflow.controller("timeTrackerNewController", ['$scope', '$timeout','$rootScope', '$window', '$http',  '$q', '$log', '$interval', '$filter', 'timeTrackerNewService',timeTrackerNewController]);

function timeTrackerNewController($scope, $timeout, $rootScope, $window, $http, $q, $log, $interval, $filter, timeTrackerNewService) {

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

  var emp_id = JSON.parse($window.localStorage.getItem('userJSON')).employee_id;
  $scope.q_billArr = [];
  //================================================= start of timeTrackerNewOnLoad function ==================================
  $scope.timeTrackerNewOnLoad = function() {
    console.log("<<<<============================ In timeTrackerNewOnLoad =======================>>>>>>");

    $scope.topRecurringModel = 'N';

    var parameters = {
      "emp_id": emp_id
    };
    console.log("parameters of timeTrackerNewOnLoad====>>>>" + JSON.stringify(parameters));

    timeTrackerNewService.getOnLoadProjectNameService(parameters).then(responseOfGetOnLoadProjectNameService)

    function responseOfGetOnLoadProjectNameService(response) {
      if (response != "error") {
        $scope.projectList = response.recordsets[0];
        $scope.dateModel = new Date();

        $scope.date_options = {
          minDate: new Date(),
        }
      } else {
        alert("Some error occurred!!");
      }
    } //end of responseOfGetOnLoadProjectNameService

    timeTrackerNewService.getOnLoadAllTaskService(parameters).then(responseOfGetOnLoadAllTaskService)

    function responseOfGetOnLoadAllTaskService(response) {
      if (response != "error") {
        $scope.unbilledTaskList =  response.recordsets[0];
        $scope.todayTaskList = response.recordsets[1];
        $scope.futureTaskList = response.recordsets[2];

        // for(var i=0;i<$scope.unbilledTaskList.length;i++){
          $scope.quickDisabled = true;
        // }

        //===================================================================================================
        if($scope.unbilledTaskList.length > 0){
          $scope.showUnbilledTaskPanel = "visibility:visible;display:block;";
        }
        else{
          $scope.showUnbilledTaskPanel = "visibility:hidden;display:none;";
        }
        if($scope.todayTaskList.length > 0){
          $scope.showTodayTaskPanel = "visibility:visible;display:block;";
        }
        else{
          $scope.showTodayTaskPanel = "visibility:hidden;display:none;";
        }
        if($scope.futureTaskList.length > 0){
          $scope.showFutureTaskPanel = "visibility:visible;display:block;";
        }
        else{
          $scope.showFutureTaskPanel = "visibility:hidden;display:none;";
        }

        for (var i = 0; i < $scope.unbilledTaskList.length; i++) {
          $scope.unbilledTaskList[i].unbilledTaskDateModel = new  Date($filter('date')($scope.unbilledTaskList[i].time_tracker_date, "yyyy-MM-dd"));
        }

        for (var i = 0; i < $scope.todayTaskList.length; i++) {
          $scope.todayTaskList[i].todayTaskDateModel = new Date($filter('date')($scope.todayTaskList[i].time_tracker_date, "yyyy-MM-dd"));
        }

        for (var i = 0; i < $scope.futureTaskList.length; i++) {
          $scope.futureTaskList[i].futureTaskDateModel = new Date($filter('date')($scope.futureTaskList[i].time_tracker_date, "yyyy-MM-dd"));
        }
      } else {
        alert("Some error occurred!!");
      }
    } //end of responseOfGetOnLoadAllTaskService
    };
  $scope.timeTrackerNewOnLoad();
  //==================================================== end of timeTrackerNewOnLoad function =======================

  //============================================== start jquery top R button change color =====================================
    $(".topBox").click(function() {
      if ($scope.topRecurringModel == 'N') {
        $scope.topRecurringModel = 'Y';
        $('.topBox').css('background-color', '#228B22');
        console.log('==>>', $scope.topRecurringModel);
      } else {
        $scope.topRecurringModel = 'N';
        $('.topBox').css('background-color', '#28b2f1');
        console.log('==>>', $scope.topRecurringModel);
      }
    });//end of jquery top R change color
  //============================================== end jquery top R button change color =====================================

  //============================================================ end of timeTrackerNewOnLoad function =======================
  $scope.addTask = function() {
    console.log("In addTask function");

    if ($scope.projectModel == null || $scope.projectModel == "" || $scope.projectModel == 'undefined') {
      alert("Please enter project name");
      $scope.projectStyle = {
        "border-color": "red"
      }
    } else {

      var parameters = {
        "emp_id": emp_id,
        "project_id": $scope.projectModel.project_id,
        "tracker_date": $filter('date')($scope.dateModel, "yyyy-MM-dd"),
        "execution_date": null,
        "created_on": null,
        "created_by": null,
        "est_hrs": null,
        "est_mins": null,
        "handover_id": null,
        "handover_type": null,
        "recurring_task": $scope.topRecurringModel,
        "comments": null,
        "page_flag": ''
      };

      console.log("parameters of addTask====>>>>" + JSON.stringify(parameters));

      timeTrackerNewService.addTaskService(parameters).then(responseOfAddTaskService)

      function responseOfAddTaskService(response) {
        if (response != "error") {

          $scope.addedUnbilledTaskList = response.recordsets[1];
          $scope.addedTodayTaskList = response.recordsets[2];
          $scope.addedFutureTaskList = response.recordsets[3];
          $scope.timeTrackerNewOnLoad();
          $scope.projectModel = "";
          $scope.projectStyle = "";
          $('.topBox').css('background-color', '#28b2f1');
        } else {
          alert("Some error occurred!!");
        }
      } //end of responseOfAddTaskService
    } //end of else
  } //end of addTask function
  //============================================================ end of addTask function ====================================

//============================================ start of unbilledTaskModalFunction  ====================================
$scope.unbilledTaskModalFunction = function(index,unbilledTaskObj) {
  console.log('In unbilledTaskModalFunction function',unbilledTaskObj);

  $scope.project_name = unbilledTaskObj.project_name;
  $scope.project_number = unbilledTaskObj.project_number;

  $scope.project_id = unbilledTaskObj.project_id;
  $scope.time_tracker_task_id = unbilledTaskObj.time_tracker_task_id;
  $scope.unbilled_task_date = unbilledTaskObj.unbilledTaskDateModel;


  var parameters = {
    "emp_id": emp_id,
    "project_id": unbilledTaskObj.project_id,
    "time_tracker_task_id": unbilledTaskObj.time_tracker_task_id
  };

  console.log("parameters of unbilledTaskModalFunction====>>>>" + JSON.stringify(parameters));

  timeTrackerNewService.unbilledTaskModalService(parameters).then(responseOfUnbilledTaskModalService)

  function responseOfUnbilledTaskModalService(response) {
      if (response != "error") {

      $scope.deliveryList = response.recordsets[0];
      $scope.taskList = response.recordsets[1];
      $scope.serviceList = response.recordsets[2];
      $scope.employeeList = response.recordsets[3];
      $scope.clientList = response.recordsets[4];
      $scope.specificTaskList = response.recordsets[6];

      var activeTaskNameListArr = [];

// onload by default first tab when opening modal and displaying the task button
        for(var i=0;i<$scope.taskList.length;i++){
          if($scope.serviceList[0].service_name === $scope.taskList[i].service_name){
              activeTaskNameListArr.push($scope.taskList[i]);
              $scope.taskNameList = activeTaskNameListArr;
            }
        }

// if the service tab are selected before then displaying that service tab active
      for(var i=0;i<$scope.specificTaskList.length;i++){
        for(var j=0;j<$scope.serviceList.length;j++){
          if($scope.specificTaskList[i].service_name == $scope.serviceList[j].service_name){
            $scope.specificTaskList[i].activeTab = j;
          }
          if($scope.specificTaskList[i].service_name == $scope.serviceList[j].service_name){
            $scope.specificTaskList[i].unbilledServiceTabModel = $scope.serviceList[j];
          }
        }
      }

// displaying specific task name button if selected before
      for(var i=0;i<$scope.specificTaskList.length;i++){
        for(var j=0;j<$scope.taskList.length;j++){
          if($scope.specificTaskList[i].task_id === $scope.taskList[j].task_id){
            $scope.specificTaskList[i].unbilledTaskModel = $scope.taskList[j];
            $scope.taskList[j].taskNameStyle = {'background':  "#28b2f1"}
            console.log('$scope.specificTaskList[i].unbilledTaskModel===>>>',$scope.specificTaskList[i].unbilledTaskModel)
          }
        }
      }

// if the peer values are selected before then displaying that values
      for(var i=0;i<$scope.specificTaskList.length;i++){
        for(var j=0;j<$scope.employeeList.length;j++){
          if($scope.specificTaskList[i].peer_name === $scope.employeeList[j].employee_name){
            $scope.specificTaskList[i].unbilledEmployeeModel = $scope.employeeList[j];
            $scope.specificTaskList[i].employeeNameDisabled = false;
          }
        }
      };

// if the values are selected before then displaying that values
      for(var i=0;i<$scope.specificTaskList.length;i++){
        for(var j=0;j<$scope.deliveryList.length;j++){
          if($scope.specificTaskList[i].deliverable_id == $scope.deliveryList[j].deliverable_id){
            $scope.specificTaskList[i].unbilledDeliveryModel = $scope.deliveryList[j];
          }
        };

        for(var i=0;i<$scope.specificTaskList.length;i++){
          if($scope.specificTaskList[i].isWeekendHours == 'Y'){
            $scope.specificTaskList[i].unbilled_task_weekend_hours_model = 'Y';
          }
          if($scope.specificTaskList[i].isPeerRework == 'Y'){
            $scope.specificTaskList[i].unbilled_task_peer_rework_model = 'Y';
          }

          if($scope.specificTaskList[i].executed_quantity){
            $scope.specificTaskList[i].unbilledExeQuantityModel = $scope.specificTaskList[i].executed_quantity;
          }
          if($scope.specificTaskList[i].estimated_hours){
            $scope.specificTaskList[i].unbilledEstHrsModel = $scope.specificTaskList[i].estimated_hours;
          }
          if($scope.specificTaskList[i].estimated_mins){
            $scope.specificTaskList[i].unbilledEstMinModel = $scope.specificTaskList[i].estimated_mins;
          }
          if($scope.specificTaskList[i].comments){
            $scope.specificTaskList[i].unbilledCommentsModel = $scope.specificTaskList[i].comments
          }

      };
    };

      for(var i=0;i<$scope.clientList.length;i++) {
          $scope.unbilledClientModel = $scope.clientList[i].client_id;
      }

    } else {
      alert("Some error occurred!!");
    }
  } //end of responseOfUnbilledTaskModalService

}//end of unbilledTaskModalFunction

//========================================== start of saveTaskName function =========================================
$scope.saveTaskName = function(index,saveTaskNameObj) {
  console.log('In saveTaskName function',saveTaskNameObj);

  for(var i=0;i<$scope.specificTaskList.length;i++){
    $scope.specificTaskList[i].unbilledTaskModel = saveTaskNameObj;
  }

  for(var i=0;i<$scope.taskNameList.length;i++){
      $scope.taskNameList[i].taskNameStyle = {"background": ""};
  }

  $scope.taskNameList[index].taskNameStyle = {background: "#28b2f1"};
};
//========================================== end of saveTaskName function =========================================

//============================================ end of unbilledTaskModalFunction  =====================================

$scope.unbilledTaskModalSave = function(unbilledTaskModalSaveObj) {
  console.log('In unbilledTaskModalSave function');

  var parameters = {
    "time_tracker_task_id": unbilledTaskModalSaveObj.time_tracker_task_id,
    "project_id": unbilledTaskModalSaveObj.project_id,
    "emp_id": emp_id,
    "unbilledDeliveryId": unbilledTaskModalSaveObj.unbilledDeliveryModel.deliverable_id,
    "unbilledDeliveryName": unbilledTaskModalSaveObj.unbilledDeliveryModel.deliverable_name,
    "unbilledTaskId": unbilledTaskModalSaveObj.unbilledTaskModel.task_id,
    "unbilledTaskName": unbilledTaskModalSaveObj.unbilledTaskModel.task_name,
    "unbilled_task_peer_rework_model": unbilledTaskModalSaveObj.unbilled_task_peer_rework_model,
    "unbilled_task_weekend_hours_model": unbilledTaskModalSaveObj.unbilled_task_weekend_hours_model,
    "unbilledCommentsModel": unbilledTaskModalSaveObj.unbilledCommentsModel,
    "peer_name": unbilledTaskModalSaveObj.unbilledEmployeeModel.employee_name,
    "peer_id": unbilledTaskModalSaveObj.unbilledEmployeeModel.employee_id,
    "unbilledServiceName": unbilledTaskModalSaveObj.unbilledTaskModel.service_name,
    "unbilledCategoryId": unbilledTaskModalSaveObj.unbilledDeliveryModel.category_id,
    "unbilledProjectDeliverableId": unbilledTaskModalSaveObj.unbilledDeliveryModel.project_deliverable_id,
    "unbilledEstHrsModel": unbilledTaskModalSaveObj.unbilledEstHrsModel,
    "unbilledEstMinModel": unbilledTaskModalSaveObj.unbilledEstMinModel,
    "unbilledClientId": unbilledTaskModalSaveObj.client_id,
    "unbilledExeQuantityModel": unbilledTaskModalSaveObj.unbilledExeQuantityModel,
    "formatted_unbilled_task_date": $filter('date')(unbilledTaskModalSaveObj.time_tracker_date, "yyyy-MM-dd")
  };
  console.log("parameters of unbilledTaskModalSave====>>>>" + JSON.stringify(parameters));




  for(var i=0;i<$scope.specificTaskList.length;i++){
    $scope.q_billArr.push($scope.specificTaskList[i]);
  }

  timeTrackerNewService.unbilledTaskModalSaveService(parameters).then(responseOfUnbilledTaskModalSaveService)
  function responseOfUnbilledTaskModalSaveService(response) {
    if (response != "error") {
      $scope.successList = response.recordsets[0];
      console.log('$scope.successList===>>>>>>>>>>>>>>',$scope.successList);

    } else {
      alert("Some error occurred!!");
    }
  }
};

$scope.unbilledTaskQuickBill = function(index, obj) {
  console.log('In unbilledTaskQuickBill function',$scope.q_billArr);



  $scope.project_name = obj.project_name;
  $scope.project_number = obj.project_number;
  $scope.task_name = obj.task_name;
  $scope.date = obj.time_tracker_date;
  $scope.weekend_hrs = obj.isWeekendHours;
  $scope.peer_rework = obj.isPeerRework;
  $scope.comment = obj.comments;

  $scope.q_deliverable_name = $scope.q_billArr[index].unbilledDeliveryModel.deliverable_name;
  $scope.q_exe_quantity = $scope.q_billArr[index].unbilledExeQuantityModel;
};

//==========================================start of deliveryChange function =========================================
$scope.deliveryChange = function(deliveryChangeObj) {
  console.log('In deliveryChange function',deliveryChangeObj);
};
//========================================== end of deliveryChange function =========================================
$scope.employeeChange = function(employeeChangeObj) {
  console.log('In employeeChange',employeeChangeObj);
};

//==========================================start of serviceTabChange function =========================================
$scope.serviceTabChange = function(serviceTabChangeObj) {
  console.log('In serviceTabChange function',serviceTabChangeObj);

  for(var i=0;i<$scope.specificTaskList.length;i++){
    $scope.specificTaskList[i].unbilledServiceTabModel = serviceTabChangeObj;
  }

  var taskNameListArr = [];

  for(var i=0;i<$scope.taskList.length;i++){
    if(serviceTabChangeObj.service_name === $scope.taskList[i].service_name){
        taskNameListArr.push($scope.taskList[i]);
        $scope.taskNameList = taskNameListArr;
      }
    }
};
//========================================== end of serviceTabChange function =========================================


$scope.refreshUnbilledTask = function() {
  console.log('In refreshUnbilledTask function');

};

$scope.unbilled_task_peer_rework_change = function() {
  console.log('In unbilled_task_peer_rework_change function');

  for(var i=0;i<$scope.specificTaskList.length;i++){
      if($scope.specificTaskList[i].unbilled_task_peer_rework_model == 'Y'){
        $scope.specificTaskList[i].employeeNameDisabled = false;
      }else {
        $scope.specificTaskList[i].employeeNameDisabled = true;
        $scope.specificTaskList[i].unbilledEmployeeModel = "";
      }
    }
};




//=============================================================================================================


$scope.unbilledTaskDelete = function(index,unbilledTaskObj) {
  console.log('In unbilledTaskDelete function');

  var parameters = {
    "time_tracker_task_id": unbilledTaskObj.time_tracker_task_id,
    "emp_id": emp_id,
  };
  console.log("parameters of unbilledTaskDelete====>>>>" + JSON.stringify(parameters));

  timeTrackerNewService.unbilledTaskDeleteService(parameters).then(responseOfUnbilledTaskDeleteService)
  function responseOfUnbilledTaskDeleteService(response) {
    if (response != "error") {
      $scope.deleteList = response.recordsets[0];
      console.log('$scope.deleteList===>>>>>>>>>>>>>>',$scope.deleteList);
      $scope.timeTrackerNewOnLoad();


    } else {
      alert("Some error occurred!!");
    }
  }
};//end of unbilledTaskDelete function

};//end of timeTrackerNewController function
})(); //end of workflow.controller
//==================================================== end of  workflow.controller function ============================

workflow.controller("timerController", function($scope, $interval, $window, timeTrackerNewService) {
  var emp_id = JSON.parse($window.localStorage.getItem('userJSON')).employee_id;

  console.log('<<<<============================ In timerController =======================>>>>>>');

    var timer = 0;

    var start_date = $scope.todayTaskDetails.execution_date;
    var start_hms = moment.utc(start_date).format('HH:mm:ss');
    var start_seconds = moment.duration(start_hms).asSeconds();
    var start_milisec = start_seconds * 1000;

    var current_date = new Date();
    var current_hms = current_date.getHours() + ":" + current_date.getMinutes() + ":" + current_date.getSeconds();
    var current_seconds = moment.duration(current_hms).asSeconds();
    var current_milisec = current_seconds * 1000;

  if($scope.todayTaskDetails.flag == 'A'){
    $scope.todayTaskDetails.startTimerHide = false;
    $scope.todayTaskDetails.stopTimerShow = false;
    $scope.todayTaskDetails.clock = '00:00:00';
  }; // end of A

  if($scope.todayTaskDetails.flag == 'S'){
    $scope.todayTaskDetails.startTimerHide = true;
    $scope.todayTaskDetails.stopTimerShow = true;

    timers = $scope.todayTaskDetails.executed_hours * 1000 + (current_milisec - start_milisec);
    timer = timers/1000;

    $scope.todayTaskDetails.startTick =  $interval(function(){
      timer++;

      $scope.todayTaskDetails.clock = moment.utc(timer*1000).format('HH:mm:ss');
    }, 1000);
  };// end of S

  if($scope.todayTaskDetails.flag == 'P'){
    $scope.todayTaskDetails.startTimerHide = false;
    $scope.todayTaskDetails.stopTimerShow = false;

    timer = $scope.todayTaskDetails.executed_hours;

    $scope.todayTaskDetails.clock = moment.utc(timer*1000).format('HH:mm:ss');
  }; // end of P

  //============================= start of play pause and reset timer function ========================
  $scope.startTimer = function () {
    console.log('In startTimer function');

    $scope.todayTaskDetails.startTimerHide = true;
    $scope.todayTaskDetails.stopTimerShow = true;

    $scope.todayTaskDetails.startTick = $interval(function() {
      timer++;

      $scope.todayTaskDetails.clock = moment.utc(timer*1000).format('HH:mm:ss');
    },1000);

    var finalString = $scope.todayTaskDetails.project_id +
      "~~" + $scope.todayTaskDetails.time_tracker_task_id +
      "~~" + "S" + "@@";

    var parameters = {
      "emp_id": emp_id,
      "string": finalString,
    };
    // console.log("parameters of startTimer====>>>>" + JSON.stringify(parameters));

    timeTrackerNewService.playPauseResetTimerService(parameters).then(responseOfPlayTimerService)
    function responseOfPlayTimerService(response) {
      if (response != "error") {
        $scope.successList_of_S = response.recordsets[2];
      } else {
        alert("Some error occurred!!");
      }
    };
  };//end of startTimer

  $scope.stopTimer = function (){
    console.log('In stopTimer function');

      $scope.todayTaskDetails.startTimerHide = false;
      $scope.todayTaskDetails.stopTimerShow = false;

      $interval.cancel($scope.todayTaskDetails.startTick);
      $interval.cancel($scope.todayTaskDetails.resumeTick);

      var finalString = $scope.todayTaskDetails.project_id +
        "~~" + $scope.todayTaskDetails.time_tracker_task_id +
        "~~" + "P" + "@@";

      var parameters = {
        "emp_id": emp_id,
        "string": finalString
      };
      // console.log("parameters of stopTimer====>>>>" + JSON.stringify(parameters));

      timeTrackerNewService.playPauseResetTimerService(parameters).then(responseOfStopTimerService)
      function responseOfStopTimerService(response) {
        if (response != "error") {
          $scope.successList_of_P = response.recordsets[0];
        } else {
          alert("Some error occurred!!");
        }
      };
    };

  $scope.resetTimer = function (){
    console.log('In resetTimer function');
    $scope.todayTaskDetails.startTimerHide = false;
    $scope.todayTaskDetails.stopTimerShow = false;

    $interval.cancel($scope.todayTaskDetails.startTick);
    $interval.cancel($scope.todayTaskDetails.resumeTick);

    $scope.todayTaskDetails.clock = '00:00:00';
    timer = 0;

    var finalString = $scope.todayTaskDetails.project_id +
      "~~" + $scope.todayTaskDetails.time_tracker_task_id +
      "~~" + "R" + "@@";

    var parameters = {
      "emp_id": emp_id,
      "string": finalString
    };
    // console.log("parameters of resetTimer====>>>>" + JSON.stringify(parameters));

    timeTrackerNewService.playPauseResetTimerService(parameters).then(responseOfResetTimerService)
    function responseOfResetTimerService(response) {
      if (response != "error") {
        $scope.successList_of_R = response.recordsets[0];
      } else {
        alert("Some error occurred!!");
      }
    };
  };
  //============================================ start of play pause and reset timer function ===========================

  });
