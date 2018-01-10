workflow.controller("projectClosureController", ['$scope', '$rootScope', '$window', '$http', '$timeout', '$q', '$log', '$filter', 'projectClosureService', function($scope, $rootScope, $window, $http, $timeout, $q, $log, $filter, projectClosureService) {

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

  // $(document).ready(function() {
  //   $('.collapse').on('shown.bs.collapse', function() {
  //     $('#icon').removeClass('glyphicon glyphicon-plus').addClass('glyphicon glyphicon-minus');
  //   });
  //
  //   $('.collapse').on('hidden.bs.collapse', function() {
  //     $('#icon').removeClass('glyphicon glyphicon-minus').addClass('glyphicon glyphicon-plus');
  //   });
  // });


  // =========================== mutiselect jquery starts here =================================================
  $('#teamMultiselectId').multiselect({
    maxHeight: 250,
    buttonWidth: 180,
    enableFiltering: true,
    // includeSelectAllOption: true,
    // numberDisplayed: 2,
    enableCaseInsensitiveFiltering: true,
    nonSelectedText: 'All',
  });

  $('#regionMultiselectId').multiselect({
    maxHeight: 250,
    buttonWidth: 180,
    enableFiltering: true,
    // includeSelectAllOption: true,
    // numberDisplayed: 2,
    enableCaseInsensitiveFiltering: true,
    nonSelectedText: 'All'
  });
  // =========================== mutiselect jquery end here =================================================

  //----------------------------- projectClosureOnLoad starts here ---------------------------------------------------
  $scope.projectClosureOnLoad = function() {
    console.log("In projectClosureOnLoad function");
    $scope.tableShow = true;
    // ======================================= passing user_id to execute onload proc ================================
    var parameters = {
      "user_id": user_id,
    };

    projectClosureService.getOnLoadProjectClosureService(parameters).then(projectResponseOnLoad)

    function projectResponseOnLoad(response) {
      if (response != "error") {

        $scope.serviceList = response.recordsets[0];
        $scope.clientList = response.recordsets[1];
        $scope.clientTeamListTemp = response.recordsets[2];
        $scope.teamList = response.recordsets[3];
        $scope.regionListTemp = response.recordsets[4];
        $scope.picList = response.recordsets[8];

        var teamOptions = [];
        angular.forEach($scope.teamList, function(value, key) {
          teamOptions += '<option value="' + value.team_id + '">' + value.team_name + '</option>';
        });

        $('#teamMultiselectId option').each(function(i, option) {
          $(option).remove();
        });
        $("#teamMultiselectId").append(teamOptions);
        $("#teamMultiselectId").multiselect('rebuild');
        // $("#teamMultiselectId").multiselect('selectAll', false)
        // $("#teamMultiselectId").multiselect('updateButtonText');
      } //end of if
      else {
        alert("Some error occurred!!");
      }
    } //end of function projectResponseOnLoad

    // ========================== changing clientTeam and Region on selection of Client ================================
    $scope.changeClient = function() {
      console.log("In changeClient function");
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

      var regionOptions = [];
      angular.forEach($scope.regionList, function(value, key) {
        regionOptions += '<option value="' + value.client_region_id + '">' + value.Region + '</option>';
      });

      $('#regionMultiselectId option').each(function(i, option) {
        $(option).remove();
      });
      $("#regionMultiselectId").append(regionOptions);
      $("#regionMultiselectId").multiselect('rebuild');
      // $("#regionMultiselectId").multiselect('selectAll', false)
      // $("#regionMultiselectId").multiselect('updateButtonText');
    } //end of $scope.changeClient function
  } // end of projectClosureOnLoad

  $scope.projectClosureOnLoad();
  //--------------------------------end of projectClosureOnLoad function-----------------------------------------

  //------------------------------------------- start of submit function ----------------------------------------------
  $scope.submit = function() {
    console.log("In submit function");
    $scope.disableBtn = true;

    flag = "";
    // ============================= checking validation of service, client and project no/name =======================
    if (!$scope.serviceModel || !$scope.clientModel && !$scope.projectModel) {
      flag = "please_fill";
      $scope.showTable = false;
      $scope.showMessage = false;
    }

    if (!$scope.serviceModel && !$scope.clientModel && $scope.projectModel) {
      flag = "true";
    }

    if ($scope.serviceModel && !$scope.clientModel && $scope.projectModel) {
      flag = "can_fill_only_one_side";
      $scope.showTable = false;
      $scope.showMessage = false;
    }

    if (!$scope.serviceModel && $scope.clientModel && $scope.projectModel) {
      flag = "can_fill_only_one_side";
      $scope.showTable = false;
      $scope.showMessage = false;
    }

    if ($scope.serviceModel && $scope.clientModel && !$scope.projectModel) {
      flag = "true";
    }

    if ($scope.serviceModel && $scope.clientModel && $scope.projectModel) {
      flag = "can_fill_only_one_side";
      $scope.showTable = false;
      $scope.showMessage = false;
    }

    if (flag == "please_fill") {
      alert("Please select a criteria to search project(s) for closure");

      $scope.serviceStyle = {
          "border-color": "red"
        },
        $scope.clientStyle = {
          "border-color": "red"
        }
    }

    if (flag == "can_fill_only_one_side") {
      alert("You can select either Service and Client OR Project Number/Name");
      // $scope.projectModel = "";
      // $scope.serviceModel = "";
      // $scope.clientModel = "";
      $scope.serviceStyle = {
          "border-color": "red"
        },
        $scope.clientStyle = {
          "border-color": "red"
        }

    }
    // ========================== condition satisfy showTable TRUE ==================================
    if (flag == "true") {
      $scope.showTable = true;
      $('#panelBodyOne').collapse('hide'); //collapsing only if the condition is true

      $scope.serviceStyle = {
          "border-color": ""
        },
        $scope.clientStyle = {
          "border-color": ""
        }

      var project_no_name = "";
      var service = "";
      var client = "";
      var client_team = "";
      var team = "";
      var region = "";
      var pic = "";
      // ======================== checking values on selection of components =================================
      if ($scope.serviceModel && $scope.clientModel || $scope.clientTeamModel || $scope.teamModel ||
        $scope.regionModel || $scope.picModel) {
        flag = "either";
      }
      if ($scope.projectModel) {
        flag = "project_filled";
      }

      if (flag == "either") {
        service = $scope.serviceModel.cfds_id;
        client = $scope.clientModel.client_id;

        if ($scope.clientTeamModel) {
          client_team = $scope.clientTeamModel.client_team_id;
        } else if (!$scope.clientTeamModel) {
          client_team = -99;
        }

        if ($scope.teamModel != "" && $scope.teamModel != undefined && $scope.teamModel != null) {
          team = $scope.teamModel;
        } else {
          team = -99;
        }

        if ($scope.regionModel != "" && $scope.regionModel != undefined && $scope.regionModel != null) {
          region = $scope.regionModel;
        } else {
          region = -99
        }

        if ($scope.picModel) {
          pic = $scope.picModel.employee_id;
        } else {
          pic = null;
        }
        project_no_name = null;
      }

      if (flag == "project_filled") {
        service = null,
          client = null,
          client_team = null,
          team = null,
          region = null,
          pic = null,
          project_no_name = $scope.projectModel
      };
      //============================================ passing the parameters to DB for execution =============================
      var parameters = {
        "service": service,
        "client": client,
        "client_team": client_team,
        "team": team,
        "region": region,
        "project_no_name": project_no_name,
        "user_id": user_id,
        "pic": pic
      }

      console.log("submit function parameters =====>>>>"+JSON.stringify(parameters));

      projectClosureService.getViewProjectClosureService(parameters).then(projectResp)

      function projectResp(response) {
        if (response != "error") {
          $scope.tableList = response.recordsets[0];
          // ============================= checking length if tableList length is 0 then showTable is false ==============
          if ($scope.tableList.length == 0) {
            $scope.showTable = false;
            $scope.showMessage = true;

          } else {
            $scope.showTable = true;
            $scope.showMessage = true;

          }
          // ======================= Checkbox disabling on which the Project_Can_Close = N ========================
          for (var i = 0; i < $scope.tableList.length; i++) {
            if ($scope.tableList[i].Project_Can_Close == "N") {
              $scope.tableList[i].disabledFlag = true;
            } else {
              $scope.tableList[i].disabledFlag = false;
            }
          } //end of for loop
          // ============================= calling checkAll function and applying condition ================
          $scope.checkAll = function() {
            console.log("In checkAll function");

            for (var i = 0; i < $scope.tableList.length; i++) {
              if ($scope.tableList[i].disabledFlag) {
                $scope.disableBtn = true;
              }
            };

            if ($scope.selectAll == "Y") {
              for (var i = 0; i < $scope.tableList.length; i++) {
                if (!$scope.tableList[i].disabledFlag) {
                  $scope.tableList[i].selectedProject = "Y";
                  $scope.disableBtn = false;
                  // allIds += $scope.tableList[i].project_id + " ";
                }
              }
            } else {
              for (var i = 0; i < $scope.tableList.length; i++) {
                if (!$scope.tableList[i].disabledFlag) {
                  $scope.tableList[i].selectedProject = "N";
                  $scope.disableBtn = true;
                }
              }
            }

          } //end of $scope.checkAll function
          // ==================================== calling singleCheck function and applying condition ====================
          $scope.singleCheck = function() {
            console.log("In singleCheck function");
            $scope.disableBtn = false;

            for (var i = 0; i < $scope.tableList.length; i++) {
              if ($scope.tableList[i].disabledFlag) {
                $scope.selectAll = "N";
              }
            }
          } // end of $scope.singleCheck function
        } //end of if
        else {
          alert("Some error occurred!!");
        }
      } //end of function projectResp
    } //end of else

  } // end of submit function
  //------------------------------------------------------ end of submit function ---------------------------------------

  //------------------------------------------------------ start of closedProjects function ------------------------------
  $scope.closedProjects = function() {
    console.log("In closedProjects function");

    // $scope.tick = true;
    var projectIds = [];
    var flags = "";
    // ============================== conditon if the selectAll Checkboxis Y then taking all projectIds ====================
    if ($scope.selectAll == "Y") {
      for (var i = 0; i < $scope.tableList.length; i++) {
        if ($scope.tableList[i].selectedProject == "Y") {
          projectIds.push($scope.tableList[i].project_id);
        }
        break;
      }
    }
    // =========================== conditon if selectedProject Checkbox is Y then taking that projectIds =================
    for (var i = 0; i < $scope.tableList.length; i++) {
      if ($scope.tableList[i].selectedProject == "Y") {
        projectIds.push($scope.tableList[i].project_id);
        flags = "success";
      }
      if ($scope.tableList[i].selectedProject == "N") {
        flags = "error";
      }
    }

    if (flags == "success") {
      // ==================== passing parameters to insert data into DB ==========================================
      var parameters = {
        "user_id": user_id,
        "finalProjectIds": projectIds
      };
      console.log("closedProjects parameters ====>>>>"+JSON.stringify(parameters));

      projectClosureService.insertDataProjectClosureService(parameters).then(insertDataProjectResp)

      function insertDataProjectResp(response) {
        if (response != "error") {
          $.toast({
            heading: 'Projects Closed Successfully.',
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'success',
            hideAfter: 2500,
            stack: 1
          });
          $scope.showTable = false;
          $scope.showMessage = false;
          $scope.projectClosureOnLoad();
          $scope.clientModel = "";
          $('#panelBodyOne').collapse('show');
        } //end of if
        else {
          alert("Data Not Inserted");
        }
      } //end of function insertDataProjectResp
    } //end of if
    else if (flags == "error") {
      alert("please close atleast one project");
      $scope.disableBtn = true;
    }

  }; //end of closedProjects function
  //------------------------------ end of closedProjects function ------------------------------------------
}]); //end of workflow.controller
