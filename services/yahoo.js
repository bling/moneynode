var http = require('http');

var tag = {
    symbol: 's',
    name: 'n',
    close: 'p'
};

var YahooService = function() {
};

YahooService.prototype.getSnapshot = function (symbol, callback) {
    var options = {
        host: 'download.finance.yahoo.com',
        path: '/d/quotes.csv?s=' + symbol + '&f=' + tag.symbol + tag.name + tag.close
    };

    http.get(options, function (res) {
        var bin = '';
        res.on('data', function (chunk) {
            bin += chunk;
        });
        res.on('end', function () {
            var parts = bin.split(',');
            callback({
                symbol: parts[0],
                name: parts[1],
                close: parts[2]
            });
        });
    });
};

YahooService.prototype.getHistorical = function(options, callback) {
    var opts = {
        host: 'ichart.yahoo.com',
        path: '/table.csv?s=' + options.symbol
    };

    http.get(opts, function (res) {
        var bin = '';
        res.on('data', function (chunk) {
            bin += chunk;
        });
        res.on('end', function () {
            var lines = bin.split('\n');
            for (var i = 1; i < lines.length; ++i) {
                var line = lines[i];
                var parts = line.split(',');
                callback({
                    date: Date.parse(parts[0]),
                    open: parseFloat(parts[1]),
                    high: parseFloat(parts[2]),
                    low: parseFloat(parts[3]),
                    close: parseFloat(parts[4]),
                    volume: parseFloat(parts[5]),
                    adjclose: parseFloat(parts[6])
                });
            }
        });
    });
};

module.exports = YahooService;