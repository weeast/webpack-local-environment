var _time = require('JS/prop/time');
var mapData = require('JS/map/data');

var defaults = {
    len: 665,
    perWidth: 20
}

module.exports = {
    getData: function(json) {
        var res = {};
        res.endtime = _time.format(json.duration, 'match');
        res.events = [];
        //解析单场时间轴事件数据
        var frontPos = -10, //前一个事件的位置
            total = 0, //事件排列的长度
            cmpPos, //计算出来的位置
            realPos, //实际的位置
            tightNum = 0, //可以紧缩的数量
            tightLen = 0; //可以紧缩的长度 
        for (var idx in json.gameEventList) {
            var locEvent = json.gameEventList[idx],
                _event = {};
            locEvent.time = locEvent.time / 1000;
            _event.side = json.team1Id == locEvent.teamId ? 'up' : 'down';
            _event.type = mapData.timelineType[locEvent.type];
            if (_event.type == "fight")
                _event.side = '';
            //事件介绍
            if (!json.description) {
                var teamName = json.team1Id == locEvent.teamId ? json.team1Name : locEvent.teamId && json.team2Name || '';
                _event.description = _time.format(locEvent.time, 'match');
                _event.description += teamName;
                _event.description += mapData.eventDescription[locEvent.type] || '精彩时刻'
            } else
                _event.description = json.description;
            //第一次整理距离
            cmpPos = defaults.len * locEvent.time / json.duration;
            realPos = cmpPos - frontPos > defaults.perWidth ? cmpPos : frontPos + defaults.perWidth;
            //margin-left
            _event.distance = realPos - frontPos - defaults.perWidth;
            //该事件是否可以紧缩
            if (realPos == cmpPos) {
                tightLen += _event.distance;
                tightNum++;
            }
            frontPos = realPos;
            total += _event.distance + defaults.perWidth;
            res.events.push(_event);
        }
        //如果事件排列超出了时间轴长度
        //紧缩策略
        if (total > defaults.len && tightNum > 0) {
            var tight = total - defaults.len,
                ratio = tight / tightLen > 1 ? 0 : 1 - tight / tightLen;
            for (var idx in res.events) {
                if (res.events[idx].distance > 0)
                    res.events[idx].distance = res.events[idx].distance * ratio;
            }
        }
        return res;
    }
}