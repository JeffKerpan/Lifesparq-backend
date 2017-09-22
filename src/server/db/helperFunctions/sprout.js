const https = require('https');

exports.getAllByPath = function (path, callback) {
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
