const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError ');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены поля'));
      } else {
        next(new NotFoundError('Что-то пошло не так'));
      }
      // console.log(JSON.stringify(e));
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с таким id не найдена'));
      } else if (card.owner.toString() !== req.user._id) {
        next(new NotFoundError('Карточку нельзя удалить'));
      }
      return card.deleteOne()
        .then(() => res.status(200).send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверно заполнены поля'));
        return;
      }
      next(err);
    });
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверно заполнены поля'));
      }
      next(err);
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверно заполнены поля'));
      }
      next(err);
    });
};

module.exports = {
  getCards, deleteCard, createCard, putLike, deleteLike,
};
