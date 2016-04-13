

module.exports = {
	countDown: function(endDate, callBack){
		var timerID = null;   
		var timerRunning = false;
		endDate = new Date(endDate);
		var year = endDate.getYear(),
			month = endDate.getMonth(),
			date = endDate.getDate(),
			hour = endDate.getHours(),
			minute = endDate.getMinutes(),
			second = endDate.getSeconds();

		function showtime() {
			Today = new Date();
			var NowHour = Today.getHours();   
			var NowMinute = Today.getMinutes();   
			var NowMonth = Today.getMonth();   
			var NowDate = Today.getDate();   
			var NowYear = Today.getYear();   
			var NowSecond = Today.getSeconds();   
			/*if (NowYear <2000){ 
				//NowYear=1900+NowYear;   
				//Today = null;
			}*/
			Hourleft = hour - NowHour,
			Minuteleft = minute - NowMinute,
			Secondleft = second - NowSecond,
			Yearleft = year - NowYear,
			Monthleft = month - NowMonth - 1,
			Dateleft = date - NowDate;

			if (Secondleft<0)   
			{   
				Secondleft=60+Secondleft;   
				Minuteleft=Minuteleft-1;   
			}   
			if (Minuteleft<0)   
			{    
				Minuteleft=60+Minuteleft;   
				Hourleft=Hourleft-1;   
			}   
			if (Hourleft<0)   
			{   
				Hourleft=24+Hourleft;   
				Dateleft=Dateleft-1;   
			}   
			if (Dateleft<0)   
			{   
				Dateleft=31+Dateleft;   
				Monthleft=Monthleft-1;   
			}   
			if (Monthleft<0)   
			{   
				Monthleft=12+Monthleft;   
				Yearleft=Yearleft-1;   
			}   
			Temp=Yearleft+'-'+Monthleft+'-'+Dateleft+' '+Hourleft+':'+Minuteleft+':'+Secondleft;
			var dateObj = {
				year: Yearleft,
				month: Monthleft,
				day: Dateleft,
				hour: Hourleft,
				minute: Minuteleft,
				second: Secondleft
			}
			//document.getElementById('J-test').innerHTML=Temp;   
			timerID = setTimeout(showtime,1000);   
			timerRunning = true;

			if(Today.getTime() > endDate.getTime()){
				stopclock();
			}
			if(callBack){
				callBack.call(dateObj, Temp, timerRunning);
			}
		} 

		var timerID = null;   
		var timerRunning = false;   
		function stopclock () {   
			if(timerRunning){
				clearTimeout(timerID);   
				timerRunning = false;   
			}
		}
		function startclock () {   
			stopclock();   
			showtime();   
		}
		startclock();
	}
};