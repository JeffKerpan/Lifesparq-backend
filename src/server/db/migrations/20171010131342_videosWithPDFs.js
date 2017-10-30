exports.up = function(knex, Promise) {
  return knex.schema.createTable('videos_and_pdfs', table => {
    table.increments();
    table.string('videoId');
    table.string('pdfUrl');
    table.string('description');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('videos_and_pdfs');
};
