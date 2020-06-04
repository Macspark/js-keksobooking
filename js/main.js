'use strict';

var OFFERS_AMOUNT = 8;
var CURRENT_OFFER = 0;
var MIN_X = 0;
var MAX_X = document.querySelector('.map__pins').offsetWidth;
var MIN_Y = 130;
var MAX_Y = 630;
var MIN_PRICE = 1000;
var MAX_PRICE = 100000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 4;
var MIN_GUESTS = 1;
var MAX_GUESTS = 4;
var PIN_OFFSET_X = -25;
var PIN_OFFSET_Y = -70;
var MIN_FEATURES = 1;
var MIN_PHOTOS = 1;
var TITLES = ['Название 1', 'Название 2', 'Название 3', 'Название 4', 'Название 5', 'Название 6', 'Название 7', 'Название 8'];
var DESCRIPTIONS = ['Описание 1', 'Описание 2', 'Описание 3', 'Описание 4', 'Описание 5', 'Описание 6', 'Описание 7', 'Описание 8'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var generateAvatar = function (number) {
  number = number + 1;
  number = (number < 10 ? '0' : '') + number;
  return 'img/avatars/user' + number + '.png';
};

var generateAddress = function (locationXY) {
  return locationXY.x + ', ' + locationXY.y;
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomArray = function (list, min) {
  var tempArr = list.slice();
  var randomArr = [];
  var arrLength = getRandomNumber(min, tempArr.length);
  for (var i = 0; i < arrLength; i++) {
    var randomElem = getRandomElement(tempArr);
    randomArr.push(randomElem);
    tempArr.splice(tempArr.indexOf(randomElem), 1);
  }
  return randomArr;
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
      title: TITLES[i],
      address: generateAddress(locationXY),
      price: getRandomNumber(MIN_PRICE, MAX_PRICE),
      type: getRandomElement(TYPES),
      rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
      guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
      checkin: getRandomElement(TIMES),
      checkout: getRandomElement(TIMES),
      features: getRandomArray(FEATURES, MIN_FEATURES),
      description: DESCRIPTIONS[i],
      photos: getRandomArray(PHOTOS, MIN_PHOTOS)
    }
  };
};

document.querySelector('.map').classList.remove('map--faded');

var generateOffers = function (amount) {
  var tempArr = [];
  for (var i = 0; i < amount; i++) {
    tempArr.push(generateElement(i));
  }
  return tempArr;
};

var pinTemplate = document.querySelector('#pin').content.querySelector('button');
var pins = document.createDocumentFragment();
var mapPins = document.querySelector('.map__pins');

var generatePin = function (elem) {
  var pin = pinTemplate.cloneNode(true);
  var pinImg = pin.querySelector('img');
  pin.style.left = elem.location.x + PIN_OFFSET_X + 'px';
  pin.style.top = elem.location.y + PIN_OFFSET_Y + 'px';
  pinImg.src = elem.author.avatar;
  pinImg.alt = elem.offer.description;
  pins.appendChild(pin);
};

var cardTemplate = document.querySelector('#card').content.querySelector('article');
var cards = document.createDocumentFragment();
var map = document.querySelector('.map');
var mapFiltersContainer = document.querySelector('.map__filters-container');

var translatePrice = function (elem) {
  return elem.offer.price + '₽/ночь';
};

var translateType = function (elem) {
  if (elem.offer.type === 'flat') {
    return 'Квартира';
  } else if (elem.offer.type === 'bungalo') {
    return 'Бунгало';
  } else if (elem.offer.type === 'house') {
    return 'Дом';
  } else if (elem.offer.type === 'palace') {
    return 'Дворец';
  } else {
    return 'Не указано';
  }
};

var translateCapacity = function (elem) {
  var rooms = elem.offer.rooms;
  var guests = elem.offer.guests;
  rooms = rooms === 1 ? rooms + ' комната' : rooms + ' комнаты';
  guests = guests === 1 ? guests + ' гостя' : guests + ' гостей';
  return rooms + ' для ' + guests;
};

var translateTime = function (elem) {
  return 'Заезд после ' + elem.offer.checkin + ', выезд до ' + elem.offer.checkout;
};

var translateFeatures = function (card, elem) {
  var features = card.querySelectorAll('.popup__feature');
  features.forEach(function (e) {
    e.classList.add('hidden');
  });

  elem.offer.features.forEach(function (e) {
    card.querySelector('.popup__feature--' + e).classList.remove('hidden');
  });
};

var translatePhotos = function (card, elem) {
  var photos = card.querySelector('.popup__photos');
  card.querySelector('.popup__photo').classList.add('hidden');
  elem.offer.photos.forEach(function (e) {
    var photo = card.querySelector('.popup__photo').cloneNode(true);
    photo.src = e;
    photo.classList.remove('hidden');
    photos.appendChild(photo);
  });
};

var generateCard = function (elem) {
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = elem.offer.title;
  card.querySelector('.popup__text--address').textContent = elem.offer.address;
  card.querySelector('.popup__text--price').textContent = translatePrice(elem);
  card.querySelector('.popup__type').textContent = translateType(elem);
  card.querySelector('.popup__text--capacity').textContent = translateCapacity(elem);
  card.querySelector('.popup__text--time').textContent = translateTime(elem);
  translateFeatures(card, elem);
  card.querySelector('.popup__description').textContent = elem.offer.description;
  translatePhotos(card, elem);
  card.querySelector('.popup__avatar').src = elem.author.avatar;

  cards.appendChild(card);
  map.insertBefore(cards, mapFiltersContainer);
};

var offerList = generateOffers(OFFERS_AMOUNT);
offerList.forEach(function (elem) {
  generatePin(elem);
});
generateCard(offerList[CURRENT_OFFER]);

mapPins.appendChild(pins);
