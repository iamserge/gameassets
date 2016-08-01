var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.Fixes = Salmon.Global.Fixes || {};
/**
 * Fixes
 * @author Serge Radkevics
 * @name Fixes
 * @class Singleton
 * @static
 * @constructor
 * @memberOf Salmon.Global
 * @requires 
 *  jQuery1.3.1.js
 *  <br/>Adoro.DropDownMenu.js
 */

Salmon.Global.Fixes.isTouchSupported = function() {

  var msTouchEnabled = window.navigator.msMaxTouchPoints;
  var generalTouchEnabled = "ontouchstart" in document.createElement("div");

  if (msTouchEnabled || generalTouchEnabled) {
    return true;
  }
  return false;
};





Salmon.Global.Fixes.FooterSignUp = new(function() {
  $(document).ready(function() {


    var isNewHeader = Salmon.Global.FeatureToggles.getFeature('NewHeaderAndFooter');
    var $newsletter = (isNewHeader) ? $('footer .comminitySection') : $('#footer .newsletter');


    if ($newsletter.length > 0) {
      var $input = (isNewHeader) ? $newsletter.find('input') : $newsletter.find('#logonEmailId');
      var $submit = (isNewHeader) ? $newsletter.find('#submitEmail') : $newsletter.find('#signUpBtn');
      var requestUrl = '/webapp/wcs/stores/servlet/NewsLetterEmailInterface?',
      validateEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      },

      urlSubmit = function() {
        var val = $input.val(),
          error = false;


        $newsletter.find('.error').remove();
        if (val === '')
          error = 'Please enter email';
        else
        if (!validateEmail(val))
          error = 'Please enter a valid email address';

        if (!error) {
          $.get(requestUrl + 'email=' + val, function(res) {
            console.log(res);
            res = JSON.parse(res.replace('/*', '').replace('*/', ''));
            if (res.success) {
              $submit.remove();
              $input.before('<h3>Your email was successfully added</h3>')
                .remove();
            } else {
              $input.before('<h3 class="error">Error occured</h3>');
            }
          });
        } else {
          $input.before('<span class="error">' + error + "</span>");
        }
      };

      if (isNewHeader) {
        $(document).on('click', '#footer #submitEmail', function() {
          urlSubmit();
        });
      } else {
        $(document).on('click', '#footer #signUpBtn', function() {
          urlSubmit();
        });
      }

    }
  });
});





Salmon.Global.Fixes.AJAXLoadHeader = function() {

  var $rewardMessageContainer,
    $miniBasketContainer,
    $itemCount,
    storeId,
    langId,
    rewardUrl = '/webapp/wcs/stores/servlet/AjaxRewardCardHeaderMessageView',
    miniBasketUrl = '/webapp/wcs/stores/servlet/AjaxMiniShoppingBagHeaderView',
    isNewHeader = Salmon.Global.FeatureToggles.getFeature('NewHeaderAndFooter');


  $(document).ready(function() {


    if ($('header').hasClass('checkout')) return;

    $rewardMessageContainer = $('header .accountDropdown');
    $miniBasketContainer = $('header .dropdownCart');
    $itemCountText = $('header #basketLink .text');


    storeId = $('input[name="storeId"]').val();
    langId = $('input[name="langId"]').val();
    if (typeof Game != 'undefined' && typeof Game.featureToggles != 'undefined')
      $rewardMessageContainer.addClass('loading');
    if (storeId === undefined || storeId === 'undefined') {
      storeId = '10151';
      console.log('Undefined storeId reverting to default 10151');
    }
    if (langId === undefined || langId === 'undefined') {
      langId = '44';
      console.log('Undefined langId reverting to default 44');
    }
    $.get(rewardUrl + '?storeId=' + storeId + '&langId=' + langId, function(res) {
      var resObj = JSON.parse(res);
      if (isNewHeader) {
        $rewardMessageContainer.html(resObj.newHtml)
      } else {
        var html = resObj.rewardCardHtml + resObj.rewardCardHtml_1 + resObj.rewardCardHtml_2 + "</div></div></li>";
        $rewardMessageContainer.replaceWith(html);
      }

      $('.topRowBlock.blockFour.withSubMenu').on('mouseover', function() {
        $(this).addClass('hover');
      })
      $('.topRowBlock.blockFour.withSubMenu').on('mouseout', function() {
        $(this).removeClass('hover');
      })
    });

    $miniBasketContainer.addClass('loading');
    $.get(miniBasketUrl + '?storeId=' + storeId + '&langId=' + langId + '&device=desktop', function(res) {
      var resObj = JSON.parse(res);

      //var html = resObj.rewardCardHtml + resObj.rewardCardHtml_1 + resObj.rewardCardHtml_2 + "</div></div></li>"; 
      if (isNewHeader) {
        $miniBasketContainer.html(resObj.miniShoppingBagHtmlNew);

        $itemCountText.show().text(resObj.amountOfItems);
      } else {
        $miniBasketContainer.html('');
        $miniBasketContainer.append(resObj.miniShoppingBagHtml);
        $miniBasketContainer.removeClass('loading');
      }
    });

  });
};

Salmon.Global.Fixes.GenerateAJAXHeader = function() {

  var $rewardMessageContainer,
    $miniBasketContainer,
    $itemCount,
    storeId,
    langId,
    rewardUrl = '/webapp/wcs/stores/servlet/AjaxInitialView',
    result,
    generateAccountMenu = function() {
      if (result.userInfo.isLoggedIn == 'true') {
        var html = '',
          userLinks = result.userInfo.loggedInUserLinks;
        html += '<span class="greeting">Hello ' + result.userInfo.userName + '</span>';
        html += '<span class="rewardPoints"><a href="' + result.rewardInfo.rewardCardURL + '">' + result.rewardInfo.rewardCardMessage + '</a></span>';
        html += '<div class="links">';
        for (var i in userLinks) {
          html += '<a href="' + userLinks[i].url + '">' + userLinks[i].title + '</a>';
        }
        html += '<a class="logoff" href="' + result.userInfo.logoffLink.url + '">' + result.userInfo.logoffLink.title + '</a>';
        $rewardMessageContainer.html(html);
      }
    },
    generateMiniBasket = function() {
      var amountOfItems = parseInt(result.orderInfo.orderQuantity),
        html = '';
      $miniBasketContainer.parent().find('span.text').text(amountOfItems);
      if (amountOfItems > 0) {
        var items = result.orderInfo.itemsList;
        for (var i in items) {
          var item = items[i];
          html += '<a href="' + item.productURL + '" class="item">';
          html += '<img src="' + item.packshotUrl + '" alt="' + item.productName + '" />';
          html += '<div>';
          html += '<h3>' + item.productName + '</h3>';
          html += '<div class="bottom">';
          html += '<span class="qty">Qty: ' + item.qty + '</span>';
          html += '<span class="price">' + item.price + '</span>';
          html += '</div>';
          html += '</div>';
          html += '</a>';
        }
        html += '<div class="totals">';
        html += '<span class="total">Total: ' + result.orderInfo.totalValue + '</span>';
        html += '<a class="btn primary" href="' + result.orderInfo.basketUrl + '">View basket</a>';
        html += '</div>';
      } else {
        html += '<p class="empty">0 items</p>';
      }
      $miniBasketContainer.html(html);
    }


  $(document).ready(function() {


    if ($('header').hasClass('checkout')) return;

    $rewardMessageContainer = $('header .accountDropdown');
    $miniBasketContainer = $('header .dropdownCart');


    storeId = $('input[name="storeId"]').val();
    langId = $('input[name="langId"]').val();
    if (typeof Game != 'undefined' && typeof Game.featureToggles != 'undefined')
      $rewardMessageContainer.addClass('loading');
    if (storeId === undefined || storeId === 'undefined') {
      storeId = '10151';
      console.log('Undefined storeId reverting to default 10151');
    }
    if (langId === undefined || langId === 'undefined') {
      langId = '44';
      console.log('Undefined langId reverting to default 44');
    }
    $.get(rewardUrl + '?storeId=' + storeId + '&langId=' + langId, function(res) {
      result = res;
      generateAccountMenu();
      generateMiniBasket();
    });



  });
};

var singleAjaxCallFeautre = Salmon.Global.FeatureToggles.getFeature('SingleAjaxCallHeader');

if (singleAjaxCallFeautre)
  Salmon.Global.Fixes.GenerateAJAXHeader();
else
  Salmon.Global.Fixes.AJAXLoadHeader();







Salmon.Global.NewHeaderFooter = (function() {


  var $menuLinks = $('.toggleContainer > .dropdownToggle'),
    $menuItems = $('.menuContainer > *'),
    headerHeight = $('header nav').height(),
    $searchResults = $('#searchResults'),
    $searchInput = $('#locateStoreHeader #searchInput'),
    $postcodeInput = $('#locateStoreHeader #storeLocInputHeader'),
    $postcodeSubmit = $('#locateStoreHeader .findStore'),
    typingTimer,
    $hoverLinks = $('header .departmentContainer > a, header .formatContainer > a'),
    isTouch = (function() {
      return 'ontouchstart' in window || 'onmsgesturechange' in window;
    })(),
    postcodeDropdownValidation = function() {
      var validate = function(val) {
        if (typeof val != 'undefined' && val.length > 0)
          $postcodeSubmit.removeClass('disabled');
        else
          $postcodeSubmit.addClass('disabled');
      }
      validate($postcodeInput.val());
      $postcodeInput.on('keyup', function() {
        validate($postcodeInput.val());
      });
    },
    footerController = function() {
      var $footer = $('footer'),
        $footerLinks = $('footer nav > a'),
        $footerSections = $('footer .sections section'),
        $closeButtons = $('footer .sections .close'),
        footerHeight = $('footer').height(),
        openSection = function($section) {
          $section.addClass('opened');
          /*TweenLite.to($section, 0.5, {
              top: parseInt($section.outerHeight() * -1) + "px",
              ease: Power4.easeInOut,
              onComplete: function() {

              }
          });*/

          $section.animate({
            top: parseInt($section.outerHeight() * -1) + "px"
          }, 200, function() {

          })
        },
        closeSection = function($section) {
          /*TweenLite.to($section, 0.2, {
              top: footerHeight + "px",
              onComplete: function() {
                  $section.removeClass('opened');
              }
          });*/

          $section.animate({
            top: footerHeight + 'px'
          }, 200, function() {
            $section.removeClass('opened');
          });
          $('body').off('click.closeFooter');
        }


      $footerLinks.on('click', function(e) {
        var $section = $footerSections.eq($.inArray(this, $footerLinks)),
          $selectedSection = $footerSections.filter('.opened');
        e.preventDefault();
        closeSection($selectedSection);
        $footerLinks.filter('.current').removeClass('current');
        $(this).addClass('current');
        if ($section[0] != $selectedSection[0]) openSection($section);
        $('body').on('click.closeFooter', function(e) {
          if (!$footer.is(e.target) && $footer.has(e.target).length === 0) {
            closeSection($section)
          }
        });
      });


      $closeButtons.on('click', function(e) {
        e.preventDefault();
        closeSection($(this).parent().parent());
        $footerLinks.filter('.current').removeClass('current');
      });

      window.addEventListener("orientationchange", function() {
        $('footer section').each(function() {
          closeSection($(this));
        })
      }, false);
    }

  if (isTouch) {
    $hoverLinks.on('touchend', function() {
      var $leftCol = $(this).parent().find('.dropdownMenu .leftCol');
      $leftCol.find('> div > a').eq(0).trigger('hover');
    })
  }


  postcodeDropdownValidation();
  footerController();
})();
