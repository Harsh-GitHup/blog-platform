// components/Editor.tsx
"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
    Bold, Italic, List, ListOrdered, Quote,
    Heading1, Heading2, Code, Undo, Redo
} from 'lucide-react'

interface EditorProps {
    onChange: (content: string) => void
    initialContent?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null

    const btnClass = (active: boolean) =>
        `p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition ${active ? 'bg-blue-100 text-blue-600 dark:bg-blue-900' : ''}`

    return (
        <div className="border-b dark:border-gray-800 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-900 rounded-t-xl">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}><Heading1 size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}><List size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}><ListOrdered size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}><Quote size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive('codeBlock'))}><Code size={18} /></button>
            <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-700 mx-1 self-center" />
            <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)}><Undo size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)}><Redo size={18} /></button>
        </div>
    )
}

export default function Editor({ onChange, initialContent }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Image,
        ],
        content: initialContent || '',
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none',
            },
        },
    })

    return (
        <div className="border dark:border-gray-800 rounded-xl overflow-hidden focus-within:ring-2 ring-blue-500/20 transition-all">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}