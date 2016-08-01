var App = App || {};
App.Checkout = App.Checkout || {};
App.Checkout.Anonymous = App.Checkout.Anonymous || {};

App.Checkout.Anonymous.PersonalAndDeliveryDetailsValidatorNew = function() {
  var personalDetailsValidator = function() {
    var personalDetailsValidationRules = {

      "email": [{
        "errorMessage": 'Please enter your email address',
        "rule": "email"
      }],
      "confirmEmail": [{
        "errorMessage": 'Emails do not match. Please enter the same email',
        "rule": function(val) {
          return val == $('.labeledInputs #email').val();
        }
      }]
    };

    var personalDetailsValidation = new Salmon.Global.Validation($('#AnonCheckoutOrderDeliveryAddress'), {
      specificValidationRules: personalDetailsValidationRules
    });

    personalDetailsValidation.validateOnClick($('#AnonCheckoutOrderDeliveryAddress #submitDetails'));
  };
  personalDetailsValidator();
};





App.Checkout.Anonymous.DeliveryTabsNew = function() {


  var $anonCheckoutForm,
    $deliveryTabsButtons,
    // $homeDeliveryButton,
    // $internationalAddress,
    // $collectionButton,
    $deliveryOptionsContainer,
    $homeDeliverySelectButton,
    $deliveryTabs,
    $deliveryTypeInput,
    $internationalAddressCheckbox,
    $selectAddressContainer,
    $internationalAddressButton,
    $internationalAddressInput,
    $continueToPayment,
    $selectAddressContainerFields,
    $radioButtonsContainer,
    $showHomeDeliveryOptions,
    $showCollectionButton,
    // $showCollectionOptions,
    $collectionDeliveryPostcode,
    $isCollectPlus,
    $proceedSection,
    $deliverySubGroups,
    addressFieldsValidation,
    deliveryType,
    isClickAndCollect,
    isCollectPlus,
    currentPostcode,
    isInternational,
    shopsPredefined = (typeof Salmon.Global.InitialCCShops != "undefined" && Salmon.Global.InitialCCShops.shops.length > 0),
    shops = (shopsPredefined) ? Salmon.Global.InitialCCShops.shops : [],


    init = function() {

      setupElements();
      selectHomeAddressHandler();
      changeToInternationalChecbkox();
      submitButtonHandlers();
      radionButtonsHandler();
      shareLocationHandler();

      deliveryTabsNavigation();
      initialActions();
      validation();

    },

    setupElements = function() {

      $anonCheckoutForm = $('#AnonCheckoutOrderDeliveryAddress');
      $deliveryTabsButtons = $('.deliveryOrCollection > div');
      $homeDeliverySelectButton = $('#homeDeliveryTabButton');
      $showHomeDeliveryOptions = $('#showHomeDeliveryOptions');
      $collectionDeliveryPostcode = $('#collectionDeliveryPostcode');
      $showCollectionButton = $('#showCollectionOptions');
      $selectAddressContainer = $('.section.address');
      $selectAddressContainerFields = $selectAddressContainer.find('input[type="text"]');
      $continueToPayment = $('#continueToPayment');
      $deliveryTabs = $('#deliveryLookup .tab');
      $proceedSection = $('.section.proceed');
      $deliveryOptionsContainer = $('.section.products');
      $radioButtonsContainer = $('.section.products');
      $deliveryTypeInput = $('#deliveryTypeTab');
      $internationalAddressButton = $('.internationalButton');
      $internationalAddressInput = $('input#internationalAddress');
      $isCollectPlus = $('#isCollectPlus');
      $deliverySubGroups = $('.deliveryOptionsSubGroup');
    },

    changeToInternationalChecbkox = function() {
      $internationalAddressButton.on('click', function(e) {
        e.preventDefault();
        if ($internationalAddressInput.val() == 'off') {
          $anonCheckoutForm.addClass('notValidate');
          $internationalAddressInput.val('on');
        } else {
          clearAddressFields(); //clear the address as the internation box is selected
          $internationalAddressInput.val('off');
        }
        $anonCheckoutForm.submit();
      });
    },

    validation = function() {
      if (!isInternational) {
        var $fieldsToValidate = ($('#notRecipient').length > 0) ? $('#orderDeliveryAddress') : $('.section.address');

        addressFieldsValidation = new Salmon.Global.Validation($fieldsToValidate, {
          specificValidationRules: {
            "postCode": [{
              "errorMessage": 'Please enter valid postcode',
              "rule": "postcode"
            }]
          }
        });
        addressFieldsValidation.validateOnClick($continueToPayment);
      } else {

      }
    },

    clearAddressFields = function() {
      $selectAddressContainer.find('input[name=address1]').val('');
      $selectAddressContainer.find('input[name=address2]').val('');
      $selectAddressContainer.find('input[name=address3]').val('');
      $selectAddressContainer.find('input[name=town]').val('');
      $selectAddressContainer.find('input[name=county]').val('');
      $selectAddressContainer.find('input[name=postCode]').val('');
    },

    submitButtonHandlers = function() {

      $showHomeDeliveryOptions.on('click', function(e) {
        e.preventDefault();
        if (isInternational) {
          var addressFieldsValidation = new Salmon.Global.Validation($('.internationalAddressFields'), {});
          if (addressFieldsValidation.validate()) $anonCheckoutForm.append('<input type="hidden" name="showMyOptions" id="showMyOptions" value="true" />').submit();
        } else {
          if (validatePostcodeField($(this).parent().find('input[type="text"]'))) $anonCheckoutForm.append('<input type="hidden" name="showMyOptions" id="showMyOptions" value="true" />').submit();
        }
      });

      $showCollectionButton.on('click', function(e) {
        e.preventDefault();
        if ($internationalAddressInput.val() == 'on') {
          $internationalAddressCheckbox.removeAttr('checked');
          $anonCheckoutForm.addClass('notValidate');
        }
        if (validatePostcodeField($('#collectionDeliveryPostcode'))) $anonCheckoutForm.append('<input type="hidden" name="showMyOptions" id="showMyOptions" value="true" />').submit();
      });

      $continueToPayment.on('click', function(e) {
        e.preventDefault();
        if (addressFieldsValidation.validate()) $anonCheckoutForm.append('<input type="hidden" name="continueToPayment" id="showMyOptions" value="true" />').submit();
      });
    },

    initialActions = function() {
      isInternational = $internationalAddressInput.length > 0 && $internationalAddressInput.val() == 'on';
      $deliveryTabs.eq(1 - $deliveryTabsButtons.filter('.selected').index()).hide();
      deliveryType = $deliveryTypeInput.val();
      isClickAndCollect = (deliveryType == 'collection');

      //Check if options came back and address fields are displayed.
      if ($selectAddressContainerFields.length > 0) {

        if (isClickAndCollect) {
          disableFields($selectAddressContainerFields);
          clickAndCollectSelected();
        } else {
          if (!$selectAddressContainer.hasClass('noResults')) disableFields($selectAddressContainer.find('[name="postCode"]'));
        }
      }

      currentPostcode = $collectionDeliveryPostcode.val();

      //If first time on a page and deliveryTab flag is not set up
      if ($('.deliveryOrCollection .active').length === 0) {
        $deliveryTabs.hide();
        $deliveryOptionsContainer.hide();
        $proceedSection.hide();
        $selectAddressContainer.hide();
        if ($('#collectionTabButton').hasClass('disabled')) $('#homeDeliveryTabButton').trigger('click');

      } else {
        if ($homeDeliverySelectButton.hasClass('active')) {
          $deliveryTabs.eq(1).hide();
        } else {
          $deliveryTabs.eq(0).hide();
        }
      }

      if (!isInternational && !isClickAndCollect) {

        //$deliveryTabs.eq($deliveryTabsButtons.filter('.selected').index()).find(':text').val($deliveryTabs.eq($deliveryTabsButtons.filter('.selected').index()).find(':text').attr('placeholder'));
      } else {
        if ($radioButtonsContainer.find('input[type="radio"]').length === 0) $proceedSection.hide();
      }

      //Check  if click and collect - if it is then hide the "Payment details button"
      //checkIfEmptyRadioButtons();
      if ($radioButtonsContainer.find('input[type="radio"]').length === 0) $radioButtonsContainer.hide();

    },

    // function removed during linting, apparenlty never used
    // checkIfEmptyRadioButtons = function() {
    //   $deliverySubGroups.each(function() {
    //     if ($(this).find('input[type="radio"]').length === 0 && !$(this).hasClass('download')) $('.section.proceed').hide();
    //   });
    // },

    validatePostcodeField = function($el) {
      var regex = /^[A-Z]{1,2}[0-9R][0-9A-Z]? ?[0-9][ABD-HJLNP-UW-Z]{2}$/;
      $el.siblings('.error').remove();
      if ($el.length > 0 && $el.val().length > 0) {
        if (!regex.test($el.val().replace(/ /g, '').toUpperCase())) {
          $el.after('<span class="error">Please enter valid postcode</span>');
          $el.addClass('errorInput');
          $el.focus();
          $el.on('keyup', function() {
            if (regex.test($el.val().replace(/ /g, '').toUpperCase())) {
              $el.removeClass('errorInput');
              $el.parent().find('.error').hide();
            } else {
              $el.addClass('errorInput');
              $el.parent().find('.error').show();
              $el.focus();
            }
          });
        } else {
          return true;
        }

      } else {
        $el.after('<span class="error">Please enter valid postcode</span>');
        $el.addClass('errorInput');
        $el.focus();
        $el.on('keyup', function() {
          if (regex.test($el.val().replace(/ /g, '').toUpperCase())) {
            $el.removeClass('errorInput');
            $el.parent().find('.error').hide();
          } else {
            $el.addClass('errorInput');
            $el.parent().find('.error').show();
            $el.focus();
          }
        });
        return false;
      }
    },

    deliveryTabsNavigation = function() {
      $deliveryTabsButtons.on('click', function(e) {
        e.preventDefault();
        deliveryType = $(this).attr('id').replace('TabButton', '');
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');
        $deliveryTabs.hide();
        $deliveryTypeInput.val(deliveryType);
        $($deliveryTabs[$.inArray(this, $deliveryTabsButtons)]).show();
        $(this).find('input[type="radio"]').prop("checked", true);
        $('.section.products').hide();
        $('.section.address').hide();
        $('.section.addressSelection').hide();
        $proceedSection.hide();
      });
    },

    selectHomeAddressHandler = function() {
      var $addressSelect = $('#selectAddressFromPostcode'),
        $continueToPayment = $('#continueToPayment'),
        // $addressDropdownContainer = $('.addressDropdownContainer'),
        populateAddressFields = function(address) {
          var addressObj = processAddress(address);
          for (var key in addressObj) {

            $selectAddressContainer.find('input[name="' + key + '"]').val(addressObj[key]);
          }
          /* jshint -W069 */
          // if no county vomes back populate field with 
          if (addressObj['county'].length === 0 || addressObj['county'] === ' ') $selectAddressContainer.find('input[name="county"]').val(addressObj['town']);

        },

        processAddress = function(address) {
          var obj = address.split('|'),
            result = {};

          for (var i in obj) {

            result[obj[i].split(':')[0]] = obj[i].split(':')[1];
          }
          if (typeof result.city != 'undefined') {
            result.town = result.city;
            delete result.city;
          }
          return result;
        };

      if ($addressSelect.length > 0) {

        if (!$selectAddressContainer.is(':visible') && $addressSelect.val() !== '') {
          $selectAddressContainer.show();
          $continueToPayment.show();
          $radioButtonsContainer.show();
        } else {
          $selectAddressContainer.hide();
          $continueToPayment.hide();
          $radioButtonsContainer.hide();
        }
        //populateAddressFields($addressSelect.val());
        $addressSelect.on('change', function() {
          populateAddressFields($(this).val());

          // for #073152
          $selectAddressContainer.find('[name="postCode"]').attr('readonly', true).addClass('disabled');

          if (!$selectAddressContainer.is(':visible')) {
            $selectAddressContainer.show();
            $continueToPayment.show();
            $radioButtonsContainer.show();
          }

          if ($addressSelect.val() === '') {
            $selectAddressContainer.hide();
            $continueToPayment.hide();
            $radioButtonsContainer.hide();
          }
        });
      }
    },


    radionButtonsHandler = function() {
      $('div#anonShippingMethods input[type="radio"]').on("click", function() {

        if (isClickAndCollect) {
          clickAndCollectSelected();
        }
      });
    },

    disableFields = function($fields) {
      $fields.attr('readonly', true).addClass('disabled');
    },

    // function commented out during linting
    // enableFields = function($fields, clear) {
    //   $fields.attr('readonly', false).removeClass('disabled');
    //   if (clear) $fields.val('');
    // },
    clickAndCollectSelected = function() {

      var $chooseLocationButton = $radioButtonsContainer.find('.changeLocation'),
        $defaultStoreName = $('#defaultStoreName'),
        // $selectStoreInput = $radioButtonsContainer.find('#selectStore'),
        closestShopDivTemplate = '<div class="closestShop"><h3>from <span>%shopName%</span><span class="milesAway">%miles%</span></h3><div>%address%</div><a href="#" class="btn secondary changeLocation">Choose another shop</a></div>',
        closestShop = {},
        generateSelectedShopHtml = function(shopObj) {
          var html = '',
            address = '';

          html = closestShopDivTemplate.replace('%shopName%', shopObj.shopName);
          html = html.replace('%miles%', parseFloat(shopObj.distance).toFixed(2) + ' miles away');
          for (var key in shopObj.address) {
            if (shopObj.address[key].length > 0) address += shopObj.address[key] + ', ';
          }
          address = address.substring(0, address.length - 1);
          html = html.replace('%address%', address);
          return html;
        },
        populateShopDetails = function() {

          for (var key in closestShop.address) {
            $selectAddressContainer.find('input[name="' + key + '"]').val(closestShop.address[key]);
          }
          $('.deliveryOptions').find('input[type="radio"]:checked').parent().after(generateSelectedShopHtml(closestShop));

        };

      isCollectPlus = ($radioButtonsContainer.find('input[type="radio"]').length > 0) ? $radioButtonsContainer.find('input[type="radio"]').filter(':checked').hasClass('clickAndCollectPlus') : undefined;


      if (shopsPredefined) closestShop = shops.filter(checkIfCCArray)[0];

      $chooseLocationButton.css('display', 'inline-block');
      $defaultStoreName.css('display', 'inline-block');
      $isCollectPlus.val(isCollectPlus);
      populateShopDetails();
      window.addEventListener("shopSelectedEvent", function(evt) {
        var shopObj = evt.detail;
        $deliveryOptionsContainer.find('.closestShop').replaceWith(generateSelectedShopHtml(shopObj));
      }, false);

      if (shops.length > 0) Salmon.Global.ChangeLocationNew.setupShops(shops, isCollectPlus, $collectionDeliveryPostcode.val());

    },

    checkIfCCArray = function(value) {
      return (typeof value.isCollectPlus == 'string' ? value.isCollectPlus == 'true' : value.isCollectPlus) == isCollectPlus;
    },

    shareLocationHandler = function() {
      var $shareLocationButton = $('#shareLocationButton'),
        $collectionPostcodeInput = $('#collectionDeliveryPostcode'),
        $map,
        $notMyLocation,
        locationShown = false,

        getLocation = function(position) {
          if (typeof position != "undefined") geoCodeCoordinates(position.coords.latitude, position.coords.longitude);
        },

        geoCodeCoordinates = function(latitude, longitude) {
          var url = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDcpqci0Z0_bZqS6Tw8piP1hDrr2C-mIpI&result_type=postal_code';

          $.get(url + '&latlng=' + latitude + ',' + longitude, function(res) {
            processGeocoding(res);
          });
        },

        processGeocoding = function(res) {
          if (typeof res != "undefined" && typeof res.results != 'undefined' && res.results.length > 0) {
            var i = 0,
              closestPostcodeObject = '';
            //Looping through the results array until we find postcode type
            while (i < res.results.length - 1) {
              var addressObj = res.results[i];
              for (var j in addressObj.address_components) {
                if ((addressObj.address_components[j].types[0] == 'postal_code' || addressObj.address_components[j].types[0] == 'postal_code_prefix') && addressObj.address_components[j].long_name.length > 4) {
                  closestPostcodeObject = res.results[i];
                  break;
                }
              }
              i++;
            }
            if (closestPostcodeObject != '') {
              $collectionPostcodeInput.val(closestPostcodeObject.address_components[0].long_name);

              if (typeof google != "undefined") showGoogleMap(closestPostcodeObject);
              showNotMyLocation();
            } else {
              alert('We cannot process your location into postcode. Please enter postcode manually');
            }
          }
        },

        showGoogleMap = function(obj) {
          var mapOptions = {
              zoom: 15
            },
            mapId = 'closestPostcodeMap';

          $map = $('<div />', { id: mapId });

          $collectionPostcodeInput.parent().before($map);
          Salmon.Global.uiBlocker.removeLoader($shareLocationButton);
          $shareLocationButton.removeClass('loading');
          mapOptions.center = new google.maps.LatLng(obj.geometry.location.lat, obj.geometry.location.lng);

          var map = new google.maps.Map($('#' + mapId)[0], mapOptions),
            marker = new google.maps.Marker({
              icon: Salmon.Global.PageContext.IMAGEPATH + "markers/image.png",
              position: mapOptions.center,
              title: obj.address_components[0].long_name
            });
          marker.setMap(map);
          locationShown = true;
        },

        showNotMyLocation = function() {
          $notMyLocation = $('<a />', {
            id: "notMyLocation",
            href: "#",
            text: 'Not correct location?'
          });

          $collectionPostcodeInput.parent().before($notMyLocation);

          $(document).on('click', '#notMyLocation', function(e) {
            e.preventDefault();
            locationShown = false;
            removeLocation();
          });
        },

        removeLocation = function() {
          $notMyLocation.remove();
          if ($map) $map.slideToggle(function() {
            $map.remove();
          });

          $collectionPostcodeInput.val('');
          $collectionPostcodeInput.focus();
        },

        errorCallback = function() {
          $shareLocationButton.hide();
        };


      $shareLocationButton.on('click', function(e) {
        e.preventDefault();

        // sepparate statement as otherwise there is slight delay on adding loader
        if (!locationShown) {
          Salmon.Global.uiBlocker.insertLoader($shareLocationButton);
          $shareLocationButton.addClass('loading');
        }
        if (navigator.geolocation && !locationShown) {

          navigator.geolocation.getCurrentPosition(getLocation, errorCallback);
        }
      });
    },

    setNewShopsAndPostcode = function(newShops, postCode) {
      shops = newShops;
      currentPostcode = postCode;
    };




  init();
  return {
    setNewShopsAndPostcode: setNewShopsAndPostcode
  };
};



$(document).ready(function() {
  App.Checkout.Anonymous.DeliveryTabsNew = App.Checkout.Anonymous.DeliveryTabsNew();
  App.Checkout.Anonymous.PersonalAndDeliveryDetailsValidatorNew();
});
