var Text = require('../../../models/texts');
exports.index = function(req, res) {
  if(req.headers['x-apikey'] == process.env.textApiKey || require('../../../config.js').get('text_service:apikey')){
    Text.find({ 'senderID' : req.headers['x-user-id'] }, function(err, texts) {
      console.log('texts: ', texts)
      if(err) return res.status(500).send({error: "Internal Text Service error" + err})
      res.send({texts:texts});
    });
  } else {
    res.status(401).send({err: "Invalid API Key"});
  }
};
