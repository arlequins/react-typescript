import { Action, CurrentLocation } from 'common'
/**
 * Location
 */
export const LOCATION_REQUEST = 'LOCATION_REQUEST'
export const LOCATION_SUCCESS = 'LOCATION_SUCCESS'
export const LOCATION_FAILURE = 'LOCATION_FAILURE'

export interface LocationRequestAction extends Action<typeof LOCATION_REQUEST> {
  payload: any
}
export interface LocationSuccessAction extends Action<typeof LOCATION_SUCCESS> {
  currentLocation: CurrentLocation
}
export interface LocationFailureAction extends Action<typeof LOCATION_FAILURE> {
  error: any
}

export const addLocation = (payload: any): LocationRequestAction => (
  { type: LOCATION_REQUEST, payload }
)

export const setLocation = (currentLocation: CurrentLocation): LocationSuccessAction => {
  return { type: LOCATION_SUCCESS, currentLocation }
}

export const errorLocation = (error: any): LocationFailureAction => {
  return { type: LOCATION_FAILURE, error }
}
