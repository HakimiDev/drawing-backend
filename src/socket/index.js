import peerController from './controllers/peer.js';
import roomController from './controllers/room.js';

export default async (io, peerServer) => {

    const onConnection = async (socket) => {
        peerController.registerPeer(io, socket);
        roomController(io, socket);
    };

    io.on('connection', onConnection);

    peerServer.on('connection', (connection) => {
        peerController.addPeer(connection.id);
    });
    
    peerServer.on('disconnected', (connection) => {
        peerController.removePeer(connection.id);
    });


    // io.on('connection', async (socket) => {

    //     socket.on('create-room', (user) => { // user must contain a peerId
    //         if (typeof user.username !== 'string' || user.username.length >= 20) return;
    //         let hasRoom = false;
    //         for (const [key, value] of rooms.entries()) {
    //             if (value.ownerId === socket.id) {
    //                 hasRoom = true;
    //                 break;
    //             }
    //         }

    //         if (hasRoom) return;

    //         createUser(socket.id, user);
    //         const roomId = createRoom(socket.id, username);

    //         socket.join(roomId);
    //         socket.broadcast('joined-room', user, roomId);

    //         console.log(roomId, username);
    //     });

    //     socket.on('join-room', (roomId, user) => { // user must contain a peerId
    //         if (!rooms.has(roomId)) return;
    //         if (typeof user.username !== 'string' || user.username.length >= 20) return;

    //         const room = rooms.get(roomId);
    //         if (socket.id === room.ownerId) return;
    //         if (room.members.find(e => e === socket.id)) return;

    //         createUser(socket.id, user);
    //         io.to(roomId).emit('ask-join-room', user, roomId);
    //     });

    //     socket.on('allow-join-room', (userId, roomId) => {
    //         if (!rooms.has(roomId)) return;

    //         const room = rooms.get(roomId);
    //         if (socket.id !== room.ownerId) return;

    //         const clientSocket = io.sockets.sockets.get(userId);
    //         if (clientSocket) {
    //             clientSocket.join(roomId);
    //             const clientUsername = users.get(userId);
    //             room.members.push(clientSocket.id);
    //             clientSocket.broadcast('joined-room', user, roomId);
    //         }

    //     });

    // });

};