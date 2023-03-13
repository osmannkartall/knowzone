/* eslint-env jest */
const mongoose = require('mongoose');
const FormRepository = require('../../src/repositories/FormRepository');
const { SCHEMA_CONFIGS } = require('../../src/models/schemaConfigs');

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

const fieldsMock = {
  description: 'text',
  solution: 'editor',
};

const formMock = {
  type,
  owner: ownerMock,
  fields: fieldsMock,
};

beforeEach(async () => {
  const formsCollection = mongoose.connection?.collections?.forms;

  if (formsCollection) {
    await formsCollection.deleteMany({});
  }
});

describe('FormRepository.create() with invalid records', () => {
  const formWithoutOwner = { type, fields: fieldsMock };

  const formWithoutOwnerId = { type, owner: { username: 'john', name: 'john' }, fields: fieldsMock };

  const formWithoutType = { owner: ownerMock, fields: fieldsMock };

  const formWithMoreThanMaximumFields = {
    ...formMock,
    fields: {
      1: 'text',
      2: 'text',
      3: 'text',
      4: 'text',
      5: 'text',
      6: 'text',
      7: 'text',
      8: 'text',
      9: 'text',
      10: 'text',
      11: 'text',
    },
  };

  const formWithoutAField = { ...formMock, fields: {} };

  const formWithUndefinedFields = { type, owner: ownerMock };

  const formWithInvalidMaxLenType = {
    ...formMock,
    type: (new Array(SCHEMA_CONFIGS.MAX_LEN_TYPE + 10)).join('-'),
  };

  const formWithInvalidMinLenType = {
    ...formMock,
    type: (new Array(SCHEMA_CONFIGS.MIN_LEN_TYPE - 1)).join('-'),
  };

  const formWithInvalidTypeOfType = { ...formMock };

  const formWithInvalidTypeOfFields = { ...formMock };

  const formWithInvalidKeyLength = {
    ...formMock,
    fields: {
      1: 'text',
      [(new Array(SCHEMA_CONFIGS.MAX_LEN_KEY_OF_FIELDS + 2)).join('-')]: 'editor',
    },
  };

  const formWithInvalidComponentType = { ...formMock, fields: { 1: 'text', 2: 'non existing' } };

  const formWithMultipleImage = {
    ...formMock,
    fields: {
      description: 'text',
      testImages1: 'image',
      testImages2: 'image',
    },
  };

  it('should throw error when model is empty', async () => {
    await expect(createInvalid({})).rejects.toThrow(/Form validation failed/i);
  });

  it('should throw error when there is no owner', async () => {
    await expect(createInvalid(formWithoutOwner)).rejects.toThrow(/owner.id: Path `owner.id` is required/i);
  });

  it('should throw error when there is no owner.id', async () => {
    await expect(createInvalid(formWithoutOwnerId)).rejects.toThrow(/owner.id: Path `owner.id` is required./i);
  });

  it('should throw error when there is no type', async () => {
    await expect(createInvalid(formWithoutType)).rejects.toThrow(/path `type` is required/i);
  });

  it('should throw error when there are more than max fields', async () => {
    await expect(createInvalid(formWithMoreThanMaximumFields)).rejects.toThrow(new RegExp(`fields must have at most ${SCHEMA_CONFIGS.MAX_NUM_FIELD} keys`, 'i'));
  });

  it('should throw error when there is less than 1 field', async () => {
    await expect(createInvalid(formWithoutAField)).rejects.toThrow(/fields must have at least 1 key/i);
  });

  it('should throw error when fields is undefined', async () => {
    await expect(createInvalid(formWithUndefinedFields)).rejects.toThrow(/Path `fields` is required./i);
  });

  it('should throw error when len of type is longer than max len', async () => {
    await expect(createInvalid(formWithInvalidMaxLenType)).rejects.toThrow(new RegExp(`length of type can not be longer than ${SCHEMA_CONFIGS.MAX_LEN_TYPE}`, 'i'));
  });

  it('should throw error when len of type is smaller than min len', async () => {
    await expect(createInvalid(formWithInvalidMinLenType)).rejects.toThrow(/Path `type` is required/i);
  });

  it('should throw error when type is not string', async () => {
    formWithInvalidTypeOfType.type = [1, 2];
    await expect(createInvalid(formWithInvalidTypeOfType)).rejects.toThrow(/Cast to string failed for value/i);

    formWithInvalidTypeOfType.type = {};
    await expect(createInvalid(formWithInvalidTypeOfType)).rejects.toThrow(/Cast to string failed for value/i);
  });

  it('should throw error when fields is not object', async () => {
    formWithInvalidTypeOfFields.fields = [1, 2];
    await expect(createInvalid(formWithInvalidTypeOfFields)).rejects.toThrow(/fields must be object/i);

    formWithInvalidTypeOfFields.fields = 'test';
    await expect(createInvalid(formWithInvalidTypeOfFields)).rejects.toThrow(/fields must be object/i);

    formWithInvalidTypeOfFields.fields = 5.1;
    await expect(createInvalid(formWithInvalidTypeOfFields)).rejects.toThrow(/fields must be object/i);

    formWithInvalidTypeOfFields.fields = null;
    await expect(createInvalid(formWithInvalidTypeOfFields)).rejects.toThrow(/Path `fields` is required/i);
  });

  it('should throw error when one the key of fields is longer then max len', async () => {
    await expect(createInvalid(formWithInvalidKeyLength)).rejects.toThrow(new RegExp(`name cannot be longer than ${SCHEMA_CONFIGS.MAX_LEN_KEY_OF_FIELDS}`, 'i'));
  });

  it('should throw error when one the value of fields is invalid component type', async () => {
    await expect(createInvalid(formWithInvalidComponentType)).rejects.toThrow(/name and component type must be non-empty string. Valid component types/i);
    formWithInvalidComponentType.fields[2] = null;
    await expect(createInvalid(formWithInvalidComponentType)).rejects.toThrow(/name and component type must be non-empty string. Valid component types/i);
  });

  it('should throw error when there are more than one image component in fields', async () => {
    await expect(createInvalid(formWithMultipleImage)).rejects.toThrow('fields must have at most one image component');
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
    fields: {
      description: 'text',
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
    expect(form2.fields.description).toBe(newForm.fields.description);
  });

  it('should throw error when trying to create multiple forms with the same type', async () => {
    await expect(async () => {
      await formRepository.create(form);
      await formRepository.create(form);
    }).rejects.toThrow(/duplicate key error collection/i);
  });
});
