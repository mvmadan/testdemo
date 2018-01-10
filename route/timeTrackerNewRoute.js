var express = require('express');
var timeTrackerNew = express();
var sql = require('mssql');
var dbconfig = require('../config/dbConfig');
var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

// =============================================== start of getOnLoadProjectNameRoute =======================
timeTrackerNew.get('/getOnLoadProjectNameRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input("employee_code", req.query.emp_id);
  request.execute('NEW_TIME_TRACKER_get_project_list ', function(err, result) {
    if (err) {
      console.log('getOnLoadProjectNameRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result getOnLoadProjectNameRoute===>>>" + result);
    }
  });
});
//========================================================== end of getOnLoadProjectNameRoute ===============

// =============================================== start of getOnLoadAllTaskRoute =======================
timeTrackerNew.get('/getOnLoadAllTaskRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input("P_employee_id", req.query.emp_id);
  request.execute('NEW_Time_Tracker_My_Task_List ', function(err, result) {
    if (err) {
      console.log('getOnLoadAllTaskRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result getOnLoadAllTaskRoute===>>>" + result);
    }
  });
});
//========================================================== end of getOnLoadAllTaskRoute ===============

// =============================================== start of addTaskRoute =======================
timeTrackerNew.get('/addTaskRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input("P_project_id", req.query.project_id);
  request.input("P_employee_id", req.query.emp_id);
  request.input("P_time_tracker_date", req.query.tracker_date);
  request.input("P_execution_date", req.query.execution_date);
  request.input("P_created_on", req.query.created_on);
  request.input("P_created_by", req.query.created_by);
  request.input("P_estimated_hours", req.query.est_hrs);
  request.input("P_estimated_mins", req.query.est_mins);
  request.input("P_handover_id", req.query.handover_id);
  request.input("P_handover_type", req.query.handover_type);
  request.input("P_Recurring_Task", req.query.recurring_task);
  request.input("P_comments", req.query.comments);
  request.input("P_Page_Flag", req.query.page_flag);

  request.execute('NEW_Time_Tracker_Add_Task ', function(err, result) {
    if (err) {
      console.log('addTaskRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result addTaskRoute===>>>" + result);
    }
  });
});
//========================================================== end of addTaskRoute ===============

// =============================================== start of unbilledTaskModalRoute =======================
timeTrackerNew.get('/unbilledTaskModalRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input("project_id", req.query.project_id);
  request.input("user_id", req.query.emp_id);
  request.input("time_tracker_task_id", req.query.time_tracker_task_id);

  request.execute('NEW_TIME_TRACKER_edit_projects ', function(err, result) {
    if (err) {
      console.log('unbilledTaskModalRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result unbilledTaskModalRoute===>>>" + result);
    }
  });
});
//========================================================== end of unbilledTaskModalRoute ===============

// =============================================== start of unbilledTaskModalSaveRoute =======================
timeTrackerNew.get('/unbilledTaskModalSaveRoute', function(req, res) {
  console.log('==>>>',req.query.unbilledProjectDeliverableId);

  var request = new sql.Request(dbconfig);
  request.input("P_time_tracker_task_id", req.query.time_tracker_task_id);
  request.input("P_project_id", req.query.project_id);
  request.input("P_employee_id", req.query.emp_id);
  request.input("P_deliverable_id", req.query.unbilledDeliveryId);
  request.input("P_task_id", req.query.unbilledTaskId);
  request.input("P_deliverable_name", req.query.unbilledDeliveryName);
  request.input("P_task_name", req.query.unbilledTaskName);
  request.input("P_isPeerRework", req.query.unbilled_task_peer_rework_model);
  request.input("P_isWeekendHours", req.query.unbilled_task_weekend_hours_model);
  request.input("P_comments", req.query.unbilledCommentsModel);
  request.input("P_peer_name", req.query.peer_name);
  request.input("P_peer_id", req.query.peer_id);
  request.input("P_selected_task_service_line", req.query.unbilledServiceName);
  request.input("P_category_id", req.query.unbilledCategoryId);
  request.input("P_project_deliverable_id", req.query.unbilledProjectDeliverableId);
  request.input("P_estimated_hours", req.query.unbilledEstHrsModel);
  request.input("P_estimated_mins", req.query.unbilledEstMinModel);
  request.input("p_client_id", req.query.unbilledClientId);
  request.input("p_executed_quantity", req.query.unbilledExeQuantityModel);
  request.input("p_time_tracker_date", req.query.formatted_unbilled_task_date);

  console.log('>>>>>',req.query.peer_name,req.query.peer_id);

  request.execute('NEW_TIME_TRACKER_Save_Task ', function(err, result) {
    if (err) {
      console.log('unbilledTaskModalSaveRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result unbilledTaskModalSaveRoute===>>>" + result);
    }
  });
});
//========================================================== end of unbilledTaskModalSaveRoute ===============

// =============================================== start of playPauseResetTimerRoute =======================
timeTrackerNew.get('/playPauseResetTimerRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input("P_employee_id", req.query.emp_id);
  request.input("P_string", req.query.string);
  console.log('req.query.string==>>',req.query.string);

  request.execute('NEW_Time_Tracker_executed_hours_upd', function(err, result) {
    if (err) {
      console.log('playPauseResetTimerRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result playPauseResetTimerRoute===>>>" + result);
    }
  });
});
//========================================================== end of playPauseResetTimerRoute ===============

// =============================================== start of unbilledTaskDeleteRoute =======================
timeTrackerNew.get('/unbilledTaskDeleteRoute', function(req, res) {

  var request = new sql.Request(dbconfig);
  request.input("time_tracker_task_id", req.query.time_tracker_task_id);
  request.input("employee_id", req.query.emp_id);
  request.execute('NEW_TIME_TRACKER_Delete_Task', function(err, result) {
    if (err) {
      console.log('unbilledTaskDeleteRoute Err===>>>' + err);
      sql.close();
      res.json(result);
    } else {
      sql.close();
      res.json(result);
      console.log("result unbilledTaskDeleteRoute===>>>" + JSON.stringify(result));
    }
  });
});
//========================================================== end of unbilledTaskDeleteRoute ===============



module.exports = timeTrackerNew;
