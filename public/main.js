'use strict';

var socket = io();
var ctx = document.getElementById('myChart').getContext('2d');

socket.on('connected', chartData => {
  console.log(JSON.stringify(chartData));
  makeChart(chartData);
  populateDroplist();
});

function populateDroplist() {
  let dropdown = document.getElementById('category-dropdown');
  dropdown.length = 0;

  let defaultOption = document.createElement('option');
  defaultOption.text = 'Choose item category';

  dropdown.add(defaultOption);
  dropdown.selectedIndex = 0;

  const url = '/api/category';

  const request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status === 200) {
      const data = JSON.parse(request.responseText);
      let option;
      for (let i = 0; i < data.length; i++) {
        option = document.createElement('option');
        option.text = data[i].name;
        option.value = data[i]._id;
        dropdown.add(option);
      }
    } else {
      // Reached the server, but it returned an error
    }
  }

  request.onerror = function() {
    console.error('An error occurred fetching the JSON from ' + url);
  };

  request.send();
}

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
