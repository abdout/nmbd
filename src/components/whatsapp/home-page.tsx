import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, Heart, MessageCircle, Mic, Phone, Plus, Search, Smile, Video } from "lucide-react"

export default function WhatsAppDesktop() {
  return (
    <div className="flex h-screen w-full bg-[#f5fafc] overflow-hidden" dir="rtl">
      <div className="flex flex-col w-full max-w-6xl mx-auto my-4 bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-80 border-r flex flex-col">
            {/* Search */}
            <div className="p-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pr-10 bg-[#f7f7fc] border-0 rounded-full text-sm text-right"
                  placeholder="ابحث أو ابدأ محادثة جديدة"
                />
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="favourites" className="w-full" dir="rtl">
              <TabsList className="w-full grid grid-cols-3 bg-transparent h-auto p-0 text-right" dir="rtl">
                <TabsTrigger
                  value="favourites"
                  className="data-[state=active]:bg-[#128c7e] data-[state=active]:text-white rounded-none py-2"
                >
                  المفضلة
                </TabsTrigger>
                <TabsTrigger
                  value="friends"
                  className="data-[state=active]:bg-[#128c7e] data-[state=active]:text-white rounded-none py-2"
                >
                  الأصدقاء
                </TabsTrigger>
                <TabsTrigger
                  value="groups"
                  className="data-[state=active]:bg-[#128c7e] data-[state=active]:text-white rounded-none py-2"
                >
                  المجموعات
                </TabsTrigger>
              </TabsList>

              <TabsContent value="favourites" className="m-0 overflow-y-auto h-[calc(100vh-180px)] text-right" dir="rtl">
                <div className="divide-y">
                  <ChatItem
                    name="محمد النور"
                    message="والله يا زول ضحكتني"
                    time="٠٥:١٤ م"
                    avatarSrc="/placeholder.svg?height=48&width=48"
                    bgColor="#feecdc"
                  />
                  <ChatItem
                    name="أحمد الطيب"
                    message="ياخي الموضوع دا خوفني شديد 😅"
                    time="٠٧:٣٨ ص"
                    avatarSrc="/placeholder.svg?height=48&width=48"
                    isActive={true}
                    isRead={true}
                    bgColor="#d1e4e8"
                  />
                  <ChatItem
                    name="مأمون إدريس"
                    message="تمام كدا!"
                    time="١١:٤٩ م"
                    avatarSrc="/placeholder.svg?height=48&width=48"
                    unreadCount="5+"
                    bgColor="#feecdc"
                  />
                  <ChatItem
                    name="خالد دفع الله"
                    message="يا سلام، الحاصل دا عجيب..."
                    time="٠٧:٤٠ ص"
                    avatarSrc="/placeholder.svg?height=48&width=48"
                    unreadCount="1"
                    bgColor="#9393c1"
                  />
                  <ChatItem
                    name="مصطفى عبد الرحمن"
                    message="ياخ"
                    time="٠٨:٢٠ م"
                    avatarSrc="/placeholder.svg?height=48&width=48"
                    unreadCount="1"
                    bgColor="#feecdc"
                  />
                  <ChatItem
                    name="علي حسن"
                    message="جاييك بعد شويه"
                    time=""
                    avatarSrc="/placeholder.svg?height=48&width=48"
                    isTyping={true}
                    bgColor="#feecdc"
                  />
                </div>
              </TabsContent>
              <TabsContent value="friends" className="m-0 text-right" dir="rtl">
                <div className="p-4 text-right text-gray-500">قائمة الأصدقاء</div>
              </TabsContent>
              <TabsContent value="groups" className="m-0 text-right" dir="rtl">
                <div className="p-4 text-right text-gray-500">قائمة المجموعات</div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="أحمد الطيب" />
                  <AvatarFallback>أط</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    أحمد الطيب
                    <Heart className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#62c554] rounded-full"></span>
                    متصل
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Phone className="w-5 h-5 text-[#128c7e]" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Video className="w-5 h-5 text-[#128c7e]" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Encryption Notice */}
              <div className="bg-[#feecdc] rounded-lg p-3 text-xs text-[#0b3048] flex items-start">
                <div className="mr-2 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 11H5V21H19V11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 7V11H7V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  الرسائل دي مأمنة شديد، ما في زول غيرنا بقدر يشوفها ولا حتى واتساب ذاتو. اضغط لو داير تعرف أكتر.
                </div>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 gap-2 max-w-xs">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  width={150}
                  height={150}
                  alt="صورة"
                  className="rounded-lg object-cover w-full h-full"
                />
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  width={150}
                  height={150}
                  alt="صورة"
                  className="rounded-lg object-cover w-full h-full"
                />
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  width={150}
                  height={150}
                  alt="صورة"
                  className="rounded-lg object-cover w-full h-full"
                />
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=150&width=150"
                    width={150}
                    height={150}
                    alt="صورة"
                    className="rounded-lg object-cover w-full h-full brightness-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-xl">
                    +١٥
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col max-w-xs">
                <div className="text-sm">دي الصور القلت ليك عليها. 😊</div>
              </div>

              {/* Voice Message */}
              <div className="flex items-center space-x-2 max-w-xs">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-[#128c7e] border-0 text-white">
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-4">
                      <svg width="12" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                        <rect x="14" y="4" width="4" height="16" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </Button>
                <div className="text-xs text-gray-500">٠١:١٥</div>
                <div className="flex-1">
                  <div className="h-5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gray-300 flex items-center">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-1 w-1 mx-0.5 bg-gray-400 rounded-full"
                          style={{
                            height: `${Math.random() * 16 + 4}px`,
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">٠١:١٥</div>
              </div>

              <div className="text-xs text-gray-500">قبل ٣ يوم</div>

              {/* Received Message */}
              <div className="flex justify-end">
                <div className="bg-[#d7f8f4] text-[#0b3048] p-3 rounded-lg max-w-xs">
                  تسلم يا زول! الصور رهيبة شديد.
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-3 border-t flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Smile className="w-6 h-6 text-[#8f8f8f]" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full border">
                <Plus className="w-5 h-5 text-[#8f8f8f]" />
              </Button>
              <Input
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-right"
                placeholder="أكتب حاجة..."
              />
              <Button variant="ghost" size="icon" className="rounded-full">
                <Mic className="w-6 h-6 text-[#128c7e]" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ChatItemProps {
  name: string
  message: string
  time: string
  avatarSrc: string
  isActive?: boolean
  isRead?: boolean
  unreadCount?: string
  isTyping?: boolean
  bgColor?: string
}

function ChatItem({
  name,
  message,
  time,
  avatarSrc,
  isActive = false,
  isRead = false,
  unreadCount,
  isTyping = false,
  bgColor = "#ffffff",
}: ChatItemProps) {
  return (
    <div className={`flex items-center p-3 hover:bg-gray-50 ${isActive ? "bg-[#f6f6f6]" : ""}`} dir="rtl">
      <Avatar className="w-12 h-12 mr-3" style={{ backgroundColor: bgColor }}>
        <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm truncate text-right">{name}</h3>
          <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 truncate text-right">
            {isTyping ? <span className="text-[#128c7e]">بكتب...</span> : message}
          </p>
          {isRead && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#128c7e]"
            >
              <path
                d="M5 12L10 17L20 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {unreadCount && (
            <div className="bg-[#128c7e] text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
              {unreadCount}
            </div>
          )}
          {isTyping && (
            <div className="w-10 h-10 rounded-full bg-[#128c7e] flex items-center justify-center text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
