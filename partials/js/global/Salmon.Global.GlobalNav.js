var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};

/**
 * Global navigation drop down menu for the categories
 * @author Steve Uprichard
 * @name GlobalNav
 * @class Singleton
 * @static
 * @constructor
 * @memberOf Salmon.Global
 * @requires 
 * 	jQuery1.3.1.js
 * 	<br/>Adoro.DropDownMenu.js
 */
Salmon.Global.GlobalNav = new(function() {
  $(init);

  /**
   * Once the DOM is ready create a new instance of Adoro.DropDownMenu
   * @name init
   * @function
   * @private
   */
  function init() {


    var ul = document.getElementById("globalNav");
    if (!ul) return;
    // the "off" cssClass will hide the elements off screen
    // do not change this for an equivalent display: none hiding as the keyboard accessibility will break
    var dropDownMenu = new Adoro.DropDownMenu(ul, { cssHideClass: "off", subMenuType: "div", delay: 0 });
  }
});
