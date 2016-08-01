var App = App || {};
App.PDP = App.PDP || {};
App.PDP.Bundle = App.PDP.Bundle || {};

App.PDP.Bundle.Controller = new (function() {
	var $buyingChoicesDesc = $('.section.buyingChoices.descContent'),
		$topLinks = $('.section.bundleContent .inner > div'),
		$tabs = $buyingChoicesDesc.find('.tabLinks li'),
		$sections = $buyingChoicesDesc.find('.sections > div'),
		className = 'current',
		showSection = function(index) {
			$tabs.filter('.' + className).removeClass(className);
			$sections.filter('.' + className).removeClass(className);
			$sections.eq(index).addClass(className);
		};

	$topLinks.on('click', function(e){
		var index = $.inArray(this, $topLinks);
		e.preventDefault();
		showSection(index);
		$(this).addClass(className);
		$tabs.eq(index).addClass(className);
		$(window).trigger('resize');

	});
	$tabs.on('click', function(){
		var index = $.inArray(this, $tabs);
		showSection(index);
		$(this).addClass(className);
		$(window).trigger('resize');

	});
	
});
