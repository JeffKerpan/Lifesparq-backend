const jwt = require('jsonwebtoken');

exports.generateAdminToken = function(emailAddress) {
  var myToken = jwt.sign({emailAddress: emailAddress, admin: true}, process.env.JWT_KEY);
  return myToken;
}

exports.generateUserToken = function(emailAddress) {
  var myToken = jwt.sign({emailAddress: emailAddress, user: true}, process.env.JWT_KEY);
  return myToken;
}

exports.generateCoachToken = function(emailAddress, teamId) {
  var myToken = jwt.sign({emailAddress: emailAddress, coach: true, teamId: teamId}, process.env.JWT_KEY);
  return myToken;
}
