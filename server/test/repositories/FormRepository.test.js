/* eslint-env jest */
const mongoose = require('mongoose');
const FormRepository = require('../../src/repositories/FormRepository');
const { FORM_SCHEMA_CONFIGS } = require('../../src/models/schemaConfigs');
const {
  VALIDATION_MESSAGES,
  MONGOOSE_DEFAULT_MESSAGES,
  FORM_VALIDATION_MESSAGES,
} = require('../../src/models/validationMessages');
const FORM_COMPONENT_TYPES = require('../../src/constants/formComponentTypes');

const formRepository = new FormRepository();

function createInvalid(form) {
  return async () => { await formRepository.create(form); };
}

const type = 'a form';

const ownerMock = {
  id: '222222222222222222222222',
  username: 'john_doe',
  name: 'John Doe',
};

const contentMock = {
  description: FORM_COMPONENT_TYPES.TEXT,
  solution: FORM_COMPONENT_TYPES.EDITOR,
};

const formMock = {
  type,
  owner: ownerMock,
  content: contentMock,
};

beforeEach(async () => {
  const formsCollection = mongoose.connection?.collections?.forms;

  if (formsCollection) {
    await formsCollection.deleteMany({});
  }
});

describe('FormRepository.create() with invalid records', () => {
  const formWithoutOwner = { type, content: contentMock };

  const formWithoutOwnerId = {
    type,
    owner: { username: 'john', name: 'john' },
    content: contentMock,
  };

  const formWithoutType = { owner: ownerMock, content: contentMock };

  const formWithMoreThanMaxContentFields = {
    ...formMock,
    content: {
      1: FORM_COMPONENT_TYPES.TEXT,
      2: FORM_COMPONENT_TYPES.TEXT,
      3: FORM_COMPONENT_TYPES.TEXT,
      4: FORM_COMPONENT_TYPES.TEXT,
      5: FORM_COMPONENT_TYPES.TEXT,
      6: FORM_COMPONENT_TYPES.TEXT,
      7: FORM_COMPONENT_TYPES.TEXT,
      8: FORM_COMPONENT_TYPES.TEXT,
      9: FORM_COMPONENT_TYPES.TEXT,
      10: FORM_COMPONENT_TYPES.TEXT,
      11: FORM_COMPONENT_TYPES.TEXT,
    },
  };

  const formWithoutAField = { ...formMock, content: {} };

  const formWithUndefinedContent = { type, owner: ownerMock };

  const formWithInvalidMaxLenType = {
    ...formMock,
    type: (new Array(FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE + 10)).join('-'),
  };

  const formWithInvalidMinLenType = {
    ...formMock,
    type: (new Array(FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE - 1)).join('-'),
  };

  const formWithInvalidTypeOfType = { ...formMock };

  const formWithInvalidTypeOfContent = { ...formMock };

  const formWithInvalidKeyLength = {
    ...formMock,
    content: {
      1: FORM_COMPONENT_TYPES.TEXT,
      [
      (new Array(FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_CONTENT + 2)).join('-')
      ]: FORM_COMPONENT_TYPES.EDITOR,
    },
  };

  const formWithInvalidComponentType = {
    ...formMock,
    content: {
      1: FORM_COMPONENT_TYPES.TEXT,
      2: 'non existing',
    },
  };

  const formWithMultipleImage = {
    ...formMock,
    content: {
      description: FORM_COMPONENT_TYPES.TEXT,
      testImages1: FORM_COMPONENT_TYPES.IMAGE,
      testImages2: FORM_COMPONENT_TYPES.IMAGE,
    },
  };

  it('should throw error when model is empty', async () => {
    await expect(createInvalid({})).rejects.toThrow(MONGOOSE_DEFAULT_MESSAGES.INVALID('Form'));
  });

  it('should throw error when there is no owner', async () => {
    await expect(createInvalid(formWithoutOwner)).rejects.toThrow(
      MONGOOSE_DEFAULT_MESSAGES.REQUIRED('owner.id'),
    );
  });

  it('should throw error when there is no owner.id', async () => {
    await expect(createInvalid(formWithoutOwnerId)).rejects.toThrow(
      MONGOOSE_DEFAULT_MESSAGES.REQUIRED('owner.id'),
    );
  });

  it('should throw error when there is no type', async () => {
    await expect(createInvalid(formWithoutType)).rejects.toThrow(
      MONGOOSE_DEFAULT_MESSAGES.REQUIRED('type'),
    );
  });

  it('should throw error when there are more than max fields in content', async () => {
    await expect(createInvalid(formWithMoreThanMaxContentFields)).rejects.toThrow(
      VALIDATION_MESSAGES.MAX_KEY('content', FORM_SCHEMA_CONFIGS.MAX_NUM_CONTENT),
    );
  });

  it('should throw error when there is less than 1 field', async () => {
    await expect(createInvalid(formWithoutAField)).rejects.toThrow(
      VALIDATION_MESSAGES.MIN_KEY('content', FORM_SCHEMA_CONFIGS.MIN_NUM_CONTENT),
    );
  });

  it('should throw error when content is undefined', async () => {
    await expect(createInvalid(formWithUndefinedContent)).rejects.toThrow(
      MONGOOSE_DEFAULT_MESSAGES.REQUIRED('content'),
    );
  });

  it('should throw error when len of type is longer than max len', async () => {
    await expect(createInvalid(formWithInvalidMaxLenType)).rejects.toThrow(
      VALIDATION_MESSAGES.MAX_LEN('type', FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE),
    );
  });

  it('should throw error when len of type is smaller than min len', async () => {
    await expect(createInvalid(formWithInvalidMinLenType)).rejects.toThrow(
      MONGOOSE_DEFAULT_MESSAGES.REQUIRED('type'),
    );
  });

  it('should throw error when type is not string', async () => {
    const castMessage = MONGOOSE_DEFAULT_MESSAGES.CAST('string');

    formWithInvalidTypeOfType.type = [1, 2];
    await expect(createInvalid(formWithInvalidTypeOfType)).rejects.toThrow(castMessage);

    formWithInvalidTypeOfType.type = {};
    await expect(createInvalid(formWithInvalidTypeOfType)).rejects.toThrow(castMessage);
  });

  it('should throw error when content is not object', async () => {
    const typeMessage = VALIDATION_MESSAGES.TYPE('content', 'object');

    formWithInvalidTypeOfContent.content = [1, 2];
    await expect(createInvalid(formWithInvalidTypeOfContent)).rejects.toThrow(typeMessage);

    formWithInvalidTypeOfContent.content = 'test';
    await expect(createInvalid(formWithInvalidTypeOfContent)).rejects.toThrow(typeMessage);

    formWithInvalidTypeOfContent.content = 5.1;
    await expect(createInvalid(formWithInvalidTypeOfContent)).rejects.toThrow(typeMessage);

    formWithInvalidTypeOfContent.content = null;
    await expect(createInvalid(formWithInvalidTypeOfContent)).rejects.toThrow(
      MONGOOSE_DEFAULT_MESSAGES.REQUIRED('content'),
    );
  });

  it('should throw error when one the key of content is longer then max len', async () => {
    await expect(createInvalid(formWithInvalidKeyLength)).rejects.toThrow(
      VALIDATION_MESSAGES.MAX_LEN('name', FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_CONTENT),
    );
  });

  it('should throw error when one the value of content is invalid component type', async () => {
    const messages = [
      VALIDATION_MESSAGES.MIN_LEN('name'),
      VALIDATION_MESSAGES.MAX_LEN('name', FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_CONTENT),
      VALIDATION_MESSAGES.MIN_LEN('component type'),
      FORM_VALIDATION_MESSAGES.INVALID_COMPONENT,
    ].join('. ');

    await expect(createInvalid(formWithInvalidComponentType)).rejects.toThrow(messages);
    formWithInvalidComponentType.content[2] = null;
    await expect(createInvalid(formWithInvalidComponentType)).rejects.toThrow(messages);
  });

  it('should throw error when there are more than one image component in content', async () => {
    await expect(createInvalid(formWithMultipleImage)).rejects.toThrow(
      FORM_VALIDATION_MESSAGES.MAX_IMAGE_COMPONENT,
    );
  });
});

describe('FormRepository.create() with valid records', () => {
  const form = {
    type,
    owner: {
      id: '222222222222222222222222',
      username: 'john_doe',
      name: 'John Doe',
    },
    content: {
      description: FORM_COMPONENT_TYPES.TEXT,
    },
  };

  const form2 = {
    ...form,
    type: 'form2',
  };

  it('should create the form', async () => {
    await expect(async () => { await formRepository.create(form); }).not.toThrow();
  });

  it('should get the form after creating', async () => {
    await formRepository.create(form2);
    const newForm = await formRepository.findOne({ type: 'form2' });
    expect(form2.content.description).toBe(newForm.content.description);
  });

  it('should throw error when trying to create multiple forms with the same type', async () => {
    await expect(async () => {
      await formRepository.create(form);
      await formRepository.create(form);
    }).rejects.toThrow(/duplicate key error collection/i);
  });
});
