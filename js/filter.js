'use strict';

(function () {
  var MAX_OFFERS = 5;

  var offersList = [];
  var pinsContainer;

  var filterType = document.querySelector('#housing-type');

  var initializeFilter = function (offers, container) {
    offersList = offers;
    pinsContainer = container;
    filterType.addEventListener('change', updateFilter);
    updateFilter();
  };

  var updateFilter = function () {
    var filteredOffers = offersList;

    if (filterType.selectedIndex !== 0) {
      filteredOffers = offersList.filter(function (elem) {
        return elem.offer.type === filterType.value;
      });
    }

    if (filteredOffers.length > MAX_OFFERS) {
      filteredOffers = filteredOffers.slice(0, MAX_OFFERS);
    }

    window.map.removeCard();
    window.map.removePins();
    window.pins.create(filteredOffers, pinsContainer);
  };

  var resetFilter = function () {
    filterType.selectedIndex = 0;
  };

  window.filter = {
    init: initializeFilter,
    update: updateFilter,
    reset: resetFilter
  };
})();
