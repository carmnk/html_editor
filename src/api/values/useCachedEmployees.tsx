import React from 'react'
// import { useAppDispatch, useAppSelector } from '../../store/hooks'
// import { updateEmployees } from '../../store/reducers/dataReducer'
// import { formatReverseFullName } from '../../utils/format'
// import { API } from '../API'
// import { EmployeeType } from './Employee'

// export const useCachedEmployees = () => {
//   const employees = useAppSelector(
//     (state) => state.dataReducer.cachedData.employees
//   )
//   const dispatch = useAppDispatch()
//   React.useEffect(() => {
//     if (employees?.length) return
//     const fetchData = async () => {
//       const query = API.getValuesAllEmployees.query
//       const res = (await query())?.data
//       dispatch(
//         updateEmployees(
//           res?.map((empl: any) => ({
//             ...empl,
//             label: formatReverseFullName(
//               empl.title,
//               empl.first_name,
//               empl.last_name
//             ),
//             value: empl.employee_id,
//           }))
//         )
//       )
//     }
//     fetchData()
//   }, [employees?.length, dispatch])

//   return employees
// }

// export const filterByRoles = (
//   employees: EmployeeType[],
//   roles: EmployeeType['roles']
// ) =>
//   employees.filter((employee) =>
//     employee.roles.find((role) => roles.includes(role))
//   )
