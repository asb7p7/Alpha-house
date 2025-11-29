import React from 'react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
            <div className="text-center max-w-md">
                <svg
                    className="w-16 h-16 mx-auto text-red-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all transform active:scale-95"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};
