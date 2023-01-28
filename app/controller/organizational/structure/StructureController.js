const StructureModel = require("../../../model/organizational/structure/OrganizationalStructureModel");
const helper = require("../../../helper/upload/UploadPhoto");
const { ObjectId } = require("mongodb");

exports.read = (req, res, next) => {
    StructureModel.read(req.user.RWId, (error, result) => {
        if (error) {
            if (error.kind === "not_found") {
                return res.status(404).send({
                    message: "not_found"
                });
            } else {
                return res.status(500).send({
                    message: error
                });
            }
        } else {
            var final_result = [];
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            var jobs = [];
            for (let index = 0; index < result.length; index++) {
                jobs.push(result[index]['jobs']);
            }
            var unique_jobs = jobs.filter(onlyUnique);
            for (let index = 0; index < unique_jobs.length; index++) {
                final_result.push({
                    jobs: unique_jobs[index],
                    person: []
                });
            }
            for (let index = 0; index < final_result.length; index++) {
                for (let y = 0; y < result.length; y++) {
                    var file_path = result[y]['person'][0]['photo'];
                    if (final_result[index]['jobs'] == result[y]['jobs'] && file_path != undefined) {
                        helper.getUrl(file_path).then((success) => {
                            final_result[index]['person'].push({
                                _id: result[y]['_id'],
                                name: result[y]['person'][0]['name'],
                                photo: success
                            });
                            if (index == final_result.length - 1) {
                                return res.status(200).send({
                                    message: final_result
                                });
                            }
                        }).catch((error) => {
                            return res.status(500).send({
                                message: error
                            });
                        })
                    }
                }
            }
        }
    });
}
exports.readById = (req, res, next) => {
    const data = new StructureModel({
        "_id": req.params.id,
        "RWId": req.user.RWId
    });
    StructureModel.readById(data, (error, result) => {
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
            let file_path = result[0]['person'][0]['photo'];
            var final_result = [];
            helper.getUrl(file_path).then((success) => {
                final_result.push({
                    jobs: result[0]['jobs'],
                    person: [
                        {
                            _id: result[0]['_id'],
                            name: result[0]['person'][0]['name'],
                            photo: success
                        }
                    ]
                });
                return res.status(200).send({
                    message: final_result
                });
            }).catch((error) => {
                return res.status(500).send({
                    message: error
                });
            });
        }
    });
}
exports.insert = (req, res, next) => {
    const RWId = req.user.RWId;
    const _id = new ObjectId();
    const file = req.file;
    const file_path = `organizational/${RWId}/structure/photo/${_id}/`;
    const file_name = _id + ".jpg";
    helper.upload(file, file_path, file_name).then((success) => {
        const data = new StructureModel({
            "_id": _id,
            "RWId": RWId,
            "name": req.body.name,
            "photo": success,
            "jobs": req.body.jobs
        });
        StructureModel.insert(data, (error, result) => {
            if (error) {
                return res.status(500).send({
                    message: error
                });
            } else {
                return res.status(201).send({
                    message: 'inserted'
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
    const RWId = req.user.RWId;
    const _id = req.params.id;
    let file = req.file;
    const file_path = `organizational/${RWId}/structure/photo/${_id}/`;
    const file_name = _id + ".jpg";

    if (file) {
        helper.upload(file, file_path, file_name).then((success) => {
            const data = new StructureModel({
                "_id": _id,
                "RWId": RWId,
                "name": req.body.name,
                "photo": success,
                "jobs": req.body.jobs
            });
            StructureModel.update(data, (error, result) => {
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
                        message: 'updated'
                    });
                }
            });
        }).catch((error) => {
            return res.status(500).send({
                message: error
            });
        });
    } else {
        const data_old = new StructureModel({
            "_id": _id,
            "RWId": RWId
        });
        StructureModel.readById(data_old, (error, resultById) => {
            if (error) {
                return res.status(500).send({
                    message: error
                });
            } else {
                const data = new StructureModel({
                    "_id": _id,
                    "RWId": RWId,
                    "name": req.body.name,
                    "jobs": req.body.jobs,
                    "photo": resultById[0]['person'][0]['photo']
                });
                StructureModel.update(data, (error, result) => {
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
                            message: 'updated'
                        });
                    }
                });
            }
        });
    }
}
exports.delete = (req, res, next) => {
    const data = new StructureModel({
        "_id": req.params.id,
        "RWId": req.user.RWId
    });
    StructureModel.readById(data, (error, result) => {
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
            let file_path = result[0]['person'][0]['photo'];
            helper.delete(file_path).then((success) => {
                StructureModel.delete(data, (error, result) => {
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
                            message: 'deleted'
                        });
                    }
                })
            }).catch((error) => {
                return res.status(500).send({
                    message: error
                });
            });
        }
    });
}