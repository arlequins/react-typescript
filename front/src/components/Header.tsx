import * as React from 'react'
import logo from '#/images/logo.svg'

export interface HeaderProps {
}

class Header extends React.Component<HeaderProps, object> {
  render() {
    return (
			<div className="Header">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.tsx</code> and save to reload.
				</p>
			</div>
    )
  }
}

export default Header
