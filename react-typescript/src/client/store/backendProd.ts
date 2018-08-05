import { State } from 'common'
import {
  applyMiddleware,
  compose,
  createStore,
  GenericStoreEnhancer
} from 'redux'
import { createEpicMiddleware } from 'redux-observable'

import rootEpic from 'client/epics'
import reducer from 'client/reducers'

const epicMiddleware = createEpicMiddleware(rootEpic)
const enhancer: GenericStoreEnhancer = compose(applyMiddleware(epicMiddleware))

export const backendCreateStore = (initialState: State) =>
  createStore<State>(reducer, initialState, enhancer)
