'use strict';

(function () {
  var POST_URL = 'https://javascript.pages.academy/keksobooking';

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = document.querySelectorAll('.ad-form fieldset');

  var adTitle = document.querySelector('#title');
  var adPrice = document.querySelector('#price');
  var adType = document.querySelector('#type');
  var adTimein = document.querySelector('#timein');
  var adTimeout = document.querySelector('#timeout');
  var adRooms = document.querySelector('#room_number');
  var adGuests = document.querySelector('#capacity');
  var adAddress = document.querySelector('#address');
  var adDescription = document.querySelector('#description');
  var adFeatures = document.querySelectorAll('.ad-form .feature__checkbox');

  var adTypeDefault = adType.value;
  var adTimeinDefault = adTimein.value;
  var adTimeoutDefault = adTimeout.value;
  var adRoomsDefault = adRooms.value;
  var adGuestsDefault = adGuests.value;

  var adReset = document.querySelector('.ad-form__reset');

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

  var lockForm = function () {
    adForm.classList.add('ad-form--disabled');
    window.util.disableElements(adFormFieldsets);
    setAddress();
    compareTypeAndPrice();
    compareRoomsAndGuests();
  };

  var unlockForm = function () {
    adForm.classList.remove('ad-form--disabled');
    window.util.enableElements(adFormFieldsets);
    setAddress();
  };

  var compareTypeAndPrice = function () {
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
  };

  var resetForm = function () {
    adTitle.value = adTitle.defaultValue;
    adPrice.value = adPrice.defaultValue;
    adType.value = adTypeDefault;
    adTimein.value = adTimeinDefault;
    adTimeout.value = adTimeoutDefault;
    adRooms.value = adRoomsDefault;
    adGuests.value = adGuestsDefault;
    adDescription.value = adDescription.defaultValue;
    adFeatures.forEach(function (elem) {
      elem.checked = false;
    });
    lockForm();
  };

  adType.addEventListener('change', function () {
    compareTypeAndPrice();
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

  adReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.map.reset();
    resetForm();
  });

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var onSuccess = function () {
      window.map.reset();
      resetForm();
      window.popup.success();
    };

    var onError = function (errorMsg) {
      window.popup.error(errorMsg);
    };

    window.xhr({
      method: 'POST',
      url: POST_URL,
      data: new FormData(adForm)
    }, onSuccess, onError);

  });

  adAddress.setAttribute('readonly', true);
  lockForm();

  window.form = {
    unlock: unlockForm,
    setAddress: setAddress,
    compareRooms: compareRoomsAndGuests,
  };
})();
