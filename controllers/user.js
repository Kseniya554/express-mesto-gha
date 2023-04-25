// const users  = require('../models/user');
const User = require('../models/user')

const getUsers = (req, res) => {
  User.find().then( users => {
    res.send({ data: users });
  })
  .catch(() => {
    res.status(500).send({ message: 'Что-то пошло не так' });
  })
  // res.send({ data: users });
}

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
  .orFail(() => {
    throw new Error('Not found')
  })
  .then( users => {
    res.send({ data: users });
  })
  .catch((e) => {
    if (e.name === 'CastError') {
      res.status(400).send({ message: 'Невалидный id' });
    } else if(e.name == 'Not found') {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' });
    }
  })
  // User.findById(id).then( user => {
  //   res.send({ data: user });
  // })
  // .catch((e) => {
  //   res.status(500).send({ message: 'Что-то пошло не так' });
  // })

  // if (user) {
  //   res.send({ data: user});
  // } else {
  //   res.status(404).send({ message: 'User not found'});
  // }
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({name, about, avatar}).then(user => {
    res.status(201).send({ data: user })
  })
  .catch(e =>{
    if(e.name == 'ValidationError') {
      res.status(400).send({ message: 'Неверно заполнены поля' })
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' })
    }
  })
  // const user = {
  //   id: Math.floor(Math.random()*1000+1), name, about, avatar
  // }
  // users.push(user);
}

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      } else {
        res.send({ data: user });
      }
    })
    .catch(e =>{
      if(e.name == 'ValidationError') {
        res.status(400).send({ message: 'Неверно заполнены поля' })
      } else if (e.name == 'User not found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' })
      }
    })
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      } else {
        res.send({ data: user });
      }
    })
    .catch(e =>{
      if (e.name == 'User not found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' })
      }
    })
}

module.exports = { getUsers, getUser, createUser, updateUser, updateAvatar }