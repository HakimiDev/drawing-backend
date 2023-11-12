class User {
    constructor (socket, username) {
        this.socket = socket;
        this.username = username;
    }

    getSocket () {
        return this.socket;
    }

    getId () {
        const userSocket = this.getSocket();
        return userSocket?.id;
    }

    getUsername () {
        return this.username;
    }

};

export default User;