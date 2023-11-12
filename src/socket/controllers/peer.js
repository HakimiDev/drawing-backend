const peers = new Set();

const addPeer = (peerId) => {
    peers.add(peerId);
};

const removePeer = (peerId) => {
    peers.delete(peerId);
};

const isValidPeer = (peerId) => {
    return peers.has(peerId);
};

const registerPeer = (io, socket) => {
    socket.on('registerPeer', (peerId) => {
        if (!isValidPeer(peerId)) return;
        socket.peerId = peerId;
    });
};

export default {
    addPeer,
    removePeer,
    isValidPeer,
    registerPeer
};