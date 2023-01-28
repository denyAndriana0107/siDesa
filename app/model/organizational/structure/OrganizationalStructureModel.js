const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo-dev");
class StructureModel {
    constructor(params) {
        this._id = params._id,
            this.name = params.name,
            this.RWId = params.RWId,
            this.jobs = params.jobs,
            this.photo = params.photo;
    }
    static async read(RWId, result) {
        try {
            const db = await connection();
            const query = {
                "RWId": RWId
            };
            const cursor = db.find(query);
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
    static async readById(data, result) {
        try {
            const db = await connection();
            const query = {
                "RWId": data.RWId,
                "_id": ObjectId(data._id)
            };
            const cursor = db.find(query);
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
            const doc = {
                "_id": ObjectId(data._id),
                "RWId": data.RWId,
                "person": [
                    {
                        "name": data.name,
                        "photo": data.photo
                    }
                ],
                "jobs": data.jobs,
            };
            await db.insertOne(doc);
            return result(null);
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
                "RWId": data.RWId,
                "_id": ObjectId(data._id)
            }
            const doc = {
                $set: {
                    "person": [
                        {
                            "name": data.name,
                            "photo": data.photo
                        }
                    ],
                    "jobs": data.jobs,
                }
            }

            const final_result = await db.updateOne(filter, doc);
            if (final_result.modifiedCount == 1) {
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
    static async delete(data, result) {
        try {
            const db = await connection();
            const filter = {
                "RWId": data.RWId,
                "_id": ObjectId(data._id)
            }
            const final_result = await db.deleteOne(filter);
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
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('organizational_structure');
    return collection;
}
module.exports = StructureModel;