(function() {

  workflow.factory('mailTableService', ['$q', '$http', 'CONSTANT', 'storage', mailTableService]);

  function mailTableService($q, $http, CONSTANT, storage) {
    return {
      getMailTableService: getMailTableService,
      getMailRequestService: getMailRequestService
    };

    //============================================ start of getMailTableService ============================================
    function getMailTableService() {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/mailTable/getMailTableRoute',
      }).then(responseData).catch(catchError);
    };
    //============================================ end of getMailTableService ============================================

    //============================================ start of getMailTableService ============================================
    function getMailRequestService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/mailTable/getMailRequestRoute',
        params: {
          to: param.to,
          subject: param.subject,
          htmlStrAdd: param.htmlStrAdd,
          htmlStrModify: param.htmlStrModify,
        }
      }).then(responseData).catch(catchError);
    };
    //============================================ end of getMailTableService ============================================

    function responseData(response) {
      return response.data;
    };

    function catchError(response) {
      return $q.reject('Error retrieving getClusterMetrics. (HTTP status: ' + response.status + ')');
    };
    //============================================ end of insertDataProjectClosureService ============================================

  }; // end of mailTableService
})();
