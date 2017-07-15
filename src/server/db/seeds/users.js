exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({
          firstName: 'Bob',
          lastName: 'Loblaw',
          emailAddress: 'testing@123.com',
          password: 'stuffandthings',
          coach: true
        }),
        knex('users').insert({
          firstName: 'Stephen',
          lastName: 'Colbert',
          emailAddress: 'stephen@colbert.com',
          password: 'lateshow1234',
          coach: true
        }),
        knex('users').insert({
          firstName: 'Ashton',
          lastName: 'Kutcher',
          emailAddress: 'ashton@kutcher.com',
          password: '$2a$11$RFO6RQedExqc4VyN.x6GbOnGRXen4ULufZ4zREnLB.DRgFiOrzdMG',
          coach: false
        })
      ]);
    });
};
