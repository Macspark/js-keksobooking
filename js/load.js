'use strict';

(function () {
  var TIMEOUT_IN_MS = 10000;
  var URL = 'https://javascript.pages.academy/keksobooking/data';

  var main = document.querySelector('main');
  var offers = [];

  var StatusCode = {
    OK: 200
  };

  var onSuccess = function (data) {
    offers = data;
    offers.forEach(function (elem) {
      window.pin.generate(elem);
      window.map.drawPins(window.pin.fragment);
    });
  };

  var onError = function (message) {
    var errorTemplate = document.querySelector('#error').content.querySelector('div');
    var errorFragment = document.createDocumentFragment();
    var error = errorTemplate.cloneNode(true);

    var errorMsg = error.querySelector('.error__message');
    var errorBtn = error.querySelector('.error__button');
    errorMsg.textContent = message;

    errorFragment.appendChild(error);
    main.appendChild(errorFragment);

    var removeErrorPopup = function () {
      var errorPopup = document.querySelector('main .error');

      document.removeEventListener('keydown', onEscDown);
      document.removeEventListener('mousedown', onMouseDownOutside);

      main.removeChild(errorPopup);
    };

    var onMouseDownOutside = function (evt) {
      if (evt.target !== errorMsg && evt.button === 0) {
        removeErrorPopup();
      }
    };

    var onEscDown = function (evt) {
      if (evt.key === 'Escape') {
        removeErrorPopup();
      }
    };

    document.addEventListener('keydown', onEscDown);
    document.addEventListener('mousedown', onMouseDownOutside);
    errorBtn.addEventListener('click', removeErrorPopup);
  };

  window.load = function () {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open('GET', URL);
    xhr.send();
  };
})();
