workflow.controller("POTrackerController", ['$scope', '$rootScope', '$window', '$http', '$timeout', '$q', '$log', '$filter', 'POTrackerService', function($scope, $rootScope, $window, $http, $timeout, $q, $log, $filter, POTrackerService) {

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

  var counter = "";
  var addPOFlag = "";
  var editFlag = "";
  var string = "";
  var parts = [];
  //================================================= start of POTrackerOnLoad function ==================================
  $scope.POTrackerOnLoad = function() {
    console.log("In POTrackerOnLoad function");
    // $('#addCommentsId').hide();
    document.getElementById('loadTT').style.visibility = "hidden";

    var parameters = {
      "user_id": user_id,
      "client_id": '-99',
      "proposal_no": '-99'
    };
    console.log("parameters of POTrackerOnLoad====>>>>" + JSON.stringify(parameters));
    POTrackerService.getOnLoadPOTrackerService(parameters).then(projectResponseOnLoad)

    function projectResponseOnLoad(response) {
      if (response != "error") {
        $scope.clientList = response.recordsets[0];
      } else {
        alert("Some error occurred!!");
      }
    } //end of projectResponseOnLoad
    //================================================== start calling excel data on onload function ===================
    POTrackerService.getExcelService().then(projectResponseExcel)

    function projectResponseExcel(response) {
      if (response != "error") {
        $scope.PO_Excel_Report = response.recordsets[1];
        console.log("Response successfull of Excel");
        angular.forEach($scope.PO_Excel_Report, function(value, key) { //formatting Excel date in dd MMM yyyy format
          value.po_generation_date = $filter('date')(value.po_generation_date, "dd MMM yyyy");
        });

      } else {
        alert("Some error occurred!!");
      }
    } //end of projectResponseExcel
    //================================================== end calling excel data on onload function =======================
  }; //end of $scope.POTrackerOnLoad
  $scope.POTrackerOnLoad();
  //============================================================ end of POTrackerOnLoad function =======================

  //===================================================== start of changeClient function ================================
  $scope.changeClient = function() {
    console.log("In change Client function");
    document.getElementById('loadTT').style.visibility = "visible";

    $scope.proposalModel = "";
    $scope.table1 = false;

    var parameters = {
      "user_id": user_id,
      "client_id": $scope.clientModel.zoho_client_id,
      "proposal_no": '-99'
    };
    console.log("parameters of changeClient====>>>>" + JSON.stringify(parameters));

    POTrackerService.getOnLoadPOTrackerService(parameters).then(projectResponseOnLoad)

    function projectResponseOnLoad(response) {
      if (response != "error") {
        $scope.proposalList = response.recordsets[1];
        document.getElementById('loadTT').style.visibility = "hidden";
      } else {
        alert("Some error occurred!!");
      }
    } //end of projectResponseOnLoad
  } //end of $scope.changeClient function
  //============================================================= end of changeClient function ==========================

  //============================================================= start of search function ===============================
  $scope.search = function() {
    console.log("In search function");
    var error_msg = "Highlighted field(s) are mandatory"
    errorFlag = true;

    if ($scope.clientModel == null || $scope.clientModel == "" || $scope.clientModel == 'undefined' ||
      $scope.proposalModel == null || $scope.proposalModel == "" || $scope.proposalModel == 'undefined') {

      if ($scope.clientModel == null || $scope.clientModel == "" || $scope.clientModel == 'undefined') {
        $scope.clientStyle = {
          "border-color": "red"
        }
        errorFlag = false;
      } else {
        $scope.clientStyle = "";
      }
      if ($scope.proposalModel == null || $scope.proposalModel == "" || $scope.proposalModel == 'undefined') {
        $scope.proposalStyle = {
          "border-color": "red"
        }
        errorFlag = false;
      } else {
        $scope.proposalStyle = "";
      }
    }

    if (errorFlag == false) {
      alert(error_msg);
      $scope.table1 = false;

    } else {

      $scope.clientStyle = "";
      $scope.proposalStyle = "";
      string = $scope.proposalModel;
      parts = string.split("/");
      $scope.proposalModelPart0 = parts[0];

      var parameters = {
        "user_id": user_id,
        "client_id": $scope.clientModel.zoho_client_id,
        "proposal_no": $scope.proposalModelPart0
      };
      console.log("parameters of search====>>>>" + JSON.stringify(parameters));
      document.getElementById('loadTT').style.visibility = "visible";

      POTrackerService.getOnLoadPOTrackerService(parameters).then(projectResponseOnLoad)

      function projectResponseOnLoad(response) {
        if (response != "error") {
          $scope.addPODataList = [];
          $scope.proposalTableList = response.recordsets[2];
          $scope.billingList = response.recordsets[3];
          $scope.poList = response.recordsets[4];
          $scope.vendorList = response.recordsets[5];
          $scope.serviceList = response.recordsets[6];
          $scope.currencyList = response.recordsets[7];
          $scope.po_List = response.recordsets[9];

          //============================== start binding poList added_modified_user_name to addPODataList addPO ==============
          for (var i = 0; i < $scope.poList.length; i++) {
            $scope.addPODataListUserName = $scope.poList[i].added_modified_user_name;
          }
          //============================== end binding poList added_modified_user_name to addPODataList addPO ==============

          //=========================================== start of filled and empty comments image coding ==================

          //   for (var i = 0; i < $scope.poList.length; i++) {
          //   if ($scope.poList[i].comments.length > 0) {
          //     console.log("===========>>>>>>>>>>"+$scope.poList[i].comments);
          //     $scope.poList[i].filledComments = true
          //     $scope.poList[i].emptyComments = false
          //   } else {
          //       console.log("----------->>>>>>>>>>"+$scope.poList[i].comments);
          //     $scope.poList[i].filledComments = false
          //     $scope.poList[i].emptyComments = true
          //   };
          // }
          for(var i = 0; i < $scope.poList.length; i++){
            if($scope.poList[i].comments == "" || $scope.poList[i].comments == null || $scope.poList[i].comments == 'undefined'){
              $scope.poList[i].filledComments = false
              $scope.poList[i].emptyComments = true
            }else{
              $scope.poList[i].filledComments = true
              $scope.poList[i].emptyComments = false
            }
          }
          //======================================== start of filled and empty comments image coding =====================

          //============================ start of date format dd MMM yyyy of POLIST =============================
          for (var i = 0; i < $scope.poList.length; i++) {
            var dates = $scope.poList[i].generation_date.slice(0, $scope.poList[i].generation_date.length - 14)
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
            $scope.poList[i].generation_date = parts[2] + " " + parts[1] + " " + parts[0];
          }

          //===========================start of code for comparing polist service and serviceList service ===========
          for (var i = 0; i < $scope.poList.length; i++) {
            for (var j = 0; j < $scope.serviceList.length; j++) {
              if ($scope.poList[i].service_id == $scope.serviceList[j].services_offered_id) {
                $scope.poList[i].serviceModell = $scope.serviceList[j];
              }

            }
            $scope.poList[i].dateModell = new Date($filter('date')($scope.poList[i].generation_date, "yyyy-MM-dd HH:mm:ss"));
            $scope.poList[i].poValueModell = $scope.poList[i].po_value;
            $scope.poList[i].commentsModell = $scope.poList[i].comments;
          }
          //======================================= end of code for comparing polist service and serviceList service ====

          //======================================= start code for # PO Order ===================================
          var total = "";
          var po_length = "";
          var finalTotal = "";
          for (var i = 0; i < $scope.poList.length; i++) {
            for (var j = 0; j < $scope.proposalTableList.length; j++) {
              if ($scope.poList[i].status == "X") {
                total += $scope.poList[i].status; //all X will be strored in total
                po_length = $scope.poList.length; //poList length stored in po_length
                finalTotal = po_length - total.length; //poList length - length of total(ie:- length of all X)

                $scope.proposalTableList[j].count_of_po = finalTotal;
              }
            }
          }
          //======================================= end code for # PO Order ================================================
          $scope.options = {
            maxDate: new Date(),
          }
          //============================================== start code for cancelled and actio P E C ==========================
          for (var i = 0; i < $scope.poList.length; i++) {
            if ($scope.poList[i].status == "X") {
              $scope.poList[i].cancelledRowStyle = {
                'background': '#ddd'
              }
              $scope.poList[i].actionsShow = false;
              $scope.poList[i].cancelLabel = true;
            } else {
              $scope.poList[i].actionsShow = true;
              $scope.poList[i].cancelLabel = false;
              $scope.poList[i].cancelledRowStyle = {
                'background': ''
              }
            }
          }
          //==============================================end code for cancelled and actio P E C =======================

          //============================================== start hiding showing table 1 and table 2 ======================
          if ($scope.proposalTableList.length == 0) {
            $scope.table1 = false;
          } else {
            $scope.table1 = true;
            document.getElementById('loadTT').style.visibility = "hidden";
            $scope.poShow = true;
          }


          if ($scope.poList.length == 0) {
            $scope.table2 = false;
          } else {
            $scope.table2 = true;
          }
          //============================================== end hiding showing table 1 and table 2 =====================
        } else {
          alert("Some error occurred!!");
        }
      } //end of projectResponseOnLoad
    } //end of else
  } //end of search function
  //============================================================ end of search function =============================

  //============================================= start of onClickDisabledComment box ========================================
  $scope.onClickDisabledComment = function(index, flag) {
    console.log("In onClickDisabledComment function");

    angular.forEach($scope.poList, function(value, key) {
      value.cmntsStyle = false;
      // value.cmntsStyle = {"visibility": "hidden"};
    })

    if (flag === 'showCmntBox') {
      $scope.poList[index].cmntsStyle = true;
    }
    if (flag === 'hideCmntBox') {
      $scope.poList[index].cmntsStyle = false;
    }
    // if ($scope.poList[index].comments.length > 0) {
    //   $scope.poList[index].filledComments = true
    //   $scope.poList[index].emptyComments = false
    // } else {
    //   $scope.poList[index].filledComments = false
    //   $scope.poList[index].emptyComments = true
    // };
    if($scope.poList[index].comments == "" || $scope.poList[index].comments == null || $scope.poList[index].comments == 'undefined'){
      $scope.poList[index].filledComments = false
      $scope.poList[index].emptyComments = true
    }else{
      $scope.poList[index].filledComments = true
      $scope.poList[index].emptyComments = false
    }
  }
  //============================================= end of onClickDisabledComment box ========================================

  //============================================================ start of addPO function =============================
  $scope.addPO = function() {
    console.log("In addPO function");

    addPOFlag = "addPOFlags";

    $scope.add_options = {
      maxDate: new Date(),
    }

    counter++;
    for (var i = 0; i < $scope.addPODataList.length; i++) {
      $scope.addPODataList[i].vendorStyle = "";
      $scope.addPODataList[i].serviceStyle = "";
      $scope.addPODataList[i].currencyStyle = "";
      $scope.addPODataList[i].billingCurrencyStyle = "";
    }
    if ($scope.poList.length == 0) {
      $scope.table2 = true;
      $scope.addPODataList.push({
        'dateModel': new Date(),
        'vendorModel': '',
        'serviceModel': '',
        'currencyModel': '',
        'billingModel': '',
        'commentsModel': ''
      }); //end of push
    }

    if ($scope.poList.length !== 0) {
      $scope.addPODataList.push({
        'dateModel': new Date(),
        'vendorModel': '',
        'serviceModel': '',
        'currencyModel': '',
        'billingModel': '',
        'commentsModel': ''
      }); //end of push
    }

    // for (var i = 0; i < $scope.addPODataList.length; i++) {
    //   if ($scope.addPODataList[i].commentsModel.length > 0) {
    //     $scope.addPODataList[i].filledAddComments = true
    //     $scope.addPODataList[i].emptyAddComments = false
    //   } else {
    //     $scope.addPODataList[i].filledAddComments = false
    //     $scope.addPODataList[i].emptyAddComments = true
    //   };
    // }
    for(var i = 0; i < $scope.addPODataList.length; i++){
      if($scope.addPODataList[i].commentsModel == "" || $scope.addPODataList[i].commentsModel == null || $scope.addPODataList[i].commentsModel == 'undefined'){
        $scope.addPODataList[i].filledAddComments = false
        $scope.addPODataList[i].emptyAddComments = true
      }else{
        $scope.addPODataList[i].filledAddComments = true
        $scope.addPODataList[i].emptyAddComments = false
      }
    }
  } //end of addPO function
  //============================================================ end of addPO function =============================

  //============================================= start of Add comment box ========================================
  $scope.onClickAddComment = function(index, flag) {
    console.log("In onClickAddComment function");

    angular.forEach($scope.addPODataList, function(value, key) {
      value.commentsStyle = false;
      // value.cmntsStyle = {"visibility": "hidden"};
    })

    if (flag === 'showAddCmntBox') {
      $scope.addPODataList[index].commentsStyle = true;
    }
    if (flag === 'hideAddCmntBox') {
      $scope.addPODataList[index].commentsStyle = false;
    }

    // if ($scope.addPODataList[index].commentsModel.length > 0) {
    //   $scope.addPODataList[index].filledAddComments = true
    //   $scope.addPODataList[index].emptyAddComments = false
    // } else {
    //   $scope.addPODataList[index].filledAddComments = false
    //   $scope.addPODataList[index].emptyAddComments = true
    // };
    if($scope.addPODataList[index].commentsModel == "" || $scope.addPODataList[index].commentsModel == null || $scope.addPODataList[index].commentsModel == 'undefined'){
      $scope.addPODataList[index].filledAddComments = false
      $scope.addPODataList[index].emptyAddComments = true
    }else{
      $scope.addPODataList[index].filledAddComments = true
      $scope.addPODataList[index].emptyAddComments = false
    }
  }
  //============================================= end of Add comment box ========================================

  //============================================================ start of removePO function ===========================
  $scope.removePO = function() {
    console.log("In removePO function");

    counter--;
    if (counter == 0) {
      addPOFlag = "";
    }

    for (var i = 0; i < $scope.addPODataList.length; i++) {
      $scope.addPODataList[i].vendorStyle = "";
      $scope.addPODataList[i].serviceStyle = "";
      $scope.addPODataList[i].currencyStyle = "";
      $scope.addPODataList[i].billingCurrencyStyle = "";
    }

    if ($scope.poList.length == 0 && counter == 0) {
      $scope.table2 = false;
    }

    $scope.addPODataList.pop();
  } //end of removePO function
  //============================================================ end of removePO function =============================

  //=========================================== start of paid order ====================================================
  $scope.paid = function(poObj) {
    console.log("In paid order function");

    $scope.min_max_options = {
      minDate: poObj.generation_date,
      maxDate: new Date(),
    }

    $scope.PO_no = poObj.PO_no;
    $scope.generation_date = poObj.generation_date;
    $scope.po_value = poObj.po_value;
    $scope.billing_currency = poObj.billing_currency;
    $scope.balance = poObj.balance;
    $scope.todays_Date = new Date();
    $scope.po_id = poObj.po_id;
    $scope.proposal_no = poObj.proposal_no;
    $scope.amount;
    $scope.comments;
  }; //end of paid function
  //=========================================== end of paid order ======================================================

  //=========================================== start of paidSubmit ====================================================
  $scope.paidSubmit = function() {
    console.log("In paid submit function");
    var flag = "";

    if (!$scope.amount) {
      alert("Payment amount cannot be 0");
      $scope.amountStyle = {
        "border-color": "red"
      }
      $scope.modal = false;
      return false;
    }

    if ($scope.amount > $scope.balance) {
      if (confirm("You have entered a payment greater than balance amount" + "\n Do you want to continue?")) {
        flag = "success";
      }
    }

    if ($scope.amount <= $scope.balance) {
      flag = "success";
    }

    if (!$scope.todays_Date) {
      alert("Payment Date cannot be blank");
      $scope.todays_Date_Style = {
        "border-color": "red"
      }
      return false;
    }

    if (flag == "success") {
      $('#paidModal').modal('hide');

      if (!$scope.comments) {
        $scope.comments = "";
      } else {
        $scope.comments;
      }

      var parameters = {
        "po_id": $scope.po_id,
        "po_no": $scope.PO_no,
        "proposal_no": $scope.proposal_no,
        "amount": $scope.amount,
        "payment_date": $scope.todays_Date,
        "vendor_po": $scope.vendor_PO,
        "comments": $scope.comments,
        "user_id": user_id
      };
      console.log("parameters of paidSubmit====>>>>" + JSON.stringify(parameters));

      POTrackerService.getPaidSubmitService(parameters).then(projectResponsePaidSubmit)

      function projectResponsePaidSubmit(response) {
        if (response != "error") {
          document.getElementById('loadTT').style.visibility = "hidden";
          $scope.search();
          $.toast({
            heading: 'Payment details saved successfully!',
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'success',
            hideAfter: 3500,
            stack: 1
          });
          console.log("paid submit result>>>>" + JSON.stringify(response.recordsets[0]));
          $scope.amount = "";
          $scope.amountStyle = "";
          $scope.todays_Date_Style = "";
          $scope.vendor_PO = "";
          $scope.comments = "";
        } else {
          alert("Some error occurred!!");
        }
      }
    } //end of if
    else {}
  }; //end of paidSubmit function
  //=========================================== end of paidSubmit ====================================================

  //=========================================== start of refresh function ============================================
  $scope.refresh = function() {
    console.log("In refresh function");

    $scope.amount = "";
    $scope.comments = "";
    $scope.todays_Date = "";
    $scope.amountStyle = "";
    $scope.todays_Date_Style = "";

    $scope.amount = "";
    $scope.amountStyle = "";
    $scope.vendor_PO = "";
    $scope.comments = "";

    $scope.addVendorNameModel = "";
    $scope.addVendorAddressModel = "";
    $scope.addVendorCityModel = "";
    $scope.addVendorCountryModel = "";
    $scope.addVendorPhoneModel = "";
    $scope.addVendorEmailModel = "";
    $scope.addVendorNameStyle = "";
    $scope.addVendorEmailStyle = "";

    $scope.modifyVendorNameModel = "";
    $scope.modifyVendorAddressModel = "";
    $scope.modifyVendorCityModel = "";
    $scope.modifyVendorCountryModel = "";
    $scope.modifyVendorPhoneModel = "";
    $scope.modifyVendorEmailModel = "";
    $scope.modifyVendorNameStyle = "";
    $scope.modifyVendorEmailStyle = "";
  }; //end of refresh function
  //=========================================== end of refresh function ===============================================

  //=========================================== start of cancel row ====================================================
  $scope.cancel = function(cancelObj) {
    console.log("In cancel function");

    if (confirm("Do you want to cancel order?")) {

      var parameters = {
        "cancel_po_id": cancelObj.po_id,
        "user_id": user_id
      };
      console.log("parameters of cancel====>>>>" + JSON.stringify(parameters));

      POTrackerService.getCancelService(parameters).then(projectResponseCancel)

      function projectResponseCancel(response) {
        if (response != "error") {
          document.getElementById('loadTT').style.visibility = "hidden";
          $scope.search();
          console.log("cancel result>>>>" + JSON.stringify(response.recordsets[0]));
          $.toast({
            heading: 'Selected PO has been cancelled!!',
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'success',
            hideAfter: 3500,
            stack: 1
          });

        } else {
          alert("Some error occurred!!");
        }
      } //end of projectResponseCancel
    } //end of if
    else {} // end of else

  }; //end of cancel function
  //=========================================== end of cancel rows ===================================================

  //=========================================== start of addModifyVendorOnload function =============================
  $scope.addModifyVendorOnload = function(index, identifier) {
    console.log("In addModifyVendorOnload function");

    if (identifier == 'addVendorTabClick') {
      $scope.activeClass = "nav-item active";
    }

    var parameters = {
      "user_id": user_id
    };

    POTrackerService.getAddModifyVendorOnloadService(parameters).then(projectResponseAddModifyVendorOnload)

    function projectResponseAddModifyVendorOnload(response) {
      if (response != "error") {
        $scope.addModifyVendorList = response.recordsets[0];
        $scope.addModifyCountryList = response.recordsets[1];

      } else {
        alert("Some error occurred!!");
      }
    } //end of projectResponseAddModifyVendorOnload
  } // end of addModifyVendorOnload function
  //==================================================== end of addModifyVendorOnload function =====================

  //============================================================ start of addVendorTabClick function ================
  $scope.addVendorTabClick = function() {
    console.log("In addVendorTabClick");

    $scope.activeClass = "nav-item active";

    $scope.modifyVendorNameModel = "";
    $scope.modifyVendorAddressModel = "";
    $scope.modifyVendorCityModel = "";
    $scope.modifyVendorCountryModel = "";
    $scope.modifyVendorPhoneModel = "";
    $scope.modifyVendorEmailModel = "";
    $scope.modifyVendorNameStyle = "";
    $scope.modifyVendorEmailStyle = "";
  }
  //============================================================ end of addVendorTabClick function ===================

  //============================================================ start of modifyVendorTabClick function =============
  $scope.modifyVendorTabClick = function() {
    console.log("In modifyVendorTabClick");

    $scope.addVendorNameModel = "";
    $scope.addVendorAddressModel = "";
    $scope.addVendorCityModel = "";
    $scope.addVendorCountryModel = "";
    $scope.addVendorPhoneModel = "";
    $scope.addVendorEmailModel = "";
    $scope.addVendorNameStyle = "";
    $scope.addVendorEmailStyle = "";
  }
  //============================================================ end of modifyVendorTabClick function =================

  //============================================================ start of addVendorSubmit function =====================
  $scope.addVendorSubmit = function() {
    console.log("In addVendorSubmit function" + $scope.addVendorCountryModel);

    var flag = "";
    var emailformat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!$scope.addVendorNameModel) {
      flag = "please_fill_vendor_name";
    }
    if (flag == "please_fill_vendor_name") {
      alert("Highlighted field(s) are mandatory.");
      $scope.addVendorNameStyle = {
        "border-color": "red"
      }
    }

    if ($scope.addVendorNameModel && $scope.addVendorEmailModel) {
      if ($scope.addVendorEmailModel.match(emailformat)) {
        flag = "vendor_name_email_correct";
      } else {
        flag = "vendor_name_email_in_correct";
        alert("Highlighted field(s) are mandatory.\n Please enter a valid email-address");
        $scope.addVendorEmailStyle = {
          "border-color": "red"
        }
        $scope.addVendorNameStyle = "";
      }
    }

    if ($scope.addVendorNameModel) {
      if (flag !== "vendor_name_email_in_correct") {
        flag = "vendor_name_email_correct";
      }
    }
    if (flag == "vendor_name_email_correct") {

      $('#addVendorModal').modal('hide');

      if (!$scope.addVendorAddressModel) {
        $scope.addVendorAddressModel = "";
      } else {
        $scope.addVendorAddressModel;
      }
      if (!$scope.addVendorCityModel) {
        $scope.addVendorCityModel = "";
      } else {
        $scope.addVendorCityModel;
      }
      if (!$scope.addVendorCountryModel) {
        $scope.addVendorCountryModel = "-99";
      } else {
        $scope.addVendorCountryModel = $scope.addVendorCountryModel.country_id;
      }
      if (!$scope.addVendorPhoneModel) {
        $scope.addVendorPhoneModel = "";
      } else {
        $scope.addVendorPhoneModel;
      }
      if (!$scope.addVendorEmailModel) {
        $scope.addVendorEmailModel = "";
      } else {
        $scope.addVendorEmailModel;
      }

      var parameters = {
        "vendor_id": '',
        "vendor_name": $scope.addVendorNameModel,
        "vendor_address": $scope.addVendorAddressModel,
        "vendor_city": $scope.addVendorCityModel,
        "vendor_country": $scope.addVendorCountryModel,
        "vendor_phone": $scope.addVendorPhoneModel,
        "vendor_email": $scope.addVendorEmailModel,
        "user_id": user_id
      };
      console.log("parameters of addVendorSubmit====>>>>" + JSON.stringify(parameters));

      POTrackerService.getAddModifyVendorService(parameters).then(projectResponseAddModifyVendor)

      function projectResponseAddModifyVendor(response) {
        if (response != "error") {
          document.getElementById('loadTT').style.visibility = "hidden";
          $scope.search();
          $.toast({
            heading: 'Vendor Details Added Successfully!',
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'success',
            hideAfter: 3500,
            stack: 1
          });
          console.log("Add Vendor Submit Result>>>>" + JSON.stringify(response.recordsets[0]));

          $scope.addVendorNameModel = "";
          $scope.addVendorAddressModel = "";
          $scope.addVendorCityModel = "";
          $scope.addVendorCountryModel = "";
          $scope.addVendorPhoneModel = "";
          $scope.addVendorEmailModel = "";
          $scope.addVendorNameStyle = "";
          $scope.addVendorEmailStyle = "";
        } else {
          alert("Some error occurred!!");
        }
      } //end of projectResponseAddModifyVendor
    } // end of if
  } //end of addVendorSubmit
  //============================================================ end of addVendorSubmit function =====================

  //============================================================ start of modifyVendorUpdate function =====================
  $scope.modifyVendorUpdate = function() {
    console.log("In modifyVendorUpdate function");

    var flags = "";
    var emailformat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!$scope.modifyVendorNameModel) {
      flags = "please_fill_modify_vendor_name";
    }
    if (flags == "please_fill_modify_vendor_name") {
      alert("Highlighted field(s) are mandatory.");
      $scope.modifyVendorNameStyle = {
        "border-color": "red"
      }
    }

    if ($scope.modifyVendorNameModel && $scope.modifyVendorEmailModel) {
      if ($scope.modifyVendorEmailModel.match(emailformat)) {
        flags = "modify_vendor_name_email_correct";
      } else {
        flags = "mofify_vendor_name_email_in_correct";
        alert("Highlighted field(s) are mandatory.\n Please enter a valid email-address");
        $scope.modifyVendorEmailStyle = {
          "border-color": "red"
        }
        $scope.modifyVendorNameStyle = "";
      }
    }

    if ($scope.modifyVendorNameModel) {
      if (flags !== "mofify_vendor_name_email_in_correct") {
        flags = "modify_vendor_name_email_correct";
      }
    }

    if (flags == "modify_vendor_name_email_correct") {
      $scope.modifyVendorNameStyle = "";

      $('#addVendorModal').modal('hide')

      if (!$scope.modifyVendorCountryModel) {
        $scope.modifyVendorCountryModel = "-99";
      } else {
        $scope.modifyVendorCountryModel = $scope.modifyVendorCountryModel.country_id;
      }

      if ($scope.modifyVendorNameModel.vendor_name) {
        $scope.modifyVendorNameModel = $scope.modifyVendorNameModel.vendor_name;
      }

      var parameters = {
        "vendor_id": $scope.modifyVendorVendorIdModel,
        "vendor_name": $scope.modifyVendorNameModel,
        "vendor_address": $scope.modifyVendorAddressModel,
        "vendor_city": $scope.modifyVendorCityModel,
        "vendor_country": $scope.modifyVendorCountryModel,
        "vendor_phone": $scope.modifyVendorPhoneModel,
        "vendor_email": $scope.modifyVendorEmailModel,
        "user_id": user_id
      };
      console.log("parameters of modifyVendorUpdate====>>>>" + JSON.stringify(parameters));

      POTrackerService.getAddModifyVendorService(parameters).then(projectResponseAddModifyVendor)

      function projectResponseAddModifyVendor(response) {
        if (response != "error") {
          document.getElementById('loadTT').style.visibility = "hidden";
          $scope.search();
          $.toast({
            heading: 'Vendor Details Modify Successfully!',
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'success',
            hideAfter: 3500,
            stack: 1
          });
          console.log("Modify Vendor Update Result>>>>" + JSON.stringify(response.recordsets[0]));

          $scope.modifyVendorNameModel = "";
          $scope.modifyVendorAddressModel = "";
          $scope.modifyVendorCityModel = "";
          $scope.modifyVendorCountryModel = "";
          $scope.modifyVendorPhoneModel = "";
          $scope.modifyVendorEmailModel = "";
          $scope.modifyVendorNameStyle = "";
          $scope.modifyVendorEmailStyle = "";

        } else {
          alert("Some error occurred!!");
        }
      } //end of projectResponseAddModifyVendor

    } //end of if
  } //end of modifyVendorUpdate
  //============================================================ end of modifyVendorUpdate function ===================

  //============================================================ start of modifyChange function =====================
  $scope.modifyChange = function(modifyChangeObj) {
    console.log("In modify change function");

    $scope.modifyVendorNameStyle = "";
    $scope.modifyVendorEmailStyle = "";

    console.log("modifyChangeObj" + JSON.stringify(modifyChangeObj));

    for (var i = 0; i < $scope.addModifyVendorList.length; i++) {
      for (var j = 0; j < $scope.addModifyCountryList.length; j++) {
        if (modifyChangeObj.country_id == $scope.addModifyCountryList[j].country_id) {
          $scope.modifyVendorCountryModel = $scope.addModifyCountryList[j];
          break;
        } else {
          $scope.modifyVendorCountryModel = "";
        }
      }
      if (modifyChangeObj.vendor_id == $scope.addModifyVendorList[i].vendor_id) {
        $scope.modifyVendorVendorIdModel = $scope.addModifyVendorList[i].vendor_id;
        $scope.modifyVendorAddressModel = $scope.addModifyVendorList[i].address;
        $scope.modifyVendorCityModel = $scope.addModifyVendorList[i].city;
        $scope.modifyVendorPhoneModel = $scope.addModifyVendorList[i].phone;
        $scope.modifyVendorEmailModel = $scope.addModifyVendorList[i].email;
      }
    }
  } // end of modifyChange function
  //============================================================ end of modifyChange function =====================

  //=========================================== start of edit function  ============================================
  $scope.edit = function(index) {
    console.log("In edit function");

    editFlag = "edit_flag";

    $scope.poList[index].editRowStyle = {
      'background': 'Honeydew'
    }

    $scope.poList[index].serviceName = true;
    $scope.poList[index].poValue = true;
    $scope.poList[index].Comments = true;

    // for (var i = 0; i < $scope.poList.length; i++) {
    //   if ($scope.poList[i].commentsModell.length > 0) {
    //     $scope.poList[i].filledEditComments = true;
    //     $scope.poList[i].emptyEditComments = false;
    //   } else {
    //     $scope.poList[i].filledEditComments = false;
    //     $scope.poList[i].emptyEditComments = true;
    //   };
    // } //end of for loop
    for(var i = 0; i < $scope.poList.length; i++){
      if($scope.poList[i].commentsModell == "" || $scope.poList[i].commentsModell == null || $scope.poList[i].commentsModell == 'undefined'){
        $scope.poList[i].filledEditComments = false;
        $scope.poList[i].emptyEditComments = true;
      }else{
        $scope.poList[i].filledEditComments = true;
        $scope.poList[i].emptyEditComments = false;
      }
    }
  }; //end of edit function
  //=========================================== end of edit function =================================================

  //============================================= start of onEditClickComment box ========================================
  $scope.onEditClickComment = function(index, flag) {
    console.log("In onEditClickComment function");

    angular.forEach($scope.poList, function(value, key) {
      value.commentsEditStyle = false;
      // value.cmntsStyle = {"visibility": "hidden"};
    })

    if (flag === 'showEditCmntBox') {
      $scope.poList[index].commentsEditStyle = true;
    }
    if (flag === 'hideEditCmntBox') {
      $scope.poList[index].commentsEditStyle = false;
    }
    // if ($scope.poList[index].commentsModell.length > 0) {
    //   $scope.poList[index].filledEditComments = true;
    //   $scope.poList[index].emptyEditComments = false;
    // } else {
    //   $scope.poList[index].filledEditComments = false;
    //   $scope.poList[index].emptyEditComments = true;
    // };
    if($scope.poList[index].commentsModell == "" || $scope.poList[index].commentsModell == null || $scope.poList[index].commentsModell == 'undefined'){
      $scope.poList[index].filledEditComments = false;
      $scope.poList[index].emptyEditComments = true;
    }else{
      $scope.poList[index].filledEditComments = true;
      $scope.poList[index].emptyEditComments = false;
    }
  }
  //============================================= end of onEditClickComment box ========================================

  //============================================================ start of finalSubmit function =====================
  $scope.finalSubmit = function() {
    console.log("In finalSubmit function");

    var subString = "";
    var finalString = "";
    var add_flags = "";
    var edit_flags = "";
    var proposal_no = "";
    var billing_entity = "";
    var billing_entity_id = "";

    var sname = "";
    var sid = "";
    var poValue = "";
    var commentss = "";
    var date = "";

    //============================================= start of direct final submit ======================================
    if (addPOFlag != "addPOFlags" && editFlag != "edit_flag") {
      console.log("In direct submit");
      $.toast({
        heading: 'PO details saved successfully!!',
        position: 'top-right',
        loaderBg: '#ff6849',
        icon: 'success',
        hideAfter: 3500,
        stack: 1
      });
    } //end of if
    //============================================ end of  direct final submit =======================================

    // =============================================start of edit and then final submit ==============================
    if (editFlag == "edit_flag") {
      console.log("In edit and then submit");
      for (var i = 0; i < $scope.poList.length; i++) {
        if ($scope.poList[i].serviceModell && $scope.poList[i].poValueModell) {
          if (edit_flags != "error") {

            edit_flags = "true";
            $scope.poList[i].serviceStyle = "";
            $scope.poList[i].poValueStyle = "";

            if ($scope.poList[i].serviceName) {
              sname = $scope.poList[i].serviceModell.Services_offered;
              sid = $scope.poList[i].serviceModell.services_offered_id;
            } else {
              sname = $scope.poList[i].service_name;
              sid = $scope.poList[i].service_id;
            }

            if ($scope.poList[i].poValue) {
              poValue = $scope.poList[i].poValueModell;
            } else {
              poValue = $scope.poList[i].po_value;
            }

            if ($scope.poList[i].Comments) {
              commentss = $scope.poList[i].commentsModell;
            } else {
              commentss = $scope.poList[i].comments;
            }

            subString = subString + $scope.poList[i].po_id + "#~#" +
              $scope.poList[i].vendor_id + "#~#" +
              $scope.poList[i].vendor_name + "#~#" +
              sid + "#~#" +
              sname + "#~#" +
              $scope.poList[i].billing_currency_id + "#~#" +
              $scope.poList[i].billing_currency + "#~#" +
              poValue + "#~#" +
              $filter('date')($scope.poList[i].generation_date, "yyyy-MM-dd HH:mm:ss") + "#~#" +
              commentss + "#~##@#";
          }
        } else {
          edit_flags = "error";
          $scope.poList[i].serviceStyle = {
            "border-color": "red"
          };
          $scope.poList[i].poValueStyle = {
            "border-color": "red"
          };
        } //end of else
      } //end of 1st for loop

      for (var j = 0; j < $scope.proposalTableList.length; j++) {
        proposal_no = $scope.proposalTableList[j].proposal_no;
        billing_entity = $scope.proposalTableList[j].billing_entity
        billing_entity_id = $scope.proposalTableList[j].billing_entity_id;
      }

      if (edit_flags === "error") {
        alert("1. Please select service and billing currency for PO \n2. PO value cannot be 0");
        return false;
      } else if (edit_flags === "true") {
        console.log("All fields are properly filled");
      }

      var parameters = {
        "user_id": user_id,
        "proposal_no": proposal_no,
        "billing_entity_id": billing_entity_id,
        "billing_entity_name": billing_entity,
        "string": subString
      };
      console.log("parameters of edit then submit===>>>>" + JSON.stringify(parameters));

      POTrackerService.getFinalSubmitService(parameters).then(projectResponseFinalSubmit)

      function projectResponseFinalSubmit(response) {
        if (response != "error") {
          document.getElementById('loadTT').style.visibility = "hidden";
          $scope.search();
          editFlag = "";
          $.toast({
            heading: 'Data Edited and Inserted Successfully!!',
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'success',
            hideAfter: 3500,
            stack: 1
          });
          console.log("Final Submit Result>>>>" + JSON.stringify(response.recordsets));
        } else {
          alert("Some error occurred!!");
        }
      } //end of projectResponseFinalSubmit
    } // end of if editFlag
    // ============================================= end of edit and then final submit ==============================

    // ========================================= start code for Add and then submit PO (adding row) ==================
    if (addPOFlag == "addPOFlags") {
      console.log("In add PO and then submit");
      var flag = true;
      var error_msg = "Highlighted fields are mandatory";

      for (var i = 0; i < $scope.addPODataList.length; i++) {

        if ($scope.addPODataList[i].dateModel == null || $scope.addPODataList[i].dateModel == "" ||
          $scope.addPODataList[i].dateModel == 'undefined' || $scope.addPODataList[i].vendorModel == null ||
          $scope.addPODataList[i].vendorModel == "" || $scope.addPODataList[i].vendorModel == 'undefined' ||
          !$scope.addPODataList[i].serviceModel || !$scope.addPODataList[i].currencyModel || !$scope.addPODataList[i].billingModel) {
          if ($scope.addPODataList[i].dateModel == null || $scope.addPODataList[i].dateModel == "" ||
            $scope.addPODataList[i].dateModel == 'undefined') {
            $scope.addPODataList[i].dateStyle = {
              "border-color": "red"
            }
            flag = false;
          } else {
            $scope.addPODataList[i].dateStyle = "";
          }
          if ($scope.addPODataList[i].vendorModel == null || $scope.addPODataList[i].vendorModel == "" ||
            $scope.addPODataList[i].vendorModel == 'undefined') {
            $scope.addPODataList[i].vendorStyle = {
              "border-color": "red"
            }
            flag = false;
          } else {
            $scope.addPODataList[i].vendorStyle = "";
          }
          if (!$scope.addPODataList[i].serviceModel) {
            $scope.addPODataList[i].serviceStyle = {
              "border-color": "red"
            }
            flag = false;
          } else {
            $scope.addPODataList[i].serviceStyle = "";
          }
          if (!$scope.addPODataList[i].currencyModel) {
            $scope.addPODataList[i].currencyStyle = {
              "border-color": "red"
            }
            flag = false;
          } else {
            $scope.addPODataList[i].currencyStyle = "";
          }
          if (!$scope.addPODataList[i].billingModel) {
            $scope.addPODataList[i].billingCurrencyStyle = {
              "border-color": "red"
            }
            flag = false;
          } else {
            $scope.addPODataList[i].billingCurrencyStyle = "";
          }
        }
      }

      if (flag == false) {
        alert(error_msg);
      } else {
        for (var i = 0; i < $scope.addPODataList.length; i++) {
          $scope.addPODataList[i].dateStyle = "";
          $scope.addPODataList[i].vendorStyle = "";
          $scope.addPODataList[i].serviceStyle = "";
          $scope.addPODataList[i].currencyStyle = "";
          $scope.addPODataList[i].billingCurrencyStyle = "";

          subString = subString + "-99" + "#~#" +
            $scope.addPODataList[i].vendorModel.vendor_id + "#~#" +
            $scope.addPODataList[i].vendorModel.vendor_name + "#~#" +
            $scope.addPODataList[i].serviceModel.services_offered_id + "#~#" +
            $scope.addPODataList[i].serviceModel.Services_offered + "#~#" +
            $scope.addPODataList[i].currencyModel.currency_id + "#~#" +
            $scope.addPODataList[i].currencyModel.currency + "#~#" +
            $scope.addPODataList[i].billingModel + "#~#" +
            $filter('date')($scope.addPODataList[i].dateModel, "yyyy-MM-dd HH:mm:ss") + "#~#" +
            $scope.addPODataList[i].commentsModel + "#~##@#";
        } //end of for loop

        for (var j = 0; j < $scope.proposalTableList.length; j++) {
          proposal_no = $scope.proposalTableList[j].proposal_no;
          billing_entity = $scope.proposalTableList[j].billing_entity
          billing_entity_id = $scope.proposalTableList[j].billing_entity_id;
        }

        var parameters = {
          "user_id": user_id,
          "proposal_no": proposal_no,
          "billing_entity_id": billing_entity_id,
          "billing_entity_name": billing_entity,
          "string": subString
        };
        console.log("parameters of addPO then submit====>>>>" + JSON.stringify(parameters));

        POTrackerService.getFinalSubmitService(parameters).then(projectResponseFinalSubmit)

        function projectResponseFinalSubmit(response) {
          if (response != "error") {
            document.getElementById('loadTT').style.visibility = "hidden";
            $scope.search();
            addPOFlag = "";
            $.toast({
              heading: 'New PO Added Successfully!!',
              position: 'top-right',
              loaderBg: '#ff6849',
              icon: 'success',
              hideAfter: 3500,
              stack: 1
            });
            console.log("Final Submit Result>>>>" + JSON.stringify(response.recordsets));
          } else {
            alert("Some error occurred!!");
          }
        } //end of projectResponseFinalSubmit
      } //end of else
    } // end of if addPOFlag
    // ========================================= end code for Add and then submit PO (adding row) ===================
  } // end of finalSubmit function
  //============================================================ end of finalSubmit function =====================

  //============================================================ start of exportExcel function =====================
  $scope.exportExcel = function() {
    console.log("In exportExcel function"+$scope.PO_Excel_Report[0].comments);

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

          // if (C == 0) {
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

     var client_name = "";
     var proposal_no = "";
     var po_order_no = "";
     var po_generation_date = "";
     var vendor_PO = "";
     var vendor_name = "";
     var service = "";
     var billing_currency = "";
     var total_po_value = "";
     var total_paid_value = "";
     var total_po_value_in_usd = "";
     var total_paid_value_in_usd = "";
     var billing_entity = "";
     var created_modified_by = "";
     var comments = "";
     var outsourced_budget = "";
     var project_closure_date = "";

     var finalData = [];

     //pushing column header
     finalData.push(["Client Name","Proposal No.","PO Order no","PO Generation Date","Vendor name","Service","Billing Currency","Total PO value","Total Paid value","Total PO Value in USD","Total Paid value in USD","Billing Entity","Created/Modified by","Comments","Outsourced Budget","Project Closure Date","Vendor PO"]);

      for(var i=0;i<$scope.PO_Excel_Report.length;i++){
       client_name = $scope.PO_Excel_Report[i].client_name;
       proposal_no = $scope.PO_Excel_Report[i].proposal_no;
       po_order_no = $scope.PO_Excel_Report[i].po_order_no;
       po_generation_date = $scope.PO_Excel_Report[i].po_generation_date;
       vendor_name = $scope.PO_Excel_Report[i].vendor_name;
       service = $scope.PO_Excel_Report[i].service;
       billing_currency = $scope.PO_Excel_Report[i].billing_currency;
       total_po_value = $scope.PO_Excel_Report[i].total_po_value;
       total_paid_value = $scope.PO_Excel_Report[i].total_paid_value;
       total_po_value_in_usd = $scope.PO_Excel_Report[i].total_po_value_in_usd;
       total_paid_value_in_usd = $scope.PO_Excel_Report[i].total_paid_value_in_usd;
       billing_entity = $scope.PO_Excel_Report[i].billing_entity;
       created_modified_by = $scope.PO_Excel_Report[i].created_modified_by;
       comments = $scope.PO_Excel_Report[i].comments;
       outsourced_budget = $scope.PO_Excel_Report[i].outsourced_budget;
       project_closure_date = $scope.PO_Excel_Report[i].project_closure_date;
       vendor_PO = $scope.PO_Excel_Report[i].vendor_PO;

       result = [];
       result.push(client_name,proposal_no,po_order_no,po_generation_date,vendor_name,service,billing_currency,total_po_value,total_paid_value,total_po_value_in_usd,total_paid_value_in_usd,billing_entity,created_modified_by,comments,outsourced_budget,project_closure_date,vendor_PO);

        //pushing final data
        finalData.push(result);
      }//end of for loop


     var ws_name = "SheetJS";

     var wb = new Workbook(),

       ws = sheet_from_array_of_arrays(finalData);

     /* add worksheet to workbook */
     wb.SheetNames.push(ws_name);

     wb.Sheets[ws_name] = ws;

     var wbout = XLSX.write(wb, {
       bookType: 'xlsx',
       bookSST: true,
       type: 'binary'
     });
     console.log(wb);
     saveAs(new Blob([s2ab(wbout)], {
       type: "application/octet-stream"
     }), "PO_Report.xlsx")

    function read() {
      /* set up XMLHttpRequest */
      var url = "PO_Report.xlsx";
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
        }), "PO_Report.xlsx")
      }

      oReq.send();
    }//end of read function
  }
  //============================================================ end of exportExcel function =====================

}]); //end of workflow.controller
//==================================================== end of  workflow.controller function ============================
