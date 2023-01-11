const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");
const ProfileModel = function (params) {
    this._id = params._id,
        this.RWId = params.RWId,
        this.name = params.name,
        this.address = params.address
}
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('organizational_profile');
    return collection;
}
ProfileModel.read = async (RWId, result) => {
    try {
        const db = await connection();
        const query = {
            "RWId": RWId
        }
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
ProfileModel.insert = async (data, result) => {
    try {
        const db = await connection();
        const query = {
            "RWId": data.RWId
        }
        const cursor = db.find(query);
        const allValues = await cursor.toArray();
        if (allValues.length > 0) {
            return result({ kind: "data_conflict" })
        } else {
            const doc = {
                "RWId": data.RWId,
                "name": data.name,
                "address": data.address
            }
            await db.insertOne(doc);
            return result(null);
        }
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close()
    }
}
ProfileModel.update = async (data, result) => {
    try {
        const db = await connection();
        const query = {
            "RWId": data.RWId
        }
        console.log(query);
        const doc = {
            $set: {
                name: data.name,
                address: data.address
            }
        }
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
module.exports = ProfileModel;