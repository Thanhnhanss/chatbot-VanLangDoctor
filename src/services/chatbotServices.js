require("dotenv").config();
import {
    response
} from "express";
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = 'https://bit.ly/IMG_TMP';
const IMAGE_GET_STARTED1 = 'https://bit.ly/IMG_DV1-1';

const IMAGE_GET_STARTED2 = 'https://bit.ly/IMG_DV2-1';
const IMAGE_GET_STARTED3 = 'https://bit.ly/IMG_DV3';
const IMAGE_GET_STARTED4 = 'https://bit.ly/IMG_DV4-1';
const IMAGE_GET_STARTED5 = 'https://bit.ly/IMG_DV5';
const IMAGE_GET_STARTED6 = 'https://bit.ly/IMG_DV6';
const IMAGE_GET_STARTED7 = 'https://bit.ly/IMG_DV7';


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
                        "image_url": IMAGE_GET_STARTED1,
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
                        "image_url": IMAGE_GET_STARTED2,
                        "buttons": [{
                            "type": "postback",
                            "title": "ĐẶT LỊCH KHÁM",
                            "payload": "DAT_LICH",
                        }, ],
                    },
                    {
                        "title": "Không gian phòng khám của Bác sĩ Văn Lang",
                        "subtitle": "Cung cấp dịch vụ chăm sóc sức khỏe hiện đại – tiên tiến nhất, chúng tôi cam kết mang đến cho bạn và gia đình phương pháp tiếp cận toàn diện cho một cuộc sống khỏe mạnh hơn.",
                        "image_url": IMAGE_GET_STARTED3,
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

let handleTUVAN_ONL = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getTuvan_ONL(sender_psid);
            await callSendAPI(sender_psid, response1);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
}

let getTuvan_ONL = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Tư vấn sức khoẻ online",
                        "subtitle": "Chúng tôi luôn sẵn sàng lắng nghe những chia sẻ về sức khoẻ của bạn",
                        "image_url": IMAGE_GET_STARTED4,
                        "buttons": [{
                            "type": "postback",
                            "title": "THÔNG TIN THÊM",
                            "payload": "TUVAN_ONL",
                        }, ],
                    },
                    {
                        "title": "Chuẩn đoán bệnh online",
                        "subtitle": "Dựa vào những triệu chứng mà bạn chia sẻ chúng tôi sẽ đưa ra những kết luận phù hợp nhất",
                        "image_url": IMAGE_GET_STARTED5,
                        "buttons": [{
                            "type": "postback",
                            "title": "CHI TIẾT",
                            "payload": "CHUAN_DOAN",
                        }, ],
                    },
                    {
                        "title": "Đặt lịch tại phòng khám VLMC",
                        "subtitle": "Là cơ sở y tế mới nhất với các trang thiết bị hiện đại do trường Đại học Văn Lang thành lập năm 2021.",
                        "image_url": IMAGE_GET_STARTED6,
                        "buttons": [{
                            "type": "postback",

                            "title": "ĐẶT LỊCH",
                            "payload": "DAT_LICH",
                        }, ],
                    },
                    {
                        "title": "Quay lại lúc đầu",
                        "subtitle": "Trong tình hình dịch bệnh covid 19 diễn biến phức tạp, tư vấn onl đem lại cho bạn sự an tâm tuyệt đối",
                        "image_url": IMAGE_GET_STARTED7,
                        "buttons": [{
                            "type": "postback",
                            "title": "TRỞ LẠI",
                            "payload": "QUAY_LAI",
                        }, ],
                    },

                ]
            }
        }
    }
    return response;
}

 let handleQUAY_LAI = async(sender_psid)=> {
    await handleSendTHEMDV(sender_psid);
}


module.exports = {
    handleGetStarted: handleGetStarted,
    handleSendTHEMDV: handleSendTHEMDV,
    handleTUVAN_ONL: handleTUVAN_ONL,
    handleQUAY_LAI: handleQUAY_LAI,


};