var express = require('express');
var POTracker = express();
var sql = require('mssql');
var dbconfig = require('../config/dbConfig');

// ========================================================== start of getOnLoadPOTrackerRoute =======================
POTracker.get('/getOnLoadPOTrackerRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input("user_id", req.query.user_id);
  request.input("zoho_client_id", req.query.client_id);
  request.input("proposal_no", req.query.proposal_no);
  request.execute('PO_TRACKER_OnLoad ', function(err, result) {
    if (err) {
      console.log('getOnLoadPOTrackerRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result getOnLoadPOTrackerRoute===>>>" + result);
    }
  });
});
//========================================================== end of getOnLoadPOTrackerRoute ===============

// ========================================================== start of getExcelRoute =======================
POTracker.get('/getExcelRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.execute('PO_TRACKER_excel_export', function(err, result) {
    if (err) {
      console.log('getExcelRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result getExcelRoute===>>>" + result);
    }
  });
});
//========================================================== end of getExcelRoute =======================

// ========================================================== start of getAddModifyVendorOnloadRoute =======================
POTracker.get('/getAddModifyVendorOnloadRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.execute('PO_TRACKER_add_modify_vendor_OnLoad ', function(err, result) {
    if (err) {
      console.log('getAddModifyVendorOnloadRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result getAddModifyVendorOnloadRoute===>>>" + result);
    }
  });
});
//========================================================== end of getAddModifyVendorOnloadRoute =======================

// ========================================================== start of getAddModifyVendorRoute =======================
POTracker.get('/getAddModifyVendorRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input("vendor_id", req.query.vendor_id);
  request.input("vendor_name", req.query.vendor_name);
  request.input("vendor_address", req.query.vendor_address);
  request.input("vendor_city", req.query.vendor_city);
  request.input("vendor_country", req.query.vendor_country);
  request.input("vendor_phone", req.query.vendor_phone);
  request.input("vendor_email", req.query.vendor_email);
  request.input("user_id", req.query.user_id);
  request.execute('PO_TRACKER_add_modify_vendor ', function(err, result) {
    if (err) {
      console.log('getAddModifyVendorRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result getAddModifyVendorRoute===>>>" + result);
    }
  });
});
//========================================================== end of getAddModifyVendorRoute =======================

// ========================================================== start of getPaidSubmitRoute =======================
POTracker.get('/getPaidSubmitRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input("po_id", req.query.po_id);
  request.input("po_no", req.query.po_no);
  request.input("proposal_no", req.query.proposal_no);
  request.input("amount", req.query.amount);
  request.input("payment_date", req.query.payment_date);
  request.input("vendor_po", req.query.vendor_po);
  request.input("comments", req.query.comments);
  request.input("user_id", req.query.user_id);
  request.execute('PO_TRACKER_add_paid_order', function(err, result) {
    if (err) {
      console.log('getPaidSubmitRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result getPaidSubmitRoute===>>>" + result);
    }
  });
}); //end of getPaidSubmitRoute
//========================================================== end of getPaidSubmitRoute =======================

// ========================================================== start of getCancelRoute =======================
POTracker.get('/getCancelRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input("user_id", req.query.user_id);
  request.input("po_id", req.query.cancel_po_id);
  request.execute('PO_TRACKER_cancel_PO', function(err, result) {
    if (err) {
      console.log('getCancelRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result getCancelRoute===>>>" + result);
    }
  });
});
//========================================================== end of getCancelRoute =======================

// ========================================================== start of getFinalSubmitRoute =======================
POTracker.get('/getFinalSubmitRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input("user_id", req.query.user_id);
  request.input("proposal_no", req.query.proposal_no);
  request.input("billing_entity_id", req.query.billing_entity_id);
  request.input("billing_entity_name", req.query.billing_entity_name);
  request.input("string", req.query.string);
  request.execute('PO_TRACKER_add_modify_PO', function(err, result) {
    if (err) {
      console.log('getFinalSubmitRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result getFinalSubmitRoute===>>>" + result);
    }
  });
});
//========================================================== end of getFinalSubmitRoute =======================
module.exports = POTracker;
