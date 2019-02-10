'use strict';

var socket = io();
var ctx = document.getElementById('myChart').getContext('2d');

socket.on('connected', chartData => {
  makeChart(chartData);
});

function makeChart(chartData) {
  new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {}
  });
}

// limit the number of events per second
function throttle(callback, delay) {
  var previousCall = new Date().getTime();
  return function() {
    var time = new Date().getTime();

    if ((time - previousCall) >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}
