import express, { Router } from 'express';
import { RoomService } from '../services/room/room.service';

export const roomsController: Router = express.Router();

const roomService = new RoomService();

// Handles getting room data.
roomsController.get('/api/:roomName', (req, res) => {
  roomService
    .getRoomInfo(req.params.roomname)
    .then(result => {
      res.send(result);
    })
    .catch(e => res.send(e));
});

// Handles room creation.
roomsController.post('/api/create/room', (req, res) => {
  roomService
    .addRoom(req.body.roomName, req.body.adminUserId, req.body.pass)
    .then(result => res.send(result))
    .catch(e => res.send(e));
});
