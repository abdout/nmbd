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

interface MonthYearRange {
  from?: Date
  to?: Date
}

interface MonthYearRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: MonthYearRange
  onChange?: (range: MonthYearRange) => void
  placeholder?: string
}

const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
]

export function MonthYearRangePicker({
  className,
  value,
  onChange,
  placeholder = "اختر الفترة الزمنية",
}: MonthYearRangePickerProps) {
  const currentDate = React.useMemo(() => new Date(), []);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const [range, setRange] = React.useState<MonthYearRange>(value || {})
  const [activeSelection, setActiveSelection] = React.useState<'from' | 'to'>('from')
  const [fromYear, setFromYear] = React.useState<number>(
    range.from?.getFullYear() || currentYear - 4
  )
  const [toYear, setToYear] = React.useState<number>(
    range.to?.getFullYear() || currentYear
  )
  
  React.useEffect(() => {
    if (range.from) {
      setFromYear(range.from.getFullYear())
    }
    if (range.to) {
      setToYear(range.to.getFullYear())
    }
  }, [range.from, range.to])

  const handlePreviousYear = () => {
    // Decrease both years by 1
    const newFromYear = fromYear - 1
    const newToYear = toYear - 1
    
    setFromYear(newFromYear)
    setToYear(newToYear)
    
    // Update dates if they exist
    if (range.from) {
      const newFromDate = new Date(range.from)
      newFromDate.setFullYear(newFromYear)
      updateRange('from', newFromDate)
    }
    
    if (range.to) {
      const newToDate = new Date(range.to)
      newToDate.setFullYear(newToYear)
      updateRange('to', newToDate)
    }
  }

  const handleNextYear = () => {
    // Increase both years by 1, but don't exceed current year for "to" side
    const newFromYear = fromYear + 1
    const newToYear = Math.min(toYear + 1, currentYear)
    
    setFromYear(newFromYear)
    setToYear(newToYear)
    
    // Update dates if they exist
    if (range.from) {
      const newFromDate = new Date(range.from)
      newFromDate.setFullYear(newFromYear)
      updateRange('from', newFromDate)
    }
    
    if (range.to) {
      const newToDate = new Date(range.to)
      newToDate.setFullYear(newToYear)
      updateRange('to', newToDate)
    }
  }

  const handleMonthSelect = (type: 'from' | 'to', monthIndex: number) => {
    // For "to" side, don't allow selecting future months in current year
    if (type === 'to' && toYear === currentYear && monthIndex > currentMonth) {
      return;
    }
    
    const newDate = new Date()
    newDate.setMonth(monthIndex)
    newDate.setFullYear(type === 'from' ? fromYear : toYear)
    
    // Set day to 1 for 'from' and to last day of month for 'to'
    if (type === 'from') {
      newDate.setDate(1)
    } else {
      // Set to last day of month
      newDate.setMonth(monthIndex + 1)
      newDate.setDate(0)
    }
    
    updateRange(type, newDate)
    
    // Auto-switch to 'to' after selecting 'from' if 'to' is not set
    if (type === 'from' && !range.to) {
      setActiveSelection('to')
    }
  }

  const updateRange = (key: 'from' | 'to', value: Date) => {
    const newRange = { ...range, [key]: value }
    setRange(newRange)
    onChange?.(newRange)
  }

  const formatDate = (date?: Date) => {
    if (!date) return ""
    return format(date, "MMMM yyyy", { locale: ar })
  }

  // Check if a month should be disabled (for "to" side in current year)
  const isMonthDisabled = (monthIndex: number) => {
    return toYear === currentYear && monthIndex > currentMonth;
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-range"
            variant={"outline"}
            className={cn(
              "w-full h-10 justify-start text-right font-normal",
              !range.from && !range.to && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="ml-2 h-4 w-4" />
            {range.from || range.to ? (
              <>
                {formatDate(range.from)} 
                {range.to && range.from && " - "} 
                {formatDate(range.to)}
              </>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3" dir="rtl">
            {/* Calendars with headers */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* From Side */}
              <div className="flex-1">
                {/* From Header */}
                <div className="flex items-center mb-4">
                  <div className="flex-1"></div>
                  <div className="flex-1 flex justify-center">
                    <div className="text-sm font-medium">
                      من {fromYear}
                    </div>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <Button 
                      variant="outline" 
                      className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                      onClick={handlePreviousYear}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* From Calendar */}
                <div className="grid grid-cols-3 gap-2">
                  {MONTHS_AR.map((month, index) => {
                    const isSelected = range.from?.getMonth() === index
                    
                    return (
                      <Button
                        key={`from-${month}`}
                        variant="ghost"
                        className={cn(
                          "text-xs h-8 px-1 hover:bg-accent hover:text-accent-foreground",
                          isSelected ? "bg-neutral-100 text-black font-medium" : ""
                        )}
                        onClick={() => handleMonthSelect('from', index)}
                      >
                        {month}
                      </Button>
                    )
                  })}
                </div>
              </div>
              
              {/* To Side */}
              <div className="flex-1">
                {/* To Header */}
                <div className="flex items-center mb-4">
                  <div className="flex-1 flex justify-start">
                    <Button 
                      variant="outline" 
                      className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                      onClick={handleNextYear}
                      disabled={toYear >= currentYear}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="text-sm font-medium">
                      إلى {toYear}
                    </div>
                  </div>
                  <div className="flex-1"></div>
                </div>
                
                {/* To Calendar */}
                <div className="grid grid-cols-3 gap-2">
                  {MONTHS_AR.map((month, index) => {
                    const isSelected = range.to?.getMonth() === index
                    const disabled = isMonthDisabled(index)
                    
                    return (
                      <Button
                        key={`to-${month}`}
                        variant="ghost"
                        disabled={disabled}
                        className={cn(
                          "text-xs h-8 px-1 hover:bg-accent hover:text-accent-foreground",
                          isSelected ? "bg-neutral-100 text-black font-medium" : "",
                          disabled ? "opacity-30 cursor-not-allowed" : ""
                        )}
                        onClick={() => handleMonthSelect('to', index)}
                      >
                        {month}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 