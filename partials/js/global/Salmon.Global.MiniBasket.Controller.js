var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.MiniBasket = Salmon.Global.MiniBasket || {};

/**
 * Will respond to the "Salmon.Global.CustomEvents.productAddedToBasket" event and call the necessary
 * MiniBasket methods to control the user interface.
 * @author Adam Silver
 * @class Singleton
 * @static
 * @requires 
 * 	jQuery1.4.2.js
 * 	Salmon.Global.CustomEvents.js
 * 	Salmon.Global.MiniBasket.*.js
 **/
Salmon.Global.MiniBasket.Controller = new(function() {
  $(document).bind(Salmon.Global.CustomEvents.productAddedToBasket, function(e, json) {
   

    if (!json.errorMessage) {
      // Salmon.Global.MiniBasket.RecentlyAdded.updateHtml(json.smallRecentlyAddedHtml);

      if (json.coremetrics) {
        Salmon.Global.MiniBasket.RecentlyAdded.callCoremetrics(json.coremetrics);
      }


      if (!Salmon.Global.FeatureToggles.getFeature('NewHeaderAndFooter')) Salmon.Global.MiniBasket.RecentlyAdded.show(json.smallRecentlyAddedHtml);
      Salmon.Global.MiniBasket.ItemsList.updateHtml(json.itemsListHtml);
      Salmon.Global.MiniBasket.Summary.updateHtml(json.orderQuantity);

      $(this).trigger(Salmon.Global.CustomEvents.customProductAddedToBasket, json);
    } else {
      if (!Salmon.Global.FeatureToggles.getFeature('NewHeaderAndFooter')) new Salmon.Global.ErrorMessage(json.errorMessage);
    }
  });
});
