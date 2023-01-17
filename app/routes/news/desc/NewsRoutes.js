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

    const dao = require("../../../controller/news/desc/NewsController");
    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middleware = require("../../../middlewares/permission/RoleMiddleware");

    router.get('/news', auth_middleware.isLoggedIn, auth_middleware.isValidated, auth_middleware.isValidated, dao.readNews);
    router.get('/news/:id_news', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.readNewsById);
    router.get('/news/analyticts/:id_news', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.readNewsAnalytictsById);

    router.post('/news/insert', multer.single('file'), auth_middleware.isLoggedIn, permission_middleware.isSuperAdmin, dao.insertNews);
    router.post('/news/add_like/:id_news', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.add_like);

    router.put('/news/update/:id_news', multer.single('file'), auth_middleware.isLoggedIn, permission_middleware.isSuperAdmin, dao.updateNews);

    router.delete('/news/delete/:id_news', auth_middleware.isLoggedIn, permission_middleware.isSuperAdmin, dao.deleteNews);
    app.use('/api/', router);
}