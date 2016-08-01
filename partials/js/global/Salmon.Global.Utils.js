Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};

Salmon.Global.ipaddress = null;

Salmon.Global.PrintPage = new(function() {
  init();

  function init() {
    $(document).ready(function() {


      if ($('.printLink').length > 0) {
        if ($('.printLink').find('a').length > 0) {
          $('.printLink').find('a').bind('click', function() {
            window.print();
          });
        }
      }
    });
  }
});

Salmon.Global.CreateCookie = function(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  } else expires = "";
  document.cookie = name + "=" + value + expires + "; path=/";
};

Salmon.Global.ReadCookie = function(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

Salmon.Global.ReadCookieStartsWith = function(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    var isMatch = c.match(nameEQ);
    if (isMatch !== null) {
      return c.substring(isMatch[0].length, c.length);
    }
  }
  return null;
};

Salmon.Global.EraseCookie = function(name) {
  Salmon.Global.CreateCookie(name, "", -1);
};

Salmon.Global.SearchReferrer = new(function() {
  $(document).ready(function() {
    var referrers = {
      local: { url: "/localhost/", qs: "p" },
      google: { url: "/^http:\/\/(\w+\.)?google\.", qs: "q" },
      yahoo: { url: "/^http:\/\/(\w+\.)?yahoo\.", qs: "p" },
      bing: { url: "/^http:\/\/(\w+\.)?bing\.", qs: "q" }
    };

    for (var search in referrers) {
      if (document.referrer.search(referrers[search].url) != -1 && document.referrer.indexOf("?") != -1) {
        var loc = document.referrer;
        var qs = loc.substring(loc.search(referrers[search].qs + "="), loc.length);
        var cutPoint = qs.indexOf("&") == -1 ? qs.length : qs.indexOf("&");
        qs = qs.substring((referrers[search].qs.length + 1), cutPoint);
        Salmon.Global.CreateCookie("SALMON_EXT_SEARCH", qs);
        break;
      }
    }
  });
});

Salmon.Global.AnimateScrollTo = (function(node) {
  if (!node) return;
  var $node = $(node);

  if ($node.length > 0) {
    $("body, html").animate({ scrollTop: $($node[0]).offset().top });
  }
});

/* 
 * this is specific to the lister page - 
 * should be made more generic as below
 **/
Salmon.Global.Truncator = (function(node, options) {
  $(node).find('a').each(function() {
    // find if there is overflow content
    // use the parent div because it has a min height set on it
    var rect = this.parentNode.getBoundingClientRect();
    var maxHeight = rect.bottom - rect.top;

    // if so make a duplicate of the content and truncate it
    if (this.scrollHeight > maxHeight + 2) {
      var truncNode = this.cloneNode(true);
      truncNode.className += ' truncated';
      this.className += ' full';
      this.parentNode.appendChild(truncNode);

      while (truncNode.scrollHeight > maxHeight + 2) {
        if (truncNode.textContent) {
          truncNode.textContent = truncNode.textContent.substr(0, truncNode.textContent.length - 1);
        } else {
          truncNode.innerText = truncNode.innerText.substr(0, truncNode.innerText.length - 1);
        }
      }

      if (truncNode.textContent) {
        truncNode.innerHTML = truncNode.textContent.substr(0, truncNode.textContent.length - 5) + ' &#8230;';
      } else {
        truncNode.innerHTML = truncNode.innerText.substr(0, truncNode.innerText.length - 5) + ' &#8230;';
      }
    }
  });
});

/* 
 * more generic text truncator
 **/
Salmon.Global.TextTruncator = (function(nodes, options) {
  $(nodes).each(function() {
    // find if there is overflow content
    var rect = this.getBoundingClientRect();
    var maxHeight = rect.bottom - rect.top;
    var truncateLen = 5;
    var extraChars = '';

    // if so truncate it
    if (this.scrollHeight > maxHeight + 2) { // allow a couple of extra pixels for browser rounding errors
      while (this.scrollHeight > maxHeight + 2) {
        if (this.textContent) {
          this.textContent = this.textContent.substr(0, this.textContent.length - 1);
        } else {
          this.innerText = this.innerText.substr(0, this.innerText.length - 1);
        }
      }

      if (options && options.extraChars) {
        truncateLen += options.extraChars.length;

        for (var i = 0; i < options.extraChars.length; i++) {
          extraChars += options.extraChars[i];
        }
      }

      if (this.textContent) {
        this.innerHTML = this.textContent.substr(0, this.textContent.length - truncateLen) + ' &#8230;' + extraChars;
      } else {
        this.innerHTML = this.innerText.substr(0, this.innerText.length - truncateLen) + ' &#8230;' + extraChars;
      }
    }
  });
});

Salmon.Global.ButtonTrigger = (function(input, button) {
  if (!input || !button) return;

  var $input = $(input),
    $button = $(button);

  init();

  function init() {
    $input.bind("keydown", function(event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        $button.trigger("click");
      }
    });
  }
});

Salmon.Global.FixedFooter = (new function() {
  var fixedFooter,
    fixedSocial,
    footerHeight,
    socialHeight;

  $(init);

  function init() {
    fixedFooter = document.getElementById("footerFixedWrapper") || null;
    fixedSocial = document.getElementById("socialMyGamestation") || null;

    if (!fixedFooter | !fixedSocial) return;

    var ua = navigator.userAgent,
      isAndroidOrIDevice = /iPad/i.test(ua) || /iPhone/i.test(ua) || /iPod/i.test(ua) || /Android/i.test(ua);

    if (isAndroidOrIDevice) {
      setHeights();
      positionFooter();
      bindEvents();
    }
  }

  function setHeights() {
    footerHeight = $(fixedFooter).outerHeight();
    socialHeight = $(fixedSocial).outerHeight();
  }

  function bindEvents() {
    $("body").bind("touchend", function(e) {
      e.preventDefault();
      setTimeout(function() {
        positionFooter();
      }, 100);
    });

    var orientationEvent = ("orientationchange" in window) ? "orientationchange" : "resize";
    $(window).bind(orientationEvent, function() {
      setTimeout(function() {
        positionFooter();
      }, 100);
    });
  }

  function positionFooter() {
    var screenHeight = window.innerHeight;
    $(fixedFooter).css({
      "bottom": "auto",
      "left": 0,
      "position": "absolute",
      "top": (window.scrollY + screenHeight - footerHeight) + "px"
    });

    $(fixedSocial).css({
      "bottom": "auto",
      "position": "absolute",
      "right": 0,
      "top": (window.scrollY + screenHeight - socialHeight) + "px"
    });
  }
});
