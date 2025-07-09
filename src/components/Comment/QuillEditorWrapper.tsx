"use client";

import React, { forwardRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const QuillEditorWrapper = forwardRef((props: any, ref: any) => {
  return <ReactQuill {...props} ref={ref} />;
});

QuillEditorWrapper.displayName = "QuillEditorWrapper";

export default QuillEditorWrapper;
