exports.up = function(knex, Promise) {
  return knex.schema.createTable('teams', table => {
    table.increments();
    table.string('teamName');
    table.string('sport');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('teams');
};
