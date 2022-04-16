import { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownDisplayProps = {
  url: string;
};

export const MarkdownDisplay = ({ url }: MarkdownDisplayProps) => {
  // console.log("url", url);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (url) {
      const fetchData = async () => {
        try {
          await fetch(url)
            .then((res) => res.json())
            .then((data) => {
              console.log("data", data);
              setContent(data?.data?.message.body || data.content);
            });
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [url]);

  return (
    <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
};
