var App = App || {};
App.Checkout = App.Checkout || {};

App.Checkout.DeliveryAddressNew = function(){
	var addressSelectController = function(){
			var $select = $('#addressOptions'),
				$submitSelectionButton = $('#selectMultiAddress');

			
			if ($select.length > 0 && $select.find('option').length > 0) {

				$select.on('change', function(){
					if ($select.val().length > 0)  {
						Salmon.Global.uiBlocker.blockUI();
						$submitSelectionButton.trigger('click');
					}
				});
			}
		},
		countryChangeController = function(){
			var $lookupCountry = ($("#lookupCountry").length > 0) ? $("#lookupCountry") : $('select#country'),
				$lookupCountrySubmit = $lookupCountry.siblings("input[type='submit']").hide();
			
			$lookupCountry.bind("change", function() {
				
				$lookupCountrySubmit.trigger("click");
				
			});
		}
	countryChangeController();
	addressSelectController();

	var addressFieldsValidation = new Salmon.Global.Validation($('.addressFields'),{});
	addressFieldsValidation.validateOnClick($('input[name="createAddress"]'));


	var addressLookupValidation = new Salmon.Global.Validation($('#deliveryLookup > .field.postCode'), {
		addErorMessageToParent: true
	});

	addressLookupValidation.validateOnClick($('input[name="doPostCodeLookup"]'));
}

if ($('body').hasClass('delivery')) App.Checkout.DeliveryAddressNew();
