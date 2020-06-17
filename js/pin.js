'use strict';

(function () {
  var PIN_OFFSET_X = -25;
  var PIN_OFFSET_Y = -70;

  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var pinFragment = document.createDocumentFragment();


  var generatePin = function (elem) {
    if (elem.offer) {
      var pin = pinTemplate.cloneNode(true);
      var pinImg = pin.querySelector('img');
      pin.style.left = elem.location.x + PIN_OFFSET_X + 'px';
      pin.style.top = elem.location.y + PIN_OFFSET_Y + 'px';
      pinImg.src = elem.author.avatar;
      pinImg.alt = elem.offer.description;
      pin.addEventListener('click', function () {
        window.map.removeCard();
        window.card.generate(elem);
      });
      pinFragment.appendChild(pin);
    }
  };

  window.pin = {
    generate: generatePin,
    fragment: pinFragment
  };
})();
