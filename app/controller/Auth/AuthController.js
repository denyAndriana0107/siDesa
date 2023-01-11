const AuthModel = require("../../model/auth/auth_users/AuthModel");
const OTP = require("../../model/auth/otp/AuthModel");
const helper = require("../../helper/otp/OTP");
const bycrypts = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
var uuid = require("uuid");

exports.signUp = (req, res, next) => {
    const password = bycrypts.hashSync(req.body.password);

    const data = new AuthModel({
        "phone": req.body.phone.toLowerCase(),
        "password": password,
        "RWId": uuid.v4().substring(0, 6)
    });
    AuthModel.signUp(data, (error, result) => {
        if (error) {
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(201).send({
                message: `users created. your RW_ID "${result}"`
            });
        }
    });
}

exports.signIn = (req, res, next) => {
    const data = new AuthModel({
        "phone": req.body.phone.toLowerCase(),
        "password": req.body.password
    });
    AuthModel.signIn(data, (error, result) => {
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

exports.signIn2 = (req, res, next) => {
    const data = new AuthModel({
        "_id": new ObjectId(),
        "phone": req.body.phone.toLowerCase(),
        "password": req.body.password
    });
    AuthModel.signUpWarga(data, (error, result) => {
        if (error) {
            if (error.kind === "data_conflict") {
                AuthModel.signIn(data, (error, final_result) => {
                    if (error) {
                        return res.status(500).send({
                            message: error
                        });
                    } else {
                        return res.status(202).send({
                            message: final_result
                        });
                    }
                });
            } else {
                return res.status(500).send({
                    message: error
                });
            }
        } else {
            let otp = helper.generate();
            const data_otp = {
                "_id": data._id,
                "otp": otp
            }
            OTP.insert(data_otp, (error, result) => {
                if (error) {
                    return res.status(500).send({
                        message: error
                    });
                } else {
                    AuthModel.signIn(data, (error, final_result) => {
                        if (error) {
                            return res.status(500).send({
                                message: error
                            });
                        } else {
                            return res.status(202).send({
                                message: final_result,
                                otp: otp
                            });
                        }
                    });
                }
            });

        }
    });
}