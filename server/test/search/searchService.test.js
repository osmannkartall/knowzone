/* eslint-disable import/no-extraneous-dependencies */
import { jest } from '@jest/globals';
import SearchService from '../../src/search/searchService.js';
import PostRepository from '../../src/post/postRepository.js';

const mockPostRepository = {
  find: jest.fn().mockResolvedValue([]),
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(PostRepository.prototype, 'find').mockImplementation(mockPostRepository.find);
});

describe('SearchService - filter()', () => {
  const searchText = 'search this words';
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

  const textIndexQuery = { $text: { $search: searchText } };

  const cursor = 'id_timestamp';

  it('should create query with search text, dates, type and topics', async () => {
    const filterInfo = {
      searchText,
      type,
      createdAtStartDate,
      createdAtEndDate,
      updatedAtStartDate,
      updatedAtEndDate,
      topics,
    };
    const expectedQuery = {
      $and: [
        textIndexQuery,
        {
          createdAt: createdAtFilter,
          updatedAt: updatedAtFilter,
          topics: topicsFilter,
          type: typeFilter,
        },
      ],
    };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only type', async () => {
    const filterInfo = { type };
    const expectedQuery = { type: typeFilter };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only topics', async () => {
    const filterInfo = { topics };
    const expectedQuery = { topics: topicsFilter };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only dates', async () => {
    const filterInfo = {
      createdAtStartDate,
      createdAtEndDate,
      updatedAtStartDate,
      updatedAtEndDate,
    };
    const expectedQuery = {
      createdAt: createdAtFilter,
      updatedAt: updatedAtFilter,
    };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only createdAt', async () => {
    const filterInfo = { createdAtStartDate, createdAtEndDate };
    const expectedQuery = { createdAt: createdAtFilter };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only createdAtStartDate', async () => {
    const filterInfo = { createdAtStartDate };
    const expectedQuery = {
      createdAt: { $gte: new Date(`${createdAtStartDate}T00:00:00.000Z`) },
    };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only createdAtEndDate', async () => {
    const filterInfo = { createdAtEndDate };
    const expectedQuery = {
      createdAt: { $lte: new Date(`${createdAtEndDate}T23:59:59.999Z`) },
    };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only updatedAt', async () => {
    const filterInfo = { updatedAtStartDate, updatedAtEndDate };
    const expectedQuery = { updatedAt: updatedAtFilter };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only updatedAtStartDate', async () => {
    const filterInfo = { updatedAtStartDate };
    const expectedQuery = {
      updatedAt: { $gte: new Date(`${updatedAtStartDate}T00:00:00.000Z`) },
    };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only updatedAtEndDate', async () => {
    const filterInfo = { updatedAtEndDate };
    const expectedQuery = {
      updatedAt: { $lte: new Date(`${updatedAtEndDate}T23:59:59.999Z`) },
    };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only type and search text', async () => {
    const filterInfo = { type, searchText };
    const expectedQuery = {
      $and: [
        textIndexQuery,
        {
          type: typeFilter,
        },
      ],
    };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only topics and search text', async () => {
    const filterInfo = { topics, searchText };
    const expectedQuery = {
      $and: [
        textIndexQuery,
        {
          topics: topicsFilter,
        },
      ],
    };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });

  it('should create query with only searchText', async () => {
    const filterInfo = { searchText };
    const expectedQuery = {
      $and: [textIndexQuery, { }],
    };

    await SearchService.search(filterInfo, cursor);

    expect(mockPostRepository.find).toHaveBeenCalledWith(expectedQuery, null, cursor);
  });
});
