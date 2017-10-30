exports.seed = function(knex, Promise) {
  return knex('videos_and_pdfs').del()
    .then(function () {
      return Promise.all([
        knex('videos_and_pdfs').insert({
          videoId: 'a49ad8b51315eaca2c',
          pdfUrl: 'https://res.cloudinary.com/drwjbjpwv/image/upload/v1507662673/Testing%20123.pdf',
          description: 'testing'
        })
      ]);
    });
};
