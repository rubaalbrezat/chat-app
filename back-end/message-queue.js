'use strict';


const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001');


socket.on('reconnect', () => {
	console.log('Reconnected to the server');
	socket.emit('get-unreceived-messages', 'user-id');
})

socket.on('unreceived-messages', messages => {
	console.log(messages);
})

socket.on('receive', message => {
	console.log(message);
})