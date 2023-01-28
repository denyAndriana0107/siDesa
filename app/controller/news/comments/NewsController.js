const { ObjectId } = require("mongodb");
const NewsCommentsmodel = require("../../../model/news/comments/NewsCommentsModel");
const NewsModel = require("../../../model/news/desc/NewsModel");
const helper = require("../../../helper/upload/UploadPhoto");

exports.insertComments = (req, res, next) => {
    const data = new NewsCommentsmodel({
        text: req.body.text,
        createdAt: new Date(),
        updatedAt: null,
        newsId: ObjectId(req.params.id_news),
        auth_users_id: ObjectId(req.user.userId)
    });
    NewsModel.readById(req.params.id_news, (error, resultNews) => {
        if (error) {
            if (error.kind === "not_found") {
                return res.status(404).send({
                    message: 'not_found'
                });
            }
        } else {
            NewsCommentsmodel.insert(data, (error, result) => {
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
            var final_result = [];
            for (let index = 0; index < result.length; index++) {
                var file_path = result[index]['users_profile']['photo'];
                helper.getUrl(file_path).then((success) => {
                    final_result.push({
                        "_id": result[0]['news_comments']["_id"],
                        "user": {
                            "name": result[0]['users_profile']['name'],
                            "photo": success
                        },
                        "text": result[0]['news_comments']['text'],
                        "createdAt": result[0]['news_comments']['createdAt'],
                        "updatedAt": result[0]['news_comments']['updatedAt']
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
    const data = new NewsCommentsmodel({
        _id: ObjectId(req.params.id_comment),
        text: req.body.text,
        updatedAt: new Date(),
        newsId: ObjectId(req.params.id_news),
        auth_users_id: ObjectId(req.user.userId)
    });
    NewsCommentsmodel.update(data, (error, result) => {
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
    const data = new NewsCommentsmodel({
        _id: ObjectId(req.params.id_comment),
        newsId: ObjectId(req.params.id_news),
        auth_users_id: ObjectId(req.user.userId)
    });
    NewsCommentsmodel.delete(data, (error, result) => {
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