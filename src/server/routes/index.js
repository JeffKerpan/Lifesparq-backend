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

router.use(bodyParser.urlencoded({
  extended: true
}));
// router.use(expressJwt({ secret: process.env.JWT_KEY }).unless({path: ['/compare', '/newuser', '/newTeam', '/sign-s3', '/super/compare', '/mail/']}));

router.post('/newuser', function (req, res, next) {
  responseObject = {};
  bcrypt.hash(req.body.password, 11, function (err, hash) {
    queries.newUser(req.body.tableName, req.body.firstName, req.body.lastName, req.body.emailAddress, hash, req.body.teamId, req.body.profilePicture, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        var myToken = helperFunctions.generateToken(req.body.emailAddress, req.body.password);
        res.status(200).send(myToken);
      }
    });
  });
  if (req.body.file) {
    if (Array.isArray(req.body.file)) {
      console.log('if', req.body.file);
      req.body.file.forEach((teamMember) => {
        helperFunctions.sendSignupEmail(teamMember.emailAddress, teamMember.firstName, teamMember.lastName, req.body.firstName, req.body.lastName);
      })
    } else {
      helperFunctions.processSpreadsheet(req.body.file);
    }
  }
});

router.post('/compare', function (req, res, next) {
  let submittedUsername = req.body.emailAddress;
  let submittedPassword = req.body.password;
  let responseObject = {};
  queries.getUser(submittedUsername, function (err, result) {
    if (err) {
      res.json({
        error: true,
        message: 'Sorry, we didn\'t recognize that email address.'
      });
    } else {
      let hash = result[0].password;
      bcrypt.compare(submittedPassword, hash, function(err, response) {
        if (response) {
          var myToken = helperFunctions.generateToken(submittedUsername, submittedPassword);
          res.status(200).json(myToken);
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

router.get('/wholeteam', function(req, res, next) {
  queries.getTeam(1, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result);
    }
  })
})

router.get('/userInfo', function (req, res, next) {
  queries.getUser(req.body.emailAddress, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        firstName: result.firstName,
        lastName: result.lastName,
        emailAddress: result.emailAddress,
        profilePicture: result.profilePicture
      })
    }
  })
})

router.post('/feedback', function (req, res, next) {
  helperFunctions.sendFeedback(req.body.message, req.body.firstName);

  res.status(200).send('Feedback sent');
})

router.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    ContentType: fileType
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

module.exports = router;
