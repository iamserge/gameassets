App = App || {};
App.Basket = App.Basket || {};
App.Basket.ExpressCheckout = function() {
  var validate;

  $(init);

  function init() {

    if (!$('#errorSummary').hasClass('hide')) {
      $(document).scrollTop(50);
    }

    if (window.location.href.indexOf('#payNow') > -1) {
      $(document).scrollTop(50);
    }

    addClickHandlers();
    setupDeliveryDetailsForm();
    setupPaymentDetailsForm();
    setupBillingDetailsForm();
    setupWishlistAddressForm();
  }

  function setupDeliveryDetailsForm() {
    var deliveryForm = document.getElementById("deliveryAddress") || null;
    if (!deliveryForm) return;
    new App.Basket.ExpressCheckoutForm(deliveryForm);
  }

  function setupPaymentDetailsForm() {
    var paymentForm = document.getElementById("payment") || null;
    if (!paymentForm) return;
    new App.Basket.ExpressCheckoutForm(paymentForm);
  }

  function setupBillingDetailsForm() {
    var billingForm = document.getElementById("billing") || null;
    if (!billingForm) return;
    new App.Basket.ExpressCheckoutForm(billingForm);
  }

  function setupWishlistAddressForm() {
    var $wishlistForm = $("#wishlistAddresses");
    if ($wishlistForm.length === 0) return;

    var $radios = $wishlistForm.find("input[type='radio']");

    for (var i = 0; i < $radios.length; i++) {
      var $radio = $($radios[i]),
        $submit = $radio.siblings("input[name='wishListDelivery']").addClass("hide");

      $radio.bind("click", function() {
        this.checked = true;
        $submit.trigger("click");
      });
    }
  }

  function addClickHandlers() {

    var url = $('form').attr('action');

    $(document).ready(function() {
      $('.checkout-discounts :submit').bind("click", function() {
        $('form').attr('action', url + '#checkout-discounts');
      });
      $('.checkout-delivery :radio').bind("click", function() {
        validate = false;
        $('form').attr('action', url + '#checkout-delivery');
      });
      $('#payPalPayment').bind("click", function() {
        $('form').attr('action', url + '#payNow');
      });
      $('#deliveryAddress').bind("click", function() {
        $('form').attr('action', url + '#checkout-delivery');
      });
      $('#paymentDetails').bind("click", function() {
        $('form').attr('action', url + '#payNow');
      });
    });
  }

  App.Basket.ExpressCheckoutForm = function(node) {
    var $node = $(node),
      $select = $node.find("select"),
      $submit = $select.siblings("input[type='submit']");

    hideSubmitButton();
    setupFormSubmit();

    function hideSubmitButton() {
      $submit.addClass("hide");
    }

    function setupFormSubmit() {
      $select.bind("change", function() {
        $submit.trigger("click");
      });
    }
  };
};

App.Basket.FormValidator = function() {

  var $formNode = null,
    // formNode = null,
    fv = null,
    validate = true;

  $(init); 

  function init() {
    autoUpdatePaymentForm();
  }

 
  function autoUpdatePaymentForm() {
    var $paymentDetailsSelect = $('select#paymentDetails'),
      $paymentDetailsUpdateButton = $('#paymentDetailsUpdate');

    if ($paymentDetailsUpdateButton.length > 0) {
      $paymentDetailsSelect.on('change', function() {
        validate = false;
        if ($paymentDetailsSelect.val() != 'change') {
          Salmon.Global.uiBlocker.blockUI();
          $paymentDetailsUpdateButton.trigger('click');
        }
      });
    }
  }

};


App.Basket.ExpressCheckout.DeliveryOptionsNew = function() {

  var $checkoutForm,
    $radioButtonsContainer,
    $shippingMethodsRadioButtons,
    $changeLocationButton,
    $defaultStoreName,
    $selectedCCShop,
    $selectedCCPlusShop,
    $defaultPostalCode,
    $deliveryAddressContainer,
    $newPostcode,
    $ccAddressContainer,
    $bottomChangeLocationButton,
    $homeAddressSelect,
    $defaultAddress,
    $defaultHomeAddress,
    $homeAddressContainer,
    $isCollectPlus,
    $selectedShippingId,
    $selectedShippingInfo,
    $bottomHomeTitle,
    $bottomCollectionTitle,
    $payNowButton,
    defaultPostalCode,
    defaultStores = [],
    cachedStoreObj,
    selectedCCShopName = '',
    selectedCCPlusShopName = '',
    currentDelivery,
    deliveryString,
    // deliveryType,
    isClickAndCollect = false,
    closestCCShopPoint,
    closestCCPlusPoint,
    isCollectPlus = false,
    clickAndCollectClass = 'clickAndCollect',
    collectPlusString = 'Collect+',
    deliveryTypeChanged = false,
    requestUrl = '/webapp/wcs/stores/servlet/AJAXGetDeliveryPoints',


    init = function() {
      setupElements();
      getCachedData();
      checkIfCC($shippingMethodsRadioButtons.filter(':checked'));
      if (defaultStores.length > 0) {
        Salmon.Global.ChangeLocationNew.setupShops(defaultStores, isCollectPlus, defaultPostalCode);
        defineShopNames();
      }
      if (isClickAndCollect)
        ccSelected();
      else
        notCCSelected();
      if ((selectedCCShopName.length > 0 || selectedCCPlusShopName.length > 0) && isClickAndCollect) setupShopDetails();
      radionButtonsHandler();
      $radioButtonsContainer.each(function() {
        if ($(this).find('input[type="radio"]').length === 0 && !$(this).hasClass('download')) $payNowButton.hide();
      });
    },

    getCachedData = function() {
      selectedCCShopName = ($selectedCCShop.length > 0) ? $selectedCCShop.val() : '';
      selectedCCPlusShopName = ($selectedCCPlusShop.length > 0) ? $selectedCCPlusShop.val() : '';
      defaultPostalCode = ($newPostcode.length > 0 && $newPostcode.val().length > 0) ? $newPostcode.val() : $defaultPostalCode.text();
      $newPostcode.val(defaultPostalCode);
      if (typeof sessionStorage != 'undefined') {
        if (sessionStorage.getItem(selectedCCShopName.replace(/ /g, '') + '_shop'))
          cachedStoreObj = JSON.parse(sessionStorage.getItem(selectedCCShopName.replace(/ /g, '') + '_shop'));
        else if (sessionStorage.getItem(selectedCCPlusShopName.replace(/ /g, '') + '_shop'))
          cachedStoreObj = JSON.parse(sessionStorage.getItem(selectedCCPlusShopName.replace(/ /g, '') + '_shop'));

      }
    },

    setupElements = function() {
      $checkoutForm = $('#expressCheckoutDetails');
      $radioButtonsContainer = $('.shippingMethods');
      $shippingMethodsRadioButtons = $('#expressShippingMethods input[type="radio"]');
      $changeLocationButton = $('.changeLocation');
      $defaultStoreName = $('#defaultStoreName');
      $selectedCCShop = $('#selectedCCShop');
      $selectedCCPlusShop = $('#selectedCCPlusShop');
      $defaultPostalCode = $('#deliveryAddress .vcard .postal-code');
      $newPostcode = $('#newPostcode');
      $homeAddressContainer = $('#deliveryAddress .home');
      $deliveryAddressContainer = $('#deliveryAddress');
      $ccAddressContainer = $('#deliveryAddress .ccAddress');
      $bottomChangeLocationButton = $('#deliveryAddress .changeLocation');
      $homeAddressSelect = $('select[name="deliveryAddress"]');
      $defaultAddress = $('#deliveryAddress .vcard');
      $defaultHomeAddress = $('#deliveryAddress .vcard_default');
      $isCollectPlus = $('#isCollectPlus');
      $selectedShippingId = $('#selectedShippingId');
      $selectedShippingInfo = $('#selectedShippingInfo');
      $payNowButton = $('.checkout-box-terms-and-payNow input[name="placeOrder"]');
      $bottomHomeTitle = $('#deliveryAddress .homeTitle');
      $bottomCollectionTitle = $('#deliveryAddress .collectionTitle');
    },



    checkIfCC = function($currentCheckedRadio) {
      currentDelivery = $currentCheckedRadio.val();
      deliveryString = $currentCheckedRadio.attr('id');
      deliveryTypeChanged = (isClickAndCollect == $currentCheckedRadio.hasClass('clickAndCollect'));
      isClickAndCollect = $currentCheckedRadio.hasClass(clickAndCollectClass);
      if (isClickAndCollect) {
        isCollectPlus = deliveryString.indexOf(collectPlusString) != -1;
        $bottomHomeTitle.hide();
        $bottomCollectionTitle.show();
      } else {
        $bottomHomeTitle.show();
        $bottomCollectionTitle.hide();
      }
      $isCollectPlus.val(isCollectPlus);
    },
    setupHomeDeliveryAddressBox = function() {
      var $homeDeliveryAddressBox = $('<div />', {
          class: 'closestShop delivery'
        }),
        titleHtml = '<h2>Home delivery to:</h2>';
      $('.closestShop.delivery').remove();
      if ($defaultAddress.is(':visible'))
        $homeDeliveryAddressBox.html(titleHtml + $defaultAddress.html());
      else
        $homeDeliveryAddressBox.html(titleHtml + $defaultHomeAddress.html());

      $radioButtonsContainer.each(function() {
        $(this).append($homeDeliveryAddressBox);
      });
    },
    ccSelected = function() {

      $homeAddressContainer.hide();
      $('.closestShop.delivery').remove();
      if (defaultStores.length > 0) {
        Salmon.Global.ChangeLocationNew.setupShops(defaultStores, isCollectPlus, defaultPostalCode);
        setupShopDetails();
      }
    },

    notCCSelected = function() {
      $homeAddressContainer.show();

      $('.closestShop.cc').remove();
      $defaultStoreName.hide();
      $ccAddressContainer.hide();
      $homeAddressSelect.show();

      if (!$defaultHomeAddress.is(':visible')) {
        $defaultHomeAddress.show();
        $defaultAddress.hide();
      }
      setupHomeDeliveryAddressBox();
      $bottomHomeTitle.show();
      $bottomCollectionTitle.hide();
    },

    radionButtonsHandler = function() {
      $shippingMethodsRadioButtons.on("click", function() {
        checkIfCC($(this));
        $selectedShippingId.val(currentDelivery);
        $selectedShippingInfo.val(deliveryString);
        if (isClickAndCollect) {
          defineShopNames();
          ccSelected();
        } else {
          notCCSelected();
        }
        deliveryChangeAjax();
      });
    },

    deliveryChangeAjax = function() {
      //initialise store should call first, so that selectStore field is setup before go to back end to save the address

      if (isClickAndCollect && defaultStores.length === 0)
        initialShopsRequest();
      else
        Salmon.Global.DeliveryUpdateExpress.DeliveryUpdateExpressForm($checkoutForm, currentDelivery, deliveryString, isClickAndCollect);


    },

    initialShopsRequest = function() {
      $defaultStoreName.hide();
      $.get(requestUrl + "?postalCode=" + defaultPostalCode, function(res) {
        if (res) Salmon.Global.ChangeLocationNew.setupShops(res.shops, isCollectPlus, defaultPostalCode);

        defaultStores = res.shops;
        defineShopNames();
        if (typeof closestCCShopPoint != 'undefined') selectedCCShopName = closestCCShopPoint.shopName;
        if (typeof closestCCPlusPoint != 'undefined') selectedCCPlusShopName = closestCCPlusPoint.shopName;
        setupShopDetails();
        Salmon.Global.DeliveryUpdateExpress.DeliveryUpdateExpressForm($checkoutForm, currentDelivery, deliveryString, isClickAndCollect);
      });
    },

    defineShopNames = function() {
      if (typeof defaultStores != 'undefined' && defaultStores.length > 0) {
        for (var i in defaultStores) {
          var shop = defaultStores[i];
          if (shop.isCollectPlus) {
            if (typeof closestCCPlusPoint == 'undefined') {
              closestCCPlusPoint = shop;
              if (typeof closestCCShopPoint != 'undefined') break;
            }
          } else {
            if (typeof closestCCShopPoint == 'undefined') {
              closestCCShopPoint = shop;
              if (typeof closestCCPlusPoint != 'undefined') break;
            }
          }
        }
      }
      if (selectedCCShopName.length === 0 && typeof closestCCShopPoint != 'undefined') selectedCCShopName = closestCCShopPoint.shopName;
      if (selectedCCPlusShopName.length === 0 && typeof closestCCPlusPoint != 'undefined') selectedCCPlusShopName = closestCCPlusPoint.shopName;
    },

    setupShopDetails = function() {
      var storeName,
      // $chooseLocationButton = $radioButtonsContainer.find('.changeLocation'),
      //   $defaultStoreName = $('#defaultStoreName'),
      //   $selectStoreInput = $radioButtonsContainer.find('#selectStore'),
        closestShopDivTemplate = '<div class="closestShop cc"><h3>Collect from:<span>%shopName%</span><span class="milesAway">%miles%</span></h3><div>%address%</div><a href="#" class="btn secondary changeLocation">Choose another shop</a></div>',
        // closestShop = {},
        generateSelectedShopHtml = function(shopObj) {
          var html = '',
            address = '';
          if (typeof shopObj == 'undefined') {
            if (typeof cachedStoreObj != 'undefined')
              shopObj = cachedStoreObj;
            else
              return;
          }
          html = closestShopDivTemplate.replace('%shopName%', shopObj.shopName);
          html = html.replace('%miles%', parseFloat(shopObj.distance).toFixed(2) + ' miles away');
          for (var key in shopObj.address) {
            if (shopObj.address[key].length > 0) address += shopObj.address[key] + ', ';
          }
          address = address.substring(0, address.length - 1);
          html = html.replace('%address%', address);
          return html;
        },
        html = '';

      $('.closestShop.cc').remove();

      if (isCollectPlus) {
        storeName = selectedCCPlusShopName;
        $selectedCCPlusShop.val(storeName);
        html = generateSelectedShopHtml(closestCCPlusPoint);
        if (closestCCPlusPoint) $radioButtonsContainer.append(html);
      } else {
        storeName = selectedCCShopName;
        $selectedCCShop.val(storeName);
        html = generateSelectedShopHtml(closestCCShopPoint);
        if (closestCCShopPoint) $radioButtonsContainer.append(html);
      }
      //if cached obj
      if (!closestCCShopPoint && !closestCCPlusPoint && html.length > 0 && typeof cachedStoreObj != 'undefined') $radioButtonsContainer.append(html);
      $deliveryAddressContainer.append(html);

    },

    // functions below removed during linting
    // disableFields = function($fields) {
    //   $fields.attr('readonly', true).addClass('disabled');
    // },

    // enableFields = function($fields, clear) {
    //   $fields.attr('readonly', false).removeClass('disabled');
    //   if (clear) $fields.val('');
    // },

    setDefaultStores = function(stores) {
      defaultStores = stores;
    };






  $(init);
  return {
    setDefaultStores: setDefaultStores
  };
};



$(document).ready(function() {
    if ($('body').attr('id') == 'pgBasket' && $('body').hasClass('express')) {
      App.Basket.ExpressCheckout();
      App.Basket.FormValidator();
      App.Basket.ExpressCheckout.DeliveryOptionsNew = App.Basket.ExpressCheckout.DeliveryOptionsNew();
    }
    
});


App.Basket.PromotionalCode = new(function() {
  // for configuration options see: http://jquerytools.org/documentation/overlay/

  $(init);

  function init() {
    var $formNode = $('#expressCheckoutDetails');

    $('#submitPromotionalCodeButton').on('click', function(e) {
      e.preventDefault();
      $formNode.addClass('notValidate');
      $formNode.append('<input type="hidden" name="submitPromotionalCode" value="Apply" />');
      $formNode.submit();
    });
    
    $('#submitEGiftcardNumberButton').on('click', function(e) {
      e.preventDefault();
      $formNode.addClass('notValidate');
      $formNode.append('<input type="hidden" name="submitEGiftcardNumber" value="Apply" />');
      $formNode.submit();
    });

    $('#promotionCode button').on('click', function(e) {
      e.preventDefault();
      $formNode.addClass('notValidate');
      $formNode.append('<input type="hidden" name="submitPromotionalCode" value="Apply" />');
      $formNode.submit();
    });
  }
});
