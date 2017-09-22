const express = require('express');
const router = express.Router();
const queries = require('../db/queries.js');
const bcrypt = require('bcrypt');
const tokens = require('../db/helperFunctions/tokens.js');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.use(bodyParser.urlencoded({
  extended: true
}));

router.use(expressJwt({ secret: process.env.JWT_KEY })
.unless({path: ['/compare']}));

// , expressJwt({secret: process.env.JWT_KEY})
router.post('/payment', function (req, res, next) {
  var token = req.body.stripeToken;
  var total = req.body.total * 100;
  console.log(total);

  stripe.charges.create({
    amount: total,
    currency: 'usd',
    description: 'test chargerererer',
    source: token.id,
    receipt_email: 'ryanharings@hotmail.com'
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

module.exports = router;
