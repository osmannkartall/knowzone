const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { createCustomError, KNOWZONE_ERROR_TYPES } = require('../knowzoneErrorHandler');

const imageStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    const dest = `${process.env.PUBLIC_UPLOAD_PATH}/${process.env.IMAGE_UPLOAD_SUBPATH}`;
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename(_req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}_${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1048576,
    files: 2,
  },
  fileFilter(_req, file, cb) {
    if (file.mimetype.split('/')[0] !== 'image') {
      return cb(createCustomError({
        description: 'Only images are allowed for uploading',
        statusCode: 400,
        type: KNOWZONE_ERROR_TYPES.UPLOAD,
      }));
    }
    return cb(null, true);
  },
});

const uploadImages = upload.array('image');

const isAnyFileUploaded = (files) => Array.isArray(files) && files.length;

const getOwner = (session) => ({
  id: session.userId,
  username: session.username,
  name: session.name,
});

const createPostBody = (body, session) => {
  const postBody = {};

  if (body) {
    Object.entries(body).forEach(([k, v]) => {
      // TODO: Why this check is necessary?
      if (v === 'undefined') {
        postBody[k] = JSON.parse(null);
      } else {
        postBody[k] = JSON.parse(v);
      }
    });
  }

  postBody.owner = getOwner(session);

  return postBody;
};

const getPathsOfUploadedFiles = (files) => {
  const images = [];

  files.forEach((f) => {
    const segments = f.path.split(path.sep);

    images.push({
      name: f.originalname,
      path: `${process.env.IMAGE_UPLOAD_SUBPATH}/${segments[segments.length - 1]}`,
    });
  });

  return images;
};

const preparePostForCreate = (req, res, next) => {
  const data = createPostBody(req.body, req.session);
  if (!data.content) {
    data.content = {};
  }

  if (isAnyFileUploaded(req.files)) {
    data.content.images = getPathsOfUploadedFiles(req.files);
  }

  res.locals.data = data;

  next();
};

const mergeImages = (oldImages, newImageFiles) => {
  const oldImagePaths = oldImages ? JSON.parse(oldImages) : [];

  if (isAnyFileUploaded(newImageFiles)) {
    return oldImagePaths.concat(getPathsOfUploadedFiles(newImageFiles));
  }

  return oldImagePaths;
};

const isNoImageAfterUpdate = (oldImages) => (
  oldImages
    && Array.isArray(JSON.parse(oldImages))
    && !(JSON.parse(oldImages).length)
);

const preparePostForUpdate = (req, res, next) => {
  const { oldImages, ...rest } = req.body;
  const data = createPostBody(rest, req.session);

  const changedImages = mergeImages(oldImages, req.files);
  if (changedImages.length) {
    if (!data.content) {
      data.content = {};
    }
    data.content.images = changedImages;
  } else if (isNoImageAfterUpdate(oldImages)) {
    if (!data.content) {
      data.content = {};
    }
    data.content.images = [];
  }

  res.locals.data = data;

  next();
};

module.exports = {
  uploadImages,
  preparePostForCreate,
  preparePostForUpdate,
};
