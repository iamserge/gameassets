/* This code handles the request to Intelligent Offer for the HomePage*/

App = App || {};
App.Homepage = App.Homepage || {};
App.Homepage.Recommendations = new(function() {
  //Wait until the DOM is loaded before processing. 
  $(document).ready(function() {
    var rec = {
        zoneId: "Home_1",
        categoryId: "_TS_"
      };
      //IO_getRecommendations([rec]); //commented out for defect 4215

  });
});


App.Homepage.CommunityGenerator = function() {
  var pathToFile = '//img.game.co.uk/salmon/newHomepage/community.js',
    $select = $('#chooseFranchise'),
    $franchiseContainer = $('section.community .franchiseContainer'),
    $mainBoxes = $franchiseContainer.find('.mainBoxes'),
    $medBoxes = $franchiseContainer.find('.medBoxes'),
    boxes = {},
    generateBox = function(boxClass, obj) {
      var $box = $('<a />', {
        class: boxClass,
        html: '<span>' + obj.title + '</span><img src="' + obj.img + '" alt="' + obj.title + '" />',
        href: obj.link
      });
      return $box;
    },
    populateBox = function(boxClass, obj) {

      if (typeof boxes[boxClass] == 'undefined') {
        boxes[boxClass] = generateBox(boxClass, obj);
        boxes[boxClass].appendTo((boxClass.indexOf('medBox') == -1) ? $mainBoxes : $medBoxes);
      } else {
        var $box = boxes[boxClass];
        $box.attr('href', obj.link).show();
        $box.find('span').text(obj.title);
        $box.find('img').attr('src', obj.img).attr('alt', obj.title);
      }
      if (obj.img.length === 0) boxes[boxClass].hide();
    },
    populateFranchise = function(franchiseObj) {
      for (var i in franchiseObj.boxes) {
        populateBox(i, franchiseObj.boxes[i]);
      }
    },
    generateInitially = function() {
      var firstFranchise = HomeFranchises[Object.keys(HomeFranchises)[0]];

      for (var i in HomeFranchises) {
        var title = HomeFranchises[i].title;
        $select.append('<option value="' + i + '">' + title + '</option>');
      }
      populateFranchise(firstFranchise);
    },
    setupEvents = function() {
      $select.on('change', function() {
        var franchiseName = $select.val();
        populateFranchise(HomeFranchises[franchiseName]);
      });
    },
    init = function() {
      generateInitially();
      setupEvents();
    };


  if (typeof HomeFranchises == 'undefined') {
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = pathToFile;
    js.onload = function() {
      if (typeof HomeFranchises != 'undefined') init();
    };
    document.body.appendChild(js);
  } else {
    init();
  }
};

if (Salmon.Global.FeatureToggles.getFeature('NewHOMEPAGE')) {
  App.Homepage.CommunityGenerator();
}
