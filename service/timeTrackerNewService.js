(function() {

  workflow.factory('timeTrackerNewService', ['$q', '$http', 'CONSTANT', 'storage', timeTrackerNewService]);

  function timeTrackerNewService($q, $http, CONSTANT, storage) {
    return {
      getOnLoadProjectNameService: getOnLoadProjectNameService,
      getOnLoadAllTaskService: getOnLoadAllTaskService,
      addTaskService: addTaskService,
      unbilledTaskModalService: unbilledTaskModalService,
      unbilledTaskModalSaveService: unbilledTaskModalSaveService,
      playPauseResetTimerService: playPauseResetTimerService,
      unbilledTaskDeleteService: unbilledTaskDeleteService
    };

    //==================================================== start of getOnLoadProjectNameService ==============
    function getOnLoadProjectNameService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/timeTrackerNew/getOnLoadProjectNameRoute',
        params: {
          emp_id: param.emp_id
        }

      }).then(responseData).catch(catchError);
    };
    //===================================================== end of getOnLoadProjectNameService ==================

    //=============================================== start of getOnLoadAllTaskService =======================
    function getOnLoadAllTaskService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/timeTrackerNew/getOnLoadAllTaskRoute',
        params: {
          emp_id: param.emp_id
        }

      }).then(responseData).catch(catchError);
    };
    //====================================================== end of getOnLoadAllTaskService =======================

    //========================================================== start of addTaskService =======================
    function addTaskService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/timeTrackerNew/addTaskRoute',
        params: {
          emp_id: param.emp_id,
          project_id: param.project_id,
          tracker_date: param.tracker_date,
          execution_date: param.execution_date,
          created_on: param.created_on,
          created_by: param.created_by,
          est_hrs: param.est_hrs,
          est_mins: param.est_mins,
          handover_id: param.handover_id,
          handover_type: param.handover_type,
          recurring_task: param.recurring_task,
          comments: param.commnents,
          page_flag: param.page_flag,
        }

      }).then(responseData).catch(catchError);
    };
    //========================================================== end of addTaskService =======================

    //=============================================== start of unbilledTaskModalService =======================
    function unbilledTaskModalService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/timeTrackerNew/unbilledTaskModalRoute',
        params: {
          emp_id: param.emp_id,
          project_id: param.project_id,
          time_tracker_task_id: param.time_tracker_task_id
        }

      }).then(responseData).catch(catchError);
    };
    //====================================================== end of unbilledTaskModalService =======================

    //=============================================== start of unbilledTaskModalSaveService =======================
    function unbilledTaskModalSaveService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/timeTrackerNew/unbilledTaskModalSaveRoute',
        params: {
          time_tracker_task_id: param.time_tracker_task_id,
          project_id: param.project_id,
          emp_id: param.emp_id,
          unbilledDeliveryId: param.unbilledDeliveryId,
          unbilledTaskId: param.unbilledTaskId,
          unbilledDeliveryName: param.unbilledDeliveryName,
          unbilledTaskName: param.unbilledTaskName,
          unbilled_task_peer_rework_model: param.unbilled_task_peer_rework_model,
          unbilled_task_weekend_hours_model: param.unbilled_task_weekend_hours_model,
          unbilledCommentsModel: param.unbilledCommentsModel,
          peer_name: param.peer_name,
          peer_id: param.peer_id,
          unbilledServiceName: param.unbilledServiceName,
          unbilledCategoryId: param.unbilledCategoryId,
          unbilledProjectDeliverableId: param.unbilledProjectDeliverableId,
          unbilledEstHrsModel: param.unbilledEstHrsModel,
          unbilledEstMinModel: param.unbilledEstMinModel,
          unbilledClientId: param.unbilledClientId,
          unbilledExeQuantityModel: param.unbilledExeQuantityModel,
          formatted_unbilled_task_date: param.formatted_unbilled_task_date
        }

      }).then(responseData).catch(catchError);
    };
    //====================================================== end of unbilledTaskModalSaveService =======================

    //=============================================== start of playPauseResetTimerService =======================
    function playPauseResetTimerService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/timeTrackerNew/playPauseResetTimerRoute',
        params: {
          emp_id: param.emp_id,
          string: param.string,
        }


      }).then(responseData).catch(catchError);
    };
    //====================================================== end of playPauseResetTimerService =======================

    //==================================================== start of unbilledTaskDeleteService ==============
    function unbilledTaskDeleteService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/timeTrackerNew/unbilledTaskDeleteRoute',
        params: {
          time_tracker_task_id: param.time_tracker_task_id,
          emp_id: param.emp_id
        }

      }).then(responseData).catch(catchError);
    };
    //===================================================== end of unbilledTaskDeleteService ==================

    function responseData(response) {
      return response.data;
    };

    function catchError(response) {
      return $q.reject('Error retrieving getClusterMetrics. (HTTP status: ' + response.status + ')');
    };
  }; // end of timeTrackerNewService
  //========================================================== end of timeTrackerNewService =======================
})();
