var App = App || {};
App.PDP = App.PDP || {};
App.PDP.WishlistOptions = new(function() {

  var options = null,
    $options = null,
    position = {};

  $(init);

  function init() {
    options = document.getElementById("wishlistOptions") || null;
    if (!options) return;

    $options = $(options).addClass("jsWishlistOptions");

    var $optionForms = $options.find("form");

    var addToWishListAJAXURL = $options.find("input[name='addToWishListAJAXURL']").get(0),
      url = (addToWishListAJAXURL) ? $(addToWishListAJAXURL).val() : null;

    if (url) {
      $options.find("form").bind("submit", function(event) {
        // var $node = $(this);
        event.preventDefault();
        $.ajax({
          url: url,
          data: $(this).serialize(),
          dataType: "json",
          success: function(json) {

            new App.PDP.CrossSellSwitcher(json);

            if (json.coremetrics) {
              callCoremetrics(json.coremetrics);
            }
          },
          complete: function() {
            Adoro.Dialogue.hideDialogue();
          }
        });
      });
    }

    var multipleOptions = ($optionForms.length > 1) ? true : false;

    if (multipleOptions) {
      $options.bind("click", function(e) {
        position.left = e.pageX;
        position.top = e.pageY;
        showDialogue();
        return false;
      });
    } else {
      var $wishlistSubmit = $options.find("form:first").find("input[type='submit']").bind("click", function(event) {
        event.stopPropagation();
      });

      $options.bind("click", function() {
        $wishlistSubmit.trigger("click");
      });
    }
  }

  function showDialogue() {
    Adoro.Dialogue.setHtml($options.find("div.wishlistWrapper").clone(true).get(0));
    Adoro.Dialogue.showDialogue({
      closeOnOverlayClick: true,
      overlayOpacity: "0.5",
      x: position.left,
      y: position.top - Adoro.Dialogue.getDimensions().h,
      container: document.getElementById("content")
    });
  }

  function callCoremetrics(script) {
    var $script = $(script);
    for (var i = 0; i < $script.length; i++) {
      if ($script[i].innerHTML) {
        var scriptHtml = $script[i].innerHTML.replace("<!--", "").replace("//-->", "").replace(/^\s*/, "").replace(/\s*$/, "");
        if (scriptHtml.indexOf("cmSet") !== 0) {
          //alert(scriptHtml);
          eval(scriptHtml);
        }
      }
    }
  }
});
