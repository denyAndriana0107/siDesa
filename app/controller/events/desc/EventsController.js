const EventsModel = require("../../../model/events/desc/EventsModel");
const AnalytictsModel = require("../../../model/events/analyticts/EventsModel");
const UsersLogsLike = require("../../../model/users/logs/LogsLikeEvent");
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
                let file_path = result[index]['events']['photo'];
                helper.getUrl(file_path).then((success) => {
                    final_result.push({
                        _id: result[index]['events']['_id'],
                        event_name: result[index]['events']['event_name'],
                        category: result[index]['events']['category'],
                        description: result[index]['events']['description'],
                        photo: success,
                        analyticts: {
                            likes_count: result[index]['events_analyticts']['likes_count'],
                            views_count: result[index]['events_analyticts']['views_count'],
                            shares_count: result[index]['events_analyticts']['shares_count']
                        },
                        createdAt: result[index]['events']['createdAt'],
                        updatedAt: result[index]['events']['updatedAt']
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
exports.readById = (req, res, next) => {
    const data = new EventsModel({
        "RWId": req.user.RWId,
        "_id": req.params.id
    });
    EventsModel.readById(data, (error, result) => {
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
                    let file_path = result[0]['events']['photo'];
                    var final_result = [];
                    helper.getUrl(file_path).then((success) => {
                        final_result.push({
                            _id: result[0]['events']['_id'],
                            event_name: result[0]['events']['event_name'],
                            category: result[0]['events']['category'],
                            description: result[0]['events']['description'],
                            photo: success,
                            analyticts: {
                                likes_count: result[0]['events_analyticts']['likes_count'],
                                views_count: result[0]['events_analyticts']['views_count'],
                                shares_count: result[0]['events_analyticts']['shares_count']
                            },
                            createdAt: result[0]['events']['createdAt'],
                            updatedAt: result[0]['events']['updatedAt']
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
exports.readByCategory = (req, res, next) => {
    const data = new EventsModel({
        "RWId": req.user.RWId,
        "category": req.body.category
    });
    EventsModel.readByCategory(data, (error, result) => {
        if (error) {
            if (error.kind === "data_not_found") {
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
                let file_path = result[index]['events']['photo'];
                helper.getUrl(file_path).then((success) => {
                    final_result.push({
                        _id: result[index]['events']['_id'],
                        event_name: result[index]['events']['event_name'],
                        category: result[index]['events']['category'],
                        description: result[index]['events']['description'],
                        photo: success,
                        analyticts: {
                            likes_count: result[index]['events_analyticts']['likes_count'],
                            views_count: result[index]['events_analyticts']['views_count'],
                            shares_count: result[index]['events_analyticts']['shares_count']
                        },
                        createdAt: result[index]['events']['createdAt'],
                        updatedAt: result[index]['events']['updatedAt']
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
exports.readByMonth = (req, res, next) => {
    const data = {
        "month": req.params.month
    }
    EventsModel.readByMont(data, (error, result) => {
        if (error) {
            if (error.kind === "data_not_found") {
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
                let file_path = result[index]['events']['photo'];
                helper.getUrl(file_path).then((success) => {
                    final_result.push({
                        _id: result[index]['events']['_id'],
                        event_name: result[index]['events']['event_name'],
                        category: result[index]['events']['category'],
                        description: result[index]['events']['description'],
                        photo: success,
                        analyticts: {
                            likes_count: result[index]['events_analyticts']['likes_count'],
                            views_count: result[index]['events_analyticts']['views_count'],
                            shares_count: result[index]['events_analyticts']['shares_count']
                        },
                        createdAt: result[index]['events']['createdAt'],
                        updatedAt: result[index]['events']['updatedAt']
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
exports.searchEvent = (req, res, next) => {
    const data = new EventsModel({
        "RWId": req.user.RWId
    });
    const keyword = req.body.keyword;
    EventsModel.searchEvent(data, keyword, (error, result) => {
        if (error) {
            if (error.kind === "data_not_found") {
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
                let file_path = result[index]['events']['photo'];
                helper.getUrl(file_path).then((success) => {
                    final_result.push({
                        _id: result[index]['events']['_id'],
                        event_name: result[index]['events']['event_name'],
                        category: result[index]['events']['category'],
                        description: result[index]['events']['description'],
                        photo: success,
                        analyticts: {
                            likes_count: result[index]['events_analyticts']['likes_count'],
                            views_count: result[index]['events_analyticts']['views_count'],
                            shares_count: result[index]['events_analyticts']['shares_count']
                        },
                        createdAt: result[index]['events']['createdAt'],
                        updatedAt: result[index]['events']['updatedAt']
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
exports.add_like = (req, res, next) => {
    const data = new UsersLogsLike({
        "auth_users_id": req.user.userId,
        "eventId": req.params.id
    });
    UsersLogsLike.find(data, (error, result) => {
        if (error) {
            return res.status(500).send({
                message: error
            });
        } else {
            const data_add_like = new AnalytictsModel({
                "eventId": req.params.id,
                "liked": result
            });
            AnalytictsModel.add_like(data_add_like, (error, result2) => {
                if (error) {
                    return res.status(500).send({
                        message: error
                    });
                } else {
                    const data_users_logs_like = new UsersLogsLike({
                        "eventId": req.params.id,
                        "auth_users_id": req.user.userId
                    });
                    UsersLogsLike.InsertOrDelete(data_users_logs_like, (error, result3) => {
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
            })
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
    const data = new EventsModel({
        "RWId": req.user.RWId,
        "_id": req.params.id
    });
    EventsModel.readById(data, (error, result) => {
        if (error) {
            return res.status(404).send({
                message: 'not_found'
            });
        } else {
            helper.delete(result[0]['events']['photo']).then((success) => {
                EventsModel.delete(req.params.id, (error, result) => {
                    if (error) {
                        if (error.kind === "not_found") {
                            return res.status(404).send({
                                message: 'not_found2'
                            });
                        }
                        return res.status(500).send({
                            message: error
                        });
                    } else {
                        AnalytictsModel.delete(req.params.id, (error, result2) => {
                            if (error) {
                                if (error.kind === "not_found") {
                                    return res.status(404).send({
                                        message: 'not_found3'
                                    });
                                }
                            } else {
                                return res.status(200).send({
                                    message: "deleted"
                                });
                            }
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