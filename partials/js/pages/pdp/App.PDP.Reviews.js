var App = App || {};
App.PDP = App.PDP || {};

App.PDP.Reviews = new(function() {

  var node = document.getElementById("userReviews") || null;

  if (node) {

    var $node = $(node),
      $reviews = $node.find("ul.reviewsList"),
      $reviewControls = $node.find("div.reviewsControl"),
      $reviewWrite = $node.find("div.reviewWrite"),
      articleKey = null,
      pluckUser = {},
      userWroteReview = false,
      totalItems = 0,
      currentPage = 1,
      currentResultsPerPageIndex = 0,
      sortType = "",
      sortOrder = "",
      allRatings = {
        RATING_5: 0,
        RATING_4: 0,
        RATING_3: 0,
        RATING_2: 0,
        RATING_1: 0
      },
      config = {
        resultsPageLoad: 5,
        resultsAjaxLoad: 1
      },
      initialised = false;

    function init() {

      if (!node || !App.Global.Pluck.Check()) return;

      if (document.getElementById("userReviews")) {
        articleKey = new PluckSDK.ExternalResourceKey();
        articleKey.Key = node.getAttribute("rel");
        getUser();
        //getReviewPage(currentPage);
      }
    }

    init();
  }

  function getUser() {
    
    PluckSDK.SendRequests([(new PluckSDK.UserRequest())], userCallback);
  }

  function userCallback(responses) {
    
    if (responses.length > 0) {
      pluckUser = responses[0].User;
    } else {
      pluckUser.IsAnonymous = true;
    }
    getReviewPage(currentPage);
  }

  function getReviewPage(pageNumber) {
    
    var request = new PluckSDK.ReviewsPageRequest();

    if (pageNumber > 1) {
      request.ItemsPerPage = config.resultsAjaxLoad;
    } else {
      request.ItemsPerPage = config.resultsPageLoad;
    }

    request.OneBasedOnPage = pageNumber;
    request.ReviewedKey = articleKey;
    request.SortType = new PluckSDK.ReviewRatingSort({ SortOrder: "Descending" });
    PluckSDK.SendRequests([request], showReviewsCallback);
  }

  function showReviewsCallback(responses) {
    
    if (responses.length > 0) {
      if (responses[0].Items.length > 0) {
        var carousel = new App.PDP.Carousel();

        $('#userReviews > p').remove();

        currentPage = responses[0].OneBasedOnPage + responses[0].ItemsPerPage - 1;
        totalItems = responses[0].TotalItems;
        sortType = responses[0].SortType.ObjectType;
        sortOrder = responses[0].SortType.SortOrder;

        for (var i = 0; i < responses[0].Items.length; i++) {
          new App.PDP.Reviews.Review(
            $reviews, // node
            responses[0].Items[i], // review
            { "pluckUser": pluckUser, "parentKey": articleKey } // options
          );
        }

        if (initialised === false) {
          // initial set up
          renderPagination();
          carousel.setUpCarousels([node]);
          initialised = true;
        } else {
          carousel.addCarouselItem(node);
        }

        if (totalItems > responses[0].ItemsPerPage) {
          getAllArticleReviews(totalItems);
        } else {
          allReviewsCallback(responses);
        }
      } else {
        getReviewWriteForm();
      }
    }
  }

  function getAllArticleReviews(count) {
    
    var request = new PluckSDK.ReviewsPageRequest();

    request.ItemsPerPage = count;
    request.OneBasedOnPage = 1;
    request.ReviewedKey = articleKey;

    PluckSDK.SendRequests([request], allReviewsCallback);
  }

  function allReviewsCallback(responses) {
    
    if (responses.length > 0) {
      for (var i = 0; i < responses[0].Items.length; i++) {
        var review = responses[0].Items[i];
        allRatings["RATING_" + review.Rating] = allRatings["RATING_" + review.Rating] + 1;
        if (review.ReviewedBy.UserKey.Key === pluckUser.UserKey.Key) {
          userWroteReview = true;
        }
      }

      getReviewWriteForm();
    }
  }

  function renderPagination() {
    
    var $pagination = $(App.PDP.Reviews.Template.PAGINATION_CONTROLS),
      next = $pagination.find("div.next"),
      prev = $pagination.find("div.previous");

    // disable next control
    if (totalItems <= 5 || currentPage == totalItems) {
      $(next).addClass('disabled');
    }

    $(prev)
      .append(
        $(document.createElement('a'))
        .attr("href", "#")
        .text("Prev")
      );

    $(next)
      .append(
        $(document.createElement('a'))
        .attr("href", "#")
        .text("Next")
        .bind("click", function() {
          if (currentPage < totalItems) {
            getReviewPage(currentPage + 1);
          }

          if (currentPage < totalItems - 1) {
            $(next).addClass('enabled');
          } else {
            $(next).removeClass('enabled');
          }

          return false;
        })
      );

    $('#userReviews > .header').after($pagination);
  }

  function getReviewWriteForm() {
    
    $reviewWrite.empty();

    if (pluckUser.IsAnonymous) {
      renderRegisterLink();
    } else {
      renderFormToggle();
      renderReviewWriteForm();
    }
  }

  function renderRegisterLink() {
    
    $reviewWrite.append(App.PDP.Reviews.Template.REGISTER);
  }

  function renderFormToggle() {
    
    $reviewWrite.append(App.PDP.Reviews.TemplateNew.FORM_TOGGLE);
    $('.toggleReviewForm').bind("click", function() {
      $('.reviewWrite').find('.write').slideToggle();
    });
  }

  function renderReviewWriteForm() {
    if (!userWroteReview) {
      var $write = (!Salmon.Global.FeatureToggles.getFeature('NewHeaderAndFooter')) ? $(App.PDP.Reviews.Template.WRITE_REVIEW) : $(App.PDP.Reviews.TemplateNew.WRITE_REVIEW);


      addRating($write.find("div.rating"));

      $write.find("textarea")
        .bind("focus", function() {
          // var $el = $(this);
          if (this.value === Salmon.Global.StoreText.pluck.review.WRITE_REVIEW_BODY_TEXT) {
            this.value = "";
          }
        })
        .bind("blur", function() {
          if ($.trim(this.value) === "") {
            this.value = Salmon.Global.StoreText.pluck.review.WRITE_REVIEW_BODY_TEXT;
          } else {
            $("#reviewErrorSummary").find("ul").find("li").find("a[href*='#writeReviewBody']").parent().remove();
            clearErrorSumary();
          }
        });

      $write.find("#writeReviewTitle")
        .bind("blur", function() {
          if ($.trim(this.value) === "") {} else {
            $("#reviewErrorSummary").find("ul").find("li").find("a[href*='#writeReviewTitle']").parent().remove();
            clearErrorSumary();
          }
        });

      var $writeForm = $write.find("form"),
        writeForm = $writeForm.get(0);

      if (writeForm) {
        var fv = new Adoro.FormValidator(writeForm);

        fv.addValidator("writeReviewRating", [{
          method: function() {
            // stars used to have no var in front, this was changed during linting, if problems arise this could be the problem
            var stars = document.getElementById("writeReviewRating").value;
            if (stars === 0) {
              document.getElementById("reviewStar").style.border = "2px solid red";
              return false;

            } else {
              document.getElementById("reviewStar").style.border = "";
              return true;
            }
          },
          messages: ["Required", "Please choose your review stars, at least one star.</br>(* Poor, ** Average, *** Good, **** Very Good, ***** Excellent)"]
        }]);
        fv.addValidator("writeReviewTitle", [{
          method: Adoro.FormRules.notEmpty,
          messages: ["Required", "Please enter a title for your review"]
        }]);

        App.Global.Forms.Validation.Helpers.createBasicField(fv, $writeForm, "writeReviewTitle");

        fv.addValidator("writeReviewBody", [{
          method: Adoro.FormRules.notEmpty,
          messages: ["Required", "Please enter your review"]
        }, {
          method: Adoro.FormRules.notEqual,
          messages: ["Required", "Please enter your review"],
          params: { compareValue: Salmon.Global.StoreText.pluck.review.WRITE_REVIEW_BODY_TEXT }
        }]);

        App.Global.Forms.Validation.Helpers.createBasicField(fv, $writeForm, "writeReviewBody");

        fv.addEventHandler("onFormValidateStart", function() {
          App.Global.Forms.Validation.Helpers.clearErrorSummary($("#reviewErrorSummary"));
        });

        fv.addEventHandler("onFormFail", function(e, fv, errors) {
          App.Global.Forms.Validation.Helpers.generateErrorSummary($("#reviewErrorSummary"), errors);
        });

        $writeForm.bind("submit", function(event) {
          event.preventDefault();

          if (fv.validate()) {
            var reviewAction = new PluckSDK.ReviewActionRequest();
            reviewAction.ReviewedKey = articleKey;
            reviewAction.ReviewTitle = document.getElementById("writeReviewTitle").value;
            reviewAction.ReviewBody = document.getElementById("writeReviewBody").value;
            reviewAction.OnPageUrl = location.href + "#userReviews";
            reviewAction.OnPageTitle = document.getElementById("productName").innerHTML.replace(/^\s*/, "").replace(/\s*$/, "");
            reviewAction.ReviewRating = parseInt(document.getElementById("writeReviewRating").value,10);

            PluckSDK.SendRequests([reviewAction], reviewActionCallback);
          }
        });
      }

      $reviewWrite.append($write);
    }
  }

  function addRating($rating) {
    
    for (var i = 0; i < 5; i++) {
      $rating.append($(document.createElement("span")).addClass("rate").text(i + 1));
    }

    $rating.css("cursor", "pointer");
    $rating.find("span")
      .bind("mouseover", function() {
        var $el = $(this),
          ratingValue = parseInt($el.text(),10);

        if (!isNaN(ratingValue)) {
          $el.parent().removeClass("setRating0 setRating1 setRating2 setRating3 setRating4 setRating5").addClass("setRating" + ratingValue);
        }
      })
      .bind("click", function() {
        var $el = $(this),
          ratingValue = parseInt($el.text(),10);

        if (!isNaN(ratingValue)) {
          $rating.find("input[name='writeReviewRating']").val(ratingValue);
        }
        document.getElementById("reviewStar").style.border = "";
        $("#reviewErrorSummary").find("ul").find("li").find("a[href*='#writeReviewRating']").parent().remove();
        clearErrorSumary();
      });

    $rating.bind("mouseleave", function() {
      $(this).removeClass("setRating1 setRating2 setRating3 setRating4 setRating5");
      $(this).addClass("setRating" + $(this).find("input[name='writeReviewRating']").val());
    });
  }

  function reviewActionCallback(responses) {
    
    if (responses.length > 0) {
      if (
        responses[0].ResponseStatus.StatusCode === "ProcessingException" &&
        responses[0].Exceptions[0].ExceptionCode === "DirtyWordFilterTriggered"
      ) {
        $reviewWrite.find("div.reviewFilter").find("span.reviewFiltered").text("Please edit or remove the following word(s), then resubmit your content: " + responses[0].Exceptions[0].Value + ".");
      } else {
        //initialised = false; 
        $reviewWrite.remove();
        //$reviews.html(''); 
        //getReviewPage(1);
        $('.sUserReviews.header').append('<span class="success">Thank you! Your review was added!</span>');
      }
    }
  }
});

function clearErrorSumary() {
  
  if ($("#reviewErrorSummary").find("ul").find("li").length === 0) {
    $("#reviewErrorSummary").find("ul").remove();
    $("#reviewErrorSummary").find("h4").remove();
    $("#reviewErrorSummary").find("span").remove();
    $("#reviewErrorSummary").addClass("errorSummary hide");
  }
}

App.PDP.Reviews.Review = (function(node, review, options) {
  
  var $node = $(node),
    // $loginReturnURL = $("input[name=catEntryURL").val(),
    pluckUser = {},
    config = {
      parentKey: null,
      pluckUser: { IsAnonymous: true }
    },
    $review = (!Salmon.Global.FeatureToggles.getFeature('NewHeaderAndFooter')) ? $(App.PDP.Reviews.Template.REVIEW_ITEM) : $(App.PDP.Reviews.TemplateNew.REVIEW_ITEM),
    $reviewTools = $(App.PDP.Reviews.Template.REVIEW_TOOLS), // null,
    $reviewComment = null,
    $reviewRecommend = null,
    $reviewReport = null,
    $userFollow = null,
    // reviewKey = review.ReviewKey.Key,
    reviewerKey = review.ReviewedBy.UserKey.Key,
    reviewerName = review.ReviewedBy.DisplayName,
    reviewerPhoto = review.ReviewedBy.AvatarPhotoUrl,
    // reviewerUrl = Salmon.Global.PageContext.PLUCK_PERSONA_URL + "&" + review.ReviewedBy.PersonaUrl.split("?")[1],
    reviewDate = App.Global.Pluck.TimeDifference(review.DatePosted),
    reviewTitle = review.Title,
    reviewRating = Math.floor(review.Rating),
    reviewBody = review.Body;

  init();

  function init() {
    
    $.extend(config, options);

    pluckUser = config.pluckUser;

    $review.find("div.reviewerPhoto").append($(document.createElement("img")).attr({ src: reviewerPhoto, alt: reviewerName }));
    $review.find("p.reviewerName").append(reviewerName);
    $review.find("p.reviewDate").text(reviewDate);
    $review.find("p.reviewTitle").text(reviewTitle);
    $review.find("span.reviewRating").addClass("rating rating" + reviewRating);
    $review.find("p.reviewBody").html(reviewBody);
    $review.find("p.moreLink a").bind('click', openReview);
    $reviewTools.find("li.writeAComment a").bind('click', openReview);
    $node.append($review);
  }

  function openReview(e) {
    
    var div = document.createElement('div');
    var ul = document.createElement('ul');
    var options = null;

    new App.PDP.Reviews.Review(ul, review, options);

    loadComments(review);

    div.appendChild(ul);
    div.style.width = 862 + 'px';

    Adoro.Dialogue.setHtml(div);
    Adoro.Dialogue.showDialogue({
      closeOnOverlayClick: true
    });

    e.preventDefault();

    if (pluckUser.IsAnonymous || pluckUser.UserKey.Key === reviewerKey) {
      if (!pluckUser.IsAnonymous) {
        $reviewTools = $(ul).find("div.reviewTools").append(App.PDP.Reviews.Template.REVIEW_TOOLS);
        $reviewComment = $reviewTools.find("li.writeAComment a");
        $reviewTools.find("li.recommend a").remove();
        $reviewTools.find("li.report a").remove();
        $reviewTools.find("li.follow a").remove();
      }
    } else {
      $reviewTools = $(ul).find("div.reviewTools").append(App.PDP.Reviews.Template.REVIEW_TOOLS);
      $reviewComment = $reviewTools.find("li.writeAComment a");
      $reviewRecommend = $reviewTools.find("li.recommend a");
      $reviewReport = $reviewTools.find("li.report a");
      $userFollow = $reviewTools.find("li.follow a");

      if (config.parentKey) {
        if (!review.ItemScore.CurrentUserHasScored) {
          $reviewRecommend.bind("click", recommendReview);
        } else {
          $reviewRecommend.replaceWith(Salmon.Global.StoreText.pluck.review.RECOMMENDED);
        }

        if (!review.AbuseCounts.CurrentUserHasReportedAbuse) {
          $reviewReport.bind("click", showReportOptions);
        } else {
          $reviewReport.replaceWith(Salmon.Global.StoreText.pluck.review.REPORTED);
        }
      }

      if (!review.ReviewedBy.FriendshipStatus.IsFriend) {
        $userFollow.bind("click", followUser);
      } else {
        $userFollow.replaceWith(Salmon.Global.StoreText.pluck.controls.user.FRIEND);
      }

      // bind required events to the reviews in light-box
      $reviewComment
        .unbind('click')
        .bind('click', getAddCommentForm);
    }
  }

  function getAddCommentForm() {
    
    var $addComment = $(App.PDP.Reviews.Template.WRITE_COMMENT),
      $textarea = $addComment.find("textarea"),
      $submit = $addComment.find("input[type='submit']"),
      reviews = document.getElementById("userReviews"),
      container = this;

    while (container.parentNode.className.indexOf('item') == -1) {
      container = container.parentNode;
    }

    container.parentNode.appendChild($addComment[0]);

    $textarea.focus();

    $submit.bind("click", function() {
      
      if ($textarea.val() !== "") {
        var action = new PluckSDK.CommentActionRequest();

        action.Body = $textarea.val();
        action.Categories = [(new PluckSDK.DiscoveryCategory({ Name: "games" }))];
        action.CommentedOnKey = review.ReviewKey;
        action.OnPageUrl = location.href + "#userReviews";
        action.OnPageTitle = reviews.getAttribute("title");

        PluckSDK.SendRequests([action], addCommentCallback);
      }
    });

    return false;
  }

  function addCommentCallback(responses) {
    
    if (responses.length > 0) {
      if (responses[0].ResponseStatus.StatusCode === "OK") {
        $("#dialogue").find("li.review").find("div.writeComment").remove();
        loadComments(review);
      }

      // if filtered out because of dirty words
      else if (
        responses[0].ResponseStatus.StatusCode === "ProcessingException" &&
        responses[0].Exceptions[0].ExceptionCode === "DirtyWordFilterTriggered"
      ) {
        $("#dialogue").find("li.review").find("div.writeComment").find("div.commentFilter").find("span.commentFiltered").text("Please edit or remove the following word(s), then resubmit your content: " + responses[0].Exceptions[0].Value + ".");
      }
    }
  }

  function loadComments(review) {
    var request = new PluckSDK.CommentsPageRequest();

    request.CommentedOnKey = review.ReviewKey;
    request.OneBasedOnPage = 1;
    request.ItemsPerPage = 1000;

    PluckSDK.SendRequests([request], renderComments);
  }

  function renderComments(responses) {
    if (responses && responses.length > 0) {
      if (responses[0].Items.length > 0) {
        var comments = $('#dialogue').find('.comments')[0];

        $(comments).empty();

        for (var i = 0; i < responses[0].Items.length; i++) {
          new App.Global.Pluck.Comment(
            comments, // node
            responses[0].Items[i], // comment
            { nestedComments: false } // options
          );
        }
      }
    }
  }

  function recommendReview() {
    
    var action = new PluckSDK.SetItemScoreActionRequest();

    action.ParentKey = config.parentKey;
    action.Score = 1;
    action.ScoreId = "Review";
    action.TargetKey = review.ReviewKey;

    PluckSDK.SendRequests([action], recommendationCallback);

    return false;
  }

  function recommendationCallback(responses) {
    
    if (responses.length > 0) {
      if (responses[0].ResponseStatus.StatusCode === "OK") {
        $reviewRecommend.replaceWith(Salmon.Global.StoreText.pluck.review.RECOMMENDED);
      }
    }
  }

  function followUser() {
    
    var action = new PluckSDK.AddFriendActionRequest();
    action.FriendUserKey = review.ReviewedBy.UserKey;

    var request = new PluckSDK.UserRequest();
    request.UserKey = review.ReviewedBy.UserKey;

    PluckSDK.SendRequests([action, request], followUserCallback);

    return false;
  }

  function followUserCallback(responses) {
    
    if (responses.length > 1) {
      if (responses[0].ResponseStatus.StatusCode === "OK") {
        if (responses[1].ResponseStatus.StatusCode === "OK") {
          var user = responses[1].User || null;
          if (user) {
            if (user.FriendshipStatus.IsPendingFriend) {
              $userFollow.replaceWith(Salmon.Global.StoreText.pluck.controls.user.FRIENDSHIP_REQUESTED);
            } else if (user.FriendshipStatus.IsFriend) {
              $userFollow.replaceWith(Salmon.Global.StoreText.pluck.controls.user.FRIEND);
            }
          }
        }
      }
    }
  }

  function showReportOptions() {
    
    var $reportOptions = $(App.PDP.Reviews.Template.REVIEW_REPORT),
      options = (Salmon.Global.StoreText.pluck.review.REPORT_OPTIONS).split(",");

    for (var i = 0; i < options.length; i++) {
      $reportOptions.append(
        $(document.createElement("option"))
        .attr("value", options[i])
        .text(options[i])
      );
    }

    $reportOptions.focus();
    $reportOptions.bind("change", reportReview);
    $reviewReport.replaceWith($reportOptions);

    return false;
  }

  function reportReview() {
    
    var action = new PluckSDK.ReportAbuseActionRequest();
    action.AbuseOnKey = review.ReviewKey;
    action.Reason = this.value;

    PluckSDK.SendRequests([action], reportReviewCallback);
  }

  function reportReviewCallback(responses) {
    
    if (responses.length > 0) {
      if (responses[0].ResponseStatus.StatusCode === "OK") {
        $reviewTools.find("li.report select").replaceWith(Salmon.Global.StoreText.pluck.review.REPORTED);
      }
    }
  }
});

App.PDP.Reviews.Template = {

  REGISTER: '<a class="register" href="' + Salmon.Global.PageContext.LOGON_FORM_URL + window.location.protocol + "//" + window.location.host + window.location.pathname + '?activeTab=userReviews&shouldCachePage=false"><span>' + Salmon.Global.StoreText.pluck.review.REGISTER_TO_WRITE_A_REVIEW + '</span></a>',
  WRITE_REVIEW: '<div class="write">' +
    '<form>' +
    '<div id="reviewErrorSummary" class="errorSummary hide"></div>' +
    '<div id="reviewStar" class="rating rating0">' +
    '<input id="writeReviewRating" name="writeReviewRating" value="0" />' +
    '</div>' +
    '<div class="field">' +
    '<div class="indicator">' +
    '<label for="writeReviewTitle">' +
    Salmon.Global.StoreText.pluck.review.WRITE_REVIEW_TITLE_LABEL +
    '</label>' +
    '</div>' +
    '<div class="element">' +
    '<div class="elementWrapper">' +
    '<input class="text" id="writeReviewTitle" name="writeReviewTitle" maxlength="100" />' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="field">' +
    '<div class="indicator">' +
    '<label for="writeReviewBody">' +
    Salmon.Global.StoreText.pluck.review.WRITE_REVIEW_BODY_LABEL +
    '</label>' +
    '</div>' +
    '<div class="element">' +
    '<div class="elementWrapper">' +
    '<textarea name="writeReviewBody" id="writeReviewBody">' +
    Salmon.Global.StoreText.pluck.review.WRITE_REVIEW_BODY_TEXT +
    '</textarea>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="reviewFilter">' +
    '<span class="reviewFiltered" style="color:red"></span>' +
    '</div>' +
    '<ul class="action">' +
    '<li class="secondary">' +
    '<input type="submit" class="update" id="submitReview" name="submitReview" value="' +
    Salmon.Global.StoreText.pluck.review.SUBMIT_REVIEW +
    '"/>' +
    '</li>' +
    '</ul>' +
    '</form>' +
    '</div>',
  WRITE_COMMENT: '<div class="writeComment"><div class="field"><div class="element"><div class="elementWrapper"><textarea id="addComment" name="addComment"></textarea></div></div></div><div class="commentFilter"><span class="commentFiltered" style="color:red"></span></div><ul class="action"><li class="secondary"><input type="submit" class="update" id="submitComment" name="submitComment" value="' + Salmon.Global.StoreText.pluck.review.SUBMIT_COMMENT + '" /></li></ul></div>',
  REVIEW_ITEM: '<li class="item review">' +
    '<div class="reviewContent">' +
    '<p class="reviewTitle"></p>' +
    '<span class="reviewRating"></span>' +
    '<p class="reviewBody"></p>' +
    '<p class="moreLink">' +
    '<a href="#">See more &#8230;</a>' +
    '</p>' +
    '</div>' +
    '<div class="reviewInfo">' +
    '<p class="reviewerName"></p>' +
    '<div class="reviewerPhoto"></div>' +
    '<div class="reviewerInfo">' +
    '<p class="reviewDate"></p>' +
    '<div class="reviewTools"></div>' +
    '</div>' +
    '</div>' +
    '<div class="comments"></div>' +
    '</li>',
  REVIEW_TOOLS: '<ul class="tools">' +
    '<li class="recommend toolLike">' +
    '<a href="#recommend">' +
    Salmon.Global.StoreText.pluck.review.RECOMMEND +
    '</a>' +
    '</li>' +
    '<li class="follow toolPlus">' +
    '<a href="#follow">' +
    Salmon.Global.StoreText.pluck.controls.user.ADD_AS_FRIEND +
    '</a>' +
    '</li>' +
    '<li class="report toolWarn">' +
    '<a href="#report">' +
    Salmon.Global.StoreText.pluck.review.REPORT +
    '</a>' +
    '</li>' +
    '<li class="writeAComment">' +
    '<a href="#writeComment">' +
    Salmon.Global.StoreText.pluck.review.WRITE_A_COMMENT +
    '</a>' +
    '</li>' +
    '</ul>',
  REVIEW_REPORT: '<select name="report"><option value="">' + Salmon.Global.StoreText.pluck.review.REPORT_LABEL + '</option></select>',
  PAGINATION_CONTROLS: '<div class="pagination">' +
    '<div class="previous disabled"></div>' +
    '<div class="next"></div>' +
    '</div>'
};

App.PDP.Reviews.TemplateNew = {

  FORM_TOGGLE: '<button class="btn secondary toggleReviewForm">' + Salmon.Global.StoreText.pluck.review.WRITE_REVIEW_BODY_LABEL + '</button>',
  REGISTER: '<a class="register" href="' + Salmon.Global.PageContext.LOGON_FORM_URL + window.location.protocol + "//" + window.location.host + window.location.pathname + '?activeTab=userReviews&shouldCachePage=false"><span>' + Salmon.Global.StoreText.pluck.review.REGISTER_TO_WRITE_A_REVIEW + '</span></a>',
  WRITE_REVIEW: '<div class="write">' +
    '<form>' +
    '<div id="reviewErrorSummary" class="errorSummary hide"></div>' +
    '<div class="writeReviewScore">' +
    '<label for="writeReviewTitle">' +
    '<span>' +
    Salmon.Global.StoreText.pluck.review.WRITE_REVIEW_TITLE_LABEL +
    '</span>' +
    '<input class="text" id="writeReviewTitle" name="writeReviewTitle" maxlength="100" type="text" placeholder="' +
    Salmon.Global.StoreText.pluck.review.WRITE_REVIEW_TITLE_LABEL +
    '" />' +
    '</label>' +
    '<div id="reviewStar" class="rating rating0">' +
    '<input id="writeReviewRating" name="writeReviewRating" value="0" type="number" />' +
    '</div>' +
    '</div>' +
    '<label for="writeReviewBody">' +
    '<span>' +
    Salmon.Global.StoreText.pluck.review.WRITE_REVIEW_BODY_LABEL +
    '</span>' +
    '<textarea name="writeReviewBody" id="writeReviewBody">' +
    Salmon.Global.StoreText.pluck.review.WRITE_REVIEW_BODY_TEXT +
    '</textarea>' +
    '</label>' +
    '<div class="reviewFilter">' +
    '<span class="reviewFiltered" style="color:red"></span>' +
    '</div>' +
    '<input type="submit" class="update" id="submitReview" name="submitReview" value="' +
    Salmon.Global.StoreText.pluck.review.SUBMIT_REVIEW +
    '"/>' +
    '</form>' +
    '</div>',
  WRITE_COMMENT: '<div class="writeComment"><div class="field"><div class="element"><div class="elementWrapper"><textarea id="addComment" name="addComment"></textarea></div></div></div><div class="commentFilter"><span class="commentFiltered" style="color:red"></span></div><ul class="action"><li class="secondary"><input type="submit" class="update" id="submitComment" name="submitComment" value="' + Salmon.Global.StoreText.pluck.review.SUBMIT_COMMENT + '" /></li></ul></div>',
  REVIEW_ITEM: '<li class="item review">' +
    '<div class="reviewContent">' +
    '<p class="reviewTitle"></p>' +
    '<span class="reviewRating"></span>' +
    '<div class="reviewInfo">' +
    '<p class="reviewerName"></p>' +
    '<div class="reviewerPhoto"></div>' +
    '<div class="reviewerInfo">' +
    '<p class="reviewDate"></p>' +
    '<div class="reviewTools"></div>' +
    '</div>' +
    '</div>' +
    '<p class="reviewBody"></p>' +
    '<p class="moreLink">' +
    '<a href="#">See more &#8230;</a>' +
    '</p>' +
    '</div>' +
    '<div class="comments"></div>' +
    '</li>',
  REVIEW_TOOLS: '<ul class="tools">' +
    '<li class="recommend toolLike">' +
    '<a href="#recommend">' +
    Salmon.Global.StoreText.pluck.review.RECOMMEND +
    '</a>' +
    '</li>' +
    '<li class="follow toolPlus">' +
    '<a href="#follow">' +
    Salmon.Global.StoreText.pluck.controls.user.ADD_AS_FRIEND +
    '</a>' +
    '</li>' +
    '<li class="report toolWarn">' +
    '<a href="#report">' +
    Salmon.Global.StoreText.pluck.review.REPORT +
    '</a>' +
    '</li>' +
    '<li class="writeAComment">' +
    '<a href="#writeComment">' +
    Salmon.Global.StoreText.pluck.review.WRITE_A_COMMENT +
    '</a>' +
    '</li>' +
    '</ul>',
  REVIEW_REPORT: '<select name="report"><option value="">' + Salmon.Global.StoreText.pluck.review.REPORT_LABEL + '</option></select>',
  PAGINATION_CONTROLS: '<div class="pagination">' +
    '<div class="previous disabled"></div>' +
    '<div class="next"></div>' +
    '</div>'
};
