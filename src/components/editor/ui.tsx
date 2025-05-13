'use client';
import React, { useEffect } from 'react'
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import Text from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import Toolbar from './toolbar'

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  className?: string;
  height?: string;
  showToolbar?: boolean;
  toolbarPosition?: 'top' | 'inline';
}

const Editor: React.FC<EditorProps> = ({ 
  value, 
  onChange, 
  className = '', 
  height = 'h-[30rem] md:h-80',
  showToolbar = true,
  toolbarPosition = 'top'
}) => {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, Bold, Underline, BulletList, ListItem, Heading.configure({
      levels: [1, 2],
    }),],
    editorProps: {
      attributes: {
        class: `border border-gray-300 w-full ${height} p-4 outline-none rounded-none hover:border-gray-300 ${className}`,
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  })

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null
  }

  return (
    <div className='w-full'>
      {showToolbar && toolbarPosition === 'top' && <Toolbar editor={editor} className="mb-2" />}
      <div className="w-full relative">
        {showToolbar && toolbarPosition === 'inline' && (
          <div className="absolute top-2 right-2 z-10">
            <Toolbar editor={editor} />
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default Editor;