// var App = App || {};
// App.ProductLister = App.ProductLister || {};

// App.ProductLister.Bundles = new(function() {
//   var $productList = null,
//     $forms = null,
//     $summary = null,
//     $builder = null;

//   $(init);

//   function init() {
//     $productList = $("div.product", "#productLister");
//     $forms = $productList.find("form");

//     setupBundleProductRemove();
//     setupBundleProductItems();
//     setupBundleProductSelectBtn();
//   }

//   function setupBundleProductSelectBtn() {
//     var BundleProductSelectBtnArray = $('div#productLister').find('a.buy');

//     $(BundleProductSelectBtnArray).each(function() {
//       $(this).bind('click', function() {
//         $(this).css({
//           backgroundPosition: '0 -33px'
//         });
//       });
//     })
//   }

//   function setupBundleProductRemove() {
//     var removeLinks = $("#bundleSummaryItems").find("a.remove");
//     for (i = 0; i < removeLinks.length; i++) {
//       $(removeLinks[i]).bind("click", function() {
//         var checkbox = $("#bundlizerListUpdate_" + $(this).attr("rel")).find("input[type='checkbox']").get(0);
//         if (checkbox) {
//           checkbox.checked = false;
//           $(checkbox).trigger("click")
//           checkbox.checked = false;
//         }
//         return false;
//       })
//     }
//   }

//   function setupBundleProductItems() {
//     for (i = 0; i < $forms.length; i++) {
//       new BundleProductItem($forms[i]);
//     }
//   }

//   BundleProductItem = function(form) {
//     console.log("logging: bun59");
//     var $form = $(form),
//       $submitButton = $(form).find("input[type='submit']"),
//       $checkbox = $(form).find("input[type='checkbox']"),
//       $message = null;

//     init();

//     function init() {
//       console.log("logging: bun68");
//       $submitButton.addClass("hide");
//       $checkbox.bind("click", updateBundle)
//     }

//     function updateBundle(event) {
//       console.log("logging: bun74");
//       var url = $form.find("input[name='addToBundleAJAXURL']").val(),
//         data = $form.serialize();

//       $.ajax({
//         url: url,
//         data: data,
//         dataType: "json",
//         success: function(response) {
//           if (response) {
//             showConfirmationMessage(($checkbox.get(0).checked) ? response.productAddedHtml : response.productRemovedHtml);
//             updateBundleSummaryItems(response.messageHtml);
//             updateBundleBuilder(response.summaryHtml);
//           }

//           $(this).removeAttr("readonly");
//         }
//       });
//     }

//     function showConfirmationMessage(html) {
//       console.log("logging: bun95");
//       if (!$message) {
//         $message = $("<div />", { "class": "bundleConfirmation" }).hide();
//         $form.append($message);
//       }

//       $message.html(html).stop().fadeIn().delay(3000).fadeOut();
//     }

//     function updateBundleSummaryItems(html) {
//       console.log("logging: bun105");
//       var summaryItems = document.getElementById("bundleSummaryItems");
//       if (summaryItems) {
//         $(summaryItems).replaceWith(html);
//       } else {
//         $("#productLister").prepend($(html))
//       }
//       setupBundleProductRemove();
//     }

//     function updateBundleBuilder(html) {
//       console.log("logging: bun116");
//       var bundleBuilder = document.getElementById("bundleBuilder");
//       if (bundleBuilder) {
//         $(bundleBuilder).replaceWith(html);
//       } else {
//         $("#productLister").after($(html));
//       }
//     }
//   }
// });
