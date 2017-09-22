const https = require('https');

exports.getAllVideos = function (callback) {
  var options = {
  method: 'GET',
  host: 'api.sproutvideo.com',
  path: '/v1/videos',
  headers: {'SproutVideo-Api-Key': process.env.SPROUT_KEY}
};

  innerCallback = function(response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      callback(JSON.parse(str));
    });
  }

var req = https.request(options, innerCallback);
req.end();
}

exports.getAllPlaylists = function (callback) {
  var options = {
  method: 'GET',
  host: 'api.sproutvideo.com',
  path: '/v1/playlists',
  headers: {'SproutVideo-Api-Key': process.env.SPROUT_KEY}
};

  innerCallback = function(response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      callback(JSON.parse(str));
    });
  }

var req = https.request(options, innerCallback);
req.end();

}

exports.getAllTags = function (callback) {
  var options = {
    method: 'GET',
    host: 'api.sproutvideo.com',
    path: '/v1/tags',
    headers: {'SproutVideo-Api-Key': process.env.SPROUT_KEY}
  }

  innerCallback = function(response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      callback(JSON.parse(str));
    });
  }
  var req = https.request(options, innerCallback);
  req.end();

}

exports.getAllVideosByTag = function (tag, callback) {
  var options = {
    method: 'GET',
    host: 'api.sproutvideo.com',
    path: `/v1/tags/${tag}`,
    headers: {'SproutVideo-Api-Key': process.env.SPROUT_KEY}
  }

  innerCallback = function(response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      callback(JSON.parse(str));
    });
  }
  var req = https.request(options, innerCallback);
  req.end();

}
