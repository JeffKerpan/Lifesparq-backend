const https = require('https');
const queries = require('../queries.js');

exports.getAllByPath = function (path, callback, emailAddress) {
  var options = {
  method: 'GET',
  host: 'api.sproutvideo.com',
  path: `/v1/${path}`,
  headers: {'SproutVideo-Api-Key': process.env.SPROUT_KEY}
};

  innerCallback = function(response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      if (emailAddress) {
        var data = JSON.parse(str);

        queries.getUser(emailAddress, function (err, result) {
          if (err) {
            console.log(err);
          } else if (result[0].viewedVideos.length){
            var allViewedVideos = result[0].viewedVideos;
              data.videos.forEach((video) => {
                if (allViewedVideos.indexOf(video.id) > -1) {
                  video.watched = true;
                } else {
                  video.watched = false;
                }
              })
              callback(data);
          } else {
            data.videos.forEach((video) => {
              video.watched = false;
            })
            callback(JSON.parse(str));
          }
        })
      } else {
        callback(JSON.parse(str));
      }


    });
  }

  var req = https.request(options, innerCallback);
  req.end();
}
