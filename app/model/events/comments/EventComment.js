const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");
const EventsCommentsmodel = function (params) {
    this.text = params.text,
        this.createdAt = params.createdAt,
        this.updatedAt = params.updatedAt,
        this.eventId = params.eventId,
        this.usersid = params.usersid
}
EventsCommentsmodel.insert = async (data, result) => {
    try {
        await client.connect();
        const database = client.db('siDesa');
        const collection = database.collection('events_comments');

        const doc = {
            "text": data.text,
            "createdAt": data.createdAt,
            "updatedAt": data.updatedAt,
            "eventId": data.eventId,
            "userId": data.userId
        }
        await collection.insertOne(doc);
        return result(null);
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
EventsCommentsmodel.read = async (id_Events, result) => {
    try {
        await client.connect();
        const database = client.db('siDesa');
        const collection = database.collection('events_comments');

        const limit = 20;
        const sort = { createdAt: -1 };
        const query = { "eventId": ObjectId(id_Events) };
        const cursor = collection.find(query).sort(sort).limit(limit);
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
module.exports = EventsCommentsmodel;