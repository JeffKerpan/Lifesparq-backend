const express = require('express');
const router = express.Router();
const queries = require('../db/queries.js');
const bcrypt = require('bcrypt');
const parse = require('csv-parse');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  return next();
});

router.post('/newUser', function (req, res, next) {
  bcrypt.hash(req.body.password, 11, function (err, hash) {
    queries.newUser(req.body.firstName, req.body.lastName, req.body.emailAddress, hash, function (err, result) {
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

router.post('/newCoach', function (req, res, next) {
  console.log(req.body);
  bcrypt.hash(req.body.password, 11, function (err, hash) {
    queries.newCoach(req.body.firstName, req.body.lastName, req.body.emailAddress, hash, req.body.teamId, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          message: 'success'
        });
      }
    });
  });
  if (req.body.file && req.body.file.length) {
    processSpreadsheet(req.body.file);
  }
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

router.post('/newTeam', function(req, res, next) {
  queries.newTeam(req.body.teamName, req.body.sport, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json({
        id: result
      });
    }
  })
})

processSpreadsheet = function(file) {
  console.log('anything');
  var output = [];
  var allUsers = [];

  var parser = parse({delimiter: ':'});

  parser.on('readable', function() {
    while (record = parser.read()) {
      if (record[0].match(/[a-z]/i)) {
        record = record.join(',').split(',').filter((word) => {
          return (word !== '');
        });
        output.push(record);
      }
    }
  });

  parser.on('error', function(err) {
    console.log(err.message);
  });

  parser.write(file);

  output.forEach((array) => {
    console.log(array);
  })

}

module.exports = router;
