import axios from 'axios'
import { AxiosResponse } from 'axios'
import querystring from 'querystring'

const methods = ['get', 'post']

interface Request {
  [key: string]: (endpoint: string, requestBody?: any) => Promise<AxiosResponse>
}

export default methods.reduce((request: Request, method) => ({
  ...request,
  [method]: async (endpoint: string, requestBody?: any) => {
    const response: AxiosResponse = await axios(endpoint, {
      method,
      ...({
        data: querystring.stringify(requestBody),
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${requestBody.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    })

    const results: any = await response.data

    if (response.status !== 200) {
      throw new Error(results)
    }

    return results
  },
}), {} as Request)
