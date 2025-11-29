"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, memo } from "react";
import { getProfiles, getInfluProducts, type Influencer, type InfluProduct } from "../../lib/api";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { BottomNavigation } from "../../components/BottomNavigation";
import { useRouter } from "next/navigation";

const ProfileStory = memo<{ profile: Influencer }>(({ profile }) => (
    <div
        className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`View ${profile.name}'s story`}
    >
        <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-400 p-[2.5px] transform transition-transform active:scale-95 sm:hover:scale-110">
                <div className="w-full h-full rounded-full bg-white p-[2px]">
                    <img
                        src={profile.dp}
                        alt={`${profile.name}'s profile picture`}
                        className="w-full h-full rounded-full object-cover"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
        <span className="text-xs font-medium max-w-[70px] text-gray-700 truncate">
            {profile.name}
        </span>
    </div>
));

ProfileStory.displayName = 'ProfileStory';

const ProductCard = memo<{ influProduct: InfluProduct }>(({ influProduct }) => (
    <article
        className="bg-white rounded-2xl overflow-hidden shadow-sm active:shadow-md sm:hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] sm:hover:-translate-y-1"
    >
        <header className="flex items-center gap-2 p-3 border-b border-gray-100">
            <img
                src={influProduct.influencer?.dp || "https://i.pravatar.cc/150?img=1"}
                alt={influProduct.influencer?.name || "Influencer"}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-pink-400"
                loading="lazy"
            />
            <span className="text-xs font-semibold text-gray-700 truncate flex-1">
                {influProduct.influencer?.name || "Influencer"}
            </span>
        </header>

        <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300">
            <img
                src={influProduct.poster}
                alt={influProduct.name}
                className="w-full h-full object-cover"
                loading="lazy"
            />
        </div>

        <div className="p-3 space-y-2">
            <p className="text-xs text-gray-700 line-clamp-2">
                {influProduct.name}
            </p>
            <Link
                href={`/products/${influProduct.id}`}
                className="block w-full py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all transform active:scale-95 sm:hover:scale-105 shadow-md text-center"
            >
                Shop the Look
            </Link>
        </div>
    </article>
));

ProductCard.displayName = 'ProductCard';

export default function Feed() {
    const [activeTab, setActiveTab] = useState("home");
    const [profiles, setProfiles] = useState<Influencer[]>([]);
    const [influProducts, setInfluProducts] = useState<InfluProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [profilesData, productsData] = await Promise.all([
                getProfiles(),
                getInfluProducts(),
            ]);
            setProfiles(profilesData);
            setInfluProducts(productsData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load feed. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab);
    }, []);

    const handleNavigate = useCallback((path: string) => {
        router.push(path);
    }, [router]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchData} />;
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="sticky top-0 z-50 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg"
                        aria-label="User profile"
                    >
                        👤
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                            aria-label="Search products"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
                            🔍
                        </span>
                    </div>
                </div>
            </header>

            <section className="px-4 py-4 bg-white border-b border-gray-100" aria-label="Influencer stories">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {profiles.map((profile) => (
                        <ProfileStory key={profile.id} profile={profile} />
                    ))}
                </div>
            </section>

            <main className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50">
                <div className="p-3 sm:p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 max-w-7xl mx-auto">
                    {influProducts.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No products available at the moment
                        </div>
                    ) : (
                        influProducts.map((influProduct) => (
                            <ProductCard key={influProduct.id} influProduct={influProduct} />
                        ))
                    )}
                </div>
            </main>

            <BottomNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onNavigate={handleNavigate}
            />

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
