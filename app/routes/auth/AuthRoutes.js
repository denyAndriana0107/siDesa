module.exports = app => {
    const express = require("express");
    const router = express.Router();

    const dao = require("../../controller/Auth/AuthController");
    const auth_middleware = require("../../middlewares/auth/AuthMiddleware");
    const permission_middleware = require("../../middlewares/permission/RoleMiddleware");

    router.post('/signin', dao.signIn);
    router.post('/signup', auth_middleware.isLoggedIn, permission_middleware.isSuperAdmin, dao.signUp);
    router.post('/signin/v2', dao.signIn2);
    app.use('/auth/', router)
}