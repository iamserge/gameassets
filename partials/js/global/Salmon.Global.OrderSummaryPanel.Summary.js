var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.OrderSummaryPanel = Salmon.Global.OrderSummaryPanel || {};

/**
 * This controls the UI element for the summary of what's in the user's basket. This value can be updated using this control
 * @author Pawel Magrian
 * @name Summary
 * @class Singleton
 * @static
 * @constructor
 * @memberOf Salmon.Global.OrderSummaryPanel
 * @requires 
 * 	jQuery1.4.2.js
 */
Salmon.Global.OrderSummaryPanel.Summary = new(function() {
  // the root DOM element
  // var $root;
  var shipping;
  var total;
  var description;
  var value;
  var ukVatAppliedTotal;
  /* jshint -W069 */
  var isNewCheckout = Game.featureToggles['NewCHECKOUT'] === true;
  /**
   * initialise onDomReady by finding dom element
   * @function
   * @private
   * @memberOf Salmon.Global.OrderSummaryPanel.Summary
   */
  function init() {
    // find shipping value for desktop site
    if (isNewCheckout) {
      shipping = $('#orderSummary .shipping .value');
      total = $('#orderSummary .total .value');
    } else {
      shipping = $("#secondary li.shipping span.value");

      // find total value for desktop site
      total = $("#secondary li.total span.value");


    }


    ukVatAppliedTotal = $('.ukVatAppliedTotal');

    if (description === null || value === null) return;
  }

  /**
   * update the html for the summary paragraph
   * @function
   * @name updateHtml
   * @memberOf Salmon.Global.OrderSummaryPanel.Summary
   * @param {String} html The string of html to update the element with when a product is added to basket
   */
  function updateValues(json) {
    if (!json) return;
    $(shipping).html(json.totalShippingCharge);
    $(total).html(json.totalToPay);
    if (json.ukVatAppliedTotal) ukVatAppliedTotal.html(json.ukVatAppliedTotal);
    if (json.sSupplierId !== null && json.sSubgroup !== null && json.sDesc !== null && json.sCost !== null) {
      description = $("#secondary ul.basketItems p.delivery span.description_" + json.sSupplierId + "_" + json.sSubgroup);
      value = $("#secondary ul.basketItems p.delivery span.value_" + json.sSupplierId + "_" + json.sSubgroup);
      if (description !== null && value !== null) {
        $(description).html(json.sDesc);

        if (json.gameSubgrId == json.sSupplierId) {
          $(value).html("");
        } else if (json.sDesc !== "") {
          $(value).html("&pound;" + json.sCost);
        }
      }
    }
  }

  $(init);

  this.updateValues = updateValues;
});
