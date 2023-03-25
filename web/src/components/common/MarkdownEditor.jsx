import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { GRAY3, GRAY4 } from '../../constants/colors';
import MarkdownPreview from './MarkdownPreview';

const TITLE_HEIGHT = 30;
const OPTION_BUTTON_HEIGHT = 20;

const PREFIX = 'MarkdownEditor';

const classes = {
  optionContainer: `${PREFIX}-optionContainer`,
  optionButton: `${PREFIX}-optionButton`,
  container: `${PREFIX}-container`,
  editorOuterContainer: `${PREFIX}-editorOuterContainer`,
  editorContainer: `${PREFIX}-editorContainer`,
  editor: `${PREFIX}-editor`,
  previewOuterContainer: `${PREFIX}-previewOuterContainer`,
  title: `${PREFIX}-title`,
};

const Root = styled('div')(({ theme, $containerMaxHeight }) => ({
  [`& .${classes.optionContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    border: `1px solid ${GRAY3}`,
    borderBottom: 'none',
    borderRadius: '10px 10px 0 0',
  },

  [`& .${classes.optionButton}`]: {
    height: OPTION_BUTTON_HEIGHT,
    width: 130,
    marginRight: theme.spacing(2),
    marginTop: `calc(${(TITLE_HEIGHT - OPTION_BUTTON_HEIGHT) / 2}px)`,
    marginBottom: `calc(${(TITLE_HEIGHT - OPTION_BUTTON_HEIGHT) / 2}px)`,
    fontSize: 12,
  },

  [`& .${classes.container}`]: {
    display: 'flex',
    maxHeight: `calc(${$containerMaxHeight} - ${TITLE_HEIGHT}px)`,
    border: `1px solid ${GRAY3}`,
  },

  [`& .${classes.editorOuterContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },

  [`& .${classes.editorContainer}`]: {
    display: 'flex',
    overflowWrap: 'break-word',
    height: `calc(${$containerMaxHeight} - ${TITLE_HEIGHT}px)`,
  },

  [`& .${classes.editor}`]: {
    display: 'flex',
    width: '100%',
    resize: 'none',
    border: 'none',
    fontSize: 17,
    '&:focus': {
      outline: 'none',
    },
    padding: theme.spacing(1),
  },

  [`& .${classes.previewOuterContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflowY: 'auto',
    overflowWrap: 'break-word',
    height: `calc(${$containerMaxHeight} - ${TITLE_HEIGHT}px)`,
  },

  [`& .${classes.title}`]: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: `${TITLE_HEIGHT}px`,
    borderBottom: `1px solid ${GRAY3}`,
    paddingLeft: theme.spacing(1),
    backgroundColor: GRAY4,
  },
}));

function MarkdownEditor({ id, text, onChangeText, containerMaxHeight }) {
  const [showEditor, setShowEditor] = useState(true);

  return (
    <Root $containerMaxHeight={containerMaxHeight}>
      <div className={classes.optionContainer}>
        <Button
          type="button"
          variant="outlined"
          className={classes.optionButton}
          onClick={() => setShowEditor(!showEditor)}
          disabled={showEditor}
        >
          Show Editor
        </Button>
        <Button
          type="button"
          variant="outlined"
          className={classes.optionButton}
          onClick={() => setShowEditor(!showEditor)}
          disabled={!showEditor}
        >
          Show Preview
        </Button>
      </div>
      <div className={classes.container}>
        {
          showEditor ? (
            <div className={classes.editorOuterContainer}>
              <div className={classes.title}>
                Editor
              </div>
              <div className={classes.editorContainer}>
                <textarea
                  id={id}
                  className={classes.editor}
                  value={text}
                  onChange={(e) => onChangeText(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className={classes.previewOuterContainer}>
              <div className={classes.title}>
                Preview
              </div>
              <MarkdownPreview text={text} />
            </div>
          )
        }
      </div>
    </Root>
  );
}

MarkdownEditor.defaultProps = {
  containerMaxHeight: '90vh',
};

export default MarkdownEditor;
