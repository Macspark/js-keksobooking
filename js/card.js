'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('article');
  var offerTypeMap = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var hideIfNull = function (elem, container) {
    if (elem === undefined || elem === null || elem.length === 0) {
      container.classList.add('hidden');
      return false;
    }
    return true;
  };

  var transformSimpleText = function (elem, container) {
    if (hideIfNull(elem, container)) {
      container.textContent = elem;
    }
  };

  var transformPrice = function (elem, container) {
    if (hideIfNull(elem, container)) {
      container.textContent = elem + '₽/ночь';
    }
  };

  var transformType = function (elem, container) {
    if (hideIfNull(elem, container)) {
      container.textContent = offerTypeMap[elem];
    }
  };

  var transformCapacity = function (elem1, elem2, container) {
    if (hideIfNull((elem1 && elem2), container)) {
      if (elem1 > 0 || elem2 > 0) {
        var roomsWords = window.util.getDeclinedWord(elem1, ['комната', 'комнаты', 'комнат']);
        var guestsWords = window.util.getDeclinedWord(elem2, ['гостя', 'гостей', 'гостей']);
        container.textContent = elem1 + ' ' + roomsWords + ' для ' + elem2 + ' ' + guestsWords;
      } else {
        container.textContent = 'Не для гостей';
      }
    }
  };

  var transformTime = function (elem1, elem2, container) {
    if (hideIfNull((elem1 && elem2), container)) {
      container.textContent = 'Заезд после ' + elem1 + ', выезд до ' + elem2;
    }
  };

  var transformFeatures = function (elem, card, container) {
    if (hideIfNull(elem, container)) {
      elem.forEach(function (checkedFeature) {
        var feature = card.querySelector('.popup__feature--' + checkedFeature);
        feature.classList.remove('hidden');
      });
    }
  };

  var transformPhotos = function (elem, card, container) {
    if (hideIfNull(elem, container)) {
      var photoTemplate = card.querySelector('.popup__photo');
      elem.forEach(function (e) {
        var photo = photoTemplate.cloneNode(true);
        photo.src = e;
        photo.classList.remove('hidden');
        container.appendChild(photo);
      });
      container.removeChild(photoTemplate);
    }
  };

  var transformAvatar = function (elem, container) {
    if (hideIfNull(elem, container)) {
      container.src = elem;
    }
  };

  var generateCard = function (elem) {
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
