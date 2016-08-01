var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.Widgets = Salmon.Global.Widgets || {};
Salmon.Global.Widgets.BalanceChecker = (function() {
  var storeId,
    requestUrl = '/webapp/wcs/stores/servlet/AjaxRewardCardWidgetView?storeId=',
    widgetObj = function($widget) {
      var init = function() {
          getWidgetHtml();
        },
        getWidgetHtml = function() {
          storeId = ($('input[name="storeId"]').val().length > 0) ? $('input[name="storeId"]').val() : '10151';
          $.getJSON(requestUrl + storeId, function(json) {
            $widget.html(json.rewardCardHtml);
          });
        };
      init();
    };

  $(document).ready(function() {
    $('.rewardWidget').each(function() {
      var widget = new widgetObj($(this));
    });
  });
})();
