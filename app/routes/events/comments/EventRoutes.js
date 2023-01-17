module.exports = app => {
    const express = require("express");
    const router = express.Router();


    const dao = require("../../../controller/events/comments/EventsController");
    const auth_middleware = require("../../../middlewares/auth/AuthMiddleware");
    const permission_middleware = require("../../../middlewares/permission/RoleMiddleware");

    router.get('/event/comments/:id_event', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.readComments);
    router.post('/event/comments/insert/:id_event', auth_middleware.isLoggedIn, auth_middleware.isValidated, dao.insertComments);
    app.use('/api/', router);
}