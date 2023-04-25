const express = require('express');
const app = express();
const mongoose = require('mongoose');

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
});

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
console.log(cardRouter);

app.use(express.json());
app.use(userRouter); //Подключаем роутер с пользователями
app.use(cardRouter); //Подключаем роутер с карточками

app.use((req, res, next) => {
  req.user = {
    _id: '6446ae51f7eba23e0438f6f0',
  };
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})
