const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const path = require('path');
const itemController = require('./controller/itemController');
const categoryController = require('./controller/categoryController');
const apiController = require('./controller/apiController');
const spawn = require('child_process').spawn;

module.exports = app;
console.log('Node running..');

configureExpress();
configureDatabase();
configureAndStartChildProcess();

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
function configureAndStartChildProcess(){
    let child = spawn("apiController.callAPI");
    child.on('error', function (code, signal) {
        console.log('child process exited with ' +
            `code ${code} and signal ${signal}`);
    });
}

//TODO Refactor socket events into own file
//--------------------Socket events
async function onConnection(socket){
    console.log("Socket connected");
    await getDropdownData(socket);
    socket.on('newCategory',async () => {
        await newCategory();
        await getDropdownData(socket);
    });

    socket.on('fetch', async item => {
        let fetchedItem = await itemController.getItemPrices(item);
        socket.emit('dataFetched',fetchedItem)
    });

    socket.on('updatePrice', async data => {
        let newPrice = data.price;
        let itemId = data.id;
        await itemController.updatePrice(itemId, newPrice);
        io.emit('priceUpdated', await itemController.getNewestPrice(itemId));
    });

    socket.on('newItem', async data => {
        await newItem(data.name, data.description, data.category, data.price);
        await getDropdownData(socket);
    });
}

async function getDropdownData(socket) {
    let data = {
        categories: await categoryController.getCategories(),
        items: await itemController.getItems()
    };
    socket.emit('dropdownData', data);
}
function newCategory(name, description) {
    categoryController.createCategory("Coin", "yeah");
}
async function newItem(name, description, category, price) {
    await itemController.createItem(name, description, category, price);
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));