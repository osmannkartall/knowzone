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
  const [options, setOptions] = useState({ showEditor: true, showPreview: true });
  const classes = useStyles({ containerMaxHeight });

  const changeOptionValue = (key, value) => {
    setOptions((prevState) => ({ ...prevState, [key]: value }));
  };

  const editorButtonTitle = `${options.showEditor ? 'Hide' : 'Show'} Editor`;
  const previewButtonTitle = `${options.showPreview ? 'Hide' : 'Show'} Preview`;
  const borderRightStyle = options.showEditor && options.showPreview ? `1px solid ${GRAY3}` : 'none';

  return (
    <>
      <div className={classes.optionContainer}>
        <Button
          type="button"
          variant="outlined"
          className={classes.optionButton}
          onClick={() => changeOptionValue('showEditor', !options.showEditor)}
          disabled={!options.showPreview}
        >
          {editorButtonTitle}
        </Button>
        <Button
          type="button"
          variant="outlined"
          className={classes.optionButton}
          onClick={() => changeOptionValue('showPreview', !options.showPreview)}
          disabled={!options.showEditor}
        >
          {previewButtonTitle}
        </Button>
      </div>
      <div className={classes.container}>
        {
          options.showEditor && (
            <div className={classes.editorOuterContainer}>
              <div className={classes.title} style={{ borderRight: borderRightStyle }}>
                Editor
              </div>
              <div className={classes.editorContainer} style={{ borderRight: borderRightStyle }}>
                <textarea
                  className={classes.editor}
                  value={text}
                  onChange={(e) => onChangeText(e.target.value)}
                />
              </div>
            </div>
          )
        }
        {
          options.showPreview && (
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
