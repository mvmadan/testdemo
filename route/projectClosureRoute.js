var express = require('express');
var projectClosure = express();
var sql = require('mssql');
var dbconfig = require('../config/dbConfig');

//------------------------------------- start of getOnLoadProjectClosureRoute ---------------------------------------------
projectClosure.get('/getOnLoadProjectClosureRoute', function(req, res) {

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
//-------------------------------------end of getOnLoadProjectClosureRoute ---------------------------------------------

//------------------------------------- start of getViewProjectClosureRoute ---------------------------------------------
projectClosure.get('/getViewProjectClosureRoute', function(req, res) {

  var request = new sql.Request(dbconfig);

  request.input("service", req.query.service);
  request.input("client", req.query.client);
  request.input("client_team", req.query.client_team);
  request.input("team", req.query.team);
  request.input("region", req.query.region);
  request.input("project_no_name", req.query.project_no_name);
  request.input("user_id", req.query.user_id);
  request.input("pic", req.query.pic);
  request.execute('FLOW_PLUS_Proj_Due_Closure_Get_Data ', function(err, result) {
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
//-------------------------------------end of getViewProjectClosureRoute ---------------------------------------------

//-------------------------------------start of insertDataProjectClosureRoute ---------------------------------------------
projectClosure.get('/insertDataProjectClosureRoute', function(req, res) {

  var request = new sql.Request(dbconfig);

  request.input("user_id", req.query.user_id);
  request.input("project_ids", req.query.finalProjectIds);
  request.execute('FLOW_PLUS_Proj_Due_Closure_Update ', function(err, result) {
    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log(result);
    }
  });
});
//-------------------------------------end of insertDataProjectClosureRoute ---------------------------------------------

module.exports = projectClosure;
