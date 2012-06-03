var mongo = require('mongodb');

module.exports = function(app) {
    "use strict";

    var server = new mongo.Server('localhost', 27017, { auto_reconnect: true });
    var db = new mongo.Db('moneynode', server);

    db.open(function(err, db) {
        if (!err) {
            console.log('connected to mongo');
        }
    });
};
