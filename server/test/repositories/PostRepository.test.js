/* eslint-env jest */
const PostRepository = require('../../src/repositories/PostRepository');
const { POST_SCHEMA_CONFIGS, SCHEMA_CONFIGS } = require('../../src/models/schemaConfigs');
const FormRepository = require('../../src/repositories/FormRepository');

const postRepository = new PostRepository();
const formRepository = new FormRepository();

function createInvalid(post) {
  return async () => { await postRepository.create(post); };
}

async function create(post) {
  const result = await postRepository.create(post);
  const { _id, __v, createdAt, updatedAt, ...data } = result.toObject();
  data.owner.id = data.owner.id.toString();
  return data;
}

const myType = 'my type';
const notMyType = 'not my type';

const myForm = {
  type: myType,
  owner: {
    id: '222222222222222222222222',
    username: 'john_doe',
    name: 'John Doe',
  },
  fields: {
    textInput: 'text',
    editorInput: 'editor',
    listInput: 'list',
    images: 'image',
  },
};

const notMyForm = {
  type: notMyType,
  owner: {
    id: '555555555555555555555555',
    username: 'john_doe2',
    name: 'John Doe',
  },
  fields: {
    textInput: 'text',
    editorInput: 'editor',
    listInput: 'list',
    images: 'image',
  },
};

const ownerMock = { id: '222222222222222222222222', username: 'john_doe', name: 'John Doe' };

const topicsMock = ['1', '2'];

const contentMock = {
  textInput: 'a text',
  editorInput: 'this is an editor',
  listInput: ['item1', 'item2'],
  images: [{ name: 'screenshot.png', path: 'images/screenshot.png' }],
};

const postMock = { type: myType, owner: ownerMock, topics: topicsMock, content: contentMock };

beforeAll(async () => {
  await formRepository.create(myForm);
  await formRepository.create(notMyForm);
});

describe('PostRepository.create() with invalid records', () => {
  const postWithoutOwner = { type: myType, topics: topicsMock, content: contentMock };

  const postWithoutOwnerId = {
    owner: {
      username: 'john',
      name: 'john',
    },
    type: myType,
    topics: topicsMock,
    content: contentMock,
  };

  const postWithoutType = { owner: ownerMock, topics: topicsMock, content: contentMock };

  const postWithMoreThanMaxContentField = {
    ...postMock,
    content: {
      1: 'a text',
      2: 'a text',
      3: 'a text',
      4: 'a text',
      5: 'a text',
      6: 'a text',
      7: 'a text',
      8: 'a text',
      9: 'a text',
      10: 'a text',
      11: 'a text',
    },
  };

  const postWithoutContentField = { ...postMock, content: {} };

  const postWithUndefinedContent = { owner: ownerMock, type: myType, topics: topicsMock };

  const postWithInvalidMaxLenType = {
    ...postMock,
    type: (new Array(SCHEMA_CONFIGS.MAX_LEN_TYPE + 10)).join('-'),
  };

  const postWithInvalidMinLenType = {
    ...postMock,
    type: (new Array(SCHEMA_CONFIGS.MIN_LEN_TYPE - 1)).join('-'),
  };

  const postWithInvalidTypeOfType = { ...postMock, type: [1, 2] };

  const postWithInvalidTypeOfContentFields = { ...postMock, content: [1, 2] };

  const postWithZeroTopic = { ...postMock, topics: [] };

  const postWithoutTopic = { type: myType, owner: ownerMock, content: contentMock };

  const postWithInvalidMaxTopic = {
    ...postMock,
    topics: [...Array(POST_SCHEMA_CONFIGS.MAX_NUM_TOPICS + 1).keys()],
  };

  const postWithInvalidMaxLenTopic = {
    ...postMock,
    topics: [(new Array(POST_SCHEMA_CONFIGS.MAX_LEN_TOPIC + 2)).join('a')],
  };

  const postWithDuplicatedTopics = {
    ...postMock,
    topics: ['1', '2', '1'],
  };

  const postOfNonExistingForm = { ...postMock, type: 'no type' };

  const postWithInvalidMinLenTextValue = {
    ...postMock,
    content: {
      textInput: (new Array(POST_SCHEMA_CONFIGS.MIN_LEN_TEXT - 1)).join('-'),
    },
  };

  const postWithInvalidMaxLenTextValue = {
    ...postMock,
    content: {
      textInput: (new Array(POST_SCHEMA_CONFIGS.MAX_LEN_TEXT + 2)).join('-'),
    },
  };

  const postWithInvalidTextValue = { ...postMock, content: { textInput: null } };

  const postWithInvalidList = { ...postMock, content: { textInput: 'a text', listInput: null } };

  const postWithInvalidListLen = {
    ...postMock,
    content: {
      textInput: 'a text',
      listInput: new Array(POST_SCHEMA_CONFIGS.MAX_NUM_LIST + 1),
    },
  };

  const postWithInvalidEditorValue = { ...postMock, content: { editorInput: null } };

  const postWithInvalidMaxLenEditorValue = {
    ...postMock,
    content: {
      editorInput: new Array(POST_SCHEMA_CONFIGS.MAX_LEN_EDITOR + 1),
    },
  };

  const postWithInvalidMinLenEditorValue = {
    ...postMock,
    content: {
      editorInput: new Array(POST_SCHEMA_CONFIGS.MIN_LEN_EDITOR - 1),
    },
  };

  const postWithInvalidMultipleComponentValue = {
    ...postMock,
    content: {
      textInput: 'a text',
      editorInput: [1, 2],
      listInput: false,
    },
  };

  const postWithNonExistingFormField = {
    ...postMock,
    content: {
      textInput: 'a text',
      images: new Array(POST_SCHEMA_CONFIGS.MAX_NUM_IMAGES + 1).fill().map((_, i) => (
        { name: `screenshot${i}.png`, path: `images/screenshot${i}.png` }
      )),
      nonExist: 'value',
    },
  };

  const postOfNotMyForm = { ...postMock, type: notMyType };

  it('should throw error when model is empty', async () => {
    await expect(createInvalid({})).rejects.toThrow(/Post validation failed/i);
  });

  it('should throw error when there is no owner', async () => {
    await expect(createInvalid(postWithoutOwner)).rejects.toThrow(/owner.id: Path `owner.id` is required/i);
  });

  it('should throw error when there is no owner.id', async () => {
    await expect(createInvalid(postWithoutOwnerId)).rejects.toThrow(/owner.id: Path `owner.id` is required./i);
  });

  it('should throw error when there is no type', async () => {
    await expect(createInvalid(postWithoutType)).rejects.toThrow(/path `type` is required/i);
  });

  it('should throw error when there are more than max fields in content', async () => {
    await expect(createInvalid(postWithMoreThanMaxContentField)).rejects.toThrow(new RegExp(`content must have at most ${SCHEMA_CONFIGS.MAX_NUM_FIELD} keys`, 'i'));
  });

  it('should throw error when there is less than 1 field in content', async () => {
    await expect(createInvalid(postWithoutContentField)).rejects.toThrow(/content must have at least 1 key/i);
  });

  it('should throw error when content is undefined', async () => {
    await expect(createInvalid(postWithUndefinedContent)).rejects.toThrow(/Path `content` is required./i);
  });

  it('should throw error when len of type is longer than max len', async () => {
    await expect(createInvalid(postWithInvalidMaxLenType)).rejects.toThrow(new RegExp(`length of type can not be longer than ${SCHEMA_CONFIGS.MAX_LEN_TYPE}`, 'i'));
  });

  it('should throw error when len of type is shorter than min len', async () => {
    await expect(createInvalid(postWithInvalidMinLenType)).rejects.toThrow(/Path `type` is required/i);
  });

  it('should throw error when type is not string', async () => {
    await expect(createInvalid(postWithInvalidTypeOfType)).rejects.toThrow(/Cast to string failed for value/i);

    postWithInvalidTypeOfType.type = {};
    await expect(createInvalid(postWithInvalidTypeOfType)).rejects.toThrow(/Cast to string failed for value/i);
  });

  it('should throw error when content is not object', async () => {
    await expect(createInvalid(postWithInvalidTypeOfContentFields)).rejects.toThrow(/content must be object/i);

    postWithInvalidTypeOfContentFields.content = 'test';
    await expect(createInvalid(postWithInvalidTypeOfContentFields)).rejects.toThrow(/content must be object/i);

    postWithInvalidTypeOfContentFields.content = 5.1;
    await expect(createInvalid(postWithInvalidTypeOfContentFields)).rejects.toThrow(/content must be object/i);

    postWithInvalidTypeOfContentFields.content = null;
    await expect(createInvalid(postWithInvalidTypeOfContentFields)).rejects.toThrow(/Path `content` is required./i);
  });

  it('should throw error when there is 0 topic', async () => {
    await expect(createInvalid(postWithZeroTopic)).rejects.toThrow(/Number of topics should be in/i);
  });

  it('should throw error when there is no topic', async () => {
    await expect(createInvalid(postWithoutTopic)).rejects.toThrow(/Number of topics should be in/i);
  });

  it('should throw error when len of topics is longer than max', async () => {
    await expect(createInvalid(postWithInvalidMaxTopic)).rejects.toThrow(/Number of topics should be in/i);
  });

  it('should throw error when there is invalid value in topics', async () => {
    await expect(createInvalid(postWithInvalidMaxLenTopic)).rejects.toThrow(/Post validation failed: topics./i);
  });

  it('should throw error when there are duplicated items in topics', async () => {
    await expect(createInvalid(postWithDuplicatedTopics)).rejects.toThrow(/Array cannot have duplicated items/i);
  });

  it('should throw error when there is no form for the type in post', async () => {
    await expect(createInvalid(postOfNonExistingForm)).rejects.toThrow('Post validation failed: content: form record not found for the given type: no type');
  });

  it('should throw error when value of text component is shorter than min len', async () => {
    await expect(createInvalid(postWithInvalidMinLenTextValue)).rejects.toThrow(`length of a value of a text type field can't be smaller than ${POST_SCHEMA_CONFIGS.MIN_LEN_TEXT}`);
  });

  it('should throw error when value of text component is longer than max len', async () => {
    await expect(createInvalid(postWithInvalidMaxLenTextValue)).rejects.toThrow(`length of value of a text type field can't be longer than ${POST_SCHEMA_CONFIGS.MAX_LEN_TEXT}`);
  });

  it('should throw error when value of text component is not string, number or boolean', async () => {
    await expect(createInvalid(postWithInvalidTextValue)).rejects.toThrow(/Value can be string, number or boolean/i);
    postWithInvalidTextValue.content.textInput = { a: 'test' };
    await expect(createInvalid(postWithInvalidTextValue)).rejects.toThrow(/Value can be string, number or boolean/i);
    postWithInvalidTextValue.content.textInput = [1, 2, 3, 4];
    await expect(createInvalid(postWithInvalidTextValue)).rejects.toThrow(/Value can be string, number or boolean/i);
  });

  it('should throw error when value of list component is not array', async () => {
    await expect(createInvalid(postWithInvalidList)).rejects.toThrow('value of a list type field must be array');
    postWithInvalidList.content.listInput = { 1: 2 };
    await expect(createInvalid(postWithInvalidList)).rejects.toThrow('value of a list type field must be array');
    postWithInvalidList.content.listInput = 1234;
    await expect(createInvalid(postWithInvalidList)).rejects.toThrow('value of a list type field must be array');
    postWithInvalidList.content.listInput = false;
    await expect(createInvalid(postWithInvalidList)).rejects.toThrow('value of a list type field must be array');
    postWithInvalidList.content.listInput = 'asd';
    await expect(createInvalid(postWithInvalidList)).rejects.toThrow('value of a list type field must be array');
  });

  it('should throw error when len of list component is longer than max', async () => {
    await expect(createInvalid(postWithInvalidListLen)).rejects.toThrow(`number of elements in a list type field can't be greater than ${POST_SCHEMA_CONFIGS.MAX_NUM_LIST}`);
  });

  it('should throw error when value of editor component is not string, number or boolean', async () => {
    await expect(createInvalid(postWithInvalidEditorValue)).rejects.toThrow('Value can be string, number or boolean');
    postWithInvalidEditorValue.content.editorInput = {};
    await expect(createInvalid(postWithInvalidEditorValue)).rejects.toThrow(/Value can be string, number or boolean/i);
    postWithInvalidEditorValue.content.editorInput = [1, 2, 3];
    await expect(createInvalid(postWithInvalidEditorValue)).rejects.toThrow(/Value can be string, number or boolean/i);
  });

  it('should throw error when len of editor component is longer than max', async () => {
    await expect(createInvalid(postWithInvalidMaxLenEditorValue)).rejects.toThrow(`length of value of a editor type field can't be longer than ${POST_SCHEMA_CONFIGS.MAX_LEN_EDITOR}`);
  });

  it('should throw error when len of editor component is shorter than min', async () => {
    await expect(createInvalid(postWithInvalidMinLenEditorValue)).rejects.toThrow(`length of a value of a editor type field can't be smaller than ${POST_SCHEMA_CONFIGS.MIN_LEN_EDITOR}`);
  });

  it('should throw error when values of multiple components are invalid', async () => {
    await expect(createInvalid(postWithInvalidMultipleComponentValue)).rejects.toThrow('invalid value for editor type field editorInput. Value can be string, number or boolean, value of a list type field must be array');
  });

  it('should throw error when field of post is not exist in associated form ', async () => {
    await expect(createInvalid(postWithNonExistingFormField)).rejects.toThrow(/invalid fields for form type/i);
  });

  it('should throw error when trying to create post with not owned form', async () => {
    await expect(createInvalid(postOfNotMyForm)).rejects.toThrow(`Post validation failed: content: form record not found for the given type: ${notMyType}`);
  });
});

describe('PostRepository.create() with valid records', () => {
  const postWithOnlyText = { ...postMock, content: { textInput: 'a text' } };

  const postWithOnlyImage = {
    ...postMock,
    content: {
      images: [
        { name: 'screenshot1.png', path: 'images/screenshot1.png' },
        { name: 'screenshot2.png', path: 'images/screenshot2.png' },
      ],
    },
  };

  const postWithEachTypeOfComponent = { ...postMock };

  it('should create post when form type is exist and belongs to post owner', async () => {
    await expect(await create(postWithOnlyText)).toEqual(postWithOnlyText);
  });

  it('should create post with only images', async () => {
    await expect(await create(postWithOnlyImage)).toEqual(postWithOnlyImage);
  });

  it('should create post with all the fields in form', async () => {
    await expect(await create(postWithEachTypeOfComponent)).toEqual(postWithEachTypeOfComponent);
  });
});
