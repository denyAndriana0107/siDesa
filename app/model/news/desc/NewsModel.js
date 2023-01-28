const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo-dev");
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
                    "$project": {
                        "_id": 0,
                        "news": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "news._id",
                        "from": "news_analyticts",
                        "foreignField": "newsId",
                        "as": "news_analyticts"
                    }
                },
                {
                    "$unwind": {
                        "path": "$news_analyticts",
                        "preserveNullAndEmptyArrays": true
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
                    "$project": {
                        "_id": 0,
                        "news": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "news._id",
                        "from": "news_analyticts",
                        "foreignField": "newsId",
                        "as": "news_analyticts"
                    }
                },
                {
                    "$unwind": {
                        "path": "$news_analyticts",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$match": {
                        "news._id": ObjectId(id_news)
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
    static async readByCategory(data, result) {
        try {
            await client.connect();
            const database = client.db('siDesa');
            const collection = database.collection('news');
            var options = {
                allowDiskUse: true
            };
            var pipeline = [
                {
                    "$project": {
                        "_id": 0,
                        "news": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "news._id",
                        "from": "news_analyticts",
                        "foreignField": "newsId",
                        "as": "news_analyticts"
                    }
                },
                {
                    "$unwind": {
                        "path": "$news_analyticts",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$match": {
                        "news.category": data.category
                    }
                },
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