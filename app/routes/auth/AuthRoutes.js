module.exports = app => {
    const express = require("express");
    const router = express.Router();

    const dao = require("../../controller/Auth/AuthController");
    const auth_middleware = require("../../middlewares/auth/AuthMiddleware");
    const permission_middleware = require("../../middlewares/permission/RoleMiddleware");

    router.post('/signup', auth_middleware.isLoggedIn, auth_middleware.isValidated, permission_middleware.isSuperAdmin, dao.signUp);
    router.post('/signin', dao.signIn2);
    router.post('/signout', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.signOut);
    router.post('/OTP/validate', auth_middleware.isLoggedIn, dao.validateOTP);
    router.post('/token_fcm', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.insertOrUpdateTokenFCM);
    app.use('/auth/', router)
}