var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.MiniBasket = Salmon.Global.MiniBasket || {};

/**
 * This controls the UI element for the summary of what's in the user's basket. This value can be updated using this control
 * @author Adam Silver
 * @name Summary
 * @class Singleton
 * @static
 * @constructor
 * @memberOf Salmon.Global.MiniBasket
 * @requires 
 * 	jQuery1.4.2.js
 */
Salmon.Global.MiniBasket.Summary = new(function() {
  // the root DOM element
  var rootSelector;

  /**
   * initialise onDomReady by finding dom element
   * @function
   * @private
   * @memberOf Salmon.Global.MiniBasket.Summary
   */
  function init() {
    if (Salmon.Global.FeatureToggles.getFeature('NewHeaderAndFooter'))
      rootSelector = '#basketLink .text';
    else
      rootSelector = "#miniShoppingBagWrapper .basketQty";
  }

  /**
   * update the html for the summary paragraph
   * @function
   * @name updateHtml
   * @memberOf Salmon.Global.MiniBasket.Summary
   * @param {String} html The string of html to update the element with when a product is added to basket
   */
  function updateHtml(quantity) {
    if (!quantity) return;
    $(rootSelector).html(parseInt(quantity, 10));
  }

  $(init);
  this.updateHtml = updateHtml;
});
