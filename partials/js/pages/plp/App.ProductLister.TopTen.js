var App = App || {};
App.ProductLister = App.ProductLister || {};



App.ProductLister.TopTen = new(function() {
  $(function() {
    if (document.getElementById("charts")) {
      var $charts = $("#charts").addClass("roller"),
        $topTens = $charts.find("div.productTopTen"),
        $titles = $topTens.find("span.title");

      new Salmon.Global.Truncator($titles, Configuration.ProductLister.TopTen);

      for (var i = 0; i < $topTens.length; i++) {
        new Salmon.Components.Roller($topTens[i], { itemsPerRow: ($topTens.length === 1) ? 4 : 1 });
        addPointers($topTens[i]);
      }
    } else {
      var $topTens = $("div.productTopTen", "#primary");

      for (var i = 0; i < $topTens.length; i++) {
        new App.ProductLister.TopTen.Expander($topTens[i], Configuration.ProductLister.TopTen.expanderOptions);
        if (Configuration.ProductLister.TopTen.truncator) {
          console.log("logging: tt25");
          new Salmon.Global.Truncator($topTens.find(Configuration.ProductLister.TopTen.truncator.node), Configuration.ProductLister.TopTen.truncator);
        }
      }
    }


  });

  function addPointers(node) {
    var $clip = $(node).find("div.clip");
    $clip.append("<span class='leftPointer' /><span class='rightPointer' />");
  }

});

App.ProductLister.TopTen.Expander = (function(node, options) {
  var $node = $(node),
    $clip = $node.find("div.clip"),
    $expander = $(document.createElement("a")).addClass("expand").attr("href", "#none").text("Expand chart"),
    fullHeight = $clip.height(),
    rowHeight = (options.height) ? options.height : $clip.find("li:first").outerHeight(),
    open = false;

  bindExpandEvent();

  function bindExpandEvent() {
    $clip.css("height", rowHeight);
    $expander.bind("click", function() {
      $clip.animate({ "height": open ? rowHeight + "px" : fullHeight + "px" }, "slow");
      $expander.removeClass("open").addClass(!open ? "open" : "");
      open = !open;
      return false;
    });
    $node.prepend($expander);
  }


});