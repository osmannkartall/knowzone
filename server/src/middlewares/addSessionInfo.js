const addSessionInfo = (req, res, next) => {
  req.body.owner = {
    id: req.session.userId,
    username: req.session.username,
    name: req.session.name,
  };

  next();
};

module.exports = addSessionInfo;
