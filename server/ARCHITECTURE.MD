# Node.js Project Architecture

This project currently has two different flows:

* `Controller->Repository->Model`

  This flow is used when operations are related to a particular model and those operations are only CRUD operations defined in that model.

  1. Create a Mongoose model.
  2. Create a new repository for that model.
  3. Create controller to expose operations provided by the repository.

* `Controller->Service`

  Service classes are used for general operations such as search service. This kind of operations are different from basic CRUD operations and do not have to depend on a specific object model. They can use different repositories and models.

  1. Create a service class.
  2. Create controller to expose operations provided by the service class.

---

## Config

`dotenv` package reads the values of environment variables in .env file and binds them to the global process.env object. Then, these values are exported from `server/config/index.js` file. Finally, these values are used in different modules by importing `server/config/index.js`

## Model

Defines an object that corresponds to a collection in the database.

### Creating a new model

Create `Hello.js` file under `server/models/` folder.

```javascript
// in server/models/Hello.js

// Import mongoose module to create the schema that represents the collection.
const mongoose = require('mongoose');

// Create the schema.
const helloSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
  },
);

// Compile schema into the model object.
const Hello = mongoose.model('Hello', helloSchema);

// Export the model object.
module.exports = Hello;
```

## Repository

Executes CRUD operations on models by communicating to the MongoDB.

### Creating a new repository

Create `HelloRepository.js` file under `server/repositories/` folder.

```javascript
// in server/repositories/HelloRepository.js

// Import Hello model.
const HelloModel = require('../models/Hello');

// Import BaseRepository class.
const BaseRepository = require('./BaseRepository');

// Create HelloRepository by extending BaseRepository and passing Hello model to it. HelloRepository inherits CRUD methods that runs on Hello model.
class HelloRepository extends BaseRepository {
  constructor() {
    super(HelloModel);
  }
}

// Export HelloRepository class.
module.exports = HelloRepository;
```

## Controller

Validates the HTTP request object and manipulates it before sending the necessary data to the service or repository layer. Controls the access to the provided CRUD operations and other services via routes.

### Creating a new controller

Create `HelloController.js` file under `server/controllers/` folder.

```javascript
// in server/controllers/HelloController.js

// Import router module to add routes for operations.
const router = require('express').Router();

// Import Hello model.
const HelloModel = require('../models/Hello');

// Import HelloRepository class.
const HelloRepository = require('../repositories/HelloRepository');

// Instantiate a HelloRepository instance to supply CRUD methods on Hello model. 
const helloRepository = new HelloRepository(HelloModel);

// Define controller functions.
// ----------------------------
// Create controller function that calls HelloRepository method to create new Hello record.
const create = (req, res) => {
  // Validate req object. E.g; Check if req.body is undefined.

  const result = helloRepository.create(req.body);
  res.send(result);
};

// Create controller function that calls HelloRepository method to retrieve all Hello records.
const findAll = async (_, res) => {
  const result = await helloRepository.findAll();
  res.send(result);
};

// Create controller function that calls HelloRepository method to retrieve a Hello record by id.
const findById = async (req, res) => {
  const { id } = req.params;
  const result = await helloRepository.findById(id);
  res.send(result);
};

// Add routes for the operations defined above.
// --------------------------------------------
// Expose a route to create new Hello record.
router.post('/', create);
// Expose a route to retrieve all Hello records.
router.get('/', findAll);
// Expose a route to retrieve a Hello record by id parameter.
router.get('/:id', findById);

// Export the router object for later use in application.
module.exports = router;
```

Note:

Normally, `BaseRepository` provides other methods such as `updateById`, `deleteById` and `deleteAll` in addition to `create`, `findAll` and `findById` but only several of them exposed in HelloController.js module. E.g; if we want all records to be read-only then we only allow `create`, `findById` and `findAll` methods and don't add routes for other methods in the controller module.

## Usage of New Routes

* Navigate to `addControllers()` function in `server/app.js` file.

```javascript
// in server/app.js

// Import new routes exposed by HelloController.
const helloController = require('./controllers/HelloController');

function addControllers(app) {
  // ...
  // other routes
  // ...

  // Append routes exposed by HelloController to the root path with a sub-prefix. E.g; /hello
  app.use('/hello', helloController);
}
```

## Service

### Creating a new service

```javascript
// in server/services/SearchService.js

const TipModel = require('../models/Tip');
const BugfixModel = require('../models/Bugfix');

class SearchService {
  async getPostsByOwner(ownerId) {
    // ...
    return posts;
  }

  async filter(info) {
    // ...
    const bugfixPosts = await BugfixModel.find(query);
    const tipPosts = await TipModel.find(query);
    // ...
    return posts;
  }
}

module.exports = SearchService;
```

## Error Handling

1. Add a try/catch block only to the controller layers.

2. In the catch block, send the error object to the global error handler middleware with the `next()` call.

3. Log the error in global error handler middleware and return an error response to the client from there.

### Example

```javascript
const getPostsByOwner = async (req, res, next) => {
  try {
    await postsByOwnerSchema(req.session.userId).validateAsync(req.query);
    const result = await SearchService.getPostsByOwner(req.query.owner);

    res.json(result);
  } catch (err) {
    if (!hasLowerLayerCustomError()) {
      err.description = 'Error when getting posts by owner';
      err.statusCode = 500;
      err.type = KNOWZONE_ERROR_TYPES.SEARCH;
      err.data = {
        id: req.params.id,
      };
    }

    next(err);
  }
};
```

Errors thrown from the controller or any lower layer are caught in the catch block. We can explicitly throw custom error objects from lower layers, so we don't want to override them. Therefore, we first check for any custom lower layer error. If there is no then we create a new custom error object and send it to the global error handler, otherwise we just pass the existing error object to the global error handler.

### Global error handler middleware

```javascript
// in handleError.js

function handleError(err, _req, res, next) {
  const { statusCode, description } = getCustomFieldsByErrorType(err);

  logError(err, statusCode, description);

  res.status(statusCode).json(createErrorResponse(description));
}
```

```javascript
// in app.js

async function startExpress() {
  const app = express();

  // ...

  // We added the error handler as the last middleware.
  app.use(handleError);

  app.listen();
}
```

### Using Custom Error Objects

* Use the `changeToCustomError` function in `knowzoneErrorHandler.js` to change errors thrown internally by other packages to custom error objects.

* Use the `createCustomError` function in `knowzoneErrorHandler.js` to create custom error objects to throw a custom error.

## TODO

* Logger
