import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

import type { User } from '@shared/types'

import { useLoginData } from '@/auth/AuthContext'
import { axiosInstance, getJWTHeader } from '@/axiosInstance'
import { queryKeys } from '@/react-query/constants'
import { generateUserKey } from '@/react-query/key-factories'

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  )

  return data.user
}

export function useUser() {
  const queryClient = useQueryClient()

  // get details of the user from Auth context provider
  const { userId, userToken } = useLoginData()

  // TODO: call useQuery to update user data from server
  // const user: User = null;
  const { data: user } = useQuery({
    // only run if userId available
    enabled: !!userId,
    queryKey: generateUserKey(userId),
    queryFn: () => getUser(userId, userToken),
    // won't be refetched unless garbage collection time has expired
    staleTime: Infinity,
  })

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    queryClient.setQueryData(generateUserKey(newUser.id), newUser)
  }

  // meant to be called from useAuth
  function clearUser() {
    // In this case queryKey acts as a prefix so all query keys starting with queryKeys.user will be removed
    queryClient.removeQueries({
      queryKey: [queryKeys.user],
    })

    queryClient.removeQueries({
      queryKey: [queryKeys.appointments, queryKeys.user],
    })
  }

  return { user, updateUser, clearUser }
}
