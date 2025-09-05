import React, { useState, useMemo, useEffect } from 'react';
import { KAOMOJI_CATEGORIES } from './constants';
import type { Kaomoji } from './types';
import { KaomojiCard } from './components/KaomojiCard';
import { KaomojiDetail } from './components/KaomojiDetail';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);


export default function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [darkMode, setDarkMode] = useState(true);
    const [selectedKaomoji, setSelectedKaomoji] = useState<Kaomoji | null>(null);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const findCategoryForKaomoji = (kaomojiToFind: Kaomoji | null) => {
        if (!kaomojiToFind) return undefined;
        return KAOMOJI_CATEGORIES.find(cat => cat.kaomojis.some(k => k.emoji === kaomojiToFind.emoji));
    };

    const filteredKaomojis = useMemo(() => {
        let kaomojis: Kaomoji[] = [];

        if (selectedCategory === 'All') {
            kaomojis = KAOMOJI_CATEGORIES.flatMap(category => category.kaomojis);
        } else {
            const category = KAOMOJI_CATEGORIES.find(cat => cat.name === selectedCategory);
            kaomojis = category ? category.kaomojis : [];
        }

        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase();
            kaomojis = kaomojis.filter(k =>
                k.emoji.includes(lowercasedQuery) ||
                k.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
            );
        }

        return kaomojis;
    }, [searchQuery, selectedCategory]);

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setSelectedKaomoji(null);
    };

    const handleKaomojiSelect = (kaomoji: Kaomoji) => {
        setSelectedKaomoji(kaomoji);
    };

    const handleBackToList = () => {
        setSelectedKaomoji(null);
    };
    
    const categories = ['All', ...KAOMOJI_CATEGORIES.map(cat => cat.name)];

    const selectedKaomojiCategory = useMemo(() => findCategoryForKaomoji(selectedKaomoji), [selectedKaomoji]);
    const kaomojisFromCategory = useMemo(() => {
        if (!selectedKaomojiCategory) return [];
        return selectedKaomojiCategory.kaomojis;
    }, [selectedKaomojiCategory]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-dark-bg text-gray-800 dark:text-dark-text font-sans transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Kaomoji Finder</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400">颜文字检索和发现</p>
                    </div>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-dark-bg focus:ring-indigo-500"
                    >
                        {darkMode ? <SunIcon /> : <MoonIcon />}
                    </button>
                </header>

                {!selectedKaomoji ? (
                    <>
                        <div className="sticky top-0 z-10 py-4 bg-gray-100 dark:bg-dark-bg bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for... happy, cat, dance..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 text-lg bg-white dark:bg-dark-surface border-2 border-gray-300 dark:border-dark-secondary rounded-full focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none transition-all"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <nav className="my-8">
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryClick(category)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                                            selectedCategory === category
                                                ? 'bg-light-accent dark:bg-dark-accent text-white shadow-lg'
                                                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-dark-primary'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </nav>

                        <main>
                            {filteredKaomojis.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {filteredKaomojis.map((kaomoji, index) => (
                                        <KaomojiCard key={`${kaomoji.emoji}-${index}`} kaomoji={kaomoji} onSelect={handleKaomojiSelect} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <p className="text-4xl mb-4">(╯°□°）╯︵ ┻━┻</p>
                                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No Kaomoji Found!</h2>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different search or category.</p>
                                </div>
                            )}
                        </main>
                    </>
                ) : (
                    <KaomojiDetail 
                        kaomoji={selectedKaomoji}
                        kaomojisFromCategory={kaomojisFromCategory}
                        categoryName={selectedKaomojiCategory?.name}
                        onBack={handleBackToList}
                        onSelect={handleKaomojiSelect}
                    />
                )}
            </div>
        </div>
    );
}