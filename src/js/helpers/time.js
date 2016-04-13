//补零
function _completionZero(num, digits) {
    num = num.toString();
    var zeros = digits - num.length;
    while (zeros > 0) {
        num = '0' + num;
        zeros--;
    }
    return num
}

//比赛时间格式MM:SS
function _matchFormat(time) {
    var min = parseInt(time / 60);
    var sec = parseInt(time % 60);
    min = _completionZero(min, 2);
    sec = _completionZero(sec, 2);
    return min + ":" + sec
}

module.exports = {
    //时间格式化
    format: function(time, type) {
        switch (type) {
            case 'match':
                if (time)
                    return _matchFormat(time);
                else
                    return "00:00"
            default:
                return time
                break;
        }
    }
}