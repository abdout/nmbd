import Image from "next/image"
import { Button } from "../../ui/button"
import Link from "next/link"
import Editor from "../../editor/ui"
import Toolbar from "../../editor/toolbar"
import { useEditor } from "@tiptap/react"
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import Text from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import { useState } from "react"

export default function CommentSection() {
    const [commentContent, setCommentContent] = useState('')
    
    const editor = useEditor({
        extensions: [
            Document, 
            Paragraph, 
            Text, 
            Bold, 
            Underline, 
            BulletList, 
            ListItem, 
            Heading.configure({
                levels: [1, 2],
            })
        ],
        content: commentContent,
        onUpdate: ({ editor }) => {
            setCommentContent(editor.getHTML());
        },
    })
    
    return (
        <>
            <div className="flex items-start gap-3 mt-8">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center z-20 bg-white relative -mr-6 border-4 border-white">
                    <Image
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=96&h=96&facepad=2"
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="object-cover w-10 h-10 rounded-full"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-2 mt-2.5">
                    <h2 className="text-base font-medium">اضف تعليق</h2>
                    <div className="rounded-md border border-[#e1e8ed]">
                        <div className="bg-muted rounded-sm px-4  flex justify-end items-center">
                            
                            {editor && <Toolbar editor={editor} />}
                        </div>
                        <div className=" py-2">
                            <Editor 
                                value={commentContent} 
                                onChange={setCommentContent}
                                height="h-24"
                                showToolbar={false}
                                className="border-none p-0"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-col items-center gap-2">
                            <Button variant="ghost" size="sm" className="flex font-normal gap-2">
                                <svg width="14" height="14" fill="none" stroke="#57606a" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.071-7.07a4 4 0 00-5.657-5.657l-7.072 7.07a6 6 0 108.485 8.486l6.364-6.364" /></svg>
                                <span className="hidden md:inline">الصق، اسحب، أو انقر لإضافة ملف</span>
                                <span className="inline md:hidden">اضافة ملف</span>
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="w-24">
                                قفل المشكلة
                            </Button>
                            <Button
                                type="submit"
                                className="w-24"
                            >
                                تعليق
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="flex items-center gap-2 mt-6 pr-12 text-xs ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 48 48"><circle cx="24" cy="34.748" r=".75" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M23.975 30.275V12.502" stroke-width="2"/><circle cx="24" cy="24" r="21.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></svg>
                <span>تذكر، يجب أن تتبع المساهمات في هذا المستودع     <span> </span> 
                    <Link href="#" className="text-blue-600 underline">إرشادات المساهمة</Link> 
                    {' و '} 
                    <Link href="#" className="text-blue-600 underline">سياسة الأمان</Link>.
                </span>
            </div> */}
        </>
    )
}
