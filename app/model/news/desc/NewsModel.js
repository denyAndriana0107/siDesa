const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");
class NewsModel {
    constructor(data) {
        this._id = data._id,
            this.title = data.title,
            this.description = data.description,
            this.category = data.category,
            this.photo = data.photo,
            this.createdAt = data.createdAt,
            this.updatedAt = data.updatedAt;
    }
    static async read(result) {
        try {
            await client.connect();
            const database = client.db('siDesa');
            const collection = database.collection('news');

            const limit = 15;
            const sort = { createdAt: -1 };
            var options = {
                allowDiskUse: true
            };
            var pipeline = [
                {
                    "$lookup": {
                        "from": "news_analyticts",
                        "localField": "_id",
                        "foreignField": "newsId",
                        "as": "news_analyticts_docs"
                    }
                },
                {
                    "$addFields": {
                        "news_analyticts_docs": {
                            "$arrayElemAt": ["$news_analyticts_docs", 0]
                        }
                    }
                },
                {
                    "$project": {
                        "_id": "$_id",
                        "newsId": "$newsId",
                        "title": "$title",
                        "description": "$description",
                        "category": "$category",
                        "photo": "$photo",
                        "createdAt": "$createdAt",
                        "updatedAt": "$updatedAt",
                        "likes_count": "$news_analyticts_docs.likes_count",
                        "views_count": "$news_analyticts_docs.views_count"
                    }
                }
            ];
            const cursor = collection.aggregate(pipeline, options).sort(sort).limit(limit);
            const allValues = await cursor.toArray();
            var array_data = [];
            array_data = allValues;
            if (array_data.length > 0) {
                return result(null, array_data);
            } else {
                return result({ kind: "not_found" });
            }
        } catch {
            return result(console.error);
        } finally {
            await client.close();
        }
    }
    static async readById(id_news, result) {
        try {
            await client.connect();
            const database = client.db('siDesa');
            const collection = database.collection('news');
            var options = {
                allowDiskUse: true
            };
            var pipeline = [
                {
                    "$lookup": {
                        "from": "news_analyticts",
                        "localField": "_id",
                        "foreignField": "newsId",
                        "as": "news_analyticts_docs"
                    }
                },
                {
                    "$addFields": {
                        "news_analyticts_docs": {
                            "$arrayElemAt": ["$news_analyticts_docs", 0]
                        }
                    }
                },
                {
                    "$match": {
                        "_id": new ObjectId(id_news)
                    }

                },
                {
                    "$project": {
                        "_id": "$_id",
                        "newsId": "$newsId",
                        "title": "$title",
                        "description": "$description",
                        "category": "$category",
                        "photo": "$photo",
                        "createdAt": "$createdAt",
                        "updatedAt": "$updatedAt",
                        "likes_count": "$news_analyticts_docs.likes_count",
                        "views_count": "$news_analyticts_docs.views_count"
                    }
                }
            ];
            const cursor = collection.aggregate(pipeline, options);
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
    static async insert(data, result) {
        try {
            await client.connect();
            const database = client.db('siDesa');
            const collection = database.collection('news');

            const doc = {
                "_id": data._id,
                "title": data.title,
                "description": data.description,
                "category": data.category,
                "photo": data.photo,
                "createdAt": data.createdAt,
                "updatedAt": data.updatedAt
            };
            await collection.insertOne(doc);
            return result(null);
        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async update(id_news, data, result) {
        try {
            await client.connect();
            const database = client.db('siDesa');
            const collection = database.collection('news');

            const filter = { "_id": new ObjectId(id_news) };
            const cursor = collection.find(filter);
            const allValues = await cursor.toArray();

            var array_data = [];
            array_data = allValues;
            if (array_data.length > 0) {
                if (data.photo != undefined) {
                    const updateDocument = {
                        $set: {
                            title: data.title,
                            description: data.description,
                            category: data.category,
                            photo: data.photo,
                            updatedAt: data.updatedAt
                        },
                    };
                    const final_result = await collection.updateOne(filter, updateDocument);
                    if (final_result.matchedCount == 1) {
                        return result(null);
                    } else {
                        return result({ kind: "not_found" });
                    }
                } else {
                    const updateDocument = {
                        $set: {
                            title: data.title,
                            description: data.description,
                            category: data.category,
                            updatedAt: data.updatedAt
                        },
                    };
                    const final_result = await collection.updateOne(filter, updateDocument);
                    if (final_result.matchedCount == 1) {
                        return result(null);
                    } else {
                        return result({ kind: "not_found" });
                    }
                }
            } else {
                return result({ kind: "not_found" });
            }

        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async delete(id_news, result) {
        try {
            await client.connect();
            const database = client.db('siDesa');
            const collection = database.collection('news');

            const doc = { "_id": ObjectId(id_news) };
            const final_result = await collection.deleteOne(doc);

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


module.exports = NewsModel;