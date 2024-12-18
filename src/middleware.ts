import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Helper function to check if the request is from our frontend
function isValidOrigin(request: NextRequest) {
    const referer = request.headers.get('referer')
    const origin = request.headers.get('origin')

    // Get allowed origins from environment variables
    const allowedOriginsString = process.env.ALLOWED_ORIGINS || ''
    const allowedOrigins = allowedOriginsString.split(',').map(origin => origin.trim())

    return allowedOrigins.some(allowed => referer?.startsWith(allowed) || origin === allowed)
}

// Helper function to return a 404 page
function return404Page() {
    return new NextResponse(
        '<html><body><h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p></body></html>',
        {
            status: 404,
            headers: { 'Content-Type': 'text/html' },
        }
    )
}

// Middleware function
export function middleware(request: NextRequest) {
    // Check if the request is for an API route
    if (request.nextUrl.pathname.startsWith('/api/')) {
        // For API routes, always check if the request is from a valid origin
        if (!isValidOrigin(request)) {
            console.log('Invalid origin detected for API route')
            return return404Page()
        }

        // For non-GET requests to API routes, perform CSRF validation
        if (request.method !== 'GET') {
            const csrfToken = request.headers.get('X-CSRF-Token')
            const storedToken = request.cookies.get('csrfToken')?.value
            if (!csrfToken || !storedToken || csrfToken !== storedToken) {
                console.log('CSRF validation failed for non-GET API request')
                return return404Page()
            }
        }
    }

    // If all checks pass, continue to the route
    return NextResponse.next()
}

// Configure the middleware to run on all routes
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}