import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'

import i18n_init from './i18n';

import Page from './components/Page';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.i18n = i18n_init(self.props.lang, self.props.locize_api_key);
  }

  render() {
    return (
      <Suspense fallback="Loading...">
        <Page content_uuid={this.props.content_uuid} running_env={this.props.running_env} />
      </Suspense>
    );
  }
}

ReactDOM.render(
  React.cloneElement(<App />, window.props),
  window.props.react_mount
);