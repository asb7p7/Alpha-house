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
            let errorMessage = 'Try-on service failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorMessage;
            } catch {
                errorMessage = await response.text();
            }

            console.error('Python API error:', response.status, errorMessage);
            return NextResponse.json(
                { detail: errorMessage },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Try-on proxy error:', error);
        return NextResponse.json(
            { detail: error instanceof Error ? error.message : 'Failed to connect to try-on service' },
            { status: 500 }
        );
    }
}
