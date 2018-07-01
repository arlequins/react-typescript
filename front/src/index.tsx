import * as React from 'react'
import { render } from 'react-dom'
import { Home } from './pages'
import { Common, InitialFire } from './helpers'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import $ from 'jquery'

// Import bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

const devMode = process.env.NODE_ENV !== 'production'

const Root = (
  <Home />
)

render(Root, document.getElementById('root') as HTMLElement)

Common()

const array = [1, 2, 3, 4, 5]
InitialFire.init(array)

console.log($('#root'))
console.log(devMode)
if (!devMode) {
  OfflinePluginRuntime.install({
    onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
    onUpdated: () => location.reload(),
  })
}
