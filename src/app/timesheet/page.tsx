import {Suspense} from 'react'
import TimeSheetList from '@/components/User/TimeSheet/TimeSheetList'
import type { Metadata } from 'next'


export const metadata: Metadata ={
  title:{
    absolute: 'Time sheet'
  }
}

export default function page()  {
  return (
    <Suspense fallback={<div className='p-6' >Loading TimeSheet...</div>} >
      <TimeSheetList/>
      </Suspense>
  )
}

