"use client";

import { useState, useCallback, memo } from "react";
import { BottomNavigation } from "../../components/BottomNavigation";
import { useRouter } from "next/navigation";

interface LiveStream {
    id: string;
    influencer: {
        name: string;
        dp: string;
        username: string;
    };
    title: string;
    thumbnail: string;
    viewers: number;
    isLive: boolean;
    category: string;
}

// Mock data for live streams
const LIVE_STREAMS: LiveStream[] = [
    {
        id: "1",
        influencer: {
            name: "Sarah Johnson",
            dp: "https://i.pravatar.cc/150?img=5",
            username: "@sarahstyle"
        },
        title: "Summer Fashion Haul 2024 🌸",
        thumbnail: "/images/streaming/steam1.jpg",
        viewers: 1243,
        isLive: true,
        category: "Fashion Haul"
    },
    {
        id: "2",
        influencer: {
            name: "Emma Davis",
            dp: "https://i.pravatar.cc/150?img=9",
            username: "@emmaglam"
        },
        title: "Makeup & Outfit Styling Session ✨",
        thumbnail: "/images/streaming/steam2.jpg",
        viewers: 892,
        isLive: true,
        category: "Beauty & Style"
    },
    {
        id: "3",
        influencer: {
            name: "Alex Chen",
            dp: "https://i.pravatar.cc/150?img=12",
            username: "@alexstreet"
        },
        title: "Street Style Try-On Session 👟",
        thumbnail: "/images/streaming/steam3.jpg",
        viewers: 2156,
        isLive: true,
        category: "Streetwear"
    },
    {
        id: "4",
        influencer: {
            name: "Maya Patel",
            dp: "https://i.pravatar.cc/150?img=16",
            username: "@mayachic"
        },
        title: "Vintage Thrift Store Finds 🛍️",
        thumbnail: "/images/streaming/steam4.jpg",
        viewers: 567,
        isLive: true,
        category: "Vintage"
    },
    {
        id: "5",
        influencer: {
            name: "James Wilson",
            dp: "https://i.pravatar.cc/150?img=13",
            username: "@jamesfits"
        },
        title: "Activewear & Fitness Style Guide 💪",
        thumbnail: "/images/streaming/stream5.jpg",
        viewers: 1678,
        isLive: true,
        category: "Activewear"
    },
    {
        id: "6",
        influencer: {
            name: "Sophia Lee",
            dp: "https://i.pravatar.cc/150?img=20",
            username: "@sophialux"
        },
        title: "Designer Bag Unboxing & Review 👜",
        thumbnail: "/images/streaming/stream6.jpg",
        viewers: 3421,
        isLive: true,
        category: "Luxury Fashion"
    }
];

interface ChatMessage {
    id: string;
    username: string;
    message: string;
    timestamp: Date;
}

const LiveStreamCard = memo<{ stream: LiveStream; onClick: () => void }>(({ stream, onClick }) => (
    <article
        onClick={onClick}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group border border-[#D4AF37]/20"
    >
        {/* Thumbnail with Live Badge */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
            <img
                src={stream.thumbnail}
                alt={stream.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
            />

            {/* Live Badge */}
            {stream.isLive && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <span className="text-xs font-bold uppercase tracking-wide">LIVE</span>
                </div>
            )}

            {/* Viewers Count */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
                {stream.viewers.toLocaleString()}
            </div>

            {/* Category Tag */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                {stream.category}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Stream Info */}
        <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                    <img
                        src={stream.influencer.dp}
                        alt={stream.influencer.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#D4AF37]"
                        loading="lazy"
                    />
                    {stream.isLive && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                        {stream.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">
                        {stream.influencer.name}
                    </p>
                    <p className="text-xs text-gray-400">
                        {stream.influencer.username}
                    </p>
                </div>
            </div>

            <button className="w-full py-2.5 bg-[#005834] text-white text-sm font-bold rounded-full hover:bg-[#00442a] transition-all transform active:scale-95 hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
                Join Stream
            </button>
        </div>
    </article>
));

LiveStreamCard.displayName = 'LiveStreamCard';

const LiveStreamModal = memo<{ stream: LiveStream | null; onClose: () => void }>(({ stream, onClose }) => {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: "1", username: "fashionlover23", message: "This look is amazing! 😍", timestamp: new Date() },
        { id: "2", username: "styleking", message: "Where did you get that jacket?", timestamp: new Date() },
        { id: "3", username: "trendywear", message: "You're so inspiring!", timestamp: new Date() },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(true);

    const handleSendMessage = useCallback(() => {
        if (newMessage.trim()) {
            setChatMessages(prev => [...prev, {
                id: Date.now().toString(),
                username: "you",
                message: newMessage,
                timestamp: new Date()
            }]);
            setNewMessage("");
        }
    }, [newMessage]);

    const toggleChat = useCallback(() => {
        setIsChatOpen(prev => !prev);
    }, []);

    if (!stream) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-3">
                            <img
                                src={stream.influencer.dp}
                                alt={stream.influencer.name}
                                className="w-10 h-10 rounded-full ring-2 ring-white"
                            />
                            <div>
                                <h3 className="text-white font-bold text-sm">{stream.influencer.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 bg-red-600 px-2 py-0.5 rounded-full">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                        <span className="text-white text-xs font-bold">LIVE</span>
                                    </div>
                                    <span className="text-white text-xs">{stream.viewers.toLocaleString()} viewers</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="px-4 py-2 bg-[#D4AF37] text-white rounded-full text-sm font-bold hover:bg-[#C5A059] transition-colors">
                        Follow
                    </button>
                </div>
            </div>

            {/* Video Area */}
            <div className="w-full h-full flex items-center justify-center">
                <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Chat Toggle Button (visible when chat is closed) */}
            {!isChatOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-4 left-4 md:left-4 w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full shadow-lg hover:shadow-pink-500/50 hover:scale-110 transition-all flex items-center justify-center z-20"
                    aria-label="Open chat"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                </button>
            )}

            {/* Chat Overlay */}
            {isChatOpen && (
                <div className="absolute bottom-0 left-0 right-0 md:right-auto md:bottom-4 md:left-4 md:w-96 bg-black/80 md:bg-black/90 backdrop-blur-lg md:rounded-2xl overflow-hidden transition-all duration-300">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h4 className="text-white font-bold flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                            </svg>
                            Live Chat
                        </h4>
                        <button
                            onClick={toggleChat}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            aria-label="Close chat"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    <div className="h-48 md:h-64 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {chatMessages.map(msg => (
                            <div key={msg.id} className="text-sm">
                                <span className="font-bold text-pink-400">{msg.username}: </span>
                                <span className="text-white">{msg.message}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-white/10">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Say something nice..."
                                className="flex-1 px-4 py-2 bg-white/10 text-white placeholder-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold hover:from-pink-600 hover:to-rose-600 transition-all"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

LiveStreamModal.displayName = 'LiveStreamModal';

export default function StreamingPage() {
    const [activeTab, setActiveTab] = useState("streaming");
    const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
    const router = useRouter();

    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab);
        if (tab === 'home') {
            router.push('/feed');
        }
    }, [router]);

    const handleNavigate = useCallback((path: string) => {
        router.push(path);
    }, [router]);

    const handleStreamClick = useCallback((stream: LiveStream) => {
        setSelectedStream(stream);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedStream(null);
    }, []);

    return (
        <div className="flex flex-col h-screen bg-[#FFF8F0]">
            {/* Header */}
            <header className="sticky top-0 z-40 px-4 py-4 bg-[#FFF8F0]/80 backdrop-blur-lg border-b border-[#D4AF37]/10 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
                            <svg className="w-8 h-8 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3" />
                            </svg>
                            Live Streaming
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">Join influencers live now</p>
                    </div>
                    <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-red-600">{LIVE_STREAMS.length} Live Now</span>
                    </div>
                </div>
            </header>

            {/* Live Streams Grid */}
            <main className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {LIVE_STREAMS.map((stream) => (
                        <LiveStreamCard
                            key={stream.id}
                            stream={stream}
                            onClick={() => handleStreamClick(stream)}
                        />
                    ))}
                </div>

                {LIVE_STREAMS.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📺</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Live Streams</h3>
                        <p className="text-gray-500">Check back soon for live content!</p>
                    </div>
                )}
            </main>

            {/* Bottom Navigation */}
            <BottomNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onNavigate={handleNavigate}
            />

            {/* Live Stream Modal */}
            <LiveStreamModal stream={selectedStream} onClose={handleCloseModal} />

            <style jsx global>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}
