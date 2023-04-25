const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find()
  .populate(['owner', 'likes'])
  .then( cards => {
    res.send({ data: cards });
  })
  .catch(() => {
    res.status(500).send({ message: 'Что-то пошло не так' });
  })
}

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
  .then((card) => {
    res.send({ data: card})
  })
  .catch(e =>{
    if(e.name == 'ValidationError') {
      res.status(400).send({ message: 'Неверно заполнены поля' })
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' })
    }
  })
}

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
  .orFail(() => {
    throw new Error('Not found')
  })
  .then( card => {
    res.send({ data: card });
  })
  .catch(e =>{
    if(e.name == 'ValidationError') {
      res.status(400).send({ message: 'Неверно заполнены поля' })
    } else if (e.name == 'Card not found') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' })
    }
  })
}

const putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
  .populate(['owner', 'likes'])
  .orFail(() => {
    throw new Error('Not found')
  })
  .then( card => {
    res.send({ data: card });
  })
  .catch(e =>{
    if(e.name == 'ValidationError') {
      res.status(400).send({ message: 'Неверно заполнены поля' })
    } else if (e.name == 'Card not found') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' })
    }
  })
}

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
  .populate(['owner', 'likes'])
  .orFail(() => {
    throw new Error('Not found')
  })
  .then( card => {
    res.send({ data: card });
  })
  .catch(e =>{
    if(e.name == 'ValidationError') {
      res.status(400).send({ message: 'Неверно заполнены поля' })
    } else if (e.name == 'Card not found') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'Что-то пошло не так' })
    }
  })
}

module.exports = { getCards, deleteCard, createCard, putLike, deleteLike }