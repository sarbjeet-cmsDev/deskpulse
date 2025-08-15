"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  forwardRef,
} from "react";
import "react-quill/dist/quill.snow.css";
import "quill-mention/dist/quill.mention.css";
import "./descriptionToolbar.css";
import "highlight.js/styles/atom-one-dark.css";
import hljs from "highlight.js";

import { Quill } from "react-quill-new";
import { Mention, MentionBlot } from "quill-mention";
import QuillEditorWrapper from "@/components/Comment/QuillEditorWrapper";
import UploadService from "@/service/upload.service";
import ImageLightbox from "../ImagePopUp/ImageLightbox";
import AdminUserService, { IUser } from "@/service/adminUser.service";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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
          const img = editor?.root.querySelector(
            `img[src="${imageUrl}"]`
          ) as HTMLImageElement;
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

  const mentionSource = useCallback(
    async (
      searchTerm: string,
      renderList: (items: any[], searchTerm: string) => void
    ) => {
      try {
        const users: IUser[] = await AdminUserService.searchUsers(searchTerm);
        const filteredUsers = users.filter(user =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const list = filteredUsers.map((user) => ({
          id: user._id,
          value: `${user.firstName} ${user.lastName}`,
        }));
        renderList(list, searchTerm);
      } catch (err) {
        console.error("Mention fetch error:", err);
        renderList([], searchTerm);
      }
    },
    []
  );

  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    const hasText = stripHtml(val) !== "";
    const hasImage = /<img\s+[^>]*src=["'][^"']+["']/i.test(val);

    onChange?.(hasText || hasImage ? val : "");
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
      syntax: { hljs },
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["link", "image", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      mention: {
        mentionDenotationChars: ["@"],
        source: mentionSource,
        allowedChars: /^[A-Za-z\s]*$/,
        showDenotationChar: true,
      },
    }),
    []
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        setLightboxImage(target.getAttribute("src"));
        setLightboxOpen(true);
      }
    };

    wrapper.addEventListener("click", handleClick);
    return () => wrapper.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="md:p-4 bg-white md:border rounded">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title}
        {/* <span className="text-red-500">*</span> */}
      </label>
      <div
        ref={wrapperRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`quill-wrapper commentSection relative ${isFocused ? "show-toolbar" : ""}`}
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
      {lightboxOpen && lightboxImage && (
        <ImageLightbox
          open={lightboxOpen}
          imageUrl={lightboxImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default DescriptionInputToolbar;
