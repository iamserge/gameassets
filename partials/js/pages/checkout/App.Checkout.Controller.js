var App = App || {};
App.Checkout = App.Checkout || {};

App.Checkout.AddressLookup = new(function() {

  $(init);

  function init() {

    if (!document.getElementById("forceBillingLookup") && document.getElementById("existingAddress") && document.getElementById("billingLookup")) {

      var
      	// $existing = $("#existingAddress"),
        $lookup = $("#billingLookup").addClass("hide"),
        $action = $("#exisitingAddress ul.action"),
        useDifferent = document.getElementById("useDifferentBillingAddress") || document.getElementById("useDifferentForBilling") || null;

      if (useDifferent) {
        var $userShipp = $("#useShippingForBilling");
        var hideButton = (document.getElementById("pageAnchor")) ? false : true;
        $lookup.removeClass(($userShipp.attr("checked")) ? "" : "hide");
        $action.addClass(($userShipp.attr("checked") && hideButton) ? "hide" : "");

        $(useDifferent).bind("click", function() {
          $lookup.removeClass("hide");
          $action.addClass((hideButton) ? "hide" : "");
        });

        $("input[id^='selectedBillingAddressId'], #useShippingForBilling").bind("click", function() {
          $action.removeClass("hide");
        });
      }
    }
  }
});

App.Checkout.GiftCard = new(function() {
  $(init);

  function init() {

    var inputElement = $('#yourPaymentDetails').children('#giftCardSection').children('.field.input').children('.element');


    $(inputElement).children('span.helpLink').children('a').bind('click', function() {
      var helpPanel = $(this).siblings('div');

      if ($(helpPanel).hasClass('active')) {
        $(helpPanel).removeClass('active');
      } else {
        $(helpPanel).addClass('active');
      }

      return false;
    });

    // eVoucher/giftcard validation
    $('#giftCardSection').find('input[type=submit]').bind('click', validate);
  }

  function validate() {
    var ret = false;
    var inputValue = $(this).parents('div.element').children('input[type=text]').val();
    var errorPanel = $(this).parents('div.element').children('.errorSummary');

    $(errorPanel).removeClass('active');

    if (inputValue === '') {
      $(errorPanel).addClass('active');
    } else {
      ret = true;
    }

    return ret;
  }
});



App.Checkout.Vouchers = new(function() {
  $(init);

  function init() {
    // show/hide inputs
    //		$('#yourPaymentDetails').find('div.input')
    //			.addClass('inactive')
    //			.each(function() {
    //				var checkbox = $(this).siblings('div.field').find('input[type=checkbox]'); 
    //
    //				$(checkbox)
    //					.bind('change', function() {
    //						if (this.checked == true) {
    //							$(this).parents('div.field').siblings('div.field').removeClass('inactive'); 
    //						} else {
    //							$(this).parents('div.field').siblings('div.field').addClass('inactive'); 
    //						}; 
    //					})
    //			}); 

    // Gift card help panel
    var inputElement = $('#yourPaymentDetails').children('#eVoucherSection').children('.field.input').children('.element');

    //		$(inputElement).prepend(
    //			'<span class="helpLink">' +
    //				'<a href="#"></a>' + 
    //			'</span>' + 
    //			'<div class="helpPanel">' +
    //				'<p>This text and image is here to help you!</p>' + 
    //			'</div>'
    //		); 


    $(inputElement).children('span.helpLink').children('a').bind('click', function() {
      var helpPanel = $(this).siblings('div');

      if ($(helpPanel).hasClass('active')) {
        $(helpPanel).removeClass('active');
      } else {
        $(helpPanel).addClass('active');
      }

      return false;
    });

    // eVoucher/giftcard validation
    $('#eVoucherSection').find('input[type=submit]').bind('click', validate);
  }

  function validate() {
    var ret = false;
    var inputValue = $(this).parents('div.element').children('input[type=text]').val();
    var errorPanel = $(this).parents('div.element').children('.errorSummary');

    $(errorPanel).removeClass('active');

    if (inputValue === '') {
      $(errorPanel).addClass('active');
    } else {
      ret = true;
    }

    return ret;
  }
});


App.Checkout.Promotion = new(function() {
  $(init);

  function init() {
    // show/hide inputs
    //		$('#yourPaymentDetails').find('div.input')
    //			.addClass('inactive')
    //			.each(function() {
    //				var checkbox = $(this).siblings('div.field').find('input[type=checkbox]'); 
    //
    //				$(checkbox)
    //					.bind('change', function() {
    //						if (this.checked == true) {
    //							$(this).parents('div.field').siblings('div.field').removeClass('inactive'); 
    //						} else {
    //							$(this).parents('div.field').siblings('div.field').addClass('inactive'); 
    //						}; 
    //					})
    //			}); 

    // Gift card help panel
    var inputElement = $('#promotionalCode').children('.field.input').children('.element');
    //		$(inputElement).prepend(
    //			'<span class="helpLink">' +
    //				'<a href="#"></a>' + 
    //			'</span>' + 
    //			'<div class="helpPanel">' +
    //				'<p>This text and image is here to help you!</p>' + 
    //			'</div>'
    //		); 


    $(inputElement).children('span.helpLink').children('a').bind('click', function() {
      var helpPanel = $(this).siblings('div');

      if ($(helpPanel).hasClass('active')) {
        $(helpPanel).removeClass('active');
      } else {
        $(helpPanel).addClass('active');
      }

      return false;
    });

    //express checkout
    // eVoucher/giftcard validation
    $('#promotionalCode').find('input[type=submit]').bind('click', validate);

    var displayErrorAcceptingTermsAndConditions = function(e) {
      e.preventDefault();
      alert("Please accept our terms and conditions");
    };

    var displayErrorThreeDigitSecurity = function(e) {
      e.preventDefault();
      alert("Please enter the three digit security code on the back of your card");
    };
    if ($('div.ageRestricted').length > 0) {
      var $placeOrderButton = $('#placeOrder');
      var newOrderFormValidation = new Salmon.Global.Validation($('div.ageRestricted'), {});
      newOrderFormValidation.validateOnClick($placeOrderButton);
    }


    if (window.location.toString().indexOf("ExpressOrderItemDisplay") > -1 || window.location.toString().indexOf("ExpressNewPayment") > -1) {
      //credit card
      var checkIfBalanceZero = function() {
        var $totalBalanceToPay = $('#totalBalanceToPay'),
          $selectedTotalToPay = $('#selectedTotalToPay');

        if ($totalBalanceToPay.length > 0 && typeof $totalBalanceToPay.text() != 'undefined' && $selectedTotalToPay.length > 0 && typeof $selectedTotalToPay.text() != 'undefined') {
          return parseFloat($totalBalanceToPay.text().replace('£', '')) == 0 && parseFloat($selectedTotalToPay.text().replace('£', '')) == 0;
        }

      }
      $("input[name=placeOrder]").on("click", function(e) {
        if (checkIfBalanceZero() || ($("#fieldCV2_2").length == 0 || ($("#fieldCV2_2").val().length >= 3 && $("#fieldCV2_2").val().length <= 4 && $.isNumeric($("#fieldCV2_2").val())))) {
          if ($("#terms").is(":checked")) {
            if (typeof newOrderFormValidation != 'undefined') {
              if (newOrderFormValidation.validate()) {
                $("form").append("<input type='hidden' name='placeOrder' value='true' />");
                $("form").submit();
              }
            } else {
              $("form").append("<input type='hidden' name='placeOrder' value='true' />");
              $("form").submit();
            }
          } else {
            displayErrorAcceptingTermsAndConditions(e);
          }
        } else {
          displayErrorThreeDigitSecurity(e);
        }
      });

      //paypal
      $("form #placeOrderPaypal_2 input[name=placeOrderPaypal]").on("click", function(e) {
        if ($("#terms").is(":checked")) {
          $("form").append("<input type='hidden' name='placeOrderPaypal' value='true' />");
          $("form").submit();
        } else {
          displayErrorAcceptingTermsAndConditions(e);
        }
      });

      //wallet
      $("form #placeOrderPaypal_2 input[name=placeOrderWallet]").on("click", function(e) {
        if ($("#terms").is(":checked")) {
          $("form").append("<input type='hidden' name='placeOrderWallet' value='true' />");
          $("form").submit();
        } else {
          displayErrorAcceptingTermsAndConditions(e);
        }
      });
    } else {
      //guest checkout
      //credit card		
      $("input[type=submit][name=createPayment]").on("click", function(e) {

        if ($("#terms").is(":checked")) {
          $("form").append("<input type='hidden' name='createPayment' value='true' />");
          //$("form").submit();
        } else {
          e.preventDefault();
          displayErrorAcceptingTermsAndConditions(e);
        }
      });
      //paypal
      $("#payPalPayment[type=button][name=usePayPal]").on("click", function(e) {
        if ($("#terms").is(":checked")) {
          $("form").append("<input type='hidden' name='usePayPal' value='true' />");
          $("form").submit();
        } else {
          displayErrorAcceptingTermsAndConditions(e);
        }
      });

      //gift card
      $("input[name=placeOrder]").on("click", function(e) {
        if ($("#terms").is(":checked")) {
          $("form").append("<input type='hidden' name='placeOrder' value='true' />");
          $("form").submit();
        } else {
          displayErrorAcceptingTermsAndConditions(e);
        }
      });

      //GAMEWallet
      $("#walletPayment[type=button][name=useWallet]").on("click", function(e) {
        if ($("#terms").is(":checked")) {
          $("form").append("<input type='hidden' name='useWallet' value='true' />");
          $("form").submit();
        } else {
          displayErrorAcceptingTermsAndConditions(e);
        }
      });
    }
  }

  function validate() {
    var ret = false;
    var inputValue = $(this).parents('div.element').children('input[type=text]').val();
    var errorPanel = $(this).parents('div.element').children('.errorSummary');

    $(errorPanel).removeClass('active');

    if (inputValue == '') {
      $(errorPanel).addClass('active');
    } else {
      ret = true;
    }

    return ret;
  }
});
