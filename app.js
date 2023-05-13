require('dotenv').config();

const express = require('express');

const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const { cardRouter, regex } = require('./routes/card');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const userRouter = require('./routes/user');
const { login, createUser } = require('./controllers/user');
// console.log(cardRouter);
const NotFoundError = require('./errors/NotFoundError');

app.use(express.json());

app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required().alphanum(),
  }),
}), login);
app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

app.use(helmet());
// авторизация
app.use(auth, userRouter);
app.use(auth, cardRouter);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый URL не существует'));
});
app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// {
//   "name": "name",
//   "about": "about",
//   "avatar": "avatar"
// }
