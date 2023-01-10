const { ObjectId } = require("mongodb");
const client = require("../../config/db/Mongo-dev");
const UsersModel = function (params) {
    this.name = params.name,
        this.photo = params.photo,
        this.authId = params.authId,
        this.RWId = params.RWId,
        this.address = params.address
}
async function connection(params) {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('users_profile');
    return collection;
}
UsersModel.read = async (id, result) => {
    try {
        const db = await connection();
        const query = {
            "authId": ObjectId(id)
        }
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
UsersModel.insert = async (data, result) => {
    try {
        const db = await connection();
        const query = {
            "authId": ObjectId(data.authId)
        }
        const cursor = await db.find(query);
        const allValues = await cursor.toArray();
        if (allValues.length > 0) {
            return result({ kind: "data_conflict" })
        } else {
            const doc = {
                "name": data.name,
                "photo": data.photo,
                "authId": ObjectId(data.authId),
                "RWId": data.RWId,
                "address": data.address
            }
            await db.insertOne(doc);
            return result(null);
        }
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
UsersModel.update = async (id, data, result) => {
    try {
        const db = await connection();
        const filter = {
            "authId": ObjectId(id)
        }
        const doc = {
            $set: {
                name: data.name,
                address: data.address
            }
        }
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
UsersModel.uploadPhoto = async (id, data, result) => {
    try {
        const db = await connection();
        const filter = {
            "authId": ObjectId(id)
        }
        const doc = {
            $set: {
                photo: data
            }
        }
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
UsersModel.delete = async (id, result) => {
    try {
        const db = await connection();
        const query = {
            "authId": ObjectId(id)
        }
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
module.exports = UsersModel;