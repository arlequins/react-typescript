import * as React from 'react'

import Status from 'client/routes/Status'

export default (): JSX.Element => (
  <Status status={404}>
    <div>Not found</div>
  </Status>
)
