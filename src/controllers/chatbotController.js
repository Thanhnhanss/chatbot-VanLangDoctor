require("dotenv").config();

const db = require('mssql');
import request from "request";
import {
    Wit
} from "node-wit";
import chatbotService from "../services/chatbotServices";
import getOptionSpecificExcludes from "@babel/preset-env/lib/get-option-specific-excludes";
import req from "express/lib/request";
import moment from "moment";

const {
    GoogleSpreadsheet
} = require('google-spreadsheet');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const MY_TOKEN = process.env.MY_TOKEN;
const SPEADSHEET_ID = process.env.SPEADSHEET_ID;
const SPEADSHEET_ID_FEEDBACK = process.env.SPEADSHEET_ID_FEEDBACK;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

const client = new Wit({
    accessToken: MY_TOKEN
});

let writeDataToGoogleSheet_F = async (data1) => {

    let currentDate = new Date();
    const format = "HH:mm DD/MM/YYYY"
    let formartedDate = moment(currentDate).format(format);

    //
    const doc = new GoogleSpreadsheet(SPEADSHEET_ID_FEEDBACK);

    // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth({
        client_email: JSON.parse(`"${GOOGLE_SERVICE_ACCOUNT_EMAIL}"`),
        private_key: JSON.parse(`"${  GOOGLE_PRIVATE_KEY}"`),
    });

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet1 = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]


    //append rows
    await sheet1.addRow({
        "Tên Facebook": data1.username,
        "Email": data1.email,
        "Số điện thoại": data1.phoneNumber,
        "Thời gian": formartedDate,
        "Tên khách hàng": data1.customerName,
        "Góp ý": data1.content,
        "Đánh giá": data1.satisfied,
    });
}
let writeDataToGoogleSheet = async (data) => {

    let currentDate = new Date();
    const format = "HH:mm DD/MM/YYYY"
    let formartedDate = moment(currentDate).format(format);

    //
    const doc = new GoogleSpreadsheet(SPEADSHEET_ID);

    // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth({
        client_email: JSON.parse(`"${GOOGLE_SERVICE_ACCOUNT_EMAIL}"`),
        private_key: JSON.parse(`"${  GOOGLE_PRIVATE_KEY}"`),
    });

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]


    //append rows
    await sheet.addRow({
        "Tên Facebook": data.username,
        "Email": data.email,
        "Số điện thoại": data.phoneNumber,
        "Thời gian": formartedDate,
        "Tên khách hàng": data.customerName,
        "Khoa": data.faculty,
        "Khung giờ": data.time,
    });
}

let getHomepage = (req, res) => {
    return res.render('homepage.ejs');

};

let getWebhook = (req, res) => {

    // Your verify token. Should be a random string.


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

    // // check greeting is here and is confident
    // const thanks = firstTrait(received_message.nlp, 'wit$thanks');
    // const witDemo = await client.message('Hello');
    // callSendAPI(sender_psid, {
    //     "text": JSON.stringify(witDemo)
    // });
    // if (thanks) {
    //     // sendResponse('Hi there!');
    //     callSendAPI(sender_psid, {
    //         "text": "thanks " + thanks.confidence
    //     });
    // } else {
    //     // default logic
    // }

    let response;
    let responses = [];
    let username = await getUserName(sender_psid);
    // Checks if the message contains text
    if (received_message.text) {
        if (received_message.text == 'Tôi bị sốt' || received_message.text == 'ho, sốt, khó thở' || received_message.text == 'Tôi bị sốt, ho , khó thở' || received_message.text == 'bị chảy nước mũi' || received_message.text == 'Bị ho khạc đờm' || received_message.text == 'Bị đau đầu' || received_message.text == 'Bị hoa mắt, chóng mặt' || received_message.text == 'Buồn nôn') {
            response = {
                "text": "bạn đã test covid chưa?"
            }
        } else if (received_message.text == 'Rồi, tôi đã test' || received_message.text == 'Rồi') {
            response = {
                "text": "Kết quả của bạn là dương tính ?"
            }
        } else if (received_message.text == 'Không' || received_message.text == 'Hông' || received_message.text == 'Ko' || received_message.text == 'Tôi âm tính') {
            response = {
                "text": "Vậy tôi sẽ chuyển hướng cho bạn đến mục tư vấn cùng bác sĩ trực tuyến nhé"
            }
        }
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        else
            response = {
                "text": `Chào bạn ${username} bạn đã gửi yêu cầu tư vấn trực tuyến. Chúng tôi đã nhận thông tin và sẽ chuyển hướng đoạn tin nhắn tự động này cho bác sĩ trực tuyến, bạn vui lòng đợi trong ít phút.`
            }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Vui lòng đặt lịch khám",
                    "buttons": [{
                            "type": "postback",
                            "title": "Đặt lịch",
                            "payload": "yes",
                        },
                        {
                            "type": "postback",
                            "title": "Không cần",
                            "payload": "no",
                        }
                    ],
                }
            }
        }
    }


    //Send the response message
    callSendAPI(sender_psid, response);
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
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Xin chào bạn đến với phòng khám của Bác sĩ Văn Lang",
                            "subtitle": "Dưới đây là các lựa chọn",
                            "image_url": IMAGE_GET_STARTED9,
                            "buttons": [{
                                "type": "web_url",
                                "url": `${process.env.URL_DAT_BAN}`,
                                "title": "ĐẶT LỊCH",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true //false: open the webview in new tab
                            }]
                        }]
                    }
                }
            }
            break;
        case 'no':
            response = {
                "text": "Cảm ơn bạn đã quan tâm đến dịch vụ của chúng tôi, cảm ơn quý khách!"
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
        case "CHUAN_DOAN":
            await chatbotService.handleCHUAN_DOAN(sender_psid);
            break;
        case "QUAY_LAI":
            await chatbotService.handleQUAY_LAI(sender_psid);
            break;
        case "CHI_TIET":
            await chatbotService.handleCHI_TIET(sender_psid);
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

    return res.send("Hallo! Cảm ơn bạn đã đến với VanLang doctor <3!");

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

let handleBookTable = async (req, res) => {
    let pool = await db.connect(process.env.CONNECTION_STRING);
    let data = await pool.query('SELECT TEN_KHOA FROM KHOA');
    console.log(data);
    return res.render('book_table.ejs', {
        data: data.recordset.map(obj => obj.TEN_KHOA)
    });
}

let handlePostBookTable = async (req, res) => {
    console.log('Begin handle post book table');
    try {
        let username = await chatbotService.getUserName(req.body.psid);

        //write data to google sheet
        let data = {
            username: username,
            email: req.body.email,
            phoneNumber: `'${req.body.phoneNumber}`,
            customerName: req.body.customerName,
            faculty: req.body.faculty,
            time: req.body.time
        }

        await writeDataToGoogleSheet(data);

        console.log(data);

        let customerName = "";
        if (req.body.customerName === "") {
            customerName = username;
        } else customerName = req.body.customerName;

        // I demo response with sample text
        // you can check database for customer order's status

        let response1 = {
            "text": `--- THÔNG TIN KHÁCH HÀNG ĐẶT LỊCH KHÁM ---
            \nHỌ VÀ TÊN: ${customerName}
            \nEMAIL: ${req.body.email}
            \nSỐ ĐIỆN THOẠI: ${req.body.phoneNumber}
            \nKHOA: ${req.body.faculty}
            \nKHUNG GIỜ: ${req.body.time}
            `
        };

        await chatbotService.callSendAPI(req.body.psid, response1);

        return res.status(200).json({
            message: "ok"
        });

    } catch (e) {
        console.log('Lỗi post book table: ', e)
        return res.status(500).json({
            message: "Server error"
        });
    }

}


let handleFeedBack = (req, res) => {
    return res.render('feedback.ejs');
}
let handlePostFeedback = async (req, res) => {
    console.log('Begin handle post feedback table');
    try {
        let username = await chatbotService.getUserName(req.body.psid);

        //write data to google sheet
        let data1 = {
            username: username,
            email: req.body.email,
            phoneNumber: `'${req.body.phoneNumber}`,
            customerName: req.body.customerName,
            content: req.body.content,
            satisfied: req.body.satisfied
        }

        await writeDataToGoogleSheet_F(data1);

        console.log(data1);

        let customerName = "";
        if (req.body.customerName === "") {
            customerName = username;
        } else customerName = req.body.customerName;

        // I demo response with sample text
        // you can check database for customer order's status

        let response2 = {
            "text": `--- PHẢN HỒI CỦA KHÁCH HÀNG ---
            \nHỌ VÀ TÊN: ${customerName}
            \nEMAIL: ${req.body.email}
            \nSỐ ĐIỆN THOẠI: ${req.body.phoneNumber}
            \nGÓP Ý: ${req.body.content}
            \nĐÁNH GIÁ: ${req.body.satisfied}
            `
        };

        await chatbotService.callSendAPI(req.body.psid, response2);

        return res.status(200).json({
            message: "ok"
        });

    } catch (e) {
        console.log('Lỗi post feedback table: ', e)
        return res.status(500).json({
            message: "Server error"
        });
    }

}

module.exports = {
    getHomepage: getHomepage, //key : value
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    setupProfile: setupProfile,
    setupPresistentMenu: setupPresistentMenu,
    handleBookTable: handleBookTable,
    handlePostBookTable: handlePostBookTable,
    handleFeedBack: handleFeedBack,
    handlePostFeedback: handlePostFeedback,

}