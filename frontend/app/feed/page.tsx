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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] p-[2.5px] transform transition-transform active:scale-95 sm:hover:scale-110">
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
        <span className="text-xs font-medium max-w-[70px] text-[#1A1A1A] truncate">
            {profile.name}
        </span>
    </div>
));

ProfileStory.displayName = 'ProfileStory';

const ProductCard = memo<{ influProduct: InfluProduct }>(({ influProduct }) => (
    <article
        className="bg-white rounded-2xl overflow-hidden shadow-sm active:shadow-md sm:hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] sm:hover:-translate-y-1 border border-[#D4AF37]/20"
    >
        <header className="flex items-center gap-2 p-3 border-b border-gray-100">
            <img
                src={influProduct.influencer?.dp || "https://i.pravatar.cc/150?img=1"}
                alt={influProduct.influencer?.name || "Influencer"}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#D4AF37]"
                loading="lazy"
            />
            <span className="text-xs font-semibold text-[#1A1A1A] truncate flex-1">
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
            <p className="text-xs text-[#1A1A1A] line-clamp-2">
                {influProduct.name}
            </p>
            <Link
                href={`/products/${influProduct.id}`}
                className="block w-full py-2 bg-[#005834] text-white text-xs font-semibold rounded-full hover:bg-[#00442a] transition-all transform active:scale-95 sm:hover:scale-105 shadow-md text-center"
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
        <div className="flex flex-col h-screen bg-[#FFF8F0]">
            <header className="sticky top-0 z-50 px-4 py-3 bg-[#FFF8F0] border-b border-[#D4AF37]/10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] bg-white shadow-sm"
                        aria-label="User profile"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full px-4 py-2 bg-white text-gray-700 rounded-full text-sm border border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all shadow-sm"
                            aria-label="Search products"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" aria-hidden="true">
                            🔍
                        </span>
                    </div>
                </div>
            </header>

            <section className="px-4 py-4 bg-[#FFF8F0] border-b border-[#D4AF37]/10" aria-label="Influencer stories">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {profiles.map((profile) => (
                        <ProfileStory key={profile.id} profile={profile} />
                    ))}
                </div>
            </section>

            <main className="flex-1 overflow-y-auto scrollbar-hide bg-[#FFF8F0]">
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
