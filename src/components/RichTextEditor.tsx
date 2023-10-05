import dynamic from "next/dynamic";
import React, { useState } from "react";
//import ReactQuill from "react-quill";
const ReactQuill = dynamic(import('react-quill'), { ssr: false })

interface RichTextEditorProps {
  onChange?: (content: any) => void
  value?: any
}

export const RichTextEditor = ({ onChange, value }: RichTextEditorProps) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }]
    ]
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font"
  ];

  //const [code, setCode] = useState(value);
  const handleProcedureContentChange = (content: any, delta: any, source: any, editor: any) => {
    //setCode(content);
    onChange && onChange(content)
  };

  return (
    <div className="bg-white text-black w-full">
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={handleProcedureContentChange}
        placeholder="Enter a description"
        className="w-full min-h-[200px]"
      />
    </div>
  );
}


