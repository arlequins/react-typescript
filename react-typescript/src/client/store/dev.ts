import { State } from 'common'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {
  applyMiddleware,
  compose,
  createStore,
  GenericStoreEnhancer
} from 'redux'
import { createLogger } from 'redux-logger'
import { createEpicMiddleware } from 'redux-observable'

import rootEpic from 'client/epics'
import reducer from 'client/reducers'
import { ExtendedWindow } from 'types/settings'
export const frontendCreateStore = (initialState: State, history: any) => {

let enhancer: GenericStoreEnhancer
const epicMiddleware = createEpicMiddleware(rootEpic)

const hasDevtools = Boolean(
  typeof window !== 'undefined' &&
  (window as ExtendedWindow).__REDUX_DEVTOOLS_EXTENSION__ &&
  (window as ExtendedWindow).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__,
)

if (hasDevtools) {
  enhancer = (window as ExtendedWindow).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
    compose(applyMiddleware(routerMiddleware(history), epicMiddleware, createLogger()))
  )
} else {
  enhancer = compose(applyMiddleware(routerMiddleware(history), epicMiddleware, createLogger()))
}

  return createStore<State>(connectRouter(history)<State>(reducer), initialState, enhancer)
}

