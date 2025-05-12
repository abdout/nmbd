import { MoreHorizontal } from "lucide-react"
import Image from "next/image"

export default function TwitterThread() {
  return (
    <div className="flex justify-center p-4">
      <div className="">
        <div className="flex gap-3">
          {/* Avatar and thread line */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-full rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=96&h=96&facepad=2"
                alt="Avatar"
                width={48}
                height={48}
                className="object-cover w-12 h-12 rounded-full z-10"
              />
            </div>
            <div className=" w-0.5 h-full bg-muted -mt-2"></div>
          </div>

          {/* Tweet content */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[#000000]">محمد علي</span>
                <span className="text-[#666b70]">@companiestools</span>
                <span className="text-[#666b70]">•</span>
                <span className="text-[#666b70]">17 مايو</span>
              </div>
              <button className="text-[#666b70]">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="mt-1 text-[#2d2f32]">
              <p>
                ردًا على <span className="text-[#666b70]">@companiestools</span>
              </p>
            </div>

            <div className="mt-2 text-[#000000] text-xl">
              <p>
                هذا رد على التغريدة الرئيسية. أدخل نص تغريدتك هنا في السلسلة. يمكنك حذف الصورة إذا لم تكن بحاجة إليها :)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
