var mongo = require('mongodb'),
    events = require('events');

var MongoQuotes = function() {
    events.EventEmitter.call(this);

    var server = new mongo.Server(process.env.MONGOLAB_URI || 'localhost', 27017, { auto_reconnect: true });
    var db = new mongo.Db('moneynode', server);
    var that = this;
    var collection;

    function initCollection(db) {
        db.createCollection('queue', function(err, c) {
            if (!err) {
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
            if (!err && item !== null) {
                callback(item);
            }
        });
    };
};

MongoQuotes.prototype = Object.create(events.EventEmitter.prototype);

module.exports = MongoQuotes;