import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ExpressPeerServer } from  'peer';
import cors from 'cors';
import { Server } from 'socket.io';
import socketHandler from './src/socket/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('json spaces', 2);
app.use(cors({
    origin: '*'
}));

app.get('/api', (req, res) => {
    res.send("Ok");
});

const server = app.listen(process.env.PORT, () => console.log("Server is online"));
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
const peerServer = ExpressPeerServer(server, {
	debug: true,
	path: "/",
});

app.use('/', peerServer);
socketHandler(io, peerServer);

app.all('*', (req, res) => res.sendStatus(404));
