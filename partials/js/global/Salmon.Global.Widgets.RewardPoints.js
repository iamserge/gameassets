/*jshint multistr: true */
var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.Widgets = Salmon.Global.Widgets || {};
Salmon.Global.Widgets.BalanceChecker = (function() {
  var widgetHtml = '<div class="innerContainer">\
						<h2>Gift Card Balance Checker</h2>\
						<div class="inputContainers">\
							<div class="inputContainer card">\
								<span class="message"> Enter gift card number </span>\
								<div class="inputs">\
									<input type="text" class="cardNumber" maxlength="4"/>\
									<input type="text" class="cardNumber" maxlength="4"/>\
									<input type="text" class="cardNumber" maxlength="4"/>\
									<input type="text" class="cardNumber" maxlength="4"/>\
									<input type="text" class="cardNumber small" maxlength="3" />\
								</div>\
							</div>\
							<div class="inputContainer pin">\
								<span class="message"> Enter PIN</span>\
								<input type="text" class="pinNumber" maxlength="4"/>\
								<a href="#" class="showBalance">Show My Balance</a>\
							</div>\
						</div>\
						<div class="resultContainer">\
							<span class="title">Your GAME Gift Card Balance</span>\
							<span class="message">You have &pound;<span class="amount"></span> to spend with GAME</span>\
						</div>\
					</div>',
    errorMessages = {
      cardNumber: 'Card number should be numeric and 19 digits long',
      pinNumber: 'PIN number should be 4 characters long',
      invalidNumber: 'Invalid card number or PIN'
    },

    storeId,
    requestUrl = '/webapp/wcs/stores/servlet/GetVoucherAccountInterface?storeId=',
    widgetObj = function($widget) {
      var $inputs, $cardInputs, $pinInput, $submitButton, $resultContainer, $resultAmount, $innerContainer,
        init = function() {
          $widget.html(widgetHtml);
          setupDomVars();
          eventHandlers();
        },
        setupDomVars = function() {
          $inputs = $widget.find('input');
          $innerContainer = $widget.find('.innerContainer');
          $cardInputs = $widget.find('input.cardNumber');
          $pinInput = $widget.find('input.pinNumber');
          $submitButton = $widget.find('.showBalance');
          $resultContainer = $widget.find('.resultContainer');
          $resultAmount = $resultContainer.find('.amount');


        },
        eventHandlers = function() {

          $submitButton.on('click', sendRequest);
          $cardInputs.on({
            'keyup': function() {
              var $input = $(this),
                index = $.inArray(this, $cardInputs),
              val = $input.val(),
                maxLength = $input.hasClass('small') ? 3 : 4;
              if (val.length >= maxLength)
                if (!$input.hasClass('small'))
                  $($cardInputs[index + 1]).focus();
                else
                  $pinInput.focus();
            },
            'keydown': function(e) {
              console.log(e.which);
              if (isNaN(String.fromCharCode(e.which)) && e.which != '8' &&
                e.which != '46' &&
                e.which != '103' &&
                e.which != '104' &&
                e.which != '105' &&
                e.which != '100' &&
                e.which != '102' &&
                e.which != '97' &&
                e.which != '98' &&
                e.which != '101' &&
                e.which != '99' &&
                e.which != '96' &&
                e.which != '9') e.preventDefault();
            }
          });
          $inputs.on({
            'keyup': function() {
              if ($(this).hasClass('cardNumber')) {
                if (getCardNumberFromInputs().length == 19)
                  $cardInputs.each(function() {
                    $(this).removeClass('error');
                  });
              } else {
                if ($(this).val().length == 4)
                  $(this).removeClass('error');
              }
            }
          });
        },
        getCardNumberFromInputs = function() {
          var cardNumber = '';
          $cardInputs.each(function() { cardNumber += $(this).val(); });
          return cardNumber;
        },
        showError = function(errorFields) {
          $innerContainer.find('span.error').remove();
          var errorMessage = '';
          if (errorFields.length == 2) {
            errorMessage = errorMessages.cardNumber + '<br/>' + errorMessages.pinNumber;

            for (var i in errorFields) {
              $('.' + errorFields[i]).each(function() {
                $(this).addClass('error');
              });
            }
          } else {
            errorMessage = errorMessages[errorFields[0]];
            $('.' + errorFields[0]).each(function() {
              $(this).addClass('error');
            });
          }

          $innerContainer.prepend('<span class="error">' + errorMessage + '</span>');
        },
        checkParams = function(params) {
          var errorFields = [];
          if (params.pan.length != 19 || isNaN(params.pan)) errorFields.push('cardNumber');
          if (params.pin.length != 4) errorFields.push('pinNumber');

          if (errorFields.length === 0)
            return true;
          else
            showError(errorFields);
          return false;
        },
        sendRequest = function(e) {
          e.preventDefault();
          if ($(this).hasClass('clear')) {
            clearFields();
          } else {
            var params = {
              pan: getCardNumberFromInputs(),
              pin: $pinInput.val()
            };
            storeId = ($('input[name="storeId"]').val().length > 0) ? $('input[name="storeId"]').val() : '10151';
            if (checkParams(params))
              $.ajax({
                type: "POST",
                url: requestUrl + storeId,
                data: params,
                success: requestSuccess
              });
          }
        },
        clearFields = function() {
          $inputs.each(function() {
            $(this).val('');
          });
          $resultContainer.slideToggle();
          $($cardInputs[0]).focus();
          $submitButton.removeClass('clear').text('Show My Balance');
        },
        requestSuccess = function(res) {
          res = JSON.parse(res);
          $innerContainer.find('span.error').remove();
          $inputs.each(function() {
            $(this).removeClass('error');
          });
          $submitButton.addClass('clear').text('Check Another');
          if (typeof res.balance !== 'undefined') {
            $resultAmount.text(res.balance);
          } else {
            $resultAmount.parent().html(errorMessages.invalidNumber);
          }

          if (!$resultContainer.is(':visible')) $resultContainer.slideToggle();
        };
      init();
    };



  $(document).ready(function() {
    $('.balanceCheckerWidget').each(function() {
      var widget = new widgetObj($(this));
    });
  });
})();
