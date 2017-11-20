'use strict';

const express = require('express');
const receiveApi = require('../code2image/receive-api')

const router = express.Router();

router.get('/', (req, res) => {
  if (
    req.query &&
    process.env.VERIFICATION_TOKEN &&
    req.query['hub.verify_token'] === process.env.VERIFICATION_TOKEN
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, Wrong token');
  }
});


router.post('/', (req, res) => {
  res.sendStatus(200);

  const data = req.body;
  console.log(
    'New request being processed: ' + JSON.stringify(data, null, 2));
  if (data.object !== 'page') {
    return;
  }

  data.entry.forEach((entry) => {
    entry.messaging.forEach((messagingEvent) => {
      if (messagingEvent.message) {
        receiveApi.handleMessage(messagingEvent);
      }
    });
  });
});


module.exports = router;