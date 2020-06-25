'use strict';

(function () {
  var offerTypeMap = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var isElementFilled = function (elem, container) {
    if (!elem) {
      container.classList.add('hidden');
      return false;
    }
    return true;
  };

  var transformSimpleText = function (elem, container) {
    if (isElementFilled(elem, container)) {
      container.textContent = elem;
    }
  };

  var transformPrice = function (elem, container) {
    if (isElementFilled(elem, container)) {
      container.textContent = elem + '₽/ночь';
    }
  };

  var transformType = function (elem, container) {
    if (isElementFilled(elem, container)) {
      container.textContent = offerTypeMap[elem];
    }
  };

  var transformCapacity = function (elem1, elem2, container) {
    if (isElementFilled((elem1 && elem2), container)) {
      container.textContent = elem1 + ' ' + window.util.getDeclinedWord(elem1, ['комната', 'комнаты', 'комнат']) + ' для ' + elem2 + ' ' + window.util.getDeclinedWord(elem2, ['гостя', 'гостей', 'гостей']);
    }
  };

  var transformTime = function (elem1, elem2, container) {
    if (isElementFilled((elem1 && elem2), container)) {
      container.textContent = 'Заезд после ' + elem1 + ', выезд до ' + elem2;
    }
  };

  var transformFeatures = function (elem, card, container) {
    if (isElementFilled(elem, container)) {
      var features = card.querySelectorAll('.popup__feature');

      features.forEach(function (e) {
        e.classList.add('hidden');
      });

      elem.forEach(function (e) {
        card.querySelector('.popup__feature--' + e).classList.remove('hidden');
      });
    }
  };

  var transformPhotos = function (elem, card, container) {
    if (isElementFilled(elem, container)) {
      var popupPhoto = card.querySelector('.popup__photo');
      popupPhoto.classList.add('hidden');
      elem.forEach(function (e) {
        var photo = popupPhoto.cloneNode(true);
        photo.src = e;
        photo.classList.remove('hidden');
        container.appendChild(photo);
      });
    }
  };

  var transformAvatar = function (elem, container) {
    if (isElementFilled(elem, container)) {
      container.src = elem;
    }
  };

  var generateCard = function (elem) {
    var cardTemplate = document.querySelector('#card').content.querySelector('article');
    var cardFragment = document.createDocumentFragment();
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
    var popupClose = card.querySelector('.popup__close');

    transformSimpleText(elem.offer.title, popupTitle);
    transformSimpleText(elem.offer.address, popupAddress);
    transformPrice(elem.offer.price, popupPrice);
    transformType(elem.offer.type, popupType);
    transformCapacity(elem.offer.rooms, elem.offer.guests, popupCapacity);
    transformTime(elem.offer.checkin, elem.offer.checkout, popupTime);
    transformFeatures(elem.offer.features, card, popupFeatures);
    transformSimpleText(elem.offer.description, popupDescription);
    transformPhotos(elem.offer.photos, card, popupPhotos);
    transformAvatar(elem.author.avatar, popupAvatar);

    cardFragment.appendChild(card);
    window.map.drawCard(cardFragment);

    popupClose.addEventListener('click', window.map.removeCard);
  };

  window.card = {
    generate: generateCard
  };
})();
