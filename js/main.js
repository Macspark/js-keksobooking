'use strict';

var MIN_X = 0;
var MAX_X = document.querySelector('.map__pins').offsetWidth;
var MIN_Y = 130;
var MAX_Y = 630;
var MIN_PRICE = 1000;
var MAX_PRICE = 100000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 4;
var MIN_GUESTS = 0;
var MAX_GUESTS = 4;
var PIN_OFFSET_X = -25;
var PIN_OFFSET_Y = -70;

var offerList = [];

var generateAvatar = function (number) {
  number = number + 1;
  number = (number < 10 ? '0' : '') + number;
  return 'img/avatars/user' + number + '.png';
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var generateAddress = function (locationXY) {
  return locationXY.x + ', ' + locationXY.y;
};

var getRandomArray = function (list) {
  var randomArr = [];
  var arrLength = getRandomNumber(0, list.length);
  for (var i = 0; i < arrLength; i++) {
    var randomElem = getRandomElement(list);
    randomArr.push(randomElem);
    list.splice(list.indexOf(randomElem), 1);
  }
  return randomArr;
};

var generateTitle = function (i) {
  var titleList = ['Название 1', 'Название 2', 'Название 3', 'Название 4', 'Название 5', 'Название 6', 'Название 7', 'Название 8'];
  return titleList[i];
};

var generateType = function () {
  var typesList = ['palace', 'flat', 'house', 'bungalo'];
  return getRandomElement(typesList);
};

var generateChecks = function () {
  var checkinsList = ['12:00', '13:00', '14:00'];
  return getRandomElement(checkinsList);
};

var generateFeatures = function () {
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  return getRandomArray(features);
};

var generateDescription = function (i) {
  var descList = ['Описание 1', 'Описание 2', 'Описание 3', 'Описание 4', 'Описание 5', 'Описание 6', 'Описание 7', 'Описание 8'];
  return descList[i];
};

var generatePhotos = function () {
  var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  return getRandomArray(photos);
};

var generateElement = function (i) {
  var locationXY = {
    x: getRandomNumber(MIN_X, MAX_X),
    y: getRandomNumber(MIN_Y, MAX_Y)
  };
  return {
    author: {
      avatar: generateAvatar(i)
    },
    location: locationXY,
    offer: {
      title: generateTitle(i),
      address: generateAddress(locationXY),
      price: getRandomNumber(MIN_PRICE, MAX_PRICE),
      type: generateType(),
      rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
      guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
      checkin: generateChecks(),
      checkout: generateChecks(),
      features: generateFeatures(),
      description: generateDescription(i),
      photos: generatePhotos()
    }
  };
};

document.querySelector('.map').classList.remove('map--faded');

var pinTemplate = document.querySelector('#pin').content.querySelector('button');
var fragment = document.createDocumentFragment();
var mapPins = document.querySelector('.map__pins');

for (var i = 0; i < 8; i++) {
  var newElement = generateElement(i);
  offerList.push(newElement);

  var pin = pinTemplate.cloneNode(true);
  var pinImg = pin.querySelector('img');
  pin.style.left = newElement.location.x + PIN_OFFSET_X + 'px';
  pin.style.top = newElement.location.y + PIN_OFFSET_Y + 'px';
  pinImg.src = newElement.author.avatar;
  pinImg.alt = newElement.offer.description;
  fragment.appendChild(pin);
}

mapPins.appendChild(fragment);
