import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import type { Staff } from '@shared/types'

import { filterByTreatment } from '../utils'

import { axiosInstance } from '@/axiosInstance'
import { queryKeys } from '@/react-query/constants'

type Filter = 'all' | 'massage' | 'facial' | 'scrub'

// query function for useQuery
async function getStaff(): Promise<Staff[]> {
  // const query = treatment === 'all' ? '' : `search?treatment=${treatment}`
  const { data } = await axiosInstance.get(`/staff`)
  return data
}

export function useStaff() {
  // for filtering staff by treatment
  const [filter, setFilter] = useState<Filter>('all')

  // SELECT FUNCTION - my appraoch
  // const selectFn = useCallback((staff: Staff[], filter: Filter): Staff[] => {
  //   if (filter === 'all') return staff

  //   return staff.filter((person) =>
  //     person.treatmentNames
  //       .map((t) => t.toLowerCase())
  //       .includes(filter.toLowerCase())
  //   )
  // }, [])

  // SELECT FN
  const selectFn = useCallback(
    (staff: Staff[]): Staff[] => {
      if (filter === 'all') return staff
      return filterByTreatment(staff, filter)
    },
    [filter]
  )

  // TODO: get data from server via useQuery
  const fallback: Staff[] = []

  // using fallback
  const { data: staff = fallback } = useQuery({
    queryKey: [queryKeys.staff, filter],
    queryFn: getStaff,
    // select: (data) => selectFn(data, filter),
    select: (data) => selectFn(data),
  })

  // // using initialData
  // const { data: staff } = useQuery({
  //   queryKey: [queryKeys.staff, filter],
  //   queryFn: () => getStaff(filter),
  //   initialData: [],
  // })

  return { staff, filter, setFilter }
}
