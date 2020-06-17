'use strict';

(function () {
  var TIMEOUT_IN_MS = 10000;
  var URL = 'https://javascript.pages.academy/keksobooking/data';

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

  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: rgba(255, 86, 53, 0.9);';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = 'Не удалось загрузить объявления. (' + errorMessage + ')';
    document.body.insertAdjacentElement('afterbegin', node);
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
