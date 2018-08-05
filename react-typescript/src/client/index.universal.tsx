import { INITIAL_STATE } from 'client/constants'
import { isWindow } from 'client/helpers'
import routes from 'client/routes'
import { backendCreateStore } from 'client/store/backendProd'
import { frontendCreateStore } from 'client/store/prod'
import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import * as React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { BrowserRouter } from 'react-router-dom'

// tslint:disable:no-import-side-effect
import 'core-js/es6/map'
import 'core-js/es6/set'

// tslint:disable:no-import-side-effect
import 'assets/sass/main.scss'

INITIAL_STATE.route = routes[0] || {}
const state = INITIAL_STATE

if (isWindow) {
  const history = createBrowserHistory()
  const store = frontendCreateStore(state, history)

  hydrate(
    <Provider store={store}>
      <ConnectedRouter history={history}>
      {renderRoutes(routes)}
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
  )

} else {
  const store = backendCreateStore(state)

  hydrate(
    <Provider store={store}>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </Provider>,
    document.getElementById('app')
  )
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
