const knex = require('./connection');

exports.newUser = function(firstName, lastName, emailAddress, password, coach, callback) {
  knex('users')
  .insert({
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: password,
    coach: coach
  })
  .then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.getUser = function(tableName, emailAddress, callback) {
  knex(tableName)
  .where('emailAddress', emailAddress)
  .then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}
