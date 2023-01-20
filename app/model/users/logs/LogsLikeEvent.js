const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo-dev");
class LogsLikeEvent {
    constructor(params) {
        this._id = params._id
        this.auth_users_id = params.auth_users_id,
            this.eventId = params.eventId
    }
    static async find(data, result) {
        try {
            const db = await connection();
            const query = {
                "auth_users_id": ObjectId(data.auth_users_id),
                "eventId": ObjectId(data.eventId)
            }
            const cursor = await db.find(query);
            const final_result = await cursor.toArray();
            if (final_result.length > 0) {
                return result(null, true);
            } else {
                return result(null, false);
            }
        } catch (error) {
            return result(error);
        } finally {
            await client.close();
        }
    }
    static async InsertOrDelete(data, result) {
        try {
            const db = await connection();
            const query = {
                "auth_users_id": ObjectId(data.auth_users_id),
                "eventId": ObjectId(data.eventId)
            }
            const find = db.find(query);
            const allValues = await find.toArray();
            if (allValues.length > 0) {
                const doc = {
                    "auth_users_id": ObjectId(data.auth_users_id),
                    "eventId": ObjectId(data.eventId)
                }
                await db.deleteOne(doc);
                return result(null);
            } else {
                const doc = {
                    "auth_users_id": ObjectId(data.auth_users_id),
                    "eventId": ObjectId(data.eventId)
                }
                await db.insertOne(doc);
                return result(null);
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
    const collection = database.collection('users_logs_like_event');
    return collection;
}
module.exports = LogsLikeEvent;