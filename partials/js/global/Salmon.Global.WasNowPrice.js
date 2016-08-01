Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};

Salmon.Global.WasNowPrice = new(function() {
  var url = (window.location.hostname.indexOf('oat.') == -1) ? '//powerup.game.co.uk/tradeinpricechecker/Home/GetWasNowPrices/' : '//powerup.oat.game.co.uk/tradeinpricechecker/Home/GetWasNowPrices/',
    makeRequest = function() {

      $.ajax({
        url: url + '/' + $('input[name="wasNowParams"]').val(),
        type: "GET",
        dataType: "jsonp",
        jsonpCallback: "Salmon.Global.WasNowPrice.responseSuccess"
      });
    },
    processRequest = function(json) {
      for (var i in json.skus) {
        var sku = json.skus[i],
          $placeholders = $('.WasNow' + sku.sku),
          content = '';

        content += '<span class="was">Was </span>';
        content += '<span class="wasPrice">&pound;' + sku.wasPrice + ' </span>';
        content += '<span class="wasFromDate">' + sku.wasFromDate.split(' ')[0] + '</span>';
        content += '<span class="wasHyphen"> - </span>';
        content += '<span class="wasToDate">' + sku.wasToDate.split(' ')[0] + '</span></li>';

        $placeholders.each(function() {
          $(this).show()
            .html(content);
        });




      }
    },
    init = function() {
      makeRequest();
      //var response = '{"skus":[{"sku":9998011,"wasPrice":129.99000,"nowPrice":99.99000,"wasFromDate":"30/09/2013 14:17:00","wasToDate":"23/09/2014 11:45:00"},{"sku":9998012,"wasPrice":89.99000,"nowPrice":50.00000,"wasFromDate":"05/03/2014 16:49:00","wasToDate":"23/09/2014 11:45:00"}]}';

      //processRequest(JSON.parse(response));
    };

  this.responseSuccess = function(json) {
    processRequest(json);
  };

  if (Game && Game.CurrentPage && Game.CurrentPage.PageName == 'pdp') $(init);

});
