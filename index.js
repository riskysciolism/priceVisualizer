const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const path = require('path');
const itemController = require('./controller/itemController');
const category = require('./controller/categoryController');

module.exports = app;

console.log('Node running..');

configureExpress();
configureDatabase();

function configureExpress() {
  app.use(express.static(path.join(__dirname, 'public')));
  console.log('Express configured..');
}

function configureDatabase(){
  mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
  let db = mongoose.connection;

  // Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'connection error: '));
  db.once('open', function() {
    // connected
    console.log('MongoDB connected..');
  });
}

async function onConnection(socket){
  console.log("Socket connected");
  //let items = await item.getItems();
  let items = await itemController.getItemPrices("Water");
  socket.emit('items', items);

  await getCategories(socket);
  socket.on('newCategory',async () => {
    console.log("click");
    await newCategory();
    await getCategories(socket);
  });

  socket.on('fetch', async item => {
    let fetchedItem = await itemController.getItemPrices(item);
    socket.emit('dataFetched',fetchedItem)
  });

  socket.on('updatePrice', async data => {
    let newPrice = data.price;
    let itemName = data.name;

    itemController.updatePrice(itemName, newPrice);
    io.emit('priceUpdated', newPrice);
  });
}

async function getCategories(socket) {
  let data = await category.getCategories();
  socket.emit('dropdownData', data);
}

function newCategory(name, description) {
  category.createCategory("wow", "yeah");
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));