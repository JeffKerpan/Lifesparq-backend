const jwt = require('jsonwebtoken');
const helper = require('sendgrid').mail;

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

exports.generateToken = function(emailAddress, password) {
  var myToken = jwt.sign({emailAddress: emailAddress, password: password}, process.env.JWT_KEY);
  return myToken;
}

exports.sendSignupEmail = function(emailAddress, firstName, lastName, coachFirst, coachLast) {

  var fromEmail = new helper.Email('test@example.com');
  var toEmail = new helper.Email(emailAddress);
  var subject = 'Complete Lifesparq registration';
  var content = new helper.Content('text/plain', `Hi ${firstName} ${lastName}, your coach, ${coachFirst} ${coachLast}, recently signed you up for Lifesparq. Click here to complete your registration!`);
  var mail = new helper.Mail(fromEmail, subject, toEmail, content);

  var sg = require('sendgrid')(process.env.SENDGRID_ADMIN_TO_USER_KEY);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function (error, response) {
    if (error) {
      console.log('Error response received');
    }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
}

exports.sendFeedback = function (message, firstName) {
  var fromEmail = new helper.Email('test@example.com');
  //toEmail will need to be the email we set up for feedback.
  var toEmail = new helper.Email('dennis.nathan@gmail.com');
  var subject = `Feedback from ${firstName}`;
  var content = new helper.Content('text/plain', `${firstName} has submitted feedback about Lifesparq:

  ${message}`);
  var mail = new helper.Mail(fromEmail, subject, toEmail, content);

  var sg = require('sendgrid')(process.env.SENDGRID_ADMIN_TO_USER_KEY);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function (error, response) {
    if (error) {
      console.log('Error response received');
    }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
}
