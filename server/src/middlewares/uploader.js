const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const uploadImages = upload.array('image');

const preparePost = (req, res, next) => {
  const post = {};
  const images = [];

  if (req.body) {
    Object.entries(req.body).forEach(([k, v]) => {
      post[k] = JSON.parse(v);
    });
  }
  if (req.files) {
    req.files.forEach((f) => {
      if (f.originalname && f.buffer && f.mimetype) {
        images.push({ name: f.originalname, content: f.buffer, mime: f.mimetype });
      }
    });
    post.images = images;
  }
  res.locals.post = post;

  next();
};

module.exports = {
  uploadImages,
  preparePost,
};
