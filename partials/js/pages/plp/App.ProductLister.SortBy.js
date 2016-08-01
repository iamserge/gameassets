var App = App || {};
App.ProductLister = App.ProductLister || {};

/**
 * The control to handle displaying the results in a particular sorting order
 * @class Singleton
 * @static
 * @author Adam Silver
 */

/* jshint browser: true */
/* globals $root: true, $form: true */

App.ProductLister.SortBy = new(function() {

  function init() {
    $root = (Salmon.Global.FeatureToggles.getFeature('NewPLP')) ? $(".plpHeader .sort") : $("#productLister div.sortBy");
    $form = $root.find("form");

    $root.find('input[type="submit"]').remove();
    $root.find("select").bind("change", select_onChange);
    if ($.browser.msie) {
      if (parseInt($.browser.version, 10) < 8) {
        $root.find("select")
          .bind("mousedown", function() {
            $root.addClass("focus");
          })
          .bind("blur", function() {
            $root.removeClass("focus");
          });
      }
    }

    function select_onChange() {
      $(this).parents("form").trigger("submit");
      if (Salmon.Global.FeatureToggles.getFeature('NewPLP')) {
        Salmon.Global.uiBlocker.insertLoader($('main'));
        //Salmon.Global.uiBlocker.blockUI();
      }
    }
  }

  $(init);


  //Add loader also for the sidebar links
  if (Salmon.Global.FeatureToggles.getFeature('NewPLP')) {
    $('#sidebar > div a').on('click', function() {
      Salmon.Global.uiBlocker.insertLoader($('main'));
    });
  }
});
