import { Card, CardContent } from "@/components/ui/card";

export function FooterAddressComponent() {
    return (
      <Card className="w-full bg-transparent dark:bg-transparent border-none shadow-none">
        <CardContent className="px-4">
          <div className="flex space-x-8 text-sm items-center justify-center md:justify-start text-gray-500 dark:text-gray-400">
            <p className="text-[13px] md:text-[15px]">السودان</p>
            <p className="text-[13px] md:text-[15px]">العربية</p>
            <p className="text-[13px] md:text-[15px]">احصاء</p>
            <p className="text-[13px] md:text-[15px]">نهار</p>
          </div>
        </CardContent>
      </Card>
    )
  }