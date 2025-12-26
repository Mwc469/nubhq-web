import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import NeoBrutalButton from '@/components/ui/NeoBrutalButton';

/**
 * Global Error Boundary
 * Catches React render errors and displays recovery UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Log to console in development
    console.error('🚨 NubHQ Error Boundary Caught:', error);
    console.error('Component Stack:', errorInfo?.componentStack);
    
    // In production, this would send to error tracking service
    // sendToErrorTracking({ error, errorInfo, errorId: this.state.errorId });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Try to recover by re-rendering children
  };

  handleGoHome = () => {
    window.location.href = '/Dashboard';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      const isDev = import.meta?.env?.DEV || process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#262729] flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            {/* Error Card */}
            <div className="bg-white dark:bg-gray-900 border-3 border-[#b44a1c] rounded-2xl p-8 shadow-[6px_6px_0_#b44a1c]">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#b44a1c]/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-[#b44a1c]" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-black text-center mb-2">
                Well, that's embarrassing... 🦦
              </h1>
              
              {/* Message */}
              <p className="text-center opacity-70 mb-6">
                Something went wrong and the otter fell off the stage. 
                Don't worry, no actual otters were harmed.
              </p>

              {/* Error ID for support */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-6 text-center">
                <p className="text-xs opacity-50 mb-1">Error ID (for support):</p>
                <code className="text-sm font-mono text-[#b44a1c]">{errorId}</code>
              </div>

              {/* Dev-only: Show actual error */}
              {isDev && error && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-sm font-bold text-[#b44a1c] flex items-center gap-2">
                    <Bug className="w-4 h-4" />
                    Developer Details (hidden in production)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-900 text-green-400 rounded-lg text-xs font-mono overflow-x-auto">
                    <p className="text-red-400 font-bold mb-2">{error.toString()}</p>
                    <pre className="whitespace-pre-wrap opacity-70">
                      {this.state.errorInfo?.componentStack?.slice(0, 500)}
                    </pre>
                  </div>
                </details>
              )}

              {/* Recovery Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <NeoBrutalButton 
                  onClick={this.handleReset}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </NeoBrutalButton>
                
                <NeoBrutalButton 
                  onClick={this.handleGoHome}
                  variant="secondary"
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </NeoBrutalButton>
              </div>

              {/* Last resort */}
              <button 
                onClick={this.handleReload}
                className="w-full mt-4 text-sm opacity-50 hover:opacity-100 transition-opacity"
              >
                Still broken? Click to fully reload the page
              </button>
            </div>

            {/* Fun footer */}
            <p className="text-center text-xs opacity-40 mt-4">
              The otter apologizes for the inconvenience. 
              It was probably Matt's fault anyway.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * Hook for functional components to throw errors to boundary
 */
export function useErrorHandler() {
  const [error, setError] = React.useState(null);
  
  if (error) {
    throw error;
  }
  
  return React.useCallback((err) => {
    console.error('Error thrown to boundary:', err);
    setError(err);
  }, []);
}

/**
 * Wrap async operations with error handling
 */
export function withErrorBoundary(Component, fallback = null) {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
