// const users  = require('../models/user');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { generateToken } = require('../utils/token');

const SOLT_ROUNDS = 10;

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
  // res.send({ data: users });
};

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const getUser = (req, res) => {
  const { userid } = req.params;
  User.findById(userid)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id' });
        return;
      }
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

// const getUserMe = ()

const createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: 'Не передан email или password' });
    return;
  }

  try {
    // const userAdmin = await User.findOne({ email });
    // if (userAdmin) {
    //   res.status(409).send({ message: 'Пользователь уже существует' });
    //   return;
    // }
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);

    const newUser = await User.findOne({
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
      res.status(400).send({ message: 'Невалидный email или password' });
      return;
    }
    if (err.code === 11000) {
      res.status(409).send({ message: 'Пользователь уже существует' });
      return;
    }
    res.status(500).send({ message: 'Что-то пошло не так' });
  }
  // хешируем пароль
  // bcrypt.hash(req.body.password, 10)
  //   .then((hash) => User.create({
  //     name: req.body.name,
  //     about: req.body.about,
  //     avatar: req.body.avatar,
  //     email: req.body.email,
  //     password: hash, // записываем хеш в базу
  //   }))
  // .then((user) => {
  //   res.status(201).send({
  //     _id: user._id,
  //     email: user.email,
  //   });
  // })
  // .catch((e) => {
  //   if (e.name === 'ValidationError') {
  //     res.status(400).send({ message: 'Неверно заполнены поля' });
  //   } else {
  //     res.status(500).send({ message: 'Что-то пошло не так' });
  //   }
  //   // console.log(JSON.stringify(e))
  // });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверно заполнены поля' });
      } else if (e.name === 'CastError') {
        res.status(400).send({ message: 'невалидный id' });
      } else if (e.message === 'User not found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateAvatar = (req, res) => {
  // console.log(req.user);
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверно заполнены поля' });
      } else if (e.name === 'CastError') {
        res.status(400).send({ message: 'невалидный id' });
      } else if (e.message === 'User not found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const login = async (req, res) => {
  // const {
  //   name, about, avatar, email, password,
  // } = req.body;

  // if (!email || !password) {
  //   res.status(401).send({ message: 'Не правильные email или password' });
  // }
  // try {
  //   const userAdmin = await User.findOne({ email }).select('+password');
  //   if (!userAdmin) {
  //     res.status(409).send({ message: 'Пользователь уже существует' });
  //     return;
  //   }
  //   const matched = await bcrypt.compare(password, userAdmin.password)
  //   if(!matched) {
  //   res.status(401).send({ message: 'Не правильные email или password' });
  //   return;
  //   }
  //   const token = generateToken({ _id: userAdmin._id, email: userAdmin.email })
  //   res.status(200).send({ message: 'Добро пожаловать', token });
  //   return;
  // } catch {
  //   res.status(500).send({ message: 'Что-то пошло не так' });
  // }
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
    // создадим токен
      const token = generateToken({ _id: user._id });
      // вернём токен
      res.send({ token });
    })
    .then((user) => {
      if (!user) {
      // пользователь не найден — отклоняем промис
        // с ошибкой и переходим в блок catch
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // пользователь найден
      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // аутентификация успешна
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      // возвращаем ошибку аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getUserMe,
};
