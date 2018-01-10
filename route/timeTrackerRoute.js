var express = require('express');
var timeTracker = express();
var sql = require('mssql');
var dbconfig = require('../config/dbConfig');
var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

timeTracker.get('/', function(req, res, next) {
  var request = new sql.Request(dbconfig);
  request.input('employee_code', req.query.emp_id);
  console.log(req.query);
  // request.input('project_flag', '' );
  // request.input('project_id','')
  // request.input('deliverable_id','')
  request.execute('NEW_TIME_TRACKER_get_project_list', function(err, result) {

    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);
    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });
});

timeTracker.get('/timedProjects', function(req, res, next) {
  var request = new sql.Request(dbconfig);
  request.input('P_employee_id', req.query.emp_id);
  request.execute('NEW_Time_Tracker_My_Task_List', function(err, result) {

    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);
    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });
});

timeTracker.post('/quickBill', function(req, res, next) {
  console.log("In quickBill() route");
  console.log("time_tracker_task_id>>" + req.body.time_tracker_task_id);
  console.log("project_id>>" + req.body.project_id);
  console.log("employee_id>>" + req.body.employee_id);
  console.log("task_id>>" + req.body.task_id);
  console.log("project_deliverable_id>>" + req.body.project_deliverable_id);
  console.log("executed_hours>>" + req.body.executed_hours);
  console.log("comments>>" + req.body.comments);
  console.log("weekend_hours>>" + req.body.weekend_hours);
  console.log("peer_rework>>" + req.body.peer_rework);
  console.log("executed_quantity>>" + req.body.executed_quantity);
  console.log("rework_for>>" + req.body.rework_for);
  console.log("execution_date>>" + req.body.execution_date);
  console.log("P_Recurring_Task>>" + req.body.P_Recurring_Task);


  var request = new sql.Request(dbconfig);
  request.input('time_tracker_task_id', req.body.time_tracker_task_id);
  request.input('project_id', req.body.project_id);
  request.input('employee_id', req.body.employee_id);
  request.input('task_id', req.body.task_id);
  request.input('project_deliverable_id', req.body.project_deliverable_id);
  request.input('executed_hours', req.body.executed_hours);
  request.input('comments', req.body.comments);
  request.input('weekend_hours', req.body.weekend_hours);
  request.input('peer_rework', req.body.peer_rework);
  request.input('executed_quantity', req.body.executed_quantity);
  request.input('rework_for', req.body.rework_for);
  request.input('execution_date', req.body.execution_date);
  request.input('P_Recurring_Task', req.body.P_Recurring_Task);
  request.input('p_client_id', req.body.P_client_id);
  request.input('p_estimated_hours', req.body.P_est_hours);
  request.input('p_estimated_mins', req.body.P_est_mins);

  request.execute('NEW_TIME_TRACKER_QuickBill ', function(err, result) {

    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);


    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });
  console.log("Out of quickBill() route");
});


timeTracker.get('/addTimedProjects', function(req, res, next) {
  var request = new sql.Request(dbconfig);
  console.log("proj");
  console.log(req.query.task_date);
  console.log(req.query.proj_id);
  console.log(req.query.emp_id);
  request.input('P_project_id', req.query.proj_id);
  request.input('P_employee_id', req.query.emp_id);
  request.input('P_time_tracker_date', req.query.task_date);
  request.input('P_execution_date', formatted);
  request.input('P_created_on', formatted);
  request.input('P_created_by', req.query.emp_id);
  request.input('P_estimated_hours', req.query.est_hrs);
  request.input('P_estimated_mins', req.query.est_mins);
  request.input('P_handover_id', '');
  request.input('P_handover_type', '');
  request.input('P_Recurring_Task', req.query.recurring);
  request.input('P_comments', '');
  request.input('P_Page_Flag', 'TIME TRACKER');


  request.execute('NEW_Time_Tracker_Add_Task', function(err, result) {

    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);


    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });


});


timeTracker.get('/deliverable', function(req, res, next) {
  var request = new sql.Request(dbconfig);

  console.log("req.query.project_id>>" + req.query.project_id);
  console.log("req.query.time_tracker_task_id>>" + req.query.time_tracker_task_id);

  request.input('project_id', req.query.project_id);
  request.input('user_id', req.query.emp_id);
  request.input('time_tracker_task_id', req.query.time_tracker_task_id);

  request.execute('NEW_TIME_TRACKER_edit_projects', function(err, result) {

    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);


    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });

});

timeTracker.get('/playpause', function(req, res, next) {
  var request = new sql.Request(dbconfig);
  console.log("P_employee_id>>" + req.query.P_employee_id);
  console.log("P_string>>" + req.query.P_string);
  request.input('P_employee_id', req.query.P_employee_id);
  request.input('P_string', req.query.P_string);

  request.execute('NEW_Time_Tracker_executed_hours_upd', function(err, result) {

    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);


    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });

});



timeTracker.get('/billedActivities', function(req, res, next) {
  console.log("I recieved a GET Request billedActivities");
  var request = new sql.Request(dbconfig);
  request.input('employee_id', req.query.employee_id);
  request.input('curr_date', req.query.curr_date);
  request.input('cfds_id', req.query.cfds_id);

  request.execute('NEW_TIME_TRACKER_get_billed_project_OnLoad ', function(err, result) {
    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);
    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });
});



timeTracker.get('/removeTask', function(req, res, next) {
  var request = new sql.Request(dbconfig);

  request.input('time_tracker_task_id', req.query.P_time_tracker_task_id);
  request.input('employee_id', req.query.P_employee_id);

  request.execute('NEW_TIME_TRACKER_Delete_Task', function(err, result) {

    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);


    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });

});

timeTracker.get('/editData', function(req, res, next) {
  console.log("I recieved a GET Request billedActivities");
  var request = new sql.Request(dbconfig);
  request.input('project_task_id', req.query.project_task_id);
  request.input('project_id', req.query.project_id);
  request.input('employee_id', req.query.employee_id);

  request.execute('NEW_TIME_TRACKER_edit_billed_project ', function(err, result) {
    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);
    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });
});

timeTracker.post('/save', function(req, res, next) {
  console.log("I recieved a POST Request save");

  var parsedParameters = JSON.parse(req.query.rowObj);
  console.log("parsedParameters >>" + parsedParameters);
  console.log("project_task_id>>" + parsedParameters.project_task_id);
  console.log("project_id>>" + parsedParameters.selectedProject?parsedParameters.selectedProject:"0");
  console.log("deliverable_id>>" + parsedParameters.selectedDeliverable?parsedParameters.selectedDeliverable:"0");
  console.log("task_id>>" + parsedParameters.selectedTask);
  console.log("executed_hours>>" + parsedParameters.executed_hours);
  console.log("weekend_hours>>" + parsedParameters.isWeekend);
  console.log("peer_rework>>" + parsedParameters.isPeerRework);
  console.log("insert_update_flag>>" + req.query.insert_update_flag);
  console.log("client_id>>" + parsedParameters.client_id);
  console.log("execution_date>>" + parsedParameters.execution_date);
  console.log("comments>>" + parsedParameters.description);
  console.log("selectedPeerName>>" + parsedParameters.selectedPeerName);
  console.log("executed_quantity" + parsedParameters.executed_quantity);

  var request = new sql.Request(dbconfig);
  var rework_for = [];
  request.input("employee_id", req.query.user_id);
  request.input("project_task_id", parsedParameters.project_task_id);
  request.input("project_id", parsedParameters.selectedProject);
  request.input("deliverable_id", parsedParameters.selectedDeliverable);
  request.input("task_id", parsedParameters.selectedTask);
  request.input("executed_hours", parsedParameters.executed_hours);
  request.input("weekend_hours", parsedParameters.isWeekend);
  request.input("peer_rework", parsedParameters.isPeerRework);
  request.input("insert_update_flag", req.query.insert_update_flag);
  request.input("client_id", parsedParameters.client_id);
  request.input("execution_date", parsedParameters.execution_date);
  request.input("comments", parsedParameters.description);

  if (typeof parsedParameters.selectedPeerName === 'undefined') {
    rework_for = 0;
  } else {
    rework_for = parsedParameters.selectedPeerName.employee_id;
  }
  console.log("rework_for>>" + rework_for);
  request.input("rework_for", rework_for);
  request.input("executed_quantity", parsedParameters.executed_quantity);

  request.execute('TIME_TRACKER_billed_project ', function(err, result) {
    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);
    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });
});

timeTracker.get('/handover', function(req, res, next) {
  console.log("I recieved a GET Request handover");
  var request = new sql.Request(dbconfig);
  request.input('user_id', req.query.user_id);

  request.execute('TIME_TRACKER_GetHandoverDataForTimeTracker ', function(err, result) {
    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);
    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });
});

timeTracker.post('/saveHandover', function(req, res, next) {
  console.log("I recieved a GET Request saveHandover");
  var request = new sql.Request(dbconfig);
  request.input('employee_id', req.body.user_id);
  request.input('handover_insert_str', req.body.handoverStr);

  request.execute('TIME_TRACKER_SaveHandover ', function(err, result) {
    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);
    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });
});

timeTracker.get('/save_details', function(req, res, next) {
  var request = new sql.Request(dbconfig);
  var peerId = 0;
  console.log("req.query.P_isWeekendHours>>" + req.query.P_isWeekendHours);
  request.input('P_time_tracker_task_id', req.query.P_time_tracker_task_id);
  request.input('P_project_id', req.query.P_project_id);
  request.input('P_employee_id', req.query.P_employee_id);
  request.input('P_deliverable_id', req.query.P_deliverable_id);
  request.input('P_task_id', req.query.P_task_id);
  request.input('P_deliverable_name', req.query.P_deliverable_name)
  request.input('P_task_name', req.query.P_task_name);
  request.input('P_isPeerRework', req.query.P_isPeerRework);
  request.input('P_isWeekendHours', req.query.P_isWeekendHours);
  request.input('P_comments', req.query.P_comments);
  request.input('P_peer_name', req.query.P_peer_name);

  if (!req.query.P_peer_id) {
    peerId = 0;
  } else {
    peerId = req.query.P_peer_id;
  }
  console.log("peerId>>" + peerId+" >> comment >> "+req.query.P_comments);
  request.input('P_peer_id', peerId);
  request.input('P_selected_task_service_line', req.query.P_selected_task_service_line);
  request.input('P_category_id', req.query.P_category_id);
  request.input('P_project_deliverable_id', req.query.P_project_deliverable_id);
  request.input('P_estimated_hours', req.query.P_est_hours);
  request.input('P_estimated_mins', req.query.P_est_mins);
  request.input('p_client_id', req.query.P_client_id);
  request.input('p_executed_quantity', req.query.P_quantity);
  request.input('p_time_tracker_date',req.query.p_timeTDate);

  request.execute('NEW_TIME_TRACKER_Save_Task', function(err, result) {
    if (err) {
      console.log('Err>>' + err);
      sql.close();
      res.json(result);
    } else {
      console.log(result.recordsets.length);
      //console.log(result);
      sql.close();
      res.json(result);
    }
    next();
  });
});

module.exports = timeTracker;
