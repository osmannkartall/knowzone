import formController from '../form/formController.js';
import postController from '../post/postController.js';
import searchController from '../search/searchController.js';
import authController from '../auth/authController.js';

function connectRoutes(app) {
  app.get('/', (req, res) => {
    res.send('Knowzone Backend');
  });

  const controllers = [
    {
      path: '/forms',
      routes: formController,
    },
    {
      path: '/posts',
      routes: postController,
    },
    {
      path: '/',
      routes: searchController,
    },
    {
      path: '/',
      routes: authController,
    },
  ];

  controllers.forEach((c) => app.use(c.path, c.routes));
}

export default connectRoutes;
