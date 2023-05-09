const express = require('express');

const userRouter = express.Router();
const {
  getUsers, getUser, createUser, updateUser, updateAvatar, getUserMe,
} = require('../controllers/user');

userRouter.get('/users', getUsers);

userRouter.get('/users/:userid', getUser);

userRouter.post('/users', createUser);

userRouter.patch('/users/me', updateUser);

userRouter.patch('/users/me/avatar', updateAvatar);

userRouter.get('/users/me', getUserMe);

module.exports = userRouter;
