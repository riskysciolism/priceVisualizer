'use strict';

var socket = io();
var ctx = document.getElementById('myChart').getContext('2d');
var chart;
function createNewCategory() {
  socket.emit('newCategory');
}

function newPrice() {
  let data = {
    id: document.getElementById('item-dropdown').value,
    price: document.getElementById('updatedPrice').value
  };
  socket.emit('updatePrice', data);
}

function showData() {
  socket.emit('fetch', document.getElementById('item-dropdown').value);
}

function createNewItem(){
  console.log("Clicked");
  let data = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category-dropdown').value,
    price: document.getElementById('price').value
  };
  socket.emit('newItem', data);
  alert("Item created.");
}

//---------------------Server answer

socket.on('connected', chartData => {

});

socket.on('dropdownData', data => {
  populateDroplist(data.categories, "category-dropdown");
  populateDroplist(data.items, "item-dropdown");
});

socket.on('items', data => {
  console.log("Items: " + JSON.stringify(data));
});

socket.on('dataFetched', data => {
  console.log("Fetched data: " + JSON.stringify(data));
  makeChart(data);
});

socket.on('priceUpdated', data => {
  console.log("Data: " + data);
  console.log("New price: " + data.value);
  addData(chart, data.timestamp, data.value);
});

function populateDroplist(data, dropdownVersion) {
  let dropdown = document.getElementById(dropdownVersion);
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
  chart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
    }
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
