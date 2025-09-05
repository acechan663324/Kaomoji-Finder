import React, { useState } from 'react';
import type { Kaomoji } from '../types';
import { KaomojiCard } from './KaomojiCard';

interface KaomojiDetailProps {
    kaomoji: Kaomoji;
    kaomojisFromCategory: Kaomoji[];
    categoryName?: string;
    onBack: () => void;
    onSelect: (kaomoji: Kaomoji) => void;
}

export const KaomojiDetail: React.FC<KaomojiDetailProps> = ({ kaomoji, kaomojisFromCategory, categoryName, onBack, onSelect }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(kaomoji.emoji);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 mb-8 text-gray-500 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-colors font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to list
            </button>

            <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-8 text-center">
                <p className="text-7xl md:text-9xl mb-6 break-all">{kaomoji.emoji}</p>
                <button 
                    onClick={handleCopy} 
                    className="w-full max-w-xs mx-auto px-6 py-3 text-lg font-semibold rounded-full transition-all duration-200 bg-light-accent dark:bg-dark-accent text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-surface focus:ring-light-accent dark:focus:ring-dark-accent"
                >
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <div className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
                    Tags: {kaomoji.tags.join(', ')}
                </div>
            </div>

            {kaomojisFromCategory.length > 0 && categoryName && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">More from {categoryName}</h2>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {kaomojisFromCategory.map((related, index) => (
                           <KaomojiCard key={`${related.emoji}-${index}`} kaomoji={related} onSelect={onSelect} isSelected={related.emoji === kaomoji.emoji}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};