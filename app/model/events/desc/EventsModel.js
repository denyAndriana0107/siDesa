const client = require("../../../config/db/Mongo");
const { ObjectId, BSONRegExp } = require("mongodb");
class EventsModel {
    constructor(params) {
        this._id = params._id,
            this.event_name = params.event_name,
            this.category = params.category,
            this.date = params.date,
            this.description = params.description,
            this.photo = params.photo,
            this.RWId = params.RWId,
            this.createdAt = params.createdAt,
            this.updatedAt = params.updatedAt;
    }
    static async read(RWId, result) {
        try {
            const db = await connection();
            const limit = 15;
            const sort = { createdAt: -1 };
            var options = {
                allowDiskUse: true
            };
            var pipeline = [
                {
                    "$project": {
                        "_id": 0,
                        "events": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "events._id",
                        "from": "events_analyticts",
                        "foreignField": "eventId",
                        "as": "events_analyticts"
                    }
                },
                {
                    "$unwind": {
                        "path": "$events_analyticts",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$match": {
                        "events.RWId": RWId
                    }
                }
            ];
            const cursor = db.aggregate(pipeline, options).limit(limit).sort(sort);
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
    static async readById(data, result) {
        try {
            const db = await connection();
            var options = {
                allowDiskUse: true
            };
            var pipeline = [
                {
                    "$project": {
                        "_id": 0,
                        "events": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "events._id",
                        "from": "events_analyticts",
                        "foreignField": "eventId",
                        "as": "events_analyticts"
                    }
                },
                {
                    "$unwind": {
                        "path": "$events_analyticts",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$match": {
                        "events._id": ObjectId(data._id),
                        "events.RWId": data.RWId
                    }
                }
            ];
            const cursor = db.aggregate(pipeline, options);
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
    static async readByMont(month, result) {
        try {
            const db = await connection();
            var options = {
                allowDiskUse: true
            };
            var pipeline = [
                {
                    "$project": {
                        "_id": 0,
                        "events": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "events._id",
                        "from": "events_analyticts",
                        "foreignField": "eventId",
                        "as": "events_analyticts"
                    }
                },
                {
                    "$unwind": {
                        "path": "$events_analyticts",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$match": {

                    }
                }
            ];
            const cursor = db.aggregate(pipeline, options);
            const final_result = await cursor.toArray();
            if (final_result.length > 0) {
                return result(null, final_result);
            } else {
                return result({ kind: "data_not_found" });
            }
        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async searchEvent(data, keyword, result) {
        try {
            const db = await connection();
            var options = {
                allowDiskUse: true
            };
            var pipeline = [
                {
                    "$project": {
                        "_id": 0,
                        "events": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "events._id",
                        "from": "events_analyticts",
                        "foreignField": "eventId",
                        "as": "events_analyticts"
                    }
                },
                {
                    "$unwind": {
                        "path": "$events_analyticts",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$match": {
                        "events.RWId": data.RWId,
                        "$or": [
                            {
                                "events.event_name": new BSONRegExp(`^.*${keyword}.*$`, "i")
                            },
                            {
                                "events.description": new BSONRegExp(`^.*${keyword}.*$`, "i")
                            }
                        ]
                    }
                }
            ];
            const cursor = db.aggregate(pipeline, options);
            const final_result = await cursor.toArray();
            if (final_result.length > 0) {
                return result(null, final_result);
            } else {
                return result({ kind: "data_not_found" });
            }
        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async readByCategory(data, result) {
        try {
            const db = await connection();
            var options = {
                allowDiskUse: true
            };

            var pipeline = [
                {
                    "$project": {
                        "_id": 0,
                        "events": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "events._id",
                        "from": "events_analyticts",
                        "foreignField": "eventId",
                        "as": "events_analyticts"
                    }
                },
                {
                    "$unwind": {
                        "path": "$events_analyticts",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$match": {
                        "events.RWId": data.RWId,
                        "events.category": data.category
                    }
                }
            ];
            const cursor = db.aggregate(pipeline, options);
            const final_result = await cursor.toArray();
            if (final_result.length > 0) {
                return result(null, final_result);
            } else {
                return result({ kind: "data_not_found" });
            }
        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async insert(data, result) {
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
            };
            await db.insertOne(doc);
            return result(null);
        } catch (error) {
            return result(error.message);
        } finally {
            await client.close();
        }
    }
    static async update(id, data, result) {
        try {
            const db = await connection();
            const filter = {
                "_id": ObjectId(id)
            };
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
                };
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
                };
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
    static async delete(id, result) {
        try {
            const db = await connection();
            const filter = {
                "_id": ObjectId(id)
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
    const collection = database.collection('events');
    return collection;
}
module.exports = EventsModel;