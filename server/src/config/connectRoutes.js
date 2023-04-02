const formController = require('../form/FormController');
const postController = require('../post/PostController');
const searchController = require('../search/SearchController');
const authController = require('../auth/AuthController');

function connectRoutes(app) {
  app.get('/', (req, res) => {
    res.send('Knowzone Backend');
  });

  const controllers = {
    '/forms': formController,
    '/posts': postController,
    '/search': searchController,
    '/': authController,
  };

  Object.entries(controllers).forEach(([k, v]) => app.use(k, v));
}

module.exports = connectRoutes;
