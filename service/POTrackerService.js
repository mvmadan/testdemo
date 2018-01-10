(function() {

  workflow.factory('POTrackerService', ['$q', '$http', 'CONSTANT', 'storage', POTrackerService]);

  function POTrackerService($q, $http, CONSTANT, storage) {
    return {
      getOnLoadPOTrackerService: getOnLoadPOTrackerService,
      getAddModifyVendorOnloadService: getAddModifyVendorOnloadService,
      getAddModifyVendorService: getAddModifyVendorService,
      getPaidSubmitService: getPaidSubmitService,
      getCancelService: getCancelService,
      getFinalSubmitService: getFinalSubmitService,
      getExcelService: getExcelService
    };

    //========================================================== start of getOnLoadPOTrackerService =======================
    function getOnLoadPOTrackerService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/POTracker/getOnLoadPOTrackerRoute',
        params: {
          user_id: param.user_id,
          client_id: param.client_id,
          proposal_no: param.proposal_no,
        }

      }).then(responseData).catch(catchError);
    };
    //========================================================== end of getOnLoadPOTrackerService =======================

    //========================================================== start of getExcelService ====================
    function getExcelService() {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/POTracker/getExcelRoute'
      }).then(responseData).catch(catchError);
    };
    //========================================================== end of getExcelService =======================

    //========================================================== start of getAddModifyVendorOnloadService ====================
    function getAddModifyVendorOnloadService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/POTracker/getAddModifyVendorOnloadRoute',
        params: {
          user_id: param.user_id,
        }

      }).then(responseData).catch(catchError);
    };
    //========================================================== end of getAddModifyVendorOnloadService =======================

    //========================================================== start of getAddModifyVendorService ====================
    function getAddModifyVendorService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/POTracker/getAddModifyVendorRoute',
        params: {
          vendor_id: param.vendor_id,
          vendor_name: param.vendor_name,
          vendor_address: param.vendor_address,
          vendor_city: param.vendor_city,
          vendor_country: param.vendor_country,
          vendor_phone: param.vendor_phone,
          vendor_email: param.vendor_email,
          user_id: param.user_id
        }

      }).then(responseData).catch(catchError);
    };
    //========================================================== end of getAddModifyVendorService =======================

    //========================================================== start of getPaidSubmitService ====================
    function getPaidSubmitService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/POTracker/getPaidSubmitRoute',
        params: {
          po_id: param.po_id,
          po_no: param.po_no,
          proposal_no: param.proposal_no,
          amount: param.amount,
          payment_date: param.payment_date,
          vendor_po: param.vendor_po,
          comments: param.comments,
          user_id: param.user_id
        }
      }).then(responseData).catch(catchError);
    };
    //========================================================== end of getPaidSubmitService =======================

    //========================================================== start of getCancelService ====================
    function getCancelService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/POTracker/getCancelRoute',
        params: {
          cancel_po_id: param.cancel_po_id,
          user_id: param.user_id
        }
      }).then(responseData).catch(catchError);
    };
    //========================================================== end of getCancelService =======================

    //========================================================== start of getFinalSubmitService ====================
    function getFinalSubmitService(param) {
      return $http({
        method: 'GET',
        url: CONSTANT.API_URL + '/POTracker/getFinalSubmitRoute',
        params: {
          user_id: param.user_id,
          proposal_no: param.proposal_no,
          billing_entity_id: param.billing_entity_id,
          billing_entity_name: param.billing_entity_name,
          string: param.string
        }
      }).then(responseData).catch(catchError);
    };
    //========================================================== end of getFinalSubmitService =======================

    function responseData(response) {
      return response.data;
    };

    function catchError(response) {
      return $q.reject('Error retrieving getClusterMetrics. (HTTP status: ' + response.status + ')');
    };
  }; // end of POTrackerService
  //========================================================== end of POTrackerService =======================
})();
