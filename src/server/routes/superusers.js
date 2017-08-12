const express = require('express');
const router = express.Router();
const queries = require('../db/queries.js');
const bcrypt = require('bcrypt');
const parse = require('csv-parse');
const aws = require('aws-sdk');
const helper = require('../db/helperFunctions.js');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  return next();
});

router.post('/compare', function (req, res, next) {
  console.log('anything at all');
  let submittedUsername = req.body.emailAddress;
  let submittedPassword = req.body.password;
  let responseObject = {};
  queries.superUser(submittedUsername, function (err, result) {
    if (err) {
      res.json({
        error: true,
        message: 'Sorry, we didn\'t recognize that email address.'
      });
    } else {
      let hash = result[0].password;
      bcrypt.compare(submittedPassword, hash, function(err, response) {
        if (response) {
          var myToken = helper.generateToken(submittedUsername, submittedPassword);
          res.status(200).send(myToken);
        } else {
          responseObject.success = false;
          res.send(responseObject);
        }
      });
    }
  });
})

router.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: process.env.S3_BUCKET_VIDEOS,
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
      url: `https://${process.env.S3_BUCKET_VIDEOS}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

router.post('/password', (req, res) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 11, function (err, hash) {
    console.log('hash', hash);
  })
});

module.exports = router;
