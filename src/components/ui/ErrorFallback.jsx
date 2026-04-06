import { HiExclamation } from 'react-icons/hi';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
            <div className="glass-dark border border-orange-500/20 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_4px_24px_rgba(255,107,0,0.1)]">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                    <HiExclamation className="text-3xl text-red-400" />
                </div>
                <h2 className="font-display font-bold text-white text-2xl mb-3">Oops! Something went wrong.</h2>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    We apologize for the inconvenience. An unexpected error has occurred. Our team has been notified.
                </p>
                <div className="bg-black/50 rounded-lg p-4 mb-6 overflow-x-auto text-left border border-white/5">
                    <pre className="text-red-400 text-xs font-mono">{error.message}</pre>
                </div>
                <button
                    onClick={resetErrorBoundary}
                    className="btn-primary w-full py-3 text-sm font-semibold shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Reload Page
                </button>
            </div>
        </div>
    );
};

export default ErrorFallback;
