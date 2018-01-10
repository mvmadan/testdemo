(function() {

  workflow.factory('mailBTSService', ['$q', '$http', 'CONSTANT', 'storage', mailBTSService]);

  function mailBTSService($q, $http, CONSTANT, storage) {
    return {
      getMailBTSService: getMailBTSService,
      getMailBTSRequestService: getMailBTSRequestService
    };

    //============================================ start of getMailBTSService ============================================
    function getMailBTSService() {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/mailBTS/getMailBTSRoute',
      }).then(responseData).catch(catchError);
    };
    //============================================ end of getMailBTSService ============================================

    //============================================ start of getMailBTSRequestService ==========================================
    function getMailBTSRequestService(param) {
      var excelfile = param.excelfile;
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/mailBTS/getMailBTSRequestRoute',
        params: {
          to: param.to,
          subject: param.subject,
          excelfile: param.excelfile,
        }
      }).then(responseData).catch(catchError);
    };
    //============================================ end of getMailBTSRequestService ============================================

    function responseData(response) {
      return response.data;
    };

    function catchError(response) {
      return $q.reject('Error retrieving getClusterMetrics. (HTTP status: ' + response.status + ')');
    };
    //============================================ end of mailBTSService ======================================
  }; // end of mailBTSService
})();
