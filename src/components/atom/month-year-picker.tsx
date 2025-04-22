"use client"

import * as React from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MonthYearPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
}

const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
]

export function MonthYearPicker({
  className,
  value,
  onChange,
  placeholder = "اختر الشهر والسنة",
}: MonthYearPickerProps) {
  const currentDate = React.useMemo(() => new Date(), []);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [year, setYear] = React.useState<number>(date?.getFullYear() || currentYear)
  
  const handlePreviousYear = () => {
    const newYear = year - 1
    setYear(newYear)
    if (date) {
      const newDate = new Date(date)
      newDate.setFullYear(newYear)
      setDate(newDate)
      onChange?.(newDate)
    }
  }

  const handleNextYear = () => {
    // Don't exceed current year
    if (year >= currentYear) return;
    
    const newYear = year + 1
    setYear(newYear)
    if (date) {
      const newDate = new Date(date)
      newDate.setFullYear(newYear)
      setDate(newDate)
      onChange?.(newDate)
    }
  }

  const handleMonthSelect = (monthIndex: number) => {
    // Don't allow selecting future months in current year
    if (year === currentYear && monthIndex > currentMonth) {
      return;
    }
    
    const newDate = date ? new Date(date) : new Date()
    newDate.setMonth(monthIndex)
    newDate.setFullYear(year)
    // Set day to 1 for consistency
    newDate.setDate(1)
    setDate(newDate)
    onChange?.(newDate)
  }
  
  // Check if a month should be disabled (in current year)
  const isMonthDisabled = (monthIndex: number) => {
    return year === currentYear && monthIndex > currentMonth;
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full h-10 justify-start text-right font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="ml-2 h-4 w-4" />
            {date ? (
              format(date, "MMMM yyyy", { locale: ar })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3" dir="rtl">
            <div className="flex items-center mb-4">
              <div className="flex-1"></div>
              <div className="flex-1 flex justify-center">
                <div className="text-sm font-medium">
                  التاريخ {year}
                </div>
              </div>
              <div className="flex-1 flex justify-end space-x-1 space-x-reverse">
                <Button 
                  variant="outline" 
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                  onClick={handlePreviousYear}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                  onClick={handleNextYear}
                  disabled={year >= currentYear}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {MONTHS_AR.map((month, index) => {
                const isSelected = date?.getMonth() === index;
                const disabled = isMonthDisabled(index);
                
                return (
                  <Button
                    key={month}
                    variant="ghost"
                    disabled={disabled}
                    className={cn(
                      "text-xs h-8 px-1 hover:bg-accent hover:text-accent-foreground",
                      isSelected ? "bg-neutral-200 text-black font-medium" : "",
                      disabled ? "opacity-30 cursor-not-allowed" : ""
                    )}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 