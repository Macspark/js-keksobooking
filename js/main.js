'use strict';

var OFFERS_AMOUNT = 8;
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

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = document.querySelectorAll('.ad-form fieldset');

var mapFilters = document.querySelector('.map__filters');
var mapFiltersSelects = document.querySelectorAll('.map__filters select');
var mapFiltersInputs = document.querySelectorAll('.map__filters input');

var mapPinMain = document.querySelector('.map__pin--main');
var mapPinMainX = mapPinMain.style.left.replace('px', '');
var mapPinMainY = mapPinMain.style.top.replace('px', '');

var filterPrice = document.querySelector('#price');
var filterType = document.querySelector('#type');
var filterTimein = document.querySelector('#timein');
var filterTimeout = document.querySelector('#timeout');
var filterRooms = document.querySelector('#room_number');
var filterGuests = document.querySelector('#capacity');

var address = document.querySelector('#address');

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

var transformSimpleInfo = function (elem, container) {
  hideNullElement(elem, container);
  return elem;
};

var transformPrice = function (elem, container) {
  hideNullElement(elem, container);
  return elem + '₽/ночь';
};

var transformType = function (elem, container) {
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

var transformCapacity = function (elem1, elem2, container) {
  hideNullElement(elem1 && elem2, container);
  return elem1 + ' ' + getDeclinedNumber(elem1, ['комната', 'комнаты', 'комнат']) + ' для ' + elem2 + ' ' + getDeclinedNumber(elem2, ['гостя', 'гостей', 'гостей']);
};

var transformTime = function (elem1, elem2, container) {
  hideNullElement(elem1 && elem2, container);
  return 'Заезд после ' + elem1 + ', выезд до ' + elem2;
};

var transformFeatures = function (elem, card, container) {
  hideNullElement(elem, container);

  var features = card.querySelectorAll('.popup__feature');
  features.forEach(function (e) {
    e.classList.add('hidden');
  });

  elem.forEach(function (e) {
    card.querySelector('.popup__feature--' + e).classList.remove('hidden');
  });
};

var transformPhotos = function (elem, card, container) {
  hideNullElement(elem, container);
  var popupPhoto = card.querySelector('.popup__photo');
  popupPhoto.classList.add('hidden');
  elem.forEach(function (e) {
    var photo = popupPhoto.cloneNode(true);
    photo.src = e;
    photo.classList.remove('hidden');
    container.appendChild(photo);
  });
};

var generateCard = function (elem) {
  var card = cardTemplate.cloneNode(true);
  var popupTitle = card.querySelector('.popup__title');
  var popupAddress = card.querySelector('.popup__text--address');
  var popupPrice = card.querySelector('.popup__text--price');
  var popupType = card.querySelector('.popup__type');
  var popupCapacity = card.querySelector('.popup__text--capacity');
  var popupTime = card.querySelector('.popup__text--time');
  var popupFeatures = card.querySelector('.popup__features');
  var popupDescription = card.querySelector('.popup__description');
  var popupPhotos = card.querySelector('.popup__photos');
  var popupAvatar = card.querySelector('.popup__avatar');

  popupTitle.textContent = transformSimpleInfo(elem.offer.title, popupTitle);
  popupAddress.textContent = transformSimpleInfo(elem.offer.address, popupAddress);
  popupPrice.textContent = transformPrice(elem.offer.price, popupPrice);
  popupType.textContent = transformType(elem.offer.type, popupType);
  popupCapacity.textContent = transformCapacity(elem.offer.rooms, elem.offer.guests, popupCapacity);
  popupTime.textContent = transformTime(elem.offer.checkin, elem.offer.checkout, popupTime);
  transformFeatures(elem.offer.features, card, popupFeatures);
  popupDescription.textContent = transformSimpleInfo(elem.offer.description, popupDescription);
  transformPhotos(elem.offer.photos, card, popupPhotos);
  popupAvatar.src = transformSimpleInfo(elem.author.avatar, popupAvatar);

  cards.appendChild(card);
  map.insertBefore(cards, mapFiltersContainer);
};

var setAddress = function () {
  address.value = mapPinMainX + ', ' + mapPinMainY;
};

var disableElements = function (elem) {
  elem.forEach(function (e) {
    e.setAttribute('disabled', true);
  });
};

var enableElements = function (elem) {
  elem.forEach(function (e) {
    e.removeAttribute('disabled');
  });
};

var setActiveState = function () {
  adForm.classList.remove('ad-form--disabled');
  enableElements(adFormFieldsets);
  mapFilters.classList.remove('map__filters--disabled');
  enableElements(mapFiltersSelects);
  enableElements(mapFiltersInputs);

  document.querySelector('.map').classList.remove('map--faded');

  mapPins.appendChild(pins);
  generateCard(offerList[0]);
};

var compareRoomsAndGuests = function () {
  switch (true) {
    case (filterRooms.value === '100' && filterGuests.value !== '0'):
      filterGuests.setCustomValidity('Указанное количество комнат не для гостей');
      break;
    case (filterRooms.value < filterGuests.value):
      filterGuests.setCustomValidity('Для текущего количества комнат гостей может быть не больше ' + filterRooms.value);
      break;
    case (filterRooms.value !== '100' && filterGuests.value === '0'):
      filterGuests.setCustomValidity('Текущее количество комнат подразумевает минимум 1 гостя');
      break;
    default:
      filterGuests.setCustomValidity('');
      break;
  }
};

mapPinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    setActiveState();
  }
});
mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    setActiveState();
  }
});

filterType.addEventListener('change', function () {
  var price;
  switch (filterType.value) {
    case 'flat':
      price = 1000;
      break;
    case 'bungalo':
      price = 0;
      break;
    case 'house':
      price = 5000;
      break;
    case 'palace':
      price = 10000;
      break;
    default:
      price = 1000;
      break;
  }
  filterPrice.min = price;
  filterPrice.placeholder = price * 5;
});

filterTimein.addEventListener('change', function () {
  filterTimeout.value = filterTimein.value;
});

filterTimeout.addEventListener('change', function () {
  filterTimein.value = filterTimeout.value;
});

filterRooms.addEventListener('change', function () {
  compareRoomsAndGuests();
});

filterGuests.addEventListener('change', function () {
  compareRoomsAndGuests();
});

var offerList = generateOffers(OFFERS_AMOUNT);
offerList.forEach(function (elem) {
  generatePin(elem);
});

address.setAttribute('readonly', true);
adForm.classList.add('ad-form--disabled');
disableElements(adFormFieldsets);
mapFilters.classList.add('map__filters--disabled');
disableElements(mapFiltersSelects);
disableElements(mapFiltersInputs);
setAddress();
compareRoomsAndGuests();
