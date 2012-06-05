var MongoQuotes = require('./../mongo/quotes.js'),
    MarkIt = require('./../services/markitapi.js');

var MarketService = function() {
    var mongo = new MongoQuotes();
    mongo.connect();

    var markit = new MarkIt();

    this.getQuote = function(symbol, callback) {
        mongo.getQuote(symbol, function(item) {
            if (item === null) {
                console.log(symbol + ' not found in mongo, fetching from web service...');
                markit.getQuote(symbol, function(result) {
                    mongo.saveQuote(result.Data);
                    callback(result);
                });
            } else {
                console.log('retrieved ' + symbol + ' from mongo...');
                callback(item);
            }
        });
    };

    this.getTimeSeries = function(symbol, callback) {
        mongo.getQuote(symbol, function(item) {
            if (item === null) {
                console.log(symbol + ' not found in mongo, fetching from web service...');
                markit.getTimeSeries(symbol, 365, function(result) {
                    var data = result.Data;
                    var count = data.Series.open.values.length;
                    var i;
                    var item;
                    for (i = 0; i < count; i++) {
                        item = {};
                        item.s = data.Symbol;
                        item.o = data.Series.open.values[i];
                        item.h = data.Series.high.values[i];
                        item.l = data.Series.low.values[i];
                        item.c = data.Series.close.values[i];
                        item.t = Date.parse(data.SeriesDates[i]);
                        mongo.saveQuote(item);
                    }

                    callback(data);
                });
            } else {
                console.log('retrieved ' + symbol + ' from mongo...');
                callback(item);
            }
        });
    };
};

module.exports = MarketService;