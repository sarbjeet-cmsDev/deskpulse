"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import "quill-mention/dist/quill.mention.css";
import "./commentSection.css";

import { Quill } from "react-quill-new";
import { Mention, MentionBlot } from "quill-mention";
import AdminUserService, { IUser } from "@/service/adminUser.service";
import CommentService from "@/service/comment.service";
import { Button } from "@/components/Form/Button";
import QuillEditorWrapper from "./QuillEditorWrapper";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
}: CommentInputProps) {
  const [content, setContent] = useState<string | undefined>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quillRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.user.data);
  console.log(user, "useruseruser");
  useEffect(() => {
    if (isEditing && defaultValue) {
      setContent(defaultValue); // contains HTML with mention spans
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

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection(true);
        editor?.insertEmbed(range.index, "image", base64);
        editor?.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    };
  };

  const mentionSource = useCallback(
    async (
      searchTerm: string,
      renderList: (items: any[], searchTerm: string) => void
    ) => {
      try {
        const users: IUser[] = await AdminUserService.searchUsers(searchTerm);
        const list = users.map((user) => ({
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
      mention: {
        mentionDenotationChars: ["@"],
        source: mentionSource,
        allowedChars: /^[A-Za-z\s]*$/,
        showDenotationChar: true,
      },
    }),
    []
  );

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

  return (
    <div className={`p-4 bg-white border rounded ${inline ? "mt-6" : ""}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Comment <span className="text-red-500">*</span>
      </label>

      <div
        ref={wrapperRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="quill-wrapper relative"
      >
        <QuillEditorWrapper
          ref={quillRef}
          value={content}
          onChange={(val: string) => {
            setContent(val);
            setError(null);
          }}
          theme="snow"
          placeholder="Write your comment with @mention and image..."
          modules={modules}
        />
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <Button variant="light" onPress={onCancel} className="px-4">
            Cancel
          </Button>
        )}
        <Button
          onPress={isEditing ? handleEdit : handleCreate}
          disabled={loading}
        >
          {isEditing ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
}
