import React, { ReactNode } from 'react';

type State = {
  hasError: boolean;
};

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedHasError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('An error was occured', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      ErrorBoundary.getDerivedHasError();
      return (
        this.props.fallback ?? (
          <h1>Произошла непредвиденная ошибка в приложении</h1>
        )
      );
    }
    return this.props.children;
  }
}
