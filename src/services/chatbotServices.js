import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let callSendAPI = () => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
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

let handleGetStarted = () => {
    return Promise(async (resolve, reject) => {
        try {
            response = {
                "text": "Xin chào bạn ABCD đã đến với website Bác sĩ Văn Lang"
            }
            await callSendAPI
            resolve('done');

        } catch (e) {
            reject(e);
        }

    })

}

module.exports = {
    handleGetStarted: handleGetStarted,

}