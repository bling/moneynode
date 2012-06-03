var http = require('http');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', { title: 'Express' })
    });

    app.get('/quote/:ticker', function(req, res) {
        var options = {
            host: 'dev.markitondemand.com',
            path: '/Api/Quote/jsonp?symbol=' + req.params.ticker
        };
        http
            .get(options, function(response) {
                console.log("Got response: " + response.statusCode);

                var stream = '';
                response.on('data', function(chunk) {
                    stream += chunk;
                });
                response.on('end', function() {
                    var rawJson = stream.replace('(function () { })(', '').slice(0, -1);
                    var json = JSON.parse(rawJson);
                    res.write(rawJson);
                    res.end();
                });
                response.on('close', function() {
                    res.end();
                });
            })
            .on('error', function(e) {
                console.log("Got error: " + e.message);
            });
    });
};
