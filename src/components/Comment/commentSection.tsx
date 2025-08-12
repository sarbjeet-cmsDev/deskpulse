"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import "quill-mention/dist/quill.mention.css";
import "./commentSection.css";
import "highlight.js/styles/atom-one-dark.css";

// import "@/utils/quill-config";
import hljs from "highlight.js";

import { Quill } from "react-quill-new";
import { Mention, MentionBlot } from "quill-mention";
import AdminUserService, { IUser } from "@/service/adminUser.service";
import CommentService from "@/service/comment.service";
import { Button } from "@/components/Form/Button";
import QuillEditorWrapper from "./QuillEditorWrapper";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import UploadService from "@/service/upload.service";
import ImageLightbox from "../common/ImagePopUp/ImageLightbox";

if (
  typeof window !== "undefined" &&
  typeof Quill?.import === "function" &&
  !Quill.imports?.["formats/mention"]
) {
  Quill.register(MentionBlot);
  Quill.register("modules/mention", Mention);
}

interface CommentInputProps {
  taskId: string;
  createdBy?: string;
  onCommentCreated: () => void;
  onCancel?: () => void;
  inline: boolean;
  isEditing?: boolean;
  defaultValue?: string;
  parent_comment?: string;
  commentId?: string;
  title?: any;
  isButton?: any;
  code:string;
}

export default function CommentInputSection({
  taskId,
  onCommentCreated,
  onCancel,
  inline = false,
  isEditing,
  defaultValue,
  parent_comment,
  commentId,
  title,
  onClick,
  isButton,
  code,
}: any) {
  const [content, setContent] = useState<string | undefined>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quillRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const user: any = useSelector((state: RootState) => state.user.data);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);


  useEffect(() => {
    if (isEditing && defaultValue) {
      setContent(defaultValue);
    }
  }, [defaultValue, isEditing]);

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
        setError("Failed to upload image");
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

  function cleanQuillHtml(html: string) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    temp.querySelectorAll("select.ql-code-block-language").forEach(el => el.remove());

    return temp.innerHTML;
  }


  const extractMentionedUserIds = (html: string): string[] => {
    const parser = document.createElement("div");
    parser.innerHTML = html;

    return Array.from(parser.querySelectorAll("span.mention"))
      .map((el) => el.getAttribute("data-id"))
      .filter(Boolean) as string[];
  };

  const handleCreate = async () => {
    const editor = quillRef.current?.getEditor();
    const html = editor?.root.innerHTML || "";

    // html = cleanQuillHtml(html);

    if (!html || stripHtml(html) === "") {
      setError("Comment is required");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const mentionedUserIds = extractMentionedUserIds(html);
      if (!user?._id) {
        throw new Error("User ID is required to create a comment.");
      }
      const payload = {
        content: html,
        task: taskId,
        created_by: user?._id,
        mentioned: mentionedUserIds,
        parent_comment: parent_comment,
        code:code,
      };

      await CommentService.createComment(payload);
      setContent("");
      onCommentCreated();
      if (onCancel) onCancel();
    } catch (err) {
      console.error("Create comment failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!commentId) return;

    const editor = quillRef.current?.getEditor();
    const html = editor?.root.innerHTML || "";

    // html = cleanQuillHtml(html);

    if (!html || stripHtml(html) === "") {
      setError("Comment is required");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await CommentService.updateComment(commentId, { content: html });
      onCommentCreated();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
  }

  const handleFocus = () => {
    wrapperRef.current?.classList.add("show-toolbar");
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
      wrapperRef.current?.classList.remove("show-toolbar");
    }
  };
  const handleExternalSubmit = async () => {
    const editor = quillRef.current?.getEditor();
    const html = editor?.root.innerHTML || "";

    // if (!html || stripHtml(html) === "") {
    //   setError("Description is required");
    //   return;
    // }

    try {
      setLoading(true);
      await onClick(html);
    } catch (err: any) {
      console.error("Failed to update description:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (content) {
      setTimeout(() => {
        hljs.highlightAll();
      }, 0);
    }
  }, [content]);

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
    <div className={`p-4 bg-white border rounded ${inline ? "mt-6" : ""}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title ? title : "Comment"} <span className="text-red-500">*</span>
      </label>

      {/* {defaultValue && !isEditing ? (
      <DescriptionView html={defaultValue} maxLines={4} />
    ) : ( */}

      <div
        ref={wrapperRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="quill-wrapper relative commentSection"
      >
        <QuillEditorWrapper
          ref={quillRef}
          value={content}
          onChange={(val: string) => {
            setContent(val);
            setError(null);
          }}
          theme="snow"
          placeholder={`${title}`}
          modules={modules}
          className="description-content"
        />
      </div>

      {/* )} */}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <Button variant="light" onPress={onCancel} className="px-4">
            Cancel
          </Button>
        )}

        {isButton === true ? (
          <Button
            onPress={() => {
              if (onClick) {
                if (title !== "Description") {
                  if (!content || stripHtml(content) === "") {
                    setError(`${title} is required`);
                    return;
                  }
                }
                setLoading(true);
                onClick(content)
                  .then(() => setLoading(false))
                  .catch((err: any) => {
                    console.error("Failed to update description:", err);
                    setLoading(false);
                  });
              } else if (isEditing) {
                handleEdit();
              } else {
                handleCreate();
              }
            }}
            disabled={loading}
            className="btn-primary"
          >
            {isEditing ? "Update" : "Save"}
          </Button>
        ) : null}
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
}
