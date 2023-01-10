const StructureModel = require("../../../model/organizational/structure/OrganizationalStructureModel");
const helper = require("../../../helper/upload/UploadPhoto");
const { ObjectId } = require("mongodb");
exports.read = (req, res, next) => {
    StructureModel.read((error, result) => {
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