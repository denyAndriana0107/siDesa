const FacilitiesModel = require("../../../model/organizational/facilities/FacilitiesModel");
const helper = require("../../../helper/upload/UploadPhoto");
const { ObjectId } = require("mongodb");
exports.read = (req, res, next) => {
    FacilitiesModel.read(req.user.RWId, (error, result) => {
        if (error) {
            if (error.kind === "not_found") {
                return res.status(404).send({
                    message: 'not_found'
                });
            }
            return res.status(500).send({
                message: error
            });
        } else {
            var final_result = [];
            for (let index = 0; index < result.length; index++) {
                let file_path = result[index]['photo'];
                helper.getUrl(file_path).then((success) => {
                    final_result.push({
                        _id: result[index]['_id'],
                        facilities_name: result[index]['facilities_name'],
                        desc: result[index]['desc'],
                        photo: success,
                    });
                    if (index == result.length - 1) {
                        return res.status(200).send({
                            message: final_result
                        });
                    }
                }).catch((error) => {
                    return res.status(500).send({
                        message: error
                    });
                });
            }
        }
    });
}
exports.insert = (req, res, next) => {
    let _id = new ObjectId();
    let file = req.file;
    let file_path = `organizational/${req.user.RWId}/facilities/photo/${_id}/`
    let file_name = _id + ".jpg";
    helper.upload(file, file_path, file_name).then((success) => {
        const data = new FacilitiesModel({
            "facilities_name": req.body.facilities_name,
            "desc": req.body.desc,
            "photo": success,
            "RWId": req.user.RWId
        });
        FacilitiesModel.insert(data, (error, result) => {
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
    }).catch((error) => {
        return res.status(500).send({
            message: error
        });
    });
}
exports.update = (req, res, next) => {
    let file = req.file;
    let _id = req.params.id;
    if (file) {
        let file_path = `organizational/${req.user.RWId}/facilities/photo/${_id}/`
        let file_name = _id + ".jpg";
        helper.upload(file, file_path, file_name).then((success) => {
            const data = new FacilitiesModel({
                "facilities_name": req.body.facilities_name,
                "desc": req.body.desc,
                "photo": success,
                "RWId": req.user.RWId
            });
            FacilitiesModel.update(req.params.id, data, (error, result) => {
                if (error) {
                    if (error.kind === "not_found") {
                        return res.status(404).send({
                            message: 'not_found'
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
        }).catch((error) => {
            return res.status(500).send({
                message: error
            });
        });
    } else {
        const data = new FacilitiesModel({
            "facilities_name": req.body.facilities_name,
            "desc": req.body.desc,
            "RWId": req.user.RWId
        });
        FacilitiesModel.update(req.params.id, data, (error, result) => {
            if (error) {
                if (error.kind === "not_found") {
                    return res.status(404).send({
                        message: 'not_found'
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
}
exports.delete = (req, res, next) => {
    FacilitiesModel.delete(req.params.id, req.user.RWId, (error, result) => {
        if (error) {
            if (error.kind === "not_found") {
                return res.status(404).send({
                    message: 'not_found'
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