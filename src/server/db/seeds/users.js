exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({
          emailAddress: 'testing@123.com',
          password: 'stuffandthings',
          coach: true
        }),
        knex('users').insert({
          emailAddress: 'stephen@colbert.com',
          password: 'lateshow1234',
          coach: true
        }),
        knex('users').insert({
          emailAddress: 'ashton@kutcher.com',
          password: 'kelso4lyfe',
          coach: false
        })
      ]);
    });
};
