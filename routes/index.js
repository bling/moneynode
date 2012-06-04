var http = require('http'),
    markit = require('./../services/markitapi.js');

module.exports = function(app) {
    "use strict";

    var quote = new markit.MarkItQuote();
    var series = new markit.MarkItTimeSeries();

    app.get('/', function(req, res) {
        res.render('index', { title: 'Express' });
    });

    app.get('/quote', function(req, res) {
        quote.get(req.query.symbol, function(json) {
            if (json !== null) {
                res.write(JSON.stringify(json));
            }
            res.end();
        });
    });

    app.get('/series', function(req, res) {
        series.get(req.query.symbol, function(json) {
            if (json !== null) {
                res.write(JSON.stringify(json));
            }
            res.end();
        });
    });
};
