var express = require('express');
var complianceReport = express();
var sql = require('mssql');
var dbconfig = require('../config/dbConfig');

//================================ start of getOnLoadComplianceReportRoute =======================
complianceReport.get('/getOnLoadComplianceReportRoute', function(req, res) {

  var request = new sql.Request(dbconfig);

  request.input("user_id", req.query.user_id);
  request.execute('NEW_FLOW_PLUS_Report_Filters ', function(err, result) {
    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
    }
  });
});
//============================================== end of getOnLoadComplianceReportRoute =======================

//================================================== start of getTableComplianceReportRoute =======================
complianceReport.get('/getTableComplianceReportRoute', function(req, res) {

  var request = new sql.Request(dbconfig);

  request.input("user_id", req.query.user_id);
  request.input("client_id", req.query.client);
  request.input("client_team_id", req.query.client_team);
  request.input("team_id", req.query.team);
  request.input("client_region_id", req.query.region);
  request.input("cfds_id", req.query.service);
  request.input("type", req.query.type);
  request.execute('NEW_FLOW_PLUS_Compliance_Report_Data', function(err, result) {
    if (err) {
      console.log('Table Err>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      //res.xls(" ",result);
    }
  });
});
//========================================================== end of getTableComplianceReportRoute =======================
module.exports = complianceReport;
