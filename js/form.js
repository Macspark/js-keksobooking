'use strict';

(function () {
  var MAIN_PIN_OFFSET_X = 32;
  var MAIN_PIN_OFFSET_Y = 80;

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
    var x = parseInt(window.map.mainPin.style.left, 10);
    var y = parseInt(window.map.mainPin.style.top, 10);

    if (window.map.container.classList.contains('map--faded')) {
      var cx = Math.floor(window.map.mainPin.offsetWidth / 2);
      var cy = Math.floor(window.map.mainPin.offsetHeight / 2);
      x = x + cx;
      y = y + cy;
    } else {
      x = x + MAIN_PIN_OFFSET_X;
      y = y + MAIN_PIN_OFFSET_Y;
    }
    adAddress.value = x + ', ' + y;
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

  window.form = {
    container: adForm,
    fieldsets: adFormFieldsets,
    address: adAddress,
    setAddress: setAddress,
    compareRooms: compareRoomsAndGuests
  };

})();
