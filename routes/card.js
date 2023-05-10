const express = require('express');

const cardRouter = express.Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, deleteCard, createCard, putLike, deleteLike,
} = require('../controllers/card');

const urlRegExp = /^https?:\/\/(www.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*#?$/;

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegExp),
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
