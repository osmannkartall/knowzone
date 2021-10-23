import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { makeStyles, Button } from '@material-ui/core';
import { GRAY3, GRAY4 } from '../constants/colors';

const TITLE_HEIGHT = 30;
const OPTION_BUTTON_HEIGHT = 20;
const CONTAINER_MAX_HEIGHT = '90vh';

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
    maxHeight: `calc(${CONTAINER_MAX_HEIGHT} - ${TITLE_HEIGHT}px)`,
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
    height: `calc(${CONTAINER_MAX_HEIGHT} - ${TITLE_HEIGHT}px)`,
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
    height: `calc(${CONTAINER_MAX_HEIGHT} - ${TITLE_HEIGHT}px)`,
  },
  previewContainer: {
    display: 'flex',
    width: '100%',
    overflowY: 'auto',
    overflowWrap: 'break-word',
    height: `calc(${CONTAINER_MAX_HEIGHT} - ${TITLE_HEIGHT}px)`,
  },
  preview: {
    width: '100%',
    padding: theme.spacing(0, 1),
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

const MarkdownEditor = ({ text, onChangeText }) => {
  const [options, setOptions] = useState({ showEditor: true, showPreview: true });
  const classes = useStyles();

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
                  defaultValue={text}
                  className={classes.editor}
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
              <div className={classes.previewContainer}>
                <ReactMarkdown
                  className={classes.preview}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={a11yDark}
                          language={match[1]}
                          PreTag="div"
                          showLineNumbers
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {text}
                </ReactMarkdown>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
};

export default MarkdownEditor;
