import { API } from '../API'

export const logout = async () => {
  sessionStorage.removeItem('expiresAt')
  const res = await API.logout.query()
}
