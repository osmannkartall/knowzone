/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const FORM_COMPONENT_TYPES = require('./constants/formComponentTypes');
const Form = require('./models/Form');
const Post = require('./models/Post');
const { POST_SCHEMA_CONFIGS, FORM_SCHEMA_CONFIGS } = require('./models/schemaConfigs');
const User = require('./models/User');

const MAX_NUM_USERS = 1000;
const MAX_NUM_FORMS_PER_USER = 20;
const MAX_NUM_POSTS_PER_FORM = 5;
const NUM_BULK_INSERTS = 20;

async function startDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/knowzone-mock', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
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

  return type;
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
  return faker.random.words(getRandomInt(1, 50)).substring(0, POST_SCHEMA_CONFIGS.MAX_LEN_EDITOR);
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
    const createdAt = faker.date.past(3);
    const updatedAt = new Date(createdAt);
    updatedAt.setDate(updatedAt.getDate() + getRandomInt(0, 400));

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
