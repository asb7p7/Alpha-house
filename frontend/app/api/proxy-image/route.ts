import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    try {
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return NextResponse.json({
            base64: `data:${contentType};base64,${base64}`
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }
}
