import peerController from '../controllers/peer.js';
import User from '../class/User.js';
import Room from '../class/Room.js';

const users = new Map();
const rooms = new Map();

const isRoomOwner = (user) => {
    let isOwner = false;
    for (const room of rooms.values()) {
        if (room.isOwner(user.getId())) {
            isOwner = true;
            break;
        }
    }
    return isOwner;
};

const isInRoom = (user) => {
    let inRoom = false;
    for (const room of rooms.values()) {
        if (room.isMember(user.getId()) || room.isOwner(user.getId())) {
            inRoom = true;
            break;
        }
    }
    return inRoom;
};

export default (io, socket) => {

    socket.on('room:create', (username) => {
        const user = new User(socket, username);
        users.set(socket.id, user);

        // Check if the user is already has a room ...
        if (isInRoom(user)) return;

        const room = new Room(user);
        rooms.set(room.getId(), room);

        socket.join(room.getId());

        // Send room id to the room owner ...
        socket.emit('room:created', room.getId());
    });

    socket.on('room:join', (roomId, username) => {
        if (!rooms.has(roomId)) return;

        const room = rooms.get(roomId);
        const user = new User(socket, username);
        users.set(socket.id, user);

        // Check if the user is already member in the room ...
        if (room.isMember(user.getId()) || room.isOwner(user.getId())) return;
        if (isInRoom(user)) return;

        // Ask the room owner to join the room ...
        const ownerSocket = room.getOwner().getSocket();
        ownerSocket.emit('room:ask:join', user.getId(), room.getId(), { username: user.getUsername() });
    });

    socket.on('room:allow:join', (userId, roomId) => {
        if (!rooms.has(roomId)) return;
        const room = rooms.get(roomId);

        // Check if the socket is the room owner ...
        if (!room.isOwner(socket.id)) return;

        // Add the user into the room ...
        const user = users.get(userId);
        if (!user) return;

        room.join(user);
        user.getSocket().join(roomId);

        // Tell everyone in the room that the new user is joined ...
        io.to(roomId).emit('room:joined', user.getId(), roomId, { username: user.getUsername(), peerId: user.getSocket().peerId });
    });

    socket.on('room:deny:join', (userId, roomId) => { // It may be used for kick members from the room!
        if (!rooms.has(roomId)) return;
        const room = rooms.get(roomId);
        
        // Check if the socket is the room owner ...
        if (!room.isOwner(socket.id)) return;

        const user = users.get(userId);
        if (!user) return;

        room.leave(user);

        // Tell the user that is get a deny ...
        user.getSocket().emit('room:denyed', roomId);
    });

    socket.on('room:leave', (roomId) => {
        if (!rooms.has(roomId)) return;
        const room = rooms.get(roomId);

        // Check if the user member in the room ...
        if (!room.isMember(socket.id)) return;

        // Check if the user is the room owner ...
        if (room.isOwner(socket.id)) {
            // Then remove the room & kick everyone in the room ...
            rooms.delete(roomId);
            
            // Tell everyone that the room is gonna destroyed ...
            io.to(roomId).emit('room:destroyed', roomId);

            io.sockets.clients(roomId).forEach((s) => {
                s.leave(roomId);
            });

        } else {
            // Then just leave the user from the room ...
            const user = users.get(socket.id);
            if (!user) return;

            room.leave(user);
            socket.leave(roomId);

            // Tell everyone that the user is leaved ...
            io.to(roomId).emit('room:leaved', user.getId(), room.getId(), { username: user.getUsername() });
        }
    });



};