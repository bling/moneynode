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
        markit.getTimeSeries(symbol, 365, function(item) {
            callback(item);
        });
    };
};

module.exports = MarketService;