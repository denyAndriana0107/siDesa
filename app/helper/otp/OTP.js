var speakeasy = require("speakeasy");
class OTP {
    constructor(params) {
    }
    static generate() {
        var secret = speakeasy.generateSecret({ length: 6 });
        var token = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
        const data = {
            token: token,
            secret: secret
        }
        return data;
    }
    static verify(token, secret) {
        var tokenValidate = speakeasy.totp.verify({
            secret: secret.base32,
            encoding: 'base32',
            token: token,
            window: 6,
        });
        return tokenValidate;
    }
}
module.exports = OTP;