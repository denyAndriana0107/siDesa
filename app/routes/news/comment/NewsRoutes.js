module.exports = app => {
    const express = require("express");
    const router = express.Router();

    const Multer = require('multer');
    const multer = Multer({
        storage: Multer.memoryStorage(),
        limits: {
            fileSize: 2 * 1024 * 1024 // no larger than 2mb, you can change as needed.
        }
    });

    const dao = require("../../../controller/news/comments/NewsController");
    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middleware = require("../../../middlewares/permission/RoleMiddleware");

    router.get('/news/comments/:id_news', auth_middleware.isLoggedIn, dao.readComments);
    router.post('/news/comments/insert/:id_news', auth_middleware.isLoggedIn, dao.insertComments);
    app.use('/api/', router);
}