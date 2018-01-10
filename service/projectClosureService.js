(function() {

  workflow.factory('projectClosureService', ['$q', '$http', 'CONSTANT', 'storage', projectClosureService]);

  function projectClosureService($q, $http, CONSTANT, storage) {
    return {
      getOnLoadProjectClosureService: getOnLoadProjectClosureService,
      getViewProjectClosureService: getViewProjectClosureService,
      insertDataProjectClosureService: insertDataProjectClosureService
    };

    //------------------------------------------ start of getOnLoadProjectClosureService-------------------------------
    function getOnLoadProjectClosureService(param) {
      // console.log("param.user_id>>>>" + param.user_id);
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/projectClosure/getOnLoadProjectClosureRoute',
        params: {
          user_id: param.user_id,
        }
      }).then(responseData).catch(catchError);
    };
    //------------------------------------------- end of getOnLoadProjectClosureService ---------------------------

    //------------------------------------------ start of getViewProjectClosureService-------------------------------
    function getViewProjectClosureService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/projectClosure/getViewProjectClosureRoute',
        params: {
          service: param.service,
          client: param.client,
          client_team: param.client_team,
          team: param.team,
          region: param.region,
          project_no_name: param.project_no_name,
          user_id: param.user_id,
          pic: param.pic,
        }
      }).then(responseData).catch(catchError);
    };
    //------------------------------------------- end of getViewProjectClosureService ---------------------------

    //------------------------------------------- start of insertDataProjectClosureService ---------------------------
    function insertDataProjectClosureService(param) {

      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/projectClosure/insertDataProjectClosureRoute',
        params: {
          user_id: param.user_id,
          finalProjectIds: param.finalProjectIds
        }
      }).then(responseData).catch(catchError);
    };

    function responseData(response) {
      return response.data;
    };

    function catchError(response) {
      return $q.reject('Error retrieving getClusterMetrics. (HTTP status: ' + response.status + ')');
    };
    //------------------------------------------- end of insertDataProjectClosureService ---------------------------

  }; // end of projectClosureService
})();
