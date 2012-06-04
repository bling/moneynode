var MongoQuotes = require('./../mongo/quotes.js'),
    markit = require('./../services/markitapi.js');

var QuoteService = function() {
    var mongo = new MongoQuotes();
    mongo.connect();

    var markitquote = new markit.MarkItQuote();

    this.getQuote = function(symbol, callback) {
        mongo.getQuote(symbol, function(item) {
            if (item === null) {
                markitquote.get(symbol, function(result) {
                    // todo: save
                    callback(result);
                });
            } else {
                callback(item);
            }
        });
    };
};

module.exports = QuoteService;