var App = App || {};
App.Global = App.Global || {};

App.Global.Ratings = (function($nodes) {
  var nodeLength = $nodes.length,
    requests = new Array(nodeLength);

  init();

  function init() {
    if (nodeLength === 0 || !App.Global.Pluck.Check()) return;

    for (var i = 0; i < nodeLength; i++) {
      var node = $nodes[i];
      var articleId = $(node).attr("rel");

      if (articleId && articleId !== "") {
        var request = new PluckSDK.ArticleRequest();
        request.ArticleKey = new PluckSDK.ExternalResourceKey({ Key: articleId });
        requests[i] = request;
      }
    }

    PluckSDK.SendRequests(requests, getRatingCallback);
  }

  function getRatingCallback(responses) {
    if (responses) {
      for (var i = 0; i < nodeLength; i++) {
        new App.Global.Rating($nodes[i], (requests[i]) ? responses.shift() : null);
      }
    }
  }
});

App.Global.Rating = (function(node, data) {
  var $node = $(node),
    articleId = $node.attr("rel"),
    rating = {
      average: 0,
      currentUser: 0,
      count: 0
    };

  init();

  function init() {
    if (!data || !articleId) {
      addRating();
    } else {
      setRating(data);
    }
  }

  function setRating(ratingData) {
    $node.find(":not(p)").remove();

    if (ratingData.Article) {
      var article = ratingData.Article;
      if (article.Ratings) {
        rating.average = Math.round(article.Ratings.AverageRating);
        rating.currentUser = Math.round(article.Ratings.CurrentUserRating);
        rating.count = Math.round(article.Ratings.NumberOfRatings);
      }
    }

    addRating();
  }

  function setRatingCallback(responses) {
    if (responses[1]) {
      setRating(responses[1]);
    }
  }

  function addRating() {
    var $rating = $(document.createElement("div")).addClass("rating").addClass("rating" + rating.average);

    for (var i = 0; i < 5; i++) {
      $rating.append($(document.createElement("span")).addClass("rate").text(i + 1));
    }

    if (rating.currentUser === 0) {
      $rating.css("cursor", "pointer");

      $rating.find("span")
        .bind("mouseover", function() {
          var $el = $(this),
            ratingValue = parseInt($el.text(),10);

          if (!isNaN(ratingValue)) {
            $el.parent().removeClass("setRating1 setRating2 setRating3 setRating4 setRating5").addClass("setRating" + ratingValue);
          }
        })
        .bind("click", function() {
          var $el = $(this),
            ratingValue = parseInt($el.text(),10),
            articleKey = new PluckSDK.ExternalResourceKey({ Key: articleId });

          if (!isNaN(ratingValue)) {
            var action = new PluckSDK.RateActionRequest();
            action.RateOnKey = articleKey;
            action.Rating = ratingValue;

            var check = new PluckSDK.ArticleRequest();
            check.ArticleKey = articleKey;

            PluckSDK.SendRequests([action, check], setRatingCallback);
          }
        });

      $rating.bind("mouseleave", function() {
        $(this).removeClass("setRating1 setRating2 setRating3 setRating4 setRating5");
      });
    }

    $node.append($rating);
    $(node).append($(document.createElement("div")).addClass("ratingCount").text("(" + rating.count + ")"));
  }
});
