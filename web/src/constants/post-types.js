import NoteOutlined from '@material-ui/icons/NoteOutlined';
import BugReportOutlined from '@material-ui/icons/BugReportOutlined';

const POST_TYPES = new Map([
  [
    'bugFix',
    {
      value: 'bugFix',
      name: 'Bug Fix',
      pluralName: 'Bug Fixes',
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
