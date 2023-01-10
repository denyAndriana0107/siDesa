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

    const dao = require("../../../controller/users/profile/ProfileController");

    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middlewares = require("../../../middlewares/permission/RoleMiddleware");
    const file_middlewares = require("../../../middlewares/file/FileMiddleware");

    router.get('/users/profile', auth_middleware.isLoggedIn, dao.read);
    router.post('/users/profile/insert', auth_middleware.isLoggedIn, dao.insert);
    router.post('/users/profile/upload_photo', multer.single('file'), auth_middleware.isLoggedIn, file_middlewares.isImage, dao.uploadPhoto);
    router.put('/users/profile/update', auth_middleware.isLoggedIn, dao.update);
    router.delete('/users/profile/delete', auth_middleware.isLoggedIn, dao.delete);
    app.use('/api/', router);
}