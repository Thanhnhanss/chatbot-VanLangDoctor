require("dotenv").config();
import {
    response
} from "express";
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = 'https://bit.ly/IMG_TMP';


let callSendAPI = (sender_psid, response) => {
    let request_body = {
        recipient: {
            "id": sender_psid,
        },
        "message": response,
    };

    // Send the HTTP request to the Messenger Platform
    request({
            "uri": "https://graph.facebook.com/v9.0/me/messages",
            "qs": {
                access_token: PAGE_ACCESS_TOKEN,
            },
            "method": "POST",
            "json": request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log("message sent!");
            } else {
                console.error("Unable to send message:" + err);
            }
        }
    );
};

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

let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let response1 = {
                "text": `Xin chào bạn ${username} đã đến với website Bác sĩ Văn Lang`,
            };

            let response2 = sendGetstartedTemplate();

            //send text messange
            await callSendAPI(sender_psid, response1);

            //send generic template 
            await callSendAPI(sender_psid, response2);


            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
};

let sendGetstartedTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Xin chào bạn đến với phòng khám của Bác sĩ Văn Lang",
                    "subtitle": "Dưới đây là các lựa chọn",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [{
                            "type": "postback",
                            "title": "ĐẶT LỊCH KHÁM",
                            "payload": "DAT_LICH",
                        },
                        {
                            "type": "postback",
                            "title": "THÊM DỊCH VỤ",
                            "payload": "THEM_DV",
                        },
                        {
                            "type": "postback",
                            "title": "HƯỚNG DẪN",
                            "payload": "HUONG_DAN",
                        }
                    ],
                }]
            }
        }
    }
    return response;
}

let handleSendTHEMDV = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getThemDV(sender_psid);
            await callSendAPI(sender_psid, response1);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });

}

let getThemDV = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Dịch vụ của chúng tôi",
                        "subtitle": "Cảm ơn bạn đã ghé thăm, chúng tôi cung cấp những dịch vụ về tư vấn sức khoẻ cộng đồng",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [{
                                "type": "postback",
                                "title": "ĐẶT LỊCH KHÁM",
                                "payload": "DAT_LICH",
                            },
                            {
                                "type": "postback",
                                "title": "TƯ VẤN ONLINE",
                                "payload": "TUVAN_ONL",
                            },
                        ],
                    },
                    {
                        "title": "Dịch vụ khám bệnh của VanLangDoctor",
                        "subtitle": "Bắt đầu mở cửa phòng khám vào lúc 6h30| đóng lúc 16h30 ",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [{
                            "type": "postback",
                            "title": "ĐẶT LỊCH KHÁM",
                            "payload": "DAT_LICH",
                        }, ],
                    },
                    {
                        "title": "Không gian phòng khám của Bác sĩ Văn Lang",
                        "subtitle": "Cung cấp dịch vụ chăm sóc sức khỏe hiện đại – tiên tiến nhất, chúng tôi cam kết mang đến cho bạn và gia đình phương pháp tiếp cận toàn diện cho một cuộc sống khỏe mạnh hơn.",
                        "image_url": IMAGE_GET_STARTED,
                        "buttons": [{
                            "type": "postback",

                            "title": "CHI TIẾT",
                            "payload": "CHI_TIET",
                        }, ],
                    },

                ]
            }
        }
    }
    return response;
}
module.exports = {
    handleGetStarted: handleGetStarted,
    handleSendTHEMDV: handleSendTHEMDV,


};