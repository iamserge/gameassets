$(document).ready(function() {

  if (Game.featureToggles.NewHeaderAndFooter) {
    // thumbslider used to have no var included, changed during linting, if problems arise this could be the cause
    var thumbSlider = new Salmon.Global.SimpleSlider.newSlider({
      autoScroll: false,
      resizeSlides: false,
      slidesToFit: 2,
      elements: {
        sliderContainer: '.thumbSliderContainer'
      }
    });
  }




  if (Game.featureToggles.NewHeaderAndFooter) {
    var pointer;
    var $slides = $('.thumbSlider ul li');
    var $slideImages = $slides.find('img');
    var $slideLinks = $slides.find('a');
    var arrows = '<span class="arrow prev">&nbsp;</span><span class="arrow next">&nbsp;</span>';
    var arrowClass;
    var limeLightIframe = '<iframe width="640" height="320" type="text/html" src="//link.videoplatform.limelight.com/media/?mediaId=%mediaId%&showInlinePlaylistOnLoad=false&width=620&height=300" frameborder="0" allowfullscreen="true" ></iframe>';


    var embedImage = function(index) {
      var $modal = $('.modal.opened');
      var target = $slides.eq(index).find('a').attr('href');
      var $nextImg = '<img src="' + target + '"/>';
      $modal.find('img').remove();
      $modal.find('iframe').remove();
      $modal.find('.modalContent').append($nextImg);
    };

    var embedYoutube = function(index) {
      var $modal = $('.modal.opened');
      var target = $slides.eq(index).attr('data-youtubeid');
      var isList = $slides.eq(index).hasClass('list');
      if (!isList) {
        var $nextVid = '<iframe width="420" height="315" src="//www.youtube.com/embed/' + target + '"></iframe>';
      } else {
        var $nextVid = '<iframe width="420" height="315" src="//www.youtube.com/embed/videoseries?list=' + target + '"  frameborder="0" allowfullscreen></iframe>';
      }
      $modal.find('img').remove();
      $modal.find('iframe').remove();
      $modal.find('.modalContent').append($nextVid);
    };
    var embedLimelight = function(index) {
      var $modal = $('.modal.opened');
      var target = $slides.eq(index).attr('limelightid');
      var $nextVid = limeLightIframe.replace('%mediaId%', target);
      $modal.find('img').remove();
      $modal.find('iframe').remove();
      $modal.find('.modalContent').append($nextVid);
    };
    var loadImage = function(index) {
      var nextSlideIndex = index;
      if (index == '-1') {
        nextSlideIndex = $slides.length - 1;
        pointer = $slides.length;
      }
      if (index >= $slides.length) {
        nextSlideIndex = 0;
        pointer = 0;
      }
      if ($slides.eq(index).hasClass('youtube')) {
        embedYoutube(nextSlideIndex);
      } else if ($slides.eq(index).hasClass('limelight')) {
        embedLimelight(nextSlideIndex);
      } else {
        embedImage(nextSlideIndex);
      }

    };
    $(document).on('click', '.modal.opened .arrow', function() {
      if ($(this).hasClass('next')) {
        pointer += 1;
      } else {
        pointer -= 1;
      }
      if ($slides.length > 1) {
        loadImage(pointer);
      }
    });
    $slides.bind('click', function(e) {
      e.preventDefault();
      var $this = $(this);
      var target;
      var html;
      var arrowClass = '';
      var arrows = '<span class="arrow prev ' + arrowClass + '">&nbsp;</span><span class="arrow next">&nbsp;</span>';

      var openModal = function() {
        Salmon.Global.Modal.openModal(html, 'screenshotsModal', true);

      };
      if ($slides.length == 1) {
        arrowClass = 'inactive';
      }
      if ($this.hasClass('youtube') || $this.hasClass('youtubelist')) {
        target = $this.attr('data-youtubeid');
        var isList = $this.hasClass('list');
        if (!isList) {
          html = arrows + '<iframe width="420" height="315" src="//www.youtube.com/embed/' + target + '"></iframe>';
        } else {
          html = arrows + '<iframe width="420" height="315" src="//www.youtube.com/embed/videoseries?list=' + target + '"  frameborder="0" allowfullscreen></iframe>';
        }
        openModal();
      } else if ($this.hasClass('limelight')) {
        target = $this.attr('limelightid');

        html = arrows + limeLightIframe.replace('%mediaId%', target);
        openModal();

      } else {
        target = $this.find('a').attr('href');
        html = arrows + '<img src="' + target + '"/>';
        $(html).load(function() {
          openModal();
        });
      }
      pointer = $.inArray($this[0], $slides);
    });
    // $arrows = $('.modal.opened .arrow');

    $('body').find('.scrollContent').each(function() {
      var $scrollContent = $(this);
      var containerWidth = $scrollContent.width();
      if ($scrollContent.find('img')) {
        // $img used to have no var included, changed during linting, if problems arise this could be the cause
        var $img = $scrollContent.find('img').first();


        $img.on('load', function() {
          var imgHeight = $img.height();
          var imgWidth = $img.width();
          $scrollContent.css('height', imgHeight + 40);
          if (imgWidth > containerWidth) {
            $img.width = '100%';
          }
        });



      } else {
        $scrollContent.css('height', '160px');
      }
    });
  }


});
