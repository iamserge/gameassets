var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.OrderSummaryPanel = Salmon.Global.OrderSummaryPanel || {};

/**
 * Will respond to the "Salmon.Global.CustomEvents.anonDeliveryUpdated" event and call the necessary
 * OrderSummaryPanel methods to control the user interface.
 * @author Pawel Magrian
 * @class Singleton
 * @static
 * @requires 
 * 	jQuery1.4.2.js
 * 	<br/>Salmon.Global.CustomEvents.js
 * 	<br/>Salmon.Global.OrderSummaryPanel.*.js
 */
Salmon.Global.OrderSummaryPanel.Controller = new(function() {
  $(document).bind(Salmon.Global.CustomEvents.anonDeliveryUpdated, function(e, json) {
    // check if Adoro is an object - if it's mobile site then Adoro is not defined
    if (typeof Adoro == 'object') {
      if (Adoro.Dialogue) {
        Adoro.Dialogue.hideDialogue();
      }
    }

    if (!json.errorMessage) {
      Salmon.Global.OrderSummaryPanel.Summary.updateValues(json);
    } else {
      new Salmon.Global.ErrorMessage(json.errorMessage);
    }
  });
});
