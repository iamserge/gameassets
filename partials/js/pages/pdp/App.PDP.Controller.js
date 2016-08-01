var App = App || {};
App.PDP = App.PDP || {};


App.PDP.FormatSelect = new(function() {

  $(document).ready(function() {
    var $format = $('.panelContainer .format ');

    if ($format.length > 0) {
      $format.find('.selected').on('click', function() {
        $format.parent().find('.dropdown').slideToggle();
      });

      $format.find('.dropdown li').on('click', function() {
        var url = $(this).data('url');

        if (typeof url != 'undefined') {
          Salmon.Global.uiBlocker.blockUI();
          window.location.href = url;
        }
      });
    }
  });
});




App.PDP.Ratings = new(function() {

  new App.Global.Ratings($("#rating, #detailsRating, #secondary div.productCrossSells li.review"));
});

App.PDP.ReviewRatings = new(function() {

  $(document).ready(function() {
    var ratingsLabel = $('<p>').addClass('label');
    var ratingsStars = $('#ratingsContainer .rating').clone();
    var ratingsCount = $('#ratingsContainer .ratingCount').text().slice(1, -1);

    $(ratingsLabel).text('Average based on ' + ratingsCount + ' customers ');
    $(ratingsLabel).appendTo('#userRating');
    $(ratingsStars).appendTo('#userRating');
  });
});

App.PDP.ReviewsController = new(function() {

  $(document).ready(function() {

    var reviews = $('ul.reviewsList').find('li.review div.reviewBody');
    var options = {
      'extraChars': ['&#8221;'] // array of characters to be added to the end (after ellipsis)
    };

    Salmon.Global.TextTruncator(reviews, options);
  });
});


/*
$(document).ready(function() {

  var platformImages = new App.Global.PlatformImages();

  platformImages.setUpImages($('li#platforms'));

  Salmon.Global.Warranties.WarrantiesTermsOverlay();
});

*/
App.PDP.AddToBasketNew = new(function() {

  var addToBasketRequest = function(urlData) {

      $.ajax({
        url: urlData,
        dataType: "json",
        success: productAdded
      });
    },
    productAdded = function(res) {

      Salmon.Global.uiBlocker.unblockUI();

      if (res) {
        $(document).trigger(Salmon.Global.CustomEvents.productAddedToBasket, res);
        if (typeof res.errorMessage != 'undefined') {
          Salmon.Global.Modal.openModal('<div class="error">' + res.errorMessage + '</div>', 'basketOverlay');
        } else {
          Salmon.Global.Modal.openModal(res.recentlyAddedHtml, 'basketOverlay');

          $('#basketOverlay').find('.IORecsSlider').each(function() {
            new Salmon.Global.IORecSliders.IOSlider($(this), false, {
              ZoneID: 'MBask_1',
              ProductID: Game.CurrentPage.PageInfo.ProductMediaID
            }, function() {

              var modalContent = $('#basketOverlay').find('.modalContent');
              modalContent.css('top', ($(window).height() - modalContent.height()) / 2);

            });
            cmDisplayRecs();
            console.log(cmDisplayRecs());
          });
        }

      }

    };

  $(document).on('click', '.modalContent .CTAs a.btn.secondary', function(e) {
    console.log("logging: con114");
    e.preventDefault();
    Salmon.Global.Modal.closeModal();
  });

  $(document).on('click', 'a.addToBasket, button.addToBasket', function(e) {
    e.preventDefault();
    Salmon.Global.uiBlocker.blockUI();
    var $button = $(this),
      $form = $button.parent(),
      urlData;

    if ($form.length > 0 && $form.hasClass('addToBasketForm'))
      urlData = $form.find('input[name="addToShoppingCartAJAXURL"]').val() + '&' + $form.serialize();
    else
      urlData = $button.attr('href');
    addToBasketRequest(urlData);
  });


  $(document).on('click', '.moreBuyingOptions .seeAll, .moreBuyingOptions .image a', function(e) {
    console.log("logging: con137");
    e.preventDefault();
    $("html, body").animate({ scrollTop: $('.section.buyingChoices').offset().top - 45 });
  });
});


App.PDP.MPItemPriceChange = new(function() {
  $(document).ready(function() {

    $(document).on('click', '#basketOverlay .CTAs.marketplace .keep a', function(e) {
      console.log("logging: con149");
      e.preventDefault();
      $('#basketOverlay .mpStatus').slideToggle();
    });
  });
});


App.PDP.RewardPointsSidebar = new(function() {

  $(document).ready(function() {
    if ($('.section.rewardPoints').length === 0) $('aside').addClass('noReward');
  });
});
