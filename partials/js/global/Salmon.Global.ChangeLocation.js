var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};


Salmon.Global.ChangeLocationNew = (function(){
	var $overlay, 
		$overlayContent, 
		$close,
		$overlayTitle,
		$chosenLocation,
		$searchInput,
		$searchButton,
		$errorField,
		$shopsList,
		$orText,
		$resetStateButton,
		$shareLocationButton, 
		$allowLocationText, 
		$shopDetails, 
		$shopTitle, 
		$shopAddress, 
		$shopHours,
		$searchButton,
		$newPostcode,
		$isCollectPlus,
		shops, 
		selectedShop,
		selectedShopIndex = 0,
		locationTimeout,
		mapOptions = {
		    zoom: 13
		},
		isGuest = false,
		geolocationAllowed = false,
		geoLocationFailed = false,
		currentLocation,
		requestUrl = '/webapp/wcs/stores/servlet/AJAXGetDeliveryPoints',
		isCollectPlus = false,

		eventListeners = function(){
			$(document).on('click', '.changeLocation', function(e){
				e.preventDefault();
				showOverlay();
			});

			$(document).on('click', '#locationChangeContainer .shopsList li', function(e){
				e.preventDefault();
				selectedShopIndex = $.inArray(this, $('#locationChangeContainer .shopsList li'));
				setupShopDetails();
			});

			$(document).on('click', '#locationChangeContainer .searchButton', function(e){
				e.preventDefault();
				if ($(this).hasClass('inputShown')) {
					currentLocation = $searchInput.val();
					sendRequest("postalCode=" + currentLocation);
					$newPostcode.val(currentLocation)
				} else {
					searchAnotherLocation();
				}
			});
			$(document).on('click', '#locationChangeOverlay', function(e){
				
				if ($(e.target).is('#locationChangeOverlay')) {
					e.preventDefault();
			        closeOverlay();
			    }
				
			});

			$(document).on('click', '#locationChangeContainer .close ', function(e){
				e.preventDefault();
				closeOverlay();
			});


			$(document).on('keyup change autocomplete', '#locationChangeContainer input.search', function(e){
				e.preventDefault();
				validateSearchField($(this));
			});
			
			//Bind the keydown event for the search textbox, this seems already binded somewhere and will trigger the submit of the form
			//So here we re-bind the event to do the search logic.
			$(document).on('keydown', '#locationChangeContainer input.search', function(e){
				if (e.keyCode === 13) {
					e.preventDefault();
					validateSearchField($(this));
					if(!$searchButton.hasClass('disabled')){
						sendRequest("postalCode=" +$searchInput.val());
						currentLocation = $searchInput.val();
					}
				}
			});

			$(document).on('click', '.chooseThisLocation', function (e) {
				if (!isGuest) {
					if (isCollectPlus) 
						$('#selectedCCPlusShop').val(selectedShop.shopName)
					else 
						$('#selectedCCShop').val(selectedShop.shopName);
					$('#expressCheckoutDetails').addClass('notValidate');

					if (typeof sessionStorage != 'undefined') {
						sessionStorage.setItem(selectedShop.shopName.replace(/ /g,'') + '_shop', JSON.stringify(selectedShop));
					}
					//$('#expressCheckoutDetails').append('<input type="hidden" name="submitStore" value="Choose location" />')
					//$('#expressCheckoutDetails').submit();
				} else {
					e.preventDefault();
					if(typeof(selectedShop) != 'undefined'){
						var shopSelectedEvent = document.createEvent("CustomEvent");
						shopSelectedEvent.initCustomEvent("shopSelectedEvent", true, true, selectedShop);
						window.dispatchEvent(shopSelectedEvent);
						populateAddressFields(selectedShop.address);
					}
					closeOverlay();
				}
				
			});
			

			$(document).on('click','.shareLocation', function(e){
				e.preventDefault();
				if (navigator.geolocation) {
			        navigator.geolocation.getCurrentPosition(setupLocationFromGeolocation,geoLocationFail);
			    }
			});
		},

		showOverlay = function() {


			$overlay.show();
			$overlayContent.show();
			google.maps.event.trigger(map, 'resize');
			if (typeof shops == 'undefined' && !isGuest) {
				currentLocation = $newPostcode.val();
				if (currentLocation.length > 0) {
					isCollectPlus = ($isCollectPlus.val() == 'true');
					sendRequest("postalCode=" + currentLocation);
					$chosenLocation.text(currentLocation);
					
				}
			} else {
				setupDefaultLocation();
			}
			if (!isGuest) {
				$searchInput.attr('placeholder', $newPostcode.val());
			}
			$overlay.find('.modalContent').addClass('opened');
			searchAnotherLocation();
			

			
			//$searchInput.val($('#deliveryTabs .tab').eq($('#deliveryTabsNavigation a.selected').index()).find('input:text').val());

		},
		setupDOMElements = function() {

			$overlay = $('#locationChangeOverlay');
			$overlayContent = $('#locationChangeContainer');
			$close = $overlayContent.find('.close');
			$overlayTitle = $overlayContent.find('h2 .text');
			$chosenLocation = $overlayContent.find('.chosenLocation');
			$searchInput = $overlayContent.find('input.search');
			$searchButton = $overlayContent.find('.searchButton');
			$orText = $overlayContent.find('.or');
			$resetStateButton = $overlayContent.find('.resetState');
			$allowLocationText = $overlayContent.find('.allowText');
			$shareLocationButton = $overlayContent.find('.shareLocation');
			$errorField = $overlayContent.find('span.error');
			$shopsList = $overlayContent.find('.shopsList');
			$shopDetails = $overlayContent.find('.detailsContainer');
			$shopTitle = $shopDetails.find('h3');
			$shopAddress = $shopDetails.find('.address');
			$shopHours = $shopDetails.find('.hours');
			$newPostcode = $('#newPostcode');
			$isCollectPlus = $('#isCollectPlus');

		},

		setupGoogleMap = function () {
			
		
			mapOptions.center = new google.maps.LatLng(selectedShop.latitude, selectedShop.longitude);
			var map = new google.maps.Map($('#map')[0], mapOptions),
			marker = new google.maps.Marker({
			    icon : Salmon.Global.PageContext.IMAGEPATH + "markers/image.png",
			    position: mapOptions.center,
			    title: selectedShop.shopName
			});
			marker.setMap(map);
	
		},

		setupShops = function(predefinedShops, collectPlus, defaultLocation) {
			if (predefinedShops) shops = predefinedShops;
			if (typeof collectPlus != 'undefined') isCollectPlus = collectPlus;
			if (defaultLocation) {
				currentLocation = defaultLocation;
				$searchInput.attr('placeholder', currentLocation);
			} 
			shops = shops.filter(checkIfCCArray);
			$shopsList.html('');
			for (var i in shops) {
				var shop = shops[i];
				$shopsList.append('<li>' + capitalizeShopName(shop.shopName) + '<span>' + parseFloat(shop.distance).toFixed(1) + ' miles</span></li>');

				
			}
			selectedShopIndex = 0;
			setupShopDetails();

		},

		setupShopDetails = function(){
			var setupShopAddress = function(){
					if ( typeof selectedShop.address == "object") {
						var address = "";
						for (var i in selectedShop.address) {
							address += ', ' + selectedShop.address[i];
						}
						$shopAddress.text(address.slice(2, address.length));
					} else {
						$shopAddress.text(selectedShop.address);
					}
				},
				setupShopTimes = function(){
					$shopHours.html('');
					for( var i in selectedShop.times) {
						var timesInfo = selectedShop.times[i];
						if (typeof selectedShop.times[i] == 'object') {
							$shopHours.append(timesInfo.dayOfWeek.slice(0,3) + ' ' + timesInfo.openTime.slice(0,5) + ' - ' + timesInfo.closeTime.slice(0,5) + '<br/>');
						} else {
							$shopHours.append(timesInfo + '<br/>');
						}
					}
				};

			selectedShop = shops[selectedShopIndex];
			$shopTitle.text(capitalizeShopName(selectedShop.shopName));
			setupShopAddress();
			setupShopTimes();
			if (typeof google != "undefined") setupGoogleMap();
			$shopsList.find('.selected').removeClass('selected');
			$($shopsList.find('li')[selectedShopIndex]).addClass('selected');
			$("#selectStore").val(selectedShop.submitAddress);
			$("#addressField1").val(selectedShop.addressField1);	

		},

		sendRequest = function(searchQuery) {
            
			$.get(requestUrl + '?' + searchQuery , function(res) {
				processNewShops(res);
			});

		},

		processNewShops = function(res) {
			if (res) {
				shops = res.shops;
				if (shops.length == 0) {
					alert(Salmon.Global.CurrentPageStoreText.noShops);
				} else {
					if (!isGuest) 
						App.Basket.ExpressCheckout.DeliveryOptionsNew.setDefaultStores(shops);
					else
						App.Checkout.Anonymous.DeliveryTabsNew.setNewShopsAndPostcode(shops, currentLocation);

					setupShops();
					$searchInput.attr('placeholder', currentLocation);
					//resetState();
					
					if (!$overlayContent.hasClass('opened')) {
						$overlayContent.addClass('opened');
						$overlayTitle.text(Salmon.Global.CurrentPageStoreText.nearestShopsTo);
					} 
				}
			}
		},

		validateSearchField = function($field) {

			if (!/^[a-zA-Z0-9 .]*$/.test($field.val())) {
				$errorField.fadeIn().css("display","block");;
				$searchButton.addClass('disabled');
			} else {
				if($errorField.is(':visible')) $errorField.fadeOut();
				if ($field.val().length > 0) {
					//$chosenLocation.text($field.val());
					$searchButton.removeClass('disabled');
				} else {
					$searchButton.addClass('disabled');
				}
			}

		},

		capitalizeShopName = function(shopName) {

			var shopNameArr = shopName.split(" "),
				capitalizedShopName = "";

			for(var i in shopNameArr) {
				capitalizedShopName += (shopNameArr[i].charAt(0).match(/[a-z]/i)) ? shopNameArr[i].charAt(0).toUpperCase() + shopNameArr[i].slice(1).toLowerCase() : shopNameArr[i].charAt(0) + shopNameArr[i].charAt(1).toUpperCase() + shopNameArr[i].slice(2).toLowerCase()
				capitalizedShopName += " ";
			}

			return capitalizedShopName;

		},

		populateAddressFields = function(address) {
			var $addressFieldsContainer = $('.section.ccAddress');
			for (var key in address) {
				$addressFieldsContainer.find('input[name="' + key + '"]').val(address[key]);
			}
		},

		closeOverlay = function() {

			$overlay.hide();
			$overlayContent.hide().removeClass('opened');
			

			$overlayTitle.text(Salmon.Global.CurrentPageStoreText.findNearest);
			$searchButton.text(Salmon.Global.CurrentPageStoreText.search);
			resetState();
			$chosenLocation.text('');

		},

		resetState = function() {

			if (!geolocationAllowed) {
				$orText.show();
				$allowLocationText.show();
			}
			$searchInput.hide();
			$searchButton.show()
						 .text(Salmon.Global.CurrentPageStoreText.chooseDifferent)
						 .removeClass('inputShown')
						 .removeClass('disabled');
			$resetStateButton.hide();
			$chosenLocation.text(currentLocation);
		},

		setupDefaultLocation = function(){

			//Only show address for default address if user didnt allow geolocation and it is registered checkout.
			if (shops.length > 0) {
				if (!isGuest) {
					currentLocation = $newPostcode.val();
					$chosenLocation.text(currentLocation);
				} else {
					if ($newPostcode.val().length > 0) 
						$chosenLocation.text($newPostcode.val());
					else
						$chosenLocation.text($('#collectionDeliveryPostcode').val());
				}
				
				$overlayContent.addClass('opened');
				
			}
			

		},

		geoLocationFail = function(error){
			
			
			if (error.code == error.PERMISSION_DENIED) {
		      	alert(Salmon.Global.CurrentPageStoreText.geolocationDenied);
		    } else {
		    	alert(Salmon.Global.CurrentPageStoreText.noGeolocation);
		    }
			geoLocationFailed = true
			$orText.hide();
			$shareLocationButton.hide();


		},

		setupLocationFromGeolocation = function(position) {
			
			//sendRequest('coordinates=' + position.coords.latitude + ',' + position.coords.longitude);
        	currentLocation = Salmon.Global.CurrentPageStoreText.yourLocation;
        	
        	if (typeof position != "undefined") geoCodeCoordinates(position.coords.latitude, position.coords.longitude);
        	
        	$newPostcode.val(currentLocation);
        	$shareLocationButton.hide();
        	$orText.hide();
		},

		geoCodeCoordinates = function(latitude, longitude) {
			var url = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDcpqci0Z0_bZqS6Tw8piP1hDrr2C-mIpI&result_type=postal_code';

			$.get(url + '&latlng=' + latitude + ',' + longitude, function(res){
				processGeocoding(res);
			});
		},

		processGeocoding = function(res) {
			if (typeof res != "undefined" && typeof res.results != 'undefined' && res.results.length > 0) {
				var closestPostcodeObject = res.results[0];
				if (closestPostcodeObject.address_components[0].types[0] == 'postal_code') {
					$searchInput.val(closestPostcodeObject.address_components[0].long_name);
					
					sendRequest("postalCode=" +$searchInput.val());
		
					//currentLocation = $searchInput.val();
					//if (typeof google != "undefined") showGoogleMap(closestPostcodeObject);
					//showNotMyLocation();
				}
			}
		},

		checkIfGeolocationWasDenied = function(){
			if (geoLocationFailed) {
				$orText.hide();
				$shareLocationButton.hide();
			} else {
				$orText.show();
				$shareLocationButton.show();
			}
		},

		searchAnotherLocation = function() {

			currentLocation = $chosenLocation.text();
			//$searchInput.val('');
			$searchInput.fadeIn();
			$searchButton.addClass('inputShown disabled').text('Search');
			checkIfGeolocationWasDenied();

		},
		checkIfCCArray = function(value) {
			return (typeof value.isCollectPlus == 'string' ? value.isCollectPlus == 'true' : value.isCollectPlus) == isCollectPlus;
		},


		init = function() {
			setupDOMElements();
			if (typeof Salmon.Global.InitialCCShops != 'undefined' && Salmon.Global.InitialCCShops.shops.length > 0) {
				
				isCollectPlus = ($isCollectPlus.val() == 'true');
				shops = Salmon.Global.InitialCCShops.shops;
				setupShops();
			} 
			if ($('body').attr('id') == 'pgDelivery') isGuest = true;
			
			eventListeners();
			
		};
		if ($('.changeLocation').length > 0) init();
		return {
			setupShops: setupShops
		}
})();
