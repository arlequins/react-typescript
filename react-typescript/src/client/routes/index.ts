import Healthcheck from 'client/containers/Healthcheck'
import NotFound from 'client/routes/NotFound'
import { asyncComponent } from 'react-async-component'

const App = asyncComponent({
  resolve: () => import('client/containers/App'),
})

const Home = asyncComponent({
  resolve: () => import('client/containers/Home'),
})

export default [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home,
      },
      { path: '/healthcheck',
        component: Healthcheck,
        exact: true,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
]
