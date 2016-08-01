App.PDP.MarketplaceTableFilteringViewModel = function(master) {

  var PDPMarketplaceTableFilteringModel = function(master) {

    var Filtering = this;
    // $marketplaceItemsList = $('#marketplaceItemsList');

    Filtering.filters = [
      { title: 'All', count: master.marketplaceItemsTotalCount, filter: null }, {
        title: 'New',
        count: master.marketplaceMintItemsCount,
        filter: function(mpItem) {
          return mpItem.provenance == 'Mint';
        }
      }, {
        title: 'Preowned',
        count: master.marketplacePreOwnedItemsCount,
        filter: function(mpItem) {
          return mpItem.provenance == 'PreOwned';
        }
      }
    ];

    Filtering.activeFilter = ko.observable(Filtering.filters[0].filter);
    Filtering.paginationPointer = ko.observable(1);
    Filtering.totalFilteredAmount = ko.observable();
    Filtering.topAmountPaginated = ko.computed(function() {
      return (Filtering.paginationPointer() + 2 > Filtering.totalFilteredAmount()) ? Filtering.totalFilteredAmount() : Filtering.paginationPointer() + 2;
    });
    Filtering.selectedSortValue = ko.observable();
    Filtering.selectedSortValue.subscribe(function(newValue) {
      var sortByFunction;
      switch (newValue) {
        case 'price':
          sortByFunction = function(left, right) {
            return (parseFloat(left.unitPrice) > parseFloat(right.unitPrice)) ? 1 : -1;
          };
          break;
        case 'price_delivery':
          sortByFunction = function(left, right) {
            return (parseFloat(left.totalPrice) > parseFloat(right.totalPrice)) ? 1 : -1;
          };
          break;
        case 'reviews':
          sortByFunction = function(left, right) {
            return (parseFloat(left.vendorNumberOfRatings) > parseFloat(right.vendorNumberOfRatings)) ? 1 : -1;
          };
          break;

      }

      master.marketplaceItems.sort(sortByFunction);
    });

    Filtering.hideNavigation = ko.computed(function() {
      return !(master.marketplaceMintItemsCount() === 0 || master.marketplacePreOwnedItemsCount() === 0);
    });

    Filtering.setActiveFilter = function(model, event) {
      console.log("logging: mark55");
      $(event.currentTarget).siblings('.current').removeClass('current');
      $(event.currentTarget).addClass('current');
      event.preventDefault();
      Filtering.paginationPointer(1);
      Filtering.activeFilter(model.filter);

    };

    Filtering.filteredItems = ko.computed(function() {

      var result;    
      if (Filtering.activeFilter()) result = ko.utils.arrayFilter(master.marketplaceItems(), Filtering.activeFilter());
      else result = master.marketplaceItems();
      Filtering.totalFilteredAmount(result.length);
      return result.slice(Filtering.paginationPointer() - 1, Filtering.paginationPointer() + 2);

        
    });
  };
  return new PDPMarketplaceTableFilteringModel(master);
};



App.PDP.MarketplaceTableSellerDetailsViewModel = function(master) {

  var PDPMarketplaceTableSellersDetailsModel = function(master) {
    var $sellerDetails = $('.sellerDetailsContainer');
    var sellerDetails = this,
      requestUrl = '/webapp/wcs/stores/servlet/m/AJAXMarketplaceSellerDeliveryDetails?msg=&vendorShopId=',

      $selectedSeller;


    sellerDetails.detailsActive = ko.observable(false);
    sellerDetails.details = ko.observable({

      sellerName: "",
      sellerInfo: "",
      sellerShippingDetails: []

    });

    sellerDetails.getSellerDetails = function(model, event) {
      event.preventDefault();

      var sellerId = model.vendorShopId;
      // $currentButton = $(event.currentTarget);
      sellerDetails.sendRequest(sellerId);
    };

    sellerDetails.sendRequest = function(sellerId) {
      // console.log("logging: mark113");
      $.get(requestUrl + sellerId, function(res) {
        // console.log("logging: mark115");
        var details = JSON.parse(res),
          shipping = JSON.parse(details.shipping),
          html;

        html = '<div class="sellerDetails">';
        html += '<h2>' + details.supplier.name + '</h2>';
        html += '<div class="info">' + details.supplier.sellerInfo + '</div>';
        html += '<div class="shipping">';
        for (var i in shipping) {
          html += '<div><div class="label">' + shipping[i].label + '</div><div class="region">' + shipping[i].region + '</div></div>';
        }
        html += '</div>';
        html += '</div>';

        Salmon.Global.Modal.openModal(html, 'sellerDetails');

      });
    };


    sellerDetails.afterSellerDetailsUpdated = function() {
      if (typeof $selectedSeller != 'undefined') {
        $('#marketplaceItemsList .sellerDetailsContainer').remove();
        $selectedSeller.after($sellerDetails.clone());
      }
    };
  };

  return new PDPMarketplaceTableSellersDetailsModel(master);
};




App.PDP.BuyTabsViewModel = function(master, vendorShopId) {

  var PDPMarketplaceBuyTabs = function(master, vendorShopId) {

    var buyTabs = this,
      $pdpPriceTabs = $('aside .section.buyingOptions .tabLinks'),
      $mintTabButton = $pdpPriceTabs.find('.newLink'),
      $mintPriceContainer = $pdpPriceTabs.find('.newTab'),
      $pdpPriceContainers = $('aside .section.buyingOptions .tabs'),
      $outOfStock = $('aside .section.buyingOptions .outOfStock'),
      generateMint = (typeof Game.CurrentPage.MarketplaceInfo != 'undefined' && !Game.CurrentPage.MarketplaceInfo.mintGameAvailable),
      generatePreowned = (typeof Game.CurrentPage.MarketplaceInfo != 'undefined' && !Game.CurrentPage.MarketplaceInfo.preownedGameAvailable),
      tabButtonTemplateName = 'tabButtonTemplate',
      containerTemplateName = 'buyButtonsContainerTemplate',
      addedTab = false,
      generateTemplateHtml = function(data) {
        console.log("logging: mark168");
        var $buttonTemp = $('<div />'),
          $containerTemp = $('<div />');
        ko.applyBindingsToNode($buttonTemp[0], { template: { name: tabButtonTemplateName, data: data } });
        ko.applyBindingsToNode($containerTemp[0], { template: { name: containerTemplateName, data: data } });
        var $buttonHtml = $($buttonTemp.html().replace(/data-bind=".*"/g, "")),
          $containerHtml = $($containerTemp.html().replace(/data-bind=".*"/g, ""));

        $buttonHtml.addClass(data.condition.toLowerCase().replace('-', '') + 'Link');
        $containerHtml.addClass(data.condition.toLowerCase().replace('-', '') + 'Tab');
        if (data.condition == 'Pre-owned' && $mintTabButton.length > 0) {
          $mintTabButton.after($buttonHtml);
          $mintPriceContainer.after($containerHtml);
        } else {
          if (data.condition == 'Pre-owned') {
            $pdpPriceTabs.append($buttonHtml);
            $pdpPriceContainers.append($containerHtml);
          } else {
            $pdpPriceTabs.prepend($buttonHtml);
            $pdpPriceContainers.prepend($containerHtml);
          }

        }
        $buttonTemp.remove();
        $containerTemp.remove();
      },
      sortByPrice = function(left, right) {
        console.log("logging: mark195");
        return (parseFloat(left.totalPrice) > parseFloat(right.totalPrice)) ? 1 : -1;
      };

    buyTabs.mintItems = ko.observableArray((typeof vendorShopId !== 'undefined' && vendorShopId !== '') ? master.marketplaceData.mintItems.filter(function(item) {
      return item.vendorShopId == vendorShopId;
    }) : master.marketplaceData.mintItems);
    buyTabs.preOwnedItems = ko.observableArray((typeof vendorShopId !== 'undefined' && vendorShopId !== '') ? master.marketplaceData.preOwnedItems.filter(function(item) {
      return item.vendorShopId == vendorShopId;
    }) : master.marketplaceData.preOwnedItems);
    buyTabs.mintItems.sort(sortByPrice);
    buyTabs.preOwnedItems.sort(sortByPrice);

    buyTabs.promotedItems = ko.observableArray();

    if (generateMint && buyTabs.mintItems().length > 0) {
      var firstMintItem = buyTabs.mintItems()[0],
        templateData = {
          condition: 'New',
          price: '&pound;' + master.processPrice(firstMintItem.unitPrice),
          vendorShopName: firstMintItem.vendorShopName,
          addToBasketUrl: master.generateAddToBasketUrl(firstMintItem),
          addToWishlistUrl: master.generateAddToWishlistUrl(firstMintItem)
        };
      addedTab = true;
      generateTemplateHtml(templateData);
      $outOfStock.hide();
      buyTabs.mintItems.shift();
    }

    if (generatePreowned && buyTabs.preOwnedItems().length > 0) {
      console.log("logging: mark225");
      var firstPreownedItem = buyTabs.preOwnedItems()[0],
        templateData = {
          condition: 'Pre-owned',
          price: '&pound;' + master.processPrice(firstPreownedItem.unitPrice),
          vendorShopName: firstPreownedItem.vendorShopName,
          addToBasketUrl: master.generateAddToBasketUrl(firstPreownedItem),
          addToWishlistUrl: master.generateAddToWishlistUrl(firstPreownedItem)
        };
      addedTab = true;
      generateTemplateHtml(templateData);
      $outOfStock.hide();
      buyTabs.preOwnedItems.shift();
    }

    if (addedTab) {
      $pdpPriceTabs.find('.current').removeClass('current');
      $pdpPriceTabs.find('li').eq(0).addClass('current');
      $pdpPriceContainers.find('.current').removeClass('current');
      $pdpPriceContainers.find('> div').eq(0).addClass('current');
    }
    buyTabs.promotedItems(buyTabs.mintItems().concat(buyTabs.preOwnedItems()));
    if (buyTabs.promotedItems().length > 0) {
      ko.applyBindings({
        promotedItems: buyTabs.promotedItems().slice(0, 3),
        master: master
      }, $('aside .section.moreBuyingOptions')[0]);
      $('aside .section.moreBuyingOptions').show();
    } else {
      $('aside .section.moreBuyingOptions').hide();
    }


  };

  return new PDPMarketplaceBuyTabs(master, vendorShopId);
};

App.PDP.MarketplaceViewModel = function(config) {

  var PDPMarketplaceTableViewModel = function(config) {

    var self = this,
      handleMoreOffersCTA = function() {
        console.log("logging: mark269");
        if (self.marketplaceItems().length > 0)
          $(config.elementsSelectors.otherOffersPriceFrom).html("&pound;" + self.processPrice(self.marketplaceLowestPrice()));
        else
          $(config.elementsSelectors.otherOffersSection).hide();
      };

    self.marketplaceData = ko.observableArray();
    self.marketplaceItems = ko.observableArray();

    self.marketplaceMintItemsCount = ko.observable();
    self.marketplacePreOwnedItemsCount = ko.observable();
    self.marketplaceLowestPrice = ko.observable();
    self.marketplaceItemsTotalCount = ko.computed(function() {

      return self.marketplaceMintItemsCount() + self.marketplacePreOwnedItemsCount();
    });

    self.promotedItems = ko.observableArray();

    // ************************************** \\
    // *             Seller details         * \\
    // ************************************** \\
    self.sellerDetails = new App.PDP.MarketplaceTableSellerDetailsViewModel(self);

    // ************************************** \\
    // *    Filtering of the items table    * \\
    // ************************************** \\
    self.Filtering = new App.PDP.MarketplaceTableFilteringViewModel(self);

    // ************************************** \\
    // *           Buy Tabs logic           * \\
    // ************************************** \\
    /* self.BuyTabs = new buyTabs(self); */




    // ************************************** \\
    // *          Helpers function          * \\
    // ************************************** \\

    self.processDeliveryPrice = function(price) {
      return (parseFloat(price) !== 0) ? 'Delivery from £' + parseFloat(price).toFixed(2) : "Free delivery";
    };

    self.processPrice = function(price) {
      return parseFloat(price).toFixed(2);
    };

    self.processRatingClass = function(rating) {
      return "rating" + rating;
    };

    self.processCondition = function(condition) {
      console.log("logging: mark327");
      return (condition == 'PreOwned') ? 'Pre-owned' : condition;
    };

    self.generateAddToBasketUrl = function(itemData) {
      console.log("logging: mark332");
      var itemSpecificParams = ['vendorOfferId', 'catEntryId_1', 'productId_1', 'unitPrice', 'partNumber'],
        queryString = '';
      if (itemData.catEntryId) {
        itemData.catEntryId_1 = itemData.catEntryId;
        itemData.productId_1 = itemData.catEntryId_1;
      }

      for (var i in itemSpecificParams) {
        var param = itemSpecificParams[i];
        queryString += '&' + param + '=' + itemData[param];
      }
      return config.addToBasketUrl + config.addToBasketUrlParams + queryString;
    };

    self.generateVendorUrl = function(vendorId) {
      return config.vendorUrl + vendorId;
    };

    self.generateThumbnailSrc = function(vendorId) {
      return Salmon.Global.PageContext.MARKETPLACE_SELLER_LOGO_URL_SMALL + '/' + vendorId + '.png';
      //return '//img.game.co.uk/images/mkt/sellers/53x53/2076.png';
    };

    self.generateAddToWishlistUrl = function(itemData) {
      console.log("logging: mark360");
      return config.addToWishlistUrl + config.addToWishlistUrlParams + '&catEntryId=' + itemData.catEntryId;
    };

    self.getLowestPrice = function() {

      var lowestPrice = 9999,
        mpItems = self.marketplaceItems();

      for (var i in mpItems) {
        if (mpItems[i].unitPrice < lowestPrice) lowestPrice = mpItems[i].unitPrice;
      }

      return lowestPrice;

    };

    self.getMarketplaceData = function() {

      if (typeof Game.CurrentPage.PageInfo.ProductID != "undefined") {
        var options = Game.CurrentPage.MarketplaceInfo,
          vendorShopId = (typeof $('body').data('vendorid') != 'undefined') ? $('body').data('vendorid') : '';
        options.productId = Game.CurrentPage.PageInfo.ProductID;

        $.get(config.marketplaceRequestUrl, options, function(res) {
          self.marketplaceData = JSON.parse(res);
          if (typeof self.marketplaceData.errorCode != 'undefined') {
            console.log('Marketplace is not available');
            return;
          } else {
            self.marketplaceMintItemsCount(self.marketplaceData.mintItems.length);
            self.marketplacePreOwnedItemsCount(self.marketplaceData.preOwnedItems.length);
            self.marketplaceItems(self.marketplaceData.mintItems.concat(self.marketplaceData.preOwnedItems));
            self.marketplaceItems.sort(function(left, right) {
              return (parseFloat(left.unitPrice) > parseFloat(right.unitPrice)) ? 1 : -1;
            });

            if (vendorShopId !== '') {
              self.marketplaceItems(self.marketplaceItems().filter(function(item) {
                return item.vendorShopId == vendorShopId;
              }));
              if (self.marketplaceItems().length == 1 || (self.marketplaceMintItemsCount() == 1 && self.marketplacePreOwnedItemsCount() == 1)) self.marketplaceItems([]);
            }
            // self.marketplaceItems
            ko.applyBindings(new App.PDP.BuyTabsViewModel(self, vendorShopId), $('aside .section.buyingOptions')[0]);
            self.marketplaceLowestPrice(self.getLowestPrice());
          }
          
        });
      }

    };

    self.getMarketplaceData();
  };
  return new PDPMarketplaceTableViewModel(config);
};



App.PDP.Marketplace = (function() {
  "use strict";

  var config = {
    marketplaceRequestUrl: '/webapp/wcs/stores/servlet/MarketplaceSupplierItemsInterface',
    addToBasketUrl: '/webapp/wcs/stores/servlet/OrderChangeServiceItemAdd',
    addToBasketUrlParams: '?errorViewName=AjaxActionErrorResponse&quantity=1&page=pdpPage&updateable=0&URL=AjaxMiniShoppingBagView&storeId=' + Game.Global.Vars.storeId + '&langId=' + Game.Global.Vars.langId + '&catalogId=' + Game.Global.Vars.catalogId,
    addToWishlistUrl: '/webapp/wcs/stores/servlet/InterestItemAddMobile',
    addToWishlistUrlParams: '?catalogId=10201&categoryId=&langId=44&storeId=10151&mobileFlag=true&URL=',
    vendorUrl: '/webapp/wcs/stores/servlet/MarketplaceSellerDetailsView?catalogId=' + Game.Global.Vars.catalogId + '&langId=' + Game.Global.Vars.langId + '&storeId=' + Game.Global.Vars.storeId + '&URL=mMarketplaceSellerDetailsView&vendorShopId=',

    //We need to pass it to marketplace viewmodel to trigger after ajax comes back

    isSafari: /^((?!chrome).)*safari/i.test(navigator.userAgent)
  };

  var $elements = new function() {

    this.buyOptionsSection = $('aside .section.buyingOptions');
    this.marketplaceTable = $('#marketplaceTable');
  };

  var scrollToMoreOffersHandler = function() {
    console.log("logging: mark436");
    $elements.otherOffersButton.on('click', function(e) {
      console.log("logging: mark438");
      e.preventDefault();
      $elements.sections.marketplaceTable.slideToggleSection();
      $("html, body").animate({ scrollTop: $elements.sections.marketplaceTable.offset().top - 45 });
    });
  };

  var buyButtonsHandler = function() {

    var $sectionLinks = $elements.buyOptionsSection.find('.tabLinks li'),
      $sections = $elements.buyOptionsSection.find('.tabs > div'),
      selectSection = function(section) {

        $elements.buyOptionsSection.find('.tabLinks li.current').removeClass('current');
        $elements.buyOptionsSection.find('.tabs > .current').removeClass('current');

        if (isNaN(section)) {
          $sections.filter('.' + section + 'Tab').addClass('current');
          $sectionLinks.filter('.' + section + 'Link').addClass('current');
        } else {
          $sections.eq(section).addClass('current');
          $sectionLinks.eq(section).addClass('current');
        }

      },
      hash = document.location.hash;

    $(document).on('click', '.buyingOptions .tabLinks li', function() {

      $sectionLinks = $elements.buyOptionsSection.find('.tabLinks li');
      $sections = $elements.buyOptionsSection.find('.tabs > div');

      var index = $.inArray(this, $elements.buyOptionsSection.find('.tabLinks li'));
      selectSection(index);
    });

    if (hash) {
      switch (hash) {
        case '#preowned':
          selectSection('preowned');
          break;

        case '#new':
          selectSection('new');
          break;

        case '#download':
          selectSection('download');
          break;
      }
    } else {
      if ($('.buyingOptions .tabLinks li.current').length === 0) {
        $sectionLinks.eq(0).addClass('current');
        $sections.eq(0).addClass('current');
      }
    }

  };


  var init = function(pageOptions) {

    config = $.extend({}, config, pageOptions);
    config.$elements = $elements;
    ko.applyBindings(App.PDP.MarketplaceViewModel(config), $elements.marketplaceTable[0]);

    //scrollToMoreOffersHandler();
    buyButtonsHandler();


  };

  if (Game && Game.CurrentPage.PageName === 'pdp') init();

})();
