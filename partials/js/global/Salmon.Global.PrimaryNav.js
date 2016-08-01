var Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};

/**
 * Primary navigation drop down menu for the categories
 * @author Adam Silver
 * @name PrimaryNav
 * @class Singleton
 * @static
 * @constructor
 * @memberOf Salmon.Global
 * @requires 
 * 	jQuery1.3.1.js
 * 	<br/>Adoro.DropDownMenu.js
 */
Salmon.Global.PrimaryNav = new(function() {
  $(init);

  /**
   * Once the DOM is ready create a new instance of Adoro.DropDownMenu
   * @name init
   * @function
   * @private
   */
  function init() {
    var ul = $("#primaryNav ul").get(0);
    if (!ul) return;
    // the "off" cssClass will hide the elements off screen
    // do not change this for an equivalent display: none hiding as the keyboard accessibility will break
    var dropDownMenu = new Adoro.DropDownMenu(ul, { cssHideClass: "off", subMenuType: "div" });
  }
});
