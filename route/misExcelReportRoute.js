var express = require('express');
var misExcelReport = express();
var sql = require('mssql');
var dbconfig = require('../config/dbConfig');

//=================================== start of misExcelReport ===================================
misExcelReport.get('/getMisExcelReportRoute', function(req, res) {

  var request = new sql.Request(dbconfig);

  request.input("employee_id", req.query.user_id);
  request.execute('MIS_Ic_Report', function(err, result) {
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
//=================================== end of misExcelReport ===================================

module.exports = misExcelReport;
