module.exports = app => {
    const express = require("express");
    const router = express.Router();


    const dao = require("../../../controller/events/comments/EventsController");
    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middleware = require("../../../middlewares/permission/RoleMiddleware");

    router.get('/news/comments/:id_news', auth_middleware.isLoggedIn, dao.readComments);
    router.post('/news/comments/insert/:id_news', auth_middleware.isLoggedIn, dao.insertComments);
    app.use('/api/', router);
}