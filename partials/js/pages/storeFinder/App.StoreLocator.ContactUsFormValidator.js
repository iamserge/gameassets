var App = App || {};
App.StoreLocator = App.StoreLocator || {};

App.StoreLocator.ContactUsFormValidator = new (function() {
	
$(init);
	
	var formNode = null,
		$formNode = null,
		fv = null;
	
	function init() {
		formNode = document.getElementById("contactUs");
		$formNode = $(formNode);
		if(!formNode) return;
		fv = new Adoro.FormValidator(formNode);
		setupValidators();
		setupFormSubmit();
		setupFieldFocus();
		setupEnter();
	}
	
	function setupEnter() {
		$formNode.find("input").bind("keydown", function(e) {
			if (e.keyCode === 13) {
				$formNode.find("div.helpHint").hide();
			}
		});
	}
	
	function setupFieldFocus() {
		$("form div.field input").bind("focus", function(e) {
			var $divField = $(this).parents("div.field");
			$divField.find("div.errorMessage").remove();
			$divField.removeClass("fieldError");
			$divField.removeClass("fieldSuccess");
		});
	}
	
	function setupValidators() {
		
		fv.addValidator("reasonForContact", [{
			method: Adoro.FormRules.notEmpty,
			messages: ["Required", "Please select a reason for contact"]
		}]);
		App.Global.Forms.Validation.Helpers.createBasicField(fv, $formNode, "reasonForContact");
		
		
		fv.addValidator("email1", [{
			method: Adoro.FormRules.notEmpty,
			messages: ["Required", "Please enter your email address"]
		}, {
			method: Adoro.FormRules.emailAddress,
			messages: ["Invalid", "The email address is invalid"]
		}]);
		App.Global.Forms.Validation.Helpers.createBasicField(fv, $formNode, "email1");
	
		
		fv.addValidator("firstName", [{
			method: Adoro.FormRules.notEmpty,
			messages: ["Required", "Please enter your first name"]
		}, {
			method: Adoro.FormRules.oneLetter,
			messages: ["Invalid", "Please enter a valid first name"]
		}]);
		App.Global.Forms.Validation.Helpers.createBasicField(fv, $formNode, "firstName");
		
		
		fv.addValidator("lastName", [{
			method: Adoro.FormRules.notEmpty,
			messages: ["Required", "Please enter your last name"]
		}, {
			method: Adoro.FormRules.oneLetter,
			messages: ["Invalid", "Please enter a valid last name"]
		}]);
		App.Global.Forms.Validation.Helpers.createBasicField(fv, $formNode, "lastName");
		
		fv.addValidator("preferredCommunication", [{
			method: Adoro.FormRules.notEmpty,
			messages: ["Required", "Please select your preferred method of communication"]
		}]);
		App.Global.Forms.Validation.Helpers.createBasicField(fv, $formNode, "preferredCommunication");
		
		fv.addValidator("contactMessage", [{
			method: Adoro.FormRules.notEmpty,
			messages: ["Required", "Please enter a message"]
		}, {
			method: Adoro.FormRules.oneLetter,
			messages: ["Required", "Please enter a message"]
		}]);
		App.Global.Forms.Validation.Helpers.createBasicField(fv, $formNode, "contactMessage");
	}
	
	function setupFormSubmit() {		
		fv.addEventHandler("onFormValidateStart", function() {
			var $errorSummary = $("#errorSummary");
			App.Global.Forms.Validation.Helpers.clearErrorSummary($errorSummary);
		});
		
		fv.addEventHandler("onFormFail", function(e, fv, errors) {
			var $errorSummary = $("#errorSummary");
			App.Global.Forms.Validation.Helpers.generateErrorSummary($errorSummary, errors);
		});
		
		$formNode.bind("submit", function(e) {
			return fv.validate();
		});
	}
	
});