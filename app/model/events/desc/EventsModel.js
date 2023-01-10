const client = require("../../../config/db/Mongo");
const { ObjectId } = require("mongodb");
const EventsModel = function (params) {
    this._id = params._id,
        this.event_name = params.event_name,
        this.category = params.category,
        this.date = params.date,
        this.description = params.description,
        this.photo = params.photo,
        this.RWId = params.RWId,
        this.createdAt = params.createdAt,
        this.updatedAt = params.updatedAt
}
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('events');
    return collection;
}
EventsModel.read = async (RWId, result) => {
    try {
        const db = await connection();
        const limit = 15;
        const sort = { createdAt: -1 };
        const query = {
            "RWId": RWId
        }
        const cursor = await db.find(query).limit(limit).sort(sort);
        const final_result = await cursor.toArray();
        if (final_result.length > 0) {
            return result(null, final_result);
        } else {
            return result({ kind: "not_found" });
        }
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
EventsModel.readById = async (id, result) => {
    try {
        const db = await connection();
        const filter = {
            "_id": ObjectId(id)
        }
        const cursor = await db.find(filter);
        const final_result = await cursor.toArray();
        console.log(final_result);
        if (final_result.length > 0) {
            return result(null, final_result)
        } else {
            return result({ kind: "not_found" });
        }
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
EventsModel.readByMont = async (month, result) => {
    try {
        const db = await connection();
        const filter = {
            "date": month
        }
        const cursor = db.find(filter);
        const final_result = await cursor.toArray();
        if (final_result.length > 0) {
            return result(null, final_result)
        } else {
            return result({ kind: "not_found" });
        }
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
EventsModel.insert = async (data, result) => {
    try {
        const db = await connection();
        const doc = {
            "_id": data._id,
            "event_name": data.event_name,
            "category": data.category,
            "date": data.date,
            "description": data.description,
            "photo": data.photo,
            "RWId": data.RWId,
            "createdAt": new Date(),
            "updatedAt": null
        }
        await db.insertOne(doc);
        return result(null);
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
EventsModel.update = async (id, data, result) => {
    try {
        const db = await connection();
        const filter = {
            "_id": ObjectId(id)
        }
        if (data.photo != undefined) {
            const doc = {
                $set: {
                    event_name: data.event_name,
                    category: data.category,
                    date: data.date,
                    description: data.description,
                    photo: data.photo,
                    updatedAt: new Date()
                }
            }
            const final_result = await db.updateOne(filter, doc);
            if (final_result.matchedCount == 1) {
                return result(null);
            } else {
                return result({ kind: "not_found" });
            }
        } else {
            const doc = {
                $set: {
                    event_name: data.event_name,
                    category: data.category,
                    date: data.date,
                    description: data.description,
                    updatedAt: new Date()
                }
            }
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
EventsModel.delete = async (id, result) => {
    try {
        const db = await connection();
        const filter = {
            "_id": ObjectId(id)
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
module.exports = EventsModel;