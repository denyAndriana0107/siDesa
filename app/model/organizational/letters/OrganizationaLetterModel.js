const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");
class OrganizationalLetterModel {
    constructor(params) {
        this._id = params._id,
            this.RWId = params.RWId,
            this.letter_name = params.letter_name,
            this.details = params.details,
            this.createdAt = params.createdAt,
            this.updatedAt = params.updatedAt
    }
    static async insert(data, result) {
        try {
            const db = await connection();
            const details = [];
            for (let i = 0; i < data.details.length; i++) {
                details.push({
                    "about": data.details[i]['about'],
                    "definition": data.details[i]['definition']
                })
            }
            const doc = {
                "RWId": data.RWId,
                "letter_name": data.letter_name,
                "details": details,
                "createdAt": data.createdAt,
                "updatedAt": data.updatedAt
            }
            await db.insertOne(doc);
            return result(null);
        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async read(data, result) {
        try {
            const db = await connection();
            const filter = {
                "RWId": data.RWId
            }
            const cursor = db.find(filter);
            const final_result = await cursor.toArray();
            if (final_result.length > 0) {
                return result(null, final_result);
            } else {
                return result({ kind: "data_not_found" });
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
            const filter = {
                "_id": ObjectId(data._id),
                "RWId": data.RWId
            }
            const cursor = db.find(filter);
            const final_result = await cursor.toArray();
            if (final_result.length > 0) {
                return result(null, final_result);
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
                "RWId": data.RWId
            }
            const details = [];
            for (let i = 0; i < data.details.length; i++) {
                details.push({
                    "about": data.details[i]['about'],
                    "definition": data.details[i]['definition']
                })
            }
            const doc = {
                $set: {
                    letter_name: data.letter_name,
                    details: details,
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
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async delete(data, result) {
        try {
            const db = await connection();
            const query = {
                "_id": ObjectId(data._id),
                "RWId": data.RWId
            }
            const final_result = await db.deleteOne(query);
            if (final_result.deletedCount == 1) {
                return result(null);
            } else {
                return result({ kind: "data_not_found" });
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
    const database = client.db("siDesa");
    const collection = database.collection("organizational_letters");
    return collection;
}
module.exports = OrganizationalLetterModel;