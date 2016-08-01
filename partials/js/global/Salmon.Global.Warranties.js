var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.Warranties = Salmon.Global.Warranties || {};
/**
 * Warranties
 * @author Serge Radkevics
 * @name Fixes
 * @class Singleton
 * @static
 * @constructor
 * @memberOf Salmon.Global
 * @requires 
 * 	jQuery1.3.1.js
 * 	<br/>Adoro.DropDownMenu.js
 */
Salmon.Global.Warranties.Controller = new(function() {

  $(document).bind(Salmon.Global.CustomEvents.warrantyAddedToTheBasket, function(e, json) {
    if (!json.errorMessage) {
      if (json.coremetrics) {
        Salmon.Global.MiniBasket.RecentlyAdded.callCoremetrics(json.coremetrics);
      }

      //Salmon.Global.MiniBasket.RecentlyAdded.show(json.smallRecentlyAddedHtml);
      Salmon.Global.MiniBasket.ItemsList.updateHtml(json.itemsListHtml);
      Salmon.Global.MiniBasket.Summary.updateHtml(json.orderQuantity);

    } else {
      new Salmon.Global.ErrorMessage(json.errorMessage);
    }
  });
});

Salmon.Global.Warranties.AddWarrantyToTheBasket = function(url, callback) {

  var status = {
      addingToBasket: false
    },

    queueName = "AddToBasket",

    addProductToBasket = function() {
      if (status.addingToBasket) {
        $(document).queue(queueName, function() {
          sendRequest();
        });
      } else {
        sendRequest();
      }
    },

    sendRequest = function() {

      status.addingToBasket = true;

      return $.ajax({
        url: url.split('?')[0],
        data: url.split('?')[1],
        dataType: "json",
        success: productAdded,
        error: ajaxError
      });
    },
    ajaxError = function() {
      callback('error');
    },
    productAdded = function(json) {
      status.addingToBasket = false;
      if (!json) return;

      $(document).trigger(Salmon.Global.CustomEvents.warrantyAddedToTheBasket, json);
      $(document).dequeue(queueName);
      if (typeof callback === 'function') callback(json);



    };



  addProductToBasket();

};
Salmon.Global.Warranties.WarrantiesTermsOverlay = function() {
  $(document).ready(function() {
    var $overlay = $('#overlay'),
      $overlayInner, $closeLink,
      openOverlay = function($link) {
        $overlay.show();
        $overlayInner = $link.parent().find('.warrantyOverlayInner');

        $overlayInner.show();
        $closeLink = $overlayInner.find('.close');

        $overlay.on('click', closeOverlay);
        $closeLink.on('click', function(e) {
          e.preventDefault();
          closeOverlay();
        });
      },

      closeOverlay = function() {
        $overlay.hide();
        $overlayInner.hide();

        $overlay.off('click');
        $closeLink.off('click');


      };


    $('.warrantyOverlayLink').on('click', function(e) {
      e.preventDefault();
      openOverlay($(this));
    });

  });
};

Salmon.Global.Warranties.AddToBasketOverlay = function() {
  var showSuccessOverlay = function() {
      var $overlay = $('#dialogue #warrantySuccess'),
        $close = $overlay.find('.close');

      if ($overlay.hasClass('error')) {
        $overlay.html($overlay.data('successMessage')).removeClass('error');
      }
      $overlay.fadeIn();
      $close.on('click', function(e) {
        e.preventDefault();
        $overlay.fadeOut();
      });
      setInterval(function() {
        $overlay.fadeOut();
      }, 2500);

    },
    showErrorOverlay = function() {
      var $overlay = $('#dialogue #warrantySuccess'),
        $close = $overlay.find('.close');
      $overlay.data('successMessage', $overlay.html()).addClass('error');
      $overlay.html('Sorry, warranty is out of stock');
      $overlay.fadeIn();
      $close.on('click', function(e) {
        e.preventDefault();
        $overlay.fadeOut();
      });
      setInterval(function() {
        $overlay.fadeOut();
      }, 2500);

    },
    hideWarranties = function(button) {
      if ($('#dialogue #warranty .inner').length > 1) {
        $(button).parent().parent().fadeOut(function() {
          $(this).remove();
        });
      } else {
        $('#dialogue #warranty').height(0);
        $('#dialogue').css('top', parseInt($('#dialogue').css('top'), 10) + 106);
      }
    },
    updateOverlay = function(json) {
      $('#dialogue .orderDetails .orderSum').html(json.orderSum);
      $('#dialogue .orderDetails .basketNumber').text(parseInt(json.orderQuantity, 10) + " " + $('#dialogue .orderDetails .basketNumber').text().split(' ')[1]);
    },

    init = function() {

      //Add initial href value for Add warranty button
      $('.selectWarrantyLength').each(function() {
        $(this).parent().parent().find('.addWarrantyToTheBasket').attr('href', $(this).val());
      });


      //bind select boxes to chage href
      $(document).on('click', '.selectWarrantyLength', function() {
        $(this).parent().parent().find('.addWarrantyToTheBasket').attr('href', $(this).val());
      });

      //bind add warranty button
      $(document).on('click', '.addWarrantyToTheBasket', function(e) {
        e.preventDefault();
        var button = this;
        Salmon.Global.Warranties.AddWarrantyToTheBasket($(this).attr('href'), function(json) {
          if (json != 'error') {
            showSuccessOverlay();
            hideWarranties(button);
            updateOverlay(json);
          } else {
            showErrorOverlay();

          }
        });
      });

      //remove warranties on "may be later" button click
      $(document).on('click', '#warranty .later', function(e) {
        e.preventDefault();
        hideWarranties(this);
      });
    };

  init();
};
