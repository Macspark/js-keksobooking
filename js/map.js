'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapMainPin = document.querySelector('.map__pin--main');

  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapFiltersSelects = document.querySelectorAll('.map__filters select');
  var mapFiltersInputs = document.querySelectorAll('.map__filters input');

  window.map = {
    mainPin: mapMainPin,
    container: map
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

  var setActiveState = function () {
    window.form.container.classList.remove('ad-form--disabled');
    window.util.enableElements(window.form.fieldsets);
    mapFilters.classList.remove('map__filters--disabled');
    window.util.enableElements(mapFiltersSelects);
    window.util.enableElements(mapFiltersInputs);

    document.querySelector('.map').classList.remove('map--faded');
    mapPins.appendChild(window.pin.fragment);

    window.form.setAddress();

    mapMainPin.removeEventListener('mousedown', onLeftMouseDown);
    mapMainPin.removeEventListener('keydown', onEnterDown);
  };

  mapMainPin.addEventListener('mousedown', onLeftMouseDown);
  mapMainPin.addEventListener('keydown', onEnterDown);

  window.map = {
    container: map,
    filters: mapFilters,
    filterContainer: mapFiltersContainer,
    selects: mapFiltersSelects,
    inputs: mapFiltersInputs,
    pins: mapPins,
    mainPin: mapMainPin
  };
})();
