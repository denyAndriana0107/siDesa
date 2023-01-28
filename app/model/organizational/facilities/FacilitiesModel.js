const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");

class FacilitiesModel {
    constructor(params) {
        this.facilities_name = params.facilities_name,
            this.desc = params.desc,
            this.photo = params.photo,
            this.RWId = params.RWId;
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
            const doc = {
                "facilities_name": data.facilities_name,
                "desc": data.desc,
                "photo": data.photo,
                "RWId": data.RWId
            };
            await db.insertOne(doc);
            return result(null);
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
                "_id": ObjectId(id),
                "RWId": data.RWId
            };
            if (data.photo != undefined) {
                const doc = {
                    $set: {
                        facilities_name: data.facilities_name,
                        desc: data.desc,
                        photo: data.photo
                    }
                };
                const final_result = await db.updateOne(filter, doc);
                if (final_result.matchedCount == 1) {
                    return result(null);
                } else {
                    return result({ kind: "not_found" });
                }
            } else {
                const doc = {
                    $set: {
                        facilities_name: data.facilities_name,
                        desc: data.desc,
                    }
                };
                const final_result = await db.updateOne(filter, doc);
                if (final_result.matchedCount == 1) {
                    return result(null);
                } else {
                    return result({ kind: "not_found" });
                }
            }

        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async delete(id, RWId, result) {
        try {
            const db = await connection();
            const filter = {
                "_id": ObjectId(id),
                "RWId": RWId
            };
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
async function connection(params) {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('organizational_facilities');
    return collection;
}
module.exports = FacilitiesModel;