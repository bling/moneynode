var mongo = require('mongodb'),
    events = require('events');

var MongoQuotes = function() {
    events.EventEmitter.call(this);

    var server = new mongo.Server(process.env.MONGOLAB_URI || 'localhost', 27017, { auto_reconnect: true });
    var db = new mongo.Db('moneynode', server);
    var that = this;
    var collection;

    function initCollection(db) {
        /* model each document as follows:
        {
            s: SYMBOL/TICKER,
            t: TIMESTAMP,
            o: OPEN,
            h: HIGH,
            l: LOW,
            c: CLOSE
        }
        */
        db.createCollection('quotes', function(err, c) {
            if (!err) {
                c.ensureIndex({s:1, t:1}, {unique:1});
                collection = c;
            } else {
                console.log(err);
            }
        });
    }

    this.isConnected = function() {
        return collection !== null;
    };

    this.connect = function() {
        db.open(function(err, db) {
            if (!err) {
                initCollection(db);
            } else {
                console.log(err);
            }
        });
    };

    this.getQuote = function(symbol, callback) {
        collection.findOne({ s: symbol }, function(err, item) {
            if (!err) {
                callback(item);
            }
        });
    };

    this.saveQuote = function(quote) {
        if (!quote.s) { throw 'quote.s is missing'; }
        if (!quote.t) { throw 'quote.t is missing'; }
        if (!quote.o) { throw 'quote.o is missing'; }
        if (!quote.h) { throw 'quote.h is missing'; }
        if (!quote.l) { throw 'quote.l is missing'; }
        if (!quote.c) { throw 'quote.c is missing'; }

        collection.save(quote);
    };
};

MongoQuotes.prototype = Object.create(events.EventEmitter.prototype);

module.exports = MongoQuotes;