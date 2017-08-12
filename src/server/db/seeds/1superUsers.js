exports.seed = function(knex, Promise) {
  return knex('super_users').del()
    .then(function () {
      return Promise.all([
        knex('super_users').insert({
          emailAddress: 'mitch@mconnell.com',
          password: '$2a$11$z7eGt5smO/3GBt9s9aSfLeRvrNWeL.acIZ.NRFzKomJFZgx5OAW5a'
        })
      ]);
    });
};
