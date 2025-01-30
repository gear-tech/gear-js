import Highlighter from "react-syntax-highlighter";
import { stackoverflowDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

type Props = {
  code: string;
  language: string;
};

export const SyntaxHighlighter = ({ code, language }: Props) => {
  return (
    <Highlighter
      language={language}
      style={stackoverflowDark}
      showLineNumbers
      wrapLongLines
      wrapLines
      lineNumberStyle={{
        color: "rgba(255, 255, 255, 0.32)",
        textAlign: "left",
        paddingRight: "8px",
      }}
      customStyle={{
        padding: 0,
        margin: 0,
        background: "#000",
        overflow: "auto",
      }}
    >
      {code}
    </Highlighter>
  );
};
