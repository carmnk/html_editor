import React from 'react'
import { EmployeeType } from '../../api/values/Employee'
import emptyUser from '../assets/images/empty-user.png'
import { formatFullName } from '../../utils/format'

export const makeUserOptionsLabel = (
  user: Pick<EmployeeType, 'first_name'> & Partial<Pick<EmployeeType, 'profile_picture_url' | 'last_name' | 'title'>>
): React.ReactNode => (
  <div className="flex items-center">
    {user.profile_picture_url ? (
      <img
        className="overflow-hidden rounded-full w-[22px] h-[22px] min-w-[22px] mr-2.5"
        src={user.profile_picture_url}
        alt="Profil"
      />
    ) : (
      <img
        className="overflow-hidden rounded-full w-[22px] h-[22px] min-w-[22px] mr-2.5"
        src={emptyUser}
        alt="Profil"
      />
    )}{' '}
    {formatFullName(user?.title, user?.first_name, user?.last_name)}
  </div>
)
