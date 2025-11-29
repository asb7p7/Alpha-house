const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Influencer {
    id: number;
    name: string;
    desc: string;
    dp: string;
    created_at: string;
    updated_at: string;
}

export interface InfluProduct {
    id: number;
    influ_id: number;
    poster: string;
    name: string;
    created_at: string;
    updated_at: string;
    influencer?: Influencer;
}

export interface Product {
    id: number;
    influ_product_id: number;
    image: string;
    description: string;
    price: number;
    like: number;
    name: string;
    created_at: string;
    updated_at: string;
    influ_product?: InfluProduct;
}

interface ApiResponse<T> {
    data: T;
    success: boolean;
}

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        });

        if (!response.ok) {
            throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<T> = await response.json();
        return result.data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function getProfiles(): Promise<Influencer[]> {
    try {
        return await fetchApi<Influencer[]>('/profiles');
    } catch (error) {
        console.error("Error fetching profiles:", error);
        return [];
    }
}

export async function getInfluProducts(): Promise<InfluProduct[]> {
    try {
        return await fetchApi<InfluProduct[]>('/influ-products');
    } catch (error) {
        console.error("Error fetching influ-products:", error);
        return [];
    }
}

export async function getProductsByInfluProductId(
    influProductId: number
): Promise<Product[]> {
    try {
        return await fetchApi<Product[]>(`/products/${influProductId}`);
    } catch (error) {
        console.error(`Error fetching products for influencer product ${influProductId}:`, error);
        return [];
    }
}

export async function getProductById(productId: number): Promise<Product | null> {
    try {
        return await fetchApi<Product>(`/product/${productId}`);
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return null;
    }
}
