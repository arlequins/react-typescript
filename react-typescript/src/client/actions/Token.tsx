import { Action } from 'common'
/**
 * Token
 */
export const TOKEN_REQUEST = 'TOKEN_REQUEST'
export const TOKEN_SUCCESS = 'TOKEN_SUCCESS'
export const TOKEN_FAILURE = 'TOKEN_FAILURE'

export interface TokenRequestAction extends Action<typeof TOKEN_REQUEST> {
  payload: any
}
export interface TokenSuccessAction extends Action<typeof TOKEN_SUCCESS> {
  token: string
}
export interface TokenFailureAction extends Action<typeof TOKEN_FAILURE> {
  error: any
}

export const addToken = (payload: any): TokenRequestAction => (
  { type: TOKEN_REQUEST, payload }
)

export const setToken = (token: string): TokenSuccessAction => {
  return { type: TOKEN_SUCCESS, token }
}

export const errorToken = (error: any): TokenFailureAction => {
  return { type: TOKEN_FAILURE, error }
}
