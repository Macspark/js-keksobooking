'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = document.querySelectorAll('.ad-form fieldset');

  var adPrice = document.querySelector('#price');
  var adType = document.querySelector('#type');
  var adTimein = document.querySelector('#timein');
  var adTimeout = document.querySelector('#timeout');
  var adRooms = document.querySelector('#room_number');
  var adGuests = document.querySelector('#capacity');
  var adAddress = document.querySelector('#address');

  var setAddress = function () {
    var coordinates = window.map.getMainPinCoordinates();
    adAddress.value = coordinates.x + ', ' + coordinates.y;
  };

  var compareRoomsAndGuests = function () {
    switch (true) {
      case (adRooms.value === '100' && adGuests.value !== '0'):
        adGuests.setCustomValidity('Указанное количество комнат не для гостей');
        break;
      case (adRooms.value < adGuests.value):
        adGuests.setCustomValidity('Для текущего количества комнат гостей может быть не больше ' + adRooms.value);
        break;
      case (adRooms.value !== '100' && adGuests.value === '0'):
        adGuests.setCustomValidity('Текущее количество комнат подразумевает минимум 1 гостя');
        break;
      default:
        adGuests.setCustomValidity('');
        break;
    }
  };

  var initializeForm = function () {
    adAddress.setAttribute('readonly', true);

    adForm.classList.add('ad-form--disabled');
    window.util.disableElements(adFormFieldsets);

    setAddress();
    compareRoomsAndGuests();
  };

  var unlockForm = function () {
    adForm.classList.remove('ad-form--disabled');
    window.util.enableElements(adFormFieldsets);

    setAddress();
  };

  adType.addEventListener('change', function () {
    var price;
    switch (adType.value) {
      case 'bungalo':
        price = 0;
        break;
      case 'flat':
        price = 1000;
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
    adPrice.min = price;
    adPrice.placeholder = price * 5;
  });

  adTimein.addEventListener('change', function () {
    adTimeout.value = adTimein.value;
  });

  adTimeout.addEventListener('change', function () {
    adTimein.value = adTimeout.value;
  });

  adRooms.addEventListener('change', function () {
    compareRoomsAndGuests();
  });

  adGuests.addEventListener('change', function () {
    compareRoomsAndGuests();
  });

  initializeForm();

  window.form = {
    init: initializeForm,
    unlock: unlockForm,
    setAddress: setAddress,
    compareRooms: compareRoomsAndGuests,
  };
})();
