// var App = App || {};
// App.ProductLister = App.Global || {};

// /**
//  * The control to allow the user to select how many results per page they wish to view at a time
//  * @class Singleton
//  * @static
//  * @author Adam Silver
//  */
// App.ProductLister.ResultsPerPageChanger = new(function() {


//   function init() {

//     $("#productLister div.resultsPerPage").each(function() {
//       new Changer($(this));
//     });
//   }

//   function Changer($root) {
//     // hide submit
//     var $form = $root.find("form");
//     $root.find("input[type='submit']").remove();
//     $root.find("input[name='pageSize']").bind("click", radio_onClick);

//     function radio_onClick(e) {
//       $form.trigger("submit");
//     }

//   }

//   $(init);
// });
