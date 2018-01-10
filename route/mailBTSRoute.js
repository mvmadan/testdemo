var express = require('express');
var mailBTS = express();
var sql = require('mssql');
var dbconfig = require('../config/dbConfig');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var smtpTransport = require('nodemailer-smtp-transport');
var multipartyMiddleware = require('connect-multiparty')();

//=================================== start of getMailBTSRoute ===================================
mailBTS.get('/getMailBTSRoute', function(req, res) {

  var request = new sql.Request(dbconfig);

  request.execute('FLOW_PLUS_HNP_BTS_REPORT', function(err, result) {
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
//=================================== end of getMailBTSRoute ===================================

//=================================== start of getMailBTSRequestRoute ===================================
var smtpTransport = nodemailer.createTransport(smtpTransport({
  service: "gmail",
  auth: {
    user: "ansarisuhail2580@gmail.com",
    pass: "suhail12345*"
  }
}));

mailBTS.get('/getMailBTSRequestRoute', multipartyMiddleware, function(req, res) {
  console.log("=====>>>>" + req.excelfile);

  var mailOptions = {
    to: req.query.to,
    subject: req.query.subject,
    attachments: [{
      filename: 'Daily_BTS_Report.csv',
      path: 'C:/Users/ansari.m2/Downloads/Daily_BTS_Report.csv' // stream this file
    }]
  }
  console.log("mailOptions===>>>" + JSON.stringify(mailOptions));

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log("ERROR ===> " + error);
      res.end("error");
    } else {
      console.log("Message sent sucessfully");
      res.end("sent");
    }
  });
});
//=================================== end of getMailBTSRequestRoute ===================================
module.exports = mailBTS;
