const router = require('express').Router();
const UserModel = require('../models/User');
const AuthService = require('../services/AuthService');
const { loginValidation, registerValidation } = require('../middlewares/auth-validation');

const auth = new AuthService(UserModel);

const login = async (req, res) => {
  if (!req.body) {
    res.status(500).send({
      status: 'fail',
      message: 'No user info',
    });
  } else {
    const result = await auth.login(req.body);

    // Add user id to session.
    if (result.status === 'success') {
      req.session.userId = result.id;
    }
    res.json(result);
  }
};

const register = async (req, res) => {
  if (!req.body) {
    res.status(500).send({
      status: 'fail',
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

const logout = (req, res) => {
  req.session.destroy((err) => {
    console.log(req);
    if (err) {
      res.status(400).json({ status: 'fail', message: err });
    } else {
      res.clearCookie(process.env.SESSION_NAME);
      res.json({ status: 'success', message: 'Logout is successful' });
    }
  });
};

const isAuthenticated = async (req, res) => {
  const { id } = req.params;

  req.session.reload(async (error) => {
    if (!error && 'userId' in req.session && req.session.userId === id) {
      const result = await auth.getUserInformation(id);
      res.json(result);
    } else {
      console.log('isAuthenticated: User is not authenticated.');
      res.status(400).json({ status: 'fail', message: 'User is not authenticated.' });
    }
  });
};

router.post('/login', loginValidation, login);

router.post('/register', registerValidation, register);

router.post('/logout', logout);

router.get('/is-authenticated/:id', isAuthenticated);

module.exports = router;
