const knex = require('./connection');
//
// exports.newUser = function(firstName, lastName, emailAddress, password, coach, callback) {
//   knex('users')
//   .insert({
//     firstName: firstName,
//     lastName: lastName,
//     emailAddress: emailAddress,
//     password: password,
//     coach: coach
//   })
//   .then(result => {
//     callback(null, result);
//   }).catch(err => {
//     callback(err);
//   })
// }

exports.getUser = function(tableName, emailAddress, callback) {
  knex(tableName)
  .select('firstName', 'lastName', 'emailAddress', 'teamName', 'password', 'profilePicture')
  .join('teams', 'teams.id', '=', `${tableName}.teamId`)
  .where(`${tableName}.emailAddress`, emailAddress)
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

exports.newUser = function(tableName, firstName, lastName, emailAddress, password, teamId, profilePicture, callback) {
  knex(tableName)
  .insert({
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: password,
    teamId: teamId,
    profilePicture: profilePicture
  })
  .then(result => {
    callback(null, result);
  })
}
