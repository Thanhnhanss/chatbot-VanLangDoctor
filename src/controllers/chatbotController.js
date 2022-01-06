require("dotenv").config();
import request from "request";
import {
    Wit
} from "node-wit";
import chatbotService from "../services/chatbotServices";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const MY_TOKEN = process.env.MY_TOKEN;
const client = new Wit({
    accessToken: MY_TOKEN
});

let getHomepage = (req, res) => {
    return res.render('homepage.ejs');

};

let getWebhook = (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

let postWebhook = (req, res) => {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

//GetUserName
let getUserName = (sender_psid) => {
    return new Promise((resolve, reject) => {
        request({
                "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
                "method": "GET",
            },
            (err, res, body) => {
                console.log(body);
                if (!err) {
                    body = JSON.parse(body);
                    let username = `${body.last_name} ${body.first_name}`;
                    resolve(username);
                } else {
                    console.error("Unable to send message:" + err);
                    reject(err);
                }
            }
        );
    })
};

// Handles messages events
function firstTrait(nlp, name) {
    return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

async function handleMessage(sender_psid, received_message) {

    // check greeting is here and is confident
    const thanks = firstTrait(received_message.nlp, 'wit$thanks');
    const witDemo = await client.message('Hello');
    callSendAPI(sender_psid, witDemo);
    if (thanks) {
        // sendResponse('Hi there!');
        callSendAPI(sender_psid, {
            "text": "thanks " + thanks.confidence
        });
    } else {
        // default logic
    }

    // let response;
    // let username = await getUserName(sender_psid);
    // // Checks if the message contains text
    // if (received_message.text) {
    //     if (received_message.text == 'ho sốt')
    //         response = {
    //             "text": "bạn đã test covid chưa?"
    //         }
    //     // Create the payload for a basic text message, which
    //     // will be added to the body of our request to the Send API

    //     else
    //         response = {

    //             "text": `Chào bạn ${username} cảm ơn bạn đã gửi cho chúng tôi tin nhắn : "${received_message.text}" chúng tôi sẽ liên hệ lại cho bạn nhanh chóng!`
    //         }
    // } else if (received_message.attachments) {
    //     // Get the URL of the message attachment
    //     let attachment_url = received_message.attachments[0].payload.url;
    //     response = {
    //         "attachment": {
    //             "type": "template",
    //             "payload": {
    //                 "template_type": "generic",
    //                 "elements": [{
    //                     "title": "Đây là thông tin của bạn phải không?",
    //                     "subtitle": "Tap a button to answer.",
    //                     "image_url": attachment_url,
    //                     "buttons": [{
    //                             "type": "postback",
    //                             "title": "Đúng rồi",
    //                             "payload": "yes",
    //                         },
    //                         {
    //                             "type": "postback",
    //                             "title": "Không phải",
    //                             "payload": "no",
    //                         }
    //                     ],
    //                 }]
    //             }
    //         }
    //     }
    // }

    // Send the response message
    // callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    switch (payload) {
        case 'yes':
            response = {
                "text": "thanks!"
            }
            break;
        case 'no':
            response = {
                "text": "Oops, try sending another image."
            }
            break;
        case "RESTART_BOT":
            await chatbotService.handleGetStarted(sender_psid);
            break;
        case "GET_STARTED":
            await chatbotService.handleGetStarted(sender_psid);
            break;
        case "THEM_DV":
            await chatbotService.handleSendTHEMDV(sender_psid);
            break;
        case "TUVAN_ONL":
            await chatbotService.handleTUVAN_ONL(sender_psid);
            break;
        case "DAT_LICH":
            await chatbotService.handleDAT_LICH(sender_psid);
            break;
        case "CHUAN_DOAN":
            await chatbotService.handleCHUAN_DOAN(sender_psid);
            break;
        case "QUAY_LAI":
            await chatbotService.handleQUAY_LAI(sender_psid);
            break;
        default:
            response = {
                "text": `oop~! I don't know response with posrback ${payload}`
            }
    }

    // // Send the message to acknowledge the postback
    // callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {
            "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

let setupProfile = async (req, res) => {
    //call facebook API 
    let request_body = {
        "get_started": {
            "payload": "GET_STARTED"
        },
        "whitelisted_domains": ["https://chatbotbacsivanlang.herokuapp.com/"],

    }

    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v12.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": {
            "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body)
        if (!err) {
            console.log('Setup User ProFILE success!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });

    return res.send("Setup User ProFILE success!");

}

let setupPresistentMenu = async (req, res) => {
    let request_body = {
        "persistent_menu": [{
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [{
                    "type": "web_url",
                    "title": "Facebook page VLU",
                    "url": "https://www.facebook.com/B%C3%A1c-s%C4%A9-V%C4%83n-Lang-109866731562751/?ref=pages_you_manage",
                    "webview_height_ratio": "full"
                },
                {
                    "type": "postback",
                    "title": "Khởi động lại bot",
                    "payload": "RESTART_BOT"
                },
            ]
        }]
    }
    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v12.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": {
            "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body)
        if (!err) {
            console.log('Setup Presistent menu success!')
        } else {
            console.error("Unable  Presistent menu message:" + err);
        }
    });

    return res.send("Setup  Presistent menu success!");
}



module.exports = {
    getHomepage: getHomepage, //key : value
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    setupProfile: setupProfile,
    setupPresistentMenu: setupPresistentMenu,

}