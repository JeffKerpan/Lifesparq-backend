exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('emailAddress');
    table.string('password');
    table.boolean('coach');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
