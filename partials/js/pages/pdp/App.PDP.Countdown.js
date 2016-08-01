var App = App || {};
App.PDP = App.PDP || {};


App.PDP.DeliveryCountdown =  (function() {
	var $container = $('.section.deliveryCountdown'),

		countDownInfo = Game.CurrentPage.CountDownInfo,

		deadline,

		getTodayDateFromTime = function(time){
			var d = new Date(),
				hours = parseInt(time.split(':')[0]),
				minutes = parseInt(time.split(':')[1]);
			d.setHours(hours);
			d.setMinutes(minutes);
			d.setSeconds(0);
			return d;
		},

		getTimeRemaining = function(currentTime){
		  	var t = Date.parse(deadline) - Date.parse(currentTime);
			return {
			    'total': t,
			    'hours': Math.floor( (t/(1000*60*60)) % 24 ),
			    'minutes': Math.floor( (t/1000/60) % 60 )

			};
		},

		isInBetweenTime = function(afterTime, cutoffTime, time){
			deadline = getTodayDateFromTime(cutoffTime);
			return time > getTodayDateFromTime(afterTime) && time < deadline;
		},

		countDownShouldBeDisplayed = function(){

			var timeToDisplayCountdown = deadline;
			timeToDisplayCountdown.setHours(deadline.getHours() - parseInt(countDownInfo.countDownDisplayBeforeTime));
			
			return new Date() > timeToDisplayCountdown;
		},

		displayMessage = function(){
			$container.html('<p class="before">' + countDownInfo.countDownBeforeMessage + '</p>');
		},

		updateInterval = function($hours, $minutes){
			var currentTime = new Date();
			if (isInBetweenTime(countDownInfo.countDownStartTime, countDownInfo.countDownCutoffTime, currentTime)){
				var timeRemaining = getTimeRemaining(currentTime),
					hoursTitle = (timeRemaining.hours == 1) ? 'hour ' : 'hours ',
					minutesTitle = (timeRemaining.minutes == 1) ? 'minute' : 'minutes';

				$hours.html('<span>' + timeRemaining.hours + '</span> ' + hoursTitle);
				$minutes.html('<span>' + timeRemaining.minutes + '</span> ' + minutesTitle);
			} else {
				$container.hide();
			}
		}

		displayCountdown = function(){
			var $hours = $('<span />',{class: 'hours'}),
				$minutes = $('<span />', {class: 'minutes'}),
				$time = $('<span />', {class: 'time'}).append($hours).append($minutes);


			$container.html('<p class="after">' + countDownInfo.countDownMessage + '</p>');
			$container.find('span').replaceWith($time);
			
			updateInterval($hours, $minutes);
			setInterval(function(){
				updateInterval($hours, $minutes);
			}, 60000)
		},

		init = function(){
			countDownInfo = Game.CurrentPage.CountDownInfo;
			
			if (countDownShouldBeDisplayed())
				displayCountdown();
			else
				displayMessage();

		};



	if (
		$container.length > 0 
		&& typeof Game.CurrentPage.CountDownInfo != 'undefined' 
		&& isInBetweenTime(Game.CurrentPage.CountDownInfo.countDownStartTime, Game.CurrentPage.CountDownInfo.countDownCutoffTime, new Date())
	) init();


	return {
		getTodayDateFromTime: getTodayDateFromTime,
		isInBetweenTime: isInBetweenTime
	}
})();