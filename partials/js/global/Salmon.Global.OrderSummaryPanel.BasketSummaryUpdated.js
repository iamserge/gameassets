var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.OrderSummaryPanel = Salmon.Global.OrderSummaryPanel || {};

/**
 * This component will show the most recently added product in their basket. This functionality occurs once the user
 * successfully adds a product to their basket, and acts as an acknowledgement to the user.
 * @author Pawel Magrian
 * @name RecentlyAdded
 * @class Singleton
 * @static
 * @constructor
 * @memberOf Salmon.Global.OrderSummaryPanel
 * @requires 
 * 	jQuery1.4.2.js
 */
Salmon.Global.OrderSummaryPanel.BasketSummaryUpdated = new(function() {
  var $root,
    hideDuration = 500,
    cssHideClass = "hide",
    cssFixedClass = "fixedRecentlyAdded",
    // timeout,
    open = false;

  /**
   * initialise onDomReady by finding/creating dom elements
   * @function
   * @private
   * @memberOf Salmon.Global.OrderSummaryPanel.BasketSummaryUpdated
   */
  function init() {
    $root = (function() {
      var div = document.createElement("div");
      var wrapper = $('.wrapper')[0];

      div.id = 'addToBasketMerchandising';
      $(div).addClass("recentlyAdded");
      $(div).addClass(cssHideClass);
      $(wrapper).prepend(div);

      return $(div);
    }());

    if (Salmon.Components) {
      if (Salmon.Components.Corners) {
        new Salmon.Components.Corner($root, ["br", "bl"]);
      }
    }
  }

  /*
   * If user enters the panel while it is showing kill the timeout function
   * @name recentlyAdded_mouseEnter
   * @private
   * @function
   * @memberOf Salmon.Global.OrderSummaryPanel.BasketSummaryUpdated
   * @param e the event object
  function recentlyAdded_mouseEnter(e) {
  	 clearTimeout();
  }
   
  function recentlyAdded_mouseLeave(e) {
  	hide();
  }
  */

  /**
   * Allows the user to update the html inside the recently added panel so that the most recent product is represented.
   * @function
   * @name Salmon.Global.OrderSummaryPanel.BasketSummaryUpdated.updateHtml
   * @memberOf Salmon.Global.OrderSummaryPanel.BasketSummaryUpdated
   * @param {String} html The string of html to update the element with when a product is added to basket
   */
  function updateHtml(html) {
    if (!$root) return;
    if (!html) return;

    $root.empty().append(html);

    var closeControl = document.createElement('div');
    var closeControlA = document.createElement('a');
    var closeControlSpan = document.createElement('span');

    closeControlA.href = '#';
    closeControlA.appendChild(closeControlSpan);
    closeControl.appendChild(closeControlA);
    closeControl.id = 'closeControl';

    $root.append(closeControl);
    $(closeControlA).bind('click', hide);
    $root.find('li.continue').children('a').bind('click', hide);

    // also close overlay when clicking on background
    $('#overlay').bind('click', hide);
  }

  function callCoremetrics(script) {
    var $script = $(script);
    for (var i = 0; i < $script.length; i++) {
      if ($script[i].innerHTML) {
        var scriptHtml = $script[i].innerHTML.replace("<!--", "").replace("//-->", "").replace(/^\s*/, "").replace(/\s*$/, "");
        if (scriptHtml.indexOf("cmSet") !== 0) {
          // alert(scriptHtml);
          eval(scriptHtml);
        }
      }
    }
  }

  /*
   * Will show the most recently added product panel for a configurable amount of time. The configurable amount of time is 
   * currently set inside this JavaScript file.
   * @function
   * @name Salmon.Global.OrderSummaryPanel.BasketSummaryUpdated.show
   * @memberOf Salmon.Global.OrderSummaryPanel.BasketSummaryUpdated
  function show() {
  	open = true;
  	clearTimeout();
  	$root.removeClass(cssHideClass);
  	$root.css("opacity", "1");
  	
  	var height = (document.getElementById("header")) ? $(document.getElementById("header")).outerHeight() : 0,
  		scroll = window.scrollY || $(window).scrollTop();
  	
  	if (scroll > height) {
  		$root.addClass(cssFixedClass);
  	}
  	
  	$(window).bind("scroll", function() {
  		if ($(this).scrollTop() <= height) {
  			$root.removeClass(cssFixedClass);
  		} else {
  			$root.addClass(cssFixedClass);
  		}
  	});
  	
  	if (Salmon.Components) {
  		if (Salmon.Components.Corners) {
  			new Salmon.Components.Corner($root, ["br", "bl"]);
  		}
  	}
  	
  	timeout = window.setTimeout(hide, hideDelay);
  }
  */

  /*
   * simpler open function to bring in line with PDP
   **/
  function show() {
    open = true;

    $root.removeClass(cssHideClass);
    $root.css("opacity", "1");

    document.getElementById('overlay').style.display = 'block';

    Salmon.Global.AnimateScrollTo(document.body);
  }

  /*
  function clearTimeout() {
  	window.clearTimeout(timeout);
  }
  */

  /**
   * hide the recently added element after the configurable time
   * @function
   * @private
   * @memberOf Salmon.Global.OrderSummaryPanel.BasketSummaryUpdated
   */
  function hide() {
    $root.animate({ "opacity": "0" }, {
      duration: hideDuration,
      complete: function() {
        open = false;
        $root.addClass(cssHideClass);
        $root.removeClass(cssFixedClass);
        $(window).unbind("scroll");
        document.getElementById('overlay').style.display = 'none';
      }
    });
  }

  /**
   * This can be used to check whether the recently added panel is open or not and is 
   * used within Salmon.Global.OrderSummaryPanel.ItemsList.js
   * @name isOpen
   * @memberOf Salmon.Global.OrderSummaryPanel.BasketSummaryUpdated
   * @function
   * @return {Boolean} True if RecentlyAdded is showing, otherwise false
   */
  function isOpen() {
    return open;
  }

  $(init);

  this.updateHtml = updateHtml;
  this.callCoremetrics = callCoremetrics;
  this.show = show;
  this.isOpen = isOpen;
});
