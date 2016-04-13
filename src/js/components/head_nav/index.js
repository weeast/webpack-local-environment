require('./view.less');

var seed = require('JS/utils/index')
var template = require('jade!./view.jade');

var defaults = {
        target: null,
        site: null
    },
    data = {};

module.exports = {
    init: function(options) {
        defaults.target = options.target || '#J-header';
        defaults.site = options.site || 'lol';
        if (typeof options.data === 'object')
            data = options.data;
        else if (typeof options.data === 'string')
            data = JSON.parse(options.data);
        data.site = defaults.site;
        data._static = seed.env.staticPath;
        data._host = seed.env.apisPath;
        return this;
    },
    render: function(controller) {
        if (controller)
            return template(data);
        else
            $(defaults.target).prepend(template(data));
    }
};