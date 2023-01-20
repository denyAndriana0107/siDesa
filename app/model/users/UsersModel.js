const { ObjectId } = require("mongodb");
const client = require("../../config/db/Mongo");
class UsersModel {
    constructor(params) {
        this.name = params.name,
            this.photo = params.photo,
            this.auth_users_id = params.auth_users_id,
            this.RWId = params.RWId,
            this.address = params.address;
    }
    static async read(id, result) {
        try {
            const db = await connection();
            const query = {
                "auth_users_id": ObjectId(id)
            };
            const cursor = await db.find(query);
            const allValues = await cursor.toArray();

            if (allValues.length > 0) {
                return result(null, allValues);
            } else {
                return result({ kind: "not_found" });
            }
        } catch (error) {
            return result(error);
        } finally {
            await client.close();
        }
    }
    static async insert(data, result) {
        try {
            const db = await connection();
            const query = {
                "auth_users_id": ObjectId(data.auth_users_id)
            };
            const cursor = await db.find(query);
            const allValues = await cursor.toArray();
            if (allValues.length > 0) {
                return result({ kind: "data_conflict" });
            } else {
                const doc = {
                    "name": data.name,
                    "photo": data.photo,
                    "auth_users_id": ObjectId(data.auth_users_id),
                    "RWId": data.RWId,
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
    static async update(id, data, result) {
        try {
            const db = await connection();
            const filter = {
                "auth_users_id": ObjectId(id)
            };
            const doc = {
                $set: {
                    name: data.name,
                    address: data.address
                }
            };
            const final_result = await db.updateOne(filter, doc);
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
    static async uploadPhoto(id, data, result) {
        try {
            const db = await connection();
            const filter = {
                "auth_users_id": ObjectId(id)
            };
            const doc = {
                $set: {
                    photo: data
                }
            };
            const final_result = await db.updateOne(filter, doc);
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
    static async delete(id, result) {
        try {
            const db = await connection();
            const query = {
                "auth_users_id": ObjectId(id)
            };
            const final_result = await db.deleteOne(query);
            if (final_result.deletedCount == 1) {
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
async function connection(params) {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('users_profile');
    return collection;
}
module.exports = UsersModel;