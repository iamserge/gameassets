var Game = {};
Game.Global = {};
Game.Global.Vars = {};
Game.featureToggles = {};
Game.CurrentPage = {};


var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.PageContext = {
	CURRENTURL : "http://www.oat.game.co.uk/webapp/wcs/stores/servlet/?storeId=10151",
	CATDISPLAYURL : "http://www.oat.game.co.uk/webapp/wcs/stores/servlet/Product2_10151_10201__44____",
	IMAGEPATH : "/wcsstore7.00.1368.2284/SafeStorefrontAssetStore/locale/en_GB/Style1/img/",
	JSPSTOREDIR : "/SafeStorefrontAssetStore/",
	STYLECSSDIR : "/wcsstore/SafeStorefrontAssetStore/Style1/css",
	STYLEIMAGEDIR : "/wcsstore7.00.1368.2284/SafeStorefrontAssetStore/locale/en_GB/Style1/img/",
	JSDIR : "/wcsstore/SafeStorefrontAssetStore/javascript",
	CSSMAINDIR : "/wcsstore/SafeStorefrontAssetStore/css",
	LOCALE : "en_GB",
	STORENAME : "GAME",
	SEARCH_PRODUCTS : "10",
	SEARCH_ARTICLES : "2",
	SEARCH_STORES : "2",
	CAROUSEL_TIMER : "5",
	PDP_CROSS_SELLS_TO_DISPLAY : "5",
	EMS_PRODUCTS_TO_DISPLAY :"5",
	PREDICTIVE_SEARCH_URL : "/webapp/wcs/stores/servlet/AjaxPredictiveSearchView?catalogId=10201&storeId=10151&langId=44",
	PRODUCT_OVERLAY_URL: "/webapp/wcs/stores/servlet/AjaxProductDisplayView?catalogId=10201&storeId=10151&langId=44",
	LOGON_FORM_URL: "/webapp/wcs/stores/servlet/LogonForm?langId=44&storeId=10151&catalogId=10201&myAcctMain=1&ReviewsURL=",
	PLUCK_PERSONA_URL: "/webapp/wcs/stores/servlet/PersonaView?storeId=10151&catalogId=10201&langId=44",
	GIFTMSG_MAXLENGTH: 100,
	MARKETPLACE_SELLER_LOGO_URL_SMALL: "//img.game.co.uk/imagestest/mkt/sellers/53x53/",
	MARKETPLACE_SELLER_LOGO_URL_MEDIUM: "http://img.game.co.uk/imagestest/mkt/sellers/73x73/",
	MARKETPLACE_SELLER_LOGO_URL_LARGE: "http://img.game.co.uk/imagestest/mkt/sellers/106x106/"
};

Salmon.Global.StoreText = {
	errors: {
		priceAlertForm: {
			"ERROR_PRICE_ALERT_SELECT_MINT_PRICE_FIELD": "Required",
			"ERROR_PRICE_ALERT_SELECT_MINT_PRICE_SUMMARY": "Please select a mint price"
		},
		rewardCard: {
			"ASSOCIATE_REWARD_CARD_IN_BASKET": "You currently have a reward card in your basket; our customers can only have one card per account and therefore you can either: complete the current link, which upon success will remove the card in basket OR abandon the current link and buy the new reward card"
		}
	},
	pluck: {
		review: {
			REGISTER_TO_WRITE_A_REVIEW: "Register to write a review!",
			REGISTER_TO_WRITE_A_COMMENT: 'To leave a comment, you need to <a href="/webapp/wcs/stores/servlet/LogonForm?langId=44&storeId=10151&catalogId=10201&myAcctMain=1&ReviewsURL=">register</a> or <a href="/webapp/wcs/stores/servlet/LogonForm?langId=44&storeId=10151&catalogId=10201&myAcctMain=1&ReviewsURL=">log in</a>.',
			WRITE_REVIEW_HEADING: "Have your say",
			WRITE_REVIEW_TITLE_LABEL: "Title ",
			WRITE_REVIEW_BODY_LABEL: "Review",
			WRITE_REVIEW_BODY_TEXT: "Type your review here...",
			SUBMIT_REVIEW: "Post review",
			SUBMIT_COMMENT: "Post comments",
			WRITE_A_COMMENT: "Add reply",
			RECOMMEND: "Like",
			RECOMMENDED: "Liked",
			REPORT: "Report abuse",
			REPORTED: "Reported",
			REPORT_LABEL: "Report reason",
			REPORT_OPTIONS: "Obscenity/Vulgarity,Hate speech,Personal attack,Advertising/Spam,Copyright/Plagiarism,Other"
		},
		controls: {
			user: {
				ADD_AS_FRIEND: "Add as friend",
				FRIENDSHIP_REQUESTED:  "Requested",
				FRIEND: "Friend"
			},
			pagination: {
				"PREVIOUS": "Prev",
				"NEXT": "Next"
			},
			resultsPerPage: {
				"LABEL": "Show",
				"ALL": "100"
			},
			sortBy: {
				"LABEL": "Sort by",
				"REVIEW_DATE": "Review Date - Now to past",
				"CUSTOMER_RATING": "Customer Rating - High to Low",
				"RECOMMENDATIONS": "Recommendations - High to Low "
			},
			dateTime: {
				"MINUTES": "{0} minutes ago",
				"HOURS": "{0} hours ago",
				"DAYS": "{0} days ago"
			}
		}
	},
	"VIEW_MORE_ELLIPSIS" : "View more...",
	"DELETE_CONFIRMATION" : "Are you sure you want to remove the product?",
	"DELETEADDRESS_CONFIRMATION":"Are you sure you want to remove your address?",
	"DELETEPAYMENT_CONFIRMATION":"This address is used as a billing address of a payment card. Please change the billing address of the payment card before deleting this address.",
	"DELETEDEFAULTPAYMENT_CONFIRMATION":"Are you sure you want to remove your payment card and default address?",
	"DELETECOUPON_CONFIRMATION":"Are you sure you want to remove this coupon?",
	"CANCELORDER_CONFIRMATION":"Are you sure you want to cancel the order?",
	"DELETE_GIFT_MESSAGE":"Are you sure you want to remove the gift message?",
	"DELETE_PAYMENTCARD_MESSAGE":"Are you sure you wish to delete the selected payment card? ",
	"DELETE_FAV_SELLER_CONFIRMATION_MESSAGE":"Are you sure you want to remove this seller?"
}


Salmon.Global.UserContext = {
	MERCHANDISING_ID: ("merch_163867704").replace("%5f","_"),
	USER_TYPE: "R"
};
