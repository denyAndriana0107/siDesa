const jwt = require("jsonwebtoken");
const client = require("../../config/db/Mongo-dev");
const { ObjectId } = require("mongodb");
module.exports = {
    isLoggedIn: (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(400).send({
                message: "session anda telah berakhir",
            });
        }
        try {
            const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
            if (!token) {
                throw new Error('session anda telah berakhir!');
            }
            const verified = jwt.verify(token, "SECRETKEY");
            req.user = verified;
            next();
        } catch (error) {
            return res.status(400).send({
                message: "session anda telah berakhir",
            });
        }
    },
    isValidated: async (req, res, next) => {
        try {
            await client.connect();
            const database = client.db('siDesa');
            const collection = database.collection('auth_users_otp');
            const query = {
                "auth_users_id": ObjectId(req.user.userId),
                "validated": true
            }
            const cursor = await collection.find(query);
            const result = await cursor.toArray();

            // if validated
            if (result.length > 0) {
                next();
            } else {
                return res.status(400).send({
                    message: "OTP anda tidak tervalidasi",
                });
            }
        } catch (error) {
            return res.status(400).send({
                message: "OTP anda tidak tervalidasi",
            });

        }
    }
}