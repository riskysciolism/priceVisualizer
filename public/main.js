'use strict';

var socket = io();
var ctx = document.getElementById('myChart').getContext('2d');

socket.on('connected', chartData => {
  console.log("Data: " + JSON.stringify(chartData));
  makeChart(chartData);
});

socket.on('dropdownData', data => {
  console.log("Dropdown :" + data);
  populateDroplist(data);
});

function populateDroplist(data) {
  let dropdown = document.getElementById('category-dropdown');
  dropdown.length = 0;

  let defaultOption = document.createElement('option');
  defaultOption.text = 'Choose item category';

  dropdown.add(defaultOption);
  dropdown.selectedIndex = 0;

  let option;
  for (let i = 0; i < data.length; i++) {
    option = document.createElement('option');
    option.text = data[i].name;
    option.value = data[i]._id;
    dropdown.add(option);
  }
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
