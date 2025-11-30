import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Forward the request to the Python service
        const response = await fetch('http://localhost:8001/try-on/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Python API error:', response.status, errorText);
            return NextResponse.json(
                { error: `Try-on service failed: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Try-on proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to try-on service' },
            { status: 500 }
        );
    }
}
