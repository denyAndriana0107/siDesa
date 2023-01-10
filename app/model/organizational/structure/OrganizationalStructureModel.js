const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");
const StructureModel = function (params) {
    this._id = params._id,
        this.name = params.name,
        this.RWId = params.RWId,
        this.jobs = params.jobs,
        this.photo = params.photo
}
async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('organizational_structure');
    return collection;
}
StructureModel.read = async (RWId, result) => {
    try {
        const db = await connection();
        const query = {
            "RWId": RWId
        }
        const cursor = await db.find(query);
        const allValues = await cursor.toArray();

        if (allValues.length > 0) {
            return result(null, allValues);
        } else {
            return result({ kind: "not_found" });
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
            "_id": ObjectId(data._id),
            "RWId": data.RWId,
            "person": [
                {
                    "name": data.name,
                    "photo": data.photo
                }
            ],
            "jobs": data.jobs,
        }
        await db.insertOne(doc);
        return result(null);
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
StructureModel.add_person = async (data, result) => {
    try {
        const db = await connection();
        const filter = {
            "_id": ObjectId(data._id)
        }
        const cursor = db.find(filter);
        const allValues = await cursor.toArray();
        if (allValues.length > 0) {
            var old_doc = [];
            for (let index = 0; index < allValues[0]['person'].length; index++) {
                old_doc.push(allValues[0]['person'][index]);
            }
            var new_doc = [];
            new_doc.push(old_doc);
            new_doc.push({
                name: data.name,
                photo: data.photo
            })
            const doc = {
                $set: {
                    person: new_doc
                }
            }
            const final_result = await db.updateOne(filter, doc);
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
module.exports = StructureModel;