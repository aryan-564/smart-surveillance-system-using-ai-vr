const socketIo = require('socket.io');

let io;

module.exports = {
    initSocket: (server) => {
        io = socketIo(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });

        console.log('Socket initialized');

        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        return io;
    },
    getIo: () => {
        if (!io) {
            console.log('Socket.io not initialized!');
        }
        return io;
    },
};
