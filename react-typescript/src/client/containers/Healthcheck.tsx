import { State } from 'common'
import * as React from 'react'

interface Props {
}

type AllProps = Readonly<State & Props>

class Healthcheck extends React.Component<AllProps> {
  constructor(props: AllProps) {
    super(props)
  }

  render() {
    return (
      <div>
        <p>good</p>
      </div>
    )
  }
}

export default Healthcheck
