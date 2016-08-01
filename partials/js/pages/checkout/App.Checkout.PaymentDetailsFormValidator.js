var App = App || {};
App.Checkout = App.Checkout || {};


App.Checkout.PaymentDetailsFormValidatorNew = function() {


	var $formNode = $('#newPayment'),
		alternativePayMethodsTriggers = function(){
			$('#payWithPaypalButton').on('click', function(e){
				e.preventDefault();
				validate = false;
				$formNode.append('<input type="hidden" name="usePayPal" value="PayPal" />');
				$formNode.submit();
			});

			$('#payWithGAMEWalletButton').on('click', function(e){
				e.preventDefault();
				validate = false;
				$formNode.append('<input type="hidden" name="useWallet" value="GAMEWallet" />');
				$formNode.submit();
			});

			$('#submitPromotionalCodeButton').on('click', function(e){
				e.preventDefault();
				validate = false;
				$formNode.append('<input type="hidden" name="submitPromotionalCode" value="Apply" />');
				$formNode.submit();
			});

			$('#submitEGiftcardNumberButton').on('click', function(e){
				e.preventDefault();
				validate = false;
				$formNode.append('<input type="hidden" name="submitEGiftcardNumber" value="Apply" />');
				$formNode.submit();
			});
		},
		validatePaymentMethod = function(){
			var paymnetDetailsValidationRules = {
					"account": [
						{
							"errorMessage": 'Please enter valid card number',
							"rule": function(val){
								return /^-?(\d+\.?\d*)$|(\d*\.?\d+)$/.test(val);
							}
						}
					],
					"postCode": [
						{
							"errorMessage": 'Please enter valid postcode',
							"rule": "postcode"
						}
					]
				}
			
			var paymnetDetailsValidation = new Salmon.Global.Validation($formNode, {
				specificValidationRules: paymnetDetailsValidationRules,
				addErorMessageToParent: true
			});

			paymnetDetailsValidation.validateOnClick($('#newPayment input[name="createPayment"]'));
		},
		validateAddressLookup = function(){
			var addressLookupValidation = new Salmon.Global.Validation($('#newPayment .billingAddress .labeledInputs'), {
				addErorMessageToParent: true,
				specificValidationRules: {
					"postCode": [
						{
							"errorMessage": 'Please enter valid postcode',
							"rule": "postcode"
						}
					]
				}
			});

			addressLookupValidation.validateOnClick($('#newPayment input[name="doPostCodeLookup"]'));
		},
		populatePostcodeFix = function(){
		    var $postcodeLookup = $('.billingAddress #zipCode'),
		        $addressPostcode = $('.addressFields #postCode');


		    if ($addressPostcode.length > 0 && $addressPostcode.val().length > 0 && $postcodeLookup.is(':visible')) $postcodeLookup.val($addressPostcode.val());
		
		    $('#newPayment input[name="createPayment"]').on('click',function(){
		        if ($addressPostcode.length > 0 && $postcodeLookup.is(':visible')) { 
		        	$postcodeLookup.val($addressPostcode.val());
		        } else {

		        }
		    })
		}

	populatePostcodeFix();
	alternativePayMethodsTriggers();
	validatePaymentMethod();
	validateAddressLookup();
};

App.Checkout.BillingAddressCheckboxController = function(){
	var $checkbox = $('#useShippingForBilling'),
		$billingAddressSection = $('.section.billingAddress');


	if ($checkbox.is(':checked')) {
		$billingAddressSection.hide();
	}

	$checkbox.on('change', function(){
		$billingAddressSection.slideToggle();
	});
}

App.Checkout.SelectAddressController = function(){
	var $select = $('#addressOptions'),
		$submitSelectionButton = $('#selectMultiAddress');

	
	if ($('.radioList.addresses').length > 0 && $select.length > 0 && $select.find('option').length > 0) {
		$("html, body").animate({ scrollTop: $('.radioList.addresses').offset().top + 100});

		$select.on('change', function(){
			if ($select.val().length > 0)  {
				Salmon.Global.uiBlocker.blockUI();
				$submitSelectionButton.trigger('click');
			}
		});
	}
}

App.Checkout.CardTypeRecognizer = function(){
	var $cardNumberInput = $('#cardNumber'),
		$cardTypeSelect = $('#cardType'),
		detectCardType =function(number) {
            var re = {
                electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
                maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
                visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
                mastercard: /^5[1-5][0-9]{14}$/
            };
            if (re.electron.test(number)) {
                return '11107';
            } else if (re.maestro.test(number)) {
                return '11104';
            } else if (re.visa.test(number)) {
                return '11101';
            } else if (re.mastercard.test(number)) {
                return '11102';
            } else {
                return undefined;
            }
        }

    $cardNumberInput.on('change blur',function(){
        var val = detectCardType($(this).val());
        if (typeof val != 'undefined') {
            $cardTypeSelect.val(val);
            $cardTypeSelect.trigger('change');
        }
    });
}

App.Checkout.AddNewCardController = function(){
	var $select = $('#selectBillingAddress'),
		$addNewButton = $('.addNewContainer a'),
		$continueButtonContainer = $('.addressSelectedContainer'),
		$continueButtonBottomContainer = $('.addCardBottomContainer'),
		$addressSelect = $('#addressOptions'),
		$addressFields = $('.addressFields'),
		$formNode = $('form#newPayment'),
		validatePaymentMethod = function(){
			var paymnetDetailsValidationRules = {
					"account": [
						{
							"errorMessage": 'Please enter valid card number',
							"rule": function(val){
								return /^-?(\d+\.?\d*)$|(\d*\.?\d+)$/.test(val);
							}
						}
					]
				}
			
			var paymnetDetailsValidation = new Salmon.Global.Validation($formNode, {
				specificValidationRules: paymnetDetailsValidationRules,
				addErorMessageToParent: true
			});

			paymnetDetailsValidation.validateOnClick($('#newPayment input[name="createPayment"]'));
		},

		validateAddressLookup = function(){
			var addressLookupValidation = new Salmon.Global.Validation($('#newPayment .billingAddress .labeledInputs'), {
				addErorMessageToParent: true
			});

			addressLookupValidation.validateOnClick($('#newPayment input[name="doPostCodeLookup"]'));
		},
		populatePostcodeFix = function(){
            var $postcodeLookup = $('#zipCode'),
                $addressPostcode = $('.addressFields #postCode');


            if ($addressPostcode.length > 0 && $addressPostcode.val().length > 0) $postcodeLookup.val($addressPostcode.val());
        }
		
	//Jira GAME-862 : 'use different address' value must be '-' not '-1'
	if ($select.val() != '-' && $addressSelect.length == 0 && $continueButtonBottomContainer.length == 0) { 
		$addressFields.hide();
	} else {
		if ($addressSelect.length > 0 && $addressSelect.find('option').length > 0) {
			$("html, body").animate({ scrollTop: $addressFields.offset().top - 50});
		}
	}
	$select.on('change', function(){
		if ($select.val() == '-') {
			$addressFields.slideDown();
			$continueButtonContainer.hide();
			$("html, body").animate({ scrollTop: $addressFields.offset().top - 50});
		} else {
			$addressFields.slideUp();
			$continueButtonContainer.show();
		}
		
	});

	$addNewButton.on('click', function(e){
		e.preventDefault();
		//Jira GAME-862 : set the selected address to "-" which means 'use different address'
		$select.val('-');
		$addressFields.slideToggle();
	});

	validatePaymentMethod();
	validateAddressLookup();
	populatePostcodeFix();
}

App.Checkout.FormErrors = function(){
	var $inputErrors = $('.field.fieldError');


	if ($inputErrors.length > 0) {
		$inputErrors.find('input').on('change', function(){
			$(this).parent().removeClass('fieldError');
			$(this).parent().find('.errorMessage').hide();
		})
	}
}


$(document).ready(function(){
	var isRegistered = ($('body').attr('id') == 'pgExpressPayment');
	
	if (!isRegistered) App.Checkout.PaymentDetailsFormValidatorNew();
	App.Checkout.BillingAddressCheckboxController();
	App.Checkout.SelectAddressController();
	App.Checkout.CardTypeRecognizer();
	App.Checkout.FormErrors();
	if (isRegistered) App.Checkout.AddNewCardController();
	
})
	