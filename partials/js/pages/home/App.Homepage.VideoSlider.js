App.Homepage.VideoSlider = (function() {

  var config = {
    transitionDuration: 300,
    pager: false,
    playVideoButtonClass: 'playVideoButton',
    closeVideoButtonClass: 'closeVideo',
    defaultSwipeParams: {
      triggerOnTouchEnd: true,
      allowPageScroll: "horizontal",
      threshold: 175,
      excludedElements: []
    }
  };

  var _private = {
    windowWidth: $(window).width(),
    speed: 5000,
    isAnimating: 1
  };
  var newSlider = function(options) {
    this.options = $.extend({}, config, options);
    this.sliderCurrentPosition = 0;
    this.currentSlide = 0;
    this.isAnimating = false;
    this.init();
    this.interacted = false;
  };
  var proto = newSlider.prototype;

  proto.init = function() {
    this.setupElements();
    this.setupWidths();
    this.setupPager();
    this.initiateVideo();
    this.setupAutoScroll();
    this.setupClone();
    this.setupEvents();

  };
  proto.setupClone = function() {
    this.$elements.firstClone = this.$elements.slides.eq(0).clone();
    this.$elements.firstClone.addClass('clone').appendTo(this.$elements.slidesContainer);
    this.$elements.lastClone = this.$elements.slides.eq(this.maxSlides - 1).clone();
    this.$elements.lastClone.addClass('clone').prependTo(this.$elements.slidesContainer);
    this.$elements.slidesContainer.width(this.wWidth * (this.maxSlides + 2));
    this.$elements.slidesContainer.css('left', this.wWidth * -1);
  };

  proto.setupElements = function() {
    this.$elements = {};
    this.$elements.window = $(window);
    this.$elements.mainContainer = $(this.options.elements.sliderContainer);
    this.$elements.slidesContainer = this.$elements.mainContainer.find('.slides');
    this.$elements.slides = this.$elements.slidesContainer.find('.slide');
    this.$elements.sliderControlPrev = this.$elements.mainContainer.find('.carouselPrev');
    this.$elements.sliderControlNext = this.$elements.mainContainer.find('.carouselNext');
    this.maxSlides = this.$elements.slides.length;
  };

  proto.setupWidths = function() {
    this.wWidth = this.$elements.window.width();
    this.$elements.slides.width(this.wWidth);
    this.scrollStep = this.wWidth;
  };
  proto.setupEvents = function() {
    var self = this;
    this.$elements.sliderControlNext.bind('click', function() {
      if (!self.isAnimating) {
        self.currentSlide++;
        self.moveSlider();
        self.stopAutoScroll();
        self.setInteracted();
      }
    });
    this.$elements.sliderControlPrev.bind('click', function() {
      if (!self.isAnimating) {
        self.currentSlide--;
        self.moveSlider();
        self.stopAutoScroll();
        self.setInteracted();
      }
    });
    this.$elements.window.on('resize', function() {
      self.setupWidths();
      self.$elements.firstClone.width(this.wWidth);
    });
    this.$elements.slidesContainer.find('.slide').on('click', function(e) {
      var $slide = $(this),
        url = $slide.data('href');

      if (typeof url != 'undefined' && url.length > 0 && e.target == this) window.location.href = url;
    });
    this.$elements.mainContainer.on('mouseenter', function() {
      self.stopAutoScroll();
    });
    this.$elements.mainContainer.on('mouseleave', function() {
      if (!self.interacted && self.autoScrollInterval === 0) self.setupAutoScroll();
    });
    $(document).on('click', '.' + self.options.playVideoButtonClass, function(e) {
      e.preventDefault();
      e.stopPropagation();
      var $slide = $(this).parent();
      self.setInteracted();
      self.startVideo($slide.data('limelightvideo'));
    });

    $(document).on('click', '.' + self.options.closeVideoButtonClass, function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.closeVideo();
    });

    $(document).on('click', '.sliderContainer .pager li', function() {
      if (!self.isAnimating) {
        var index = $.inArray(this, $('.sliderContainer .pager li'));

        self.currentSlide = index;
        self.moveSlider();
        self.stopAutoScroll();
        self.setInteracted();
      }
    });


    self.options.defaultSwipeParams.swipe = function(event, direction, distance, duration, fingerCount, fingerData) {
      self.swiped(direction, distance, duration, fingerCount, fingerData);
    };
    self.$elements.slidesContainer.swipe(self.options.defaultSwipeParams);
  };

  proto.swiped = function(direction) {
    var self = this;
    if (!self.isAnimating) {
      switch (direction) {
        case 'left':
          self.currentSlide++;
          break;
        case 'right':
          self.currentSlide--;
          break;
      }

      self.moveSlider();
      self.stopAutoScroll();
      self.interacted = true;
    }
  };
  proto.startVideo = function(videoId) {
    // Limelight loaded
    if (typeof this.LimelightPlayer != 'undefined') {
      this.LimelightPlayer.doLoadChannel(videoId, true);
      this.$elements.limelightContainer.addClass('visible');
    } else {
      this.$elements.limelightContainer.addClass('visible');
      this.autoPlayLimelightID = videoId;
    }

  };
  proto.initiateLimelight = function() {
    var self = this;
    window.limelightPlayerCallback = function(playerId, eventName) {
      var id = "limelight_player_156792";
      self.LimelightPlayer = LimelightPlayer;
      if (eventName == 'onPlayerLoad') {
        LimelightPlayer.registerPlayer(id);
        //if play button was pressed before
        if (typeof self.autoPlayLimelightID != 'undefined') {
          this.LimelightPlayer.doLoadChannel(self.autoPlayLimelightID, true);
        }
      }
      if (eventName == 'onChannelLoad' || eventName == 'onMediaLoad') {
        self.videoInitiated();
      }
    };
  };

  proto.closeVideo = function() {
    this.LimelightPlayer.doPause();
    this.$elements.limelightContainer.removeClass('visible');
  };

  proto.setupLimelightTrigger = function($slide) {
    var self = this;
    $slide.append('<a href="#" class="' + self.options.playVideoButtonClass + '">Play Video</a>');
    self.$elements.limelightContainer = self.$elements.mainContainer.find('.limeLightContainer');
  };

  proto.initiateVideo = function() {
    var self = this;
    this.$elements.slides.each(function() {
      var limelightVideoId = $(this).data('limelightvideo');
      if (typeof limelightVideoId != 'undefined') {
        self.initiateLimelight();
        self.setupLimelightTrigger($(this));
      }
    });
  };
  // proto.adjustCurrentSlide = function() {
  //   if (this.currentSlide > this.maxSlides) {}
  // };
  proto.moveSlider = function() {
    var self = this;
    if (!this.isAnimating) {
      this.adjustCurrentSlide();

      this.isAnimating = true;
      var animateObj = {
        left: (this.currentSlide == -1) ? 0 : (this.currentSlide + 1) * this.scrollStep * -1
      };
      this.$elements.slidesContainer.animate(animateObj, this.options.transitionDuration, function() {
        self.isAnimating = false;
        if (self.currentSlide == self.maxSlides) {
          self.$elements.slidesContainer.css('left', self.wWidth * -1);
          self.currentSlide = 0;
        }

        if (self.currentSlide == -1) {
          self.$elements.slidesContainer.css('left', self.wWidth * (self.maxSlides) * -1);
          self.currentSlide = self.maxSlides - 1;
        }
      });
      if (self.currentSlide != self.maxSlides) {
        this.$elements.pager.find('li').removeClass('active');
        this.$elements.pager.find('li').eq(this.currentSlide).addClass('active');
      } else {
        this.$elements.pager.find('li').removeClass('active');
        this.$elements.pager.find('li').eq(0).addClass('active');
      }

    }
  };
  proto.setupAutoScroll = function() {
    var self = this;
    self.autoScrollInterval = setInterval(function() {
      self.currentSlide++;
      self.moveSlider();
    }, _private.speed);
  };
  proto.stopAutoScroll = function() {
    var self = this;
    if (typeof self.autoScrollInterval != 'undefined') {
      clearInterval(self.autoScrollInterval);
      self.autoScrollInterval = 0;
    }
  };
  proto.resetSlider = function() {
    this.setupElements();
    this.setupWidths();
  };
  proto.setInteracted = function() {
    var self = this;
    this.interacted = true;
    clearTimeout(this.restartAutoTimeout);
    this.restartAutoTimeout = setTimeout(function() {
      if (!self.$elements.limelightContainer.hasClass('visible')) {
        self.interacted = false;
        self.setupAutoScroll();
      }

    }, 5000);
  };
  proto.setupPager = function() {
    var pagerItems = '',
      slideCount = this.$elements.slides.length,
      active = 'active';

    if (slideCount > 1) {
      for (var i = 0; i < slideCount; i++) {
        if (i !== 0) active = '';
        pagerItems += '<li class="' + active + '">&nbsp;</li>';
      }
      var pagerHtml = '<div class="pager"><ul>' + pagerItems + '</ul></div>';

      this.$elements.mainContainer.prepend(pagerHtml);

      this.$elements.pager = this.$elements.mainContainer.find('.pager');
    }

  };
  // proto.windowEvents = function() {};

  return {
    newSlider: newSlider
  };
})();

var videoSlider = new App.Homepage.VideoSlider.newSlider({
  fullWidth: true,
  pager: true,
  elements: {
    sliderContainer: '.videoBanners'
  }
});
