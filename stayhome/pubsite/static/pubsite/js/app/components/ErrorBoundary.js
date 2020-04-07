import React from 'react';


class ErrorBoundary extends React.Component {

    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      //logErrorToMyService(error, errorInfo);
      this.error = error;
      this.errorInfo = errorInfo;
    }
  
    render() {
      if (this.state.hasError) {
        return <div>
                <h6>Something went wrong.</h6>
                <pre>{this.error}</pre>
                <pre>{this.errorInfo}</pre>
            </div>;
      }
      return this.props.children; 
    }

  }

  export {
      ErrorBoundary
  };