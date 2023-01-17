const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");
class LogsLikeEvent {
    constructor(params) {
        this._id = params._id
        this.auth_users_id = params.auth_users_id,
            this.news_id = params.news_id
    }
    static async find(data, result) {
        try {
            const db = await connection();
            const query = {
                "auth_users_id": ObjectId(data.auth_users_id),
                "news_id": ObjectId(data.news_id)
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
    static async Insert(data, result) {
        try {
            const db = await connection();
            const doc = {
                "auth_users_id": ObjectId(data.auth_users_id),
                "news_id": ObjectId(data.news_id)
            }
            await db.insertOne(doc);
            return result(null);
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