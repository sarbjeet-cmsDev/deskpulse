"use client";

import React, { forwardRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const QuillEditorWrapper = forwardRef((props: any, ref: any) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).hljs = hljs;
    }
  }, []);
  return <ReactQuill {...props} ref={ref} />;
});

QuillEditorWrapper.displayName = "QuillEditorWrapper";

export default QuillEditorWrapper;

