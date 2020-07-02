'use strict';

(function () {
  var LOAD_PATH = 'keksobooking/data';
  var MAIN_PIN_OFFSET_X = 32;
  var MAIN_PIN_OFFSET_Y = 80;
  var MapSize = {
    MIN_X: 0,
    MAX_X: 1200,
    MIN_Y: 130,
    MAX_Y: 630
  };

  var offersList = [];

  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapMainPin = document.querySelector('.map__pin--main');
  var mapMainPinDefaultPosition = {
    x: mapMainPin.style.left,
    y: mapMainPin.style.top
  };
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  var inactive = true;

  var lockMap = function () {
    inactive = true;
    map.classList.add('map--faded');
    window.filter.lock();
  };

  var unlockMap = function () {
    map.classList.remove('map--faded');
  };

  var isMapFaded = function () {
    return map.classList.contains('map--faded');
  };

  var getMainPinCoordinates = function () {
    var x = parseInt(mapMainPin.style.left, 10);
    var y = parseInt(mapMainPin.style.top, 10);

    if (window.map.isMapFaded()) {
      var cx = Math.floor(mapMainPin.offsetWidth / 2);
      var cy = Math.floor(mapMainPin.offsetHeight / 2);
      x = x + cx;
      y = y + cy;
    } else {
      x = x + MAIN_PIN_OFFSET_X;
      y = y + MAIN_PIN_OFFSET_Y;
    }
    return {
      x: x,
      y: y
    };
  };

  var onEscDown = function (evt) {
    if (evt.key === 'Escape') {
      removeCard();
    }
  };

  var drawCard = function (fragment) {
    map.insertBefore(fragment, mapFiltersContainer);
    document.addEventListener('keydown', onEscDown);
  };

  var removeCard = function () {
    var card = map.querySelector('.popup');
    if (card) {
      document.removeEventListener('keydown', onEscDown);
      map.removeChild(card);
    }
    window.pins.removeActiveClass();
  };

  var onEnterDown = function (evt) {
    if (evt.key === 'Enter') {
      setActiveState();
    }
  };

  var setActiveState = function () {

    var onSuccess = function (data) {
      offersList = data;
      window.filter.init(offersList, mapPins);
      window.filter.unlock();
    };

    var onError = function (errorMsg) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: rgba(255, 86, 53, 0.9);';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';

      node.textContent = 'Не удалось загрузить объявления (' + errorMsg + ')';
      document.body.insertAdjacentElement('afterbegin', node);
    };

    window.xhr({
      method: 'GET',
      path: LOAD_PATH
    }, onSuccess, onError);

    unlockMap();
    window.form.unlock();
    mapMainPin.removeEventListener('keydown', onEnterDown);
    inactive = false;
  };

  mapMainPin.addEventListener('keydown', onEnterDown);
  mapMainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (evt.button === 0) {

      if (inactive) {
        setActiveState();
      }

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        var finalCoords = {
          x: (mapMainPin.offsetLeft - shift.x),
          y: (mapMainPin.offsetTop - shift.y)
        };

        if (finalCoords.x >= (MapSize.MIN_X - MAIN_PIN_OFFSET_X) && finalCoords.x <= (MapSize.MAX_X - MAIN_PIN_OFFSET_X)) {
          mapMainPin.style.left = finalCoords.x + 'px';
        }

        if (finalCoords.y >= (MapSize.MIN_Y - MAIN_PIN_OFFSET_Y) && finalCoords.y <= (MapSize.MAX_Y - MAIN_PIN_OFFSET_Y)) {
          mapMainPin.style.top = finalCoords.y + 'px';
        }
        window.form.setAddress();
      };

      var onMouseUp = function () {
        window.form.setAddress();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  });

  var removePins = function () {
    var pinsOnMap = mapPins.querySelectorAll('.map__pin');
    for (var i = 1; i < pinsOnMap.length; i++) {
      pinsOnMap[i].remove();
    }
  };

  var resetMap = function () {
    clearMap();
    mapMainPin.style.left = mapMainPinDefaultPosition.x;
    mapMainPin.style.top = mapMainPinDefaultPosition.y;
    lockMap();
  };

  var clearMap = function () {
    removePins();
    removeCard();
  };

  lockMap();

  window.map = {
    reset: resetMap,
    clear: clearMap,
    isMapFaded: isMapFaded,
    getMainPinCoordinates: getMainPinCoordinates,
    drawCard: drawCard,
    removeCard: removeCard,
    removePins: removePins
  };
})();
