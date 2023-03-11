/* eslint-env jest */
const mongoose = require('mongoose');
const FormRepository = require('../../src/repositories/FormRepository');
const SCHEMA_CONFIGS = require('../../src/models/schemaConfigs');

const formRepository = new FormRepository();

function create(form) {
  return async () => { await formRepository.create(form); };
}

describe('Form Repository - create', () => {
  it('should throw error when model is empty', () => {
    expect(create({})).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when there is no owner', () => {
    const formWithoutOwner = {
      type: 'abc',
      topics: ['topic1'],
      fields: {
        description: 'text',
        solution: 'editor',
      },
    };

    expect(create(formWithoutOwner)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when there is no owner.id', () => {
    const formWithoutOwnerId = {
      owner: {
        username: 'john',
        name: 'john',
      },
      type: 'abc',
      topics: ['topic1'],
      fields: {
        description: 'text',
        solution: 'editor',
      },
    };

    expect(create(formWithoutOwnerId)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when there is no type', () => {
    const formWithoutType = {
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      topics: ['topic1'],
      fields: {
        description: 'text',
        solution: 'editor',
      },
    };

    expect(create(formWithoutType)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when there are more than 10 fields', () => {
    const formWithMoreThanMaximumFields = {
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      type: 'a form',
      topics: ['topic1'],
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

    expect(create(formWithMoreThanMaximumFields)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when there is less than 1 field', () => {
    const formWithoutAField = {
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      type: 'a form',
      topics: ['topic1'],
      fields: {},
    };

    expect(create(formWithoutAField)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when fields undefined', () => {
    const formWithUndefinedFields = {
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      type: 'a form',
      topics: ['topic1'],
    };

    expect(create(formWithUndefinedFields)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when length of type is longer than max length', () => {
    const formWithInvalidMaxLenType = {
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      type: (new Array(SCHEMA_CONFIGS.MAX_LEN_TYPE + 10)).join('-'),
      topics: ['topic1'],
      fields: {
        1: 'text',
      },
    };

    expect(create(formWithInvalidMaxLenType)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when length of type is smaller than min length', () => {
    const formWithInvalidMinLenType = {
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      type: (new Array(SCHEMA_CONFIGS.MIN_LEN_TYPE - 1)).join('-'),
      topics: ['topic1'],
      fields: {
        1: 'text',
      },
    };

    expect(create(formWithInvalidMinLenType)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when type is not string', () => {
    const formWithInvalidTypeOfType = {
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      topics: ['topic1'],
      fields: {
        1: 'text',
      },
    };

    formWithInvalidTypeOfType.type = [1, 2];
    expect(create(formWithInvalidTypeOfType)).rejects.toThrow(mongoose.Error.ValidationError);

    formWithInvalidTypeOfType.type = {};
    expect(create(formWithInvalidTypeOfType)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when fields is not object', () => {
    const formWithInvalidTypeOfFields = {
      type: 'a type',
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      topics: ['topic1'],
    };

    formWithInvalidTypeOfFields.fields = [1, 2];
    expect(create(formWithInvalidTypeOfFields)).rejects.toThrow(mongoose.Error.ValidationError);

    formWithInvalidTypeOfFields.fields = 'test';
    expect(create(formWithInvalidTypeOfFields)).rejects.toThrow(mongoose.Error.ValidationError);

    formWithInvalidTypeOfFields.fields = 5.1;
    expect(create(formWithInvalidTypeOfFields)).rejects.toThrow(mongoose.Error.ValidationError);

    formWithInvalidTypeOfFields.fields = null;
    expect(create(formWithInvalidTypeOfFields)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when one the key of fields is longer then max length', () => {
    const invalidKey = (new Array(SCHEMA_CONFIGS.MAX_LEN_KEY_OF_FIELDS + 2)).join('-');

    const formWithInvalidKeyLength = {
      type: 'a type',
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      topics: ['topic1'],
      fields: {
        1: 'text',
        [invalidKey]: 'editor',
      },
    };

    expect(create(formWithInvalidKeyLength)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when one the value of fields is invalid component type', () => {
    const formWithInvalidComponentType = {
      type: 'a type',
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      topics: ['topic1'],
      fields: {
        1: 'text',
        2: 'non existing component type',
      },
    };

    expect(create(formWithInvalidComponentType)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should throw error when one of the value of fields is null component type', () => {
    const formWithInvalidComponentType = {
      type: 'a type',
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      topics: ['topic1'],
      fields: {
        1: 'text',
        2: null,
      },
    };

    expect(create(formWithInvalidComponentType)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should create the form', () => {
    const form = {
      type: 'abc',
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      topics: ['topic1'],
      fields: {
        description: 'text',
      },
    };

    expect(create(form)).not.toThrow();
  });

  it('should get the form after creating', async () => {
    const form = {
      type: 'abc2',
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      topics: ['topic1'],
      fields: {
        description: 'text',
      },
    };

    await formRepository.create(form);
    const newForm = await formRepository.findOne({ type: 'abc2' });
    expect(form.fields.description).toBe(newForm.fields.description);
  });

  it('should throw error when trying to create multiple forms with the same type', async () => {
    const form = {
      type: 'abc',
      owner: {
        id: '222222222222222222222222',
        username: 'john_doe',
        name: 'John Doe',
      },
      topics: ['topic1'],
      fields: {
        description: 'text',
      },
    };

    expect(async () => {
      await formRepository.create(form);
      await formRepository.create(form);
    }).rejects.toThrow();
  });
});
