var App = App || {};
App.ProductLister = App.ProductLister || {};

App.ProductLister.Recommendations = function() {
	// Wait until the DOM is loaded before processing. 
	$(document).ready(function(){
		var categoryId = $('#masterCategory').text();
		
		var rec = {
			zoneId: "Cat_1",
			categoryId: categoryId
		};

		IO_getRecommendations([rec]);
	});
};
if (!Salmon.Global.FeatureToggles.getFeature('NewPLP')) App.ProductLister.Recommendations();
// This code gives recommendations based on the last item added to the basket
App.ProductLister.MiniBasketRecommendations = (function(mediaID) {
	var rec = {
		zoneId: "MBask_1",
		productId: mediaID,
		allowBuy: true
	};
	
	//Make request to our library
	IO_getRecommendations([rec]);
});