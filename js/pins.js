'use strict';

(function () {
  var PIN_OFFSET_X = -25;
  var PIN_OFFSET_Y = -70;

  var pinTemplate = document.querySelector('#pin').content.querySelector('button');

  var removeOldActivePin = function () {
    var oldPin = document.querySelector('.map__pin--active');
    if (oldPin) {
      oldPin.classList.remove('map__pin--active');
    }
  };

  var setNewActivePin = function (pin) {
    removeOldActivePin();
    pin.classList.add('map__pin--active');
  };

  var createPins = function (arr, container) {
    var pinFragment = document.createDocumentFragment();
    arr.forEach(function (elem) {
      if (!elem.offer) {
        return;
      }
      var pin = pinTemplate.cloneNode(true);
      var pinImg = pin.querySelector('img');
      pin.style.left = elem.location.x + PIN_OFFSET_X + 'px';
      pin.style.top = elem.location.y + PIN_OFFSET_Y + 'px';
      pinImg.src = elem.author.avatar;
      pinImg.alt = elem.offer.description;
      pin.addEventListener('click', function () {
        window.map.removeCard();
        window.card.generate(elem);
        setNewActivePin(pin);
      });
      pinFragment.appendChild(pin);
    });
    container.appendChild(pinFragment);
  };

  window.pins = {
    create: createPins,
    removeActiveClass: removeOldActivePin
  };
})();
