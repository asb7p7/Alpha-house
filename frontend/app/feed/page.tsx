"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import data from "./data.json";

export default function Feed() {
    const [activeTab, setActiveTab] = useState("home");
    const router = useRouter();

    return (
        <div className="flex flex-col h-screen bg-white">
            <div className="sticky top-0 z-50 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                        👤
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            🔍
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4 bg-white border-b border-gray-100">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {data.users.map((user) => (
                        <div key={user.id} className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
                            <div className="relative">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-400 p-[2.5px] transform transition-transform active:scale-95 sm:hover:scale-110">
                                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-medium max-w-[70px] text-gray-700 truncate">
                                {user.username}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50">
                <div className="p-3 sm:p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 max-w-7xl mx-auto">
                    {data.posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm active:shadow-md sm:hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] sm:hover:-translate-y-1"
                        >
                            <div className="flex items-center gap-2 p-3 border-b border-gray-100">
                                <img
                                    src={post.avatar}
                                    alt={post.username}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-pink-400"
                                />
                                <span className="text-xs font-semibold text-gray-700 truncate flex-1">
                                    {post.username}
                                </span>
                            </div>

                            <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300">
                                <img
                                    src={post.image}
                                    alt={post.description}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-3 space-y-2">
                                <p className="text-xs text-gray-700 line-clamp-2">
                                    {post.description}
                                </p>
                                <Link
                                    href={`/products/${post.lookId}`}
                                    className="block w-full py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all transform active:scale-95 sm:hover:scale-105 shadow-md text-center"
                                >
                                    Shop the Look
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sticky bottom-0 z-50 h-16 sm:h-20 bg-white border-t border-gray-200 flex items-center justify-around px-4 sm:px-8 shadow-lg">
                <button
                    onClick={() => setActiveTab("home")}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === "home" ? "text-pink-500 scale-110" : "text-gray-400"
                        }`}
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    {activeTab === "home" && <div className="w-1 h-1 rounded-full bg-pink-500"></div>}
                </button>
                <button
                    onClick={() => setActiveTab("search")}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === "search" ? "text-pink-500 scale-110" : "text-gray-400"
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {activeTab === "search" && <div className="w-1 h-1 rounded-full bg-pink-500"></div>}
                </button>
                <button
                    onClick={() => setActiveTab("cart")}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === "cart" ? "text-pink-500 scale-110" : "text-gray-400"
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {activeTab === "cart" && <div className="w-1 h-1 rounded-full bg-pink-500"></div>}
                </button>
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === "profile" ? "text-pink-500 scale-110" : "text-gray-400"
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {activeTab === "profile" && <div className="w-1 h-1 rounded-full bg-pink-500"></div>}
                </button>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
