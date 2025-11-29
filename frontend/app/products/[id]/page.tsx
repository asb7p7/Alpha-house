"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductsByInfluProductId, getInfluProducts, type Product as APIProduct, type InfluProduct } from "../../../lib/api";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { ErrorMessage } from "../../../components/ErrorMessage";
import { BottomNavigation } from "../../../components/BottomNavigation";

type Product = APIProduct & {
    liked?: boolean;
};

interface ProductCardProps {
    product: Product;
    isLiked: boolean;
    onToggleLike: (productId: number) => void;
}

const ProductCard = memo<ProductCardProps>(({ product, isLiked, onToggleLike }) => (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
        <Link
            href={`/products/${product.influ_product_id}/product/${product.id}`}
            aria-label={`View details for ${product.name}`}
        >
            <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 cursor-pointer">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
        </Link>

        <div className="p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 flex-1">
                    {product.name}
                </h3>
                <button
                    onClick={() => onToggleLike(product.id)}
                    className="flex-shrink-0 transition-transform active:scale-90"
                    aria-label={isLiked ? "Unlike product" : "Like product"}
                >
                    {isLiked ? (
                        <svg
                            className="w-5 h-5 text-pink-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    )}
                </button>
            </div>
            <p className="text-sm font-bold text-gray-900">
                ${product.price.toFixed(2)}
            </p>
        </div>
    </article>
));

ProductCard.displayName = 'ProductCard';

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const [activeTab, setActiveTab] = useState("home");
    const [products, setProducts] = useState<Product[]>([]);
    const [influProduct, setInfluProduct] = useState<InfluProduct | null>(null);
    const [likes, setLikes] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const resolvedParams = await Promise.resolve(params);
            const influProductId = parseInt(resolvedParams.id, 10);

            if (isNaN(influProductId)) {
                throw new Error("Invalid product ID");
            }

            const [productsData, influProductsData] = await Promise.all([
                getProductsByInfluProductId(influProductId),
                getInfluProducts(),
            ]);

            const currentInfluProduct = influProductsData.find(ip => ip.id === influProductId);

            setProducts(productsData);
            setInfluProduct(currentInfluProduct || null);

            const initialLikes: Record<number, boolean> = {};
            productsData.forEach((product) => {
                initialLikes[product.id] = false;
            });
            setLikes(initialLikes);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err instanceof Error ? err.message : "Failed to load products");
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleLike = useCallback((productId: number) => {
        setLikes((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    }, []);

    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab);
    }, []);

    const handleNavigate = useCallback((path: string) => {
        router.push(path);
    }, [router]);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchData} />;
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="sticky top-0 z-50 px-4 py-4 bg-white border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBack}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
                        aria-label="Go back"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="#000" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-gray-700 flex-1">
                        {influProduct?.name || "Shop the Look"}
                    </h1>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {products.length === 0 ? (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                            No products available for this collection
                        </div>
                    ) : (
                        products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isLiked={likes[product.id] || false}
                                onToggleLike={toggleLike}
                            />
                        ))
                    )}
                </div>
            </main>

            <BottomNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onNavigate={handleNavigate}
            />
        </div>
    );
}