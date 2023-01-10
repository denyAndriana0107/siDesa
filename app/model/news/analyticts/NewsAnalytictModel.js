const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");

const NewsAnalyticsModel = function (params) {
    this.newsId = params.newsId,
        this.likes_count = params.likes_count,
        this.views_count = params.views_count
}
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('news_analyticts');
    return collection;
}
// ================== read====================
NewsAnalyticsModel.read = async (id_news, result) => {
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
NewsAnalyticsModel.insert_analytics = async (id_news, result) => {
    try {
        const db = await connection();
        const doc = {
            "newsId": ObjectId(id_news),
            "likes_count": 0,
            "views_count": 0
        }
        await db.insertOne(doc);
        return result(null);
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
NewsAnalyticsModel.add_like = async (id_news, result) => {
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
                    views_count: allValues[0]['likes_count'] + 1
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
NewsAnalyticsModel.add_views = async (id_news, result) => {
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

// ================= delete =======================
NewsAnalyticsModel.delete = async (id_news, result) => {
    try {
        const db = await connection();
        const filter = {
            "newsId": ObjectId(id_news)
        }
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
module.exports = NewsAnalyticsModel;