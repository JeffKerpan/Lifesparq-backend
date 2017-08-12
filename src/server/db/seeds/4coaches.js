exports.seed = function(knex, Promise) {
  return knex('coaches').del()
    .then(function () {
      return Promise.all([
        knex('coaches').insert({
          firstName: 'Rex',
          lastName: 'Ryan',
          emailAddress: 'jkigotfired@nfl.com',
          password: '$2a$11$tOR1m08qd9NjMx4TJefuM.ciFgTIG7MsavAsZ2Pb67pI.7Q/5dIou',
          teamId: knex('teams').select('id').where('teamName', 'Bills')
        })
      ]);
    });
};
