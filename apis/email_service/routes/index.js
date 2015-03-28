var Email = require('../../../models/emails');
exports.index = function(req, res) {
  console.log(1.6)
  if(req.headers['x-apikey'] == process.env.emailApiKey || require('../../../config.js').get('email_service:apikey')){
    Email.find({ 'senderID' : req.headers['x-user-id'] }, function(err, emails) {
      if(err) return res.status(500).send({error: "Internal Email Service error" + err})
      res.send({emails:emails});
    });
  } else {
    res.status(401).send({error: "Invalid API Key"});
  }
};
