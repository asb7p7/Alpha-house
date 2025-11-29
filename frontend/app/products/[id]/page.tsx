"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import data from "./data.json";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const [activeTab, setActiveTab] = useState("home");
    const [lookData, setLookData] = useState<any>(null);
    const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
    const [currentId, setCurrentId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        Promise.resolve(params).then((resolvedParams) => {
            const look = data.looks[resolvedParams.id as keyof typeof data.looks];
            if (look) {
                setCurrentId(resolvedParams.id);
                setLookData(look);
                // Initialize likes state
                const initialLikes: { [key: string]: boolean } = {};
                look.products.forEach((product: any) => {
                    initialLikes[product.id] = product.liked;
                });
                setLikes(initialLikes);
            }
        });
    }, [params]);

    const toggleLike = (productId: string) => {
        setLikes((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    if (!lookData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            <div className="sticky top-0 z-50 px-4 py-4 bg-white border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="#000" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-gray-700 flex-1">{lookData.title}</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {lookData.products.map((product: any) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                            <Link href={`/products/${currentId}/product/${product.id}`}>
                                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 cursor-pointer">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </Link>

                            <div className="p-3">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 flex-1">
                                        {product.name}
                                    </h3>
                                    <button
                                        onClick={() => toggleLike(product.id)}
                                        className="flex-shrink-0 transition-transform active:scale-90"
                                    >
                                        {likes[product.id] ? (
                                            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <p className="text-sm font-bold text-gray-900">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sticky bottom-0 z-50 h-16 sm:h-20 bg-white border-t border-gray-200 flex items-center justify-around px-4 sm:px-8 shadow-lg">
                <button
                    onClick={() => {
                        setActiveTab("home");
                        router.push("/feed");
                    }}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === "home" ? "text-pink-500 scale-110" : "text-gray-400"
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {activeTab === "home" && <div className="w-1 h-1 rounded-full bg-pink-500"></div>}
                </button>
                <button
                    onClick={() => setActiveTab("heart")}
                    className={`flex flex-col items-center gap-1 transition-all ${activeTab === "heart" ? "text-pink-500 scale-110" : "text-gray-400"
                        }`}
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {activeTab === "heart" && <div className="w-1 h-1 rounded-full bg-pink-500"></div>}
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
        </div>
    );
}