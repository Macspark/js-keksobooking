'use strict';

(function () {
  var ESCAPE_BUTTON = 'Escape';

  var disableElements = function (elem) {
    elem.forEach(function (e) {
      e.setAttribute('disabled', true);
    });
  };

  var enableElements = function (elem) {
    elem.forEach(function (e) {
      e.removeAttribute('disabled');
    });
  };

  var isEsc = function (key) {
    return key === ESCAPE_BUTTON ? true : false;
  };

  window.util = {
    disableElements: disableElements,
    enableElements: enableElements,
    isEsc: isEsc
  };
})();
