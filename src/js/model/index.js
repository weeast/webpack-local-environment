var matchFinish = require('./match_finish/index');

module.exports = {
    formatMatchFinish: matchFinish.getData,
    formatTeamRank: function(data, key) {
        data[key] = matchFinish.getTeamStatus(data[key]);
        return data;
    },
    formatMatchCharts: function(data) {
        var result = {};
        result['chartsParam'] = [];
        result['headParam'] = [];
        result['likesParam'] = [];

        var team = [data['team1'], data['team2']];
        var i = 0,
            len = team.length,
            item;
        var format = function(time, format) {
            var t = new Date(time);
            var tf = function(i) {
                return (i < 10 ? '0' : '') + i
            };
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                switch (a) {
                    case 'yyyy':
                        return tf(t.getFullYear());
                        break;
                    case 'MM':
                        return tf(t.getMonth() + 1);
                        break;
                    case 'mm':
                        return tf(t.getMinutes());
                        break;
                    case 'dd':
                        return tf(t.getDate());
                        break;
                    case 'HH':
                        return tf(t.getHours());
                        break;
                    case 'ss':
                        return tf(t.getSeconds());
                        break;
                };
            });
        };
        for (; i < len; i++) {
            item = team[i];
            result['chartsParam'].push({
                id: item['id'],
                status: matchFinish.getTeamStatus(item['status']),
                data: [{
                    value: item['win'],
                    name: '胜'
                }, {
                    value: item['lost'],
                    name: '负'
                }, {
                    value: item['draw'],
                    name: '平'
                }]
            });
            result['headParam'].push({
                ID: item['id'],
                name: item['name'],
                img: item['icon'],
                date: format(parseInt(data['startTime']), 'yyyy-MM-dd HH:mm:ss')
            });
            result['likesParam'].push({
                id: item['id'],
                value: 0
            });
        }

        return result;
    }
}