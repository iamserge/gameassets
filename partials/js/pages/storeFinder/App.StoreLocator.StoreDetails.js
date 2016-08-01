var App = App || {};
App.StoreLocator = App.StoreLocator || {};

App.StoreLocator.StoreDetails = new (function() {
	
	var $node = null,
	$map = null
	stores = [];

	$(init)
	
	function init() {
		$node = $("#storeDetails");
		if ($node.length === 0) return;		
		createStoreMap();
		setupControls();
	}
	
	function createStoreMap() {
		if (document.getElementById("storeMap")) {
			$map = $("#storeMap");
		} else {
			$(document.createElement("div")).attr("id", "storeMap");
			$node.after($map);
		}	
		getStoreCoords();
		createGoogleMap();
	}
	
	function getStoreCoords() {
		var $storeList = $node.find("div.store").andSelf();
		stores.push(new App.StoreLocator.Store($storeList[0]));
	}
	
	function createGoogleMap() {
		if (Salmon.Components) {
			if (Salmon.Components.GoogleMaps) {
				new Salmon.Components.GoogleMaps($map[0], stores, { zoom: 15 })
			}
		}
	}
	
	function setupControls() {
		var $controls = $("#storeControls");
		if ($controls.length === 0) return;
		
		var $action = $controls.find("ul.action").removeClass("hide");
		$action.find("li.print").find("a").bind("click", printPage);
		$action.find("li.back").find("a").bind("click", goBack);
	}
	
	function printPage(event) {
		event.preventDefault();
		window.print();
	}
	
	function goBack(event) {
		event.preventDefault();
		window.history.back();
	}
});