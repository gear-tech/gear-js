import ReactHighlighter, { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { stackoverflowDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Highlighter = ReactHighlighter as any as React.FC<SyntaxHighlighterProps>;

type Props = {
  code: string;
  language: string;
};

const SyntaxHighlighter = ({ code, language }: Props) => {
  return (
    <Highlighter
      language={language}
      style={stackoverflowDark}
      showLineNumbers
      wrapLongLines
      wrapLines
      lineNumberStyle={{
        color: 'rgba(255, 255, 255, 0.32)',
        textAlign: 'left',
        paddingRight: '8px',
      }}
      customStyle={{
        padding: 0,
        margin: 0,
        background: '#000',
        overflow: 'auto',
      }}>
      {code}
    </Highlighter>
  );
};

export { SyntaxHighlighter };
