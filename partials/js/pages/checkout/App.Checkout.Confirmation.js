var App = App || {};
App.Checkout = App.Checkout || {};
App.Checkout.Confirmation = App.Checkout.Confirmation || {};

App.Checkout.Confirmation.Controller = new(function() {
  $(init);

  function init() {
    if (document.getElementById("privacyPolicy")) {
      new App.Global.StaticPageOverlay(document.getElementById("privacyPolicy"));
    }
  }
});


/* Delivery details overlay */

App.Checkout.Confirmation.sellerDeliveryDetailsOverlay = (new function() {

  var html = "";
  var orderData = "";
  var overlayButton;

  $(init);

  function init() {
    var overlayID = "";
    var overlayHtml = "";
    // var data = "";
    // var vendorResponseData = "";

    $('.overlay').click(function(e) {
      e.preventDefault();

      overlayButton = $(this);

      // Get the href of the link that has been clicked - this is the id of the overlay div to be used
      overlayID = $(this).attr("href");

      // Copy the overlay content HTML so that it can be manipulated before displaying it in the overlay 
      overlayHtml = $(overlayID).clone();

      // Store the data that is stored in the table row			
      if ($(this).parents("td").data('order') !== undefined) {
        orderData = $(this).parents("td").data('order');
      }

      // If the overlay is to display the seller delivery information - need to do an AJAX call but using hardcoded JSON for now.
      if ($(this).hasClass("sellerDeliveryCTA")) {
        overlayHtml = getDeliveryInformation(overlayHtml);
        console.log("overlay content " + $(overlayHtml));
      }


      $('.closeOverlay').click(function(e) {
        e.preventDefault();
        Adoro.Dialogue.hideDialogue();
      });
    }); // overlay click function

  } //init

  function showDialogue(overlayHtml) {

    var dialogueOverlayContent, dialogueData = "";

    // Set the new content as the html for the overlay
    html = $(overlayHtml).html();

    Adoro.Dialogue.setHtml(html);

    if (orderData !== "") {
      if ($("#dialogue").find(".overlayContent") !== null) {
        dialogueOverlayContent = $("#dialogue").find(".overlayContent");
      }

      if (dialogueOverlayContent.html() !== "" && dialogueOverlayContent.html() !== null) {
        $(dialogueOverlayContent).data("order", orderData);
        dialogueData = $(dialogueOverlayContent).data("order");
      }
    }

    Adoro.Dialogue.showDialogue({ showOverlay: true, overlayOpacity: "0.8", closeOnOverlayClick: true });

    //Reset orderData to a blank string in case there is more than one overlay on the page
    orderData = "";

    return false;

  } //showDialogue


  // Get the delivery information for the seller delivery information overlay.
  function getDeliveryInformation(deliveryOverlayHtml) {

    var ajax = new App.Global.Ajax();
    var url = '/webapp/wcs/stores/servlet/AJAXMarketplaceSellerDeliveryDetails';
    var options = {};
    if (orderData.vendorShopId) {
      options = {
        vendorShopId: orderData.vendorShopId
      };
    } else {
      options = {
        vendorShopId: "0000"
      };
    }

    var VendorData;

    // Get the handle for the seller logo image and rating
    var sellerLogo = $(deliveryOverlayHtml).find("img");
    var ratingDiv = $(deliveryOverlayHtml).find(".rating");

    var deliveryTableBody = "";

    ajax.getData('GET', url, options, function(response) {
      if (response.status == 200) {
        VendorData = JSON.parse(response.content.replace('/*', '').replace('*/', ''));

        // Populate the seller name
        $(deliveryOverlayHtml).find(".sellerName").html(VendorData.supplier.name);

        // We need to know the naming convention so that the source of the image can be set appropriately.
        $(sellerLogo).attr("src", Salmon.Global.PageContext.MARKETPLACE_SELLER_LOGO_URL_LARGE + orderData.vendorShopId + ".png");
        var vendorRating = (VendorData.supplier.ratingStars % 1 === 0) ? VendorData.supplier.ratingStars : 5 * Math.round(VendorData.supplier.ratingStars * 10 / 5);

        // Add the appropriate star ratings class
        ratingDiv.attr("class", "rating rating" + vendorRating);

        // Populate the rating count
        $(deliveryOverlayHtml).find(".ratingCount").html("(" + VendorData.supplier.ratingCount + ")");

        // Populate the seller intro text
        $(deliveryOverlayHtml).find(".sellerInfo").html(VendorData.supplier.sellerInfo);

        // Populate the shipping table data
        var parsedShipping = JSON.parse(VendorData.shipping);
        for (var i = 0; i < parsedShipping.length; i++) {
          deliveryTableBody +=
            '<tr>' +
            '<th scope="row">' + parsedShipping[i].region + '</th>' +
            '<td>' + parsedShipping[i].label + ' </td>' +
            '</tr>';
        }

        // Append the table rows to the tbody
        $(deliveryOverlayHtml).find("tbody").html(deliveryTableBody);

        showDialogue(deliveryOverlayHtml);

      } else {
        // handle errors
        /* jshint -W069 */
        App.PDP.Marketplace.Data['error'] = 'Sorry an error occured';
      }
    }); //ajax.getData
  } //getDeliveryInformation

});
