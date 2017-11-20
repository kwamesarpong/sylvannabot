'use strict'

const sendApi = require('./send-api');
const getUserProfile = require('./get-user-profile');
const requestCall = require('./request-call');

const handleMessage = (event) => {
  const message = event.message;
  const senderId = event.sender.id;

  if (!message.text) {
    return;
  }
  let text = message.text, messageJSON = {};

  if (text.charAt(0) == '`') {
    let code = text.replace(/[`]/g, "");
    console.log('Code to be sent: ', code);
    let toImageArgs = {
      url_String: "https://code-to-image.herokuapp.com/convert.json",
      method_String: 'POST',
      jsonData_Object: {
        "message": code,
      },
    };
    requestCall(toImageArgs, (error, response, body) => {
      if (error) {
        throw error;
      };
      console.log('Endpoint call result: ', body);
      let toImageResult = JSON.parse(body);
      let imageLink = toImageResult.secure_url;
      messageJSON = {
        "attachment": {
          "type": "image",
          "payload": {
            "url": imageLink,
          }
        }
      };
      sendApi.sendMessage(senderId, messageJSON);
    });
  } else {
    getUserProfile(senderId, (error, response, body) => {
      if (error) {
        throw error;
      };
      let user = JSON.parse(body);
      console.log('User profile result: ', user);


      let welcomeText = "Hey " + user.first_name + "! I can format and highlight syntax in code you type here. You only need to enclose them in backticks '``' and I'll understand B-)";

      messageJSON = {
        "text": welcomeText,
      };

      // let pendingText = "Sorry " + user.first_name + "! Peter is yet to provide endpoints I can call to parse your code! Blame him!! :poop:";

      sendApi.sendMessage(senderId, messageJSON);
    });  
  }
};

module.exports = {
  handleMessage,
};