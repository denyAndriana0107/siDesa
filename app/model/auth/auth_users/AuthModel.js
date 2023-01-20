const { ObjectId } = require("mongodb");
const client = require("../../../config/db/Mongo");
const bycrypts = require("bcryptjs");
const jwt = require("jsonwebtoken");
const helper = require("../../../helper/otp/OTP");
require("dotenv").config();

class AuthModel {
    constructor(data) {
        this._id = data._id,
            this.phone = data.phone,
            this.password = data.password,
            this.RWId = data.RWId,
            this.createdAt = data.createdAt,
            this.last_login = data.last_login;
    }
    // signup akun admin RW
    static async signUp(data, result) {
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
                    "_id": ObjectId(data._id),
                    "phone": data.phone,
                    "password": data.password,
                    "RWId": data.RWId,
                    "createdAt": new Date(),
                    "last_login": null,
                    "auth_users_group_id": ObjectId(process.env.ADMIN_RW)
                };
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
    static async signUpWarga(data, result) {
        try {

            const collection = await connection();
            const query = { "RWId": `${data.password}` };
            const cursor = collection.find(query);
            const allValues = await cursor.toArray();

            // cek RWID exist
            if (allValues.length > 0) {
                const query = {
                    "phone": data.phone
                };
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
                    };
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
    static async signIn(data, result) {
        try {
            await client.connect();
            const database = client.db('siDesa');
            const collection = database.collection('auth_users');

            const query = { "phone": `${data.phone}` };
            const cursor = collection.find(query);
            const allValues = await cursor.toArray();

            // cek user exist
            if (!allValues.length) {
                return result({ kind: "users_not_found" }, null);
            } else {
                bycrypts.compare(
                    data.password,
                    allValues[0]["password"],
                    async (berr, bresult) => {
                        if (berr) {
                            return result({ kind: "users_incorrect" }, null);
                        }
                        if (bresult) {
                            const otp = helper.generate();
                            const token = jwt.sign(
                                {
                                    phone: allValues[0]["phone"],
                                    userId: allValues[0]["_id"],
                                    RWId: allValues[0]["RWId"],
                                    secret: otp.secret
                                },
                                "SECRETKEY",
                                // { expiresIn: "1d" }
                                {}
                            );
                            const filter = { "_id": new ObjectId(allValues[0]["_id"]) };
                            const updateDocument = {
                                $set: {
                                    last_login: new Date()
                                }
                            };
                            await client.connect();
                            const database = client.db('siDesa');
                            const collection = database.collection('auth_users');
                            await collection.updateOne(filter, updateDocument);
                            this.getrole(allValues[0]["_id"], (error, result_role) => {
                                if (error) {
                                    return result({ kind: "users_incorrect" }, null);
                                } else {
                                    const final_result = {
                                        token: token,
                                        otp: otp.token,
                                        role: result_role
                                    };
                                    return result(null, final_result);
                                }
                            });
                        } else {
                            return result({ kind: "users_incorrect" }, null);
                        }

                    }
                );

            }
        } catch (error) {
            return result(error.message);
        }
    }
    static async getrole(auth_users_id, result) {
        try {
            const db = await connection();
            var options = {
                allowDiskUse: true
            };
            var pipeline = [
                {
                    "$project": {
                        "_id": 0,
                        "auth_users": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "auth_users.auth_users_group_id",
                        "from": "auth_users_group",
                        "foreignField": "_id",
                        "as": "auth_users_group"
                    }
                },
                {
                    "$unwind": {
                        "path": "$auth_users_group",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$match": {
                        "auth_users._id": ObjectId(auth_users_id)
                    }
                },
                {
                    "$project": {
                        "auth_users_group.role": "$auth_users_group.role",
                        "_id": 0
                    }
                }
            ];
            var cursor = db.aggregate(pipeline, options);
            var final_result = await cursor.toArray();
            return result(null, final_result);
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
    const collection = database.collection('auth_users');
    return collection;
}


module.exports = AuthModel;