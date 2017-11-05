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

io.sockets.on('connection', function(socket){
	console.log('new user:',socket.id);

	socket.on('launch', () => {
    console.log('receiving launch');
		socket.broadcast.emit('launch', true);
	});

  socket.on('introduce', (data) => {
    console.log('receiving introduce:', data);
		socket.broadcast.emit('introduce', data);
	});

  socket.on('set', (data) => {
    console.log('receiving set:',data);
		socket.broadcast.emit('set', data);
	});

  socket.on('shade', (data) => {
    console.log('receiving shade:', data);
		socket.broadcast.emit('shade', data);
	});
});
