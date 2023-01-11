
const client = require("../../../config/db/Mongo");
var speakeasy = require("speakeasy");
const { ObjectId } = require("mongodb");


const OTPModel = function (params) {
    this.auth_users_id = params.auth_users_id,
        this.otp = params.otp,
        this.validated = params.validated,
        this.expired = params.expired
}
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('auth_users_otp');
    return collection;
}


OTPModel.insert = async (data, result) => {
    try {
        var date = new Date();
        date.setDate(date.getDate() + 1);

        const db = await connection();
        const doc = {
            "auth_users_id": ObjectId(data.auth_users_id),
            "otp": data.otp,
            "validated": false,
            "expired": date
        }
        await db.insertOne(doc);
        return result(null);
    } catch (error) {
        return result(error);
    } finally {
        await client.close();
    }
}