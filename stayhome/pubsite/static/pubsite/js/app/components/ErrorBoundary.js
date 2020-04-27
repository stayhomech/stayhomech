import React from 'react';
import * as Sentry from '@sentry/browser';


class ErrorBoundary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventId: null
        };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        Sentry.withScope(scope => {
            scope.setExtras(errorInfo);
            const eventId = Sentry.captureException(error);
            this.setState({
                eventId: eventId
            });
        });
    }

    render() {
        if (this.state.hasError) {
            return <div>
                <h6>Sorry, something went wrong...</h6>
                <p>We collected the error and will work on it!</p>
                <p>
                    <button onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>Report feedback</button>
                </p>
            </div>;
        }
        return this.props.children;
    }

}

export default ErrorBoundary
