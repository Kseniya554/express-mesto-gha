const express = require('express');
const userRouter = express.Router();
const { getUsers, getUser, createUser, updateUser, updateAvatar } = require('../controllers/user');

userRouter.get('/users', getUsers)

userRouter.get('/users/:userid', getUser)

userRouter.post('/users', createUser)

userRouter.patch('/users/me', express.json(), updateUser);

userRouter.patch('/users/me/avatar', express.json(), updateAvatar);

module.exports = userRouter;