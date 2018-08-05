import { OUTER_API_ROOT as API_ROOT, TOKEN_LS } from 'client/constants'
import { OauthRequest, Request } from 'client/services/methods'
import * as urlJoin from 'url-join'

export const requestToken = async (userData: any) => {
  let userAddr = {
    ip: '',
  }
  try {
    userAddr = await Request.get(urlJoin('https://api.ipify.org?format=json'))
    userData.userAddr = userAddr.ip
  } catch(e) {
    userData.userAddr = 'no user addr'
  }

  const tokenInfo = await OauthRequest.post(urlJoin(API_ROOT, 'v1', 'oauth', 'token'), userData)
  const accessToken = tokenInfo.access_token
  localStorage.setItem(TOKEN_LS, accessToken)
  return accessToken
}
