import React from 'react'
import { AutocompleteExample } from '@/components/onboarding/form-autocomplete'
import { AutoLocation } from '@/components/onboarding/auto-location'
const page = () => {
  return (
    <div className='w-60 space-y-10 it'>
      <AutocompleteExample />
      <AutoLocation mode="full" />
      
    </div>
  )
}

export default page