var mongo = require('mongodb'),
    events = require('events');

var MongoQueue = function() {
    events.EventEmitter.call(this);

    var server = new mongo.Server(process.env.MONGOLAB_URI || 'localhost', 27017, { auto_reconnect: true });
    var db = new mongo.Db('moneynode', server);
    var that = this;
    var collection;

    function initCollection(db) {
        db.createCollection('queue', {
            capped: true,
            autoIndexId: false,
            size: 100000,
            max: 1000
        }, function(err, c) {
            if (!err) {
                collection = c;
                initMessageCursor(c);
            }
        });
    }

    function initMessageCursor(collection) {
        // find the last item in the collection so we can filter by _id
        collection.findOne({}, {sort: [['$natural', -1]]}, function(err, item) {
            // set up a tailable cursor so that only new items come through
            var cursor;
            var options = { '$natural': -1, tailable: 1 };
            if (item === null) {
                cursor = collection.find({}, options);
            } else {
                cursor = collection.find({ '_id': { '$gt': item._id }}, options);
            }

            cursor.each(function(err, item) {
                if (!err) {
                    that.emit('data', item);
                }
            });
        });
    }

    db.open(function(err, db) {
        if (!err) {
            console.log('connected to mongo');
            initCollection(db);
        }
    });

    this.publish = function(message) {
        if (collection === null) {
            throw 'collection not initialized yet';
        }

        collection.insert(message);
    };
};

MongoQueue.prototype = Object.create(events.EventEmitter.prototype);

module.exports = MongoQueue;