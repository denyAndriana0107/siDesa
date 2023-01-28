const ProfileModel = require("../../../model/users/UsersModel");
const OrganizationalProfile = require("../../../model/organizational/profile/OrganizationalProfileModel");
const helper = require("../../../helper/upload/UploadPhoto");

exports.read = (req, res, next) => {
    ProfileModel.read(req.user.userId, (error, result) => {
        if (error) {
            if (error.kind === "not_found") {
                return res.status(404).send({
                    message: 'not_found'
                });
            }
            return res.status(500).send({
                message: error.message
            });
        } else {
            OrganizationalProfile.read(req.user.RWId, (error, result2) => {
                if (error) {
                    return res.status(500).send({
                        message: error.message
                    });
                } else {
                    let file_path = result[0]['users_profile']['photo'];
                    helper.getUrl(file_path).then((data) => {
                        var final_result = [];
                        final_result.push({
                            _id: result[0]['users_profile']['_id'],
                            name: result[0]['users_profile']['name'],
                            phone: result[0]['auth_users']['phone'],
                            photo: data,
                            address: result2[0]['address'],

                        });
                        return res.status(200).send({
                            message: final_result
                        });
                    }).catch((error) => {
                        return res.status(500).send({
                            message: error.message
                        });
                    });
                }
            });
        }
    });
}
exports.insert = (req, res, next) => {
    const data = new ProfileModel({
        "name": req.body.name,
        "photo": "default.jpg",
        "auth_users_id": req.user.userId
    });
    ProfileModel.insert(data, (error, result) => {
        if (error) {
            if (error.kind === "data_conflict") {
                return res.status(409).send({
                    message: "data_conflict"
                });
            }
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(200).send({
                message: 'ok'
            });
        }
    });
}
exports.uploadPhoto = (req, res, next) => {
    let file = req.file;
    let path = `users/profile/${req.user.phone}/`;
    let file_name = req.user.userId + ".jpg";
    if (file) {
        helper.upload(file, path, file_name).then((succes) => {
            ProfileModel.uploadPhoto(req.user.userId, succes, (error, result) => {
                if (error) {
                    return res.status(500).send({
                        message: error
                    });
                } else {
                    return res.status(201).send({
                        message: 'ok'
                    });
                }
            });
        }).catch((error) => {
            return res.status(500).send({
                message: error
            });
        });
    }
}
exports.update = (req, res, next) => {
    const data = new ProfileModel({
        "name": req.body.name
    });
    ProfileModel.update(req.user.userId, data, (error, result) => {
        if (error) {
            if (error.kind === "not_found") {
                return res.status(404).send({
                    message: 'not_found'
                })
            }
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(200).send({
                message: 'ok'
            });
        }
    });
}
exports.delete = (req, res, next) => {
    ProfileModel.delete(req.user.userId, (error, result) => {
        if (error) {
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(200).send({
                message: 'ok'
            });
        }
    });
}
