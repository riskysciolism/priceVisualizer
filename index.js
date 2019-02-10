const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const items = require('./controller/itemController');

const item = require('./routes/api/item');

app.use(express.static(__dirname + '/public'));
app.use('/api/item', item);

configureDatabase();

function configureDatabase(){
  mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
    var db = mongoose.connection;

    // Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', function() {
        // connected
        console.log('MongoDB connected..');
    });
}

function onConnection(socket){
  //socket.emit('connected', data);
  console.log("Socket connected..");
}



io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));