const helper = require("../../helper/twilio/Twilio");
exports.send = (req, res, next) => {
    helper.sendMessage((error, result) => {
        if (error) {
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(200).send({
                message: result
            });
        }
    });
}