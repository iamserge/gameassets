App = App || {};
App.Basket = App.Basket || {};

App.Basket.PerfectPartners = new(function() {

  $(function() {
    var $perfectPartners = $("#basketItems div.perfectPartners").find("a.perfectPartner");
    for (var i = 0; i < $perfectPartners.length; i++) {
      new App.Basket.QuickLook($perfectPartners[i]);
    }
  });

});

App.Basket.MissedPromotions = new(function() {

  $(function() {
    if (!document.getElementById("basketItems")) return;

    var $itemPromotionLists = $("#basketItems div.missedPromotion");
    for (var i = 0; i < $itemPromotionLists.length; i++) {
      var $itemPromotionList = $($itemPromotionLists[i]),
        $viewPromotions = $itemPromotionList.find("p.viewPromotions");

      if ($viewPromotions.length > 0) {
        var $promotions = $itemPromotionList.find("ul").addClass("hide");
        $viewPromotions.bind("click", { element: $promotions }, function(event) {
          var $el = event.data.element;
          if ($el.hasClass("hide")) {
            $el.removeClass("hide");
          } else {
            $el.addClass("hide");
          }
          return false;
        });
      }
    }
  });

});


App.Basket.FreeGiftExpired = new(function() {

  var html = "";

  $(init);

  function init() {
    if (!document.getElementById("basketItems")) return;

    var $freeGiftExpiredList = $("#basketItems").find("div.freeGiftExpired");
    for (var i = 0; i < $freeGiftExpiredList.length; i++) {
      var $freeGiftExpired = $($freeGiftExpiredList[i]);
      if ($freeGiftExpired.siblings().length > 0) {
        var $trigger = $freeGiftExpired.find("div:first-child"),
          $ems = $trigger.next();

        if ($ems.length > 0) {
          html = "<div id='freeGiftExpiredOverlay'>" + $ems.html() + "</div>";
          $ems.remove();

          $trigger.bind("click", showDialogue);
        }
      }
    }
  }

  function showDialogue() {
    Adoro.Dialogue.setHtml(html);
    Adoro.Dialogue.showDialogue({ showOverlay: true, overlayOpacity: "0", closeOnOverlayClick: true });
    return false;
  }

});

App.Basket.DeliveryOptions = new(function() {

  $(init);

  function init() {

    setupShippingMethodsSubmit();
    if ($('div#anonShippingMethods input.clickAndCollect').is(':checked')) {
      //$('div#anonShippingMethods').append('<input type="hidden" name="CurrentClickAndCollectSelected" id="CurrentClickAndCollectSelected" value="true" />');
      $('a.changeLocation').css('display', 'inline-block');
      if ($('input#CurrentClickAndCollect').val() == 'true') {
        //he store is already selected, so we should not clear the fields
        disableInputFieldsForCC();
        $('.addressLookupForm .lookupBox').hide();
      }
      //$('select#deliveryAddress').hide();
      updateTitle();
    } else {
      $('a.changeLocation').css('display', 'none');
    }
  }

  function updateTitle() {
    var headerTitleText = Salmon.Global.CurrentPageStoreText.ccSelectedTitle;
    if (!headerTitleText) return;

    if (window.localStorage && localStorage.getItem('clickAndCollectShopName')) {
      headerTitleText += " <span>" + localStorage.getItem('clickAndCollectShopName') + "</span>";
    }
    $('#orderDeliveryAddress .header .title').html(headerTitleText);
  }

  // removed during linting, apparently unused
  // function disableInputFields() {
  //   $('#deliveryLookup input, #deliveryLookup select').addClass('disabled').attr('disabled', 'disabled');
  //   $('#deliveryLookup input[type="text"]').val('');
  // }

  function disableInputFieldsForCC() {
    $('#deliveryLookup input').addClass('disabled');
    $('#deliveryLookup input').on('keyup keydown change', function(e) {
      e.preventDefault();
    });
  }

  // removed during linting, apparently unused
  // function enableInputFields() {
  //   $('#deliveryLookup input, #deliveryLookup select').removeClass('disabled').removeAttr('disabled', 'disabled');
  //   $('#deliveryLookup input[type="text"]').val('');
  // }

  function setupShippingMethodsSubmit() {
    var isNewCheckout = Salmon.Global.FeatureToggles.getFeature('NewCHECKOUT'),
      $deliveryRadios = (isNewCheckout) ? $('.deliveryOptions input[type="radio"]') : $('div#anonShippingMethods').find("input[type='radio']");

    $deliveryRadios.bind("click", function() {
      if ($('input[name=' + this.name + ']').length > 0) {
        // this is a value of the selected radio button
        var selectedShippingId = this.value;
        // this is a name of the selected radio button
        var selectedShippingInfo = this.id;
        // pass the 'AnonCheckoutOrderDeliveryAddress' form to the json service which updates shipping charge 
        if ($(this).hasClass('clickAndCollect')) {
          Salmon.Global.DeliveryUpdate.AnonDeliveryUpdateForm($('#AnonCheckoutOrderDeliveryAddress'), selectedShippingId, selectedShippingInfo, true);
          //$('#orderDeliveryAddress .header .title').html(Salmon.Global.CurrentPageStoreText.homeDeliverySelectedTitle)
        } else {
          Salmon.Global.DeliveryUpdate.AnonDeliveryUpdateForm($('#AnonCheckoutOrderDeliveryAddress'), selectedShippingId, selectedShippingInfo, false);
        }
        if (isNewCheckout) Salmon.Global.uiBlocker.blockUI();
      } else {
        // don't do anything if radio button is already checked/selected
      }
    });
  }
});


App.Basket.UpdateQuantityNew = function() {
  $(init);

  function init() {
    // removed during linting, apparently unused, and looks unfinished anyway
    // var updateQty = function($input, value) {
    //   $input.val()
    // }

    $('.basketSummary td.qty > input[type="number"]').on('change', function() {
      Salmon.Global.uiBlocker.blockUI();
      console.log($(this).val());
      $(this).closest("td").find(".js-submit").trigger("click");
    });

    $(".basketSummary td.qty > button").on('click', function(e) {
      e.preventDefault();
      var $button = $(this),
        $input = $button.parent().find('input[type="number"]');

      if ($button.hasClass('plus'))
        $input.val(parseInt($input.val(), 10) + 1);
      else
        $input.val(parseInt($input.val(), 10) - 1);
      $input.trigger('change');

    });
  }
};


/*
 * removed - doesn't appear to serve any useful purpose ... 
 * ... but does cause problems - DLT
 *
App.Basket.CV2 = new (function() {
	$(init);
	
	function init() {
		var cv2 = $("input[name='cc_cvc']");

		cv2.bind("focus", function() {
			var title = $(this).attr("title");

			if (title === "") {
				$(this).attr("title", this.value);
				title = $(this).attr("title");
			}

			this.value = (this.value === title) ? "" : this.value;

			return false;
		}).bind("blur", function() {
			console.log('cv2 blur!'); 
			
			var title = $(this).attr("title");

			if (title === "") {
				$(this).attr("title", this.value);
			}

			this.value = (this.value === "") ? title : this.value;

			return false;
		});
	}
});
*/

App.Basket.ChuckABargain = new(function() {

  $(init);

  function init() {
    var $chuckABargain = $("#chuckaBargain");
    if ($chuckABargain.find("li.productItem").length > 0) {
      new Salmon.Global.Truncator($chuckABargain.find(Configuration.Basket.ChuckABargain.truncator.node), Configuration.Basket.ChuckABargain.truncator);
      $chuckABargain.find("form").unbind("submit");
    }
  }

});

App.Basket.newProceedButton = function() {

  $(init);

  function init() {
    var $button = $('.btn.primary#signIn');

    $button.on('click', function(e) {
      e.preventDefault();
      $('form[name="anonBasketForm"]').append('<input type="hidden" name="continueToCheckout" value="true" />').submit();
    });
  }

};


App.Basket.FormElements = new(function() {

  $(init);

  function init() {
    new Salmon.Global.ButtonTrigger(document.getElementById("promoCode"), document.getElementById("applyCode"));
    new Salmon.Global.ButtonTrigger(document.getElementById("rewardCardNumberRedeem"), $("#rewardCardNumberRedeem").parent().find("input[type='submit']").get(0));
  }

});


App.Basket.Warranties = function() {

  var $addToBasketCheckboxes,
    $noCheckbox,
    redirectPage = function(elem) {
      $noCheckbox.removeAttr('checked');
      $addToBasketCheckboxes.on('change', function(e) {
        e.preventDefault();
      });
      window.location = $(elem).val();
    };

  $(init);



  function init() {
    $addToBasketCheckboxes = $('.warrantyBasketContainer .checkboxes .addToBasket');
    $noCheckbox = $('.warrantyBasketContainer .checkboxes .noWarranty');
    $addToBasketCheckboxes.on('change', function(e) {
      $addToBasketCheckboxes = $(this).siblings('input');
      $noCheckbox = $(this).siblings('.noWarranty');
      redirectPage(this);

    });

    $('.warrantyBasketContainer .warrantyOverlayInner').each(function() {
      $(this).css('marginTop', -$(this).height() / 2);
    });

    Salmon.Global.Warranties.WarrantiesTermsOverlay();

  }
};



App.Basket.WarrantiesNew = function() {

  var $addToBasketCheckboxes,
    $noCheckbox,
    redirectPage = function(elem) {
      $noCheckbox.removeAttr('checked');
      $addToBasketCheckboxes.on('change', function(e) {
        e.preventDefault();
      });
      window.location = $(elem).val();
    };

  $(init);



  function init() {


  }
};
App.Basket.OverlayNew = function() {
  $('#checkoutSignIn.modal').on('click', function(e) {
    if (e.target !== this && !$(e.target).hasClass('closeModal')) {
      return;
    } else {
      $(this).fadeOut(function() {
        $(this).remove();
      });
    }
  });

  $('.warrantyContainer .warrantyInfo').on('click', function(e) {
    e.preventDefault();
    var $espotHtml = $(this).parent().parent().find('.warrantyEspotContainer');
    Salmon.Global.Modal.openModal($espotHtml.html());
  });
};

App.Basket.PromoCodeNew = function() {
  var $form = $('form[name="anonBasketForm"]'),
    $applyBtn = $('.discountContainer button');

  $applyBtn.on('click', function(e) {
    e.preventDefault();
    $form.append('<input type="hidden" name="submitPromotionalCode" value="Apply" />');
    $form.submit();
  });
};


App.Basket.WarrantiesNew();
App.Basket.UpdateQuantityNew();
App.Basket.newProceedButton();
App.Basket.OverlayNew();
App.Basket.PromoCodeNew();
