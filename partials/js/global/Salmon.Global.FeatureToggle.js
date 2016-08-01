var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.FeatureToggles = new(function() {
  var featureObj = {},
    getFeature = function(featureName) {
      if (typeof featureObj[featureName] != 'undefined') return featureObj[featureName];
    };

  if (typeof Game != 'undefined' && typeof Game.featureToggles != 'undefined') featureObj = Game.featureToggles;
  return {
    getFeature: getFeature
  };
});
