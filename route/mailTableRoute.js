var express = require('express');
var mailTable = express();
var sql = require('mssql');
var dbconfig = require('../config/dbConfig');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var smtpTransport = require('nodemailer-smtp-transport');

//=================================== start of getMailTableRoute ===================================
mailTable.get('/getMailTableRoute', function(req, res) {

  var request = new sql.Request(dbconfig);

  request.execute('FLOW_PLUS_Add_Modify_Project_Mail', function(err, result) {
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
//=================================== end of getMailTableRoute ===================================

//=================================== start of getMailRequestRoute ===================================
var smtpTransport = nodemailer.createTransport(smtpTransport({
  service: "gmail",
  auth: {
    user: "ansarisuhail2580@gmail.com",
    pass: "suhail12345*"
  }
}));

mailTable.get('/getMailRequestRoute', function(req, res) {

  var mailOptions = {
    to: req.query.to,
    subject: req.query.subject,
    html: " <b>ADD PROJECT</b> <br> <table style='border-collapse: collapse;'><thead><tr><th style='border: 1px solid black;'> Sr No. </th> &nbsp;&nbsp;<th style='border: 1px solid black;'> Project No/Name </th> &nbsp;&nbsp;<th style='border: 1px solid black;'> Services offered </th >&nbsp;&nbsp; <th style='border: 1px solid black;'> Region	 </th> &nbsp;&nbsp;<th style='border: 1px solid black;'> Project type </th>&nbsp;&nbsp;<th style='border: 1px solid black;'> Client estimates </th>&nbsp;&nbsp;<th style='border: 1px solid black;'> Internal estimates </th ></tr> </thead>" +
      req.query.htmlStrAdd + "</table><br><br><br> <b>MODIFY PROJECT</b> <table style='border-collapse: collapse;'><thead><tr><th style='border: 1px solid black;'> Sr No. </th>&nbsp;&nbsp;<th style='border: 1px solid black;'> Project No/Name </th> &nbsp;&nbsp;<th style='border: 1px solid black;'> Fields </th> &nbsp;&nbsp;<th style='border: 1px solid black;'> From </th >&nbsp;&nbsp; <th style='border: 1px solid black;'> To </th> </thead>" +
      req.query.htmlStrModify + "</table>",
  }

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
//=================================== end of getMailRequestRoute ===================================
module.exports = mailTable;
