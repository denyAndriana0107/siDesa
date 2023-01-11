
const client = require("../../../config/db/Mongo-dev");
const { ObjectId } = require("mongodb");


const OTPModel = function (params) {
    this.auth_users_id = params.auth_users_id,
        this.otp = params.otp,
        this.validated = params.validated
}
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('auth_users_otp');
    return collection;
}


OTPModel.insert = async (data, result) => {
    try {
        const db = await connection();
        const doc = {
            "auth_users_id": ObjectId(data.auth_users_id),
            "otp": data.otp,
            "validated": false
        }
        await db.insertOne(doc);
        return result(null);
    } catch (error) {
        return result(error);
    }
}
module.exports = OTPModel;