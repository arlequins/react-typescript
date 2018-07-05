import * as React from 'react'
import { Route, Switch } from 'react-router'
import { App as Main } from 'app/containers/App'
import { hot } from 'react-hot-loader'
// tslint:disable:no-import-side-effect
// import 'bootstrap/dist/css/bootstrap.min.css'

export const App = hot(module)(() => (
  <Switch>
    <Route path="/" component={Main} />
  </Switch>
))

// settings
const devMode = process.env.NODE_ENV !== 'production'

// service-workers
import * as OfflinePluginRuntime from 'offline-plugin/runtime'

if (!devMode) {
  OfflinePluginRuntime.install({
    onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
    onUpdated: () => location.reload(),
  })
}

// post processing and checking
import { Common, InitialFire } from 'app/helpers'
Common()

const array = [1, 2, 3, 4, 5]
InitialFire.init(array)

import * as $ from 'jquery'
// tslint:disable:no-console
console.log($('#root'))
