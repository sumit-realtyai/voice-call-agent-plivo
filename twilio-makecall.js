const  dotenv  = require('dotenv') ;
dotenv.config();

// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

 async function createCall() {
    console.log('call initiated : ', accountSid ," : ", authToken)
    try {
        
    
  const call = await client.calls.create({
    from: "+13179678680",
    to: "+916260740065",
    url: "http://demo.twilio.com/docs/voice.xml",
  });

  console.log(call.sid);
} catch (error) {
       console.log('failed to call', error.message); 
}
}

// createCall();
module.exports = createCall;