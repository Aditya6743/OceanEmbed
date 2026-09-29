import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  message?: string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Safely caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-black/50 backdrop-blur-md rounded-xl border border-red-500/20 p-8 z-50">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-red-400 font-mono tracking-widest text-sm font-bold uppercase">
              {this.props.message || "System Unavailable"}
            </h3>
            <p className="text-slate-400 text-xs font-light max-w-xs">
              The 3D engine encountered an unexpected error and has been safely halted.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] uppercase tracking-widest rounded-full transition-colors"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
