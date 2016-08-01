Salmon.Global.Modal = (function() {
  var $body = $('body'),
    openModal = function(content, id, loader) {

      var loaderHtml = '';

      if (typeof loader !== "undefined" || loader !== false) {
        loaderHtml = '<div class="loader"></div>';
      }
      if (content) {
        var options = {
            // class: 'modal',
            html: '<div class="modalContent">' + loaderHtml + '<span class="closeModal">X</span>' + content + '</div>'
          },
          $modal;

        if (typeof id != 'undefined') options.id = id;

        // var $content = $(content);

        $modal = $('<div />', options);
        $body.append($modal);
        var $modalContent = $modal.find('.modalContent');
        $modalContent.css('top', ((parseInt($(window).height(), 10) - parseInt($modalContent.outerHeight(), 10)) / 2));

        $modal.addClass('opened');

        var $loader = $modal.find('.loader');

        $loader.fadeOut();

        $modal.on('click', function(e) {
          if (e.target !== this && !$(e.target).hasClass('closeModal')) {
            return;
          } else {
            $(this).fadeOut(function() {
              $(this).remove();
            });
          }
        });
      }
    },
    closeModal = function() {
      $('.modal').fadeOut(function() {
        $('.modal').remove();
      });
    };


  return {
    openModal: openModal,
    closeModal: closeModal
  };
})();
