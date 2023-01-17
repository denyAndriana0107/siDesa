module.exports = app => {
    const express = require("express");
    const router = express.Router();


    const dao = require("../../../controller/news/comments/NewsController");
    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middleware = require("../../../middlewares/permission/RoleMiddleware");

    router.get('/news/comments/:id_news', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.readComments);
    router.post('/news/comments/insert/:id_news', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.insertComments);
    app.use('/api/', router);
}