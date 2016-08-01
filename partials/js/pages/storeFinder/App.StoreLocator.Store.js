var App = App || {};
App.StoreLocator = App.StoreLocator || {};

App.StoreLocator.Store = (function(node) {
	var $node = $(node),
		longitude = null,
		latitude = null,
		storeName = null
		storeMessage = null;
	
	init();
	
	function init() {
		var coord = ($node.attr("rel")).split("|");
		if (coord.length === 2) {
			longitude = coord[0];
			latitude = coord[1];
		}
		
		var $storeNameNode = $node.find(":header:first"); 
		storeName = $storeNameNode.text();
		storeMessage = ("<h2>" + storeName + "</h2>") + $("<div />").append($storeNameNode.next("ul.adr").clone()).remove().html();
	}
	
	this.long = longitude;
	this.lat = latitude;
	this.name = storeName;
	this.message = storeMessage;
});