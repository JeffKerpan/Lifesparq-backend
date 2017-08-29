exports.processSpreadsheet = function(file) {
  var output = [];
  var allUsers = [];

  var parser = parse({delimiter: ':'});

  parser.on('readable', function() {
    while (record = parser.read()) {
      if (record[0].match(/[a-z]/i)) {
        record = record.join(',').split(',').filter((word) => {
          return (word !== '');
        });
        output.push(record);
      }
    }
  });

  parser.on('error', function(err) {
    console.log(err.message);
  });

  parser.write(file);

  output.forEach((array) => {
    console.log(array);
  })

}
