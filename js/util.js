'use strict';

(function () {
  var getRandomNumber = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var getRandomElement = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  var getDeclinedWord = function (n, words) {
    n = Math.abs(n) % 100;
    var n1 = n % 10;
    switch (true) {
      case (n > 10 && n < 20):
        return words[2];
      case (n1 > 1 && n1 < 5):
        return words[1];
      case (n1 === 1):
        return words[0];
      default:
        return words[2];
    }
  };

  var getRandomizedArray = function (list, min) {
    var tempArr = list.slice();
    var randomArr = [];
    var arrLength = window.util.getRandomNumber(min, tempArr.length);
    for (var i = 0; i < arrLength; i++) {
      var randomElem = window.util.getRandomElement(tempArr);
      randomArr.push(randomElem);
      tempArr.splice(tempArr.indexOf(randomElem), 1);
    }
    return randomArr;
  };

  var disableElements = function (elem) {
    elem.forEach(function (e) {
      e.setAttribute('disabled', true);
    });
  };

  var enableElements = function (elem) {
    elem.forEach(function (e) {
      e.removeAttribute('disabled');
    });
  };

  window.util = {
    disableElements: disableElements,
    enableElements: enableElements,
    getRandomNumber: getRandomNumber,
    getRandomElement: getRandomElement,
    getDeclinedWord: getDeclinedWord,
    getRandomizedArray: getRandomizedArray
  };
})();
