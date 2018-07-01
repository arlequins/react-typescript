import * as React from 'react'

export interface FooterProps {}

class Footer extends React.Component<FooterProps, object> {
	render() {
		return (
			<div>
				<div className="alert alert-primary" role="alert">
					A simple primary alert—check it out!12e2q
				</div>
				<div className="jumbotron">
					<h1 className="display-4">Amazing React, Bootstrap and Webpack</h1>
					<p className="lead">Created with love</p>
					<hr className="my-4" />
					<p>
						It uses utility classes for typography and spacing to space content out within the
						larger container.
					</p>
					<p className="lead">
						<a className="btn btn-primary btn-lg" href="#" role="button">
							Learn more
						</a>
					</p>
				</div>
			</div>
		)
	}
}

export default Footer
