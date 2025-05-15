import Image from "next/image";

export default function EventCard() {
  // Type definitions
  interface Event {
    date: string;
    month: string;
    title: string;
    time: string;
    location: string;
    isHighlighted: boolean;
    isDisabled?: boolean;
  }

  // Event data array
  const events: Event[] = [
    {
      date: "14",
      month: "سبتمبر",
      title: "المؤتمر العام الاول للحركة ",
      time: "10AM — 4PM",
      location: "@ قاعة الصداقة، الخرطوم",
      isHighlighted: true
    },
    {
      date: "28",
      month: "أبريل",
      title: "ندوة الإصلاح وبناء الدولة",
      time: "5PM — 8PM",
      location: "@ جامعة الخرطوم، الخرطوم",
      isHighlighted: false
    },
    {
      date: "10",
      month: "مايو",
      title: "مؤتمر الشباب والتغيير السياسي",
      time: "2PM — 7PM",
      location: "@ نادي البجا، بورتسودان",
      isHighlighted: false
    },
    {
      date: "23",
      month: "يونيو",
      title: "لقاء القيادات الشعبية",
      time: "4PM — 9PM",
      location: "@ قاعة المؤتمرات، مدني",
      isHighlighted: false,
      isDisabled: true
    }
  ];

  return (
    <div className="min-h-screen px-2 md:px-0" dir="rtl">
      <div className="">
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
          {events.map((event, index) => (
            <div 
              key={index} 
              className={`${event.isHighlighted 
                ? 'bg-yellow-400 text-white dark:bg-yellow-500' 
                : 'bg-neutral-100 dark:bg-neutral-700'} p-8 flex flex-col h-full`}
            >
              <div className={`text-7xl font-light mb-1 ${
                !event.isHighlighted 
                  ? (event.isDisabled 
                    ? 'text-neutral-300 dark:text-neutral-500' 
                    : 'text-neutral-700 dark:text-neutral-200') 
                  : ''
              }`}>
                {event.date}
              </div>
              <div className={`text-sm tracking-wider mb-10 ${
                !event.isHighlighted 
                  ? (event.isDisabled 
                    ? 'text-neutral-300 dark:text-neutral-500' 
                    : 'text-neutral-700 dark:text-neutral-200') 
                  : ''
              }`}>
                {event.month}
              </div>

              <h2 className={`text-2xl font-light mb-4 ${
                !event.isHighlighted 
                  ? (event.isDisabled 
                    ? 'text-neutral-300 dark:text-neutral-500' 
                    : 'text-neutral-700 dark:text-neutral-200') 
                  : ''
              }`}>
                {event.title.split(' ').slice(0, 2).join(' ')}
                <br />
                {event.title.split(' ').slice(2).join(' ')}
              </h2>

              <div className={`mt-auto ${
                !event.isHighlighted 
                  ? (event.isDisabled 
                    ? 'text-neutral-300 dark:text-neutral-500' 
                    : 'text-neutral-700 dark:text-neutral-200') 
                  : ''
              }`}>
                <div className="mb-1 text-sm font-medium">{event.time}</div>
                <div className="text-sm font-medium">{event.location}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Feed Section */}
        <div className="mt-12 border-t pt-4 border-neutral-200 dark:border-neutral-700">
          <div className="flex items-start gap-4 mb-8 w-full md:w-[70%]">
            <Image 
              src="/nmbd-logo.png" 
              alt="logo" 
              width={40} 
              height={40} 
              className="rounded-full object-cover w-10 h-10 bg-yellow-400 p-1.5"
              priority
              quality={100}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">@nmbd</span>
                <span className="text-neutral-500 dark:text-neutral-400 text-sm">منذ 4 دقائق في</span>
                <span className="text-blue-600 dark:text-neutral-300">#أحداث</span>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 mb-2">
               تدعوكم الحركة الوطنية للبناء والتنمية لحضور المؤتمر العام الأول - 
نطرح فيه ملامح مشروعنا، ونفتح النقاش حول التحديات الراهنة وآفاق العمل المشترك
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  