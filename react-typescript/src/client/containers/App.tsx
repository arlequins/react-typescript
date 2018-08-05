import { addToken, TokenRequestAction } from 'client/actions/Token'
import Breadcrumb from 'client/components/Breadcrumb'
import { isWindow } from 'client/helpers'
import { JWTSecret, Origin } from 'client/helpers'
import { State } from 'common'
import * as jwt from 'jsonwebtoken'
import * as React from 'react'
import { getUA } from 'react-device-detect'
import { Helmet } from 'react-helmet'
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux'
import { renderRoutes, RouteConfig } from 'react-router-config'

const uniMode = process.env.UNI_MODE !== undefined ? process.env.UNI_MODE : false

interface Props {
  token?: string
}

const mapStateToProps = (state: State): State => ({
  token: state.token,
})

interface DispatchProps {
  addToken: (userData: any) => TokenRequestAction
}

const mapDispatchToProps: DispatchProps = {
  addToken,
}

type AllProps = Readonly<State & DispatchProps & Props>

class App extends React.Component<AllProps, object> {
  constructor(props: AllProps) {
    super(props)
    this.registerToken()

  }

  registerToken() {
    if (isWindow) {
      try {
        const currentToken = this.props.token || ''
        const verifyToken: any = jwt.verify(currentToken, JWTSecret)

        const today = new Date()
        const expiredDate = new Date(verifyToken.exp * 10000)

        if (today > expiredDate) {
          this.requestToken()
        }
      } catch(e) {
        this.requestToken()
      }
    }
  }

  requestToken() {
    const userData = {
      client_id: 'clientId',
      grant_type: 'website',
      scope: 'site',
      userAgent: getUA,
      userAddr: '',
    }
    this.props.addToken(userData)
  }

  render() {
    const { route = {} as RouteConfig } = this.props
    return (
      <div className="l-mainWrap">
        <Helmet>
          <html lang="en" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>title</title>
          <meta name="viewport" id="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="" />
          <meta property="og:title" content="title" />
          <meta property="og:description" content="" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${Origin.path}`} />
          <meta property="og:image" content={`${Origin.root}/og.png`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="title" />
          <meta name="twitter:description" content="" />
          <meta name="twitter:url" content={`${Origin.path}`} />
          <meta name="twitter:image" content={`${Origin.root}/twitter_card.png`} />
          <meta name="keywords" content="keyword1,keyword2" />
          <link rel="canonical" href={`${Origin.app}`} />
          <link rel="shortcut icon" href={`${Origin.app}/favicon.ico`} />
          <link rel="apple-touch-icon" href={`${Origin.app}/apple-touch-icon.png`} />
          <link rel="manifest" href={`${Origin.app}/manifest.json`} />
          <noscript>
            You need to enable JavaScript to run this app.
          </noscript>
        </Helmet>
        <Breadcrumb />
        {route && renderRoutes(route.routes)}
      </div>
    )
  }
}

const lastApp = (component: any, hotModules: any, isUniMode: any) => {
  if (!isUniMode) {
    return hotModules(module)(connect<State, DispatchProps, Props>(mapStateToProps, mapDispatchToProps)(component))
  } else {
    return connect<State, DispatchProps, Props>(mapStateToProps, mapDispatchToProps)(component)
  }
}

export default lastApp(App, hot, uniMode)
