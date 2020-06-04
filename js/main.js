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
var MAX_ROOMS = 100;
var MIN_GUESTS = 1;
var MAX_GUESTS = 100;
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

var pinTemplate = document.querySelector('#pin').content.querySelector('button');
var pins = document.createDocumentFragment();
var mapPins = document.querySelector('.map__pins');

var cardTemplate = document.querySelector('#card').content.querySelector('article');
var cards = document.createDocumentFragment();
var map = document.querySelector('.map');
var mapFiltersContainer = document.querySelector('.map__filters-container');

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getDeclinedNumber = function (n, words) {
  n = Math.abs(n) % 100;
  var n1 = n % 10;
  switch (true) {
    case (n > 10 && n < 20):
      return words[2];
    case (n1 > 1 && n1 < 5):
      return words[1];
    case (n1 === 1):
      return words[0];
    default:
      return words[2];
  }
};

var generateAvatar = function (number) {
  number = number + 1;
  number = (number < 10 ? '0' : '') + number;
  return 'img/avatars/user' + number + '.png';
};

var generateAddress = function (locationXY) {
  return locationXY.x + ', ' + locationXY.y;
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

var generateOffers = function (amount) {
  var tempArr = [];
  for (var i = 0; i < amount; i++) {
    tempArr.push(generateElement(i));
  }
  return tempArr;
};

var generatePin = function (elem) {
  var pin = pinTemplate.cloneNode(true);
  var pinImg = pin.querySelector('img');
  pin.style.left = elem.location.x + PIN_OFFSET_X + 'px';
  pin.style.top = elem.location.y + PIN_OFFSET_Y + 'px';
  pinImg.src = elem.author.avatar;
  pinImg.alt = elem.offer.description;
  pins.appendChild(pin);
};

var hideNullElement = function (elem, container) {
  if (!elem) {
    container.classList.add('hidden');
  }
};

var translateSimpleInfo = function (elem, container) {
  hideNullElement(elem, container);
  return elem;
};

var translatePrice = function (elem, container) {
  hideNullElement(elem, container);
  return elem + '₽/ночь';
};

var translateType = function (elem, container) {
  hideNullElement(elem, container);
  switch (elem) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    default:
      return 'Тип жилья не указан';
  }
};

var translateCapacity = function (elem1, elem2, container) {
  hideNullElement(elem1 && elem2, container);
  return elem1 + ' ' + getDeclinedNumber(elem1, ['комната', 'комнаты', 'комнат']) + ' для ' + elem2 + ' ' + getDeclinedNumber(elem2, ['гостя', 'гостей', 'гостей']);
};

var translateTime = function (elem1, elem2, container) {
  hideNullElement(elem1 && elem2, container);
  return 'Заезд после ' + elem1 + ', выезд до ' + elem2;
};

var translateFeatures = function (elem, card, container) {
  hideNullElement(elem, container);

  var features = card.querySelectorAll('.popup__feature');
  features.forEach(function (e) {
    e.classList.add('hidden');
  });

  elem.forEach(function (e) {
    card.querySelector('.popup__feature--' + e).classList.remove('hidden');
  });
};

var translatePhotos = function (elem, card, container) {
  hideNullElement(elem, container);
  card.querySelector('.popup__photo').classList.add('hidden');
  elem.forEach(function (e) {
    var photo = card.querySelector('.popup__photo').cloneNode(true);
    photo.src = e;
    photo.classList.remove('hidden');
    container.appendChild(photo);
  });
};

var generateCard = function (elem) {
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = translateSimpleInfo(elem.offer.title, card.querySelector('.popup__title'));
  card.querySelector('.popup__text--address').textContent = translateSimpleInfo(elem.offer.address, card.querySelector('.popup__text--address'));
  card.querySelector('.popup__text--price').textContent = translatePrice(elem.offer.price, card.querySelector('.popup__text--price'));
  card.querySelector('.popup__type').textContent = translateType(elem.offer.type, card.querySelector('.popup__type'));
  card.querySelector('.popup__text--capacity').textContent = translateCapacity(elem.offer.rooms, elem.offer.guests, card.querySelector('.popup__text--capacity'));
  card.querySelector('.popup__text--time').textContent = translateTime(elem.offer.checkin, elem.offer.checkout, card.querySelector('.popup__text--time'));
  translateFeatures(elem.offer.features, card, card.querySelector('.popup__features'));
  card.querySelector('.popup__description').textContent = translateSimpleInfo(elem.offer.description, card.querySelector('.popup__description'));
  translatePhotos(elem.offer.photos, card, card.querySelector('.popup__photos'));
  card.querySelector('.popup__avatar').src = translateSimpleInfo(elem.author.avatar, card.querySelector('.popup__avatar'));

  cards.appendChild(card);
  map.insertBefore(cards, mapFiltersContainer);
};

var offerList = generateOffers(OFFERS_AMOUNT);

offerList.forEach(function (elem) {
  generatePin(elem);
});
mapPins.appendChild(pins);

generateCard(offerList[CURRENT_OFFER]);

document.querySelector('.map').classList.remove('map--faded');
