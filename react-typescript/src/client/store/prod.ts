import { State } from 'common'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {
  applyMiddleware,
  compose,
  createStore,
  GenericStoreEnhancer
} from 'redux'
import { createEpicMiddleware } from 'redux-observable'

import rootEpic from 'client/epics'
import reducer from 'client/reducers'

export const frontendCreateStore = (initialState: State, history?: any) => {

  const epicMiddleware = createEpicMiddleware(rootEpic)
  const enhancer: GenericStoreEnhancer = compose(applyMiddleware(routerMiddleware(history), epicMiddleware))

  return createStore<State>(connectRouter(history)<State>(reducer), initialState, enhancer)
}
