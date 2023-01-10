const { ObjectId } = require("mongodb");
const NewsCommentsmodel = require("../../../model/news/comments/NewsCommentsModel");
const NewsModel = require("../../../model/news/desc/NewsModel");

exports.insertComments = (req, res, next) => {
    const data = new NewsCommentsmodel({
        text: req.body.text,
        createdAt: new Date(),
        updatedAt: null,
        newsId: ObjectId(req.params.id_news),
        userId: ObjectId(req.user.userId)
    });
    NewsCommentsmodel.insert(data, (error, result) => {
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
    NewsCommentsmodel.read(req.params.id_news, (error, result) => {
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