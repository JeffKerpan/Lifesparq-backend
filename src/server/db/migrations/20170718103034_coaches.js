//going to create a table for users, coaches, teams, and team members (?). This way the users table has no relation to teams, and the team members table does.
exports.up = function(knex, Promise) {
  return knex.schema.createTable('coaches', table => {
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
  return knex.schema.dropTable('coaches');
};
