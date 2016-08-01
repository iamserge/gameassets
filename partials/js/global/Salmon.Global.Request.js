var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};

/**
 * Setup file for general handling of AJAX requests including showing
 * loading indicators and error messages
 * @class Singleton
 * @constructor
 * @static
 */
Salmon.Global.RequestName = "";
Salmon.Global.Request = function() {
  var $document = $(document);

  $document.ajaxError(function() {
    Salmon.Global.StatusIndicator.showIndicator("An error has occured");
    window.setTimeout(function() {
      Salmon.Global.StatusIndicator.hideIndicator();
    }, 1500);
  });

  $document.ajaxSend(function() {
    if (Salmon.Global.RequestName === "avail") {
      Salmon.Global.RequestName = "";
    } else {
      Salmon.Global.StatusIndicator.showIndicator();
    }
  });

  $document.ajaxStop(function() {
    Salmon.Global.StatusIndicator.hideIndicator();
  });

  /*
  function Request() {
  	// effectively use this as a wrapper so that we 
  	// can have common functionality for all Salmon ajax request
  	
  	var loadingText = Salmon.StoreText["loadingText"] || "Loading text"; 
  		
  	function beforeSendBase() {
  		Salmon.Global.StatusIndicator.showIndicator(loadingText);
  		//if beforeSend();
  	}
  	
  	function completeBase() {
  		Salmon.Global.StatusIndicator.hideIndicator();
  		// do some common stuff for Salmon
  	}
  	
  	function successBase() {
  		// do some common stuff for Salmon		
  	}	
  	
  	function errorBase() {
  		// do some common stuff for Salmon		
  	}
  	
  	return $.ajax({
  		url: options.url,
  		beforeSend: beforeSendBase,
  		complete: completeBase,
  		success: successBase,
  		error: errorBase
  	});
  }
	
  return Request;	
  */
};
if (!Salmon.Global.FeatureToggles.getFeature('NewHeaderAndFooter')) Salmon.Global.Request();
