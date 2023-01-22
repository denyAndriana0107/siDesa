const LettersModel = require("../../../model/organizational/letters/OrganizationaLetterModel");

exports.insert = (req, res, next) => {
    const data = new LettersModel({

    });
    LettersModel.insert(data, (error, result) => {

    });
}