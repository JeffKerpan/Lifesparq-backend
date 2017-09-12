const express = require('express');
const router = express.Router();
const queries = require('../db/queries.js');
const bcrypt = require('bcrypt');
const parse = require('csv-parse');
const aws = require('aws-sdk');
const tokens = require('../db/helperFunctions/tokens.js');
const spreadsheets = require('../db/helperFunctions/spreadsheets.js');
const sendgrid = require('../db/helperFunctions/sendgrid.js');
const usda = require('../db/helperFunctions/usda.js');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// I moved this into the main-config!!!!!!!
// router.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   return next();
// });

router.use(bodyParser.urlencoded({
  extended: true
}));

router.use(expressJwt({ secret: process.env.JWT_KEY })
.unless({path: ['/compare', '/newuser', '/newTeam', '/sign-s3', '/super/compare', '/mail/', '/coaches/compare', '/searchinfoodgroup', '/404', '/foodgroups', '/detailedfoodinfo']}));

router.get('/404', function (req, res) {
  res.status(404).json({
    message: 'Not Found'
  });
})

router.post('/foodgroups', function (req, res, next) {
  usda.getAllFoodGroups(function (result) {
    {
      res.status(200).send(result);
    }
  });
})

router.post('/searchinfoodgroup', function (req, res) {
  usda.getFoodsWithinFoodGroup(function (result) {
    res.status(200).send(result);
  })
})

router.post('/detailedfoodinfo', function (req, res) {
  usda.getDetailedFoodInfo(function (result) {
    res.status(200).send(result);
  })
})

router.post('/newuser', function (req, res, next) {
  responseObject = {};
  bcrypt.hash(req.body.password, 11, function (err, hash) {
    queries.newUser(req.body.tableName, req.body.firstName, req.body.lastName, req.body.emailAddress, hash, req.body.teamId, req.body.profilePicture, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        var myToken = tokens.generateToken(req.body.emailAddress, req.body.password);
        res.status(200).json({
          token: myToken
        });
      }
    });
  });
  if (req.body.file) {
    if (Array.isArray(req.body.file)) {
      req.body.file.forEach((teamMember) => {
        sendgrid.sendSignupEmail(teamMember.emailAddress, teamMember.firstName, teamMember.lastName, req.body.firstName, req.body.lastName);
      })
    } else {
      spreadsheets.processSpreadsheet(req.body.file);
    }
  }
});

router.post('/compare', function (req, res, next) {
  let submittedUsername = req.body.emailAddress;
  let submittedPassword = req.body.password;
  queries.getUser(submittedUsername, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      let hash = result[0].password;
      bcrypt.compare(submittedPassword, hash, function(err, response) {
        if (response) {
          var myToken = tokens.generateUserToken(submittedUsername);
          res.status(200).json({
            token: myToken
          });
        } else {
          res.status(404).json({
            message: 'Incorrect user info.'
          })
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

router.get('/userInfo', expressJwt({secret: process.env.JWT_KEY}), function (req, res, next) {
  queries.getUser(req.user.emailAddress, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        emailAddress: result[0].emailAddress,
        teamName: result[0].teamName,
        profilePicture: result[0].profilePicture
      });
    }
  })
})

router.post('/feedback', function (req, res, next) {
  sendgrid.sendFeedback(req.body.message, req.body.name);

  res.status(200).send('Feedback sent');
})

router.post('/payment', function (req, res, next) {
  console.log(req.body);
  var token = req.body.stripeToken;

  stripe.charges.create({
    amount: 50,
    currency: 'usd',
    description: 'test chargerererer',
    source: token
  }, function(err, charge) {
    if (err) {
      res.json({
        error: true,
        message: 'Payment was not accepted:' + err
      });
    } else {
      console.log(charge);
      res.send(charge);
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
