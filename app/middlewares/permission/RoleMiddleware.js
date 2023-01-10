const client = require("../../config/db/Mongo-dev");
require("dotenv").config();
module.exports = {
    isSuperAdmin: async (req, res, next) => {
        try {
            await client.connect();
            const database = client.db('siDesa');
            const collection = database.collection('auth_users');

            const query = { "phone": `${req.user.phone}` };
            const cursor = collection.find(query);
            const allValues = await cursor.toArray();

            if (allValues.length > 0) {
                // cek role permission
                if (allValues[0]["auth_users_group_id"] == process.env.SUPER_ADMIN) {
                    await client.close();
                    next();
                } else {
                    return res.status(403).send({
                        message: `access denied`
                    });
                }
            } else {
                return res.status(403).send({
                    message: `access denied`
                });
            }
        } catch (error) {
            return res.status(500).send({
                message: error.message
            });
        }
    },
    isAdminRW: async (req, res, next) => {
        try {
            await client.connect();
            const database = client.db('siDesa');
            const collection = database.collection('auth_users');

            const query = { "phone": `${req.user.phone}` };
            const cursor = collection.find(query);
            const allValues = await cursor.toArray();

            if (allValues.length > 0) {
                // cek role permission
                if (allValues[0]["auth_users_group_id"] == process.env.ADMIN_RW) {
                    next();
                } else {
                    return res.status(403).send({
                        message: `access denied`
                    });
                }
            } else {
                return res.status(403).send({
                    message: `access denied`
                });
            }

        } catch (error) {
            return res.status(500).send({
                message: error.message
            });
        }
    },
    isWarga: async (req, res, next) => {
        try {
            await client.connect();
            const database = client.db('siDesa');
            const collection = database.collection('auth_users');

            const query = { "phone": `${req.user.phone}` };
            const cursor = collection.find(query);
            const allValues = await cursor.toArray();

            if (allValues.length > 0) {
                // cek role permission
                if (allValues[0]["auth_users_group_id"] == process.env.WARGA) {
                    next();
                } else {
                    return res.status(403).send({
                        message: `access denied`
                    });
                }
            } else {
                return res.status(403).send({
                    message: `access denied`
                });
            }


        } catch (error) {
            return res.status(500).send({
                message: error.message
            });
        }

    }
}