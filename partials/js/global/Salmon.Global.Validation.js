Salmon.Global.Validation = (function() {

  var config = {
      defaultValidators: {
        'email': function(val) {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
        },
        'postcode': function(val) {
          return /^[A-Z]{1,2}[0-9R][0-9A-Z]? ?[0-9][ABD-HJLNP-UW-Z]{2}$/.test(val.replace(/ /g, '').toUpperCase());
        },
        'password': function(val) {
          return /^(?=(.*[a-z]){1,})(?=(.*[\d]){1,}).{6,}$/.test(val);
        },
        'passwordMatch': function(arr) {
          return arr[0] === arr[1];
        },
        'phone': function(val) {
          return /^(?=.*[0-9])[- +()0-9]+$/.test(val);
        }
      }
    },

    Validation = function($el, options) {
      this.$el = $el;
      this.options = $.extend({}, config, options);

      if (options.hasOwnProperty('ajaxFields')) this.validateAjax(options.ajaxFields);
    };


  var proto = Validation.prototype;


  proto.insertErrorMessage = function($field, message) {
    var fieldName = $field.attr('name'),
      $errorMessage = $('<span />', {
        class: "fieldError",
        text: message,
        'data-for': fieldName
      });
    if (typeof this.options.addErorMessageToParent !== 'undefined' && this.options.addErorMessageToParent === true)
      $field.parent().append($errorMessage);
    else
      $field.after($errorMessage);
  };

  proto.manageErrorMessage = function($field, message) {

    var self = this,
      fieldName = $field.attr('name'),
      $errorMessage = $('.fieldError[data-for="' + fieldName + '"]');

    if (message) {
      if ($errorMessage.length === 0) {
        self.insertErrorMessage($field, message);
        $field.addClass('errorInput');
      } else {
        $errorMessage.text(message);

      }

    } else {
      if (!$field.hasClass('ajaxFail')) {
        $field.removeClass('errorInput');
        $errorMessage.fadeOut(function() {
          $errorMessage.remove();
        });
      }
    }
  };

  proto.validateSpecialRule = function($field) {
    var self = this,
      // $errorMessage = $('.fieldError[data-for="' + fieldName + '"]'),
      fieldName = $field.attr('name'),
      fieldValue = $field.val(),
      errorMessage = '';

    if (self.options.specificValidationRules && typeof self.options.specificValidationRules[fieldName] != 'undefined') {
      for (var i in self.options.specificValidationRules[fieldName]) {
        var ruleObj = self.options.specificValidationRules[fieldName][i],
          rule = (typeof ruleObj.rule == 'function') ? ruleObj.rule : self.options.defaultValidators[ruleObj.rule],
          additionalField = self.options.specificValidationRules[fieldName][i].additionalField;
        if (additionalField !== undefined) {
          fieldValue = [fieldValue, $("#" + additionalField).val()];
        }

        try {
          if (!ruleObj.ajax) {
            if (!rule(fieldValue)) {
              errorMessage = ruleObj.errorMessage;
              break;
            }
          } else {
            if (!rule(fieldValue)) {
              errorMessage = ruleObj.errorMessage;
              break;
            }
          }

        } catch (err) {
          console.log('Cannot find specification for default rule "' + rule + '"');
        }


      }
    }

    return errorMessage;
  };


  proto.validateField = function($field) {

    var self = this,
      errorMessage = '',
      fieldName = $field.attr('name'),
      // fieldValue = $field.val(),
      isRequired = $field.hasClass('required') || $field.parent().hasClass('required') || $field.parent().parent().hasClass('required'),
      isAjaxLoading = $field.hasClass('loading'),
      isValueNull = ($field.val().length === 0 || $field.val() == -1 || $field.val() == 'noSelection' || $field.val() == ' '),
      fieldTitle = (typeof $field.attr('placeholder') != 'undefined') ? $field.attr('placeholder') : $field.parent().parent().find('label[for="' + fieldName + '"]').text();
    if (fieldTitle.length === 0) fieldTitle = $field.parent().parent().find('.indicator label').text();
    fieldTitle = fieldTitle.replace('(required)', '');
    fieldTitle = fieldTitle.replace(':', '');


    if (isAjaxLoading) {
      $field.on('ajaxSuccess', function() {
        self.validateField($field);
      });
      return false;
    }

    if (isRequired && isValueNull)
      errorMessage = ((typeof $field.data('validationname') != "undefined") ? $field.data('validationname') : fieldTitle) + ' is required';
    else
      errorMessage = self.validateSpecialRule($field);


    if (typeof ajax == 'undefined') self.manageErrorMessage($field, errorMessage);

    return (!errorMessage) ? true : false;
  };

  proto.validateFields = function($fields) {
    var self = this,
      valid = true;

    $fields.each(function() {
      var $field = $(this),
        isVisible = $field.is(':visible');

      //If some field before was not valid, we dont want to change valid variable as well as we dont want to validate hidden fields
      if (isVisible) valid = (self.validateField($field) && valid) ? true : false;
    });
    if (this.$el.find('.fieldError').length > 0) valid = false;
    return valid;
  };

  proto.validateAjax = function(ajaxRules) {
    var self = this;
    for (var key in ajaxRules) {
      var rule = ajaxRules[key],
        $field = self.$el.find('[name="' + key + '"]'),
        sendRequest = function() {
          $field.addClass('loading');
          $field.removeClass('ajaxFail').removeClass('ajaxSuccess');
          $.get(rule.url + '?' + rule.requestKey + '=' + $field.val(), {}, function(res) {
            $field.removeClass('loading');
            if (JSON.parse(res)[rule.responseKey] == rule.requiredResponse) {
              self.manageErrorMessage($field);
              $field.addClass('ajaxSuccess');
            } else {
              $field.addClass('ajaxFail');
              self.manageErrorMessage($field, rule.errorMessage);
            }
            $field.trigger('ajaxReturned');
          });
        };

      $field.on('blur', function() {

        if (self.validateField($field, true)) sendRequest();
      });
    }
  };

  proto.setupChangeEvents = function($fields) {
    var self = this;
    // var isAjax = self.options.hasOwnProperty('ajaxFields');
    $fields.each(function() {
      var $field = $(this);

      $field.on('change', function() {
        self.validateField($field);
      });


    });
  };
  proto.extendRules = function(extendedRules) {
    var self = this;
    for (var i in extendedRules) {
      if (typeof self.options.specificValidationRules[i] != "undefined") {
        self.options.specificValidationRules[i] = self.options.specificValidationRules[i].concat(extendedRules[i]);
      } else {
        self.options.specificValidationRules[i] = extendedRules[i];
      }
    }
  };
  proto.validate = function(extendedRules, dontScrollToFields) {
    var self = this;
    if (typeof extendedRules != "undefined") {
      self.extendRules(extendedRules);
    }
    if (self.$el.is('form, div, section')) {

      var $fields = self.$el.find('*[data-validate="true"]');
      if (!self.validateFields($fields)) {
        self.setupChangeEvents($fields);
        self.$el.find('.errorInput').eq(0).focus();
        if (!dontScrollToFields) $("html, body").animate({ scrollTop: self.$el.find('.fieldError').eq(0).offset().top - 150 });
        return false;
      } else {
        return true;
      }
    } else if (self.$el.is('input, select, textarea')) {
      return self.validateField(self.$el);
    }

  };

  proto.showErrorMessage = function(fieldName, errorMessage) {
    var self = this;
    self.manageErrorMessage($('input[name="' + fieldName + '"]'), errorMessage);
  };


  proto.hideErrorMessage = function(fieldName) {
    var self = this;
    self.manageErrorMessage($('input[name="' + fieldName + '"]'));
  };


  proto.validateOnClick = function($el) {
    var self = this;
    $el.on('click', function(e) {
      if (!self.validate()) e.preventDefault();
    });
  };


  return Validation;
})();
