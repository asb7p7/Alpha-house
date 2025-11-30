"use client";

import React, { useCallback, memo } from 'react';

interface TabItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface BottomNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onNavigate?: (path: string) => void;
}

const TAB_ITEMS: TabItem[] = [
    {
        id: 'home',
        label: 'Home',
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
        ),
    },
    {
        id: 'streaming',
        label: 'Live',
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                <circle cx="18" cy="6" r="3" fill="red" />
            </svg>
        ),
    },
    {
        id: 'cart',
        label: 'Cart',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
        ),
    },
    {
        id: 'profile',
        label: 'Profile',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        ),
    },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = memo(({
    activeTab,
    onTabChange,
    onNavigate
}) => {
    const handleTabClick = useCallback((tabId: string) => {
        onTabChange(tabId);
        if (onNavigate) {
            if (tabId === 'home') {
                onNavigate('/feed');
            } else if (tabId === 'streaming') {
                onNavigate('/streaming');
            }
        }
    }, [onTabChange, onNavigate]);

    return (
        <div className="sticky bottom-0 z-50 h-16 sm:h-20 bg-white border-t border-gray-200 flex items-center justify-around px-4 sm:px-8 shadow-lg">
            {TAB_ITEMS.map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-pink-500 scale-110' : 'text-gray-400'
                        }`}
                    aria-label={item.label}
                    aria-current={activeTab === item.id ? 'page' : undefined}
                >
                    {item.icon}
                    {activeTab === item.id && (
                        <div className="w-1 h-1 rounded-full bg-pink-500" aria-hidden="true" />
                    )}
                </button>
            ))}
        </div>
    );
});

BottomNavigation.displayName = 'BottomNavigation';
