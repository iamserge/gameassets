var App = App || {};
App.Global = App.Global || {};
App.Global.Pluck = App.Global.Pluck || {};

App.Global.Pluck.Check = (function () {
	var pluckOk = true;
	try {
		var pluckCheck = PluckSDK;
	} catch (err) {
		pluckOk = false;
	}
	return pluckOk;
});

App.Global.Pluck.AdjustURL = (function(node, selector) {
	var elementCheck,
		replaceTo = ((Salmon.Global.PageContext.CURRENTURL).split("://")[1]).split("/")[0];
	
	elementCheck = setInterval((function() {
		if ($(node).find(selector).length > 0) {
			clearInterval(elementCheck);
			adjustUrl();
		}
	}), 100);
	
	function adjustUrl() {
		var $links = $("a:not([href~='" + replaceTo + "'])", node);
		for (var i=0; i < $links.length; i++) {
			var oldUrl = $links[i].getAttribute("href");
			if (oldUrl.indexOf("://") >= 0) {
				var replaceFrom = (oldUrl.split("://")[1]).split("/")[0];
				$links[i].href = oldUrl.replace(replaceFrom, replaceTo);
			}
		}
	}
});

App.Global.Pluck.Comment = (function(node, comment, options) {
	var $node = $(node),
		$comment = $(Configuration.Articles.Comment.Template.COMMENT_ITEM),
		$commentTools = null,
		$commentComment = null,
		$commentRecommend = null,
		$commentReport = null,
		$userFollow = null,
		pluckUser = {},
		commentKey = comment.CommentKey.Key,
		commenterKey = comment.Owner.UserKey.Key,
		commenterName = comment.Owner.DisplayName,
		commenterPhoto = comment.Owner.AvatarPhotoUrl,
		commenterUrl = Salmon.Global.PageContext.PLUCK_PERSONA_URL + "&" + comment.Owner.PersonaUrl.split("?")[1],
		commentDate = App.Global.Pluck.TimeDifference(comment.PostedAtTime),
		commentBody = comment.Body, 
		config = {
			nestedComments: true
		};

	init();

	function init() {
		$.extend(config, options);
		renderComment();
	}
	
	function renderComment() {
		$comment.attr("rel", commentKey);
		$comment.find("div.commenterPhoto").append($(document.createElement("img")).attr({ src: commenterPhoto, alt: commenterName }));
		$comment.find("div.commenterName").append($(document.createElement("a")).attr({ href: commenterUrl }).text(commenterName));
		$comment.find("div.commentDate").text(commentDate);
		$comment.find("div.commentBody").html(commentBody);
		PluckSDK.SendRequests([ (new PluckSDK.UserRequest()) ], userCallback);
		
		if (config.nestedComments && comment.InResponseTo) {
			var $parentComment = $node.find("div.comment[rel='" + comment.InResponseTo.Key + "']"),
				$parentComments = $parentComment.find("div.comments");
			
			if ($parentComments.length === 0) {
				$parentComments = $(document.createElement("div")).addClass("comments");
				$parentComment.addClass("hasComments").append($parentComments);
			}
			$parentComments.append($comment);
		} else {
			$node.append($comment);
		}
	}
	
	function userCallback(responses) {
		if (responses.length > 0) {
			pluckUser = responses[0].User;
		} else {
			pluckUser.IsAnonymous = true;
		}

		getCommentTools();
	}

	function getCommentTools() {
		if (pluckUser.IsAnonymous || pluckUser.UserKey.Key === commenterKey) {
			if (config.nestedComments && !comment.InResponseTo && !pluckUser.IsAnonymous) {
				$commentTools = $comment.find("div.commentTools:first").append(Configuration.Articles.Comment.Template.COMMENT_TOOLS);
				$commentComment = $commentTools.find("li.writeAComment a");
				$commentComment.bind("click", getAddCommentForm);
				
				$commentTools.find("li.recommend a").remove();
				$commentTools.find("li.report a").remove();
				$commentTools.find("li.follow a").remove();
			}
		} else {
			$commentTools = $comment.find("div.commentTools:first").append(Configuration.Articles.Comment.Template.COMMENT_TOOLS);
			$commentComment = $commentTools.find("li.writeAComment a");
			$commentRecommend = $commentTools.find("li.recommend a");
			$commentReport = $commentTools.find("li.report a");
			$userFollow = $commentTools.find("li.follow a");
			
			if (!config.nestedComments || comment.InResponseTo) {
				$commentComment.remove();
			} else {
				$commentComment.bind("click", getAddCommentForm);
			}
			
			if (!comment.RecommendationCounts.CurrentUserHasRecommended) {
				$commentRecommend.bind("click", recommendComment);
			} else {
				$commentRecommend.replaceWith(Salmon.Global.StoreText.pluck.review.RECOMMENDED);
			}
			
			if (!comment.Owner.FriendshipStatus.IsFriend) {
				$userFollow.bind("click", followUser);
			} else {
				$userFollow.replaceWith(Salmon.Global.StoreText.pluck.controls.user.FRIEND);
			}
			
			if (!comment.AbuseCounts.CurrentUserHasReportedAbuse) {
				$commentReport.bind("click", showReportOptions);
			} else {
				$commentReport.replaceWith(Salmon.Global.StoreText.pluck.review.REPORTED);
			}
		}
	}
	
	/* 
	 * ... actually not needed at all - is duplicated in App.PDP.Reviews.js
	****/
	function getAddCommentForm() {
		console.log('getAddCommentForm!'); 
		 
		var $addComment = $(Configuration.Articles.Comment.Template.WRITE_COMMENT),
			$textarea = $addComment.find("textarea"),
			$submit = $addComment.find("input[type='submit']"),
			reviews = document.getElementById("userReviews");

		$node.find("div.writeComment").remove();
		$comment.append($addComment);
		
		$textarea.focus();
		
		$submit.bind("click", function() {
			console.log('submit!'); 
			
			if ($textarea.val() !== "") {
				var action = new PluckSDK.CommentActionRequest();
				action.Body = $textarea.val();
				action.Categories = [ (new PluckSDK.DiscoveryCategory({Name:"games"})) ];
				action.CommentedOnKey = comment.Parent.ArticleKey;
				action.InResponseTo = comment.CommentKey;
				action.OnPageUrl = location.href + "#comments";
				action.OnPageTitle = node.getAttribute("title");
	
				PluckSDK.SendRequests([ action ], addCommentCallback);
			}
		});
		
		return false;
	}
	

	/*
	 * not needed - is duplicated in App.PDP.Reviews.js
	****/
	function addCommentCallback(responses) {
		if (responses.length > 0) {
			if (responses[0].ResponseStatus.StatusCode === "OK") {
				$comment.find("div.writeComment").remove();
				loadComments();
			}
		}
	}
	
	function loadComments() {
		var request = new PluckSDK.CommentsPageRequest();
		request.CommentedOnKey = comment.Parent.ArticleKey;
		request.OneBasedOnPage = 1;
		request.ItemsPerPage = 1000;
		
		PluckSDK.SendRequests([ request ], renderComments);
	}
	
	function renderComments(responses) {
		if (responses.length > 0) {
			if (responses[0].ResponseStatus.StatusCode === "OK") {
				$node.empty();
				for (var i = 0; i < responses[0].Items.length; i++) {
					new App.Global.Pluck.Comment($node.get(0), responses[0].Items[i], { nestedComments: true });
				}
			}
		}
	}
	
	function recommendComment() {		
		var action = new PluckSDK.RecommendActionRequest();
		action.RecommendedKey = comment.CommentKey;
		PluckSDK.SendRequests([ action ], recommendationCallback);
		return false;
	}
	
	function recommendationCallback(responses) {
		if (responses.length > 0) {
			if (responses[0].ResponseStatus.StatusCode === "OK") {
				$commentRecommend.replaceWith(Salmon.Global.StoreText.pluck.review.RECOMMENDED);
			}
		}
	}
	
	function followUser() {
		var action = new PluckSDK.AddFriendActionRequest();
		action.FriendUserKey = comment.Owner.UserKey;
		
		var request = new PluckSDK.UserRequest();
		request.UserKey = comment.Owner.UserKey;
		
		PluckSDK.SendRequests([ action, request ], followUserCallback);
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
		var $reportOptions = $(Configuration.Articles.Comment.Template.COMMENT_REPORT),
			options = (Salmon.Global.StoreText.pluck.review.REPORT_OPTIONS).split(",");
		
		for (var i = 0; i < options.length; i++) {
			$reportOptions.append(
				$(document.createElement("option"))
					.attr("value", options[i])
					.text(options[i])
			);
		}
		
		$reportOptions.focus();
		$reportOptions.bind("change", reportComment);
		$commentReport.replaceWith($reportOptions);
		return false;
	}
	
	function reportComment() {
		var action = new PluckSDK.ReportAbuseActionRequest();
		action.AbuseOnKey = comment.CommentKey;
		action.Reason = this.value;
		
		PluckSDK.SendRequests([ action ], reportCommentCallback);
	}
	
	function reportCommentCallback(responses) {
		if (responses.length > 0) {
			if (responses[0].ResponseStatus.StatusCode === "OK") {
				$commentTools.find("li.report select").replaceWith(Salmon.Global.StoreText.pluck.review.REPORTED);
			}
		}
	}
});

App.Global.Pluck.TimeDifference = (function(timeStart, timeEnd) {
	if (!timeEnd) {
		timeEnd = new Date();
	}
	
	var difference = (timeEnd - timeStart)/(1000 * 60 * 60 * 24); 
		
	if (Math.floor(difference) <= 0) {
		difference = (timeEnd - timeStart)/(1000 * 60 * 60);
		if (Math.floor(difference) <= 0) {
			var lTempVal = Math.floor((timeEnd - timeStart)/(1000 * 60));
			if (lTempVal < 0) {
				lTempVal = 0;
			}
			difference = (Salmon.Global.StoreText.pluck.controls.dateTime.MINUTES).replace("{0}", lTempVal);
		} else {
			var lTempVal = Math.floor((timeEnd - timeStart)/(1000 * 60 * 60));
			if (lTempVal < 0) {
				lTempVal = 0;
			}
			difference = (Salmon.Global.StoreText.pluck.controls.dateTime.HOURS).replace("{0}", lTempVal);
		}
	} else {
		var lTempVal = Math.floor(difference);
		if (lTempVal < 0) {
			lTempVal = 0;
		}
		difference = (Salmon.Global.StoreText.pluck.controls.dateTime.DAYS).replace("{0}", lTempVal);
	}
	
	return difference;
});