'use strict';

(function () {
  var MAX_OFFERS = 5;

  var offersList = [];
  var pinsContainer;

  var filterType = document.querySelector('#housing-type');
  var filterPrice = document.querySelector('#housing-price');
  var filterRooms = document.querySelector('#housing-rooms');
  var filterGuests = document.querySelector('#housing-guests');

  var initializeFilter = function (offers, container) {
    offersList = offers;
    pinsContainer = container;
    filterType.addEventListener('change', updateFilter);
    filterPrice.addEventListener('change', updateFilter);
    filterRooms.addEventListener('change', updateFilter);
    filterGuests.addEventListener('change', updateFilter);
    updateFilter();
  };

  var getPriceNameRange = function (price) {
    switch (true) {
      case (price < 10000):
        return 'low';
      case (price >= 10000 && price < 50000):
        return 'middle';
      case (price >= 50000):
        return 'high';
      default:
        return 'any';
    }
  };

  var isOfferStringCorrect = function (offer, option) {
    return (option === 'any' || offer === option);
  };

  var isOfferIntCorrect = function (offer, option) {
    return (option === 'any' || offer === parseInt(option, 10));
  };

  var filterOffers = function (offers, options) {
    var filteredOffers = [];
    for (var i = 0; i < offers.length; i++) {
      if (isOfferStringCorrect(offers[i].offer.type, options.type) &&
          isOfferStringCorrect(getPriceNameRange(offers[i].offer.price), options.price) &&
          isOfferIntCorrect(offers[i].offer.rooms, options.rooms) &&
          isOfferIntCorrect(offers[i].offer.guests, options.guests)) {
        filteredOffers.push(offers[i]);
      }
      if (filteredOffers.length >= MAX_OFFERS) {
        break;
      }
    }
    return filteredOffers;
  };

  var updateFilter = function () {
    var filterOptions = {
      type: filterType.value,
      price: filterPrice.value,
      rooms: filterRooms.value,
      guests: filterGuests.value
    };

    var filteredOffers = filterOffers(offersList, filterOptions);

    window.map.removeCard();
    window.map.removePins();
    window.pins.create(filteredOffers, pinsContainer);
  };

  var resetFilter = function () {
    filterType.selectedIndex = 0;
    filterPrice.selectedIndex = 0;
    filterRooms.selectedIndex = 0;
    filterGuests.selectedIndex = 0;
  };

  window.filter = {
    init: initializeFilter,
    update: updateFilter,
    reset: resetFilter
  };
})();
