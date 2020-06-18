'use strict';

(function () {
  var MAIN_PIN_OFFSET_X = 32;
  var MAIN_PIN_OFFSET_Y = 80;
  var MAP_SIZE = {
    minX: 0,
    maxX: document.querySelector('.map__pins').offsetWidth,
    minY: 130,
    maxY: 630
  };

  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapMainPin = document.querySelector('.map__pin--main');
  var mapMainPinDefaultPosition = {
    x: mapMainPin.style.left,
    y: mapMainPin.style.top
  };

  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFiltersSelects = document.querySelectorAll('.map__filters select');
  var mapFiltersInputs = document.querySelectorAll('.map__filters input');

  var inactive = true;

  var lockMap = function () {
    inactive = true;
    map.classList.add('map--faded');
    mapFilters.classList.add('map__filters--disabled');
    window.util.disableElements(mapFiltersSelects);
    window.util.disableElements(mapFiltersInputs);
  };

  var unlockMap = function () {
    mapFilters.classList.remove('map__filters--disabled');
    window.util.enableElements(mapFiltersSelects);
    window.util.enableElements(mapFiltersInputs);

    document.querySelector('.map').classList.remove('map--faded');
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

  var getRandomLocation = function () {
    return {
      x: window.util.getRandomNumber(MAP_SIZE.minX, MAP_SIZE.maxX),
      y: window.util.getRandomNumber(MAP_SIZE.minY, MAP_SIZE.maxY)
    };
  };

  var drawPins = function (fragment) {
    mapPins.appendChild(fragment);
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
    var card = document.querySelector('.map .popup');
    if (card) {
      document.removeEventListener('keydown', onEscDown);
      map.removeChild(card);
    }
  };

  var onEnterDown = function (evt) {
    if (evt.key === 'Enter') {
      setActiveState();
    }
  };

  var setActiveState = function () {

    var onSuccess = function (data) {
      data.forEach(function (elem) {
        window.pin.generate(elem);
        drawPins(window.pin.fragment);
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

    window.load(onSuccess, onError);

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

        if (finalCoords.x >= (MAP_SIZE.minX - MAIN_PIN_OFFSET_X) && finalCoords.x <= (MAP_SIZE.maxX - MAIN_PIN_OFFSET_X)) {
          mapMainPin.style.left = finalCoords.x + 'px';
        }

        if (finalCoords.y >= (MAP_SIZE.minY - MAIN_PIN_OFFSET_Y) && finalCoords.y <= (MAP_SIZE.maxY - MAIN_PIN_OFFSET_Y)) {
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

  var resetMap = function () {
    var pinsOnMap = mapPins.querySelectorAll('.map__pin');
    for (var i = 1; i < pinsOnMap.length; i++) {
      pinsOnMap[i].remove();
    }

    mapMainPin.style.left = mapMainPinDefaultPosition.x;
    mapMainPin.style.top = mapMainPinDefaultPosition.y;
    removeCard();
    lockMap();
  };

  lockMap();

  window.map = {
    reset: resetMap,
    isMapFaded: isMapFaded,
    getMainPinCoordinates: getMainPinCoordinates,
    getRandomLocation: getRandomLocation,
    drawCard: drawCard,
    removeCard: removeCard
  };
})();
