const socketio = require('socket.io');
const io = socketio();

const socketApi = {};
socketApi.io = io;

const users = {};
const playerList = [];

io.on('connection', (socket) => {

    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
        };
        const userData = Object.assign(data, defaultData);
        users[socket.id] = userData;
        playerList.push(userData);

        socket.broadcast.emit('playerList', playerList);
        socket.broadcast.emit('newUser', users[socket.id]);
        socket.emit('initPlayers', users);
        socket.emit('initPlayerList', playerList);

        console.log(playerList);
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        // for (i = 0, len = playerList.length; i < len; i++) {
        //     if(users[socket.id]["username"] == playerList[i]["username"]) {
        //         delete playerList[i];
        //     }
        // }
        socket.broadcast.emit('disUser', users[socket.id]);
        console.log(playerList)
    });

    socket.on('newMessage', (data) => {
        socket.broadcast.emit('newMessage', data);
        console.log(data.username + " tarafından bir yeni mesaj gönderildi.");
    });
})

module.exports = socketApi;