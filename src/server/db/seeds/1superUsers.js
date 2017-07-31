exports.seed = function(knex, Promise) {
  return knex('superUsers').del()
    .then(function () {
      return Promise.all([
        knex('superUsers').insert({
          emailAddress: 'mitch@mconnell.com',
          password: 'fuckyourinsurance'
        })
      ]);
    });
};
