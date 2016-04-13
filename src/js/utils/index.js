// exports
var guid = 0,
    EMPTY = '';

var locations = require('JS/utils/locations');
var array = require('./lang/array');
var number = require('./lang/number');
var object = require('./lang/object');
var string = require('./lang/string');

module.exports = {
    env: {
        host: window,
        staticPath: 'http://static.a.carry6.com',
        apisPath: 'http://www.carry6.com/db'
            // apisPath:'http://localhost:3000'
    },
    version: '',
    log: function(msg, cat, src) {

    },
    error: function(msg) {

    },
    guid: function(pre) {
        return (pre || EMPTY) + guid++;
    },
    now: function() {
        return Date.now();
    },
    type: function(filename) {
        var tags = document.getElementsByTagName('script');
        for (var i = 0; i < tags.length; ++i) {
            var path = tags[i].src;
            if (path.match(filename + '.js')) {
                return locations.getParm('t', path);
            }
        }
    },
    array: array,
    number: number,
    object: object,
    string: string
};