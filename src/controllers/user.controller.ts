import express, { Router } from 'express';
import { UserService } from '../services/user/user.service';

export const userController: Router = express.Router();

const userService = new UserService();

// Handles logging in
userController.post('/api/user/login', (req, res) => {
  userService
    .login(req.body.username, req.body.password)
    .then(result => {
      res.send(result);
    })
    .catch(e => res.send(e));
});

userController.post('/api/user/signup', (req, res) => {
  userService
    .signUp(req.body.username, req.body.password, req.body.email)
    .then(result => {
      res.send(result);
    })
    .catch(e => res.send(e));
});
