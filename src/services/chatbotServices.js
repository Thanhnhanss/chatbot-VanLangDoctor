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
const IMAGE_GET_STARTED8 = 'https://bit.ly/IMG_DV8';
const IMAGE_GET_STARTED9 = 'https://bit.ly/IMG_DV9';
const IMAGE_GET_STARTED10 = 'https://bit.ly/IMG_DV10';

let callSendAPI = async (sender_psid, response) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Construct the message body
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response
            }

            await sendTypingOn(sender_psid);
            await sendMarkReadMessage(sender_psid);

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v9.0/me/messages",
                "qs": {
                    "access_token": PAGE_ACCESS_TOKEN
                },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                console.log('---------------');
                console.log(body);
                console.log('---------------');
                if (!err) {
                    resolve('message sent!')
                    // console.log('message sent!')
                } else {
                    console.error("Unable to send message:" + err);
                }
            });

        } catch (e) {
            reject(e);
        }
    })

}

let sendTypingOn = (sender_psid) => {
    let request_body = {
        recipient: {
            "id": sender_psid,
        },
        "sender_action": "typing_on"
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
                console.log(" sendTypingOn sent!");
            } else {
                console.error("Unable to send sendTypingOn:" + err);
            }
        }
    );
}

let sendMarkReadMessage = (sender_psid) => {
    let request_body = {
        recipient: {
            "id": sender_psid,
        },
        "sender_action": "mark_seen"
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
                console.log(" sendTypingOn sent!");
            } else {
                console.error("Unable to send sendTypingOn:" + err);
            }
        }
    );
}

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
                            "type": "web_url",
                            "url": `${process.env.URL_DAT_BAN}`,
                            "title": "ĐẶT LỊCH",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": true //false: open the webview in new tab
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
            let response1 = getThemDV(sender_psid);
            await callSendAPI(sender_psid, response1);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });

}

let getThemDV = () => {
    console.log(process.env.URL_DAT_LICH);
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
                                "type": "web_url",
                                "url": `${process.env.URL_DAT_LICH}`,
                                "title": "ĐẶT LỊCH",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true //false: open the webview in new tab
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
                            "type": "web_url",
                            "url": `${process.env.URL_DAT_LICH}`,
                            "title": "ĐẶT LỊCH",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": true //false: open the webview in new tab
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

                            "type": "web_url",
                            "url": `${process.env.URL_DAT_LICH}`,
                            "title": "ĐẶT LỊCH",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": true //false: open the webview in new tab
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

let handleQUAY_LAI = async (sender_psid) => {
    await handleSendTHEMDV(sender_psid);
}


let handleCHUAN_DOAN = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getCHUAN_DOAN(sender_psid);
            await callSendAPI(sender_psid, response1);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
}

let getCHUAN_DOAN = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "HO SỐT KHÓ THỞ",
                        "subtitle": "Đó là triệu chứng thông thường của bệnh viêm phổi nhưng với diễn biến phức tạp của đại dịch cũng là triệu chứng của covid-19 hãy xét nghiệm để có thể có kết quả chính xác nhất!",
                    },
                    {
                        "title": "ĐAU ĐẦU CHÓNG MẶT HOA MẮT",
                        "subtitle": "Hãy cẩn thận có thể đó là dấu hiệu của cơn tuột huyết áp cấp và các bệnh nguy hiểm khác, ăn uống đủ chất không bỏ bữa. Hãy đến bệnh viện để được khám và xét nghiệm rõ hơn.",
                    },
                    {
                        "title": "SỐT, HO RA MÁU, ĐỔ MỒ HÔI VỀ ĐÊM, KHÓ NGỦ",
                        "subtitle": "Đó có thể là một trong những triệu chứng rõ ràng của các bệnh về phổi thường gặp nhất là LAO PHỔI. Hãy đến bệnh viện để có kết quả chính xác nhất!",
                    },
                    {
                        "title": "VÀNG DA, MẪN NGỨA, ĐAU VÙNG BỤNG",
                        "subtitle": "Đó là những dấu hiệu ban đầu của bệnh về gan như xơ gan, ung thư gan. Hãy đến bệnh viện thăm khám để có được kết quả chính xác nhất!",
                    },
                    {
                        "title": "Trở lại ban đầu",
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

let getHINHANH_CHITIET = () => {
    let response = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": IMAGE_GET_STARTED8,
                "is_reusable": true
            }
        }
    }

    return response;

}

let getNUTBAM_CHITIET = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "What do you want to do next?",
                "buttons": [{
                        "type": "postback",
                        "title": "ĐẶT LỊCH",
                        "payload": "DAT_LICH",
                    },
                    {
                        "type": "postback",
                        "title": "TRỞ LẠI",
                        "payload": "QUAY_LAI",
                    },
                ]
            }
        }
    }
    return response;
}

let handleCHI_TIET = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            //send an image
            let response1 = await getHINHANH_CHITIET(sender_psid);
            //send an button templates : text, buttons
            let response2 = await getNUTBAM_CHITIET(sender_psid);

            await callSendAPI(sender_psid, response1);
            await callSendAPI(sender_psid, response2);
            resolve("done");
        } catch (e) {
            reject(e);
        }
    });
}



module.exports = {
    handleGetStarted: handleGetStarted,
    handleSendTHEMDV: handleSendTHEMDV,
    handleTUVAN_ONL: handleTUVAN_ONL,
    handleQUAY_LAI: handleQUAY_LAI,
    handleCHUAN_DOAN: handleCHUAN_DOAN,
    handleCHI_TIET: handleCHI_TIET,
    callSendAPI: callSendAPI,
    getUserName: getUserName,

};