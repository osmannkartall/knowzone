const router = require('express').Router();
const UserModel = require('../models/User');
const AuthService = require('../services/AuthService');

const auth = new AuthService(UserModel);

const login = async (req, res) => {
  const result = await auth.login(req.body);
  res.send(result);
};

const register = async (req, res) => {
  if (!req.body) {
    res.status(500).send({
      message: 'No user info',
    });
  } else {
    const user = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      bio: req.body.bio,
    };

    const result = await auth.register(user);
    res.json(result);
  }
};

router.post('/login', login);

router.post('/register', register);

module.exports = router;
