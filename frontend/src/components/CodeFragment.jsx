import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { useState } from "react";

const CodeFragment = ({ text, language = "js" }) => {
  const [copied, setCopied] = useState(false);

  const markdownScript = `\`\`\`${language} ${text} \`\`\``;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
    }
  };

  return (
    <div className="relative text-left my-1 pb-5 pr-5 prose-code:rounded-lg min-w-full prose-code:text-sm">
      <button
        onClick={handleCopy}
        className="absolute cursor-pointer top-2 right-7 bg-gray-700 text-white text-xs px-2 py-1 rounded hover:bg-gray-600 transition"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <ReactMarkdown rehypePlugins={rehypeHighlight}>
        {markdownScript}
      </ReactMarkdown>
    </div>
  );
};

export default CodeFragment;
