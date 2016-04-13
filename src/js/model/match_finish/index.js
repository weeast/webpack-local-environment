var timeline = require('./timeline');
var mapData = require('JS/map/data');
var compDetail = require('./competiondetail');

module.exports = {
    getData: function(json) {
        var res = {};
        res.competions = [];
        res.compTitles = [];
        res.detailUrl = json.detailUrl;
        for (var idx in json.oneCompList) {
            var locComp = $.extend(true, {}, json.oneCompList[idx]);
            _comp = {};
            //补充单场数据
            locComp.team1Id = json.team1Id;
            locComp.team2Id = json.team2Id;
            locComp.team1Name = json.team1Name;
            locComp.team2Name = json.team2Name;
            //解析单场时间轴数据
            _comp.timeline = timeline.getData(locComp);
            //解析单场详情数据
            _comp.detail = compDetail.getData(locComp);
            res.competions.push(_comp);
            //添加单场标题
            res.compTitles.push('第' + mapData.numIndex[idx] + '局');
        }
        return res;
    },
    getTeamStatus: function(status) {
        return mapData.teamStatus[status];
    }
}