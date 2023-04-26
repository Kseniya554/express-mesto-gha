const express = require('express');
const cardRouter = express.Router();
const { getCards, deleteCard, createCard, putLike, deleteLike } = require('../controllers/card');

cardRouter.get('/cards', getCards)

cardRouter.delete('/cards/:cardId', deleteCard);

cardRouter.post('/cards', express.json(), createCard);

cardRouter.put('/cards/:cardId/likes', putLike);

cardRouter.delete('/cards/:cardId/likes', deleteLike);

module.exports = cardRouter;