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
            autoIndexId: true,
            size: 100000,
            max: 1000
        }, function(err, c) {
            if (!err) {
                collection = c;
                initMessageCursor(c);
            } else {
                console.log(err);
            }
        });
    }

    function initMessageCursor(collection) {
        // find the last item in the collection so we can filter by _id
        collection.findOne({}, {sort: [['$natural', -1]]}, function(err, item) {
            if (!err) {
                if (item === null) {
                    // the tailable cursor requires a non-empty collection to work, so let's add a dummy message
                    collection.insert({t: 'init'}, {safe: true});
                }

                // set up the cursor so only new items added get notified
                var options = { '$natural': -1, tailable: 1 };
                var cursor = collection.find({ '_id': { '$gt': item._id }}, options);

                cursor.each(function(err, item) {
                    if (!err) {
                        console.log('received item in queue: ' + JSON.stringify(item));
                        that.emit('data', item);
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
            }
        });
    }

    this.connect = function() {
        db.open(function(err, db) {
            if (!err) {
                initCollection(db);
            } else {
                console.log(err);
            }
        });
    };

    this.publish = function(message) {
        if (collection === null) {
            throw 'collection not initialized yet';
        }

        collection.insert(message);
    };
};

MongoQueue.prototype = Object.create(events.EventEmitter.prototype);

module.exports = MongoQueue;