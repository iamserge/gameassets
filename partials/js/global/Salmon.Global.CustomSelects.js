Salmon.Global.CustomSelects = function() {
  var selectClass = "cSelect",
    $selects = $('.' + selectClass),
    generateSelect = function($originalSelect) {
      var $selectContainer = $originalSelect.parent(),
      $optionsNotSelected = $originalSelect.find('option:not(:selected)'),
        $selectedOption = $originalSelect.find('option:selected'),
        $newSelect = $('<ul />', {
          class: "dropdown"
        }),
        $selected = $('<span />', {
          class: "selected",
          text: $selectedOption.text(),
          'data-value': $selectedOption.val()
        }),
        title = $originalSelect.data('title'),
        clicked = false;

      $optionsNotSelected.each(function() {
        var $option = $(this);
        $newSelect.append('<li data-value="' + $option.val() + '">' + $option.text() + '</li>');
      });
      if (typeof title !== 'undefined') $selectContainer.append('<span>' + title + '</span>');
      $selectContainer.append($selected);
      $selectContainer.append($newSelect);
      $originalSelect.hide();


      $selectContainer.on('click tap', '.dropdown li', function() {
        var $currentOption = $(this),
          title = $currentOption.text(),
          val = $currentOption.data('value');

        clicked = true;
        $newSelect.append('<li data-value="' + $selected.data('value') + '">' + $selected.text() + '</li>');
        $selected.text(title).removeClass('active').data('value', val);
        $currentOption.remove();
        $originalSelect.val(val);
        $originalSelect.trigger('change');
        $newSelect.slideUp('fast', function() {
          clicked = false;
        });
      });



      $selectContainer.on('click tap', function() {
        if (clicked === false) {
          if ($selected.hasClass('active')) {
            $newSelect.slideUp('fast');
            $selected.removeClass('active');
          } else {
            $newSelect.slideDown('fast');
            $selected.addClass('active');
          }
        }
      });
    };



  $selects.each(function() {
    generateSelect($(this));
  });
};
