const client = require("../../../config/db/Mongo-dev");
const { ObjectId } = require("mongodb");
const AnalytictsModel = function (params) {
    this.eventId = params.eventId,
        this.likes_count = params.likes_count,
        this.views_count = params.views_count,
        this.shares_count = params.shares_count
}
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('events_analyticts');
    return collection;
}
AnalytictsModel.read = async (id_event, result) => {
    try {
        const db = await connection();
        const filter = {
            "eventId": ObjectId(id_event)
        }
        const cursor = await db.find(filter);
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
AnalytictsModel.insert = async (id_event, result) => {
    try {
        const db = await connection();
        const doc = {
            "eventId": ObjectId(id_event),
            "likes_count": 0,
            "views_count": 0,
            "shares_count": 0
        }
        await db.insertOne(doc);
        return result(null);
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
AnalytictsModel.add_like = async (id_event, result) => {
    try {
        const db = await connection();
        const filter = {
            "eventId": ObjectId(id_event)
        };
        const cursor = db.find(filter);
        const allValues = await cursor.toArray();

        if (allValues.length > 0) {
            const db = await connection();
            const doc = {
                $set: {
                    likes_count: allValues[0]['likes_count'] + 1
                }
            }
            await db.updateOne(filter, doc);
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
AnalytictsModel.add_view = async (id_event, result) => {
    try {
        const db = await connection();
        const filter = {
            "eventId": ObjectId(id_event)
        };
        const cursor = db.find(filter);
        const allValues = await cursor.toArray();

        if (allValues.length > 0) {
            const db = await connection();
            const doc = {
                $set: {
                    views_count: allValues[0]['views_count'] + 1
                }
            }
            await db.updateOne(filter, doc);
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
AnalytictsModel.add_share = async (id_event, result) => {
    try {
        const db = await connection();
        const filter = {
            "eventId": ObjectId(id_event)
        };
        const cursor = db.find(filter);
        const allValues = await cursor.toArray();

        if (allValues.length > 0) {
            const db = await connection();
            const doc = {
                $set: {
                    shares_count: allValues[0]['views_count'] + 1
                }
            }
            await db.updateOne(filter, doc);
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
AnalytictsModel.delete = async (id_event, result) => {
    try {
        const db = await connection();
        const filter = {
            "eventId": ObjectId(id_event)
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
module.exports = AnalytictsModel;