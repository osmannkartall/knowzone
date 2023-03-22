/* eslint-env jest */
const SearchService = require('../../src/services/SearchService');
const PostModel = require('../../src/models/Post');

jest.mock('../../src/models/Post');

beforeEach(() => { PostModel.find.mockReturnValueOnce([]); });

describe('SearchService - filter()', () => {
  const searchText = 'hello';
  const content = 'hello';
  const ownerId = '641ac3f13325cf129878ca49';
  const type = 'test type';
  const createdAtStartDate = '2022-10-22';
  const createdAtEndDate = '2023-10-22';
  const updatedAtStartDate = '2023-01-22';
  const updatedAtEndDate = '2024-05-12';
  const topics = ['topic1', 'topic2'];

  const topicsFilter = { $in: topics.map((topic) => new RegExp(`\\b${topic}\\b`, 'i')) };
  const typeFilter = new RegExp(`\\b${type}\\b`, 'i');
  const createdAtFilter = {
    $gte: new Date(`${createdAtStartDate}T00:00:00.000Z`),
    $lte: new Date(`${createdAtEndDate}T23:59:59.999Z`),
  };
  const updatedAtFilter = {
    $gte: new Date(`${updatedAtStartDate}T00:00:00.000Z`),
    $lte: new Date(`${updatedAtEndDate}T23:59:59.999Z`),
  };

  it('should create query with content, dates, type and topics', async () => {
    const filterInfo = {
      content,
      ownerId,
      type,
      createdAtStartDate,
      createdAtEndDate,
      updatedAtStartDate,
      updatedAtEndDate,
      topics,
    };
    const expectedQuery = {
      $and: [
        { ...SearchService.getReduceQueryForContentField(content) },
        {
          createdAt: createdAtFilter,
          updatedAt: updatedAtFilter,
          topics: topicsFilter,
          type: typeFilter,
          'owner.id': ownerId,
        },
      ],
    };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with search text, dates, type and topics', async () => {
    const filterInfo = {
      searchText,
      ownerId,
      type,
      createdAtStartDate,
      createdAtEndDate,
      updatedAtStartDate,
      updatedAtEndDate,
      topics,
    };
    const expectedQuery = {
      $and: [
        {
          $or: [{ ...SearchService.getReduceQueryForContentField(searchText) }],
        },
        {
          createdAt: createdAtFilter,
          updatedAt: updatedAtFilter,
          topics: topicsFilter,
          type: typeFilter,
          'owner.id': ownerId,
        },
      ],
    };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only type', async () => {
    const filterInfo = { ownerId, type };
    const expectedQuery = { type: typeFilter, 'owner.id': ownerId };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only topics', async () => {
    const filterInfo = { ownerId, topics };
    const expectedQuery = { topics: topicsFilter, 'owner.id': ownerId };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only dates', async () => {
    const filterInfo = {
      ownerId,
      createdAtStartDate,
      createdAtEndDate,
      updatedAtStartDate,
      updatedAtEndDate,
    };
    const expectedQuery = {
      createdAt: createdAtFilter,
      updatedAt: updatedAtFilter,
      'owner.id': ownerId,
    };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only createdAt', async () => {
    const filterInfo = { ownerId, createdAtStartDate, createdAtEndDate };
    const expectedQuery = { createdAt: createdAtFilter, 'owner.id': ownerId };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only createdAtStartDate', async () => {
    const filterInfo = { ownerId, createdAtStartDate };
    const expectedQuery = {
      createdAt: { $gte: new Date(`${createdAtStartDate}T00:00:00.000Z`) },
      'owner.id': ownerId,
    };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only createdAtEndDate', async () => {
    const filterInfo = { ownerId, createdAtEndDate };
    const expectedQuery = {
      createdAt: { $lte: new Date(`${createdAtEndDate}T23:59:59.999Z`) },
      'owner.id': ownerId,
    };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only updatedAt', async () => {
    const filterInfo = { ownerId, updatedAtStartDate, updatedAtEndDate };
    const expectedQuery = { updatedAt: updatedAtFilter, 'owner.id': ownerId };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only updatedAtStartDate', async () => {
    const filterInfo = { ownerId, updatedAtStartDate };
    const expectedQuery = {
      updatedAt: { $gte: new Date(`${updatedAtStartDate}T00:00:00.000Z`) },
      'owner.id': ownerId,
    };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only updatedAtEndDate', async () => {
    const filterInfo = { ownerId, updatedAtEndDate };
    const expectedQuery = {
      updatedAt: { $lte: new Date(`${updatedAtEndDate}T23:59:59.999Z`) },
      'owner.id': ownerId,
    };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only type and search text', async () => {
    const filterInfo = { ownerId, type, searchText };
    const expectedQuery = {
      $and: [
        {
          $or: [
            { ...SearchService.getReduceQueryForContentField(searchText) },
            { topics: { $in: [new RegExp(`\\b${searchText.trim()}\\b`, 'i')] } },
          ],
        },
        {
          type: typeFilter,
          'owner.id': ownerId,
        },
      ],
    };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only topics and search text', async () => {
    const filterInfo = { ownerId, topics, searchText };
    const expectedQuery = {
      $and: [
        {
          $or: [
            { ...SearchService.getReduceQueryForContentField(searchText) },
            { type: new RegExp(`\\b${searchText.trim()}\\b`, 'i') },
          ],
        },
        {
          topics: topicsFilter,
          'owner.id': ownerId,
        },
      ],
    };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only content', async () => {
    const filterInfo = { ownerId, content };
    const expectedQuery = {
      $and: [
        { ...SearchService.getReduceQueryForContentField(content) },
        { 'owner.id': ownerId },
      ],
    };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });

  it('should create query with only searchText', async () => {
    const filterInfo = { ownerId, searchText };
    const expectedQuery = {
      $and: [
        {
          $or: [
            { ...SearchService.getReduceQueryForContentField(searchText) },
            { type: new RegExp(`\\b${searchText.trim()}\\b`, 'i') },
            { topics: { $in: [new RegExp(`\\b${searchText.trim()}\\b`, 'i')] } },
          ],
        },
        { 'owner.id': ownerId },
      ],
    };

    await SearchService.search(filterInfo);

    expect(PostModel.find).toHaveBeenCalledWith(expectedQuery);
  });
});
