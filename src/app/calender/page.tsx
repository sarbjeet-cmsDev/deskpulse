import FullCalendarView from '@/components/User/Calender/FullCalenderView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title : {
    absolute: 'Calender',
   }
}

export default function Calendar() {
  return (
    <FullCalendarView/>
  )
}