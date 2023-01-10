module.exports = app => {
    const express = require("express");
    const router = express.Router();

    const dao = require("../../../controller/organizational/structure/StructureController");

    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middlewarer = require("../../../middlewares/permission/RoleMiddleware");

    router.get('/organizational/structure', auth_middleware.isLoggedIn, dao.read);
    app.use('/api/', router);
}