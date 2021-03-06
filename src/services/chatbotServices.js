require("dotenv").config();
import {
    response
} from "express";
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = 'https://bit.ly/IMG_TMP-1';
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
                "text": `Xin ch??o b???n ???? ?????n v???i website B??c s?? V??n Lang`,
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
                    "title": "Xin ch??o b???n ?????n v???i ph??ng kh??m c???a B??c s?? V??n Lang",
                    "subtitle": "D?????i ????y l?? c??c l???a ch???n",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [{
                            "type": "web_url",
                            "url": `${process.env.URL_DAT_BAN}`,
                            "title": "?????T L???CH",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": true //false: open the webview in new tab
                        },
                        {
                            "type": "postback",
                            "title": "TH??M D???CH V???",
                            "payload": "THEM_DV",
                        },
                        {
                            "type": "web_url",
                            "url": `${process.env.URL_FEEDBACK}`,
                            "title": "????NH GI??",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": true //false: open the webview in new tab
                        },
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
    console.log(process.env.URL_DAT_BAN);
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "D???ch v??? c???a ch??ng t??i",
                        "subtitle": "C???m ??n b???n ???? gh?? th??m, ch??ng t??i cung c???p nh???ng d???ch v??? v??? t?? v???n s???c kho??? c???ng ?????ng",
                        "image_url": IMAGE_GET_STARTED1,
                        "buttons": [{
                                "type": "web_url",
                                "url": `${process.env.URL_DAT_BAN}`,
                                "title": "?????T L???CH",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true //false: open the webview in new tab
                            },
                            {
                                "type": "postback",
                                "title": "T?? V???N ONLINE",
                                "payload": "TUVAN_ONL",
                            },
                        ],
                    },
                    {
                        "title": "D???ch v??? kh??m b???nh c???a VanLangDoctor",
                        "subtitle": "B???t ?????u m??? c???a ph??ng kh??m v??o l??c 6h30| ????ng l??c 16h30 ",
                        "image_url": IMAGE_GET_STARTED2,
                        "buttons": [{
                            "type": "web_url",
                            "url": `${process.env.URL_FEEDBACK}`,
                            "title": "????NH GI??",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": true //false: open the webview in new tab
                        }, ],
                    },
                    {
                        "title": "Kh??ng gian ph??ng kh??m c???a B??c s?? V??n Lang",
                        "subtitle": "Cung c???p d???ch v??? ch??m s??c s???c kh???e hi???n ?????i ??? ti??n ti???n nh???t, ch??ng t??i cam k???t mang ?????n cho b???n v?? gia ????nh ph????ng ph??p ti???p c???n to??n di???n cho m???t cu???c s???ng kh???e m???nh h??n.",
                        "image_url": IMAGE_GET_STARTED3,
                        "buttons": [{
                            "type": "postback",

                            "title": "CHU???N ??O??N",
                            "payload": "CHUAN_DOAN",
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
    let response1 = {
        "text": "B???n ??ang g???p ph???i v???n ????? s???c kho???, h??y n??i tri???u ch???ng ????? ?????i ng?? b??c s?? t?? v???n tr???c tuy???n cho b???n nhanh ch??ng"
    }
    // let response1 = {
    //     "attachment": {
    //         "type": "template",
    //         "payload": {
    //             "template_type": "generic",
    //             "elements": [{
    //                 "title": "Xin ch??o b???n ?????n v???i ph??ng kh??m c???a B??c s?? V??n Lang",
    //                 "subtitle": "D?????i ????y l?? c??c l???a ch???n",
    //                 "image_url": IMAGE_GET_STARTED,
    //                 "buttons": [{
    //                     "type": "web_url",
    //                     "url": `${process.env.URL_DAT_BAN}`,
    //                     "title": "?????T L???CH",
    //                     "webview_height_ratio": "tall",
    //                     "messenger_extensions": true //false: open the webview in new tab
    //                 }]
    //             }]
    //         }
    //     }

    // }
    return response1;
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
                        "title": "HO S???T KH?? TH???",
                        "subtitle": "???? l?? tri???u ch???ng th??ng th?????ng c???a b???nh vi??m ph???i nh??ng v???i di???n bi???n ph???c t???p c???a ?????i d???ch c??ng l?? tri???u ch???ng c???a covid-19 h??y x??t nghi???m ????? c?? th??? c?? k???t qu??? ch??nh x??c nh???t!",
                    },
                    {
                        "title": "??AU ?????U CH??NG M???T HOA M???T",
                        "subtitle": "H??y c???n th???n c?? th??? ???? l?? d???u hi???u c???a c??n tu???t huy???t ??p c???p v?? c??c b???nh nguy hi???m kh??c, ??n u???ng ????? ch???t kh??ng b??? b???a. H??y ?????n b???nh vi???n ????? ???????c kh??m v?? x??t nghi???m r?? h??n.",
                    },
                    {
                        "title": "S???T, HO RA M??U, ????? M??? H??I V??? ????M, KH?? NG???",
                        "subtitle": "???? c?? th??? l?? m???t trong nh???ng tri???u ch???ng r?? r??ng c???a c??c b???nh v??? ph???i th?????ng g???p nh???t l?? LAO PH???I. H??y ?????n b???nh vi???n ????? c?? k???t qu??? ch??nh x??c nh???t!",
                    },
                    {
                        "title": "V??NG DA, M???N NG???A, ??AU V??NG B???NG",
                        "subtitle": "???? l?? nh???ng d???u hi???u ban ?????u c???a b???nh v??? gan nh?? x?? gan, ung th?? gan. H??y ?????n b???nh vi???n th??m kh??m ????? c?? ???????c k???t qu??? ch??nh x??c nh???t!",
                    },
                    {
                        "title": "Tr??? l???i ban ?????u",
                        "buttons": [{
                            "type": "postback",
                            "title": "TR??? L???I",
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
                        "type": "web_url",
                        "url": `${process.env.URL_DAT_BAN}`,
                        "title": "?????T L???CH",
                        "webview_height_ratio": "tall",
                        "messenger_extensions": true //false: open the webview in new tab
                    },
                    {
                        "type": "web_url",
                        "url": `${process.env.URL_FEEDBACK}`,
                        "title": "????NH GI??",
                        "webview_height_ratio": "tall",
                        "messenger_extensions": true //false: open the webview in new tab
                    },
                    {
                        "type": "postback",
                        "title": "TR??? L???I",
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