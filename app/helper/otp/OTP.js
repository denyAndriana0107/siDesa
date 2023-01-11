var speakeasy = require("speakeasy");
const OTP = function (params) {

}
OTP.generate = () => {
    var secret = speakeasy.generateSecret({ length: 6 });
    var token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        time: 60
    });
    return token;
}
module.exports = OTP;