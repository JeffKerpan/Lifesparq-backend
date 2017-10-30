const express = require('express');
const router = express.Router();
const queries = require('../db/queries.js');
const bcrypt = require('bcrypt');
const parse = require('csv-parse');
const aws = require('aws-sdk');
const tokens = require('../db/helperFunctions/tokens.js');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  return next();
});

router.post('/compare', function (req, res, next) {
  let submittedUsername = req.body.emailAddress;
  let submittedPassword = req.body.password;
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
          var myToken = tokens.generateAdminToken(submittedUsername);
          res.status(200).json({
            token: myToken
          });
        } else {
          res.status(401).json({
            message: 'Incorrect email address or password'
          })
        }
      });
    }
  });
})

router.post('/verify', expressJwt({secret: process.env.JWT_KEY}), function(req, res) {
  if (req.user.admin) {
    res.status(200).send(true);
  } else {
    res.status(403).send(false);
  }
})

router.get('/sign-s3', expressJwt({secret: process.env.JWT_KEY}), (req, res) => {
  if (!req.user.admin) {
    res.status(403).send('Access Forbidden');
  }
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
