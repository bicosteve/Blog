const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('./models/User');
const keys = require('./config/keys');

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to DB...!');
  })
  .catch((error) => console.log(error.message));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', require('./routes/auth'));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening to ${port}...`);
});
