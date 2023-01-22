module.exports = app => {
    const express = require("express");
    const router = express.Router();
    const dao = require("../../../controller/organizational/letters/LettersControllers");

    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middlewarer = require("../../../middlewares/permission/RoleMiddleware");

    router.get('/organizational/documents', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.read);
    router.get('/organizational/documents/:id', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.readById);

    router.post('/organizational/documents/insert', auth_middleware.isLoggedIn, auth_middleware.isValidated, permission_middlewarer.isAdminRW, dao.insert);
    router.put('/organizational/documents/update/:id', auth_middleware.isLoggedIn, auth_middleware.isValidated, permission_middlewarer.isAdminRW, dao.update);
    router.delete('/organizational/documents/delete/:id', auth_middleware.isLoggedIn, auth_middleware.isValidated, permission_middlewarer.isAdminRW, dao.delete);

    app.use('/api/', router);
}