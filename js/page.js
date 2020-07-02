'use strict';

(function () {
  var resetPage = function () {
    window.map.reset();
    window.filter.reset();
    window.form.reset();
  };

  window.page = {
    reset: resetPage
  };
})();
