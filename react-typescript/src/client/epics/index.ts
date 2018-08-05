import { Action, CurrentLocation, State } from 'common'
import { ActionsObservable, combineEpics, Epic } from 'redux-observable'

// tslint:disable:no-import-side-effect
import 'rxjs/add/observable/defer'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/retryWhen'
import 'rxjs/add/operator/take'
// import * as Rx from 'rxjs'

import { Observable } from 'rxjs/Observable'

import {
  errorLocation,
  LOCATION_REQUEST,
  LocationFailureAction,
  LocationRequestAction,
  setLocation,
} from 'client/actions/Location'

import {
  errorToken,
  setToken,
  TOKEN_REQUEST,
  TokenFailureAction,
  TokenRequestAction,
} from 'client/actions/Token'

import {
  requestToken,
} from 'client/services'

type TEpic = Epic<Action<string>, State>

const getTokenEpic: TEpic = (action$: ActionsObservable<Action<typeof TOKEN_REQUEST>>) =>
  action$.ofType(TOKEN_REQUEST)
    .mergeMap((action: TokenRequestAction) => (
      Observable.fromPromise(requestToken(action.payload))
        .map((token: string) => setToken(token))
        .catch((error: any): Observable<TokenFailureAction> => (
          Observable.of(errorToken(error))
        ))
    ))

const addLocationEpic: TEpic = (action$: ActionsObservable<Action<typeof LOCATION_REQUEST>>) =>
  action$.ofType(LOCATION_REQUEST)
  .mergeMap((action: LocationRequestAction) => (
    Observable.of(action.payload)
      .map((location: CurrentLocation) => setLocation(location))
      .catch((error: any): Observable<LocationFailureAction> => (
        Observable.of(errorLocation(error))
      ))
  ))

export default combineEpics(getTokenEpic, addLocationEpic)
