'use strict';

(function () {
  var OFFERS_AMOUNT = 8;

  window.form.address.setAttribute('readonly', true);
  window.form.container.classList.add('ad-form--disabled');
  window.util.disableElements(window.form.fieldsets);
  window.map.filters.classList.add('map__filters--disabled');
  window.util.disableElements(window.map.selects);
  window.util.disableElements(window.map.inputs);
  window.form.setAddress();
  window.form.compareRooms();

  window.data.offers = window.data.generate(OFFERS_AMOUNT);
  window.data.offers.forEach(function (elem) {
    window.pin.generate(elem);
  });
})();
