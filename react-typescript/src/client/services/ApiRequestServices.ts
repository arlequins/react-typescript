import { OUTER_API_ROOT as API_ROOT } from 'client/constants'
import { ApiRequest } from 'client/services/methods'
import * as urlJoin from 'url-join'

export const requestListSearch = async (params: any) => (
  await ApiRequest.post(urlJoin(API_ROOT, 'v1', 'list'), params)
)
