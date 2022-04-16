import { useState, useEffect } from "react";

import dynamic from "next/dynamic";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { ICommand } from "@uiw/react-md-editor";

type MarkdownEditorProps = {
  value: string;
  onChange?: (editor: any, data: any, value: string) => void;
  onHeightChange?: (height: number) => void;
  commands?: ICommand[];
  height?: number;
  visiableDragbar?: boolean;
  minHeights?: number;
  maxHeight?: number;
  fullscreen?: boolean;
};

// @ts-ignore
const MarkdownEditor = dynamic<MarkdownEditorProps>(
  // @ts-ignore
  () => import("@uiw/react-markdown-editor"),
  {
    ssr: false,
  }
);

type MarkdownEditorComponentProps = {
  onChange?: (value: string) => void;
};

export const MarkdownEditorComponent = ({
  onChange,
}: MarkdownEditorComponentProps) => {
  const [markdown, setMarkdown] = useState("");
  return (
    <div>
      {/* @ts-ignore */}
      <MarkdownEditor
        height={200}
        // minHeights={200}
        // fullscreen={true}
        // visiableDragbar={true}
        value={markdown}
        onChange={(editor, data, value) => {
          setMarkdown(value);
          onChange(value);
        }}
      />
    </div>
  );
};
