"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getProductById, type Product } from "../../../../../lib/api";
import { LoadingSpinner } from "../../../../../components/LoadingSpinner";
import { ErrorMessage } from "../../../../../components/ErrorMessage";
import { VirtualTryOnModal } from "../../../../../components/VirtualTryOnModal";

interface ProductDetailPageProps {
    params: Promise<{ id: string; productId: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const [productData, setProductData] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    const router = useRouter();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const resolvedParams = await Promise.resolve(params);
            const productId = parseInt(resolvedParams.productId, 10);

            if (isNaN(productId)) {
                throw new Error("Invalid product ID");
            }

            const product = await getProductById(productId);

            if (!product) {
                throw new Error("Product not found");
            }

            setProductData(product);
        } catch (err) {
            console.error("Error fetching product:", err);
            setError(err instanceof Error ? err.message : "Failed to load product details");
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleBuyNow = useCallback(() => {
        // TODO: Implement buy now functionality
        console.log("Buy now clicked for product:", productData?.id);
    }, [productData]);

    const handleTryOn = useCallback(() => {
        setIsTryOnOpen(true);
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchData} />;
    }

    if (!productData) {
        return <ErrorMessage message="Product not found" onRetry={fetchData} />;
    }

    return (
        <div className="flex flex-col h-screen bg-[#FFF8F0]">
            <header className="sticky top-0 z-50 px-4 py-4 bg-[#FFF8F0] border-b border-[#D4AF37]/10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBack}
                        className="w-10 h-10 rounded-full hover:bg-[#F3E5AB]/20 active:bg-[#F3E5AB]/40 flex items-center justify-center transition-colors border border-[#D4AF37]/20"
                        aria-label="Go back"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="#D4AF37" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto bg-[#FFF8F0]">
                <article className="max-w-2xl mx-auto bg-[#FFF8F0]">
                    <div className="relative max-h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <img
                            src={productData.image}
                            alt={productData.name}
                            className="max-h-96 w-auto object-contain"
                        />
                    </div>

                    <div className="p-6 space-y-4">
                        <header>
                            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                                {productData.name}
                            </h1>
                            <p className="text-2xl font-bold text-[#1A1A1A]">
                                ${productData.price.toFixed(2)}
                            </p>
                        </header>

                        <section aria-label="Product description">
                            <p className="text-sm text-[#1A1A1A]/80 leading-relaxed">
                                {productData.description ||
                                    "This product features a timeless design with premium quality materials. Perfect for any occasion, combining style and comfort effortlessly. Available in multiple sizes to ensure the perfect fit."}
                            </p>
                        </section>

                        <div className="space-y-3 pt-4">
                            <button
                                onClick={handleBuyNow}
                                className="w-full py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#C5A059] transition-all transform active:scale-95 sm:hover:scale-105 shadow-lg"
                                aria-label="Buy now"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={handleTryOn}
                                className="w-full py-3 bg-white border-2 border-[#D4AF37] text-[#D4AF37] font-semibold rounded-full hover:bg-[#F3E5AB]/10 transition-all transform active:scale-95 sm:hover:scale-105 flex items-center justify-center gap-2"
                                aria-label="Try on with AR"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                    <path
                                        fillRule="evenodd"
                                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Try On
                            </button>
                        </div>

                        {productData.like > 0 && (
                            <div className="flex items-center gap-2 pt-4 text-sm text-[#1A1A1A]/70">
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{productData.like} {productData.like === 1 ? 'like' : 'likes'}</span>
                            </div>
                        )}
                    </div>
                </article>
            </main>

            <VirtualTryOnModal
                isOpen={isTryOnOpen}
                onClose={() => setIsTryOnOpen(false)}
                productImage={productData.image}
            />
        </div>
    );
}
