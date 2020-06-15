'use strict';

(function () {
  var OFFERS_AMOUNT = 8;

  window.map.init();
  window.form.init();

  var offers = window.data.generate(OFFERS_AMOUNT);
  offers.forEach(function (elem) {
    window.pin.generate(elem);
  });
})();
