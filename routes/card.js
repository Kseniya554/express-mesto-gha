const express = require('express');
const cardRouter = express.Router();
const { getCards, deleteCard, createCard, putLike, deleteLike } = require('../controllers/card');

cardRouter.get('/cards', getCards)

cardRouter.delete('/:cardId', deleteCard);

cardRouter.post('/', express.json(), createCard);

cardRouter.put('/:cardId/likes', putLike);

cardRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardRouter;