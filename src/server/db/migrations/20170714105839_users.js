exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('firstName');
    table.string('lastName');
    table.string('emailAddress');
    table.string('password');
    table.integer('teamId').references('id').inTable('teams');
    table.string('profilePicture').defaultTo('http://via.placeholder.com/250x250');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
