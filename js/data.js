'use strict';

(function () {
  var TITLES = ['Название 1', 'Название 2', 'Название 3', 'Название 4', 'Название 5', 'Название 6', 'Название 7', 'Название 8'];
  var DESCRIPTIONS = ['Описание 1', 'Описание 2', 'Описание 3', 'Описание 4', 'Описание 5', 'Описание 6', 'Описание 7', 'Описание 8'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var MIN_FEATURES = 1;
  var MIN_PHOTOS = 1;

  var MIN_X = 0;
  var MAX_X = document.querySelector('.map__pins').offsetWidth;
  var MIN_Y = 130;
  var MAX_Y = 630;

  var MIN_PRICE = 1000;
  var MAX_PRICE = 100000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 100;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 100;

  var offersList = [];

  var generateAvatar = function (number) {
    number = number + 1;
    number = (number < 10 ? '0' : '') + number;
    return 'img/avatars/user' + number + '.png';
  };

  var generateAddress = function (locationXY) {
    return locationXY.x + ', ' + locationXY.y;
  };

  var generateElement = function (i) {
    var locationXY = {
      x: window.util.getRandomNumber(MIN_X, MAX_X),
      y: window.util.getRandomNumber(MIN_Y, MAX_Y)
    };
    return {
      author: {
        avatar: generateAvatar(i)
      },
      location: locationXY,
      offer: {
        title: TITLES[i],
        address: generateAddress(locationXY),
        price: window.util.getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: window.util.getRandomElement(TYPES),
        rooms: window.util.getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: window.util.getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: window.util.getRandomElement(TIMES),
        checkout: window.util.getRandomElement(TIMES),
        features: window.util.getRandomizedArray(FEATURES, MIN_FEATURES),
        description: DESCRIPTIONS[i],
        photos: window.util.getRandomizedArray(PHOTOS, MIN_PHOTOS)
      }
    };
  };

  var generateOffers = function (amount) {
    for (var i = 0; i < amount; i++) {
      offersList.push(generateElement(i));
    }
    return offersList;
  };

  window.data = {
    generate: generateOffers
  };
})();
