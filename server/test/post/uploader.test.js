/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */
import { jest } from '@jest/globals';
import { preparePostForCreate, preparePostForUpdate } from '../../src/post/uploader.js';

describe('uploader - preparePostForCreate', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        type: JSON.stringify('test type'),
        topics: JSON.stringify(['topic1', 'topic2']),
        content: JSON.stringify({
          name: 'brown',
          surname: 'fox',
        }),
      },
      session: {
        userId: '1',
        name: 'jack',
        username: 'jack',
      },
    };
    res = { locals: {} };
    next = jest.fn();
  });

  test('preparePostForCreate', () => {
    const result = {
      type: 'test type',
      topics: ['topic1', 'topic2'],
      content: {
        name: 'brown',
        surname: 'fox',
      },
      owner: {
        id: '1',
        name: 'jack',
        username: 'jack',
      },
    };

    preparePostForCreate(req, res, next);

    expect(res.locals.data).toEqual(result);
  });

  test('preparePostForCreate - without content', () => {
    delete req.body.content;

    const result = {
      type: 'test type',
      topics: ['topic1', 'topic2'],
      content: {},
      owner: {
        id: '1',
        name: 'jack',
        username: 'jack',
      },
    };

    preparePostForCreate(req, res, next);

    expect(res.locals.data).toEqual(result);
  });

  test('preparePostForCreate - with images', () => {
    req.files = [
      {
        originalname: 'screenshot_1.png',
        path: 'uploads/images/image_1677975065263-71929653.png',
      },
      {
        originalname: 'screenshot_2.png',
        path: 'uploads/images/image_1677975065269-189684187.png',
      },
    ];

    const result = {
      type: 'test type',
      topics: ['topic1', 'topic2'],
      content: {
        name: 'brown',
        surname: 'fox',
        images: [
          {
            name: 'screenshot_1.png',
          },
          {
            name: 'screenshot_2.png',
          },
        ],
      },
      owner: {
        id: '1',
        name: 'jack',
        username: 'jack',
      },
    };

    preparePostForCreate(req, res, next);

    // Path is timestamp dependent
    delete res.locals.data.content.images[0].path;
    delete res.locals.data.content.images[1].path;

    expect(res.locals.data).toEqual(result);
  });
});

describe('uploader - preparePostForUpdate', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        type: JSON.stringify('test type'),
        topics: JSON.stringify(['topic1']),
        content: JSON.stringify({
          name: 'brown',
        }),
      },
      session: {
        userId: '1',
        name: 'jack',
        username: 'jack',
      },
    };
    res = { locals: {} };
    next = jest.fn();
  });

  test('preparePostForUpdate', () => {
    const result = {
      type: 'test type',
      topics: ['topic1'],
      content: {
        name: 'brown',
      },
      owner: {
        id: '1',
        name: 'jack',
        username: 'jack',
      },
    };

    preparePostForUpdate(req, res, next);

    expect(res.locals.data).toEqual(result);
  });

  test('preparePostForUpdate - without content', () => {
    delete req.body.content;

    const result = {
      type: 'test type',
      topics: ['topic1'],
      owner: {
        id: '1',
        name: 'jack',
        username: 'jack',
      },
    };

    preparePostForUpdate(req, res, next);

    expect(res.locals.data).toEqual(result);
  });

  test('preparePostForUpdate - with images', () => {
    req.files = [
      {
        originalname: 'screenshot_1.png',
        path: 'uploads/images/image_1677975065263-71929653.png',
      },
      {
        originalname: 'screenshot_2.png',
        path: 'uploads/images/image_1677975065269-189684187.png',
      },
    ];

    const result = {
      type: 'test type',
      topics: ['topic1'],
      content: {
        name: 'brown',
        images: [
          {
            name: 'screenshot_1.png',
          },
          {
            name: 'screenshot_2.png',
          },
        ],
      },
      owner: {
        id: '1',
        name: 'jack',
        username: 'jack',
      },
    };

    preparePostForUpdate(req, res, next);

    // Path is timestamp dependent
    delete res.locals.data.content.images[0].path;
    delete res.locals.data.content.images[1].path;

    expect(res.locals.data).toEqual(result);
  });

  test('preparePostForUpdate - removed one image and other image is unchanged without content', () => {
    delete req.body.content;

    req.body.oldImages = JSON.stringify([
      { name: 'screenshot_1.png', path: 'images/screenshot_1.png' },
    ]);

    const result = {
      type: 'test type',
      topics: ['topic1'],
      content: {
        images: [
          { name: 'screenshot_1.png', path: 'images/screenshot_1.png' },
        ],
      },
      owner: {
        id: '1',
        name: 'jack',
        username: 'jack',
      },
    };

    preparePostForUpdate(req, res, next);

    expect(res.locals.data).toEqual(result);
  });

  test('preparePostForUpdate - removed one image and other image is unchanged', () => {
    req.body.oldImages = JSON.stringify([
      { name: 'screenshot_1.png', path: 'images/screenshot_1.png' },
    ]);

    const result = {
      type: 'test type',
      topics: ['topic1'],
      content: {
        name: 'brown',
        images: [
          { name: 'screenshot_1.png', path: 'images/screenshot_1.png' },
        ],
      },
      owner: {
        id: '1',
        name: 'jack',
        username: 'jack',
      },
    };

    preparePostForUpdate(req, res, next);

    expect(res.locals.data).toEqual(result);
  });

  test('preparePostForUpdate - removed two images - no old image to store', () => {
    req.body.oldImages = JSON.stringify([]);

    const result = {
      type: 'test type',
      topics: ['topic1'],
      content: {
        name: 'brown',
        images: [],
      },
      owner: {
        id: '1',
        name: 'jack',
        username: 'jack',
      },
    };

    preparePostForUpdate(req, res, next);

    expect(res.locals.data).toEqual(result);
  });

  test('preparePostForUpdate - removed two images - no old image to store without content', () => {
    delete req.body.content;

    req.body.oldImages = JSON.stringify([]);

    const result = {
      type: 'test type',
      topics: ['topic1'],
      content: {
        images: [],
      },
      owner: {
        id: '1',
        name: 'jack',
        username: 'jack',
      },
    };

    preparePostForUpdate(req, res, next);

    expect(res.locals.data).toEqual(result);
  });

  test('preparePostForUpdate - changed two images', () => {
    req.files = [
      {
        originalname: 'screenshot_1.png',
        path: 'uploads/images/image_1677975065263-71929653.png',
      },
      {
        originalname: 'screenshot_2.png',
        path: 'uploads/images/image_1677975065269-189684187.png',
      },
    ];

    req.body.oldImages = JSON.stringify([]);

    const result = {
      type: 'test type',
      topics: ['topic1'],
      content: {
        name: 'brown',
        images: [
          { name: 'screenshot_1.png' },
          { name: 'screenshot_2.png' },
        ],
      },
      owner: {
        id: '1',
        name: 'jack',
        username: 'jack',
      },
    };

    preparePostForUpdate(req, res, next);

    // Path is timestamp dependent
    delete res.locals.data.content.images[0].path;
    delete res.locals.data.content.images[1].path;

    expect(res.locals.data).toEqual(result);
  });
});
