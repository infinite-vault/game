import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorPage } from '../pages/Error/ErrorPage';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // loglevelError('Error boundary catch', error, errorInfo);
    console.error('Error boundary catch', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorPage />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
