import { Middleware } from 'redux'

export const logger: Middleware = (store) => (next) => (action) => {
  // tslint:disable:no-console
  console.log(action)
  return next(action)
}
