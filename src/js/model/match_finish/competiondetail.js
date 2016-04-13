var seed = require('JS/seed/index');

var defaults = {
    width: 400
}

function _compareTeams(team1, team2) {
    var len = defaults.width * 0.5;
    if (team1 != team2)
        len = team1 / (team1 + team2) * defaults.width;
    return len + 25;
}

module.exports = {
    getData: function(json) {
        var res = $.extend(true, {}, json);
        res.killLen = _compareTeams(res.team1Kill, res.team2Kill);
        res.moneyLen = _compareTeams(res.team1Money, res.team2Money);
        res.towerLen = _compareTeams(res.team1Tower, res.team2Tower);
        res.team1Kill = res.team1Kill == -1 ? '暂无' : res.team1Kill;
        res.team1Money = res.team1Money == -1 ? '暂无' : seed.number.toKilo(res.team1Money);
        res.team1Tower = res.team1Tower == -1 ? '暂无' : res.team1Tower;
        res.team2Kill = res.team2Kill == -1 ? '暂无' : res.team2Kill;
        res.team2Money = res.team2Money == -1 ? '暂无' : seed.number.toKilo(res.team2Money);
        res.team2Tower = res.team2Tower == -1 ? '暂无' : res.team2Tower;
        return res;
    }
}