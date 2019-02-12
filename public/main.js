'use strict';

var socket = io();
var ctx = document.getElementById('myChart').getContext('2d');

function createNewCategory() {
  socket.emit('newCategory');
}

function showData(item) {
  socket.emit('fetch', item);
}

socket.on('connected', chartData => {


});

socket.on('dropdownData', data => {
  console.log("Dropdown: " + JSON.stringify(data));
  populateDroplist(data);
});

socket.on('items', data => {
  console.log("Items: " + JSON.stringify(data));
});

socket.on('dataFetched', data => {
  console.log("Fetched data: " + JSON.stringify(data));
  makeChart(data);
});

socket.on('priceUpdated', data => {
  console.log("New price: " + data);

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

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
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
