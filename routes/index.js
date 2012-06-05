var http = require('http'),
    MarketService = require('./../services/marketservice.js');

module.exports = function(app) {
    "use strict";

    var market = new MarketService();

    app.get('/', function(req, res) {
        res.render('index', { title: 'Express' });
    });

    app.get('/quote', function(req, res) {
        market.getQuote(req.query.symbol, function(json) {
            if (json !== null) {
                res.write(JSON.stringify(json));
            }
            res.end();
        });
    });

    app.get('/series', function(req, res) {
        market.getTimeSeries(req.query.symbol, function(json) {
            if (json !== null) {
                res.write(JSON.stringify(json));
            }
            res.end();
        });
    });
};
