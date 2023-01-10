const { ObjectId } = require("mongodb");
const EventsCommentsmodel = require("../../../model/events/comments/EventComment");
const EventsModel = require("../../../model/events/desc/EventsModel");

exports.insertComments = (req, res, next) => {
    const data = new EventsCommentsmodel({
        text: req.body.text,
        createdAt: new Date(),
        updatedAt: null,
        eventId: ObjectId(req.params.id_event),
        userId: ObjectId(req.user.userId)
    });
    EventsCommentsmodel.insert(data, (error, result) => {
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
            return res.status(201).send({
                message: "comments created"
            });
        }
    });
}
exports.readComments = (req, res, next) => {
    EventsCommentsmodel.read(req.params.id_event, (error, result) => {
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
                message: result
            });
        }
    });
}