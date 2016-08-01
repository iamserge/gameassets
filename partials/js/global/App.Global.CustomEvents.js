var App = App || {};
App.Global = App.Global || {};

/**
 * Stores a bunch of re-usable custom events that are specific to the Game application to tap into.
 * If it is a custom event used by a re-useable Salmon component then take a look at Salmon.Global.CustomEvents.js
 * It is not a technical requirement that this namespace is used but it serves two purposes:
 * <br/>1) Re-use by ensuring that you don't create two different instances
 * of a custom event
 * <br/>2) Due to jQuery there is no other way of keeping track of what custom events exist
 * @author Adam Silver
 * @namespace Stores custom events
 * @example 
 * $(document).bind(App.Global.CustomEvents.myCustomEvent, function() {});
 * $(document).trigger(App.Global.CustomEvents.myCustomEvent, {});
 * @requires
 * 	jQuery1.4.2.js
 */
App.Global.CustomEvents = {
	eventName1: "eventName1",
	priceAlertFormValid: "App.Global.CustomEvents.priceAlertFormValid"
};