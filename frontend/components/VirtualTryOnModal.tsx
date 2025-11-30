import { useState, useRef } from "react";

interface VirtualTryOnModalProps {
    isOpen: boolean;
    onClose: () => void;
    productImage: string;
}

export function VirtualTryOnModal({ isOpen, onClose, productImage }: VirtualTryOnModalProps) {
    const [userImage, setUserImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result as string);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const convertUrlToBase64 = async (url: string): Promise<string> => {
        try {
            // Use our own proxy API to avoid CORS issues
            const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch image through proxy');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            return data.base64;
        } catch (error) {
            console.error("Error converting URL to base64:", error);
            throw new Error("Failed to process product image. Please try again.");
        }
    };

    const handleClose = () => {
        // Reset all states when closing the modal
        setGeneratedImage(null);
        setUserImage(null);
        setError(null);
        onClose();
    };

    const handleTryOn = async () => {
        if (!userImage) {
            setError("Please upload your photo first");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Convert product image URL to base64
            // Note: This might fail if the image server doesn't support CORS. 
            // In a real app, you might want to proxy this through your backend.
            // For now, we'll try to fetch it directly.
            const productBase64 = await convertUrlToBase64(productImage);

            // Extract base64 data (remove "data:image/jpeg;base64," prefix)
            const userImageBase64 = userImage.split(',')[1];
            const productImageBase64 = productBase64.split(',')[1];

            // Use our own proxy API to avoid CORS issues
            const response = await fetch('/api/try-on', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_image: userImageBase64,
                    clothing_image: productImageBase64,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate try-on image');
            }

            const data = await response.json();
            // The API returns the base64 string without prefix
            setGeneratedImage(`data:image/png;base64,${data.generated_image}`);
        } catch (err) {
            console.error("Try-on error:", err);
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-[#D4AF37]/10 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-[#1A1A1A]">Virtual Try-On</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Image Section */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-[#1A1A1A]">1. Your Photo</h3>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                                    relative aspect-[3/4] rounded-xl border-2 border-dashed border-[#D4AF37]/30 
                                    flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] hover:bg-[#F3E5AB]/10 
                                    transition-all overflow-hidden group
                                    ${!userImage ? 'bg-gray-50' : ''}
                                `}
                            >
                                {userImage ? (
                                    <>
                                        <img src={userImage} alt="User" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-medium">Change Photo</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm text-gray-500 font-medium">Click to upload photo</p>
                                        <p className="text-xs text-gray-400 mt-1">Full body shot works best</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Product Image Section */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-[#1A1A1A]">2. Product</h3>
                            <div className="aspect-[3/4] rounded-xl border border-[#D4AF37]/20 overflow-hidden bg-[#FFF8F0]">
                                <img src={productImage} alt="Product" className="w-full h-full object-contain p-4" />
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={handleTryOn}
                            disabled={!userImage || isLoading}
                            className={`
                                w-full md:w-auto px-8 py-3 rounded-full font-bold text-white shadow-lg
                                transition-all transform active:scale-95
                                ${!userImage || isLoading
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-[#D4AF37] hover:bg-[#C5A059] hover:shadow-lg'
                                }
                            `}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Magic...
                                </span>
                            ) : (
                                "Generate Try-On"
                            )}
                        </button>
                    </div>

                    {/* Result Section */}
                    {generatedImage && (
                        <div className="space-y-4 animate-fadeIn">
                            <h3 className="font-semibold text-[#1A1A1A] text-center text-xl">✨ Your Look</h3>
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 max-w-sm mx-auto">
                                <img src={generatedImage} alt="Generated Try-On" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex justify-center gap-4">
                                <a
                                    href={generatedImage}
                                    download="my-try-on.png"
                                    className="px-6 py-2 bg-[#1A1A1A] text-white rounded-full text-sm font-medium hover:bg-black transition-colors"
                                >
                                    Download Image
                                </a>
                                <button
                                    onClick={() => setGeneratedImage(null)}
                                    className="px-6 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-full text-sm font-medium hover:bg-[#F3E5AB]/10 transition-colors"
                                >
                                    Try Another
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
