const checkAuthentication = (req, res, next) => {
  if (!('userId' in req.session)) {
    res.status(401).json({
      status: 'fail',
      message: 'Access Denied.',
    });
  } else {
    next();
  }
};

module.exports.checkAuthentication = checkAuthentication;
