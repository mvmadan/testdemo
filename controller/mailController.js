workflow.controller("mailController", ['$scope', 'projectClosureService', function($scope, projectClosureService) {

  console.log("In Mail Controller");
  // $scope.message = "hello";
  var parameters = {
    "service": 201,
    "client": 500,
    "client_team": null,
    "team": null,
    "region": null,
    "project_no_name": null,
    "user_id": 3370,
    "pic": null
  };

  projectClosureService.getViewProjectClosureService(parameters).then(projectRespMail)

  function projectRespMail(response) {
    if (response != "error") {
      $scope.mailTableList = response.recordsets[0];
    } else {
      alert("Some error occurred!!");
    }
  }; //end of function projectResp

  $(document).ready(function() {
    var to, subject, startHtml, forHtml, endHtml, finalHtml;
    $("#send_email").click(function() {

      to = $("#to").val();
      subject = $("#subject").val();

      $scope.showTable = true;
      startHtml = "<table style='border-collapse: collapse;'><thead><tr bgcolor='pink'><th style='border: 1px solid black;'> Project Number/Name </th> &nbsp;&nbsp;<th style='border: 1px solid black;'> PIC </th> &nbsp;&nbsp;<th style='border: 1px solid black;'> Service(s) </th >&nbsp;&nbsp; <th style='border: 1px solid black;'> Client </th> &nbsp;&nbsp;<th style='border: 1px solid black;'> Description </th></tr></thead><tbody>";

      for (var i = 0; i < $scope.mailTableList.length; i++) {
        forHtml = forHtml + "<tr bgcolor='F0F8FF'><td style='border: 1px solid black;'>" +
          $scope.mailTableList[i].project_id +
          "</td><td style='border: 1px solid black;'>" +
          $scope.mailTableList[i].PIC +
          "</td><td style='border: 1px solid black;'>" +
          $scope.mailTableList[i].Service +
          "</td><td style='border: 1px solid black;'>" +
          $scope.mailTableList[i].Client +
          "</td><td style='border: 1px solid black;'>" +
          $scope.mailTableList[i].Description +
          "</td></tr>";

      };
      endHtml = "</tbody></table>"

      finalHtml = startHtml + forHtml + endHtml;

      $("#message_span").text("Sending E-mail...Please wait");
      $.get("/send", {
        to: to,
        subject: subject,
        html: finalHtml
      }, function(data) {
        if (data == "sent") {
          $("#message_span").empty().html("Email is been sent at " + to + " . Please check inbox!");
        }

      });
    });
  });

}]); //end of workflow.controller
