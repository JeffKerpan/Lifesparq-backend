const knex = require('./connection');

exports.getUser = function(emailAddress, callback) {
  knex('coaches')
  .select('firstName', 'lastName', 'emailAddress', 'teamName', 'password', 'profilePicture')
  .join('teams', 'teams.id', '=', `coaches.teamId`)
  .where(`coaches.emailAddress`, emailAddress)
  .then(result => {
    if (!result.length) {
      knex('users')
      .select('firstName', 'lastName', 'emailAddress', 'password', 'profilePicture')
      .join('teams', 'teams.id', '=', 'users.teamId')
      .where(`users.emailAddress`, emailAddress)
      .then(result => {
        callback(null, result);
      })
    } else {
      callback(null, result);
    }
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

exports.superUser = function(emailAddress, callback) {
  knex('super_users')
  .where('super_users.emailAddress', emailAddress)
  .then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.getTeam = function(teamId) {
  knex('')
}
