"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import data from "../../data.json";

export default function ProductDetailPage({
    params
}: {
    params: Promise<{ id: string; productId: string }>
}) {
    const [productData, setProductData] = useState<any>(null);
    const [lookId, setLookId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        Promise.resolve(params).then((resolvedParams) => {
            const look = data.looks[resolvedParams.id as keyof typeof data.looks];
            if (look) {
                const product = look.products.find((p: any) => p.id === resolvedParams.productId);
                if (product) {
                    setProductData(product);
                    setLookId(resolvedParams.id);
                }
            }
        });
    }, [params]);

    if (!productData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
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
                </div>
            </div>

            {/* Product Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="max-w-2xl mx-auto bg-white">
                    {/* Large Product Image */}
                    <div className="relative aspect-square w-60% h-60% bg-gradient-to-br from-gray-100 to-gray-200">
                        <img
                            src={productData.image}
                            alt={productData.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="p-6 space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {productData.name}
                            </h1>
                            <p className="text-2xl font-bold text-gray-900">
                                ${productData.price.toFixed(2)}
                            </p>
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed">
                            This product features a timeless design with premium quality materials.
                            Perfect for any occasion, combining style and comfort effortlessly.
                            Available in multiple sizes to ensure the perfect fit.
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4">
                            <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all transform active:scale-95 sm:hover:scale-105 shadow-lg">
                                Buy Now
                            </button>
                            <button className="w-full py-3 bg-white border-2 border-pink-500 text-pink-500 font-semibold rounded-full hover:bg-pink-50 transition-all transform active:scale-95 sm:hover:scale-105 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                                Try On
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
