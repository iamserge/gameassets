var App = App || {};
App.StoreLocator = App.StoreLocator || {};

App.StoreLocator.SearchResults = new (function() {
	
	var $node = null,
		$map = null
		stores = [];
	
	$(init)
	
	function init() {
		validateInput();
		$node = $("#storeList");
		if ($node.length === 0) return;		
		createStoreMap();

	}
	
	function createStoreMap() {
		$map = $(document.createElement("div")).attr("id", "storeMap");
		$node.after($map);
		getStoreCoords();
		createGoogleMap();
	}
	
	function getStoreCoords() {
		var $storeList = $node.find("div.store");
		for (var i=0; i < $storeList.length; i++) {
			stores.push(new App.StoreLocator.Store($storeList[i]));
		}
	}
	
	function createGoogleMap() {
		if (Salmon.Components) {
			if (Salmon.Components.GoogleMaps) {
				new Salmon.Components.GoogleMaps($map[0], stores, { autoZoom: true, zoom: 15 })
			}
		}
	}

	function validateInput(){
		var $postcodeInput = $('#locateStore #storeLocInput'),
			$postcodeSubmit = $('#locateStore .findStore'),
			validate = function(val) {
		    if (typeof val != 'undefined' && val.length > 0) 
		        $postcodeSubmit.removeClass('disabled');
		    else 
		        $postcodeSubmit.addClass('disabled');
		}
		validate($postcodeInput.val());
		$postcodeInput.on('keyup', function(){
		    validate($postcodeInput.val());
		});
	}
});