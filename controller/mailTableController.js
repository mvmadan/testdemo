workflow.controller("mailTableController", ['$scope', '$rootScope', '$window', '$http', '$timeout', '$q', '$log', '$filter', 'mailTableService', function($scope, $rootScope, $window, $http, $timeout, $q, $log, $filter, mailTableService) {

  $scope.isLoggedIn = JSON.parse($window.localStorage.getItem('userJSON')).loggedIn;
  $scope.loggedInUser = JSON.parse($window.localStorage.getItem('userJSON')).employee_name;
  var user_id = JSON.parse($window.localStorage.getItem('userJSON')).employee_id;
  var htmlStrAdd = "";
  var htmlStrModify = "";

  mailTableService.getMailTableService().then(projectResponseMailTable)

  function projectResponseMailTable(response) {
    if (response != "error") {

      $scope.mailListAdd = response.recordsets[0];
      $scope.mailListModify = response.recordsets[1];

      for (var i = 0; i < $scope.mailListAdd.length; i++) {
        $scope.mailListAdd[i].srNo = i + 1;
        htmlStrAdd += "<tbody><tr><td style='border: 1px solid black;'>" +
          $scope.mailListAdd[i].srNo + "</td><td style='border: 1px solid black;'>" +
          $scope.mailListAdd[i].ponumber_project_name + "</td><td style='border: 1px solid black;'>" +
          $scope.mailListAdd[i].service_name + "</td><td style='border: 1px solid black;'>" +
          $scope.mailListAdd[i].region + "</td><td style='border: 1px solid black;'>" +
          $scope.mailListAdd[i].project_type + "</td><td style='border: 1px solid black;'>" +
          $scope.mailListAdd[i].total_client_estimate_hours + "</td><td style='border: 1px solid black;'>" +
          $scope.mailListAdd[i].total_internal_estimate_hours + "</td> </tr></tbody>"
      } //end of for loop


      for (var i = 0; i < $scope.mailListModify.length; i++) {
        $scope.mailListModify[i].sr_no = i + 1;
        htmlStrModify += "<tbody><tr><td style='border: 1px solid black;'>" +
          $scope.mailListModify[i].sr_no + "</td><td style='border: 1px solid black;'>" +
          $scope.mailListModify[i].ponumber_project_name + "</td><td style='border: 1px solid black;'>" +
          $scope.mailListModify[i].field + "</td><td style='border: 1px solid black;'>" +
          $scope.mailListModify[i].from + "</td><td style='border: 1px solid black;'>" +
          $scope.mailListModify[i].to + "</td> </tr></tbody>"
      } //end of for loop
    } //end of if
    else {
      alert("Some error occurred!!");
    }
  } //end of function projectResponseMailTable

  //================================================== start of send function ============================================
  $scope.send = function() {
    console.log("In send function");
    $("#message_span").text("Sending E-mail.... Please wait");

    var parameters = {
      "to": $scope.toModel,
      "subject": $scope.subjectModel,
      "htmlStrAdd": htmlStrAdd,
      "htmlStrModify": htmlStrModify,
    };
    console.log("parameters====>>>>" + JSON.stringify(parameters));

    mailTableService.getMailRequestService(parameters).then(projectResponseMailRequest)

    function projectResponseMailRequest(response) {
      if (response != "error") {
        $("#message_span").empty().html("Email is been sent at " + $scope.toModel + ". Please check inbox!");
      } //end of for loop
      else {
        alert("Some error occurred!!");
        $("#message_span").text("");
        $scope.toModel = "";
        $scope.subjectModel = "";
      }
    } //end of function projectResponseMailRequest
  }
  //================================================== end of send function ============================================

}]); //end of workflow.controller
