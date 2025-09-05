import React, { useState, useCallback } from 'react';
import type { Kaomoji } from '../types';

interface KaomojiCardProps {
    kaomoji: Kaomoji;
    onSelect: (kaomoji: Kaomoji) => void;
    isSelected?: boolean;
}

export const KaomojiCard: React.FC<KaomojiCardProps> = ({ kaomoji, onSelect, isSelected = false }) => {
    const [copied, setCopied] = useState(false);

    const handleClick = useCallback(() => {
        if (copied) return;
        
        navigator.clipboard.writeText(kaomoji.emoji).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                onSelect(kaomoji);
            }, 500); // Wait a bit to show "Copied!" before navigating
        }).catch(err => {
            console.error('Failed to copy: ', err);
            onSelect(kaomoji); // Navigate even if copy fails
        });
    }, [kaomoji, onSelect, copied]);

    return (
        <button
            onClick={handleClick}
            aria-label={`View details for ${kaomoji.emoji}`}
            className={`group relative flex flex-col items-center justify-center p-4 bg-white dark:bg-dark-surface rounded-xl shadow-md hover:shadow-xl dark:hover:shadow-dark-accent/20 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 text-left w-full ${
                isSelected 
                ? 'ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-dark-bg ring-light-accent dark:ring-dark-accent' 
                : 'border border-gray-200 dark:border-dark-primary'
            }`}
        >
            <div className="text-3xl sm:text-4xl text-center break-all mb-2 text-gray-800 dark:text-dark-text transition-transform duration-300 group-hover:scale-110">
                {kaomoji.emoji}
            </div>
            <div
                className={`absolute inset-0 flex items-center justify-center rounded-xl transition-all duration-300 ${
                    copied
                        ? 'bg-light-accent dark:bg-dark-accent bg-opacity-90 dark:bg-opacity-90'
                        : 'bg-black bg-opacity-0 group-hover:bg-opacity-60'
                }`}
            >
                <span
                    className={`font-bold text-white transition-opacity duration-300 ${
                        copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                >
                    {copied ? 'Copied!' : 'Details'}
                </span>
            </div>
        </button>
    );
};