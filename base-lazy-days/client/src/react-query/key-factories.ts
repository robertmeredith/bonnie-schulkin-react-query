import { queryKeys } from './constants'

export const generateUserKey = (userId: number, userToken: string) => {
  // deliberately exclude userToken from the dependancy array
  // to keep key consistent regardless of if token changes
  // this ensures that when we update user settings that the changes are reflected
  return [queryKeys.user, userId]
}

export const generateUserAppointmentsKey = (
  userId: number,
  userToken: string
) => {
  return [queryKeys.appointments, queryKeys.user, userId, userToken]
}
