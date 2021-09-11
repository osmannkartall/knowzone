import NoteOutlined from '@material-ui/icons/NoteOutlined';
import BugReportOutlined from '@material-ui/icons/BugReportOutlined';

const POST_TYPES = new Map([
  [
    'bugfix',
    {
      value: 'bugfix',
      name: 'Bugfix',
      pluralName: 'Bugfixes',
      icon: <BugReportOutlined />,
      route: 'bugfixes',
    },
  ],
  [
    'tip',
    {
      value: 'tip',
      name: 'Tip',
      pluralName: 'Tips',
      icon: <NoteOutlined />,
      route: 'tips',
    },
  ],
]);

export default POST_TYPES;
