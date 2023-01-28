const client = require("../../../config/db/Mongo-dev");
const { ObjectId } = require("mongodb");
class AnalytictsModel {
    constructor(params) {
        this.eventId = params.eventId,
            this.likes_count = params.likes_count,
            this.liked = params.liked,// variable untuk cek boolean user like events
            this.views_count = params.views_count,
            this.shares_count = params.shares_count;
    }
    static async read(id_event, result) {
        try {
            const db = await connection();
            const filter = {
                "eventId": ObjectId(id_event)
            };
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
    static async insert(id_event, result) {
        try {
            const db = await connection();
            const doc = {
                "eventId": ObjectId(id_event),
                "likes_count": 0,
                "views_count": 0,
                "shares_count": 0
            };
            await db.insertOne(doc);
            return result(null);
        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async add_like(data, result) {
        try {
            const db = await connection();
            const filter = {
                "eventId": ObjectId(data.eventId)
            };
            const cursor = db.find(filter);
            const allValues = await cursor.toArray();

            if (allValues.length > 0) {
                const db = await connection();
                var doc = null;
                if (data.liked) {
                    doc = {
                        $set: {
                            likes_count: allValues[0]['likes_count'] - 1
                        }
                    };
                } else {
                    doc = {
                        $set: {
                            likes_count: allValues[0]['likes_count'] + 1
                        }
                    };
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
    static async add_view(id_event, result) {
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
                };
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
    static async add_share(id_event, result) {
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
                        shares_count: allValues[0]['shares_count'] + 1
                    }
                };
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
    static async delete(id_event, result) {
        try {
            const db = await connection();
            const filter = {
                "eventId": ObjectId(id_event)
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
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('events_analyticts');
    return collection;
}
module.exports = AnalytictsModel;