exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({
          firstName: 'Bob',
          lastName: 'Loblaw',
          emailAddress: 'testing@123.com',
          password: 'stuffandthings',
          teamId: knex('teams').select('id').where('teamName', 'Jets'),
          profilePicture: 'https://s3.amazonaws.com/lifesparq-profile-pictures/Boulder+Creek.jpg'
        }),
        knex('users').insert({
          firstName: 'Stephen',
          lastName: 'Colbert',
          emailAddress: 'stephen@colbert.com',
          password: '$2a$11$Q777YWV/2TBEF53DKBq9PO8luk3X2Pboa32SZRYqqJbc87xrP9i2y',
          profilePicture: 'https://s3.amazonaws.com/lifesparq-profile-pictures/Boulder+Creek.jpg'
        }),
        knex('users').insert({
          firstName: 'Ashton',
          lastName: 'Kutcher',
          emailAddress: 'ashton@kutcher.com',
          password: '$2a$11$RFO6RQedExqc4VyN.x6GbOnGRXen4ULufZ4zREnLB.DRgFiOrzdMG',
          teamId: knex('teams').select('id').where('teamName', 'Jets'),
          profilePicture: 'https://s3.amazonaws.com/lifesparq-profile-pictures/galleryimage-1578242971-feb-7-2012-300x225.jpg'
        })
      ]);
    });
};
