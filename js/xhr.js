'use strict';

(function () {
  var TIMEOUT_IN_MS = 10000;

  var StatusCode = {
    OK: 200
  };

  window.xhr = function (options, onSuccess, onError) {
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

    xhr.open(options.method, options.url);
    if (options.data) {
      xhr.send(options.data);
    } else {
      xhr.send();
    }
  };
})();
