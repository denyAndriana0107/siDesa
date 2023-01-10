
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://deny:1234@kampus.q6vqhdu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});
async function run() {
    try {
        await client.connect();
        await client.db("siDesa").command({ ping: 1 });
        console.log("Database Connected");
    } catch {
        console.log("Database Not Connected");
    } finally {
        await client.close();
    }

}
run().catch(console.dir);

module.exports = client;