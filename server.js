const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 2046;

app.use(express.static(path.join(__dirname,'public')));

const server = new http.Server(app);
server.listen(PORT, function(){
  console.log('running on port',PORT);
});

const io = require('socket.io')(server);

io.on('connect', function(socket){
	console.log('new user:',socket.id);

	socket.on('launch', function(){
    console.log('receiving launch');
		socket.emit('launch', true);
	});
});
