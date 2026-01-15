import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="max-w-xl w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-red-200">
                        <div className="bg-red-600 px-6 py-4">
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined">warning</span>
                                Application Error
                            </h1>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-700 mb-4 font-medium">
                                Something went wrong rendering the application.
                            </p>

                            {this.state.error && (
                                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto mb-4">
                                    <p className="text-red-400 font-mono text-sm mb-2">{this.state.error.toString()}</p>
                                    <pre className="text-slate-400 font-mono text-xs whitespace-pre-wrap">
                                        {this.state.errorInfo?.componentStack || 'No stack trace available'}
                                    </pre>
                                </div>
                            )}

                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors"
                            >
                                Reload Application
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
