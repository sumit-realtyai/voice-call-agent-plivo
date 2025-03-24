






// assistant request {
  // message: {
    // timestamp: 1742227967987,
    // type: 'assistant-request',
    // call: {
    //   id: '4b80529c-f790-4e4b-bbe3-8331a45f42bb',
    //   orgId: '18ef73e8-4485-442d-8879-e7ac350291c6',
    //   createdAt: '2025-03-17T16:12:47.901Z',
    //   updatedAt: '2025-03-17T16:12:47.901Z',
    //   type: 'inboundPhoneCall',
    //   status: 'ringing',
    //   phoneCallProvider: 'twilio',
    //   phoneCallProviderId: 'CA1ab63ca391f687c4681f6a1194ee4c60',
    //   phoneCallTransport: 'pstn',
    //   phoneNumberId: 'b882572f-eff7-4647-9ba1-60610e80bcf3',
    //   assistantId: null,
    //   squadId: null,
    //   customer: [Object]
    // },
    // phoneNumber: {
    //   id: 'b882572f-eff7-4647-9ba1-60610e80bcf3',
    //   orgId: '18ef73e8-4485-442d-8879-e7ac350291c6',
    //   assistantId: null,
    //   number: '+13179678680',
    //   createdAt: '2025-03-04T18:37:38.290Z',
    //   updatedAt: '2025-03-17T06:53:35.098Z',
    //   stripeSubscriptionId: null,
    //   twilioAccountSid: '',
    //   twilioAuthToken: '',
    //   stripeSubscriptionStatus: null,
    //   stripeSubscriptionCurrentPeriodStart: null,
    //   name: 'twilio-vapi-1',
    //   credentialId: null,
    //   serverUrl: null,
    //   serverUrlSecret: null,
    //   twilioOutgoingCallerId: null,
    //   sipUri: null,
    //   provider: 'twilio',
    //   fallbackForwardingPhoneNumber: null,
    //   fallbackDestination: null,
    //   squadId: null,
    //   credentialIds: null,
    //   numberE164CheckEnabled: null,
    //   authentication: null,
    //   server: [Object],
    //   useClusterSip: null,
    //   status: 'active'
    // },
    // customer: { number: '+917015670076' }
  // }
// }

// vapi-inbound end-of-call-report
// analysis {
//   summary: 'The transcript shows a brief call where the AI greets the user and asks how they are. The user, who identifies himself as Sumit with email "Sumit@DirectGmail.com," responds positively. The AI then mentions forwarding the call to "my yank," though the context for this transfer is not provided in the transcript.',
//   structuredData: { name: 'Sumit', email: 'Sumit@DirectGmail.com' },
//   successEvaluation: 'false'
// }
// artifact {
  // messages: [
  //   {
  //     role: 'system',
  //     message: "You're Ryan's assistant,  just after greeting asks user name & email. try to engage with the caller, determine the purpose of their call, and take appropriate action.",
  //     time: 1742227968710,
  //     secondsFromStart: 0
  //   },
  //   {
  //     role: 'bot',
  //     message: 'Hi there. How are you?',
  //     time: 1742227970414,
  //     endTime: 1742227971534,
  //     secondsFromStart: 1.4399999,
  //     duration: 1120,
  //     source: ''
  //   },
  //   {
  //     role: 'user',
  //     message: "Yeah. Hi. I'm good. What about you?",
  //     time: 1742227973794,
  //     endTime: 1742227975974,
  //     secondsFromStart: 4.82,
  //     duration: 2180
  //   },
  //   {
  //     role: 'bot',
  //     message: "I'm doing great. Thank you for asking. Can I start by getting your name and email, please?",
  //     time: 1742227977113.999,
  //     endTime: 1742227981494,
  //     secondsFromStart: 8.139999,
  //     duration: 4060.001953125,
  //     source: ''
  //   },
  //   {
  //     role: 'user',
  //     message: 'Yeah. Sure. My name is Sumit. And the email is Sumit at Direct Gmail dot com.',
  //     time: 1742227983743.9995,
  //     endTime: 1742227989464,
  //     secondsFromStart: 14.7699995,
  //     duration: 5479.99951171875
  //   },
  //   {
  //     toolCalls: [Array],
  //     role: 'tool_calls',
  //     message: '',
  //     time: 1742227988794,
  //     secondsFromStart: 19.778
  //   },
  //   {
  //     role: 'bot',
  //     message: 'I am forwarding your call to my yank.',
  //     time: 1742227990894,
  //     endTime: 1742227992834,
  //     secondsFromStart: 21.92,
  //     duration: 1940,
  //     source: ''
  //   },
  //   {
  //     role: 'tool_call_result',
  //     time: 1742227993395,
  //     secondsFromStart: 24.379,
  //     name: 'transferCall',
  //     result: 'Success.',
  //     toolCallId: 'call_1RY9QSDkjzTSGm4dyHLKMUHy'
  //   }
  // ],
  // messagesOpenAIFormatted: [
  //   {
  //     role: 'system',
  //     content: "You're Ryan's assistant,  just after greeting asks user name & email. try to engage with the caller, determine the purpose of their call, and take appropriate action."
  //   },
  //   { role: 'assistant', content: 'Hi there. How are you?' },
  //   { role: 'user', content: "Yeah. Hi. I'm good. What about you?" },
  //   {
  //     role: 'assistant',
  //     content: "I'm doing great. Thank you for asking. Can I start by getting your name and email, please?"
  //   },
  //   {
  //     role: 'user',
  //     content: 'Yeah. Sure. My name is Sumit. And the email is Sumit at Direct Gmail dot com.'
  //   },
  //   { role: 'assistant', tool_calls: [Array] },
  //   {
  //     role: 'tool',
  //     tool_call_id: 'call_1RY9QSDkjzTSGm4dyHLKMUHy',
  //     content: 'Success.'
  //   },
  //   {
  //     role: 'assistant',
  //     content: 'I am forwarding your call to my yank.'
  //   }
  // ],
  // transcript: 'AI: Hi there. How are you?\n' +
  //   "User: Yeah. Hi. I'm good. What about you?\n" +
  //   "AI: I'm doing great. Thank you for asking. Can I start by getting your name and email, please?\n" +
  //   'User: Yeah. Sure. My name is Sumit. And the email is Sumit at Direct Gmail dot com.\n' +
  //   'AI: I am forwarding your call to my yank.\n',
  // recordingUrl: 'https://storage.vapi.ai/4b80529c-f790-4e4b-bbe3-8331a45f42bb-1742227996055-be0b9067-de78-4c4b-b7ba-bce9e5036dde-mono.wav',
  // stereoRecordingUrl: 'https://storage.vapi.ai/4b80529c-f790-4e4b-bbe3-8331a45f42bb-1742227996056-2113af4d-1b30-485f-82e2-df996d5be985-stereo.wav'
// }
// customer { number: '+917015670076' }



































// vapi-inbound assistant-request
// assistant request {
//   message: {
//     timestamp: 1742228349419,
//     type: 'assistant-request',
//     call: {
//       id: '64ab0e6a-1fe7-4c9b-b668-0d709d5447af',
//       orgId: '18ef73e8-4485-442d-8879-e7ac350291c6',
//       createdAt: '2025-03-17T16:19:09.414Z',
//       updatedAt: '2025-03-17T16:19:09.414Z',
//       type: 'inboundPhoneCall',
//       status: 'ringing',
//       phoneCallProvider: 'twilio',
//       phoneCallProviderId: 'CA532b10d871592283d82d12a0e47afd22',
//       phoneCallTransport: 'pstn',
//       phoneNumberId: 'b882572f-eff7-4647-9ba1-60610e80bcf3',
//       assistantId: null,
//       squadId: null,
//       customer: [Object]
//     },
//     phoneNumber: {
//       id: 'b882572f-eff7-4647-9ba1-60610e80bcf3',
//       orgId: '18ef73e8-4485-442d-8879-e7ac350291c6',
//       assistantId: null,
//       number: '+13179678680',
//       createdAt: '2025-03-04T18:37:38.290Z',
//       updatedAt: '2025-03-17T06:53:35.098Z',
//       stripeSubscriptionId: null,
//       twilioAccountSid: '',
//       twilioAuthToken: '',
//       stripeSubscriptionStatus: null,
//       stripeSubscriptionCurrentPeriodStart: null,
//       name: 'twilio-vapi-1',
//       credentialId: null,
//       serverUrl: null,
//       serverUrlSecret: null,
//       twilioOutgoingCallerId: null,
//       sipUri: null,
//       provider: 'twilio',
//       fallbackForwardingPhoneNumber: null,
//       fallbackDestination: null,
//       squadId: null,
//       credentialIds: null,
//       numberE164CheckEnabled: null,
//       authentication: null,
//       server: [Object],
//       useClusterSip: null,
//       status: 'active'
//     },
//     customer: { number: '+14843559514' }
//   }
// }
// vapi-inbound status-update
// vapi-inbound speech-update
// vapi-inbound speech-update
// vapi-inbound conversation-update
// vapi-inbound speech-update
// vapi-inbound conversation-update
// vapi-inbound speech-update
// vapi-inbound speech-update
// vapi-inbound conversation-update
// vapi-inbound conversation-update
// vapi-inbound speech-update
// vapi-inbound conversation-update
// vapi-inbound speech-update
// vapi-inbound conversation-update
// vapi-inbound speech-update
// vapi-inbound speech-update
// vapi-inbound conversation-update
// vapi-inbound conversation-update
// vapi-inbound conversation-update
// vapi-inbound speech-update
// vapi-inbound status-update
// vapi-inbound end-of-call-report
// analysis {
//   summary: `The transcript shows a brief exchange where an AI assistant, identifying as "Ryan's assistant," asks for the user's name and email address. The user questions where the call is coming from before the AI clarifies they are calling from "the office" and repeats the request for personal information.`,
//   structuredData: { name: null, email: null },
//   successEvaluation: 'false'
// }
// artifact {
//   messages: [
//     {
//       role: 'system',
//       message: "You're Ryan's assistant,  just after greeting asks user name & email. try to engage with the caller, determine the purpose of their call, and take appropriate action.",
//       time: 1742228350020,
//       secondsFromStart: 0
//     },
//     {
//       role: 'bot',
//       message: 'Hi there. How are you?',
//       time: 1742228351618,
//       endTime: 1742228352758,
//       secondsFromStart: 1.4399999,
//       duration: 1140,
//       source: ''
//     },
//     {
//       role: 'user',
//       message: "I'm doing good. How are you?",
//       time: 1742228353698,
//       endTime: 1742228354848,
//       secondsFromStart: 3.52,
//       duration: 1150
//     },
//     {
//       role: 'bot',
//       message: "I'm great. You for asking. May I have your name and email address, please?",
//       time: 1742228356358,
//       endTime: 1742228360938,
//       secondsFromStart: 6.18,
//       duration: 3300,
//       source: ''
//     },
//     {
//       role: 'user',
//       message: 'Where are you calling from?',
//       time: 1742228362328,
//       endTime: 1742228363538,
//       secondsFromStart: 12.15,
//       duration: 1210
//     },
//     {
//       role: 'bot',
//       message: "I'm Ryan's assistant. Calling from the office. Could you please provide your name and email address so we can assist you better?",
//       time: 1742228365158.0005,
//       endTime: 1742228371118,
//       secondsFromStart: 14.9800005,
//       duration: 5319.99951171875,
//       source: ''
//     }
//   ],
//   messagesOpenAIFormatted: [
//     {
//       role: 'system',
//       content: "You're Ryan's assistant,  just after greeting asks user name & email. try to engage with the caller, determine the purpose of their call, and take appropriate action."
//     },
//     { role: 'assistant', content: 'Hi there. How are you?' },
//     { role: 'user', content: "I'm doing good. How are you?" },
//     {
//       role: 'assistant',
//       content: "I'm great. You for asking. May I have your name and email address, please?"
//     { role: 'user', content: "I'm doing good. How are you?" },
//     {
//       role: 'assistant',
//       content: "I'm great. You for asking. May I have your name and email address, please?"
//     {
//       role: 'assistant',
//       content: "I'm great. You for asking. May I have your name and email address, please?"
//       role: 'assistant',
//       content: "I'm great. You for asking. May I have your name and email address, please?"
//       content: "I'm great. You for asking. May I have your name and email address, please?"
//     },
//     { role: 'user', content: 'Where are you calling from?' },
//     {
//       role: 'assistant',
//       content: "I'm Ryan's assistant. Calling from the office. Could you please provide your name and email address so we can assist you better?"
//     }
//   ],
//   transcript: 'AI: Hi there. How are you?\n' +
//     "User: I'm doing good. How are you?\n" +
//     "AI: I'm great. You for asking. May I have your name and email address, please?\n" +
//     'User: Where are you calling from?\n' +
//     "AI: I'm Ryan's assistant. Calling from the office. Could you please provide your name and email address so we can assist you better?\n",
//   recordingUrl: 'https://storage.vapi.ai/64ab0e6a-1fe7-4c9b-b668-0d709d5447af-1742228374189-7cbcc6bd-28c0-478e-a63d-79f93bafad98-mono.wav',
//   stereoRecordingUrl: 'https://storage.vapi.ai/64ab0e6a-1fe7-4c9b-b668-0d709d5447af-1742228374190-a4fd86bc-c08c-4244-8d09-ddd99d8da692-stereo.wav'
// }
// customer { number: '+14843559514' }