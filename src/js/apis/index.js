var network = require('JS/prop/network');
var seed = require('JS/seed/index');

var defaults = {
        site: 'lol'
    },
    setting = {};

module.exports = {
    init: function(options) {
        setting = $.extend(true, {}, defaults, options || {});
    },
    //统一接口
    pageInit: function(url) {
        return network.ajax({
            url: url || 'http://www.carry6.com/lol/zone/detail', //seed.env.apisPath + setting.subHost + 'searchPage',
            type: 'get',
            promise: true
        })
    },
    // 直播数据
    liveData : function(){
        return network.ajax({
            url:"http://www.carry6.com/dota2/live/frame/zh",
            type: 'jsonp',
            promise: true
        })
    }
}