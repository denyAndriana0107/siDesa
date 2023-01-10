const StructureModel = require("../../../model/organizational/structure/OrganizationalStructureModel");

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
    StructureModel.insert();
}