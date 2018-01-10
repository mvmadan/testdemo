(function() {

  // workflow.factory('Excel',function($window){
  //   var uri='data:application/vnd.ms-excel;base64,',
  // 		template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
  // 		base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
  // 		format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
  // 	return {
  // 		tableToExcel:function(tableId,worksheetName){
  // 			var table=$(tableId),
  // 				ctx={worksheet:worksheetName,table:table.html()},
  // 				href=uri+base64(format(template,ctx));
  // 			return href;
  // 		}
  // 	};
  // });

  workflow.factory('complianceReportService', ['$q', '$http', 'CONSTANT', 'storage', complianceReportService]);
  //============================================ start of complianceReportService =======================
  function complianceReportService($q, $http, CONSTANT, storage) {
    return {
      getOnLoadComplianceReportService: getOnLoadComplianceReportService,
      getTableComplianceReportService: getTableComplianceReportService
    };
    //============================================ start of getOnLoadComplianceReportService =======================
    function getOnLoadComplianceReportService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/complianceReport/getOnLoadComplianceReportRoute',
        params: {
          user_id: param.user_id,
        }
      }).then(responseData).catch(catchError);
    };
    //====================================== end of getOnLoadComplianceReportService =======================

    //======================================== start of getTableComplianceReportService =======================
    function getTableComplianceReportService(param) {

      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/complianceReport/getTableComplianceReportRoute',
        params: {
          user_id: param.user_id,
          client: param.client,
          client_team: param.client_team,
          team: param.team,
          region: param.region,
          service: param.service,
          type: param.type
        }
      }).then(responseData).catch(catchError);

    };
    //======================================== end of getTableComplianceReportService =======================
    function responseData(response) {
      return response.data;
    };

    function catchError(response) {
      return $q.reject('Error retrieving getClusterMetrics. (HTTP status: ' + response.status + ')');
    };
  }; // end of complianceReportService
  //============================================= end of complianceReportService =======================

})();
