var App = App || {};
App.ProductLister = App.ProductLister || {};

/**
 * The control to handle toggling the results to show or hide out of stock products
 * @class Singleton
 * @static
 * @author Adam Silver
 */


App.ProductLister.LazyLoadImages = new(function() {
  var newStyles = Salmon.Global.FeatureToggles.getFeature('NewPLP'),
    $images = (newStyles) ? $('#productContainer .product .productHeader img') : $('.productItem .imageHolder .photo img'),
    $window = $(window),
    // genericImageLink = 'http://img.game.co.uk/ml2/0/0/0/0/000000_gen_b.png',
    windowHeight = $window.height(),
    containerHeight = $('.productHeader a').height(),
    containerWidth = $('.productHeader a').width(),
    visibleFold,
    isInViewPort = function($el) {
      return ($el.offset().top < visibleFold + 200);
    },
    loadImage = function($img) {
      $img.attr('src', $img.data('src'));
      $img.on('load', function() {
        if (this.naturalWidth > this.naturalHeight) {
          var ratio = this.naturalHeight / this.naturalWidth;

          if (containerWidth * ratio >= containerHeight || this.width < containerWidth) {
            $(this).css('width', '70%').css('height', 'auto');
          } else {
            $(this).addClass('horizontal');
          }

        } else {
          if (this.naturalHeight < containerHeight) $(this).css('height', '90%');
        }
      });
      // $img.on('error', function(e) {});
      $img.css('visibility', 'visible');
    },
    loadVisibleImages = function() {
      visibleFold = windowHeight + $window.scrollTop();
      $images.each(function() {
        var $img = $(this);
        if (isInViewPort($img) && $img.attr('src') === '') loadImage($img);
      });
    },
    loadNewImages = function() {
      $images = (newStyles) ? $('#productContainer .product .productHeader img') : $('.productItem .imageHolder .photo img');
      loadVisibleImages();
    };
  if ($images.length > 0) {
    loadVisibleImages();
    $(window).scroll(loadVisibleImages);
  }



  return {
    loadNewImages: loadNewImages
  };
})();
