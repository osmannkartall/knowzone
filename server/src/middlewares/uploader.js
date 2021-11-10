const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const uploadImages = upload.array('image');

const preparePost = (req, res, next) => {
  const { saveImage, ...rest } = req.body;
  const data = {};
  const images = [];

  if (rest) {
    Object.entries(rest).forEach(([k, v]) => { data[k] = JSON.parse(v); });
  }

  data.owner = {
    id: req.session.userId,
    username: req.session.username,
    name: req.session.name,
  };

  if (req.files && (saveImage === undefined || JSON.parse(saveImage))) {
    req.files.forEach((f) => {
      if (f.originalname && f.buffer && f.mimetype) {
        images.push({ name: f.originalname, content: f.buffer, mime: f.mimetype });
      }
    });
    data.images = images;
  }

  res.locals.data = data;

  next();
};

module.exports = {
  uploadImages,
  preparePost,
};
