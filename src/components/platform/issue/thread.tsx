import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { Button } from "../../ui/button"
import Link from "next/link"
import CommentSection from "./comment"

export default function IssueThread() {
    return (
        <div className="md:p-5">
            <div className="">
                {/* Main tweet */}
                <div className="flex gap-3 w-full">
                    {/* Avatar outside border - visible on medium screens and up */}
                    <div className="hidden md:flex flex-col items-center justify-start">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center z-20 relative -mr-6 border-4">
                            <Image
                                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=96&h=96&facepad=2"
                                alt="Avatar"
                                width={40}
                                height={40}
                                className="object-cover w-12 h-12 rounded-full z-10"
                            />
                        </div>
                    </div>
                    {/* Tweet content with border, full width, no bg or shadow */}
                    <div className="flex-1">
                        <div className="border muted rounded-sm w-full px-4 py-3">
                            <div className="flex items-center justify-between bg-muted rounded-sm px-2 py-1 -mx-4 -mt-3 mb-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {/* Avatar for mobile view only */}
                                    <div className="md:hidden w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                                        <Image
                                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=96&h=96&facepad=2"
                                            alt="Avatar"
                                            width={24}
                                            height={24}
                                            className="object-cover w-6 h-6 rounded-full"
                                        />
                                    </div>
                                    <span className="font-medium text-sm">محمد علي</span>
                                    {/* <span className="text-[#666b70]">@companiestools</span> */}
                                    <span className="text-[#666b70]">•</span>
                                    <span className="text-muted-foreground text-sm">17 مايو</span>
                                </div>
                                <button className="text-[#666b70] flex-shrink-0 ml-2">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                            <div className="mt-2 text-[#000000] text-xl">
                                <p>
                                    هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.

                                    إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل فى كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Label row above the vertical line */}
               
                {/* Vertical line with label icon between tweets */}
                <div className="relative w-full flex flex-col items-end pl-0 pr-0" style={{ height: '80px' }}>
                    <div className="absolute right-[68px] top-0 bottom-0 w-0.5 bg-[#e1e8ed] md:block hidden" style={{ zIndex: 0 }}></div>
                    <div className="absolute md:right-14 right-2 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
                        <span className="bg-muted rounded-full p-1 border border-background flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M20.162 10.926L13.716 4.48a2.5 2.5 0 0 0-1.767-.732h-5.2a3 3 0 0 0-3 3v5.2a2.5 2.5 0 0 0 .731 1.768l6.445 6.446a4 4 0 0 0 5.657 0l1.79-1.79l1.79-1.79a4 4 0 0 0 0-5.657"/><circle cx="7.738" cy="7.738" r="1.277" fill="currentColor" transform="rotate(-45 7.738 7.738)"/></g></svg>
                        </span>
                        <div className="flex items-center justify-center gap-2 w-full">
                            <span className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                                <Image src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=96&h=96&facepad=2" alt="Avatar" width={24} height={24} className="object-cover w-4 h-4 rounded-full" />
                            </span>
                            <span className="font-medium text-sm">محمد علي</span>
                            <span className="text-xs text-[#888]">اضافة</span>
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">area: request</span>
                            <span className="text-xs text-[#888] hidden sm:inline">الاسبوع الفات</span>
                        </div>
                    </div>
                </div>
                {/* Reply tweet */}
                <div className="flex gap-3 w-full">
                    {/* Avatar outside border for reply - visible on medium screens and up */}
                    <div className="hidden md:flex flex-col items-center justify-start">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center z-20 bg-white relative -mr-6 border-4 border-white">
                            <Image
                                src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=96&h=96&facepad=2"
                                alt="Avatar Reply"
                                width={48}
                                height={48}
                                className="object-cover w-12 h-12 rounded-full z-10"
                            />
                        </div>
                    </div>
                    {/* Reply content with border, full width, no bg or shadow */}
                    <div className="flex-1">
                        <div className="border muted rounded-sm w-full px-4 py-3">
                            <div className="flex items-center justify-between bg-muted rounded-sm px-2 py-1 -mx-4 -mt-3 mb-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {/* Avatar for mobile view only */}
                                    <div className="md:hidden w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                                        <Image
                                            src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=96&h=96&facepad=2"
                                            alt="Avatar Reply"
                                            width={24}
                                            height={24}
                                            className="object-cover w-6 h-6 rounded-full"
                                        />
                                    </div>
                                    <span className="font-medium text-sm">سارة أحمد</span>
                                    <span className="text-muted-foreground text-sm">•</span>
                                    <span className="text-muted-foreground text-sm">17 مايو</span>
                                </div>
                                <button className="text-[#666b70] flex-shrink-0 ml-2">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                            <div className="mt-2 text-[#000000] text-xl">
                                <p>
                                    شكرًا على المعلومات المفيدة! هذا مثال على رد مستخدم آخر في سلسلة التغريدات.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Add comment box */}
                <CommentSection />
                {/* File upload and info row (GitHub style, Arabic, with button) */}

                <div className="flex items-center gap-2 mt-6 md:pr-12 pr-2 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 48 48"><circle cx="24" cy="34.748" r=".75" fill="currentColor"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M23.975 30.275V12.502" strokeWidth="2"/><circle cx="24" cy="24" r="21.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                    <span>تذكر، يجب أن تتبع المساهمات في هذا المستودع     
                         <span> </span> 
                        <Link href="#" className="text-blue-600 underline">إرشادات المساهمة</Link> 
                        {' و '} 
                        <Link href="#" className="text-blue-600 underline">سياسة الأمان</Link>.
                    </span>
                </div>
            </div>
        </div>
    )
}
