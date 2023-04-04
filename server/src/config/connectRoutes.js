import formController from '../form/formController.js';
import postController from '../post/postController.js';
import searchController from '../search/searchController.js';
import authController from '../auth/authController.js';

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

export default connectRoutes;
