'use strict';

(function () {
  var MAIN_PIN_OFFSET_X = 32;
  var MAIN_PIN_OFFSET_Y = 80;

  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapMainPin = document.querySelector('.map__pin--main');

  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFiltersSelects = document.querySelectorAll('.map__filters select');
  var mapFiltersInputs = document.querySelectorAll('.map__filters input');

  var initializeMap = function () {
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

  var onLeftMouseDown = function (evt) {
    if (evt.button === 0) {
      setActiveState();
    }
  };

  var onEnterDown = function (evt) {
    if (evt.key === 'Enter') {
      setActiveState();
    }
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

  var setActiveState = function () {
    unlockMap();
    window.form.unlock();

    drawPins(window.pin.fragment);

    mapMainPin.removeEventListener('mousedown', onLeftMouseDown);
    mapMainPin.removeEventListener('keydown', onEnterDown);
  };

  mapMainPin.addEventListener('mousedown', onLeftMouseDown);
  mapMainPin.addEventListener('keydown', onEnterDown);

  window.map = {
    init: initializeMap,
    isMapFaded: isMapFaded,
    getMainPinCoordinates: getMainPinCoordinates,
    drawCard: drawCard,
    removeCard: removeCard
  };
})();
