const LettersModel = require("../../../model/organizational/letters/OrganizationaLetterModel");

exports.insert = (req, res, next) => {
    const data = new LettersModel({
        "RWId": req.user.RWId,
        "letter_name": req.body.letter_name,
        "details": req.body.details,
        "createdAt": new Date(),
        "updatedAt": null
    });
    LettersModel.insert(data, (error, result) => {
        if (error) {
            return res.status(500).send({
                message: error
            });
        } else {
            return res.status(201).send({
                message: 'created'
            });
        }
    });
}
exports.read = (req, res, next) => {
    const data = new LettersModel({
        "RWId": req.user.RWId
    });
    LettersModel.read(data, (error, result) => {
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
            return res.status(200).send({
                message: result
            });
        }
    });
}
exports.readById = (req, res, next) => {
    const data = new LettersModel({
        "_id": req.params.id,
        "RWId": req.user.RWId
    });
    LettersModel.readById(data, (error, result) => {
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
            return res.status(200).send({
                message: result
            });
        }
    });
}
exports.update = (req, res, next) => {
    const data = new LettersModel({
        "_id": req.params.id,
        "RWId": req.user.RWId,
        "letter_name": req.body.letter_name,
        "details": req.body.details,
        "updatedAt": new Date()
    });
    LettersModel.update(data, (error, result) => {
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
            return res.status(200).send({
                message: 'updated'
            });
        }
    });
}
exports.delete = (req, res, next) => {
    const data = new LettersModel({
        "_id": req.params.id,
        "RWId": req.user.RWId
    });
    LettersModel.delete(data, (error, result) => {
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
            return res.status(200).send({
                message: 'deleted'
            });
        }
    });
}