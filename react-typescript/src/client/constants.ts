import { State } from 'common'

const setOuterApiUrl = process.env.OUTER_API_URL !== undefined ? process.env.OUTER_API_URL : 'http://localhost:3100'
const setInnerApiUrl = process.env.INNER_API_URL !== undefined ? process.env.INNER_API_URL : 'http://api:3100'
const tokenValue = process.env.TOKEN_LS !== undefined ? process.env.TOKEN_LS : 'setine/app'
const isWindow = typeof window === 'object'

export const TOKEN_LS = tokenValue
export const OUTER_API_ROOT = setOuterApiUrl
export const INNER_API_ROOT = setInnerApiUrl


export const INITIAL_STATE: State = {
  route: {},
  currentLocation: {
    path: '',
    name: '',
  },
  token: isWindow ? localStorage.getItem(tokenValue) || '' : '',
}
