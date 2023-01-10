const ProfileModel = require("../../../model/organizational/profile/OrganizationalProfileModel");

exports.read = (req, res, next) => {
    ProfileModel.read(req.user.RWId, (error, result) => {
        if (error) {
            if (error.kind === "not_found") {
                return res.status(404).send({
                    message: "not_found"
                });
            }
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(200).send({
                message: result
            });
        }
    });
}
exports.insert = (req, res, next) => {
    const data = new ProfileModel({
        "name": req.body.name,
        "RWId": req.user.RWId,
        "address": {
            "RW": req.body.RW,
            "KEL": req.body.KEL,
            "KEC": req.body.KEC,
            "KAB": req.body.KAB,
            "Prov": req.body.Prov
        }
    });
    ProfileModel.insert(data, (error, result) => {
        if (error) {
            if (error.kind === "data_conflict") {
                return res.status(409).send({
                    message: 'data_conflict'
                });
            }
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(201).send({
                message: 'profile created'
            });
        }
    });
}
exports.update = (req, res, next) => {
    const data = {
        "RWId": req.user.RWId,
        "name": req.body.name,
        "address": {
            "RW": req.body.RW,
            "KEL": req.body.KEL,
            "KEC": req.body.KEC,
            "KAB": req.body.KAB,
            "Prov": req.body.Prov
        }
    }
    ProfileModel.update(data, (error, result) => {
        if (error) {
            if (error.kind === "not_found") {
                return res.status(404).send({
                    message: "not_found"
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