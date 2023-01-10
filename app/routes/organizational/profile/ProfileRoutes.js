module.exports = app => {
    const express = require("express");
    const router = express.Router();

    const dao = require("../../../controller/organizational/profile/ProfileController");

    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middlewarer = require("../../../middlewares/permission/RoleMiddleware");

    router.get('/organizational/profile', auth_middleware.isLoggedIn, dao.read);
    router.post('/organizational/profile', auth_middleware.isLoggedIn, permission_middlewarer.isAdminRW, dao.insert);
    router.put('/organizational/profile/update', auth_middleware.isLoggedIn, permission_middlewarer.isAdminRW, dao.update);
    app.use('/api/', router);
}