const EventsCommentsmodel = require("../../../model/events/comments/EventComment");
const EventsModel = require("../../../model/events/desc/EventsModel");
const helper = require("../../../helper/upload/UploadPhoto");

exports.insertComments = (req, res, next) => {
    const data = {
        _id: req.params.id_event,
        text: req.body.text,
        RWId: req.user.RWId,
        createdAt: new Date(),
        updatedAt: null,
        eventId: req.params.id_event,
        auth_users_id: req.user.userId
    };
    EventsModel.readById(data, (error, result) => {
        if (error) {
            return res.status(500).send({
                message: error + "oi"
            });
        } else {
            EventsCommentsmodel.insert(data, (error, result) => {
                if (error) {
                    return res.status(500).send({
                        message: error
                    });
                } else {
                    return res.status(201).send({
                        message: "comments created"
                    });
                }
            });
        }
    });
}
exports.readComments = (req, res, next) => {
    EventsCommentsmodel.read(req.params.id_event, (error, result) => {
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
                var file_path = result[index]['users_profile']['photo'];
                helper.getUrl(file_path).then((success) => {
                    final_result.push({
                        "_id": result[0]['events_comments']["_id"],
                        "user": {
                            "name": result[0]['users_profile']['name'],
                            "photo": success
                        },
                        "text": result[0]['events_comments']['text'],
                        "createdAt": result[0]['events_comments']['createdAt'],
                        "updatedAt": result[0]['events_comments']['updatedAt']
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
exports.updateComments = (req, res, next) => {
    const data = new EventsCommentsmodel({
        _id: req.params.id_comment,
        text: req.body.text,
        updatedAt: new Date(),
        eventId: req.params.id_event,
        auth_users_id: req.user.userId
    });
    EventsCommentsmodel.update(data, (error, result) => {
        if (error) {
            if (error.kind === "data_not_found") {
                return res.status(404).send({
                    message: "not_found"
                });
            }
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(200).send({
                message: 'updated comments'
            });
        }
    });
}
exports.deleteComments = (req, res, next) => {
    const data = new EventsCommentsmodel({
        _id: req.params.id_comment,
        eventId: req.params.id_event,
        auth_users_id: req.user.userId
    });
    EventsCommentsmodel.delete(data, (error, result) => {
        if (error) {
            if (error.kind === "data_not_found") {
                return res.status(404).send({
                    message: "not_found"
                });
            }
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(200).send({
                message: 'deleted comments'
            });
        }
    });
}