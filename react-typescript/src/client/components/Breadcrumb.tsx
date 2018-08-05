import { ConnectedRouter, CurrentLocation, State } from 'common'
import * as React from 'react'
import { connect } from 'react-redux'

interface Props {
  router?: ConnectedRouter
  currentLocation?: CurrentLocation
}

const mapStateToProps = (state: State): State => ({
  router: state.router,
  currentLocation: state.currentLocation,
})

type AllProps = Readonly<State & Props>

class Breadcrumb extends React.Component<AllProps, object> {
  render() {
    const { currentLocation = {} as CurrentLocation } = this.props

    return (
      <ul className="g-breadcrumb js-breadcrumb">
        <li>
          <a href="/">home</a>
        </li>
        { currentLocation.name.length > 0 ?
          <li>
            {currentLocation.name}
          </li>
          : ''
        }
      </ul>
    )
  }
}

export default connect<State, Props>(mapStateToProps)(Breadcrumb)