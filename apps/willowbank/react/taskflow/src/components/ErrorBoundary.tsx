import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("TaskFlow rendering error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h2>Something went wrong</h2>
          <p>
            This section could not be displayed. Please refresh and try again.
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}
