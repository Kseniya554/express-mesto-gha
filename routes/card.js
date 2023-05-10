const express = require('express');

const cardRouter = express.Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, deleteCard, createCard, putLike, deleteLike,
} = require('../controllers/card');

const regex = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regex),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({ cardId: Joi.string().alphanum().length(24) }),
});

cardRouter.get('/cards', getCards);

cardRouter.delete('/cards/:cardId', validationCardId, deleteCard);

cardRouter.post('/cards', express.json(), validationCreateCard, createCard);

cardRouter.put('/cards/:cardId/likes', validationCardId, putLike);

cardRouter.delete('/cards/:cardId/likes', validationCardId, deleteLike);

module.exports = cardRouter;
