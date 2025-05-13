import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { Button } from "../ui/button"

export default function TwitterThread() {
    return (
        <div className="p-5">
            <div className="">
                {/* Main tweet */}
                <div className="flex gap-3 mb-4 w-full">
                    {/* Avatar outside border */}
                    <div className="flex flex-col items-center justify-start">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center z-20 bg-white relative -mr-6 border-4 border-white">
                            <Image
                                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=96&h=96&facepad=2"
                                alt="Avatar"
                                width={48}
                                height={48}
                                className="object-cover w-12 h-12 rounded-full z-10"
                            />
                        </div>
                    </div>
                    {/* Tweet content with border, full width, no bg or shadow */}
                    <div className="flex-1">
                        <div className="border muted rounded-sm w-full px-4 py-3">
                            <div className="flex items-center justify-between bg-muted rounded-sm px-2 py-1 -mx-4 -mt-3 mb-2">
                                <div className="flex items-center gap-1 min-w-0 flex-1">
                                    <span className="font-bold text-[#000000]">محمد علي</span>
                                    <span className="text-[#666b70]">@companiestools</span>
                                    <span className="text-[#666b70]">•</span>
                                    <span className="text-[#666b70]">17 مايو</span>
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
                {/* Vertical line with label icon between tweets */}
                <div className="relative w-full flex flex-col items-start pr-16" style={{ height: '48px' }}>
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#e1e8ed]" style={{ zIndex: 0 }}></div>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 border border-[#e1e8ed] flex items-center justify-center">
                        <svg width="18" height="18" fill="none" stroke="#57606a" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 7a5 5 0 01-7.07 7.07l-4-4A5 5 0 0117 7z"/><path d="M6.5 6.5l7 7"/></svg>
                    </div>
                </div>
                {/* Reply tweet */}
                <div className="flex gap-3 mt-6 ml-8 w-full">
                    {/* Avatar outside border for reply */}
                    <div className="flex flex-col items-center justify-start">
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
                                <div className="flex items-center gap-1 min-w-0 flex-1">
                                    <span className="font-bold text-[#000000]">سارة أحمد</span>
                                    <span className="text-[#666b70]">@sarah_ahmed</span>
                                    <span className="text-[#666b70]">•</span>
                                    <span className="text-[#666b70]">17 مايو</span>
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
                <div className="flex items-start gap-3 mt-8">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                        <Image
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=96&h=96&facepad=2"
                            alt="Avatar"
                            width={40}
                            height={40}
                            className="object-cover w-10 h-10 rounded-full"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <form className="bg-[#f7f9fa] rounded-md px-4 py-2 border border-[#e1e8ed]">
                            <textarea
                                placeholder="أضف تعليقًا..."
                                className="w-full bg-transparent outline-none text-[#2d2f32] placeholder-[#888] h-20 resize-none rounded-md"
                            />
                        </form>
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex flex-col items-center gap-2">
                            
                            <Button  variant="ghost" size="sm" className="flex font-normal gap-2">
                            <svg width="14" height="14" fill="none" stroke="#57606a" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.071-7.07a4 4 0 00-5.657-5.657l-7.072 7.07a6 6 0 108.485 8.486l6.364-6.364" /></svg>
                                الصق، اسحب، أو انقر لإضافة ملفات
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
                {/* File upload and info row (GitHub style, Arabic, with button) */}

                <div className="flex items-center gap-2 mt-3 text-xs text-[#57606a]">
                    <svg width="16" height="16" fill="none" stroke="#57606a" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#57606a" strokeWidth="1.5" fill="none" /><path d="M12 8v4l2 2" stroke="#57606a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span>Remember, contributions to this repository should follow its <a href="#" className="text-blue-600 underline">contributing guidelines</a> and <a href="#" className="text-blue-600 underline">security policy</a>.</span>
                </div>
            </div>
        </div>
    )
}
