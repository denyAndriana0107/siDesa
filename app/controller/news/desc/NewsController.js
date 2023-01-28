const NewsModel = require("../../../model/news/desc/NewsModel");
const NewsAnalyticsModel = require("../../../model/news/analyticts/NewsAnalytictModel");
const UserLogsLikeNews = require("../../../model/users/logs/LogsLikeNews");
const helper = require("../../../helper/upload/UploadPhoto");
const { ObjectId } = require("mongodb");

exports.readNews = (req, res, next) => {
    NewsModel.read((err, result) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: "not_found"
                });
            }
            return res.status(500).send({
                message: err
            });
        } else {
            var final_result = [];
            for (let index = 0; index < result.length; index++) {
                let file_path = result[index]['photo'];
                helper.getUrl(file_path).then((success) => {
                    final_result.push({
                        _id: result[index]['_id'],
                        title: result[index]['title'],
                        description: result[index]['description'],
                        category: result[index]['category'],
                        photo: success,
                        analyticts: {
                            likes_count: result[index]['likes_count'],
                            views_count: result[index]['views_count']
                        },
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
exports.readNewsById = (req, res, next) => {
    NewsModel.readById(req.params.id_news, (error, result) => {
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
            NewsAnalyticsModel.add_views(req.params.id_news, (error, result2) => {
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
                    let file_path = result[0]['photo'];
                    helper.getUrl(file_path).then((success) => {
                        var final_result = [];
                        final_result.push({
                            _id: result[0]['_id'],
                            title: result[0]['title'],
                            description: result[0]['description'],
                            category: result[0]['category'],
                            photo: success,
                            analyticts: {
                                likes_count: result[0]['likes_count'],
                                views_count: result[0]['views_count']
                            },
                            createdAt: result[0]['createdAt'],
                            updatedAt: result[0]['updatedAt']
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
exports.readNewsByCategory = (req, res, next) => {
    const data = new NewsModel({
        "category": req.body.category,
        "RWId": req.user.RWId
    });
    NewsModel.readByCategory(data, (error, result) => {
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
            var final_result = [];
            for (let index = 0; index < result.length; index++) {
                let file_path = result[index]['photo'];
                helper.getUrl(file_path).then((success) => {
                    final_result.push({
                        _id: result[index]['_id'],
                        title: result[index]['title'],
                        description: result[index]['description'],
                        category: result[index]['category'],
                        photo: success,
                        analyticts: {
                            likes_count: result[index]['likes_count'],
                            views_count: result[index]['views_count']
                        },
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
exports.readNewsAnalytictsById = (req, res, next) => {
    NewsAnalyticsModel.read(req.params.id_news, (error, result) => {
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
exports.insertNews = async (req, res, next) => {
    let _id = new ObjectId();
    let file = req.file;
    let file_path = `news/photo/${_id}/`
    let file_name = _id + ".jpg";
    helper.upload(file, file_path, file_name).then((success) => {
        const data = new NewsModel({
            "_id": _id,
            "title": req.body.title,
            "description": req.body.description,
            "category": req.body.category,
            "photo": success,
            "createdAt": new Date(),
            "updatedAt": null
        });
        NewsModel.insert(data, (error, result) => {
            if (error) {
                return res.status(500).send({
                    message: error
                });
            } else {
                const id_news = data._id;
                NewsAnalyticsModel.insert_analytics(id_news, (error, result2) => {
                    if (error) {
                        return res.status(500).send({
                            message: error
                        });
                    } else {
                        return res.status(201).send({
                            message: "News created"
                        });
                    }
                });
            }
        });
    }).catch((error) => {
        return res.status(500).send({
            message: error
        });
    });

}
exports.add_like = (req, res, next) => {
    const data = new UserLogsLikeNews({
        "auth_users_id": req.user.userId,
        "newsId": req.params.id
    });
    UserLogsLikeNews.find(data, (error, result) => {
        if (error) {
            return res.status(500).send({
                message: error
            });
        } else {
            const data_add_like = new NewsAnalyticsModel({
                "newsId": req.params.id,
                "liked": result
            });
            NewsAnalyticsModel.add_like(data_add_like, (error, result2) => {
                if (error) {
                    if (error.kind == "not_found") {
                        return res.status(404).send({
                            message: 'not_found'
                        });
                    }
                    return res.status(500).send({
                        message: error
                    });
                } else {
                    const data_users_logs_like = new UserLogsLikeNews({
                        "auth_users_id": req.user.userId,
                        "newsId": req.params.id_news
                    });
                    UserLogsLikeNews.InsertOrDelete(data_users_logs_like, (error, result_final) => {
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
            });
        }
    });

}

exports.updateNews = (req, res, next) => {
    let _id = req.params.id_news;
    let file = req.file;
    let file_path = `news/photo/${_id}/`
    let file_name = _id + ".jpg";
    if (file) {
        helper.upload(file, file_path, file_name).then((success) => {
            const data = new NewsModel({
                "title": req.body.title,
                "description": req.body.description,
                "category": req.body.category,
                "photo": success,
                "updatedAt": new Date()
            });
            NewsModel.update(_id, data, (error, result) => {
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
                        message: "News updated"
                    });
                }
            });
        }).catch((error) => {
            return res.status(500).send({
                message: error
            });
        });
    } else {
        const data = new NewsModel({
            "title": req.body.title,
            "description": req.body.description,
            "category": req.body.category,
            "updatedAt": new Date()
        });
        NewsModel.update(_id, data, (error, result) => {
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
                    message: "News updated"
                });
            }
        });
    }
}

exports.deleteNews = (req, res, next) => {
    let _id = req.params.id_news;
    NewsModel.readById(_id, (error, result) => {
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
            NewsAnalyticsModel.delete(_id, (error, result2) => {
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
                    let file_path = result[0]['photo'];
                    helper.delete(file_path).then((success) => {
                        NewsModel.delete(_id, (error, result) => {
                            if (error) {
                                if (error.kind === "not_found") {
                                    return res.status(404).send({
                                        message: "not_found"
                                    });
                                }
                                return res.status(500).send({
                                    message: error + ' delete image'
                                });
                            } else {
                                return res.status(200).send({
                                    message: "News deleted "
                                });
                            }
                        });
                    }).catch((error) => {
                        return res.status(500).send({
                            message: error + ' delete image'
                        });
                    });
                }
            })
        }
    });
}