const http = require('http');

exports.getAllFoodGroups = function(callback) {
  http.get(`http://api.nal.usda.gov/ndb/list?format=json&lt=g&sort=n&api_key=${process.env.USDA_KEY}`,
  function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var parsed = JSON.parse(body);
      callback(parsed);
    })
  }).on('error', function(e) {
    console.log('Got error: ' + e.message);
  });
}


//Once integrated with the front end, the above function will fire on page load, populating a dropdown of food types. Once that's selected, the user can type in search terms to search that food group specifically. That will then populate another dropdown with the search results, and the last function on this page can take that items ndbno and get it's detailed information.

exports.getFoodsWithinFoodGroup = function(callback) {
  var testFood = 'potato chips';
  http.get(`http://api.nal.usda.gov/ndb/search/?format=json&fg=snacks&q=${testFood}&sort=n&max=25&offset=0&api_key=${process.env.USDA_KEY}`, function (response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var parsed = JSON.parse(body);
      callback(parsed);
    })
  }).on('error', function(e) {
    console.log('Got error: ' + e.message);
  });
}

exports.getDetailedFoodInfo = function (callback) {
  http.get(`http://api.nal.usda.gov/ndb/reports/?ndbno=01009&type=b&format=json&api_key=${process.env.USDA_KEY}`, function (response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var parsed = JSON.parse(body);
      callback(parsed);
    })
  }).on('error', function(e) {
    console.log('Got error: ' + e.message);
  });
}
