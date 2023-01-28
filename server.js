const express = require("express");
const app = express();
const helmet = require("helmet");
var sqlinjection = require('sql-injection');
const cors = require("cors");
const bp = require('body-parser');

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }));
app.use(helmet());
// app.use(sqlinjection);
const PORT = process.env.PORT || 5000;
app.use(express.json());


//===routes====//
app.get("/", (req, res) => {
    res.status(200).send({
        message: "Hallo Welcome to siDesa API"
    });
});


//*****=================routes====================*******//

// auth
require("./app/routes/auth/AuthRoutes")(app); // OTP register belum

// berita
require("./app/routes/news/desc/NewsRoutes")(app);

// comment di berita
require("./app/routes/news/comment/NewsRoutes")(app);//reply coments belum sama like comment

// organizational
require("./app/routes/organizational/structure/StructureRoutes")(app);//add person >1 belum
require("./app/routes/organizational/profile/ProfileRoutes")(app);
require("./app/routes/organizational/facilities/FacilitiesRoutes")(app);
require("./app/routes/organizational/letters/LettersRoutes")(app);

// event organizational
require("./app/routes/events/desc/EventRoutes")(app);
require("./app/routes/events/comments/EventRoutes")(app);

// users
require("./app/routes/users/profile/ProfileRoutes")(app);


//=================routes====================//



app.listen(PORT, () => console.log("Server Running on PORT " + PORT));