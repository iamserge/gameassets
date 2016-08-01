var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.MiniBasket = Salmon.Global.MiniBasket || {};

/**
 * This component will show the most recently added product in their basket. This functionality occurs once the user
 * successfully adds a product to their basket, and acts as an acknowledgement to the user.
 * @author Adam Silver
 * @name RecentlyAdded
 * @class Singleton
 * @static
 * @constructor
 * @memberOf Salmon.Global.MiniBasket
 * @requires 
 * 	jQuery1.4.2.js
 **/

Salmon.Global.MiniBasket.RecentlyAdded = new(function() {
  // var $root,
  //   hideDuration = 500,
  //   cssHideClass = "hide",
  //   cssFixedClass = "fixedRecentlyAdded",
  //   timeout;
    var open = false;

  /**
   * initialise onDomReady by finding/creating dom elements
   * @function
   * @private
   * @memberOf Salmon.Global.MiniBasket.RecentlyAdded
  function init() {
  	console.log('Salmon.Global.MiniBasket.RecentlyAdded.updateHtml.init!'); 

  	$root = (function() {
  		var div = document.createElement("div");
  		var wrapper = $('.wrapper')[0]; 

  		div.id = 'addToBasketMerchandising';
  		$(div).addClass("recentlyAdded");
  		$(div).addClass(cssHideClass);
  		$(wrapper).prepend(div); 

  		return $(div);
  	}());
  			
  	*/
  /*
  		if (Salmon.Components) {
  			if (Salmon.Components.Corners) {
  				new Salmon.Components.Corner($root, ["br", "bl"]);
  			}
  		}
  		*/
  /*
  	}
  	*/

  /**
   * Allows the user to update the html inside the recently added panel so that the most recent product is represented.
   * @function
   * @name Salmon.Global.MiniBasket.RecentlyAdded.updateHtml
   * @memberOf Salmon.Global.MiniBasket.RecentlyAdded
   * @param {String} html The string of html to update the element with when a product is added to basket
   *
  function updateHtml(html) {
  	console.log('Salmon.Global.MiniBasket.RecentlyAdded.updateHtml!'); 
  	
  	if(!$root) return;
  	if(!html) return;

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
  }
  **/

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
   * simpler open function to bring in line with PDP
  function show() {
  	console.log('open the overlay!'); 
  	
  	open = true;

  	$root.removeClass(cssHideClass);
  	$root.css("opacity", "1");
  	
  	document.getElementById('overlay').style.display = 'block'; 
  	
  	Salmon.Global.AnimateScrollTo(document.body);
  }
  **/

  /*
   * open function using Adoro
   **/
  function show(content) {
    // console.log('open the overlay via Adoro!'); 

    open = true;

    Adoro.Dialogue.setHtml('<div class="basketAddedContent">' + content + '</div>');
    Adoro.Dialogue.showDialogue({
      callback: function() {
        if ($('#dialogue #warranty').length > 0) {

          //initialize warranties
          Salmon.Global.Warranties.AddToBasketOverlay();
          if ($('#dialogue #warranty .inner').length > 0) {
            setInterval(function() {
              $('#dialogue #warranty').addClass('open');
            }, 700);
          }

        }
      },
      extraHeight: -156
    });
    // expand warraties section if exist
    /*if ($('#dialogue #warranty').length > 0) {
    	$('#dialogue #warranty').addClass('open');
    	//$('#dialogue').css('top',parseInt($('#dialogue').css('top')) - 156);
    }*/
    // add event listener for 'keep item' action
    $('div.price-increase li.keep a').bind('click', showDefaultOptions);

    // add event listener for 'continue' action
    $('div.checkoutInfo li.continue a').bind('click', hide);

    // also close overlay when clicking on background
    $('#overlay').bind('click', hide);
  }

  /*
   * show the default options when required
   **/
  function showDefaultOptions(e) {

    $(this).parents('div').find('.orderDetails .mpStatus').css('display', 'none');
    $(this).parentsUntil('ul').parent().css('display', 'none');
    $(this).parentsUntil('ul').parent().siblings().css('display', 'block');

    e.preventDefault();
  }

  /*))
   * close function using Adoro
   **/
  function hide(e) {
    // console.log('close the overlay via Adoro!'); 

    open = false;

    Adoro.Dialogue.setHtml('');
    Adoro.Dialogue.hideDialogue();

    e.preventDefault();
  }

  /**
   * hide the recently added element after the configurable time
   * @function
   * @private
   * @memberOf Salmon.Global.MiniBasket.RecentlyAdded
  function hide() {
  	$root.animate(
  		{"opacity": "0"}, 
  		{duration: 
  			hideDuration, 
  			complete: function() {
  				open = false;
  				$root.addClass(cssHideClass);
  				$root.removeClass(cssFixedClass)
  				$(window).unbind("scroll");
  				document.getElementById('overlay').style.display = 'none'; 
  			}
  		}
  	);
   }
  **/

  /**
   * This can be used to check whether the recently added panel is open or not and is 
   * used within Salmon.Global.MiniBasket.ItemsList.js
   * @name isOpen
   * @memberOf Salmon.Global.MiniBasket.RecentlyAdded
   * @function
   * @return {Boolean} True if RecentlyAdded is showing, otherwise false
   **/
  function isOpen() {
    return open;
  }

  // $(init);

  // this.updateHtml = updateHtml;
  this.callCoremetrics = callCoremetrics;
  this.show = show;
  this.isOpen = isOpen;
});
