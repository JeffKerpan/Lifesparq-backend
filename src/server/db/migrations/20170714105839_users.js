exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('firstName');
    table.string('lastName');
    table.string('emailAddress');
    table.string('password');
    table.string('address');
    table.string('address2');
    table.string('city');
    table.string('state');
    table.date('birthday');
    table.integer('teamId').references('id').inTable('teams').defaultTo(0);
    table.string('profilePicture').defaultTo('http://via.placeholder.com/250x250');
    table.string('coverPicture').defaultTo('http://via.placeholder.com/350x150');
    table.string('viewedVideos');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
