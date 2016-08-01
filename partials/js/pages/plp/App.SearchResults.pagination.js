App = App || {};
App.SearchResults = App.SearchResults || {};

App.SearchResults.pagination = new(function() {
  var isArticlesList = ($('ul.products').length === 0 && $('ul.articles').length === 1);
  var adjustScrollTop = function() {
      if (typeof window.history != 'undefined' &&
        typeof window.history.state != 'undefined' &&
        window.history.state !== null) $(window).scrollTop(window.history.state.scrollTop);
    },
    convertUrl = function(url) {
      var pairs = url.split('?')[1].split('&');

      var dataObj = {};
      pairs.forEach(function(pair) {
        pair = pair.split('=');
        dataObj[pair[0]] = decodeURIComponent(pair[1] || '');
      });
      return dataObj;
    },
    historyStateAvailable = (typeof window.history != 'undefined' &&
      typeof window.history.state != 'undefined' &&
      window.history.state !== null &&
      typeof window.history.state.newProducts != 'undefined' &&
      window.history.state.newProducts.length !== 0),
    pageNumber = (historyStateAvailable && typeof window.history.state.pageNumber != 'undefined') ? window.history.state.pageNumber : 2,
    newProducts = (historyStateAvailable) ? window.history.state.newProducts : '',
    requestCount = 0,
    requestMade = false,
    // productsSelector,
    newStyles = Salmon.Global.FeatureToggles.getFeature('NewPLP'),
    lastProductOffset,
    makeRequest = function(loadMoreUrl, categoryName, categoryId, searchTerm, totalCount, extAttrs) {

      console.log("logging: pg37");
      var requestUrl = loadMoreUrl.split('?')[0],

        dataObj = convertUrl(loadMoreUrl);

      $(".loaderLeft").addClass("loading");
      $(".loaderRight").addClass("loading");
      dataObj.pageMode = true;
      dataObj.pageNumber = pageNumber;

      var newsearchTerm = dataObj.searchTerm;
      requestUrl = requestUrl + "?searchTerm=" + newsearchTerm;
      requestUrl = requestUrl.replace('http://', '//');
      delete dataObj.searchTerm;

      requestMade = true;
      $.ajax({
        type: "GET",
        data: dataObj,
        url: requestUrl,
        success: function(data, status, xhrdata) {
          var container = document.createElement('div'),
            $container = $(container);

          container.innerHTML = data;

          //Extracts the products from the returned data
          if (!isArticlesList)
            var products = ($container.find('#productLister > ul.products > .productItem').length > 0) ? $container.find('#productLister > ul.products > .productItem') : $(container).find('.productItem');
          else
            var products = ($container.find('#productLister > ul.articles > .articleItem').length > 0) ? $container.find('#productLister > ul.articles > .articleItem') : $(container).find('.articleItem');
          if (newStyles) {
            products = $container.find('article.product');
            $('#productContainer').find('.shadow').remove();
          }
          for (var i = 0; i < products.length; i++) {
            //Adds each new product to the page
            if (!isArticlesList) {

              if (newStyles)
                $('#productContainer')[0].appendChild(products[i]);
              else
                $('#productLister > .products')[0].appendChild(products[i]);
            } else {
              $('#productLister > .articles')[0].appendChild(products[i]);
            }

            newProducts += products[i].outerHTML;
          }

          //Changes the load more button to display the new URL
          $('div.next').replaceWith($container.find('.next'));

          // truncate titles
          new Salmon.Global.Truncator($('#productLister').find('div.fn'), null);

          // check for platform logos
          var platformImages = new App.Global.PlatformImages();
          platformImages.setUpImages(document.getElementById('productLister'));

          $(".loaderLeft").removeClass("loading");
          $(".loaderRight").removeClass("loading");
          App.ProductLister.LazyLoadImages.loadNewImages();
          //cmCreatePageviewTag("Cat: Xbox 360 (10223)", "10223", null, null, "10151", "Desktop-_-......");
          if (searchTerm === '') { searchTerm = null; }

          if (totalCount === '') { totalCount = null; }
          //send page view tag after refreshing the result successful
          cmCreatePageviewTag(categoryName, categoryId, searchTerm, totalCount, "10151", extAttrs);

          requestCount++;
          pageNumber++;
          requestMade = false;
          if (newStyles) {
            $(window).trigger('newProductsAdded');
            Salmon.Global.uiBlocker.removeLoader($('#productContainer'));
            lastProductOffset = $('#productContainer').offset().top + $('#productContainer').height();
            if (products.length === 0) $(window).off('scroll.preloadProducts');

          }
        },
        error: function(err) {
          console.log(err);
        }
      });
    };

  window.onbeforeunload = function() {
    history.pushState({
      scrollTop: $(window).scrollTop(),
      pageNumber: pageNumber,
      newProducts: newProducts
    }, "Page " + requestCount, "#Page" + pageNumber);


  };

  if (newProducts.length > 0) {
    $(document).ready(function() {
      if (!isArticlesList)
        $('#productContainer').append(newProducts);
      else
        $('#productLister >.articles').append(newProducts);

      App.ProductLister.LazyLoadImages.loadNewImages();
      adjustScrollTop();
    });

  }

  if (newStyles && $('.pageControls a').length > 0) {
    var lastProductOffset = $('#productContainer').offset().top + $('#productContainer').height(),
      $window = $(window),
      windowHeight = $window.height(),
      $showMoreButton = $('.pageControls a');


    $(window).on('scroll.preloadProducts', function() {
      if ($(window).scrollTop() + windowHeight > lastProductOffset - 200 && !requestMade) {
        $showMoreButton.trigger('click');
        Salmon.Global.uiBlocker.insertLoader($('#productContainer'), 'LOADING MORE PRODUCTS');

      }
    });
  }
  // Makes the ajax call to get the next page
  return {
    makeRequest: makeRequest
  };
});
