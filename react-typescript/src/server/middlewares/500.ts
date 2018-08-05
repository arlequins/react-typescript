import * as Express from 'express'
import { Error } from 'types/settings'

/**
 * error handler
 */
// tslint:disable:max-line-length
// tslint:disable-next-line:variable-name
export const Handler500 = (env: string) => (err: Error, _req: Express.Request, res: Express.Response, _next: Express.NextFunction) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    // for production mode, no stacktraces leaked to user.
    error: env === 'development' ? err : {},
    status: err.status,
  })
}
