var axios = require('axios');
require("dotenv").config();
function sendMessage(data) {
    var config = {
        method: 'post',
        url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
        headers: {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config);
}

function getTextMessageInput(recipient, text) {
    return JSON.stringify({
        "messaging_product": "whatsapp",
        "preview_url": false,
        "recipient_type": "individual",
        "to": recipient,
        "type": "template",
        "template": {
            "name": "sample_issue_resolution",
            "language": {
                "code": "ID"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": text
                        }
                    ]
                }
            ]
        }
    });
}

module.exports = {
    sendMessage: sendMessage,
    getTextMessageInput: getTextMessageInput
};
