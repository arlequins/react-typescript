declare module 'common' {
  import { Reducer } from 'redux'

  interface Action<T extends string> {
    type: T
  }

  interface Dict<T> {
    [key: string]: T
  }

  interface ReducersMapObject {
    [key: string]: Reducer<State>
  }

  interface State {
    route?: RouteConfig
    router?: ConnectedRouter
    currentLocation?: CurrentLocation
    areaOrder?: string[]
    token?: any
  }

  interface CurrentLocation {
    name: string
    path: string
  }

  interface ConnectedRouter {
    location: RouterLocation
    action: string
  }

  interface RouterLocation {
    pathname: string
    search: string
    hash: string
  }

  interface Pager {
    totalCount: number
    totalPage: number
    startPage: number
    endPage?: number
    itemsPerPage: number
    currentPage: number
    valid: number
    [key: string]: number
  }
}
