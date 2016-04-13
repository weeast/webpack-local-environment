require('./view.less');

var template = require('jade!./view.jade');
var seed = require('JS/utils/index');

var defaults = {
        target: null,
        site: null
    },
    data = {};

module.exports = {
    init: function(options) {
        defaults.target = options.target || '#J-player-rank';
        defaults.site = seed.env.site;
        data = $.extend(true, {}, options && options.data)
        data.site = defaults.site;

        return this;
    },
    render: function() {
        $(defaults.target).html(template(data));
    }
};