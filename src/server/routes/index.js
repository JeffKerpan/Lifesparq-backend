const express = require('express');
const router = express.Router();
const queries = require('../db/queries.js');
const bcrypt = require('bcrypt');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  return next();
});

router.post('/new', function (req, res, next) {
  bcrypt.hash(req.body.password, 11, function (err, hash) {
    queries.newUser(req.body.firstName, req.body.lastName, req.body.emailAddress, hash, req.body.coach, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          message: 'success'
        });
      }
    });
  });
});

router.post('/compare', function (req, res, next) {
  let submittedUsername = req.body.emailAddress;
  let submittedPassword = req.body.password;
  let responseObject = {};
  queries.getUser('users', submittedUsername, function (err, result) {
    if (err) {
      res.json({
        error: true,
        message: 'Sorry, we didn\'t recognize that email address.'
      });
    } else {
      let hash = result[0].password;
      bcrypt.compare(submittedPassword, hash, function(err, response) {
        if (response) {
          responseObject.success = true;
          res.send(responseObject);
        } else {
          responseObject.success = false;
          res.send(responseObject);
        }
      });
    }
  });
})

module.exports = router;
