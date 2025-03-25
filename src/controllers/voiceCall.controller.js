 // List of authorized forwarding users
 import { VoiceCall } from "../models/voiceCall.model.js";
 import twilio from 'twilio';
 import dotenv from 'dotenv';
 dotenv.config();
 const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
 
 const forwardingUsers = [
    { name: "Ashu", phone: "+17778881010" },
    { name: "Raj", phone: "+14445550011" },
    { name: "Mayank", phone: "+917015670076" }
];

export const assistantRequest = async (req,res) => {
                // compare forwarded from number with the existing user number
                // console.log('assistant request', req.body);
                try {
                  
                
              const sid = req.body.message.call.phoneCallProviderId;
                const callDetails = await getCallDetailsFromTwilio(sid);
                const forwardedFrom =  callDetails?.forwardedFrom ;
                const currentUser =  forwardingUsers.find((user) => user.phone === forwardedFrom);
                  const ownerName = currentUser ? currentUser.name : "AI";
                  // console.log('ownerName', ownerName);
                // Prepare the assistant response
                const assistantConfig = {
                  assistant: {
                    firstMessage: `Hello, this is ${ownerName}'s Assistant. How may I assist you today?`,
                    model: {
                      provider: "openai",
                      model: "gpt-4-turbo",
                      messages: [
                        {
                          role: "system",
                          content: `
                            You are an AI call assistant handling incoming calls.
                
                            ---
                            ### **Step 1: Determine Call Type**
                            - If this call is **forwarded** (forwardedFrom is present), you are acting **as an assistant for ${ownerName}**.
                            - If this call is **direct**, act as a **general AI assistant**.
                
                            ---
                            ### **Case 1: Forwarded Call (Assistant for ${ownerName})**
                            - Greet: "Hello, this is ${ownerName}'s Assistant. How may I help you?"
                            - Identify if the caller's inquiry is related to:
                              - Real Estate
                              - Loan
                              - Policy
                              - Credit Card
                            - If **related to these topics**:
                              - Set "spam = true" in structured data.
                              - Collect:
                                - Caller Name
                                - Purpose of Call
                              - Inform: "Thank you, I will inform ${ownerName}. Have a great day!"
                              - **End the call**.
                            - If **not spam**:
                              - Set "spam = false" in structured data.
                              - Collect:
                                - Caller Name
                              - If caller asks for **${ownerName}**, use the **transfer_call tool** to **forward the call to ${forwardedFrom}**.
                
                            ---
                            ### **Case 2: Direct Call (General AI Assistant)**
                            - Greet: "Hello, this is AI Assistant. How can I assist you today?"
                            - Answer general queries.
                            - If caller requests important information:
                              - Take structured notes (name, purpose, important details).
                              - Store notes and end call politely.
                            - If caller insists on speaking to a human:
                              - Inform them: "${ownerName} is unavailable right now. I can take a message for you."
                              - Store their request and **end the call gracefully**.
                          `
                        }
                      ],
                      tools: [
                        {
                            type: "endCall"
                        },
                        {
                         type: "transferCall",
                         destinations: [
                           {
                             type: "number",
                             number: "+18782151443",
                             message: `I am forwarding your call to ${ownerName}. Please stay on the line.`
                           },
                         ]
                       }
                      
                       ],
                    },
                    analysisPlan: {
                    
                      summaryPrompt: "You are an expert note-taker. You will be given a transcript of a call. Summarize the call in 2-3 sentences, if applicable."
                        
                        , structuredDataPrompt: "You are an expert data extractor. You will be given a transcript of a call. Extract structured data per the JSON Schema. Capture additional relevant details such as order ID, purpose, company name, phone number, or any extra information provided by the caller. Make sure to extract these details even if they are not explicitly mentioned in the schema.",
                        
                           structuredDataSchema: {
                             type: "object",
                             properties: {
                               name: { "type": "string" },
                               email: { "type": "string" },
                               forwardedFrom: { type: "string", default: callDetails?.forwardedFrom || "Unknown" }
                              },
                               additionalProperties: true  // Allow the assistant to extract extra dynamic fields
                           //   "required": ["field1", "field2"]
                           }
                         
                         
          
          
                    },
                  }
                };
          
           
                res.json(assistantConfig );
              } catch (error) {
               console.log('assistant request error'  , error);   
              }
              }


function formatToIST(utcDate) {
  const date = new Date(utcDate);

  const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
  };

  return new Intl.DateTimeFormat("en-IN", options).format(date);
}


export const endCallReport =async (req,res) => {
    
    const  {analysis, artifact,customer,endedReason,startedAt,endedAt, durationMinutes,phoneNumber} = req.body.message
    // console.log('end of call report', req.body.message);
     console.log('analysis', analysis);
    // console.log('recordird', artifact.recordingUrl);
    // console.log('customer', customer);
    const {number,provider} = phoneNumber;
    try {
    // const result =     await VoiceCall.insertOne({
    //         name: analysis?.structuredData.name,
    //         customerNumber: customer?.number,
    //         voiceUrl: artifact?.recordingUrl,
    //         transcript: artifact?.transcript,
    //         summary: analysis?.summary,
    //         email: analysis?.structuredData?.email,
    //         forwardFrom: analysis.structuredData?.forwardedFrom,
    //         toNumber: number,
    //         callDuration: durationMinutes,
    //         endedReason,
    //         startedAt: formatToIST(startedAt),
    //         endedAt: formatToIST(endedAt),
    //     }) 

      console.log('db insert operation started');
      console.log("🔍 Checking DB Connection...");
console.log("DB Name:", VoiceCall?.dbName);
console.log("Collection Name:", VoiceCall?.collectionName);

    const result =     await VoiceCall.insertOne({
      name: analysis?.structuredData.name,
      customerNumber: customer?.number,
      voiceUrl: artifact?.recordingUrl,
      // transcript: artifact?.transcript,
      // summary: analysis?.summary,
      // email: analysis?.structuredData?.email,
      forwardFrom: analysis.structuredData?.forwardedFrom,
      toNumber: number,

      }) 

        console.log('result', result);
        res.json("end of call report received");        
    } catch (error) {
        console.log('end call error', error);
        res.json({error , message: 'error in saving the call details'});
    }
   
    
}




async function getCallDetailsFromTwilio(callSid) {
  console.log('callSid', callSid);
    try {
        const call = await client.calls(callSid).fetch();
        console.log("Call SID:", call.sid);
        console.log("From:", call.from);
        console.log("To:", call.to);
        console.log("forwardedFrom:", call.forwardedFrom);
        return call;
    } catch (error) {
        console.error("Error fetching call details:", error);
        return null;
    }
}


// *** extract the  dynamic important data from the call**********************
// analysis {
//   summary: "The caller, Lakshay, contacted customer service to check on the status of order #34567. The AI assistant explained they cannot access order statuses and suggested checking the website/app or contacting the company's customer service directly. When Lakshay asked the assistant to keep their order number, the assistant clarified they cannot store order numbers.",
//   structuredData: {
//     name: 'Lakshay',
//     email: '',
//     forwardedFrom: '+13179678680',
//     orderId: '34567',
//     purpose: 'Check order status'
//   },
//   successEvaluation: 'true'
// }








  



// {      
//   assistant: {
//   firstMessage: "Hi there, how are you?",
//   model: {
//      provider: "openai",
//      model: "gpt-3.5-turbo",
//      messages: [
//         {
//           role: "system",
//        //    content: "You're Ryan's assistant, when user asks for check user list calls the 'existing_user' tool to check the list of users."
//        // when user ask can i speak with ryan, you must transfer the call using the 'transfer_call' tool.
//           content: "You're Ryan's assistant,  just after greeting asks user name & email. try to engage with the caller, determine the purpose of their call, and take appropriate action."
         
//        }
//      ],
//      tools: [
//        {
//            type: "endCall"
//        },
//        {
//         type: "transferCall",
//         destinations: [
//           {
//             type: "number",
//             number: "+18782151443",
//             message: `I am forwarding your call to ${ownerName}. Please stay on the line.`
//           },
//         ]
//       }
     
//       ],
     
//   },
//   analysisPlan: {
       
//        summaryPrompt: "You are an expert note-taker. You will be given a transcript of a call. Summarize the call in 2-3 sentences, if applicable."
         
//          , structuredDataPrompt: "You are an expert data extractor. Extract all relevant details from the conversation, including any names, phone numbers, email addresses, dates, and any additional context provided by the caller",
         
//             structuredDataSchema: {
//               type: "object",
//               properties: {
//                 name: { "type": "string" },
//                 email: { "type": "string" },
//                 forwardedFrom: { type: "string", default: callDetails?.forwardedFrom || "Unknown" }
//                },
//                additionalProperties: true  // Allow the assistant to extract extra dynamic fields
//             //   "required": ["field1", "field2"]
//             }
          
          


//      },
//   },
  
  
// }



// end call data {
//     message: {
//       timestamp: 1742221259805,
//       type: 'end-of-call-report',
//       analysis: {
//         summary: 'The call involves a user named Sina Sharma who requests to speak with a technical person. After providing their name and email (sina@gmail.com), they are informed that the call is being transferred.',
//         structuredData: [Object],
//         successEvaluation: 'false'
//       },
//       artifact: {
//         messages: [Array],
//         messagesOpenAIFormatted: [Array],
//         transcript: 'AI: Hi there. How are you?\n' +
//           "User: I'm good. Can I talk to technical person?\n" +
//           'AI: Sure. I can assist you. May I have your name and email address, please?\n' +
//           'User: Sina Sharma. And my email is Sina at Gmail dot com.\n' +
//           'AI: Transferring the call now.\n',
//         recordingUrl: 'https://storage.vapi.ai/e0734e94-84ac-4f0e-945c-36b3fa3df5b5-1742221258427-b7dcae74-6663-4863-8287-6119e167ffc2-mono.wav',
//         stereoRecordingUrl: 'https://storage.vapi.ai/e0734e94-84ac-4f0e-945c-36b3fa3df5b5-1742221258428-fc7a3d44-80ec-43c9-999e-03155dcaf86e-stereo.wav'
//       },
//       startedAt: '2025-03-17T14:20:34.846Z',
//       endedAt: '2025-03-17T14:20:55.922Z',
//       endedReason: 'assistant-forwarded-call',
//       cost: 0.0385,
//       costBreakdown: {
//         stt: 0.0041,
//         llm: 0.0006,
//         tts: 0.0136,
//         vapi: 0.0176,
//         total: 0.0385,
//         llmPromptTokens: 997,
//         llmCompletionTokens: 40,
//         ttsCharacters: 151,
//         voicemailDetectionCost: 0,
//         knowledgeBaseCost: 0,
//         analysisCostBreakdown: [Object]
//       },
//       costs: [
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object]
//       ],
//       durationMs: 21076,
//       durationSeconds: 21.076,
//       durationMinutes: 0.3513,
//       summary: 'The call involves a user named Sina Sharma who requests to speak with a technical person. After providing their name and email (sina@gmail.com), they are informed that the call is being transferred.',
//       transcript: 'AI: Hi there. How are you?\n' +
//         "User: I'm good. Can I talk to technical person?\n" +
//         'AI: Sure. I can assist you. May I have your name and email address, please?\n' +
//         'User: Sina Sharma. And my email is Sina at Gmail dot com.\n' +
//         'AI: Transferring the call now.\n',
//       messages: [
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object]
//       ],
//       recordingUrl: 'https://storage.vapi.ai/e0734e94-84ac-4f0e-945c-36b3fa3df5b5-1742221258427-b7dcae74-6663-4863-8287-6119e167ffc2-mono.wav',
//       stereoRecordingUrl: 'https://storage.vapi.ai/e0734e94-84ac-4f0e-945c-36b3fa3df5b5-1742221258428-fc7a3d44-80ec-43c9-999e-03155dcaf86e-stereo.wav',
//       call: {
//         id: 'e0734e94-84ac-4f0e-945c-36b3fa3df5b5',
//         orgId: '18ef73e8-4485-442d-8879-e7ac350291c6',
//         createdAt: '2025-03-17T14:20:33.821Z',
//         updatedAt: '2025-03-17T14:20:33.821Z',
//         type: 'inboundPhoneCall',
//         monitor: [Object],
//         transport: {},
//         phoneCallProvider: 'twilio',
//         phoneCallProviderId: 'CAfa765dd5504181ab163b7e372bd943ef',
//         phoneCallTransport: 'pstn',
//         status: 'ringing',
//         assistant: [Object],
//         phoneNumberId: 'b882572f-eff7-4647-9ba1-60610e80bcf3',
//         customer: [Object]
//       },
//       phoneNumber: {
//         id: 'b882572f-eff7-4647-9ba1-60610e80bcf3',
//         orgId: '18ef73e8-4485-442d-8879-e7ac350291c6',
//         number: '+13179678680',
//         createdAt: '2025-03-04T18:37:38.290Z',
//         updatedAt: '2025-03-17T06:53:35.098Z',
//         twilioAccountSid: '',
//         twilioAuthToken: '',
//         name: 'twilio-vapi-1',
//         provider: 'twilio',
//         server: [Object],
//         status: 'active'
//       },
//       customer: { number: '+917015670076' },
//       assistant: {
//         model: [Object],
//         firstMessage: 'Hi there, how are you?',
//         analysisPlan: [Object]
//       }
//     }
//   }