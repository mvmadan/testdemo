(function() {

  workflow.factory('addProjectsDeliverablesService', ['$q', '$http', 'CONSTANT', 'storage', addProjectsDeliverablesService]);

  function addProjectsDeliverablesService($q, $http, CONSTANT, storage) {
    return {
      getaddProjectsDeliverablesService: getaddProjectsDeliverablesService,
      getViewAddProjectsDeliverablesService: getViewAddProjectsDeliverablesService,
      insertDataAddProjectsDeliverablesService: insertDataAddProjectsDeliverablesService
    };

    //------------------------------------------ start of getaddProjectsDeliverablesService-------------------------------
    function getaddProjectsDeliverablesService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/addProjectsDeliverables/onLoadAddProjectsDeliverablesRoute',
        params: {
          user_id: param.user_id,
        }
      }).then(responseData).catch(catchError);
    };

    function responseData(response) {
      return response.data;
    };

    function catchError(response) {
      return $q.reject('Error retrieving getClusterMetrics. (HTTP status: ' + response.status + ')');
    };

    //------------------------------------------- end of getaddProjectsDeliverablesService ---------------------------

    //------------------------------------------ start of getViewAddProjectsDeliverablesService ------------------------

    function getViewAddProjectsDeliverablesService(param) {

      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/addProjectsDeliverables/onViewAddProjectsDeliverablesRoute',
        params: {
          type_of_business_id: param.type_of_business_id,
          client_id: param.client_id
        }
      }).then(responseData).catch(catchError);
    };

    //-------------------------------------- end of getViewAddProjectsDeliverablesService ---------------------------------

    //-------------------------------------- start of insertDataAddProjectsDeliverablesService -----------------------------

    function insertDataAddProjectsDeliverablesService(param) {

      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/addProjectsDeliverables/insertDataAddProjectsDeliverablesRoute',
        params: {
          user_id: param.user_id,
          finalString: param.finalString
        }
      }).then(responseData).catch(catchError);
    };
    //-------------------------------------- end of insertDataAddProjectsDeliverablesService -----------------------------

    function responseData(response) {
      return response.data;
    };

    function catchError(response) {
      return $q.reject('Error retrieving getClusterMetrics. (HTTP status: ' + response.status + ')');
    };

  };
})();
