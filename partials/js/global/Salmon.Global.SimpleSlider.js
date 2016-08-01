Salmon.Global.SimpleSlider = function() {

  var config = {
    transitionDuration: 300,
    pager: false,
    playVideoButtonClass: 'playVideoButton',
    closeVideoButtonClass: 'closeVideo',
    fullWidth: false,
    slidesToFit: 5,
    resize: true,
    defaultSwipeParams: {
      triggerOnTouchEnd: true,
      allowPageScroll: "horizontal",
      threshold: 175,
      excludedElements: []
    }
  };

  var _private = {
    windowWidth: $(window).width(),
    speed: 2000,
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
    if (this.$elements.slides.length > this.options.slidesToFit) {
      this.setupEvents();
      this.setupClones();
    } else if (this.$elements.slides.length == 1) {
      this.$elements.windowContainer.width(this.slideWidth);
    }


  };
  proto.setupClones = function() {
    for (var i = 0; i < this.options.slidesToFit; i++) {
      var $slide = this.$elements.slides.eq(i).clone();
      $slide.addClass('clone').appendTo(this.$elements.slidesContainer);
    }
    for (var i = this.maxSlides - 1; i > this.maxSlides - this.options.slidesToFit - 1; i--) {
      var $slide = this.$elements.slides.eq(i).clone();
      $slide.addClass('clone').prependTo(this.$elements.slidesContainer);
    }
    this.$elements.slidesContainer.css('left', this.options.slidesToFit * this.slideWidth * -1);
  };

  proto.setupElements = function() {
    this.$elements = {};
    this.$elements.window = $(window);
    this.$elements.mainContainer = (typeof this.options.elements.sliderContainer == 'object') ? this.options.elements.sliderContainer : $(this.options.elements.sliderContainer);
    this.$elements.slidesContainer = this.$elements.mainContainer.find('.slides');
    this.$elements.windowContainer = this.$elements.mainContainer.find('.slidesWindow');
    this.$elements.slides = this.$elements.slidesContainer.find('.slide');
    this.$elements.sliderControlPrev = this.$elements.mainContainer.find('.carouselPrev');
    this.$elements.sliderControlNext = this.$elements.mainContainer.find('.carouselNext');
    this.maxSlides = this.$elements.slides.length;
  };

  proto.setupWidths = function() {
    this.wWidth = this.$elements.window.width();

    if (this.options.fullWidth) {
      this.scrollStep = this.wWidth;
      this.slideWidth = this.wWidth;
      this.$elements.slides.width(this.wWidth);
    } else {
      this.slideWidth = (this.$elements.mainContainer.width() * 0.9) / this.options.slidesToFit;
      this.$elements.slides.width(this.slideWidth);
      this.$elements.windowContainer.width(this.slideWidth * this.options.slidesToFit);
      this.scrollStep = this.slideWidth;
    }

  };

  proto.setupEvents = function() {
    var self = this;
    this.$elements.sliderControlNext.bind('click', function() {
      if (!self.isAnimating) {
        self.currentSlide++;
        self.moveSlider();
        self.interacted = true;
      }
    });
    this.$elements.sliderControlPrev.bind('click', function() {
      if (!self.isAnimating) {
        self.currentSlide--;
        self.moveSlider();
        self.interacted = true;
      }
    });
    this.$elements.window.on('orientationchange', function() {
      self.setupWidths();
      self.$elements.mainContainer.find('.clone').width(this.wWidth);
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
      self.interacted = true;
    }

  };

  proto.adjustCurrentSlide = function() {
    var self = this;
    if (self.currentSlide == self.maxSlides) {
      self.$elements.slidesContainer.css('left', this.options.slidesToFit * this.slideWidth * -1);
      self.currentSlide = 0;
    }
    if (self.currentSlide == (self.options.slidesToFit + 1) * -1) {
      self.$elements.slidesContainer.css('left', this.options.slidesToFit * this.slideWidth * -1);
      self.currentSlide = 0;
    }


  };
  proto.moveSlider = function() {
    var self = this;
    if (!this.isAnimating) {
      this.isAnimating = true;
      var animateObj = {
        left: (this.currentSlide == self.options.slidesToFit * -1) ? 0 : (this.currentSlide + this.options.slidesToFit) * self.scrollStep * -1
      };
      this.$elements.slidesContainer.animate(animateObj, this.options.transitionDuration, function() {
        self.isAnimating = false;
        self.adjustCurrentSlide();
      });
      if (this.options.pager) {
        if (self.currentSlide != self.maxSlides) {
          this.$elements.pager.find('li').removeClass('active');
          this.$elements.pager.find('li').eq(this.currentSlide).addClass('active');
        } else {
          this.$elements.pager.find('li').removeClass('active');
          this.$elements.pager.find('li').eq(0).addClass('active');
        }
      }

      if (this.options.pager) {
        this.$elements.pager.find('li').removeClass('active');
        this.$elements.pager.find('li').eq(this.slideCounter).addClass('active');
      }

      _private.isAnimating = 0;

    }
  };

  proto.resetSlider = function() {
    this.setupElements();
    this.setupWidths();
  };
  // proto.windowEvents = function() { };
  return {
    newSlider: newSlider
  };
};

Salmon.Global.SimpleSlider = Salmon.Global.SimpleSlider();
