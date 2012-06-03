var http = require('http');

module.exports = function(app) {
    var streamReader = function(options, callback) {
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
                    callback(json);
                });
                response.on('close', function() {
                    res.end();
                });
            })
            .on('error', function(e) {
                console.log("Got error: " + e.message);
            });
    };

    app.get('/', function(req, res) {
        res.render('index', { title: 'Express' })
    });

    app.get('/quote', function(req, res) {
        var options = {
            host: 'dev.markitondemand.com',
            path: '/Api/Quote/jsonp?symbol=' + req.query['symbol']
        };

        streamReader(options, function(json) {
            res.write(JSON.stringify(json));
            res.end();
        });
    });

    app.get('/series', function(req, res) {
        var options = {
            host: 'dev.markitondemand.com',
            path: '/Api/Timeseries/jsonp?symbol=' + req.query['symbol'] + '&duration=' + (req.query['duration'] || 365)
        };

        streamReader(options, function(json) {
            res.write(JSON.stringify(json));
            res.end();
        });
    });
};
