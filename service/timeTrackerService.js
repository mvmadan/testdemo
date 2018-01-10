(function() {
  "use strict"
  workflow.factory('timeTrackerService', ['$q', '$http', '$timeout', '$location', '$log', 'CONSTANT', '$filter', timeTrackerService]);

  function timeTrackerService($q, $http, $timeout, $location, $log, CONSTANT, $filter) {
    console.log("In timeTrackerService");
    return {
      getBilledActivities: getBilledActivities,
      getBilledList: getBilledList,
      getNPBilledList: getNPBilledList,
      getEditData: getEditData,
      getEditProjectBilledList: getEditProjectBilledList,
      save: save,
      getEditNonProjectBilledList: getEditNonProjectBilledList,
      handoverOnload: handoverOnload,
      getHandoverList: getHandoverList,
      getNonProjectHandoverList: getNonProjectHandoverList,
      getSaveHandoverStr: getSaveHandoverStr,
      saveHandover: saveHandover,
      getModifiedHandoverList: getModifiedHandoverList,
      getAdditionalHandoverList: getAdditionalHandoverList,
      quickBill: quickBill,
      getFinalOtherData: getFinalOtherData
    }

    /*************Promise response/reject function used by all HTTP request/response methods***************/
    function responseData(response) {
      return response.data;
    };

    function catchError(response) {
      return $q.reject('Error retrieving getClusterMetrics. (HTTP status: ' + response.status + ') >>' + JSON.stringify(response));
    };
    /*******************************************************************************************************/

    /*******************************************HTTP Request/Response starts here***************************/

    function getBilledActivities(param) {
      console.log("In getBilledActivities() service");
      return $http({
        url: CONSTANT.API_URL + '/timeTracker/billedActivities',
        method: 'GET',
        params: {
          employee_id: param.employee_id,
          curr_date: param.curr_date,
          cfds_id: param.cfds_id
        }
      }).then(responseData).catch(catchError);
    } /************getBilledActivities ends here**************/

    function getEditData(param) {
      console.log("In getEditData() service");
      return $http({
        url: CONSTANT.API_URL + '/timeTracker/editData',
        method: 'GET',
        params: {
          project_task_id: param.project_task_id,
          project_id: param.project_id,
          employee_id: param.employee_id
        }
      }).then(responseData).catch(catchError);
    } /************getEditData ends here**************/

    function save(param) {
      console.log("In save() service >>" + JSON.stringify(param));
      return $http({
        url: CONSTANT.API_URL + '/timeTracker/save',
        method: 'POST',
        params: param
      }).then(responseData).catch(catchError);
    } /************save ends here**************/

    function handoverOnload(param) {
      console.log("In handoverOnload() service");
      return $http({
        url: CONSTANT.API_URL + '/timeTracker/handover',
        method: 'GET',
        params: {
          user_id: param
        }
      }).then(responseData).catch(catchError);
    } /************handoverOnload ends here**************/

    function saveHandover(param) {
      console.log("In saveHandover() service");
      return $http({
        url: CONSTANT.API_URL + '/timeTracker/saveHandover',
        method: 'POST',
        data: param
      }).then(responseData).catch(catchError);
    } /************saveHandover ends here**************/

    function quickBill(param){
      console.log("In quickBill() service");
      return $http({
        method: "POST",
        url: CONSTANT.API_URL + '/timeTracker/quickBill',
        data: param
      }).then(responseData).catch(catchError);
    } /************quickBill ends here**************/

    /*******************************************HTTP Request/Response ends here***************************/

    /*******************************************Service Menthods & Logic starts here***************************/

    function getEditProjectBilledList(rowObj, projectBilledList, peerProjectList, projectDeliverableList) {
      console.log("In getEditProjectBilledList()");
      /*var projectList = responseList.recordsets[0];
      var projectDeliverableList = responseList.recordsets[1];
      var taskList = responseList.recordsets[2];
      var clientList = responseList.recordsets[3];
      var peerProjectList = responseList.recordsets[4];*/

      angular.forEach(projectBilledList, function(value, key) {
        console.log("value.isWeekend>>" + value.isWeekend + "<<rowObj.selectedPeerName>>" + rowObj.selectedPeerName);
        if (angular.equals(value, rowObj)) {
          console.log("In IF >>" + rowObj.project_id);
          value.selectedProject = rowObj.project_id;
          value.selectedDeliverable = rowObj.deliverable_id;
          value.selectedTask = rowObj.task_id;
          value.selectedPeerName = value;
          value.show = true;
          value.isWeekendHours = value.isWeekend;
          value.isPeerRework = value.isPeerRework;
          value.hours = value.executed_hours?value.executed_hours.split(":")[0]:"00";
          value.mins = value.executed_hours?value.executed_hours.split(":")[1]:"00";
          value.cmntBoxStyle = {'visibility': 'hidden'};
          value.disabled = false;

          var keepGoing = 0;
          var assign_deliverable_id = [];/*_.where(projectDeliverableList, {deliverable_id : rowObj.deliverable_id})[0];*/

          /*value.selectedDeliverable = assign_deliverable_id;*/
          console.log("value.selectedDeliverable >>" + assign_deliverable_id);
          angular.forEach(peerProjectList, function(value2, key2){
            if(keepGoing == 0 && value2.employee_name_no == value.peer_name && value2.project_id == value.project_id){
              console.log("In equals >>" + value.peer_name);
              value.selectedPeerName = value2;
              console.log("In equals >>" + JSON.stringify(value.selectedPeerName));
              keepGoing = 1;
            }
          });

        } else {
          value.show = false;
        }
      });
      console.log("Out of getEditProjectBilledList()");
    }

    function getEditNonProjectBilledList(rowObj, projectNonBilledList, peerProjectList) {
      console.log("In getEditProjectBilledList()");
      /*var projectList = responseList.recordsets[0];
      var projectDeliverableList = responseList.recordsets[1];
      var taskList = responseList.recordsets[2];
      var clientList = responseList.recordsets[3];
      var peerProjectList = responseList.recordsets[4];*/

      angular.forEach(projectNonBilledList, function(value, key) {
        console.log("value.project_task_id>>" + value.project_task_id + "<<rowObj.project_deliverable_id>>" + rowObj.project_deliverable_id);
        if (angular.equals(value, rowObj)) {
          console.log("In IF");
          value.selectedClient = rowObj.client_id;
          value.selectedTask = rowObj.task_id;
          value.show = true;
          value.isWeekendHours = value.isWeekend;
          value.isPeerRework = value.isPeerRework;
          value.hours = value.executed_hours?value.executed_hours.split(":")[0]:"00";
          value.mins = value.executed_hours?value.executed_hours.split(":")[1]:"00";
          value.cmntBoxStyle = {'visibility': 'hidden'};
          value.disabled = false;
        } else {
          value.show = false;
        }
      });
      console.log("projectNonBilledList.length>>" + projectNonBilledList.length);
    }

    function getBilledList(projectBilledList) {
      console.log("In getBilledList()");
      /*var projectList = responseList.recordsets[0];
      var projectDeliverableList = responseList.recordsets[1];
      var taskList = responseList.recordsets[2];
      var clientList = responseList.recordsets[3];
      var peerProjectList = responseList.recordsets[4];*/

      angular.forEach(projectBilledList, function(value, key) {
        value.execution_date = $filter('date')(value.execution_date, "dd MMM yyyy");
        value.cmntBoxStyle = {'visibility': 'hidden'};
        value.disabled = true;
        if(value.description){
          value.showCmntImg = true;
        } else {
          value.showCmntImg = false;
        }
      });
      console.log("projectBilledList.length>>" + projectBilledList.length);
      return projectBilledList;
    }

    function getNPBilledList(projectNPBilledList) {
      console.log("In getNPBilledList()");
      /*var projectList = responseList.recordsets[0];
      var projectDeliverableList = responseList.recordsets[1];
      var taskList = responseList.recordsets[2];
      var clientList = responseList.recordsets[3];
      var peerProjectList = responseList.recordsets[4];*/

      angular.forEach(projectNPBilledList, function(value, key) {
        value.execution_date = $filter('date')(value.execution_date, "dd MMM yyyy");
        value.cmntBoxStyle = {'visibility': 'hidden'};
        value.disabled = true;
        if(value.description){
          value.showCmntImg = true;
        } else {
          value.showCmntImg = false;
        }
      });
      console.log("projectNPBilledList.length>>" + projectNPBilledList.length);
      return projectNPBilledList;
    }


    function getModifiedHandoverList(handoverListTemp, assignToEmpList) {
      console.log("In getModifiedHandoverList()");

      /*var handoverList = [];*/

      angular.forEach(handoverListTemp, function(value, key) {
        angular.forEach(assignToEmpList, function(value2, key2) {
          if (angular.equals(value.assigned_to, value2.employee_id)) {
            value.assign_employee_name = value2;
            value.class = "";
            console.log("value.assign_employee_name>>" + value.assign_employee_name.employee_id);
          }
        });
      });
      console.log("Out of getModifiedHandoverList()");
      return handoverListTemp;
    }

    function getHandoverList(handoverList, h_projectList) {
      console.log("In getHandoverList()");

      /*var handoverList = [];*/

      angular.forEach(h_projectList, function(value, key) {
        angular.forEach(handoverList, function(value2, key2) {
          if (angular.equals(value.project_task_id, value2.project_task_id)) {
            value.handover_id = value2.handover_id;
            value.estimated_hours = value2.est_hours;
            value.handover_comments = value2.handover_comments?value2.handover_comments:" ";
            value.status = value2.status;
            value.assigned_to = value2.assigned_to;
            value.handover_type = value2.handover_type;
            value.assign_employee_name = value2.assign_employee_name;
            value.class = "";

            if (value.status == 'completed') {
              value.status = true;
              value.assign_employee_name = "";
              value.estimated_hours = "";
              value.disableAssignedTo = true;
            } else if (value.status == 'pending') {
              value.status = false;
              value.disableAssignedTo = false;
            }

          }
        });
      });
      console.log("Out of getHandoverList()");
      return h_projectList;
    }

    function getNonProjectHandoverList(handoverList, h_nonProjectList) {
      console.log("In getNonProjectHandoverList()");

      angular.forEach(h_nonProjectList, function(value, key) {
        angular.forEach(handoverList, function(value2, key2) {
          if (angular.equals(value.project_task_id, value2.project_task_id)) {
            value.handover_id = value2.handover_id;
            value.estimated_hours = value2.est_hours;
            value.handover_comments = value2.handover_comments?value2.handover_comments:"";
            value.status = value2.status;
            value.assigned_to = value2.assigned_to;
            value.handover_type = value2.handover_type;
            value.assign_employee_name = value2.assign_employee_name;
            value.class = "";

            if (value.status === 'completed') {
              value.status = true;
              value.assign_employee_name = "";
              value.estimated_hours = "";
              value.disableAssignedTo = true;
            } else if (value.status === 'pending') {
              value.status = false;
              value.disableAssignedTo = false;
            }

          }
        });
      });
      console.log("Out of getNonProjectHandoverList()");
      return h_nonProjectList;
    }

    function getSaveHandoverStr(h_projectList, h_nonProjectList, additionalHandoverList) {
      console.log("IN saveHandover() Service");
      /*handoverInsertStr.append("P" + "#~#" + impl.getHandoverStatus() + "#~#" + handoverEmpId + "#~#" + impl.getHandoverComments() +
      "#~#" + estHrs + "#~#" + impl.getProjectTaskId() + "#~#" + "0"  + "#@#");*/
      /*handoverInsertStr.append("N" + "#~#" + impl.getHandoverNPStatus() + "#~#" + handoverEmpId + "#~#" + impl.getHandoverNPComments()
      + "#~#" + estHrs + "#~#" + impl.getProjectTaskId() + "#~#" + "0" + "#@#");*/
      /*"A" + "#~#" + impl.getAdditionalHandoverStatus() + "#~#" + handoverEmpId + "#~#" + impl.getAdditionalHandoverComments()
      + "#~#" + estHrs + "#~#" + addHandoverId + "#~#" + impl.getAdditionalSelectedHandoverProject() + "#@#"*/
      var handoverStr = [];

      angular.forEach(h_projectList, function(value, key) {
        console.log("value.status>>" + value.status);
        var status = [];
        if (value.status === true) {
          status = 'completed';
        } else {
          status = 'pending';
        }
        handoverStr += "P#~#" + status + "#~#"
                    + ($filter('ifEmpty')(value.assign_employee_name,'0') != 0 ? value.assign_employee_name.employee_id : 0)
                    + "#~#" + (value.handover_comments?value.handover_comments:"") + "#~#" + (value.estimated_hours?value.estimated_hours:"") + "#~#"
                    + value.project_task_id + "#~#" + "0" + "#@#";
      });

      angular.forEach(h_nonProjectList, function(value, key) {
        /*console.log(value.assign_employee_name);*/
        var status = [];
        if (value.status === true) {
          status = 'completed';
        } else {
          status = 'pending';
        }
        handoverStr += "N#~#" + status + "#~#"
                    + ($filter('ifEmpty')(value.assign_employee_name,'0') != 0 ? value.assign_employee_name.employee_id : 0)
                    + "#~#" + (value.handover_comments?value.handover_comments:"") + "#~#" + (value.estimated_hours?value.estimated_hours:"") + "#~#"
                    + value.project_task_id + "#~#" + "0" + "#@#";
      });

      angular.forEach(additionalHandoverList, function(value, key) {
        console.log("value.status>>" + value.status);
        var status = [];
        if (value.status === true) {
          status = 'completed';
        } else {
          status = 'pending';
        }
        handoverStr += "A#~#" + status + "#~#"
                    + ($filter('ifEmpty')(value.assign_employee_name,'0') != '0' ? value.assign_employee_name.employee_id : 0)
                    + "#~#" + (value.handover_comments?value.handover_comments:"") + "#~#" + (value.estimated_hours?value.estimated_hours:"") + "#~#"
                    + value.additional_id + "#~#" + value.selectedProject + "#@#";
      });
      console.log("out of getSaveHandoverStr()>>" + handoverStr);
      return handoverStr;
    }

    function getAdditionalHandoverList(additionalHandoverList, assignToEmpList) {
      console.log("In getAdditionalHandoverList() service");

      angular.forEach(additionalHandoverList, function(value, key) {
        value.selectedProject = value.project_id;
        value.estimated_hours = value.est_hours;
        value.class = "";

        angular.forEach(assignToEmpList, function(value2, key2) {
          if (angular.equals(value.assigned_to, value2.employee_id)) {
            value.assign_employee_name = value2;
            console.log("value.assign_employee_name>>" + value.assign_employee_name.employee_id);
          }
        });

        if (value.status === 'completed') {
          value.status = true;
          value.assign_employee_name = '';
          value.estimated_hours = "";
          value.disableAssignedTo = true;
        } else if (value.status === 'pending') {
          value.status = false;
          value.disableAssignedTo = false;
        }

      });
      console.log("out of getAdditionalHandoverList()");
      return additionalHandoverList;
    }

    function getFinalOtherData(otherDataList, billedPeerList){
      console.log("In getFinalOtherData()");

      angular.forEach(otherDataList, function(value, key) {
        console.log("isPeerRework>>" + value.isPeerRework + "<<isWeekendHours>>" + value.isWeekendHours);
        value.peer_rework = value.isPeerRework;
        value.weekend_hours = value.isWeekendHours;
        angular.forEach(billedPeerList, function(value2, key2){
          if(value.peer_name === value2.employee_name){
            value.selectedEmployee = value2;
          }
        });
      });
      return otherDataList;
      console.log("Out of getFinalOtherData()");
    }
    /*******************************************Service Menthods & Logic ends here***************************/

  }
})();
