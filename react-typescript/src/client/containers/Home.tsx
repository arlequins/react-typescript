import {
  addLocation,
  LocationRequestAction,
} from 'client/actions/Location'
import { moveToTop } from 'client/helpers'
import { Origin } from 'client/helpers'
import { ConnectedRouter, CurrentLocation, State } from 'common'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

interface Props {
  router: ConnectedRouter
  currentLocation: any
}

const mapStateToProps = (state: State): State => ({
  router: state.router,
  token: state.token,
  currentLocation: state.currentLocation,
})

interface DispatchProps {
  addLocation: (currentLocation: CurrentLocation) => LocationRequestAction
}

const mapDispatchToProps: DispatchProps = {
  addLocation,
}

interface InternalState {
  listOrder?: any[]
  locationName: any
}

const initialState: InternalState = {
  locationName: {
    title: '',
    pageTitle: '',
  },
}

type AllProps = Readonly<State & DispatchProps & Props>

class Home extends React.Component<AllProps, InternalState> {
  state = initialState

  constructor(props: AllProps) {
    super(props)
    this.registerLocation('', 0)
    this.currentPath = this.currentPath.bind(this)
  }

  componentWillUnmount() {
    moveToTop()
  }

  registerLocation(areaName: string, type: number) {
    const locationInfo = {
      title: `title`,
      pageTitle: 'page-title',
      desc: 'desc',
      etc: ['keyword1,keyword2'],
    }
    if (type === 0) {
      this.state.locationName = {
        title: locationInfo.title,
        pageTitle: locationInfo.pageTitle,
        description: locationInfo.desc,
        etc: locationInfo.etc,
      }
    } else {
      this.setState({
        locationName: {
          title: locationInfo.title,
          pageTitle: locationInfo.pageTitle,
          description: locationInfo.desc,
          etc: locationInfo.etc,
        },
      })
    }

    if (areaName.length === 0) {
      this.props.addLocation({
        name: areaName,
        path: `${this.props.router.location.pathname}${this.props.router.location.search}`,
      })
    }
  }

  currentPath(router: ConnectedRouter) {
    return {
      root: Origin.app,
      path: `${Origin.app}${router.location.pathname}${router.location.search}`,
    }
  }

  render() {
    // const propName = isMobile? 'SP' : 'PC'
    const { router = {} as ConnectedRouter } = this.props
    const { locationName = {} as any } = this.state

    return (
      <main>
        <Helmet>
          <title>{locationName.title}</title>
          <meta name="description" content={locationName.description} />
          <meta property="og:title" content={locationName.title} />
          <meta property="og:description" content={locationName.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={this.currentPath(router).path} />
          <meta property="og:image" content={`${Origin.root}/og.png`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={locationName.title} />
          <meta name="twitter:description" content={locationName.description} />
          <meta name="twitter:url" content={router.location.pathname} />
          <meta name="twitter:image" content={`${this.currentPath(router).root}/twitter_card.png`} />
          <meta name="keywords" content={locationName.etc[0]} />
          <link rel="canonical" href={this.currentPath(router).root} />
        </Helmet>

        <div>home</div>

      </main>
    )
  }
}

export default connect<State, DispatchProps, Props>(mapStateToProps, mapDispatchToProps)(Home)
