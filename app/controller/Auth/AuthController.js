const AuthModel = require("../../model/auth/auth_users/AuthModel");
const OTP = require("../../model/auth/otp/AuthModel");
const OTPModel = require("../../model/auth/otp/AuthModel");
const TokenFCM = require("../../model/auth/token/TokenModel");

const { sendMessage, getTextMessageInput } = require("../../helper/WhatsApp/WhatsApp");
const bycrypts = require("bcryptjs");
const { ObjectId } = require("mongodb");
var uuid = require("uuid");
require("dotenv").config();


// sign up admin RW
exports.signUp = (req, res, next) => {
    const RWId = uuid.v4().substring(0, 6);
    const password = bycrypts.hashSync(RWId + "_" + req.body.password);
    const data = new AuthModel({
        "_id": new ObjectId(),
        "phone": req.body.phone.toLowerCase(),
        "password": password,
        "RWId": RWId
    });
    AuthModel.signUp(data, (error, result) => {
        if (error) {
            return res.status(500).send({
                message: error
            });
        } else {
            const otp_data = new OTPModel({
                "auth_users_id": data._id
            });
            OTPModel.insert(otp_data, (error, result2) => {
                if (error) {
                    return res.status(500).send({
                        message: error
                    });
                } else {
                    return res.status(201).send({
                        message: `users created. your password ${RWId + "_" + req.body.password}`
                    });
                }
            })
        }
    });
}

exports.signIn2 = (req, res, next) => {
    const data = new AuthModel({
        "phone": req.body.phone.toLowerCase(),
        "password": req.body.password
    });
    AuthModel.signIn(data, (error, result) => {
        if (error) {
            if (error.kind === "users_not_found") {
                const data = new AuthModel({
                    "_id": new ObjectId(),
                    "phone": req.body.phone.toLowerCase(),
                    "password": req.body.password
                });
                AuthModel.signUpWarga(data, (error, result2) => {
                    if (error) {
                        if (error.kind === "data_conflict") {
                            return res.status(409), send({
                                message: "data_conflict"
                            });
                        }
                        return res.status(500).send({
                            message: error
                        });
                    } else {
                        AuthModel.signIn(data, (error, result3) => {
                            if (error) {
                                return res.status(500).send({
                                    message: "error database"
                                })
                            } else {
                                const otp_data = new OTPModel({
                                    "auth_users_id": data._id
                                });
                                OTPModel.insert(otp_data, (error, result4) => {
                                    if (error) {
                                        return res.status(500).send({
                                            message: error + "otp"
                                        });
                                    } else {
                                        var phone_split = data.phone;
                                        var RECIPIENT_WAID = "62" + phone_split;
                                        var otp_result = result3['otp'];
                                        var data_message = getTextMessageInput(RECIPIENT_WAID, `Warga !!.Terima kasih telah mendaftarkan nomor ponsel diaplikasi kami. Berikut kode verikifikasi akun anda : *${otp_result}*`);
                                        sendMessage(data_message).then((response) => {
                                            return res.status(200).send({
                                                message: result3["token"],
                                                role: result3["role"][0]["auth_users_group"]["role"]
                                            });
                                        }).catch((error) => {
                                            return res.status(500).send({
                                                message: error.response.data
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else if (error.kind === "users_incorrect") {
                return res.status(403).send({
                    message: "users_incorrect"
                });
            } else {
                return res.status(500).send({
                    message: error
                });
            }
        } else {
            var phone_split = data.phone;
            var RECIPIENT_WAID = "62" + phone_split;
            var otp_result = result['otp'];
            var data_message = getTextMessageInput(RECIPIENT_WAID, `Warga !!.Terima kasih telah mendaftarkan nomor ponsel diaplikasi kami. Berikut kode verikifikasi akun anda : *${otp_result}*`);
            sendMessage(data_message).then((response) => {
                return res.status(200).send({
                    message: result["token"],
                    role: result["role"][0]["auth_users_group"]["role"]
                });
            }).catch((error) => {
                return res.status(500).send({
                    message: error.response.data
                });
            });
        }
    })
}
exports.signOut = (req, res, next) => {
    const data = {
        "auth_users_id": req.user.userId
    }
    OTPModel.delete(data, (error, result) => {
        if (error) {
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(200).send({
                message: "Sign Out"
            });
        }
    });
}

exports.validateOTP = (req, res, next) => {
    const data = {
        "auth_users_id": req.user.userId,
        "otp": req.body.otp,
        "secret": req.user.secret
    }
    OTP.validate(data, (error, result) => {
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
exports.insertOrUpdateTokenFCM = (req, res, next) => {
    const data = new TokenFCM({
        "auth_users_id": req.user.userId,
        "token_fcm": req.body.token_fcm
    });
    TokenFCM.insert(data, (error, result) => {
        if (error) {
            if (error.kind === "data_conflict") {
                TokenFCM.update(data, (error, result2) => {
                    if (error) {
                        return res.status(500).send({
                            message: error
                        });
                    } else {
                        return res.status(201).send({
                            message: 'ok'
                        });
                    }
                });
            } else {
                return res.status(500).send({
                    message: error
                });
            }
        } else {
            return res.status(201).send({
                message: 'ok'
            });
        }
    });
}