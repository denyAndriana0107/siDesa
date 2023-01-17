const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");
const TokenModel = function (params) {
    this.auth_users_id = params.auth_users_id,
        this.token_fcm = params.token_fcm
}
async function connection(params) {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('auth_users_token');
    return collection;
}
TokenModel.insert = async (data, result) => {
    try {
        const db = await connection();
        const query = {
            "auth_users_id": ObjectId(data.auth_users_id)
        }
        const cursor = await db.find(query);
        const allValues = await cursor.toArray();
        if (allValues.length > 0) {
            return result({ kind: "data_conflict" });
        } else {
            const doc = {
                "auth_users_id": ObjectId(data.auth_users_id),
                "token_fcm": data.token_fcm
            }
            await db.insertOne(doc);
        }
    } catch (error) {
        return result(error);
    } finally {
        await client.close();
    }
}
TokenModel.update = async (data, result) => {
    try {
        const db = await connection();
        const filter = {
            "auth_users_id": ObjectId(data.auth_users_id)
        }
        const doc = {
            $set: {
                token_fcm: data.token_fcm
            }
        }
        const final_result = await db.updateOne(filter, doc);
        if (final_result.matchedCount == 1) {

        } else {

        }
    } catch (error) {

    } finally {

    }
}