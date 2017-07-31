exports.seed = function(knex, Promise) {
  return knex('coaches').del()
    .then(function () {
      return Promise.all([
        knex('coaches').insert({
          firstName: 'Rex',
          lastName: 'Ryan',
          emailAddress: 'jkigotfired@nfl.com',
          password: '$2a$11$K77.359BVdGIuO0k5Ujz4O82qQ3Ubvh6xCrmcnJeL9CsAA5DHxOe.',
          teamId: knex('teams').select('id').where('teamName', 'Bills')
        })
      ]);
    });
};
