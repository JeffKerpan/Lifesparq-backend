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

exports.newTeam = function(teamName, sport, callback) {
  knex('teams')
  .returning('id')
  .insert({
    teamName: teamName,
    sport: sport
  })
  .then(result => {
    callback(null, result[0]);
  }).catch(err => {
    console.log(err);
  })
}

exports.newCoach = function(firstName, lastName, emailAddress, password, teamId, callback) {
  knex('coaches')
  .insert({
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: password,
    teamId: teamId
  })
  .then(result => {
    console.log(result);
  })
}
