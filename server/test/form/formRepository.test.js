import mongoose from 'mongoose';
import FormRepository from '../../src/form/formRepository.js';
import FORM_SCHEMA_CONFIGS from '../../src/form/formSchemaConfigs.js';
import FORM_VALIDATION_MESSAGES from '../../src/form/formValidationMessages.js';
import VALIDATION_MESSAGES from '../../src/common/validationMessages.js';
import MONGOOSE_DEFAULT_MESSAGES from '../../src/common/mongooseDefaultMessages.js';
import FORM_COMPONENT_TYPES from '../../src/form/formComponentTypes.js';

const formRepository = new FormRepository();

function createInvalid(form) {
  return async () => { await formRepository.create(form); };
}

const type = {
  name: 'a form',
};

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

  const formWithInvalidMaxLenTypeName = {
    ...formMock,
    type: {
      name: (new Array(FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE + 10)).join('-'),
    },
  };

  const formWithInvalidMinLenTypeName = {
    ...formMock,
    type: {
      name: (new Array(FORM_SCHEMA_CONFIGS.MIN_LEN_TYPE - 1)).join('-'),
    },
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
    await expect(createInvalid({})).rejects.toThrow(MONGOOSE_DEFAULT_MESSAGES.INVALID('form'));
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
      MONGOOSE_DEFAULT_MESSAGES.REQUIRED('type.name'),
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

  it('should throw error when len of type.name is longer than max len', async () => {
    await expect(createInvalid(formWithInvalidMaxLenTypeName)).rejects.toThrow(
      VALIDATION_MESSAGES.MAX_LEN('type.name', FORM_SCHEMA_CONFIGS.MAX_LEN_TYPE),
    );
  });

  it('should throw error when len of type.name is smaller than min len', async () => {
    await expect(createInvalid(formWithInvalidMinLenTypeName)).rejects.toThrow(
      MONGOOSE_DEFAULT_MESSAGES.REQUIRED('type.name'),
    );
  });

  it('should throw error when type.name is not string', async () => {
    const castMessage = MONGOOSE_DEFAULT_MESSAGES.CAST('string');

    formWithInvalidTypeOfType.type.name = [1, 2];
    await expect(createInvalid(formWithInvalidTypeOfType)).rejects.toThrow(castMessage);

    formWithInvalidTypeOfType.type.name = {};
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
    owner: {
      id: '222222222222222222222222',
      username: 'john_doe',
      name: 'John Doe',
    },
    content: {
      description: FORM_COMPONENT_TYPES.TEXT,
    },
    type: {
      name: 'form2',
    },
  };

  it('should create the form', async () => {
    await expect(async () => { await formRepository.create(form); }).not.toThrow();
  });

  it('should get the form after creating', async () => {
    const result = await formRepository.create(form);
    const newForm = await formRepository.findOne({ 'type.id': result.type.id.toString() });
    expect(form.content.description).toBe(newForm.content.description);
  });

  it('should create form with same name for the same user', async () => {
    await formRepository.create(form);
    await formRepository.create(form);
    await formRepository.create(form);

    const result = await formRepository.find({ 'type.name': form.type.name });

    expect(result.records.length).toBe(3);
  });

  it('should create form with same name for the different users', async () => {
    await formRepository.create(form);
    await formRepository.create(
      {
        ...form,
        owner: {
          id: '992222222222222222222222',
          username: 'alice',
          name: 'alice alice',
        },
      },
    );

    const result = await formRepository.find({ 'type.name': form.type.name });
    const usernames = result.records.map((record) => record.owner.username).sort();

    expect(usernames).toEqual(['alice', 'john_doe']);
  });
});
