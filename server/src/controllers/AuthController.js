const router = require('express').Router();
const UserModel = require('../models/User');
const AuthService = require('../services/AuthService');
const { loginValidation, registerValidation, checkAuthentication } = require('../middlewares/auth');

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
    if (err) {
      res.status(400).json({ status: 'fail', message: err });
    } else {
      res.clearCookie(process.env.SESSION_NAME);
      res.json({ status: 'success', message: 'Logout is successful' });
    }
  });
};

const isUserLoggedIn = async (req, res) => {
  const { id } = req.params;

  req.session.reload(async (error) => {
    if (!error && 'userId' in req.session && req.session.userId === id) {
      const result = await auth.getUserInformation(id);
      res.json(result);
    } else {
      console.log('isUserLoggedIn: User is not authorized.');
      res.status(401).json({ status: 'fail', message: 'User is not authorized.' });
    }
  });
};

// Login a user.
router.post('/login', loginValidation, login);

// Register a user.
router.post('/register', registerValidation, register);

// Logout user.
router.post('/logout', checkAuthentication, logout);

// Check if user is logged in. If user is logged in then return user information.
router.get('/is-user-logged-in/:id', isUserLoggedIn);

module.exports = router;
