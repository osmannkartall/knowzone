import { useState } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { GRAY3, GRAY4 } from '../constants/colors';
import MarkdownPreview from './MarkdownPreview';

const TITLE_HEIGHT = 30;
const OPTION_BUTTON_HEIGHT = 20;

const useStyles = makeStyles((theme) => ({
  optionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    border: `1px solid ${GRAY3}`,
    borderBottom: 'none',
    borderRadius: '10px 10px 0 0',
  },
  optionButton: {
    height: OPTION_BUTTON_HEIGHT,
    width: 130,
    marginRight: theme.spacing(2),
    marginTop: `calc(${(TITLE_HEIGHT - OPTION_BUTTON_HEIGHT) / 2}px)`,
    marginBottom: `calc(${(TITLE_HEIGHT - OPTION_BUTTON_HEIGHT) / 2}px)`,
    fontSize: 12,
  },
  container: {
    display: 'flex',
    maxHeight: (props) => `calc(${props.containerMaxHeight} - ${TITLE_HEIGHT}px)`,
    border: `1px solid ${GRAY3}`,
  },
  editorOuterContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  editorContainer: {
    display: 'flex',
    overflowWrap: 'break-word',
    height: (props) => `calc(${props.containerMaxHeight} - ${TITLE_HEIGHT}px)`,
  },
  editor: {
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
  previewOuterContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflowY: 'auto',
    overflowWrap: 'break-word',
    height: (props) => `calc(${props.containerMaxHeight} - ${TITLE_HEIGHT}px)`,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: `${TITLE_HEIGHT}px`,
    borderBottom: `1px solid ${GRAY3}`,
    paddingLeft: theme.spacing(1),
    backgroundColor: GRAY4,
  },
}));

const MarkdownEditor = ({ text, onChangeText, containerMaxHeight }) => {
  const [showEditor, setShowEditor] = useState(true);
  const classes = useStyles({ containerMaxHeight });

  return (
    <>
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
    </>
  );
};

MarkdownEditor.defaultProps = {
  containerMaxHeight: '90vh',
};

export default MarkdownEditor;
