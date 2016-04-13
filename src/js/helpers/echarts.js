var _ec = require("echarts");
var _zrColor = require('zrender/tool/color');
require('echarts/chart/pie');

var _instanceId = 1,
    _styles={
        defaults: ['#00d8e9'],
        defaultsText: ['#000'],
        piesRound: ['rgba(255,201,62,.3)','rgba(0,128,203,.3)','rgba(0,216,233,.3)','rgba(73,191,69,.3)','rgba(227,41,72,.3)'],
        piesRoundActive: ['rgba(255,201,62,1)','rgba(0,128,203,1)','rgba(0,216,233,1)','rgba(73,191,69,1)','rgba(227,41,72,1)'],
        piesRoundText: ['rgba(255,201,62,1)','rgba(0,128,203,1)','rgba(0,216,233,1)','rgba(73,191,69,1)','rgba(227,41,72,1)'],
        piesRing: ['#34424c',_zrColor.getLinearGradient(0,0,0,100,[[0,'rgba(12,63,66,1)'],[1,'rgba(0,216,233,1)']])],
        piesRingDota: ['#34424c',_zrColor.getLinearGradient(0,0,0,100,[[0,'rgba(88,27,27,1)'],[1,'rgba(225,54,54,1)']])]
    },
    _positionArr = ['上单','打野','中单','辅助','ADC'];

function _createOption(data,type,style){
    var option = {
            noDataLoadingOption: {
                text: '暂无数据',
                effect: 'none',
                effectOption: {
                    backgroundColor: 'transparent'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b}"
            },
            calculable: false,
            series:[{
                type: type,
                data:[]
            }]
        },
        locStyle = _createStyle(style);
    for(idx in data){
        var temp = _createData(data[idx],type);
        temp.itemStyle = locStyle[idx];
        option.series[0].data.push(temp);
    }
    return option;
}

function _createData(data, type){
    return {
        type: type,
        value: data.value || 0,
        name: data.name || (_instanceId++,_instanceId),
        itemStyle:{}
    }
}

function _createStyle(style){
    var styleArr = [],
        locStyle = _styles[style] || _styles.defaults,
        locStyleActive = _styles[style+'Active'],
        locStyleText = _styles[style+'Text'] || _styles.defaultsText;
    for(var idx in locStyle){
        var temp = {
            normal:{
                color: locStyle[idx],
                label: {
                    textStyle:{
                        color: locStyleText[idx] || locStyleText,
                        fontFamily : '微软雅黑',
                        fontSize:14
                    }
                }
            }
        };
        if(locStyleActive){
            temp.emphasis = {
                color: locStyleActive[idx]
            }
        }
        styleArr.push(temp);
    }
    return styleArr;
}

function _addLengend( nameArr,opt ){
    opt.legend = {
            data: nameArr,
            x: 'center',
            y: 'bottom',
            selectedMode:false,
            itemGap: 5,
            textStyle: {
                color: '#d9dadb',
                fontFamily: 'Microsoft YaHei'
            }
        };
    return opt
}

function _addLabel( formatter, opt){
    opt.series[0].itemStyle = {
        normal:{
            label:{
                formatter: formatter
            }
        }
    }
    return opt
}

module.exports={
    init: function(dom){
        return _ec.init(dom);
    },
    paraRound: function(data,style){
        var option = _createOption(data,'pie',style||'piesRound'),
            legendData = [];
        option.series[0].radius = [33, 53];
        option.series[0].funnelAlign = 'left';
        option.series[0].max = 500;
        for(var i = 0;i < data.length; ++i)
            legendData.push(data[i].name);
        option = _addLengend(legendData,option);
        option = _addLabel("{b}{c}次",option);
        return option;
    },
    pieObj: function(data, style){
        var option = _createOption(data,'pie',style||'piesRing'),
            textColor = style=="piesRing"?"#00d8e9":"#dd3535";
        option.series[0].radius = [44, 53];
        option.series[0].itemStyle = {
            normal:{
                labelLine:{
                    show: false
                },
                label:{
                    show: false
                }
            }
        }
        option.series[0].data[1].itemStyle.normal.label = {
            position: 'center',
            textStyle: {
                align: 'center',
                color: textColor,
                fontFamily : '微软雅黑',
                fontSize:18,
                baseline: 'middle'
            },
            formatter: function(params) {
                return params.value + '%'
            },
            show: true
        };
        return option;
    }
}