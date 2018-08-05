import { INITIAL_STATE } from 'client/constants'
import routes from 'client/routes'
import { backendCreateStore } from 'client/store/backendProd'
import * as Express from 'express'
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { StaticRouter } from 'react-router-dom'

interface StaticRouterContext {
  status?: number
  url?: string
  action?: 'PUSH' | 'REPLACE'
  location?: object
}

export const ReactSSR = (assets: any) => (req: Express.Request, res: Express.Response) => {
  INITIAL_STATE.router = {
    location: {
      pathname: '',
      search: '',
      hash: '',
    },
    action: '',
  }
  INITIAL_STATE.route = routes[0] || {}
  const store = backendCreateStore(INITIAL_STATE)
  const context: StaticRouterContext = {}

  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>
  )

  const helmet = Helmet.renderStatic()

  if (context.status === 404) {
    res.status(404)
  }

  res.render('index', { content, data: store.getState(), assets: assets, helmet: helmet })
}
