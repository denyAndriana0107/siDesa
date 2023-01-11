const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");
const bycrypts = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthModel = function (data) {
    this._id = data._id,
        this.phone = data.phone,
        this.password = data.password,
        this.RWId = data.RWId,
        this.createdAt = data.createdAt,
        this.last_login = data.last_login
}

async function connection() {
    await client.connect();
    const database = client.db('siDesa');
    const collection = database.collection('auth_users');
    return collection;
}

AuthModel.signUp = async (data, result) => {
    try {
        await client.connect();
        const database = client.db('siDesa');
        const collection = database.collection('auth_users');

        const query = { "phone": `${data.phone}` };
        const cursor = collection.find(query);
        const allValues = await cursor.toArray();

        // cek user exist
        if (!allValues.length) {
            const user = {
                "phone": data.phone,
                "password": data.password,
                "RWId": data.RWId,
                "createdAt": new Date(),
                "last_login": null,
                "auth_users_group_id": ObjectId(process.env.ADMIN_RW)
            }
            await collection.insertOne(user);
            return result(null, user.RWId);
        } else {
            return result({ kind: "data_conflict" }, null);
        }
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
AuthModel.signUpWarga = async (data, result) => {
    try {
        const collection = await connection();
        const query = { "RWId": `${data.password}` };
        const cursor = collection.find(query);
        const allValues = await cursor.toArray();

        // cek RWID exist
        if (allValues.length > 0) {
            const query = {
                "phone": data.phone
            }
            const cursor = collection.find(query);
            const allValues2 = await cursor.toArray();
            // cek users exist
            if (allValues2.length > 0) {
                return result({
                    kind: "data_conflict"
                }, null);
            } else {
                const password = bycrypts.hashSync(data.password);
                const user = {
                    "_id": ObjectId(data._id),
                    "phone": data.phone,
                    "password": password,
                    "RWId": data.password,
                    "createdAt": new Date(),
                    "last_login": null,
                    "auth_users_group_id": ObjectId(process.env.WARGA)
                }
                await collection.insertOne(user);
                return result(null);
            }
        } else {
            return result({ kind: "RWId_not_found" }, null);
        }
    } catch (error) {
        return result(error.message);
    }
}

AuthModel.signIn = async (data, result) => {
    try {
        await client.connect();
        const database = client.db('siDesa');
        const collection = database.collection('auth_users');

        const query = { "phone": `${data.phone}` };
        const cursor = collection.find(query);
        const allValues = await cursor.toArray();

        // cek user exist
        if (!allValues.length) {
            return result({ kind: "user_not_found" }, null);
        } else {
            bycrypts.compare(
                data.password,
                allValues[0]["password"],
                async (berr, bresult) => {
                    if (berr) {
                        return result({ kind: "users_incorrect" }, null);
                    }
                    if (bresult) {
                        const token = jwt.sign(
                            {
                                phone: allValues[0]["phone"],
                                userId: allValues[0]["_id"],
                                RWId: allValues[0]["RWId"]
                            },
                            "SECRETKEY",
                            { expiresIn: "1d" }
                        );
                        const filter = { "_id": new ObjectId(allValues[0]["_id"]) };
                        const updateDocument = {
                            $set: {
                                last_login: new Date()
                            }
                        }
                        await client.connect();
                        const database = client.db('siDesa');
                        const collection = database.collection('auth_users');
                        await collection.updateOne(filter, updateDocument);
                        return result(null, token);
                    } else {
                        return result({ kind: "users_incorrect" }, null);
                    }

                }
            );

        }
    } catch (error) {
        return result(error.message);
    } finally {
        await client.close();
    }
}
module.exports = AuthModel;