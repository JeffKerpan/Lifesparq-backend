exports.up = function(knex, Promise) {
  return knex.schema.createTable('superUsers', table => {
    table.increments();
    table.string('emailAddress');
    table.string('password');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('superUsers')
};
