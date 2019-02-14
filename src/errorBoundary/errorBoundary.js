import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor() {
    super();
    this.state = {
      hasError: false
    };
  }
  static getDerivedStateFromError() {
      
         return { hasError: true }
  }
  render() {
      if (this.state.hasError){
          return(
            <div>
              <h1>You have encountered an error. </h1>
              <h5>¯\(ツ)/¯ Call 555-555-5555 if problem persists</h5>
              </div>
          )
      }
    return this.props.children;
  }
}
