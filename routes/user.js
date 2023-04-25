const express = require('express');
const userRouter = express.Router();
const { getUsers, getUser, createUser, updateUser, updateAvatar } = require('../controllers/user');

userRouter.get('/users', getUsers)

userRouter.get('/users/:id', getUser)

userRouter.post('/users', createUser)

userRouter.patch('/me', express.json(), updateUser);

userRouter.patch('/me/avatar', express.json(), updateAvatar);

module.exports = userRouter;