const router = require('express').Router();
const UserModel = require('../models/User');
const AuthService = require('../services/AuthService');

const auth = new AuthService(UserModel);

const login = async (req, res) => {
  const result = await auth.login(req.body);
  res.send(result);
};

const register = async (req, res) => {
  const result = await auth.register(req.body);
  res.send(result);
};

router.post('/login', login);

router.post('/register', register);

module.exports = router;
