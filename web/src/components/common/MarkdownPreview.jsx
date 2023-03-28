import ReactMarkdown from 'react-markdown';
import { styled } from '@mui/material/styles';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PREFIX = 'MarkdownPreview';

const classes = {
  previewContainer: `${PREFIX}-previewContainer`,
  preview: `${PREFIX}-preview`,
};

const Root = styled('div')(() => ({
  [`&.${classes.previewContainer}`]: {
    display: 'flex',
    width: '100%',
    overflowY: 'auto',
    overflowWrap: 'break-word',
    height: '100%',
  },

  [`& .${classes.preview}`]: {
    width: '100%',
  },
}));

function MarkdownPreview({ text }) {
  return (
    <Root className={classes.previewContainer}>
      <ReactMarkdown
        className={classes.preview}
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line react/no-unstable-nested-components
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
    </Root>
  );
}

export default MarkdownPreview;
