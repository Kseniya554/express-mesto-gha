// const users  = require('../models/user');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { generateToken } = require('../utils/token');
const BadRequestError = require('../errors/BadRequestError ');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError ');

const SOLT_ROUNDS = 10;

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
  // res.send({ data: users });
};

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userid } = req.params;
  User.findById(userid)
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
        return;
      }
      next(e);
    });
};

// const getUserMe = ()

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });
    if (newUser) {
      res.status(201).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        _id: newUser._id,
        email: newUser.email,
      });
      return;
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Невалидный email или password'));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь уже существует'));
      return;
    }
    next(err);
  }
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены поля'));
        return;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  // console.log(req.user);
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены поля'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: generateToken({ _id: user._id }),
      });
    })
    .catch(next);
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getUserMe,
};
