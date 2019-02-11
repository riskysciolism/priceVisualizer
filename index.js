const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const item = require('./controller/itemController')

/*const item = require('./routes/api/item'),
      category = require('./routes/api/category');
*/

module.exports = app;

console.log('Node running..');

configureExpress();
configureDatabase();


function configureExpress() { 
  app.use(express.static(path.join(__dirname, 'public')));
  /*app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
      next();
  });

  // Use body parser so we can get info from POST and/or URL parameters.
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({limit: "8mb"}));

  // Use morgan to log requests to the console.
  app.use(morgan('dev'));

  //app.use(express.static(__dirname + '/public'));
  app.use('/api/item', item);
  app.use('/api/category', category);
  */
  console.log('Express configured..');
}

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
  console.log("first: " + item.getItemPrices('Water'));
  socket.emit('connected', item.getItemPrices('Water'));
  console.log("Socket connected..");
}



io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));