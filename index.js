'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const webhook = require('./routes/webhook');

const app = express();
if (app.get('env') == 'development') {
  require('dotenv').config();
};

app.set('port', (process.env.PORT || 3600));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/webhook', webhook);

app.get('/', (req, res) => {
  res.send('Code2Image botend');
})

app.listen(app.get('port'), () => {
  console.log('Code2Image is running on port ', app.get('port'));
});