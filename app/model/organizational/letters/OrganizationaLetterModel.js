import { ObjectId } from "mongodb";
const client = require("../../../config/db/Mongo");
class OrganizationalLetterModel {
    constructor(params) {
        this._id = params._id,
            this.RWId = params.RWId,
            this.letter_name = params.letter_name,
            this.details = params.details,
            this.about = params.about,
            this.definition = params.definition,
            this.createadAt = params.createadAt,
            this.updatedAt = params.updatedAt
    }
    static async insert(data, result) {
        try {
            const db = await connection();
            const doc = {
                "RWId": data.RWId,
                "letter_name": data.letter_name,
                "details": data.details,
                "createdAt": data.createadAt,
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
    static async update(data, result) {
        try {
            const db = await connection();
            const filter = {
                "_id": ObjectId(data._id),
                "RWId": data.RWId
            }
            const doc = {
                $set: {
                    letter_name: data.letter_name,
                    details: data.details,
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