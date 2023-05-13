const express = require('express');

const userRouter = express.Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, createUser, updateUser, updateAvatar, getUserMe,
} = require('../controllers/user');

const regex = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regex),
  }),
});

userRouter.get('/users', getUsers);

userRouter.get('/users/:userid', celebrate({ params: Joi.object().keys({ userId: Joi.string().hex().length(24) }) }), getUser);

userRouter.post('/users', createUser);

userRouter.patch('/users/me', express.json(), validationUpdateUser, updateUser);

userRouter.patch('/users/me/avatar', express.json(), validationUpdateAvatar, updateAvatar);

userRouter.get('/users/me', getUserMe);

module.exports = userRouter;
