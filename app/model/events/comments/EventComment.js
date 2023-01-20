const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");
class EventsCommentsmodel {
    constructor(params) {
        this._id = params._id,
            this.text = params.text,
            this.createdAt = params.createdAt,
            this.updatedAt = params.updatedAt,
            this.eventId = params.eventId,
            this.auth_users_id = params.auth_users_id;
    }
    static async insert(data, result) {
        try {
            const db = await connection();
            const doc = {
                "text": data.text,
                "createdAt": data.createdAt,
                "updatedAt": data.updatedAt,
                "eventId": ObjectId(data.eventId),
                "auth_users_id": ObjectId(data.auth_users_id)
            };
            await db.insertOne(doc);
            return result(null);

        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async read(id_Events, result) {
        try {
            const db = await connection();
            const limit = 20;
            const sort = { createdAt: -1 };
            const query = { "eventId": ObjectId(id_Events) };
            const cursor = db.find(query).sort(sort).limit(limit);
            const allValues = await cursor.toArray();

            var array_data = [];
            array_data = allValues;
            if (array_data.length > 0) {
                return result(null, array_data);
            } else {
                return result({ kind: "data_not_found" });
            }

        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async update(data, result) {
        try {
            const db = await connection();
            const filter = {
                "_id": ObjectId(data._id),
                "auth_users_id": ObjectId(data.auth_users_id),
                "eventId": ObjectId(data.eventId)
            }
            const doc = {
                $set: {
                    text: data.text,
                    updatedAt: data.updatedAt
                }
            }
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
    static async delete(data, result) {
        try {
            const db = await connection();
            const filter = {
                "_id": ObjectId(data._id),
                "auth_users_id": ObjectId(data.auth_users_id),
                "eventId": ObjectId(data.eventId)
            }
            const final_result = await db.deleteOne(filter);
            if (final_result.deletedCount == 1) {
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
    const collection = database.collection('events_comments');
    return collection;
}
module.exports = EventsCommentsmodel;