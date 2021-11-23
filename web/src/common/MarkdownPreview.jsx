import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  previewContainer: {
    display: 'flex',
    width: '100%',
    overflowY: 'auto',
    overflowWrap: 'break-word',
    height: '100%',
  },
  preview: {
    width: '100%',
  },
}));

const MarkdownPreview = ({ text }) => {
  const classes = useStyles();

  return (
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
  );
};

export default MarkdownPreview;
