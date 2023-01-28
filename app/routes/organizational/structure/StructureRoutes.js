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


    const dao = require("../../../controller/organizational/structure/StructureController");

    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middlewarer = require("../../../middlewares/permission/RoleMiddleware");
    const file_middleware = require("../../../middlewares/file/FileMiddleware");

    router.get('/organizational/structure', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.read);
    router.get('/organizational/structure/:id', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.readById);
    router.post('/organizational/structure', multer.single('file'), auth_middleware.isLoggedIn, auth_middleware.isValidated, permission_middlewarer.isAdminRW, file_middleware.isImage, dao.insert);
    router.put('/organizational/structure/update/:id', multer.single('file'), auth_middleware.isLoggedIn, auth_middleware.isValidated, permission_middlewarer.isAdminRW, dao.update);
    router.delete('/organizational/structure/delete/:id', auth_middleware.isLoggedIn, auth_middleware.isValidated, permission_middlewarer.isAdminRW, dao.delete);
    app.use('/api/', router);
}