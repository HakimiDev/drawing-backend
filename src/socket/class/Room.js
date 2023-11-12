import uniqid from 'uniqid';

class Room {
    constructor (roomOwner) {
        this.id = uniqid();
        this.owner = roomOwner;
        this.members = [];
    }

    getId () {
        return this.id;
    }

    getOwner () {
        return this.owner;
    }

    isOwner (userId) {
        const ownerId = this.getOwner().getId();
        return userId === ownerId;
    }

    getMembers () {
        return this.members;
    }

    isMember (userId) {
        return this.members.find(u => u?.getId() === userId);
    }

    getMember (userId) {
        const allUsers = [this.getOwner(), ...this.getMembers()];
        return allUsers.find(m => m?.getId() === userId);
    }

    join (user) {
        this.members.push(user);
    }

    leave (user) {
        this.members = this.members.filter(m => m?.getId() !== user?.getId());
    }

};

export default Room;