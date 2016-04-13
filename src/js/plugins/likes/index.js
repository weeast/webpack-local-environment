
//引用视图样式
require('./view.less');

//引用视图模板
var template = require('jade!./view.jade');

//使用严格模式
"use strict";

//默认参数配置
var defaults = { 
	//(组件需要添加到的)容器
	container: $(document.body),
	//自定义主样式名称
	className: null,
	//(默认，组件被渲染完成后所展示的)数据
	data: [
		{id: 1, value: 0},
		{id: 2, value: 0}
	],
	//提交数据地址
	submitPath: null,
    //提交数据的延迟时间
    time: 3000,
	//数据键
	dataKey: { id: 'id', val: 'value' },
	//交互元素标识
	interactiveSeting: {
		//进度目标元素
		progressTarget: 'J-progress-target',
		//
		progressLabel1: 'J-progress-label1', progressLabel2: 'J-progress-label2',
		//点赞按钮
		firstParty: 'J-likes-first-party', secondParty: 'J-likes-second-party', likesAdd: 'J-likes-add', disabled: 'J-likes-disabled'
	}
};

/**
 * Likes(类)
 * @param  {Object} options配置参数对象
 * @return {Object} 对外接口方法
 */
var Likes = function(options){

	var _this = this;

	//默认参数与自定义参数合并后的参数对象
	var setting = $.extend(true, {}, defaults, options || {}),
		//控件自定义事件存储对象
		customEvent = {};

	setting.container = $(setting.container ? setting.container.length ? setting.container : document.body : document.body);

	/**
	 * 渲染，用于对组件视图模板的(数据)渲染操作
	 */
	var render = function(){
		//获取模板
		var tempHtml = template({
			//数据
			data: setting.data,
			//数据键
			dataKey: setting.dataKey,
			//自定义主样式名称
			className: setting.className || '',
		});
		setting.tempHtml = $(tempHtml);
		//添加到页面
		setting.container.append(setting.tempHtml);
		//绑定事件
		bindEvent();
		//设置初始值
		var ValKey = setting.dataKey.val;
		setLikesValue(setting.data[0][ValKey], setting.data[1][ValKey])
		//renderAnimation();
	};

	var bindEvent = function(){
		var interactiveSeting = setting.interactiveSeting,
			ValKey = setting.dataKey.val,
			likesSubmitThread = null;

		setting.tempHtml.click(function(e){
			e = e || window.event;
			var target = $(e.target || e.srcElement);
			var tempVal1 = setting.data[0][ValKey],
				tempVal2 = setting.data[1][ValKey];

			if(target.parent().hasClass(interactiveSeting.likesAdd)){
				target = target.parent();
			}
			if(!target.hasClass(interactiveSeting.disabled)){
				if(target.hasClass(interactiveSeting.firstParty)){
					setLikesValue(tempVal1 + 1, tempVal2);
				}
				else if(target.hasClass(interactiveSeting.secondParty)){
					setLikesValue(tempVal1, tempVal2 + 1);
				}

				if(likesSubmitThread){
                    window.clearTimeout(likesSubmitThread);
                    likesSubmitThread = null;
                }
                likesSubmitThread = window.setTimeout(function(){
                    console.log('提交数据-->'+JSON.stringify(setting.data));
                }, setting.time);
			}
		});
	};

	/**
	 * 渲染数据显示动画
	 * @return {无}
	 */
	var renderAnimation = function(){
		var interactiveSeting = setting.interactiveSeting;
		var IDKey = setting.dataKey.id,
			ValKey = setting.dataKey.val,
			data = setting.data,
			width = '50%';

		var dataValue1 = data ? (data[0] ? (data[0][ValKey] ? data[0][ValKey] : 0) : 0) : 0;
		var dataValue2 = data ? (data[1] ? (data[1][ValKey] ? data[1][ValKey] : 0) : 0) : 0;
		if(dataValue1 && dataValue2){
			var alls = dataValue1 + dataValue2;
			var val = 100 / alls;
			width = dataValue1 * val;
			width = (width > 100 ? 100 : width) + '%';
		}
		else if(dataValue1 && !dataValue2){
			width = '100%';
		}
		else if(!dataValue1 && dataValue2){
			width = '0';
		}
		setting.tempHtml.find('.'+ interactiveSeting.progressTarget).css('width', width);

		setting.tempHtml.find('.'+interactiveSeting.progressLabel1).html(dataValue1);
		setting.tempHtml.find('.'+interactiveSeting.progressLabel2).html(dataValue2);
	};

	/**
	 * @param {String/Object} key 需要设置的键名，也可以是一个键值对的对象
	 * @param {String} val 需要设置键的值
	 * @return {Object} 当前对象
	 */
    var set = function(key, val){

    	if(typeof(key) == 'object'){
    		for(var temp in key){
    			setting[temp] = key[temp];
    		}
    	}
    	else if(val && key){
    		setting[key] = val;
    	}
    	
    	return _this;
    };

    var disabled = function(){
    	setting.tempHtml.find('.likes-btn-add').addClass(setting.interactiveSeting.disabled);

    	return _this;
    };

    var enabled = function(){
    	setting.tempHtml.find('.likes-btn-add').removeClass(setting.interactiveSeting.disabled);

    	return _this;
    };

    /**
     * 设置点赞器值
     */
    var setLikesValue = function(val1, val2){
		var ValKey = setting.dataKey.val,
			interactiveSeting = setting.interactiveSeting;
		var tempVal1 = setting.data[0][ValKey],
			tempVal2 = setting.data[1][ValKey];

		setting.data[0][ValKey] = val1!= undefined ? val1 : ((tempVal1 || 0) + 1);
		setting.data[1][ValKey] = val2!= undefined ? val2 : ((tempVal2 || 0) + 1);

		setting.tempHtml.find('.'+interactiveSeting.firstParty).attr('data-val', setting.data[0][ValKey]);
		setting.tempHtml.find('.'+interactiveSeting.secondParty).attr('data-val', setting.data[1][ValKey]);

		renderAnimation();

		if(customEvent){
			var likesCountEvent = customEvent['onLikesCount'];
			if(likesCountEvent){
				likesCountEvent.call(_this, setting.data);
			}
		}
    };

    render();


    _this.set = set;

    _this.disabled = disabled;

    _this.enabled = enabled;

    _this.onLikesCount = function(fun){
    	if(fun){
    		customEvent = customEvent || {};
    		customEvent['onLikesCount'] = fun;
    	}

		return _this;
    };

};

//输出(接口)
module.exports = function(options){
	return new Likes(options);
};