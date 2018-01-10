(function() {

  workflow.factory('misExcelReportService', ['$q', '$http', 'CONSTANT', 'storage', misExcelReportService]);

  function misExcelReportService($q, $http, CONSTANT, storage) {
    return {
      getMisExcelReportService: getMisExcelReportService
    };

    //============================================ start of getMisExcelReportService ============================================
    function getMisExcelReportService(param) {
      console.log(param.user_id);
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/misExcelReport/getMisExcelReportRoute',
        params: {
          user_id: param.user_id,
        }
      }).then(responseData).catch(catchError);
    };
    //============================================ end of getMisExcelReportService ============================================

    function responseData(response) {
      return response.data;
    };

    function catchError(response) {
      return $q.reject('Error retrieving getClusterMetrics. (HTTP status: ' + response.status + ')');
    };
  }; // end of misExcelReportService
  //============================================ end of misExcelReportService ======================================

})();
