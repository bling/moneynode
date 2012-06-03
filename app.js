var express = require('express'),
    cluster = require('cluster'),
    os = require('os'),
    app = module.exports = express.createServer();

require('./config/environment.js')(app, express);
require('./routes')(app);

if (cluster.isMaster) {
    for (var i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }

    cluster.on('death', function(worker) {
        console.log('worker ' + worker.pid + ' died');
    });
} else {
    app.listen(process.env.PORT || 8888, function() {
        console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    });
}
