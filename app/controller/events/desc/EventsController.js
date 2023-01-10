const EventsModel = require("../../../model/events/desc/EventsModel");
const AnalytictsModel = require("../../../model/events/analyticts/EventsModel");
const helper = require("../../../helper/upload/UploadPhoto");
const { ObjectId } = require("mongodb");

exports.insert = (req, res, next) => {
    const _id = new ObjectId();
    let file = req.file;
    let file_path = `events/${req.user.RWId}/${req.body.category}/${_id}/`;
    let file_name = _id + ".jpg";
    helper.upload(file, file_path, file_name).then((success) => {
        const data = new EventsModel({
            "_id": _id,
            "event_name": req.body.event_name,
            "category": req.body.category,
            "date": req.body.date,
            "description": req.body.description,
            "photo": success,
            "RWId": req.user.RWId,
            "createdAt": new Date(),
            "updatedAt": null
        });
        EventsModel.insert(data, (error, result) => {
            if (error) {
                return res.status(500).send({
                    message: error
                });
            } else {
                AnalytictsModel.insert(data._id, (error, result2) => {
                    if (error) {
                        return res.status(500).send({
                            message: error
                        });
                    } else {
                        return res.status(201).send({
                            message: 'events created'
                        });
                    }
                })
            }
        });
    }).catch((error) => {
        return res.status(500).send({
            message: error
        });
    });
}
exports.read = (req, res, next) => {
    EventsModel.read(req.user.RWId, (error, result) => {
        if (error) {
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
                        event_name: result[index]['event_name'],
                        category: result[index]['category'],
                        description: result[index]['description'],
                        photo: success,
                        createdAt: result[index]['createdAt'],
                        updatedAt: result[index]['updatedAt']
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
exports.readAnalytits = (req, res, next) => {
    AnalytictsModel.read(req.params.id, (error, result) => {
        if (error) {
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
exports.add_like = (req, res, next) => {
    AnalytictsModel.add_like(req.params.id, (error, result) => {
        if (error) {
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(200).send({
                message: 'ok'
            });
        }
    })
}
exports.add_share = (req, res, next) => {
    AnalytictsModel.add_share(req.params.id, (error, result) => {
        if (error) {
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(200).send({
                message: 'ok'
            });
        }
    })
}
exports.readById = (req, res, next) => {
    EventsModel.readById(req.params.id, (error, result) => {
        if (error) {
            return res.status(500).send({
                message: error
            });
        } else {
            AnalytictsModel.add_view(req.params.id, (error, result2) => {
                if (error) {
                    return res.status(500).send({
                        message: error
                    });
                } else {
                    let file_path = result[0]['photo'];
                    var final_result = [];
                    helper.getUrl(file_path).then((success) => {
                        final_result.push({
                            _id: result[0][index]['_id'],
                            event_name: result[0][index]['event_name'],
                            category: result[0][index]['category'],
                            description: result[0][index]['description'],
                            photo: success,
                            createdAt: result[0][index]['createdAt'],
                            updatedAt: result[0][index]['updatedAt']
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
    });
}
exports.update = (req, res, next) => {
    const _id = req.params.id;
    let file = req.file;
    let file_path = `events/${req.user.RWId}/${req.body.category}/${_id}/`;
    let file_name = _id + ".jpg";
    if (file) {
        helper.upload(file, file_path, file_name).then((success) => {
            const data = new EventsModel({
                "event_name": req.body.event_name,
                "category": req.body.category,
                "date": req.body.date,
                "description": req.body.description,
                "photo": success,
            });
            EventsModel.update(_id, data, (error, result) => {
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
    } else {
        const data = new EventsModel({
            "event_name": req.body.event_name,
            "category": req.body.category,
            "date": req.body.date,
            "description": req.body.description
        });
        EventsModel.update(_id, data, (error, result) => {
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
}
exports.delete = (req, res, next) => {
    EventsModel.delete(req.params.id, (error, result) => {
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
            AnalytictsModel.delete(req.params.id, (error, result) => {
                if (error) {
                    if (error.kind === "not_found") {
                        return res.status(404).send({
                            message: 'not_found'
                        });
                    }
                } else {
                    return res.status(200).send({
                        message: 'ok'
                    });
                }
            });
        }
    })
}