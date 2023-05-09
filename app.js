require('dotenv').config();

const express = require('express');

const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { login, createUser } = require('./controllers/user');
// console.log(cardRouter);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(express.json());
// авторизация
app.use(auth);
app.use(auth, userRouter);
app.use(auth, cardRouter);
app.use(helmet());

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

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый URL не существует' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// http://localhost:3000

// {
//   "name": "name",
//   "about": "about",
//   "avatar": "avatar"
// }
