require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.URI_DB;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    ssl: true,
    sslValidate: true,
    tlsCAFile: `./app/config/services/rds-combined-ca-bundle.pem`
});
async function run() {
    try {
        await client.connect();
        await client.db("siDesa").command({ ping: 1 });
        console.log("Database Connected");
    } catch {
        await client.close();
    }

}
run().catch(console.dir);

module.exports = client;