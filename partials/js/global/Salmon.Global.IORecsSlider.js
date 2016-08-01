Salmon.Global.IORecSliders = (function() {

  var IOSliderParams = ['ZoneID', 'ProductID', 'CategoryID', 'Randomize', 'SearchTerm', 'AttributeValue'],

    IOSlider = function($container, isLast, predefinedArgs, callback) {

      this.$container = $container;
      this.predefinedArgs = predefinedArgs;
      this.callback = callback;
      this.ioArgs = [];
      // For some recs websphere calls callback function twice, to avoid it we need to check if it was called before
      this.populated = false;
      this.style = this.$container.data('displaystyle');
      this.init(isLast);
    },
    verticalHTML = '<a class="rec" href="%Url%"> <div class="image"> <img src="%Packshot%"> </div> <div> <h3>%Title%</h3> <span class="platformLogo %Category%"></span> <div class="rating rating%Rating%">&nbsp;</div> <span class="price">&pound;%Price%</span> </div> </a>',
    horizontalHTML = '<li class="slide"> <a class="rec" href="%Url%"> <div class="image"> <img src="%Packshot%"> </div> <div> <h3>%Title%</h3> <span class="platformLogo %Category%"></span> <div class="rating rating%Rating%">&nbsp;</div> <span class="price">&pound;%Price%</span> </div> </a></li>',
    $sliders = $('.IORecsSlider'),
    IOProto = IOSlider.prototype;

  IOProto.init = function(isLast) {
    var self = this;
    self.generateArgs();
    Salmon.Global.uiBlocker.insertLoader(self.$container);
    //Setup function in a global scope based on zone Id, which will be used as callback for cmDisplayRecs
    window[this.ioArgs[0] + "_zp"] = function(recommendedIds, zoneId, symbolic, targetId, targetCat, recAttributes, targetAttr, zoneHeader) {

      var ioZoneCountReturnName = 'IOCountReturn_' + zoneId,
        ioZonePopulateName = 'IOPopulate_' + zoneId + '_';

      if (typeof window[ioZoneCountReturnName] != 'undefined')
        window[ioZoneCountReturnName]++;
      else
        window[ioZoneCountReturnName] = 1;

      ioZonePopulateName = ioZonePopulateName + window[ioZoneCountReturnName].toString();

      if (typeof window[ioZonePopulateName] == 'function') window[ioZonePopulateName](recommendedIds, zoneId, symbolic, targetId, targetCat, recAttributes, targetAttr, zoneHeader);
    };

    var _zoneId = this.ioArgs[0],
      ioZoneCountName = 'IOCount_' + _zoneId,
      // ioZoneCountReturnName = 'IOCountReturn_' + _zoneId,
      ioZonePopulateName = 'IOPopulate_' + _zoneId + '_';

    if (typeof window[ioZoneCountName] != 'undefined')
      window[ioZoneCountName]++;
    else
      window[ioZoneCountName] = 1;

    window[ioZonePopulateName + window[ioZoneCountName].toString()] = function(recommendedIds, zoneId, symbolic, targetId, targetCat, recAttributes, targetAttr, zoneHeader) {
      if (!self.populated) {
        self.targetAttributes = targetAttr;
        self.generateProductRecs(recAttributes);
        Salmon.Global.uiBlocker.removeLoader(self.$container);
        self.populated = true;
      }
    };

    if (self.ioArgs.length > 0) {
      cmRecRequest.apply(window, self.ioArgs);
      if (isLast) cmDisplayRecs();
    } else {
      self.$container.hide();
    }
  };
  IOProto.generateArgs = function() {
    if (typeof this.predefinedArgs == 'undefined') {
      for (var i in IOSliderParams) {
        if (typeof this.$container.data(IOSliderParams[i].toLowerCase()) != 'undefined') this.ioArgs.push(this.$container.data(IOSliderParams[i].toLowerCase()));
      }
    } else {
      for (var i in IOSliderParams) {
        if (typeof this.predefinedArgs[IOSliderParams[i]] != 'undefined') this.ioArgs.push(this.predefinedArgs[IOSliderParams[i]]);
      }
    }
  };

  IOProto.generateProductRecObject = function(params) {
    var obj = {
      Title: (params[0].length > 30) ? params[0].slice(0, 29) + '...' : params[0],
      Url: (params[3].indexOf('?') == -1) ? params[3] + '?cm_vc=' + this.ioArgs[0] : params[3] + '&cm_vc=' + this.ioArgs[0],
      Packshot: params[4],
      Category: params[6].replace(/ /g, ''),
      Condition: (params[13] == 'PreOwned') ? 'Pre-owned' : 'New',
      Price: params[10],
      isExclusive: (params[8] == "Y"),
      isFranchise: (params[11].replace(/[^a-zA-Z0-9]/g, '') == this.targetAttributes[11].replace(/[^a-zA-Z0-9]/g, ''))
    };

    if (typeof params[17] != 'undefined')
      obj.Rating = params[17];
    else
      obj.Rating = 'Hide';

    return obj;
  };

  IOProto.generateProductRecs = function(recsParams) {
    var recObjectsExclusive = [],
      recObjectsNotExclusive = [];


    //Business logic: if exclusive goes in first array, otherwise if same franchise goes in the back if not - in front of second array 
    if (recsParams.length === 0) {

      this.$container.hide();
      // Hide whole sidebar section on PDP
      if (this.$container.parent().hasClass('freqBought')) this.$container.parent().hide();
      if (this.$container.parent().hasClass('recommendation')) this.$container.parent().hide();
      throw new Error("No recommendations found for zone '" + this.ioArgs[0] + "'");


    }
    for (var i in recsParams) {
      var recParams = recsParams[i],
        isExclusive = (recParams[8] == "Y"),
        isFranchise = (recParams[11].replace(/[^a-zA-Z0-9]/g, '') == this.targetAttributes[11].replace(/[^a-zA-Z0-9]/g, '')),
        recObject = this.generateProductRecObject(recParams);

      if (isExclusive) {
        recObjectsExclusive.unshift(recObject);
      } else {
        if (isFranchise)
          recObjectsNotExclusive.push(recObject);
        else
          recObjectsNotExclusive.unshift(recObject);
      }
    }

    this.generateProductRecsHtml(recObjectsExclusive.concat(recObjectsNotExclusive));
  };
  IOProto.generateProductRec = function(recObject) {
    var html = (this.style == 'vertical') ? verticalHTML : horizontalHTML;

    for (var i in recObject) {
      html = html.replace('%' + i + '%', recObject[i]);
    }

    return html;
  };

  IOProto.generateProductRecsHtml = function(recsArray) {
    for (var i in recsArray) {
      this.$container.append(this.generateProductRec(recsArray[i]));
    }

    if (this.style == 'slider') {
      this.$container.html('<div class="carouselPrev icon sliderControl"><span>Prev</span></div><div class="carouselNext icon sliderControl"><span>Next</span></div><div class="slidesWindow"><ul class="slides">' + this.$container.html() + '</ul></div>');
      this.$container.addClass('IOsliderContainer');
      var packSliderSlider = new Salmon.Global.SimpleSlider.newSlider({
        fullWidth: false,
        elements: {
          sliderContainer: this.$container
        }
      });
    }
    if (typeof this.callback == 'function') this.callback();
  };

  $sliders.each(function(index) {
    var slider = new IOSlider($(this), (index == $sliders.length - 1));
  });
  return {
    IOSlider: IOSlider
  };
})();



Salmon.Global.IORecsDoubleSlider = (function() {


  $(document).on('click', '.ioContainer.double h2 span', function() {
    var index = $.inArray(this, $(this).parent().find('span'));
    $(this).parent().find('.active').removeClass('active');
    $(this).parent().parent().find('.IOsliderContainer.active').removeClass('active');
    $(this).addClass('active');
    $(this).parent().parent().find('.IOsliderContainer').eq(index).addClass('active');

  });

})();
