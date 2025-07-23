"use client";

import { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from "react";
import "react-quill/dist/quill.snow.css";
import "quill-mention/dist/quill.mention.css";
import "./descriptionToolbar.css";

import { Quill } from "react-quill-new";
import { Mention, MentionBlot } from "quill-mention";
import QuillEditorWrapper from "@/components/Comment/QuillEditorWrapper";
import UploadService from "@/service/upload.service";

if (
  typeof window !== "undefined" &&
  typeof Quill?.import === "function" &&
  !Quill.imports?.["formats/mention"]
) {
  Quill.register(MentionBlot);
  Quill.register("modules/mention", Mention);
}

interface CommentInputSectionProps {
  title?: string;
  value?: string;
  onChange?: (value: string) => void;
  isButton?: boolean;
}

const DescriptionInputToolbar = ({
  title = "Description",
  value = "",
  onChange,
  isButton = false,
}: CommentInputSectionProps) => {
  const [content, setContent] = useState<string>(value || "");
   const [isFocused, setIsFocused] = useState<boolean>(false);
   const [loading, setLoading] = useState(false);
    const quillRef = useRef<any>(null);
   const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined && value !== content) {
      setContent(value);
    }
  }, [value]);

    const imageHandler = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
  
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
  
        try {
     
        setLoading(true);
        const imageUrl = await UploadService.uploadImageForQuill(file);
  
        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection(true);
        editor?.insertEmbed(range.index, "image", imageUrl);
        setTimeout(() => {
          const img = editor?.root.querySelector(`img[src="${imageUrl}"]`) as HTMLImageElement;
          if (img) {
            img.style.width = "200px"; 
            img.style.maxWidth = "50%"; 
          }
        }, 0);
        editor?.setSelection(range.index + 1);
      } catch (error) {
        console.error("Image upload failed:", error);
        // setError("Failed to upload image");
      } finally {
        setLoading(false);
      }
      };
    };

  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    const cleanVal = stripHtml(val) ? val : "";
    onChange?.(cleanVal);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent) => {
    // Close toolbar if focus is outside wrapper
    if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
      setIsFocused(false);
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["link", "image"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  return (
    <div className="p-4 bg-white border rounded">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title} 
        {/* <span className="text-red-500">*</span> */}
      </label>
<div
        ref={wrapperRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`quill-wrapper relative ${isFocused ? "show-toolbar" : ""}`}
      >
      <QuillEditorWrapper
        ref={quillRef}
        value={content}
        onChange={handleContentChange}
        placeholder={`Write your ${title} here...`}
        modules={modules}
        theme="snow"
        className="description-content"
      />
    </div>
    </div>
  );
};

export default DescriptionInputToolbar;
