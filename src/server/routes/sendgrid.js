const helper = require('sendgrid').mail;
const fromEmail = new helper.Email('test@example.com');
const toEmail = new helper.Email('dennis.nathan@gmail.com');
const subject = 'Sending with SendGrid is Fun';
const content = new helper.Content('text/plain', 'and easy to do anywhere, even with Node.js');
const mail = new helper.Mail(fromEmail, subject, toEmail, content);
const express = require('express');
const router = express.Router();
const queries = require('../db/queries.js');
const bcrypt = require('bcrypt');
const parse = require('csv-parse');
const aws = require('aws-sdk');
const helperFunctions = require('../db/helperFunctions.js');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  return next();
});

var sg = require('sendgrid')(process.env.SENDGRID_ADMIN_TO_USER_KEY);
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON()
});

router.post('/', function (req, res, next) {
  sg.API(request, function (error, response) {
    if (error) {
      console.log('Error response received');
    }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
  res.json({message: 'thing did!'})
})

module.exports = router;
