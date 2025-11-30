import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    text = 'Loading...'
}) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#FFF8F0]">
            <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-[#F3E5AB] border-t-[#D4AF37]`} />
            {text && <div className="mt-4 text-gray-500">{text}</div>}
        </div>
    );
};
