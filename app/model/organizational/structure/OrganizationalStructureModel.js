const client = require("../../../config/db/Mongo-dev");
const StructureModel = function (params) {
    this.person = params.person,
        this.jobs = params.jobs
}
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('organizational_structure');
    return collection;
}
StructureModel.read = async (result) => {
    try {
        const db = await connection();
        const query = {}
        const cursor = await db.find(query);
        const allValues = await cursor.toArray();

        if (allValues.length > 0) {
            return result(null, allValues);
        } else {
            return resizeBy({ kind: "not_found" });
        }
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
StructureModel.insert = async (data, result) => {
    try {
        const db = await connection();
        const doc = {
            "person": data.person,
            "jobs": data.jobs
        }
        await db.insertOne(doc);
        return result(null);
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
module.exports = StructureModel;