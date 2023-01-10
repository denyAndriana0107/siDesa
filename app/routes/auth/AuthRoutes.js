module.exports = app => {
    const express = require("express");
    const router = express.Router();

    const dao = require("../../controller/Auth/AuthController");
    const auth_middleware = require("../../middlewares/auth/AuthMiddleware");
    const permission_middleware = require("../../middlewares/permission/RoleMiddleware");

    router.post('/signin', dao.signIn);
    router.post('/signup', dao.signUp);

    app.use('/auth/', router)
}