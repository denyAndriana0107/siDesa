const client = require("../../../config/db/Mongo");
const NewsCommentsmodel = function (params) {
    this.text = params.text,
        this.createdAt = params.createdAt,
        this.updatedAt = params.updatedAt,
        this.newsId = params.newsId,
        this.usersid = params.usersid
}
NewsCommentsmodel.insert = async (data, result) => {
    try {
        await client.connect();
        const database = client.db('siDesa');
        const collection = database.collection('news_comments');

        const doc = {
            "text": data.text,
            "createdAt": data.createdAt,
            "updatedAt": data.updatedAt,
            "newsId": data.newsId,
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
NewsCommentsmodel.read = async (id_news, result) => {
    try {
        await client.connect();
        const database = client.db('siDesa');
        const collection = database.collection('news_comments');

        const limit = 20;
        const sort = { createdAt: -1 };
        const query = { "newsId": id_news };
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
module.exports = NewsCommentsmodel;