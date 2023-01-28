const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");
class NewsCommentsmodel {
    constructor(params) {
        this._id = params._id,
            this.text = params.text,
            this.createdAt = params.createdAt,
            this.updatedAt = params.updatedAt,
            this.newsId = params.newsId,
            this.auth_users_id = params.auth_users_id;
    }
    static async insert(data, result) {
        try {
            const db = await connection();
            const doc = {
                "text": data.text,
                "createdAt": data.createdAt,
                "updatedAt": data.updatedAt,
                "newsId": data.newsId,
                "auth_users_id": data.auth_users_id
            };
            await db.insertOne(doc);
            return result(null);
        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async read(id_news, result) {
        try {
            const db = await connection();
            const limit = 20;
            const sort = { createdAt: -1 };
            var options = {
                allowDiskUse: true
            };
            var pipeline = [
                {
                    "$project": {
                        "_id": 0,
                        "news_comments": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "news_comments.auth_users_id",
                        "from": "users_profile",
                        "foreignField": "auth_users_id",
                        "as": "users_profile"
                    }
                },
                {
                    "$unwind": {
                        "path": "$users_profile",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$match": {
                        "news_comments.newsId": ObjectId(id_news)
                    }
                }
            ];
            const cursor = db.aggregate(pipeline, options).sort(sort).limit(limit);
            const allValues = await cursor.toArray();
            var array_data = [];
            array_data = allValues;
            if (array_data.length > 0) {
                return result(null, array_data);
            } else {
                return result({ kind: "not_found" });
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
                "auth_users_id": ObjectId(data.auth_users_id),
                "newsId": ObjectId(data.newsId)
            }
            const doc = {
                $set: {
                    text: data.text,
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
            return result(error);
        } finally {
            await client.close();
        }
    }
    static async delete(data, result) {
        try {
            const db = await connection();
            const filter = {
                "_id": ObjectId(data._id),
                "auth_users_id": ObjectId(data.auth_users_id),
                "newsId": ObjectId(data.newsId)
            }
            const final_result = await db.deleteOne(filter);
            if (final_result.deletedCount == 1) {
                return result(null);
            } else {
                return result({ kind: "data_not_found" });
            }
        } catch (error) {
            return result(error);
        } finally {
            await client.close();
        }
    }
}
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('news_comments');
    return collection;
}


module.exports = NewsCommentsmodel;