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
    var allVideos = result.videos;
    allVideos.forEach((video) => {
      if (allViewedVideos.indexOf(video.id) > -1) {
        video.watched = true;
      } else {
        video.watched = false;
      }
    })
    res.status(200).send(allVideos);
  })
})

router.get('/allplaylists', function (req, res) {
  sprout.getAllByPath('playlists', function (result) {
    res.status(200).send(result);
  })
})

router.get('/alltags', function (req, res) {
  sprout.getAllByPath('tags', function (result) {
    console.log(result);
    res.status(200).send(result);
  })
})

router.post('/videosbytag', expressJwt({secret: process.env.JWT_KEY}), function (req, res) {

  sprout.getAllByPath(`videos?tag_name=${req.body.tag}`, function (result) {

    res.status(200).send(result);
  }, req.user.emailAddress)
})

module.exports = router;
