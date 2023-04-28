/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import FORM_COMPONENT_TYPES from '../form/formComponentTypes.js';
import Form from '../form/form.js';
import Post from '../post/post.js';
import FORM_SCHEMA_CONFIGS from '../form/formSchemaConfigs.js';
import POST_SCHEMA_CONFIGS from '../post/postSchemaConfigs.js';
import User from '../auth/user.js';

const MAX_NUM_USERS = 10;
const MAX_NUM_FORMS_PER_USER = 5;
const MAX_NUM_POSTS_PER_FORM = 2;
const NUM_BULK_INSERTS = 2;

async function startDB() {
  try {
    await mongoose.connect(
      'mongodb://localhost:27017/knowzone?replicaSet=rs0&directConnection=true',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log('Connected to the database!');
  } catch (err) {
    console.log('Cannot connect to the database!', err);
    process.exit();
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

const usernames = new Set();
const emails = new Set();
const types = new Set();

function isUsernameInUse(username) {
  return usernames.has(username);
}

function isEmailInUse(email) {
  return emails.has(email);
}

function isTypeInUse(type) {
  return types.has(type);
}

function generateUsername() {
  let username = faker.internet.userName().toLowerCase().replace(/[^a-z0-9_]/g, '').substring(0, 15);

  while (isUsernameInUse(username)) {
    username = faker.internet.userName().toLowerCase().replace(/[^a-z0-9_]/g, '').substring(0, 15);
  }
  usernames.add(username);

  return username;
}

function generateEmail() {
  let email = faker.internet.email();

  while (isEmailInUse(email)) {
    email = faker.internet.email();
  }
  emails.add(email);

  return email;
}

function generateType() {
  let type = faker.random.words().toLowerCase().substring(0, FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE);

  while (isTypeInUse(type)) {
    type = faker.random.words().toLowerCase().substring(0, FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE);
  }
  types.add(type);

  return { name: type };
}

async function createUsers(num = 1) {
  console.log('generating user records...');

  const users = [];
  const hashedPassword = await encryptPassword('Password1');

  if (num < 1) {
    return users;
  }

  for (let i = 0; i < num; i++) {
    const user = new User({
      username: generateUsername(),
      password: hashedPassword,
      email: generateEmail(),
      name: faker.name.fullName(),
    });

    users.push(user);
  }

  console.log('generated user records');
  return users;
}

function getRandomEnumValue(enums) {
  return faker.helpers.arrayElement(enums);
}

function generateRandomObject(enums, min = 0, max = 1) {
  const obj = {};
  const numKeys = getRandomInt(min, max);

  for (let i = 0; i < numKeys; i++) {
    const key = faker.random.words(getRandomInt(1, 3));
    const value = getRandomEnumValue(enums);
    obj[key] = value;
  }

  return obj;
}

function generateRandomObjectWithImage(enums) {
  const obj = generateRandomObject(enums, 0, 9);
  obj.images = FORM_COMPONENT_TYPES.IMAGE;
  return obj;
}

function createNFormsForUser(user) {
  const forms = [];

  const n = getRandomInt(1, MAX_NUM_FORMS_PER_USER);

  for (let i = 0; i < n; i++) {
    const form = new Form({
      content: generateRandomObject(
        Object.values(FORM_COMPONENT_TYPES).filter((t) => t !== FORM_COMPONENT_TYPES.IMAGE),
        FORM_SCHEMA_CONFIGS.MIN_NUM_CONTENT,
        FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT,
      ),
      owner: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
      type: generateType(),
    });

    forms.push(form);
  }

  for (let i = 0; i < n / 2; i++) {
    const form = new Form({
      content: generateRandomObjectWithImage(
        Object.values(FORM_COMPONENT_TYPES).filter((t) => t !== FORM_COMPONENT_TYPES.IMAGE),
        FORM_SCHEMA_CONFIGS.MIN_NUM_CONTENT - 1,
        FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT - 1,
      ),
      owner: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
      type: generateType(),
    });

    forms.push(form);
  }

  return forms;
}

function createForms(users) {
  console.log('generating form records...');

  let forms = [];
  users.forEach((u) => { forms = forms.concat(createNFormsForUser(u)); });

  console.log('generated form records');
  return forms;
}

function generateTextValue() {
  return faker.random.words(getRandomInt(1, 50)).substring(0, POST_SCHEMA_CONFIGS.MAX_LEN_TEXT);
}

function generateEditorValue() {
  const markdownExamples = [
    '# Heading 1\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet auctor dolor vel finibus.\n\n```python\ndef example_function():\n print("This is an example function.")\n```\n',
    '## Heading 2\n\nInteger posuere erat a ante venenatis dapibus posuere velit aliquet.\n\n```python\nclass ExampleClass:\n def init(self, name):\n self.name = name\n\n def say_hello(self):\n print(f"Hello, my name is {self.name}.")\n```\n',
    faker.random.words(getRandomInt(1, 50)).substring(0, POST_SCHEMA_CONFIGS.MAX_LEN_EDITOR),
    '### Heading 3\n\nSed et lectus dignissim, malesuada libero vitae, fermentum sapien. Donec tempus neque at pharetra suscipit.\n\n```javascript\nfunction exampleFunction() {\n console.log("This is an example function.");\n}\n```\n',
    '## This is a second-level heading\n\nThis is a paragraph of text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer cursus leo a dolor suscipit fringilla. Sed at bibendum ex, vel vestibulum magna.\n\n```python\nx = 5\ny = 10\nprint(x + y)\n```\n',
    '# This is a top-level heading\n\nThis is another paragraph of text. Aliquam bibendum, purus eget efficitur semper, quam elit eleifend elit, eu vulputate lacus lectus quis massa.\n\n```java\nclass ExampleClass {\n public static void main(String[] args) {\n System.out.println("Hello, world!");\n }\n}\n```\n',
    faker.random.words(getRandomInt(1, 50)).substring(0, POST_SCHEMA_CONFIGS.MAX_LEN_EDITOR),
    '### This is a third-level heading\n\nThis is yet another paragraph of text. Phasellus fringilla, mauris sit amet vulputate bibendum, mauris nulla mattis magna, ut varius ex nisi eget leo.\n\n```python\ndef factorial(n):\n if n == 0:\n return 1\n else:\n return n * factorial(n-1)\n\nprint(factorial(5))\n```\n',
    '#### This is a fourth-level heading\n\nThis is a final paragraph of text. Vestibulum vel tincidunt lectus. Integer viverra magna ut est efficitur, quis tristique elit sollicitudin.\n\n```javascript\nlet arr = [1, 2, 3, 4, 5];\narr.forEach(function(value, index) {\n console.log(value * index);\n});\n```\n',
    '#### Heading 4\n\nMorbi vestibulum nulla non est fermentum, non blandit odio porttitor. Proin ut arcu turpis.\n\n```javascript\nclass ExampleClass {\n constructor(name) {\n this.name = name;\n }\n\n sayHello() {\n console.log("Hello, my name is " + this.name.);\n }\n}\n```\n',
    faker.random.words(getRandomInt(1, 50)).substring(0, POST_SCHEMA_CONFIGS.MAX_LEN_EDITOR),
    '### Example Heading\n\nThis is some text in a paragraph. Nullam maximus laoreet libero in posuere. Proin eu fringilla quam.\n\n```python\nprint("Hello, world!")\n```\n',
    '# Another Heading\n\nThis is another paragraph. Sed vel purus aliquam, rhoncus nunc sed, viverra nisi. Integer porttitor vel arcu quis pellentesque.\n\n```c\n#include <stdio.h>\n\nint main() {\n printf("Hello, world!");\n return 0;\n}\n```\n',
    '## More Headings\n\nThis is a third paragraph. Etiam auctor ipsum eget arcu imperdiet convallis. Suspendisse lobortis ut ipsum vel laoreet.\n\n```ruby\ndef say_hello(name)\n puts "Hello, #{name}!"\nend\n\nsay_hello("world")\n```\n',
    '# Another Example\n\nThis is a fourth paragraph. Fusce a metus faucibus, placerat neque in, eleifend sapien. Integer aliquet gravida tellus, vel pellentesque enim sollicitudin sed.\n\n```java\nclass ExampleClass {\n public static void main(String[] args) {\n System.out.println("Hello, world!");\n }\n}\n```\n',
    '## A Heading\n\nThis is a fifth paragraph. Nunc congue lacus id neque vehicula, in luctus quam rhoncus. Integer et justo sed mauris eleifend convallis.\n\n```python\ndef fibonacci(n):\n if n <= 1:\n return n\n else:\n return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))\n```\n',
    '#### Another Example\n\nThis is a sixth paragraph. Suspendisse potenti. In non sem a turpis convallis faucibus at et libero. Fusce vel nulla sed ante ullamcorper tincidunt.\n\n```javascript\nfunction multiplyArray(arr) {\n let product = 1;\n arr.forEach(function(value) {\n product *= value;\n });\n return product;\n}\n\nconsole.log(multiplyArray([1, 2, 3, 4, 5]));\n```\n',
    '### Headings Everywhere\n\nThis is a seventh paragraph. Aliquam id commodo orci. Donec consequat sapien eu bibendum luctus.\n\n```python\ndef reverse_string(string):\n return string[::-1]\n\nprint(reverse_string("hello"))\n```\n',
    '# Some More Headings\n\nThis is an eighth paragraph. Morbi ut elit elit. Donec auctor bibendum massa non feugiat.\n\n```c++\n#include <iostream>\n\nint main() {\n std::cout << "Hello, world!" << std::endl;\n return 0;\n}\n```\n',
    faker.random.words(getRandomInt(1, 50)).substring(0, POST_SCHEMA_CONFIGS.MAX_LEN_EDITOR),
  ];

  return markdownExamples[getRandomInt(0, markdownExamples.length - 1)];
}

function generateListValue() {
  const listValue = [];

  const n = getRandomInt(0, POST_SCHEMA_CONFIGS.MAX_NUM_LIST);

  for (let i = 0; i < n; i++) {
    listValue.push(faker.lorem.sentences().substring(0, 50));
  }

  return listValue;
}

function generateImageValue() {
  const imageValue = [];
  const n = getRandomInt(0, 2);

  for (let i = 0; i < n; i++) {
    imageValue.push({
      name: `screenshot${i + 1}.png`, path: `${'images/screenshot'}${i + 1}.png`,
    });
  }

  return imageValue;
}

function generateTopics() {
  const topics = new Set();
  const n = getRandomInt(POST_SCHEMA_CONFIGS.MIN_NUM_TOPICS, POST_SCHEMA_CONFIGS.MAX_NUM_TOPICS);

  for (let i = 0; i < n; i++) {
    topics.add(
      faker
        .random
        .word()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC),
    );
  }

  return Array.from(topics);
}

function generateObjectWithRandomValues(otherObj) {
  const obj = {};

  Object.entries(otherObj).forEach(([k, v]) => {
    if (v === FORM_COMPONENT_TYPES.EDITOR) {
      obj[k] = generateEditorValue();
    } else if (v === FORM_COMPONENT_TYPES.IMAGE) {
      obj[k] = generateImageValue();
    } else if (v === FORM_COMPONENT_TYPES.LIST) {
      obj[k] = generateListValue();
    } else if (v === FORM_COMPONENT_TYPES.TEXT) {
      obj[k] = generateTextValue();
    }
  });

  return obj;
}

function createNPostsFromForm(form) {
  const posts = [];

  const n = getRandomInt(1, MAX_NUM_POSTS_PER_FORM);

  for (let i = 0; i < n; i++) {
    const createdAt = faker.date.between('2020-01-01T00:00:00.000Z', new Date().toISOString());
    const updatedAt = faker.date.between(createdAt.toISOString(), new Date().toISOString());

    const post = new Post({
      content: generateObjectWithRandomValues(form.content),
      owner: form.owner,
      type: form.type,
      topics: generateTopics(),
      createdAt,
      updatedAt,
    });

    posts.push(post);
  }

  return posts;
}

function createPosts(forms) {
  console.log('generating post records...');
  let posts = [];
  forms.forEach((form) => {
    posts = posts.concat(createNPostsFromForm(form));
  });
  console.log('generated post records');
  return posts;
}

async function bulkDelete(model) {
  try {
    console.log(`${model.collection.collectionName}: deleting old records...`);
    await model.deleteMany({});
    console.log(`${model.collection.collectionName}: deleted old records successfully.`);
  } catch (err) {
    console.log(`${model.collection.collectionName}: Error! ${err.message}`);
  }
}

async function bulkInsert(model, data) {
  try {
    console.log(`${model.collection.collectionName}: inserting ${data?.length} new records...`);
    await model.insertMany(data);
    console.log(`${model.collection.collectionName}: inserted new records successfully.`);
    console.log();
  } catch (err) {
    console.log(`${model.collection.collectionName}: Error! ${err.message}`);
  }
}

async function generate() {
  await startDB();

  await bulkDelete(User);
  await bulkDelete(Form);
  await bulkDelete(Post);

  const users = await createUsers(MAX_NUM_USERS);
  await bulkInsert(User, users);

  for (let i = 0; i < NUM_BULK_INSERTS; i++) {
    const forms = createForms(users);
    await bulkInsert(Form, forms);

    let posts = createPosts(forms);
    await bulkInsert(Post, posts);
    posts = createPosts(forms);
    await bulkInsert(Post, posts);
    posts = createPosts(forms);
    await bulkInsert(Post, posts);
  }

  const formsHasNoPosts = await createNFormsForUser(users[0]);
  await bulkInsert(Form, formsHasNoPosts);

  const usersHasNoForms = await createUsers(10);
  await bulkInsert(User, usersHasNoForms);

  console.log('Data generation is finished.');
}

generate();

process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('closed the connection');
});
