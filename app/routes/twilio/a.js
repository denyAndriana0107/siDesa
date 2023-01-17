module.exports = app => {
    const express = require("express");
    const router = express.Router();

    const dao = require("../../controller/twilio/TwilioController");
    router.post('/twilio', dao.send);

    app.use('/api/', router);
}