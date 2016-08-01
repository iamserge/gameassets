var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.StatusIndicator = function() {

  $(init);

  var $root = null;

  var $innerDiv = null;

  var cssHideClass = "hide";

  var defaultText = "Loading...";

  function init() {
    $root = (function() {
      var div = document.createElement("div");
      var $div = $(div);
      $div.attr("id", "statusIndicator");
      $div.addClass(cssHideClass);
      $div.append('<div>' + defaultText + '</div>');
      if (Configuration.StatusIndicator) {
        var loader = document.createElement("div"),
          loadingImage = new Image();

        loader.className = "loader";
        loadingImage.src = Configuration.StatusIndicator.image;
        loader.appendChild(loadingImage);
        $div.append(loader);
      }
      $("body").append(div);
      $innerDiv = $div.find("div:first");
      return $div;
    }());

  }

  function showIndicator(message) {
    if ($root !== null) {
      if ($root.hasClass(cssHideClass)) {
        if (message) updateText(message);
        $root.css({ "opacity": "1" });
        if (Configuration.StatusIndicator) {
          if (Configuration.StatusIndicator.startAnimate) {
            Configuration.StatusIndicator.startAnimate($root);
          }
        }
        $root.removeClass(cssHideClass);
      }
    }
  }

  function updateText(text) {
    if (text) {
      $innerDiv.html(text);
    } else {
      $innerDiv.html(defaultText);
    }
  }

  function hideIndicator() {
    $root.animate({ "opacity": "0" }, {
      complete: function() {
        $root.addClass(cssHideClass);
        updateText(defaultText);
        if (Configuration.StatusIndicator) {
          if (Configuration.StatusIndicator.stopAnimate) {
            Configuration.StatusIndicator.stopAnimate($root);
          }
        }
      }
    });
  }

  this.showIndicator = showIndicator;
  this.hideIndicator = hideIndicator;

  return this;
};

if (!Salmon.Global.FeatureToggles.getFeature('NewHeaderAndFooter')) Salmon.Global.StatusIndicator = Salmon.Global.StatusIndicator();
