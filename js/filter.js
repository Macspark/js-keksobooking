'use strict';

(function () {
  var MAX_OFFERS = 5;
  var PriceRange = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };
  var PriceList = {
    LOW: 10000,
    HIGH: 50000
  };
  var ANY_VALUE = 'any';

  var offersList = [];
  var pinsContainer;

  var filterContainer = document.querySelector('.map__filters');

  var filterSelects = filterContainer.querySelectorAll('select');
  var filterInputs = filterContainer.querySelectorAll('input');

  var filterType = filterContainer.querySelector('#housing-type');
  var filterPrice = filterContainer.querySelector('#housing-price');
  var filterRooms = filterContainer.querySelector('#housing-rooms');
  var filterGuests = filterContainer.querySelector('#housing-guests');
  var filterFeatures = filterContainer.querySelector('#housing-features');

  var getPriceNameRange = function (price) {
    switch (true) {
      case (price < PriceList.LOW):
        return PriceRange.LOW;
      case (price >= PriceList.LOW && price < PriceList.HIGH):
        return PriceRange.MIDDLE;
      case (price >= PriceList.HIGH):
        return PriceRange.HIGH;
      default:
        return ANY_VALUE;
    }
  };

  var getCheckedFeatures = function () {
    return filterFeatures.querySelectorAll('input:checked');
  };

  var isOfferStringCorrect = function (offerProperty, filterOption) {
    return (filterOption === ANY_VALUE || offerProperty === filterOption);
  };

  var isOfferIntCorrect = function (offerProperty, filterOption) {
    return (filterOption === ANY_VALUE || offerProperty === parseInt(filterOption, 10));
  };

  var areOfferFeaturesCorrect = function (offerFeatures, checkedFeatures) {
    if (checkedFeatures.length > 0) {
      for (var i = 0; i < checkedFeatures.length; i++) {
        if (offerFeatures.indexOf(checkedFeatures[i].value) === -1) {
          return false;
        }
      }
    }
    return true;
  };

  var filterOffers = function (offers, options) {
    var filteredOffers = [];
    for (var i = 0; i < offers.length; i++) {
      if (isOfferStringCorrect(offers[i].offer.type, options.type) &&
          isOfferStringCorrect(getPriceNameRange(offers[i].offer.price), options.price) &&
          isOfferIntCorrect(offers[i].offer.rooms, options.rooms) &&
          isOfferIntCorrect(offers[i].offer.guests, options.guests) &&
          areOfferFeaturesCorrect(offers[i].offer.features, options.features)) {
        filteredOffers.push(offers[i]);
      }
      if (filteredOffers.length >= MAX_OFFERS) {
        break;
      }
    }
    return filteredOffers;
  };

  var updateFilter = window.debounce(function () {
    var filterOptions = {
      type: filterType.value,
      price: filterPrice.value,
      rooms: filterRooms.value,
      guests: filterGuests.value,
      features: getCheckedFeatures()
    };

    var filteredOffers = filterOffers(offersList, filterOptions);

    window.map.clear();
    window.pins.create(filteredOffers, pinsContainer);
  });

  var resetFilter = function () {
    filterType.selectedIndex = 0;
    filterPrice.selectedIndex = 0;
    filterRooms.selectedIndex = 0;
    filterGuests.selectedIndex = 0;
    getCheckedFeatures().forEach(function (elem) {
      elem.checked = false;
    });
  };

  var lockFilter = function () {
    filterContainer.classList.add('map__filters--disabled');
    window.util.disableElements(filterSelects);
    window.util.disableElements(filterInputs);
    filterContainer.removeEventListener('change', updateFilter);
  };

  var unlockFilter = function () {
    filterContainer.classList.remove('map__filters--disabled');
    window.util.enableElements(filterSelects);
    window.util.enableElements(filterInputs);
    filterContainer.addEventListener('change', updateFilter);
  };

  var initializeFilter = function (offers, container) {
    offersList = offers;
    pinsContainer = container;
    updateFilter();
  };

  window.filter = {
    init: initializeFilter,
    lock: lockFilter,
    unlock: unlockFilter,
    update: updateFilter,
    reset: resetFilter
  };
})();
