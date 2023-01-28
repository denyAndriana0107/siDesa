const client = require("../../../config/db/Mongo");
const { ObjectId } = require("mongodb");
var helper = require("../../../helper/otp/OTP");

class OTPModel {
    constructor(params) {
        this.auth_users_id = params.auth_users_id,
            this.otp = params.otp,
            this.validated = params.validated;
    }
    static async insert(data, result) {
        try {
            const db = await connection();
            const doc = {
                "auth_users_id": ObjectId(data.auth_users_id),
                "validated": false
            };
            await db.insertOne(doc);
            return result(null);
        } catch (error) {
            return result(error);
        } finally {
            await client.close();
        }
    }
    static async validate(data, result) {
        const verifyOtp = helper.verify(data.otp, data.secret);
        if (!verifyOtp) {
            return result({ kind: "otp_incorrect" });
        } else {
            try {
                const db = await connection();
                const filter = {
                    "auth_users_id": ObjectId(data.auth_users_id)
                };
                const doc = {
                    $set: {
                        validated: true
                    }
                };
                const final_result = await db.updateOne(filter, doc);
                if (final_result.modifiedCount == 1 || final_result.matchedCount == 1) {
                    return result(null, verifyOtp);
                } else {
                    return result({ kind: "data_not_found" });
                }
            } catch (error) {
                return result(error);
            } finally {
                await client.close();
            }
        }
    }
    static async delete(data, result) {
        try {
            const db = await connection();
            const filter = {
                "auth_users_id": ObjectId(data.auth_users_id)
            };
            const doc = {
                $set: {
                    validated: false
                }
            };
            const final_result = await db.updateOne(filter, doc);
            if (final_result.modifiedCount == 1) {
                return result(null);
            } else {
                return result({ kind: "data_not_found" });
            }
        } catch (error) {
            return result(error);
        } finally {
            await client.close();
        }
    }
}
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('auth_users_otp');
    return collection;
}


module.exports = OTPModel;