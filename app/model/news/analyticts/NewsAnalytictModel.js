const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");

class NewsAnalyticsModel {
    constructor(params) {
        this.newsId = params.newsId,
            this.likes_count = params.likes_count,
            this.liked = params.liked,// variable untuk cek boolean user like events
            this.views_count = params.views_count
    }
    // ================== read====================
    static async read(id_news, result) {
        try {
            const db = await connection();
            const query = { "newsId": ObjectId(id_news) };
            const cursor = db.find(query);
            const allValues = await cursor.toArray();

            var array_data = [];
            array_data = allValues;
            if (array_data.length > 0) {
                return result(null, array_data);
            } else {
                return result({ kind: "not_found" });
            }
        } catch (error) {
            return result(error);
        } finally {
            await client.close();
        }
    }
    // ================= create ========================
    static async insert_analytics(id_news, result) {
        try {
            const db = await connection();
            const doc = {
                "newsId": ObjectId(id_news),
                "likes_count": 0,
                "views_count": 0
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
                "newsId": ObjectId(data.id_news)
            };
            const cursor = db.find(filter);
            const allValues = await cursor.toArray();

            if (allValues.length > 0) {
                const db = await connection();
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
    static async add_views(id_news, result) {
        try {
            const db = await connection();
            const filter = {
                "newsId": ObjectId(id_news)
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
    // ================= delete =======================
    static async delete(id_news, result) {
        try {
            const db = await connection();
            const filter = {
                "newsId": ObjectId(id_news)
            };
            const final_result = await db.deleteOne(filter);
            if (final_result.deletedCount == 1) {
                return result(null);
            } else {
                return result({ kind: 'not_found' });
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
    const collection = database.collection('news_analyticts');
    return collection;
}


module.exports = NewsAnalyticsModel;