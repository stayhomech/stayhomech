import React, {Suspense} from 'react'
import ReactDOM from 'react-dom'

import i18n_init from './i18n';
import EventsManager from './events';

import * as Sentry from '@sentry/browser';

import Page from './components/Page';
import {Loading} from './components/Loading';
import ErrorBoundary from "./components/ErrorBoundary";


class App extends React.Component {

    constructor(props) {
        super(props);
        this.i18n = i18n_init(self.props.lang, self.props.locize_api_key, self.props.running_env);
        this.events = EventsManager;
    }

    render() {

        // Event
        const [npa, city] = this.props.content_uuid.split('/');
        this.events.start(npa, city, self.props.lang);

        return (
            <Suspense fallback={<Loading/>}>
                <ErrorBoundary>
                    <Page content_uuid={this.props.content_uuid} running_env={this.props.running_env}
                          csrf_token={this.props.csrf_token} lang={this.props.lang}/>
                </ErrorBoundary>
            </Suspense>
        );

    }
}

Sentry.init({dsn: window.props.sentry_dsn});

ReactDOM.render(
    React.cloneElement(<App/>, window.props),
    window.props.react_mount
);
