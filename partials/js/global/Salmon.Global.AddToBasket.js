var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};

/**
 * This control applies functionality for all add-to-basket forms. This control is responsible
 * for submit the forms via AJAX.
 * @author Adam Silver
 * @name AddToBasket
 * @class Singleton
 * @static
 * @constructor
 * @memberOf Salmon.Global
 * @requires jQuery1.4.2.js
 **/
Salmon.Global.AddToBasket = new(function() {

  $(init);

  // the form node inside jQuery collection
  // var $form = null;

  // the jQuery queue name
  var queueName = "AddToBasket";

  // will keep track of whether a product is in the middle of being added to basket
  var status = {
    addingToBasket: false
  };

  /**
   * Add to basket form handler
   * @constructor
   * @private
   * @memberOf Salmon.Global.AddToBasket
   * @class AddToBasketForm Represents an add to basket form for handling AJAX add-to-basket functionality
   * @param {Node} form The form element
   * @return {Object} as instance of AddToBasketForm
   **/
  function AddToBasketForm(form) {
    var $form = $(form);

    $form.unbind("submit").bind("submit", form_onSubmit);

    /**
     * this is called when the form is submitted
     * @name form_onSubmit
     * @memberOf AddToBasketForm
     * @param e the event
     */
    function form_onSubmit(e) {
      //temporary fix
      if ($("body").hasClass("mobile") === false) {
        e.preventDefault();
      }

      addProductToBasket();
    }

    // Makes a call to the MiniBasket recommendations
    function IORecommendation(form, page) {
      var mediaId = $(form).find('input[name="mediaId"]').val() || null; // 198822; // 

      if (mediaId) {
        if (page == 'pgProductDetails') {
          new App.PDP.MiniBasketRecommendations(mediaId);
        } else if (page == 'pgProductLister') {
          new App.ProductLister.MiniBasketRecommendations(mediaId);
        } else if (page == 'pgSearchResults') {
          new App.SearchResults.MiniBasketRecommendations(mediaId);
        }
      }
    }

    /**
     * will check if a product is currently being added to basket
     * if it is then the request is added to the queue
     * otherwise the request is called immediately
     * @name addProductToBasket
     * @memberOf AddToBasket
     **/
    function addProductToBasket() {
      // if in the middle of adding a product to basket
      if (status.addingToBasket) {
        // add request to queue

      } else {
        // send request immediately
        sendRequest();
      }
    }

    /**
     * fires the AJAX request
     * when it completes successfully productAdded is called
     * @name sendRequest
     * @memberOf AddToBasket
     **/
    function sendRequest() {
      var url = $form.find('input[name="addToShoppingCartAJAXURL"]').val();
      var data = $form.serialize();

      status.addingToBasket = true;

      return $.ajax({
        url: url,
        data: data,
        dataType: "json",
        success: productAdded
      });
    }

    /**
     * when the AJAX request is successful this function is called
     * will trigger a custom event to notify any listeners
     * will also trigger the next request in the queue, if any exist
     **/
    function productAdded(json) {

      status.addingToBasket = false;
      if (!json) return;
      $(document).trigger(Salmon.Global.CustomEvents.productAddedToBasket, json);
      $(document).dequeue(queueName);

      if ($('div#dialogue div.Recommendations').length > 0) {
        if (document.body.id == 'pgProductDetails') {
          IORecommendation($form, 'pgProductDetails');
        } else if (document.body.id == 'pgProductLister') {
          IORecommendation($form, 'pgProductLister');
        } else if (document.body.id == 'pgSearchResults') {
          IORecommendation($form, 'pgSearchResults');
        }
      }
    }
  }

  function AddToBasketButton() {

    $(document).on('click', '.addToBasketMiniButton', function(e) {
      if ($('body').attr('id') != 'pgBasket') {
        e.preventDefault();
        addProductToBasket($(this));
      }
    });

    function addProductToBasket($elem) {
      if (status.addingToBasket) {

      } else {
        sendRequest($elem);
      }
    }

    function sendRequest($elem) {
      var url = $elem.attr('href').split('?')[0],
        data = $elem.attr('href').split('?')[1];
      status.addingToBasket = true;

      return $.ajax({
        url: url,
        data: data,
        dataType: "json",
        success: productAdded
      });
    }


    function productAdded(json) {
      status.addingToBasket = false;
      if (!json) return;
      $(document).trigger(Salmon.Global.CustomEvents.productAddedToBasket, json);
      $(document).dequeue(queueName);
    }
  }
  /**
   * initialise each instance of the add to basket form
   * @function
   * @private
   * @memberOf Salmon.Global.AddToBasket
   */
  function init() {
    if (!$("body").hasClass("checkout")) {
      var forms = $("form.addToBasketForm");
      for (var i = forms.length - 1; i >= 0; i--) {
        new AddToBasketForm(forms[i]);
      }
    }
    AddToBasketButton();
  }

  this.AddToBasketForm = AddToBasketForm;
});
