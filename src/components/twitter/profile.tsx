import Image from "next/image"
import { MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAttachment } from "@/components/onboarding/attachment/action"

export default async function TwitterProfile() {
  const attachment = await getAttachment();
  const profileImage = attachment?.image || "/placeholder.svg?height=128&width=128";

  return (
    <div className="max-w-2xl mx-auto ">
      {/* Banner Image */}
      <div className="relative h-48 w-full">
        <Image
          src=""
          alt="Profile banner"
          fill
          className="object-cover bg-yellow-400"
          priority
        />
      </div>

      {/* Profile Section */}
      <div className="px-5">
        {/* Profile Picture and Edit Button */}
        <div className="flex justify-between items-start">
          <div className="relative -mt-16 border-4 border-background rounded-full h-32 w-32">
            <Image
              src={profileImage}
              alt="Profile picture"
              width={128}
              height={128}
              className="rounded-full object-cover bg-[#f8f3e3]"
              quality={100}
            />
          </div>
          <Button variant="outline" className="mt-4 rounded-full border border-primary hover:bg-[#e8f5fe] hover:bg-opacity-70">
            تعديل
          </Button>
        </div>

        {/* Profile Info */}
        <div className="mt-3 space-y-1">
          <h1 className="text-xl font-bold text-[#0f1419]">Davide Biscuso</h1>
          <p className="text-[#5b7083]">@biscuttu</p>
          <p className="text-[#0f1419] py-2">Product Designer</p>

          <div className="flex flex-wrap gap-x-4 text-[#5b7083] text-sm">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>London</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Joined September 2011</span>
            </div>
          </div>

          <div className="flex gap-5 py-3">
            <div className="flex gap-1">
              <span className="font-bold text-[#0f1419]">569</span>
              <span className="text-[#5b7083]">Following</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold text-[#0f1419]">72</span>
              <span className="text-[#5b7083]">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#ebeef0] mt-3">
        <div className="flex-1 text-center py-3 font-medium text-[#1da1f2] border-b-2 border-[#1da1f2]">Tweets</div>
        <div className="flex-1 text-center py-3 font-medium text-[#5b7083]">Tweets & replies</div>
        <div className="flex-1 text-center py-3 font-medium text-[#5b7083]">Media</div>
        <div className="flex-1 text-center py-3 font-medium text-[#5b7083]">Likes</div>
      </div>
    </div>
  )
}
