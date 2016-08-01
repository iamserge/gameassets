var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};


/**
 * This control applies functionality to DeliveryUpdate form in express checkout. This control is responsible
 * for submit the forms via AJAX.
 * @author Pawel Magrian
 * @name DeliveryUpdateExpress
 * @class Singleton
 * @static
 * @constructor
 * @memberOf Salmon.Global
 * @requires jQuery1.4.2.js
 **/
Salmon.Global.DeliveryUpdateExpress = new(function() {
  $(init);

  // the form node inside jQuery collection
  // var $form = null;

  // the jQuery queue name
  var queueName = "DeliveryUpdateExpress";

  // will keep track of whether a delivery is being updated
  var status = {
    updatingDeliveryCharges: false
  };

  /**
   * Delivery update form handler
   * @constructor
   * @private
   * @memberOf Salmon.Global.DeliveryUpdate
   * @class AnonDeliveryUpdateForm Represents a delivery update form for handling AJAX delivery-update functionality
   * @param {Node} form The form element
   * @return {Object} as instance of AnonDeliveryUpdateForm
   **/
  function DeliveryUpdateExpressForm(form, selectedShippingId, selectedShippingInfo, isClickAndCollect) {
    var $form = $(form);
    updateExpressDelivery();

    /**
     * this is called when the form is submitted
     * @name form_onSubmit
     * @memberOf AnonDeliveryUpdateForm
     * @param e the event
     */
    function form_onSubmit(e) {
      e.preventDefault();
      updateExpressDelivery();
    }

    /**
     * will check if a delivery is currently being updated to basket
     * <br/><br/> if it is then the request is added to the queue
     * <br/><br/> otherwise the request is called immediately
     * @name updateExpressDelivery
     * @memberOf DeliveryUpdate
     **/
    function updateExpressDelivery() {
      // if in the middle of updating delivery charges
      if (status.updatingDeliveryCharges) {
        // add request to queue
        $(document).queue(queueName, function() {
          sendRequest();
        });
      } else {
        // send request immediately
        sendRequest();
      }
    }

    /**
     * fires the AJAX request
     * <br/><br/> when it completes successfully expressDeliveryUpdated is called
     * @name sendRequest
     * @memberOf DeliveryUpdate
     * 
     **/
    function sendRequest() {
      var url = $form.find('input[name="expDeliveryUpdateAJAXURL"]').val();
      Salmon.Global.uiBlocker.blockUI();
      var data = $form.serialize();
      if (typeof isClickAndCollect == 'undefined') {
        isClickAndCollect = 'false';
      }
      var QueryStringToJSON = function(string) {
        var pairs = string.split('&');

        var result = {};
        pairs.forEach(function(pair) {
          pair = pair.split('=');
          result[pair[0]] = decodeURIComponent(pair[1] || '');
        });

        return JSON.parse(JSON.stringify(result));
      };
      var jsonFromData = QueryStringToJSON(data);
      jsonFromData.selectedShipMode = true;
      jsonFromData.selectedShippingId = selectedShippingId;
      jsonFromData.selectedShippingInfo = selectedShippingInfo;
      jsonFromData.collectionSelected = isClickAndCollect;
      if (typeof jsonFromData.homeDeliveryPostcode != 'undefined') jsonFromData.homeDeliveryPostcode = jsonFromData.homeDeliveryPostcode.replace(/\+/, '');
      data = $.param(jsonFromData);
      status.updatingDeliveryCharges = true;

      // this code snippet makes an ajax call to provided URL and returns a JSON object created in DeliveryOptionsRadioJsonResponse.jsp
      // returned json object is used by Salmon.Global.OrderSummaryPanel.Summary to update $shipping and $total in HTML
      return $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        success: expressDeliveryUpdated,
        error: function(jqXHR, exception) {
          Salmon.Global.uiBlocker.unblockUI();
          if (jqXHR.status === 0) {
            console.log('Not connect.\n Verify Network.');
          } else if (jqXHR.status == 404) {
            console.log('Requested page not found. [404]');
          } else if (jqXHR.status == 500) {
            console.log('Internal Server Error [500].');
          } else if (exception === 'parsererror') {
            console.log('Requested JSON parse failed.');
            console.log(jqXHR);
          } else if (exception === 'timeout') {
            console.log('Time out error.');
          } else if (exception === 'abort') {
            console.log('Ajax request aborted.');
          } else {
            console.log('Uncaught Error.\n' + jqXHR.responseText);
          }
        }
      });
    }

    /**
     * when the AJAX request is successful this function is called
     * <br/><br/>will trigger a custom event to notify any listeners
     * <br/><br/>will also trigger the next request in the queue, if any exist
     */
    function expressDeliveryUpdated(json) {
      Salmon.Global.uiBlocker.unblockUI();
      status.updatingDeliveryCharges = false;
      if (!json) return;
      $(document).trigger(Salmon.Global.CustomEvents.expressDeliveryUpdated, json);
      $(document).dequeue(queueName);
    }
  }

  /**
   * initialise each instance of the delivery update form
   * @function
   * @private
   * @memberOf Salmon.Global.DeliveryUpdate
   */
  function init() {
    var forms = $('form.deliveryUpdateExpress');
    for (var i = forms.length - 1; i >= 0; i--) {
      new DeliveryUpdateExpressForm(forms[i]);
    }
  }

  this.DeliveryUpdateExpressForm = DeliveryUpdateExpressForm;
});
