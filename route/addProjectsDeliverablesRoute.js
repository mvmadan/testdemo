var express = require('express');
var addProjectsDeliverables = express();
var sql = require('mssql');
var dbconfig = require('../config/dbConfig');

//------------------------------------- start of onLoadAddProjectsDeliverables ---------------------------------------------
addProjectsDeliverables.get('/onLoadAddProjectsDeliverablesRoute', function(req, res) {

  var request = new sql.Request(dbconfig);

  request.input("user_id", req.query.user_id);
  request.execute('FLOW_PLUS_Report_Filters ', function(err, result) {
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
//-------------------------------------end of onLoadAddProjectsDeliverables ---------------------------------------------

//------------------------------------- start of onViewAddProjectsDeliverablesRoute --------------------------------------

addProjectsDeliverables.get('/onViewAddProjectsDeliverablesRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input('business_type_id', req.query.type_of_business_id);
  request.input('client_id', req.query.client_id);
  request.execute('FLOW_PLUS_Add_Deliverable_Load_Page', function(err, result) {
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
//-------------------------------------end of onViewAddProjectsDeliverablesRoute --------------------------------------

//-----------------------------------start of insertDataAddProjectsDeliverablesRoute ------------------------------------

addProjectsDeliverables.get('/insertDataAddProjectsDeliverablesRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input('user_id', req.query.user_id);
  request.input('additional_deliverables', req.query.finalString);
  console.log("user_id>>>>  " + req.query.user_id);
  console.log("In Route finalString>>>>  " + req.query.finalString);
  console.log("FLOW_PLUS_Add_Deliverables EXECUTED SUCESSFULLY");

  request.execute('FLOW_PLUS_Add_Deliverables', function(err, result) {
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
//-------------------------------end of insertDataAddProjectsDeliverablesRoute ----------------------------------
module.exports = addProjectsDeliverables;
