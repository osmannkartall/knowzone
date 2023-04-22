import FORM_COMPONENT_TYPES from '../components/form/formComponentTypes';

export const formTypes = [
  {
    type: {
      id: '643f4e7212464edea1c69a8d',
      name: 'tip',
    },
    id: '640edb2de252b234025c5030',
  },
  {
    type: {
      id: '143f4e7212464edea1c69a11',
      name: 'bugfix',
    },
    id: '640edb2de252b234025c5031',
  },
  {
    type: {
      id: '223f4e7212464edea1c69a11',
      name: 'todo',
    },
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
    type: {
      id: '643f4e7212464edea1c69a8d',
      name: 'tip',
    },
    content: {
      description: FORM_COMPONENT_TYPES.TEXT,
      links: FORM_COMPONENT_TYPES.LIST,
      images: FORM_COMPONENT_TYPES.IMAGE,
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
    type: {
      id: '143f4e7212464edea1c69a11',
      name: 'bugfix',
    },
    content: {
      description: FORM_COMPONENT_TYPES.TEXT,
      links: FORM_COMPONENT_TYPES.LIST,
      error: FORM_COMPONENT_TYPES.EDITOR,
      solution: FORM_COMPONENT_TYPES.EDITOR,
      images: FORM_COMPONENT_TYPES.IMAGE,
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
    type: {
      id: '223f4e7212464edea1c69a11',
      name: 'todo',
    },
    content: {
      item: FORM_COMPONENT_TYPES.TEXT,
    },
    createdAt: '2023-03-13T08:13:33.055Z',
    updatedAt: '2023-03-13T08:13:33.055Z',
    id: '640edb2de252b234025c5032',
  },
};
