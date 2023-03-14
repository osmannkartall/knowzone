export const formTypes = [
  {
    type: 'tip',
    id: '640edb2de252b234025c5030',
  },
  {
    type: 'bugfix',
    id: '640edb2de252b234025c5031',
  },
  {
    type: 'todo',
    id: '640edb2de252b234025c5032',
  },
];

export const forms = {
  tip: {
    owner: {
      id: '640ec640e252b234025c502d',
      username: 'test',
      name: 'test',
    },
    type: 'tip',
    fields: {
      description: 'text',
      links: 'list',
      images: 'image',
    },
    createdAt: '2023-03-13T08:13:33.055Z',
    updatedAt: '2023-03-13T08:13:33.055Z',
    id: '640edb2de252b234025c5030',
  },
  bugfix: {
    owner: {
      id: '640ec640e252b234025c502d',
      username: 'test',
      name: 'test',
    },
    type: 'bugfix',
    fields: {
      description: 'text',
      links: 'list',
      error: 'editor',
      solution: 'editor',
      images: 'image',
    },
    createdAt: '2023-03-13T08:13:33.055Z',
    updatedAt: '2023-03-13T08:13:33.055Z',
    id: '640edb2de252b234025c5031',
  },
  todo: {
    owner: {
      id: '640ec640e252b234025c502d',
      username: 'test',
      name: 'test',
    },
    type: 'todo',
    fields: {
      todo: 'text',
    },
    createdAt: '2023-03-13T08:13:33.055Z',
    updatedAt: '2023-03-13T08:13:33.055Z',
    id: '640edb2de252b234025c5032',
  },
};
