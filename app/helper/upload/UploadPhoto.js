const bucket = require("../../config/storage/Bucket");
const UploadPhoto = function (params) {

}
UploadPhoto.upload = async (file, path, file_name) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: file.buffer,
            Key: path + file_name,
            ContentType: 'image/jpeg'
        };
        bucket.upload(uploadParams, function (error, data) {
            if (error) {
                reject(error.message);
            } if (data) {
                resolve(data.Key);
            }
        });
    });
}
UploadPhoto.getUrl = async (file_path) => {
    return new Promise((resolve, reject) => {
        bucket.getSignedUrl('getObject', {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file_path,
        }, function (err, data) {
            if (err) {
                reject(err);
            } if (data) {
                resolve(data);
            }
        })
    })

}
UploadPhoto.delete = async (file_path) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file_path,
        }
        bucket.deleteObject(params, (error, result) => {
            if (error) {
                reject(error.message);
            } else {
                resolve(result);
            }
        });
    })
}
module.exports = UploadPhoto;