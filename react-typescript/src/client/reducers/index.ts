import { Action, ReducersMapObject } from 'common'

import {
  LOCATION_SUCCESS,
  LocationSuccessAction,
} from 'client/actions/Location'
import {
  TOKEN_SUCCESS,
  TokenSuccessAction,
} from 'client/actions/Token'
import { INITIAL_STATE } from 'client/constants'

const handleActions = (cases: ReducersMapObject) => (
  (state = INITIAL_STATE, action: Action<string>) => (
    (!action || !cases[action.type]) ? state : cases[action.type](state, action)
  )
)

export default handleActions({
  [LOCATION_SUCCESS]: (state, { currentLocation }: LocationSuccessAction) => ({
    ...state,
    currentLocation,
  }),

  [TOKEN_SUCCESS]: (state, { token }: TokenSuccessAction) => ({
    ...state,
    token,
  }),
})
