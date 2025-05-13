declare module '@tiptap/extension-bold';
declare module '@tiptap/extension-document';
declare module '@tiptap/extension-paragraph';
declare module '@tiptap/extension-bullet-list';
declare module '@tiptap/extension-list-item';
declare module '@tiptap/extension-text';
declare module '@tiptap/extension-underline';
declare module '@tiptap/extension-heading';
declare module '@tiptap/core';
declare module '@tiptap/react' {
  import * as React from 'react';
  
  export interface Editor {
    isActive: (name: string, attrs?: Record<string, any>) => boolean;
    chain: () => {
      focus: () => {
        toggleBold: () => { run: () => void };
        toggleUnderline: () => { run: () => void };
        toggleBulletList: () => { run: () => void };
        toggleHeading: (options: { level: number }) => { run: () => void };
      }
    };
    getHTML: () => string;
    commands: {
      setContent: (content: string) => void;
    };
  }
  
  export interface EditorOptions {
    extensions: any[];
    content?: string;
    editorProps?: Record<string, any>;
    onUpdate?: (props: { editor: Editor }) => void;
  }
  
  export function useEditor(options: EditorOptions): Editor | null;
  export const EditorContent: React.FC<{ editor: Editor | null }>;
} 