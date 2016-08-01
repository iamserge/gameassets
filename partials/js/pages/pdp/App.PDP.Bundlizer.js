var App = App || {};
App.PDP = App.PDP || {};

App.PDP.Bundlizer = new(function() {

  $(init);

  function init() {
    var priceInfo = document.getElementById("priceInfo") || document.getElementById("variants") || null;
    if (priceInfo) {
      var $addToBundleCheckboxes = $("[id^='bundlizerListUpdate']").find("input[type='checkbox']");
      for (var i = 0; i < $addToBundleCheckboxes.length; i++) {
        bindCheckboxEvent($addToBundleCheckboxes[i]);
      }
    }
  }

  function bindCheckboxEvent(checkbox) {
    var $checkbox = $(checkbox),
      $submit = $checkbox.siblings("input[type='submit']").hide();

    $checkbox.bind("click", function() {
      this.checked = true;
      $submit.trigger("click");
    });
  }

});
