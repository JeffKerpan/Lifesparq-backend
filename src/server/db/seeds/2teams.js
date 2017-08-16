exports.seed = function(knex, Promise) {
  return knex('teams').del()
    .then(function () {
      return Promise.all([
        knex('teams').insert({
          id: 0,
          teamName: 'null',
          sport: 'null'
        }),
        knex('teams').insert({
          teamName: 'Jets',
          sport: 'Football'
        }),
        knex('teams').insert({
          teamName: 'Dolphins',
          sport: 'Football'
        }),
        knex('teams').insert({
          teamName: 'Bills',
          sport: 'Football'
        })
      ]);
    });
};
