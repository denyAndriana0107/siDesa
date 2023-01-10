module.exports = {
    isImage: (req, res, next) => {
        var file = req.file;
        if (file) {
            if (!req.file.mimetype.match(/^image/)) {
                return res.status(403).send({
                    message: "File not image"
                });
            }
            next();
        } else {
            return res.status(404).send({
                message: "File not found"
            });
        }
    }
}