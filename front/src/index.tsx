import * as React from 'react'
import { render } from 'react-dom'
// import { Provider } from 'react-redux'

// side-effect imports
// tslint:disable:no-import-side-effect
// import './rxjs-imports'

// import store from './store'
import { Home } from './pages'

// Import bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css'

// current css
import './index.css'

const devMode = process.env.NODE_ENV !== 'production'

// const Root = (
//   <Provider store={store}>
//     <Home />
//   </Provider>
// )

const Root = (
    <Home />
)

render(Root, document.getElementById('root') as HTMLElement)

// service-workers
import * as OfflinePluginRuntime from 'offline-plugin/runtime'

if (!devMode) {
  OfflinePluginRuntime.install({
    onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
    onUpdated: () => location.reload(),
  })
}

// post processing and checking
import { Common, InitialFire } from './helpers'
import $ from 'jquery'
Common()

const array = [1, 2, 3, 4, 5]
InitialFire.init(array)
console.log($('#root'))
