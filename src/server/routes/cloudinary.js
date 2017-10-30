const express = require('express');
const app = express();
const router = express.Router();
const queries = require('../db/queries.js');
const bcrypt = require('bcrypt');
const parse = require('csv-parse');
const aws = require('aws-sdk');
const tokens = require('../db/helperFunctions/tokens.js');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cloudinary = require('../db/helperFunctions/cloudinary.js');
const multiparty = require('multiparty');
const util = require('util');
const formidable = require('formidable');
const PDFParser = require("pdf2json");

// app.use(formidable());

router.post('/', function (req, res) {
  console.log(req.body.videoDescription);

  queries.addVideoWithDescription(req.body.video.id, req.body.videoDescription, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    }
  })

  // cloudinary.postPdf(req.body.file, function (error, response) {
  //   if (err) {
  //     res.status(400).send(err);
  //   } else {
  //     res.status(200).send(response);
  //   }
  // });
})

router.post('/image', function (req, res) {
  var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }
    let file = files.image[0].path;
    cloudinary.postImage(file, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result);
      }
    })
  });
})

module.exports = router;
