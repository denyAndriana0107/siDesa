const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo-dev");
class ProfileModel {
    constructor(params) {
        this._id = params._id,
            this.RWId = params.RWId,
            this.name = params.name,
            this.address = params.address;
    }
    static async read(RWId, result) {
        try {
            const db = await connection();
            const query = {
                "RWId": RWId
            };
            const cursor = await db.find(query);
            const allValues = await cursor.toArray();

            if (allValues.length > 0) {
                return result(null, allValues);
            } else {
                return result({ kind: "not_found" });
            }
        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async insert(data, result) {
        try {
            const db = await connection();
            const query = {
                "RWId": data.RWId
            };
            const cursor = db.find(query);
            const allValues = await cursor.toArray();
            if (allValues.length > 0) {
                return result({ kind: "data_conflict" });
            } else {
                const doc = {
                    "RWId": data.RWId,
                    "name": data.name,
                    "address": data.address
                };
                await db.insertOne(doc);
                return result(null);
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
            const query = {
                "RWId": data.RWId
            };
            const doc = {
                $set: {
                    name: data.name,
                    address: data.address
                }
            };
            const final_result = await db.updateOne(query, doc);
            if (final_result.matchedCount == 1) {
                return result(null);
            } else {
                return result({ kind: "not_found" });
            }
        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
}
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('organizational_profile');
    return collection;
}
module.exports = ProfileModel;