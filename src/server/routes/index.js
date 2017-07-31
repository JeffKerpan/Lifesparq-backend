const express = require('express');
const router = express.Router();
const queries = require('../db/queries.js');
const bcrypt = require('bcrypt');
const parse = require('csv-parse');
const aws = require('aws-sdk');
const helper = require('../db/helperFunctions.js');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  return next();
});

// router.post('/newUser', function (req, res, next) {
//   bcrypt.hash(req.body.password, 11, function (err, hash) {
//     queries.newUser(req.body.firstName, req.body.lastName, req.body.emailAddress, hash, function (err, result) {
//       if (err) {
//         console.log(err);
//       } else {
//         res.json({
//           message: 'success'
//         });
//       }
//     });
//   });
// });

router.post('/newuser', function (req, res, next) {
  responseObject = {};
  bcrypt.hash(req.body.password, 11, function (err, hash) {
    queries.newUser(req.body.tableName, req.body.firstName, req.body.lastName, req.body.emailAddress, hash, req.body.teamId, req.body.profilePicture, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        responseObject.message = 'Success';
        res.send(responseObject);
      }
    });
  });
  if (req.body.file) {
    if (Array.isArray(req.body.file)) {
      console.log('if', req.body.file);
      //run function that does cool shit with the array of team members!
    } else {
      helper.processSpreadsheet(req.body.file);
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
          responseObject.success = true;
          responseObject.firstName = result[0].firstName;
          responseObject.lastName = result[0].lastName;
          responseObject.emailAddress = result[0].emailAddress;
          responseObject.teamName = result[0].teamName;
          responseObject.profilePicture = result[0].profilePicture;
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
