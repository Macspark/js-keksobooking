'use strict';

(function () {
  var main = document.querySelector('main');

  var generatePopup = function (tag, customMsg) {
    var template = document.querySelector('#' + tag).content.querySelector('div');
    var fragment = document.createDocumentFragment();
    var popup = template.cloneNode(true);
    var popupMsg = popup.querySelector('.' + tag + '__message');

    if (customMsg) {
      popupMsg.innerText = popupMsg.innerText + '\n' + customMsg;
    }

    fragment.appendChild(popup);
    main.appendChild(fragment);

    var closePopup = function () {
      document.removeEventListener('keydown', onEscDown);
      document.removeEventListener('mousedown', onMouseDownOutside);
      main.removeChild(popup);
    };

    var onMouseDownOutside = function (mouseDownEvt) {
      if (mouseDownEvt.target !== popupMsg && mouseDownEvt.button === 0) {
        closePopup();
      }
    };

    var onEscDown = function (escDownEvt) {
      if (escDownEvt.key === 'Escape') {
        closePopup();
      }
    };

    document.addEventListener('keydown', onEscDown);
    document.addEventListener('mousedown', onMouseDownOutside);
  };

  var onSuccess = function () {
    generatePopup('success');
  };

  var onError = function (errorMsg) {
    generatePopup('error', errorMsg);
  };

  window.popup = {
    success: onSuccess,
    error: onError
  };
})();
