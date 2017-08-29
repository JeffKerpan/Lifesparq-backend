const express = require('express');
const router = express.Router();
const queries = require('../db/queries.js');
const bcrypt = require('bcrypt');
const parse = require('csv-parse');
const aws = require('aws-sdk');
const tokens = require('../db/helperFunctions/tokens.js');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  return next();
});

router.post('/compare', function (req, res, next) {
  let submittedUsername = req.body.emailAddress;
  let submittedPassword = req.body.password;
  queries.getCoach(submittedUsername, function (err, result) {
    if (err) {
      res.json({
        error: true,
        message: 'Sorry, we didn\'t recognize that email address or password.'
      });
    } else {
      let hash = result[0].password;
      bcrypt.compare(submittedPassword, hash, function(err, response) {
        if (response) {
          var myToken = tokens.generateCoachToken(submittedUsername, result[0].teamId);
          res.status(200).json({
            token: myToken
          });
        } else {
          responseObject.success = false;
          res.send(responseObject);
        }
      });
    }
  })
})

router.get('/wholeteam', expressJwt({secret: process.env.JWT_KEY}), function(req, res, next) {
  if (req.user.coach) {
    queries.getTeam(req.user.teamId, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result);
      }
    })
  } else res.status(403).send(false);

})

module.exports = router;
