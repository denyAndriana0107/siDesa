module.exports = app => {
    const express = require("express");
    const router = express.Router();
    const Multer = require("multer");
    const multer = Multer({
        storage: Multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
        }
    });

    const dao = require("../../../controller/events/desc/EventsController");

    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middlewares = require("../../../middlewares/permission/RoleMiddleware");
    const file_middlewares = require("../../../middlewares/file/FileMiddleware");

    router.get('/event', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.read);
    router.get('/event/:id', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.readById);
    router.get('/event/analyticts/:id', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.readAnalytits);
    router.get('/event/searchByMonth/:month', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.readByMonth)

    router.post('/event/category', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.readByCategory);
    router.post('/event/search', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.searchEvent);
    router.post('/event/insert', multer.single('file'), file_middlewares.isImage, auth_middleware.isLoggedIn, auth_middleware.isValidated, permission_middlewares.isAdminRW, dao.insert);
    router.post('/event/add_like/:id', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.add_like);
    router.post('/event/add_share/:id', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.add_share);

    router.put('/event/update/:id', multer.single('file'), file_middlewares.isImage, auth_middleware.isLoggedIn, auth_middleware.isValidated, permission_middlewares.isAdminRW, dao.update);
    router.delete('/event/delete/:id', auth_middleware.isLoggedIn, permission_middlewares.isAdminRW, auth_middleware.isValidated, dao.delete);
    app.use('/api/', router);
}