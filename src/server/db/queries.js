const knex = require('./connection');

exports.getUser = function(emailAddress, callback) {
  knex('users')
  .select('firstName', 'lastName', 'emailAddress', 'password', 'profilePicture', 'teamName', 'viewedVideos')
  .join('teams', 'teams.id', '=', 'users.teamId')
  .where(`users.emailAddress`, emailAddress)
  .then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.getCoach = function(emailAddress, callback) {
  knex('coaches')
  .select('firstName', 'lastName', 'emailAddress', 'teamName', 'password', 'profilePicture', 'teamId')
  .join('teams', 'teams.id', '=', `coaches.teamId`)
  .where(`coaches.emailAddress`, emailAddress)
  .then(result => {
    callback(null, result);
  }).catch(err => {
    console.log(err);
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

exports.newUser = function(tableName, firstName, lastName, emailAddress, password, teamId, profilePicture, birthday, callback) {
  knex(tableName)
  .returning('id')
  .insert({
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: password,
    teamId: teamId,
    profilePicture: profilePicture,
    birthday: birthday
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

exports.getTeam = function(teamId, callback) {
  knex('teams')
  .join('users', 'users.teamId', '=', 'teams.id')
  .select('firstName', 'lastName', 'emailAddress', 'teamName', 'address', 'address2', 'city', 'state', 'birthday')
  .where('teams.id', teamId)
  .then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.deleteUser = function(userId, callback) {
  knex('users')
  .where('users.id', userId)
  .del()
  .then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.deleteCoach = function(userId, callback) {
  knex('coaches')
  .where('coaches.id', userId)
  .del()
  .then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.addVideoWithDescription = function (videoId, description, callback) {
  knex('videos_and_pdfs')
  .insert({
    videoId: videoId,
    description: description
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.getAllDescriptions = function (callback) {
  knex('videos_and_pdfs')
  .select('*')
  .then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}

exports.getTeamName = function (teamId, callback) {
  knex('teams')
  .select('teamName')
  .where('teams.id', teamId)
  .then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  })
}
