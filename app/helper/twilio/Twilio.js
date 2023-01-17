const client = require("../../config/twilio/Twilio");
class Twilio {
    constructor(params) {
        this.from = params.from,
            this.body = params.body,
            this.to = params.to;
    }
    static sendMessage(result) {
        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: 'Hello ',
                to: 'whatsapp:+6287788169658'
            })
            .then((success) => {
                return result(success);
            }).catch((error) => {
                return result(error)
            });
    }
}
module.exports = Twilio;
