var App = App || {};
App.PDP = App.PDP || {};
App.PDP.Carousel = function() {};

App.PDP.Carousel.prototype.setUpCarousels = function(nodes) {
  /*
   * NB There's quite  bit of CSS in here that should be put into a separate file
   * It has just been done that way to get it done quickly in the first instance.
   **/

  // set up each instance of carousel
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i] || null;

    if (node) {
      for (var j = 0; j < node.children.length; j++) {
        if (node.children[j].className.indexOf('clip') != -1) {
          var clip = node.children[j];
          break;
        }
      }

      if (clip) {
        var list = clip.firstElementChild || clip.firstChild;
        var items = list.children;
        var listWidth = 0;
        var containerWidth = $('#userReviews .pagination').width();
        $(list).css('left', '40px');
        // set widths of elements
        for (var j = 0; j < items.length; j++) {  
          var item = items[j];
          var itemWidth = this.getItemDims(item).itemWidth;
          var itemPaddingLeft = this.getItemDims(item).itemPaddingLeft;
          var itemPaddingRight = this.getItemDims(item).itemPaddingRight;
          var itemBorderLeft = this.getItemDims(item).itemBorderLeft;
          var itemBorderRight = this.getItemDims(item).itemBorderRight;

          $(item).css('width', containerWidth);

          listWidth += (containerWidth + 41); // extra pixel for rounding errors
        }

        $(list).css({
          'width': listWidth + 300,
          'position': 'relative'
        });

        // set up controls
        /* 
         * NB Have removed enable/disable controls for now
         **/
        var controls = $(node).children('.pagination').find('a');
        var listPos = 40;
        var dims = this;

        controls.each(function() {
          $(this).bind(
            'click',
            function(e) {
              e.preventDefault();

              if (this.parentNode.className.indexOf('disabled') == -1) {
                var isTransition = false;

                listWidth = dims.getItemDims(list).itemWidth;

                if (this.parentNode.className.indexOf('previous') != -1) {
                  listPos += containerWidth + 40;
                } else {
                  listPos -= containerWidth + 40;
                }

                // determine whether to use CSS or JS for animation, then apply with vars
                var transTime = 1000; // milliseconds

                if (!window.getComputedStyle) {
                  if (list.currentStyle.transitionProperty) {
                    isTransition = true;
                  }
                } else {
                  if (
                    window.getComputedStyle(list).transitionProperty ||
                    window.getComputedStyle(list).OTransitionProperty ||
                    window.getComputedStyle(list).WebkitTransitionProperty ||
                    window.getComputedStyle(list).MozTransitionProperty
                  ) {
                    isTransition = true;
                  }
                }

                if (isTransition) {
                  // animation with CSS
                  list.style.left = listPos + 'px';
                  list.style.WebkitTransitionProperty = 'left';
                  list.style.WebkitTransitionDuration = transTime / 1000 + 's';
                  list.style.MozTransitionProperty = 'left';
                  list.style.MozTransitionDuration = transTime / 1000 + 's';
                  list.style.transitionProperty = 'left';
                  list.style.transitionDuration = transTime / 1000 + 's';
                } else {
                  // animation with JS
                  $(list).animate({ left: listPos },
                    transTime
                  );
                }

                /*
                 * after movement of carousel elements
                 * reset enable/disable attribute of controls
                 **/
                var controlHolderPrev = controls[0].parentNode;
                var controlHolderNext = controls[1].parentNode;

                console.log(parseInt(listPos,10));

                // enable/disable prev control
                if (parseInt(listPos,10) >= 0) {
                  $(controlHolderPrev).addClass('disabled');
                } else {
                  $(controlHolderPrev).removeClass('disabled');
                }

                /* enable/disable next control
                 * base on position of last item relative to edge of carousel
                 **/
                var lastItemLeft = dims.getItemDims(list.children[list.children.length - 1]).itemLeft;
                var lastItemWidth = dims.getItemDims(list.children[list.children.length - 1]).itemWidth;
                var clipRight = dims.getItemDims(clip).itemRight;

                console.log(lastItemLeft);
                console.log(lastItemWidth);
                console.log(clipRight);

                if (
                  this.parentNode.className.indexOf('next') != -1 &&
                  this.parentNode.className.indexOf('enabled') == -1 &&
                  lastItemLeft - lastItemWidth < clipRight
                ) {
                  $(controlHolderNext).addClass('disabled');
                } else {
                  $(controlHolderNext).removeClass('disabled');
                }
              }
            }
          );
        }); // END controls
      } // END if clip
    }
  }
};

App.PDP.Carousel.prototype.addCarouselItem = function(node) {
  console.log('addCarouselItem!');

  for (var i = 0; i < node.children.length; i++) {
    if (node.children[i].className.indexOf('clip') != -1) {
      var clip = node.children[i];
      break;
    }
  }

  if (clip) {
    var list = clip.firstElementChild || clip.firstChild,
      newItem = list.children[list.children.length - 1],
      lastItem = list.children[list.children.length - 2],
      listWidth = this.getItemDims(list).itemWidth,
      lastItemPaddingLeft = this.getItemDims(lastItem).itemPaddingLeft,
      lastItemPaddingRight = this.getItemDims(lastItem).itemPaddingRight,
      lastItemBorderLeft = this.getItemDims(lastItem).itemBorderLeft,
      lastItemBorderRight = this.getItemDims(lastItem).itemBorderRight,
      lastItemWidth = this.getItemDims(lastItem).itemWidth;

    listWidth += lastItemWidth;

    $(newItem).css('width', lastItemWidth - lastItemPaddingLeft - lastItemBorderRight - lastItemBorderLeft - lastItemPaddingRight);
    $(list).css('width', listWidth);
  }
};

App.PDP.Carousel.prototype.getItemDims = function(item) {
  var itemRect = item.getBoundingClientRect();
  var itemPaddingLeft = parseFloat($(item).css('paddingLeft')) || 0;
  var itemPaddingRight = parseFloat($(item).css('paddingRight')) || 0;
  var itemBorderLeft = parseInt($(item).css('borderLeftWidth'), 10) || 0;
  var itemBorderRight = parseInt($(item).css('borderRightWidth'), 10) || 0;
  var itemLeft = itemRect.left;
  var itemRight = itemRect.right;
  var itemWidth = itemRight - itemLeft;

  return {
    'itemLeft': itemLeft,
    'itemRight': itemRight,
    'itemWidth': itemWidth,
    'itemPaddingLeft': itemPaddingLeft,
    'itemPaddingRight': itemPaddingRight,
    'itemBorderLeft': itemBorderLeft,
    'itemBorderRight': itemBorderRight
  };
};
