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
const sprout = require('../db/helperFunctions/sprout.js');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

router.get('/allvideos', expressJwt({secret: process.env.JWT_KEY}), function (req, res) {

  sprout.getAllByPath('videos', function (result) {
    res.status(200).send(result);
  }, req.body.emailAddress)
})

router.get('/allplaylists', function (req, res) {
  sprout.getAllByPath('playlists', function (result) {
    res.status(200).send(result);
  })
})

router.get('/alltags', function (req, res) {
  sprout.getAllByPath('tags', function (result) {
    res.status(200).send(result);
  })
})

router.post('/videosbytag', expressJwt({secret: process.env.JWT_KEY}), function (req, res) {

  sprout.getAllByPath(`videos?tag_name=${req.body.tag}`, function (result) {

    res.status(200).send(result);
  }, req.user.emailAddress)
})

module.exports = router;
