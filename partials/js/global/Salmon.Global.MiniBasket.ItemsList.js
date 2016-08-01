var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.MiniBasket = Salmon.Global.MiniBasket || {};

/**
 * This controls the UI element that shows the list of products in the users basket. This UI element
 * is shown and hidden on certain mouse events. The list of products can be updated.
 * @author Adam Silver
 * @name ItemsList
 * @class Singleton
 * @static
 * @constructor
 * @memberOf Salmon.Global.MiniBasket
 * @requires 
 * 	jQuery1.4.2.js
 * 	<br/>Salmon.Global.MiniBasket.RecentlyAdded.js
 */
Salmon.Global.MiniBasket.ItemsList = new(function() {

  var rootSelector,
    miniShoppingBagRootSelector;
    // cssHideClass = "hide";

  /**
   * initialise onDomReady by finding dom elements and binding events
   * @function
   * @private
   * @inner
   * @memberOf Salmon.Global.MiniBasket.ItemsList
   */
  function init() {
    miniShoppingBagRootSelector = "#miniShoppingBagWrapper";

    if (Salmon.Global.FeatureToggles.getFeature('NewHeaderAndFooter'))
      rootSelector = '.dropdownMenu.dropdownCart.basket';
    else
      rootSelector = "#miniShoppingBagWrapper .shoppingBagSummary";
  }

  /**
   * update the html for the items list
   * @name updateHtml
   * @function
   * @memberOf Salmon.Global.MiniBasket.ItemsList
   * @param {String} html The string of html to update the element with when a product is added to basket
   */
  function updateHtml(html) {
    if (typeof $(rootSelector) === "undefined") return;
    if (typeof html !== "string") return;

    if ($(html).find("div.product").length > 0) {
      $(miniShoppingBagRootSelector).parent().addClass("miniShoppingBagHasItems");
    } else {
      $(miniShoppingBagRootSelector).parent().removeClass("miniShoppingBagHasItems");
    }

    $(rootSelector).empty().append(html);
  }

  $(init);

  this.updateHtml = updateHtml;
});
