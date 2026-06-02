import { useEffect } from "react";
import { Box, Divider, IconButton, Stack, Tooltip } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import RedoIcon from "@mui/icons-material/Redo";
import TitleIcon from "@mui/icons-material/Title";
import UndoIcon from "@mui/icons-material/Undo";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 200 }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
      Placeholder.configure({ placeholder: placeholder || "Write the campaign story…" }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync external value changes (e.g. switching between edit dialogs) without
  // fighting user typing or jumping the cursor.
  useEffect(() => {
    if (!editor) return;
    if (editor.isFocused) return; // user is actively typing
    const next = value || "";
    const current = editor.getHTML();
    // Treat tiptap's empty-doc serialization as equivalent to "".
    const isCurrentEmpty = current === "" || current === "<p></p>";
    if (next === current) return;
    if (next === "" && isCurrentEmpty) return;
    editor.commands.setContent(next, false);
  }, [editor, value]);

  if (!editor) return null;

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
      }}
    >
      <Toolbar editor={editor} />
      <Divider />
      <Box
        sx={{
          p: 1.5,
          minHeight,
          "& .ProseMirror": {
            outline: "none",
            minHeight,
          },
          "& .ProseMirror p.is-editor-empty:first-of-type::before": {
            color: "text.disabled",
            content: "attr(data-placeholder)",
            float: "left",
            height: 0,
            pointerEvents: "none",
          },
          "& .ProseMirror h2": { fontSize: "1.35rem", fontWeight: 600, mt: 1.5, mb: 1 },
          "& .ProseMirror h3": { fontSize: "1.15rem", fontWeight: 600, mt: 1.25, mb: 0.75 },
          "& .ProseMirror p": { my: 0.75 },
          "& .ProseMirror ul, & .ProseMirror ol": { pl: 3, my: 0.75 },
          "& .ProseMirror blockquote": {
            borderLeft: 3,
            borderColor: "divider",
            pl: 1.5,
            color: "text.secondary",
            my: 1,
          },
          "& .ProseMirror a": { color: "primary.main", textDecoration: "underline" },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  function promptLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL (leave blank to remove)", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <Stack
      direction="row"
      spacing={0.25}
      sx={{ p: 0.5, flexWrap: "wrap" }}
      role="toolbar"
      aria-label="Formatting"
    >
      <ToolBtn
        title="Heading"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <TitleIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Bold (⌘B)"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FormatBoldIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Italic (⌘I)"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FormatItalicIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Bulleted list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FormatListBulletedIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <FormatListNumberedIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <FormatQuoteIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn title="Link" active={editor.isActive("link")} onClick={promptLink}>
        <LinkIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Remove link"
        disabled={!editor.isActive("link")}
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <LinkOffIcon fontSize="small" />
      </ToolBtn>
      <Box sx={{ flex: 1 }} />
      <ToolBtn
        title="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <UndoIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <RedoIcon fontSize="small" />
      </ToolBtn>
    </Stack>
  );
}

function ToolBtn({
  title,
  onClick,
  active,
  disabled,
  children,
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          sx={{
            color: active ? "primary.main" : "text.secondary",
            bgcolor: active ? "action.selected" : "transparent",
            borderRadius: 1,
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}
