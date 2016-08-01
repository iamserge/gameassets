var App = App || {};
App.ProductLister = App.ProductLister || {};

App.ProductLister.List = new(function() {
  $(init);

  function init() {
    handleProductLister();
    handleFeaturedProducts();

  }

  function handleProductLister() {

    var $list = $("#productLister");
    if ($list.length === 0) return;
    new Salmon.Global.Truncator($list.find(Configuration.ProductLister.Truncator.node), Configuration.ProductLister.Truncator);
  }

  function handleFeaturedProducts() {
    var $featured = $("#featuredProducts");
    if ($featured.length === 0) return;
    new Salmon.Global.Truncator($featured.find(Configuration.ProductLister.Truncator.node), Configuration.ProductLister.Truncator);
  }
});


App.ProductLister.List.Ratings = new(function() {
  $(init);

  function init() {
    var ratings = $("li.review").removeClass("hide");
    new App.Global.Ratings(ratings);
  }

});

App.ProductLister.List.MissedPromotions = new(function() {
  $(init);

  function init() {
    if ((document.body.className).indexOf("missedPromotion") >= 0 && document.getElementById("applied")) {
      $(document).bind(Salmon.Global.CustomEvents.customProductAddedToBasket, function(e, json) {
        if (json.missedPromotionHeaderHtml) {
          if (json.missedPromotionHeaderHtml !== "") {
            $(document.getElementById("applied")).replaceWith($(json.missedPromotionHeaderHtml));
            try {
              Cufon.replace('#pgProductLister h1', { fontFamily: "CBJWT37" });
            } catch (err) {
              console.log("error in ProductLister.List @ line 47");
              console.log(err);
            }
          }
        }
      });
    }
  }

});

App.ProductLister.List.productView = function() {
  $(init);

  function init() {
    console.log("logging: list68");
    var storageHandler = new App.Global.StorageHandler();
    var isStorage = storageHandler.check();
    var gallery = $('#productLister .products');
    var galleryView = document.getElementById('galleryView') || null;
    var listView = document.getElementById('listView') || null;
    var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    if (isStorage) {
      if (galleryView && listView) {
        if (storageHandler.get('productView') == 'galleryView') {
          $(gallery)
            .removeClass('listView')
            .addClass('galleryView');

          galleryView.checked = true;
          listView.checked = false;
        } else if (storageHandler.get('productView') == 'listView') {
          $(gallery)
            .removeClass('galleryView')
            .addClass('listView');

          galleryView.checked = false;
          listView.checked = true;
        }
      }

      if (storageHandler.get('productView') === null) {
        // default to list/gallery view depending on device width
        //commented as Game required to get the gallaryView back.
        /*$(gallery)
        .removeClass('galleryView')
        .addClass('listView'); 

        galleryView.checked = false; 
        listView.checked = true; */

        if (deviceWidth < 650) {
          $(gallery)
            .removeClass('galleryView')
            .addClass('listView');

          galleryView.checked = false;
          listView.checked = true;
        } else {
          $(gallery)
            .removeClass('listView')
            .addClass('galleryView');

          listView.checked = false;
          galleryView.checked = true;
        }
      }
    }
  }
};

App.ProductLister.NewPLPFunctions = function() {

  var $productContainer = $('#productContainer'),
    productWidth = $productContainer.find('article').eq(0).width();

  var adjustProducts = function() {
    var $products = $('#productContainer .product'),
      amountOfProducts = $products.length,
      containerWidth = $productContainer.width(),
      amountOfColumns = parseInt((containerWidth / productWidth), 10),
      amountOfShadowProducts = (Math.ceil(amountOfProducts / amountOfColumns) * amountOfColumns) - amountOfProducts,
      shadowHtml = '';

    $productContainer.find('.shadow').remove();
    for (var i = 0; i < amountOfShadowProducts; i++) {
      shadowHtml += '<div class="shadow"></div>';
    }
    $productContainer.append(shadowHtml);
  };

  adjustProducts();
  $(window).on('resize.productAdjust newProductsAdded', adjustProducts);

  $.fn.slideToggleSection = function(callback) {
    var $parent = this.parent();
    if (this.hasClass('trigger')) {
      var selector = this.siblings(".content").length > 1 ? this.next() : this.siblings(".content");
    } else {
      var selector = this.find(".content").length > 1 ? this.next() : this.find(".content");
    }


    selector.slideToggle(function() {
      if (callback) callback();
    });
    $parent.toggleClass('collapsed');
  };

  $(document).on('click', '.collapsible > .trigger', function() {
    $(this).slideToggleSection();
  });

  $(document).on('click', '.filterDisplayToggle', function() {
    $('#plp.content').toggleClass('hideFilters');
    $(this).html($(this).text() == 'Show refine options' ? 'Hide refine options' : 'Show refine options');
  });

  // var clicked = false;

  function clearAllFilters() {
    var attributeCount = 0,
      breakUrl = function() {
        var match,
          pl = /\+/g, // Regex for replacing addition symbol with a space
          search = /([^&=]+)=?([^&]*)/g,
          decode = function(s) {
            return decodeURIComponent(s.replace(pl, " "));
          },
          query = window.location.search.substring(1),
          urlObject = {};

        while (match == search.exec(query)) {
          if (decode(match[1]).indexOf('attributeName') != -1) attributeCount++;
          urlObject[decode(match[1])] = decode(match[2]);
        }

        return urlObject;
      },
      constructUrl = function(redirect, urlObject) {
        if (redirect)
          window.location.search = "?" + $.param(urlObject);
        else
          return window.location.origin + window.location.pathname + "?" + $.param(urlObject) + "&pageMode=true";
      },

      clearAllAttributes = function() {
        var urlObject = breakUrl();
        for (var key in urlObject) {
          if (key.indexOf('attributeName') != -1 || key.indexOf('attributeValue') != -1 || key.indexOf('provenance') != -1) delete urlObject[key];
        }
        /* jshint -W069 */
        urlObject['inStockOnly'] = "true";

        constructUrl(true, urlObject);


      };

    $('#sidebar .applied h2 a').on('click', function(e) {
      e.preventDefault();
      Salmon.Global.uiBlocker.insertLoader($('main'));
      clearAllAttributes();
    });
  }

  function outOfStockController() {
    var $form = $('#inStockFilters form'),
      $chekbox = $form.find('#showOutOfStockProducts'),
      $inStockOnlyField = $form.find('input[name="inStockOnly"]');

    $chekbox.on('change', function() {
      Salmon.Global.uiBlocker.insertLoader($('main'));
      if ($chekbox.is(':checked'))
        $inStockOnlyField.val('false');
      else
        $inStockOnlyField.val('true');

      $form.submit();
    });
  }

  // function fixingFlexBoxBrowser() {
  //   var d = document.documentElement.style
  //   if (!('flexWrap' in d) && !('WebkitFlexWrap' in d) && !('msFlexWrap' in d)) {}
  // }


  function categoriesEspotsSwap() {
    if ($('body').hasClass('category')) {
      var $sidebarLinks = $('.plpHeader .categoriesLinks');

      if ($sidebarLinks.length > 0) {
        $sidebarLinks.clone().prependTo('aside');
        $sidebarLinks.remove();
      }
    }
  }
  outOfStockController();
  clearAllFilters();
  categoriesEspotsSwap();
};



if (!Salmon.Global.FeatureToggles.getFeature('NewPLP'))
  App.ProductLister.List.productView();
else
  App.ProductLister.NewPLPFunctions();
