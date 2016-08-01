var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};

/**
 * A store for all custom events that are utilised by Salmon reusable components. If a Game specific component
 * needs to notify other controls that something has happened then use App.Global.CustomEvents.js.
 * It is not a technical requirement that this namespace is used but it serves two purposes:
 * <br/>1) Re-use by ensuring that you don't create two different instances
 * of a custom event
 * <br/>2) Due to jQuery there is no other way of keeping track of what custom events exist
 * @author Adam Silver
 * @namespace Stores custom events specifically for Salmon re-usable components
 * @example 
 * $(document).bind(Salmon.Global.CustomEvents.myCustomEvent, function() {});
 * $(document).trigger(Salmon.Global.CustomEvents.myCustomEvent, {});
 * @requires
 * 	jQuery1.4.2.js
 */

Salmon.Global.CustomEvents = {
  productAddedToBasket: "Salmon.Global.CustomEvents.productAddedToBasket",
  customProductAddedToBasket: "Salmon.Global.CustomEvents.customProductAddedToBasket",
  warrantyAddedToTheBasket: "Salmon.Global.CustomEvents.warrantyAddedToTheBasket",
  anonDeliveryUpdated: "Salmon.Global.CustomEvents.anonDeliveryUpdated",
  expressDeliveryUpdated: "Salmon.Global.CustomEvents.expressDeliveryUpdated"
};