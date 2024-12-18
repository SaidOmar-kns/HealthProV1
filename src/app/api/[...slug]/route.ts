import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { encrypt, decrypt } from '@/components/DataEncryption';
import crypto from 'crypto';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const enableMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'true'; // Flag to enable mock data

const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
});

// Mock data
const mockData: any = {
    'users': [
        {
            '_id': 1,
            'uid': "9470wiopruewiur",
            'name': "Test User",
            'email': "test@email.com",
            'is_active': true,
        },
        {
            '_id': 2,
            'uid': "9470wiopruewiurre",
            'name': "John Doe",
            'email': "doe@email.com",
            'is_active': true,
        },

    ],
    'user': [
        {
            '_id': 1,
            'uid': "9470wiopruewiur",
            'name': "Test User",
            'email': "test@email.com",
            'is_active': true,
        },
        {
            '_id': 2,
            'uid': "9470wiopruewiurre",
            'name': "John Doe",
            'email': "doe@email.com",
            'is_active': true,
        },

    ],

};



function getMockResponse(endpoint: string, method: string, body?: any) {
    const parts = endpoint.split('/'); // Split the endpoint by "/"
    let currentData: any = mockData;


    // Handle Login
    if (endpoint === 'auth/login' && method === 'POST') {
        const { email, password } = body;

        // Simulated authentication logic
        const user = mockData.users.find(
            (user: any) => user.email.toLowerCase() === email.toLowerCase()
        );

        if (user && password === 'password123') {
            let logged_in_user = {
                message: 'Login successful',
                token: `mock-token-for-${email}`,
                user: user,
            };
            const response = JSON.stringify({ ...logged_in_user, code: 200 }, null, 2);
            return NextResponse.json(encrypt(response), { status: 200 });

        }
        const response = { error: 'Invalid username or password', code: 200 }
        return NextResponse.json(encrypt(response.toString()), { status: 200 });
    }

    // Traverse the mock data object
    for (const part of parts) {
        if (currentData[part] !== undefined) {
            currentData = currentData[part];
        } else if (currentData[parseInt(part)]) {
            // Handle numeric keys (e.g., "1" in "user/1")
            currentData = currentData[parseInt(part)];
        } else {
            return NextResponse.json({ error: `Invalid path: ${endpoint}` }, { status: 404 });
        }
    }

    // Handle GET method
    if (method === 'GET') {
        const response = { ...currentData, code: 200 }
        return NextResponse.json(encrypt(response.toString()), { status: 200 });
    }

    // Handle POST method
    if (method === 'POST') {
        if (Array.isArray(currentData)) {
            const newItem = { id: currentData.length + 1, ...body };
            currentData.push(newItem);

            const response = { ...currentData, code: 200, message: 'Item added successfully' }
            return NextResponse.json(encrypt(response.toString()), { status: 201 });

        }
        return NextResponse.json({ error: 'Cannot POST to this endpoint' }, { status: 400 });
    }

    // Handle PUT method
    if (method === 'PUT') {
        if (typeof currentData === 'object' && currentData.id) {
            Object.assign(currentData, body);
            const response = { ...currentData, code: 200, message: 'Item updated successfully' }
            return NextResponse.json(encrypt(response.toString()), { status: 200 });

        }
        return NextResponse.json({ error: 'Cannot PUT to this endpoint' }, { status: 400 });
    }

    // Handle DELETE method
    if (method === 'DELETE') {
        if (Array.isArray(currentData)) {
            const id = parseInt(parts[parts.length - 1]);
            const index = currentData.findIndex((item: any) => item.id === id);

            if (index > -1) {
                currentData.splice(index, 1);

                const response = { ...currentData, code: 200, message: 'Item deleted successfully' }
                return NextResponse.json(encrypt(response.toString()), { status: 200 });
            }

            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Cannot DELETE this endpoint' }, { status: 400 });
    }

    // Unsupported method
    return NextResponse.json({ error: `Method ${method} not supported` }, { status: 405 });
}





async function handleRequest(method: string, endpoint: string, body?: any, token?: string | null) {
    if (enableMock) {
        // Return mock data if enabled
        return getMockResponse(endpoint, method, body ? decrypt(body) : undefined);
    }

    try {
        const url = endpoint;
        let config: any;

        if (token) {
            config = {
                method,
                url,
                data: body ? decrypt(body) : undefined,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${decrypt(token)}` },
            };
        } else {
            config = {
                method,
                url,
                data: body ? decrypt(body) : undefined,
            };
        }

        const response = await api.request(config);

        if (method === 'DELETE') {
            return NextResponse.json({ message: `${endpoint} deleted successfully` }, { status: 204 });
        }

        return NextResponse.json(encrypt(response.data), { status: response.status });
    } catch (error) {
        console.error(`Error in ${method} ${endpoint}:`, error);
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            return NextResponse.json(
                { error: axiosError.message },
                { status: axiosError.response?.status || 500 }
            );
        }
        return NextResponse.json({ error: `Failed to process ${method} request for ${endpoint}` }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
    const token = request.cookies.get('authToken')?.value;
    const endpoint = params.slug.join('/');
    if (endpoint === 'csrf') {
        const csrfToken = crypto.randomBytes(32).toString('hex');
        const response = NextResponse.json({ csrfToken });
        response.cookies.set({
            name: 'csrfToken',
            value: csrfToken,
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        return response;
    } else {
        return handleRequest('GET', endpoint, undefined, token);
    }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
    const token = request.cookies.get('authToken')?.value;
    const endpoint = params.slug.join('/');
    const body = await request.json();
    return handleRequest('POST', endpoint, body, token);
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
    const token = request.cookies.get('authToken')?.value;
    const endpoint = params.slug.join('/');
    const body = await request.json();
    return handleRequest('PUT', endpoint, body, token);
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
    const token = request.cookies.get('authToken')?.value;
    const endpoint = params.slug.join('/');
    return handleRequest('DELETE', endpoint, undefined, token);
}
