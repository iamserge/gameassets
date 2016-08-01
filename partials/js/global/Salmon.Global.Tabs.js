var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};
Salmon.Global.Tabs = Salmon.Global.Tabs || {};


/**
 * Tabbing component. 
 * @fileOverview Salmon Tabs
 * @author Steve Uprichard
 * @name Tabs
 * @class (singleton) Represents the tabbing component
 * @static
 * @constructor
 * @memberOf Salmon.Global
 * @requires jQuery1.3.1.js
 */
Salmon.Global.Tabs = function(container, options) {

  var options = options || {},
    activeTab = null,
    tabs = null,
    config = {
      tabActiveClass: options.tabActiveClass || "active",
      hidePanelClass: options.hidePanelClass || "off",
      panelClass: options.panelClass || "panel",
      selectedTabIndex: options.selectedTabIndex || 0
    };

  init();
  return tabs;

  function init() {
    for (var i = 0; i < container.length; i++) {
      var tabSet = [];
      tabs = $(container[i]).find("ul.tabs li");
      if (tabs.length > 0) {
        var activeTabs = tabs.filter(".active");

        tabs.each(function(idx) {
          if ($(this).hasClass(config.tabActiveClass) || (activeTabs.length === 0 && idx === 0)) {
            config.selectedTabIndex = idx;
          }
          $(this).find("> a").each(function() {
            tabSet.push(new Tab(this));
          });
        });
        var tc = new tabController(tabSet);
        $("." + config.panelClass).addClass(config.hidePanelClass);
        tc.click(config.selectedTabIndex);
      }
    }
  }

  function tabController(tabs) {
    for (var i = 0; i < tabs.length; i++) {
      $(tabs[i].anchor).bind("click", function(x) {
        return function() {
          if (activeTab !== null)
            activeTab.setInactive();
          tabs[x].setActive();
          activeTab = tabs[x];
          return false;
        };
      }(i));
    }

    function click(index) {
      $(tabs[index].anchor).trigger("click");
    }

    this.click = click;
  }

  function Tab(tab) {

    var state = null,
      anchor = tab;

    function setActive() {
      if (this.state === null) {
        $(this.anchor).parent().addClass(config.tabActiveClass);
        this.state = config.tabActiveClass;
        var panel = this.anchor.href.split("#")[1];
        $("#" + panel).removeClass(config.hidePanelClass);
      }
    }

    function setInactive() {
      if (this.state === config.tabActiveClass) {
        $(this.anchor).parent().removeClass(config.tabActiveClass);
        this.state = null;
        var panel = this.anchor.href.split("#")[1];
        $("#" + panel).addClass(config.hidePanelClass);
      }
    }

    this.anchor = anchor;
    this.state = state;
    this.setActive = setActive;
    this.setInactive = setInactive;
    return this;
  }
};
