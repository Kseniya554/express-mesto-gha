// const users  = require('../models/user');
const User = require('../models/user');

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
      if (e.name === 'User not found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

// const getUserMe = ()

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверно заполнены поля' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
      // console.log(JSON.stringify(e))
    });
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
      if (e.name === 'CastError') {
        res.status(400).send({ message: 'невалидный id' });
      } else if (e.name === 'User not found') {
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
      } else if (e.name === 'User not found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar,
};
