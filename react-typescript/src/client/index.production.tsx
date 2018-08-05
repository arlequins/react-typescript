import { INITIAL_STATE } from 'client/constants'
import routes from 'client/routes'
import { frontendCreateStore } from 'client/store/prod'
import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { ExtendedWindow } from 'types/settings'

// tslint:disable:no-import-side-effect
import 'core-js/es6/map'
import 'core-js/es6/set'

// tslint:disable:no-import-side-effect
import 'assets/sass/main.scss'

INITIAL_STATE.route = routes[0] || {}
const win: ExtendedWindow = window as ExtendedWindow
const state = win && win.__INITIAL_STATE__ ? win.__INITIAL_STATE__ : INITIAL_STATE

const history = createBrowserHistory()
const store = frontendCreateStore(state, history)

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
    {renderRoutes(routes)}
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
