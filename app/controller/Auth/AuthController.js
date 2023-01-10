const AuthModel = require("../../model/auth/auth_users/AuthModel");
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