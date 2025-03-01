import React from 'react'
import { DatePickerWithRange } from '@/components/atom/date-range'
import { MonthYearRangePicker } from '@/components/atom/month-year-range'
import { MonthYearPicker } from '@/components/atom/month-year-picker'
const page = () => {
  return (
    <div className='w-60 space-y-10 items-center justify-center'>
      <DatePickerWithRange />
      <MonthYearRangePicker />
      <MonthYearPicker />
      
    </div>
  )
}

export default page