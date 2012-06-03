var express = require('express');
var app = module.exports = express.createServer();

require('./config/environment.js')(app, express);
require('./routes')(app);

app.listen(8888, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
