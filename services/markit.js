var http = require('http');

var MarkItService = function() {
    var streamReader = function (options, callback) {
        var req = http.get(options, function (response) {
            console.log("Got response: " + response.statusCode);

            var stream = '';
            response.on('data', function (chunk) {
                stream += chunk;
            });

            response.on('end', function () {
                var rawJson = stream.replace('(function () { })(', '').slice(0, -1);
                var json = JSON.parse(rawJson);
                callback(json);
            });

            response.on('close', function () {
                callback(null);
            });
        });

        req.on('error', function (e) {
            console.log("Got error: " + e.message);
            callback(null);
        });
    };

    this.getQuote = function(symbol, callback) {
        var options = {
            host: 'dev.markitondemand.com',
            path: '/Api/Quote/jsonp?symbol=' + symbol
        };

        streamReader(options, callback);
    };

    this.getTimeSeries = function(symbol, duration, callback) {
        var options = {
            host: 'dev.markitondemand.com',
            path: '/Api/Timeseries/jsonp?symbol=' + symbol + '&duration=' + (duration || 365)
        };

        streamReader(options, callback);
    };
};

module.exports = MarkItService;