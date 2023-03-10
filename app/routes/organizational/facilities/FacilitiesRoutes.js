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
    const dao = require("../../../controller/organizational/facilities/FacilitiesController");

    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middlewarer = require("../../../middlewares/permission/RoleMiddleware");
    const file_middleware = require("../../../middlewares/file/FileMiddleware");
    router.get('/organizational/facilities', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.read);

    router.post('/organizational/facilities/insert', multer.single('file'), file_middleware.isImage, auth_middleware.isLoggedIn, auth_middleware.isValidated, permission_middlewarer.isAdminRW, dao.insert);
    router.put('/organizational/facilities/update/:id', multer.single('file'), auth_middleware.isLoggedIn, auth_middleware.isValidated, permission_middlewarer.isAdminRW, dao.update);
    router.delete('/organizational/facilities/delete/:id', auth_middleware.isLoggedIn, permission_middlewarer.isAdminRW, auth_middleware.isValidated, dao.delete);

    app.use('/api/', router);
}