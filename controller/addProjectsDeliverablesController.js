workflow.controller("addProjectsDeliverablesController", ['$scope', '$rootScope', '$window', '$http', '$timeout', '$q', '$log', '$filter', 'addProjectsDeliverablesService', function($scope, $rootScope, $window, $http, $timeout, $q, $log, $filter, addProjectsDeliverablesService) {

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

  //----------------------------- addProjectsDeliverablesOnLoad starts here -------------------------------------------------
  $scope.addProjectsDeliverablesOnLoad = function() {
    console.log("In addProjectsDeliverablesOnLoad function");

    var parameters = {
      "user_id": user_id,
    };
    addProjectsDeliverablesService.getaddProjectsDeliverablesService(parameters).then(projectResp)

    function projectResp(response) {
      if (response != "error") {
        $scope.businessList = response.recordsets[9];
        $scope.clientList = response.recordsets[1];
      } //end of if
      else {
        alert("Some error occurred!!");
      }
    } //end of function projectResp

  } // end of $scope.addProjectsDeliverablesOnLoad
  $scope.addProjectsDeliverablesOnLoad();
  //-------------------------------------------------------end of addProjectsDeliverablesOnLoad function----------------

  //------------------------------------------------------ submit function starts here -----------------------------------
  $scope.submit = function() {
    console.log("In submit function");

    var error_msg = "Highlighted field(s) are mandatory"
    var errorFlag = true;

    if (!$scope.businessModel || $scope.clientModel == null || $scope.clientModel == "" || $scope.clientModel == 'undefined') {
      if (!$scope.businessModel) {
        $scope.businessStyle = {
          "border-color": "red"
        };
        errorFlag = false;
      } else {
        $scope.businessStyle = "";
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
    } else {
      $scope.showMessage = false;
      $scope.showTable = true;
      $.toast({
        heading: 'In submit',
        position: 'top-right',
        loaderBg: '#ff6849',
        icon: 'success',
        hideAfter: 2500,
        stack: 1
      });

      $scope.businessStyle = {
        "border-color": ""
      }
      $scope.clientStyle = {
        "border-color": ""
      }

      var parameters = {
        "type_of_business_id": $scope.businessModel.type_of_business_id,
        "client_id": $scope.clientModel.client_id
      };
      console.log("submit function parameters====>>>>" + JSON.stringify(parameters));

      addProjectsDeliverablesService.getViewAddProjectsDeliverablesService(parameters).then(projectResp)

      function projectResp(response) {
        if (response != "error") {

          $scope.addDataList = [];
          $scope.project_List = response.recordsets[2];
          $scope.category = response.recordsets[3];
          $scope.deliverable = response.recordsets[4];

          if ($scope.project_List.length == 0) {
            $scope.showMessage = true;
            $scope.showTable = false;
          }

          for (var i = 0; i < 5; i++) {
            var addProjectsDeliverablesJson = {
              'selectedProject': '',
              'selectedCategory': '',
              'selectedDeliverable': '',
              'selectedDescription': '',
              'selectedDeliveryDueDate': new Date(),
              'selectedHour': '00:00:00'
            }

            $scope.addDataList[i] = addProjectsDeliverablesJson;

            if (!$scope.addDataList[i].selectedProject || !$scope.addDataList[i].selectedCategory ||
              !$scope.addDataList[i].selectedDeliverable || !$scope.addDataList[i].selectedDescription) {
              $scope.saveDisabled = true;
            }
          } //end of for loop
        } else {
          alert("Some error occurred!!");
        }
      } //end of function projectResp
    } //end of if
  } //end of submit function
  //-------------------------------------------------------end of submit function--------------------------------------------

  //------------------------------------------------------- start of addRows function---------------------------------------
  $scope.addRows = function() {
    console.log("In addRow function");

    $scope.addDataList.push({
      'selectedProject': '',
      'selectedCategory': '',
      'selectedDeliverable': '',
      'selectedDescription': '',
      'selectedDeliveryDueDate': new Date(),
      'selectedHour': '00:00:00',
    }); //end of push
  } //end of addRows function
  //--------------------------------------------  end of addRows function --------------------------------------------------

  //====================================== start of changes function ===============================================
  $scope.projectChange = function(index) {
    console.log("In projectChange function");

    if (!$scope.addDataList[index].selectedProject) {
      $scope.addDataList[index].projectStyle = {
        "border-color": "red"
      };
      $scope.saveDisabled = true;
    } else {
      if ($scope.addDataList[index].selectedProject && $scope.addDataList[index].selectedCategory &&
        $scope.addDataList[index].selectedDeliverable && $scope.addDataList[index].selectedDescription) {
        $scope.saveDisabled = false;
      }
      $scope.addDataList[index].projectStyle = {
        "border-color": ""
      };
    }
  }

  $scope.categoryChange = function(index) {
    console.log("In categoryChange function");

    if (!$scope.addDataList[index].selectedCategory) {
      $scope.addDataList[index].categoryStyle = {
        "border-color": "red"
      };
      $scope.saveDisabled = true;
    } else {
      if ($scope.addDataList[index].selectedProject && $scope.addDataList[index].selectedCategory &&
        $scope.addDataList[index].selectedDeliverable && $scope.addDataList[index].selectedDescription) {
        $scope.saveDisabled = false;
      }
      $scope.addDataList[index].categoryStyle = {
        "border-color": ""
      };
    }
  }

  $scope.deliverableChange = function(index) {
    console.log("In deliverableChange function");

    if (!$scope.addDataList[index].selectedDeliverable) {
      $scope.addDataList[index].deliverableStyle = {
        "border-color": "red"
      };
      $scope.saveDisabled = true;
    } else {
      if ($scope.addDataList[index].selectedProject && $scope.addDataList[index].selectedCategory &&
        $scope.addDataList[index].selectedDeliverable && $scope.addDataList[index].selectedDescription) {
        $scope.saveDisabled = false;
      }
      $scope.addDataList[index].deliverableStyle = {
        "border-color": ""
      };
    }
  }

  $scope.descriptionChange = function(index) {
    console.log("In descriptionChange function");

    if (!$scope.addDataList[index].selectedDescription) {
      $scope.addDataList[index].descriptionStyle = {
        "border-color": "red"
      };
      $scope.saveDisabled = true;
    } else {
      if ($scope.addDataList[index].selectedProject && $scope.addDataList[index].selectedCategory &&
        $scope.addDataList[index].selectedDeliverable && $scope.addDataList[index].selectedDescription) {
        $scope.saveDisabled = false;
      }
      $scope.addDataList[index].descriptionStyle = {
        "border-color": ""
      };
    }
  }
  //====================================== end of changes function ===============================================

  //--------------------------------------------  start of saveData function --------------------------------------------------
  $scope.saveData = function() {
    console.log("In save data function");
    var flag = "";
    var subString = "";
    var finalString = "";
    var string1 = "";
    var string2 = "";

    for (var i = 0; i < $scope.addDataList.length; i++) {
      if ($scope.addDataList[i].selectedProject.ponumber_project_name &&
        $scope.addDataList[i].selectedDeliverable.deliverable_name &&
        $scope.addDataList[i].selectedDescription) {
        string1 = $scope.addDataList[i].selectedProject.ponumber_project_name +
          $scope.addDataList[i].selectedDeliverable.deliverable_name +
          $scope.addDataList[i].selectedDescription;

        for (var j = i + 1; j < $scope.addDataList.length; j++) {

          if ($scope.addDataList[j].selectedProject.ponumber_project_name &&
            $scope.addDataList[j].selectedDeliverable.deliverable_name &&
            $scope.addDataList[j].selectedDescription) {
            string2 = $scope.addDataList[j].selectedProject.ponumber_project_name +
              $scope.addDataList[j].selectedDeliverable.deliverable_name +
              $scope.addDataList[j].selectedDescription;
            console.log("string2===>>>" + JSON.stringify(string2));

            if (string1 === string2) {
              flag = "duplicate";
              $scope.addDataList[i].deliverableStyle = {
                "border-color": "red"
              };
              $scope.addDataList[i].descriptionStyle = {
                "border-color": "red"
              };

              $scope.addDataList[j].deliverableStyle = {
                "border-color": "red"
              };
              $scope.addDataList[j].descriptionStyle = {
                "border-color": "red"
              };

            }
            if (string1 !== string2) {
              flag = "success";
              $scope.addDataList[i].deliverableStyle = {
                "border-color": ""
              };
              $scope.addDataList[i].descriptionStyle = {
                "border-color": ""
              };

              $scope.addDataList[j].deliverableStyle = {
                "border-color": ""
              };
              $scope.addDataList[j].descriptionStyle = {
                "border-color": ""
              };
            }
          }
        }
      }
    }
    if (flag == "duplicate") {
      alert("Duplicate entries are not allowed");
    }

    for (var i = 0; i < $scope.addDataList.length; i++) {
      if (flag !== "duplicate") {
        if ($scope.addDataList[i].selectedProject && $scope.addDataList[i].selectedCategory &&
          $scope.addDataList[i].selectedDeliverable && $scope.addDataList[i].selectedDescription) {
          flag = "true";
          $scope.addDataList[i].projectStyle = {
            "border-color": ""
          };
          $scope.addDataList[i].categoryStyle = {
            "border-color": ""
          };
          $scope.addDataList[i].deliverableStyle = {
            "border-color": ""
          };
          $scope.addDataList[i].descriptionStyle = {
            "border-color": ""
          };

          subString = subString + $scope.addDataList[i].selectedProject.project_id +
            "~" + $scope.addDataList[i].selectedDeliverable.deliverable_id +
            "~" + $filter('date')($scope.addDataList[i].selectedDeliveryDueDate, "yyyy-MM-dd") + " " +
            $filter('date')($scope.addDataList[i].selectedHour, "HH:mm:ss") +
            "~41~S~" + $scope.addDataList[i].selectedCategory.deliverable_category_id +
            "~" + $scope.addDataList[i].selectedDescription + "@#~";
          finalString = subString.slice(0, subString.length - 3)
        }
      }
    }

    if (flag == "true") {
      var parameters = {
        "user_id": user_id,
        "finalString": finalString
      };

      console.log("saveData function parameters====>>>>" + JSON.stringify(parameters));
      addProjectsDeliverablesService.insertDataAddProjectsDeliverablesService(parameters).then(projectResp)

      function projectResp(response) {
        if (response != "error") {
          $.toast({
            heading: 'Delivery added Successfully',
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'success',
            hideAfter: 3500,
            stack: 1
          });
          $scope.addProjectsDeliverablesOnLoad();
          $scope.showTable = false;

          $scope.businessModel = "";
          $scope.clientModel = "";

          for (var i = 0; i < $scope.addDataList.length; i++) {
            $scope.addDataList[i].selectedProject = "";
            $scope.addDataList[i].selectedCategory = "";
            $scope.addDataList[i].selectedDeliverable = "";
            $scope.addDataList[i].selectedDescription = "";
            $scope.addDataList[i].selectedDeliveryDueDate = "";
            $scope.addDataList[i].selectedHour = "";
          }

        } else {
          alert("Data Not Inserted");
        }
      } //end of function projectResp
    }
  } //end of saveData function
  //--------------------------------------------  end of saveData function--------------------------------------------------
  $scope.minDate = function(data) {
    console.log("minDate==>>>" + data.selectedProject.created_on);
    data.options = {
      minDate: data.selectedProject.created_on
    }
  }

}]); //end of workflow.controller
